import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import { createSupabaseContext } from "npm:@supabase/server@1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders });
}

function b64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  return hex(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message))));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sendCode(to: string, code: string) {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const from = Deno.env.get("MFA_EMAIL_FROM");
  if (!apiKey || !from) throw new Error("EMAIL_PROVIDER_NOT_CONFIGURED");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Votre code de sécurité — الثانوية الافتراضية",
      text: `Votre code de vérification est : ${code}\nIl expire dans 5 minutes. Ne le communiquez à personne.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px;color:#172033"><h2>رمز التحقق الأمني</h2><p>Votre code de vérification :</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:18px;background:#f1f5f9;border-radius:12px;text-align:center">${code}</div><p>Ce code expire dans 5 minutes. Ne le communiquez à personne.</p></div>`,
    }),
  });
  if (!response.ok) throw new Error("EMAIL_DELIVERY_FAILED");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json(405, { ok: false, error: "METHOD_NOT_ALLOWED" });

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return json(401, { ok: false, error: "AUTH_REQUIRED" });

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anonKey) {
    return json(503, { ok: false, error: "SERVER_CONFIGURATION_INCOMPLETE" });
  }

  const userClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: userData, error: userError } = await userClient.auth.getUser(token);
  if (userError || !userData.user) return json(401, { ok: false, error: "INVALID_SESSION" });

  const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
  if (claimsError || !claimsData?.claims?.session_id) return json(401, { ok: false, error: "INVALID_SESSION_CLAIMS" });

  const user = userData.user;
  const sessionId = String(claimsData.claims.session_id);
  const email = user.email;
  if (!email || !user.email_confirmed_at) return json(403, { ok: false, error: "VERIFIED_EMAIL_REQUIRED" });

  // Build the privileged client through Supabase's supported Edge Function context.
  // Secret API keys are not JWTs and must never be sent as Authorization: Bearer.
  const { data: supabaseContext, error: contextError } = await createSupabaseContext(req, { auth: "user" });
  if (contextError || !supabaseContext?.supabaseAdmin) {
    console.error("MFA admin context unavailable", contextError?.message ?? "missing admin client");
    return json(503, { ok: false, error: "SERVER_CONFIGURATION_INCOMPLETE" });
  }
  const admin = supabaseContext.supabaseAdmin;
  const { data: profile, error: profileError } = await admin.from("profiles")
    .select("role").eq("id", user.id).maybeSingle();
  if (profileError) return json(500, { ok: false, error: "PROFILE_LOOKUP_FAILED" });
  if (!profile) return json(403, { ok: false, error: "PROFILE_REQUIRED" });
  const isStudent = profile.role === "eleve";
  const isExemptRole = ["prof", "admin", "parent"].includes(profile.role);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json(400, { ok: false, error: "INVALID_JSON" });
  }

  const action = body.action;
  if (action === "status") {
    if (!isStudent && !isExemptRole) {
      return json(403, { ok: false, error: "PROFILE_ROLE_NOT_ALLOWED" });
    }
    if (!isStudent) {
      return json(200, {
        ok: true,
        contractVersion: 1,
        required: false,
        enrolled: false,
        verified: false,
        verifiedUntil: null,
        emailMasked: email.replace(/^(.{1,2}).*(@.*)$/, "$1•••$2"),
      });
    }
    const [factorResult, verifiedResult] = await Promise.all([
      admin.from("mfa_email_factors").select("enabled_at").eq("user_id", user.id).maybeSingle(),
      admin.from("mfa_email_sessions").select("verified_at,expires_at")
        .eq("user_id", user.id).eq("session_id", sessionId).gt("expires_at", new Date().toISOString()).maybeSingle(),
    ]);
    if (factorResult.error || verifiedResult.error) {
      return json(500, { ok: false, error: "STATUS_LOOKUP_FAILED" });
    }
    return json(200, {
      ok: true,
      contractVersion: 1,
      required: isStudent,
      enrolled: !!factorResult.data,
      verified: !!verifiedResult.data,
      verifiedUntil: verifiedResult.data?.expires_at ?? null,
      emailMasked: email.replace(/^(.{1,2}).*(@.*)$/, "$1•••$2"),
    });
  }

  if (action === "start") {
    if (!isStudent) return json(403, { ok: false, error: "STUDENT_MFA_ONLY" });
    const purpose = body.purpose;
    if (purpose !== "enroll" && purpose !== "login") return json(400, { ok: false, error: "INVALID_PURPOSE" });
    const { data: factor, error: factorError } = await admin.from("mfa_email_factors")
      .select("user_id").eq("user_id", user.id).maybeSingle();
    if (factorError) return json(500, { ok: false, error: "STORAGE_ERROR" });
    if (purpose === "enroll" && factor) return json(409, { ok: false, error: "ALREADY_ENROLLED" });
    if (purpose === "login" && !factor) return json(403, { ok: false, error: "NOT_ENROLLED" });

    const pepper = Deno.env.get("MFA_EMAIL_PEPPER");
    if (!pepper || pepper.length < 32 || !Deno.env.get("RESEND_API_KEY") || !Deno.env.get("MFA_EMAIL_FROM")) {
      return json(503, { ok: false, error: "EMAIL_FACTOR_NOT_CONFIGURED" });
    }

    const challengeId = crypto.randomUUID();
    const codeBytes = crypto.getRandomValues(new Uint8Array(4));
    const number = ((codeBytes[0] << 24) | (codeBytes[1] << 16) | (codeBytes[2] << 8) | codeBytes[3]) >>> 0;
    const code = String(number % 1_000_000).padStart(6, "0");
    const digest = await hmacHex(pepper, `${user.id}:${sessionId}:${challengeId}:${code}`);
    const { data: issue, error: issueError } = await admin.rpc("mfa_email_issue_challenge", {
      p_challenge_id: challengeId,
      p_user_id: user.id,
      p_session_id: sessionId,
      p_purpose: purpose,
      p_code_hash: `\\x${digest}`,
    });
    if (issueError) return json(500, { ok: false, error: "CHALLENGE_STORAGE_FAILED" });
    if (issue !== "ok") return json(429, { ok: false, error: issue === "cooldown" ? "PLEASE_WAIT" : "RATE_LIMITED" });

    try {
      await sendCode(email, code);
    } catch (error) {
      console.error("MFA email delivery unavailable", error instanceof Error ? error.message : "unknown");
      return json(503, { ok: false, error: "EMAIL_DELIVERY_UNAVAILABLE" });
    }
    return json(200, { ok: true, challengeId, expiresIn: 300, destination: email.replace(/^(.{1,2}).*(@.*)$/, "$1•••$2") });
  }

  if (action === "verify") {
    if (!isStudent) return json(403, { ok: false, error: "STUDENT_MFA_ONLY" });
    const challengeId = typeof body.challengeId === "string" ? body.challengeId : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    if (!/^[0-9a-f-]{36}$/i.test(challengeId) || !/^\d{6}$/.test(code)) {
      return json(400, { ok: false, error: "INVALID_CODE_FORMAT" });
    }
    const pepper = Deno.env.get("MFA_EMAIL_PEPPER");
    if (!pepper || pepper.length < 32) {
      return json(503, { ok: false, error: "EMAIL_FACTOR_NOT_CONFIGURED" });
    }
    const digest = await hmacHex(pepper, `${user.id}:${sessionId}:${challengeId}:${code}`);
    const { data: consumed, error: consumeError } = await admin.rpc("mfa_email_consume_challenge", {
      p_challenge_id: challengeId,
      p_user_id: user.id,
      p_session_id: sessionId,
      p_code_hash: `\\x${digest}`,
    });
    if (consumeError) return json(500, { ok: false, error: "CHALLENGE_VERIFY_FAILED" });
    const result = Array.isArray(consumed) ? consumed[0] : consumed;
    if (!result?.ok) return json(400, { ok: false, error: result?.reason ?? "INVALID_CODE" });

    if (result.purpose === "enroll") {
      const { error: factorError } = await admin.from("mfa_email_factors")
        .upsert({ user_id: user.id }, { onConflict: "user_id" });
      if (factorError) return json(500, { ok: false, error: "ENROLLMENT_FAILED" });
      const { error: sessionError } = await admin.from("mfa_email_sessions").upsert({
        user_id: user.id,
        session_id: sessionId,
        verified_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: "user_id,session_id" });
      if (sessionError) return json(500, { ok: false, error: "ENROLLMENT_SESSION_FAILED" });
    } else if (result.purpose === "login") {
      const { error } = await admin.from("mfa_email_sessions").upsert({
        user_id: user.id,
        session_id: sessionId,
        verified_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      }, { onConflict: "user_id,session_id" });
      if (error) return json(500, { ok: false, error: "SESSION_VERIFICATION_FAILED" });
    } else {
      return json(400, { ok: false, error: "INVALID_CHALLENGE_PURPOSE" });
    }
    return json(200, { ok: true, purpose: result.purpose });
  }

  if (action === "disable") {
    // The institution requires e-mail MFA for every student account.
    // Self-service unenrollment would bypass the mandatory login gate.
    return json(403, { ok: false, error: "EMAIL_FACTOR_REQUIRED" });
  }

  return json(400, { ok: false, error: "UNKNOWN_ACTION" });
});

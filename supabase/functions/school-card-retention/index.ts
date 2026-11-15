import { createClient } from "npm:@supabase/supabase-js@2";

const BUCKET = "cartes-scolaires";
const RETENTION_DAYS = 30;
const MAX_BATCH = 100;

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return Response.json({ error: "method_not_allowed" }, { status: 405 });
  const suppliedSecret = req.headers.get("x-school-card-retention") || "";
  if (!suppliedSecret || suppliedSecret.length < 32) return Response.json({ error: "unauthorized" }, { status: 401 });
  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    console.error("retention_env_missing");
    return Response.json({ error: "server_configuration_error" }, { status: 500 });
  }
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const auth = await admin.rpc("school_card_retention_secret_valid", { p_secret: suppliedSecret });
  if (auth.error || auth.data !== true) return Response.json({ error: "unauthorized" }, { status: 401 });

  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400000).toISOString();
  const { data: rows, error } = await admin.from("profiles")
    .select("id,verif_statut,verif_at,carte_scolaire_path")
    .in("verif_statut", ["verifie", "rejete"])
    .lte("verif_at", cutoff)
    .not("carte_scolaire_path", "is", null)
    .order("verif_at", { ascending: true })
    .limit(MAX_BATCH);
  if (error) return Response.json({ error: "query_failed" }, { status: 500 });

  let deleted = 0, failed = 0, held = 0;
  const failures: Array<{ profile_id: string; stage: string }> = [];
  for (const row of rows || []) {
    const hold = await admin.rpc("school_card_retention_is_held", { p_profile_id: row.id });
    if (hold.error) {
      failed++;
      failures.push({ profile_id: row.id, stage: "hold_check" });
      continue;
    }
    if (hold.data === true) { held++; continue; }
    const path = String(row.carte_scolaire_path || "");
    if (!path || !path.startsWith(row.id + "/")) {
      failed++;
      failures.push({ profile_id: row.id, stage: "invalid_path" });
      continue;
    }
    const removal = await admin.storage.from(BUCKET).remove([path]);
    if (removal.error) {
      failed++;
      failures.push({ profile_id: row.id, stage: "storage_remove" });
      continue;
    }
    const cleared = await admin.rpc("school_card_retention_clear_path", { p_profile_id: row.id, p_expected_path: path });
    if (cleared.error || cleared.data !== true) {
      failed++;
      failures.push({ profile_id: row.id, stage: "clear_profile_reference" });
      continue;
    }
    deleted++;
  }
  console.log("school_card_retention_completed", { scanned: (rows || []).length, deleted, held, failed, cutoff });
  return Response.json({ ok: failed === 0, scanned: (rows || []).length, deleted, held, failed, has_more: (rows || []).length === MAX_BATCH, failures });
});

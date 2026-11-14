import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

const apiUrl = process.env.API_URL;
const anonKey = process.env.ANON_KEY;
const serviceRoleKey = process.env.SERVICE_ROLE_KEY;
for (const [name, value] of Object.entries({ API_URL: apiUrl, ANON_KEY: anonKey, SERVICE_ROLE_KEY: serviceRoleKey })) {
  assert.ok(value, `Missing local Supabase environment variable: ${name}`);
}

const password = "Local-Messenger-Test-Only-2026!";
const headers = (key, bearer = key) => ({
  apikey: key,
  Authorization: `Bearer ${bearer}`,
  "Content-Type": "application/json",
});

async function call(path, { method = "GET", key = anonKey, bearer = key, body, expected = true } = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers: headers(key, bearer),
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const raw = await response.text();
  if (expected && !response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${raw}`);
  }
  if (!expected) {
    assert.equal(response.ok, false, `${method} ${path} unexpectedly succeeded: ${raw}`);
    return { status: response.status, body: raw };
  }
  return raw ? JSON.parse(raw) : null;
}

async function createUser(label) {
  const email = `messenger-${label}@example.test`;
  const created = await call("/auth/v1/admin/users", {
    method: "POST",
    key: serviceRoleKey,
    bearer: serviceRoleKey,
    body: { email, password, email_confirm: true },
  });
  assert.ok(created.id, "Auth Admin did not return a user id");
  const profile = await call("/rest/v1/profiles", {
    method: "POST",
    key: serviceRoleKey,
    bearer: serviceRoleKey,
    body: [{
      id: created.id,
      role: "eleve",
      verif_statut: "verifie",
      pseudo: `Test-${label}`,
      wilaya: "34",
      niveau: "2AS",
      filiere: "Sciences",
    }],
  });
  void profile;
  const session = await call("/auth/v1/token?grant_type=password", {
    method: "POST",
    body: { email, password },
  });
  assert.ok(session.access_token, "GoTrue did not issue a signed access token");
  return { id: created.id, token: session.access_token };
}

const sender = await createUser("sender");
const recipient = await createUser("recipient");
const observer = await createUser("observer");

 
// Vérification du transport WebSocket Realtime : le destinataire reçoit en direct
// une nouvelle invitation créée par l'expéditeur, avec son JWT GoTrue propre.
async function subscribeToInviteChanges(user) {
  assert.equal(typeof WebSocket, "function", "Node 22 WebSocket global is unavailable");
  const wsUrl = `ws://127.0.0.1:54321/realtime/v1/websocket?apikey=${encodeURIComponent(anonKey)}&vsn=2.0.0`;
  const socket = new WebSocket(wsUrl);
  let joinRef = "1";
  let messageRef = 1;
  let resolveReady;
  let rejectReady;
  let resolveEvent;
  let rejectEvent;
  let ready = false;
  let joinAcknowledged = false;
  let cdcReady = false;
  const receivedFrames = [];
  let joinPostgresChanges = null;
  const postgresSystemFrames = [];
  const maybeResolveReady = () => {
    if (joinAcknowledged && cdcReady && !ready) {
      ready = true;
      resolveReady();
    }
  };
  const readyPromise = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
  const eventPromise = new Promise((resolve, reject) => { resolveEvent = resolve; rejectEvent = reject; });
  const timeout = setTimeout(() => {
    if (!ready) rejectReady(new Error("Realtime Postgres Changes subscription did not become CDC-ready within 12 seconds; join ACK: " + JSON.stringify(joinPostgresChanges) + "; system frames: " + JSON.stringify(postgresSystemFrames)));
    else {
      const lateProbe = spawnSync("psql", [
        process.env.DB_URL,
        "-X", "-A", "-t", "-v", "ON_ERROR_STOP=1",
        "-c",
        "select jsonb_build_object('subscription_id', subscription_id, 'entity', entity::text, 'filters', filters, 'claims_role', claims_role::text, 'action_filter', action_filter)::text from realtime.subscription where entity = 'public.msg_invites'::regclass;"
      ], { encoding: "utf8" });
      const diagnostic = lateProbe.status === 0
        ? (lateProbe.stdout.trim() || "(aucune ligne après attente)")
        : (lateProbe.stderr || lateProbe.error?.message || "psql failed");
      rejectEvent(new Error("No msg_invites INSERT event received within 12 seconds; join postgres_changes: " + JSON.stringify(joinPostgresChanges) + "; postgres_changes system frames: " + JSON.stringify(postgresSystemFrames) + "; CDC rows after wait: " + diagnostic + "; received frames: " + JSON.stringify(receivedFrames)));
    }
  }, 12000);
  socket.addEventListener("open", () => {
    socket.send(JSON.stringify([
      joinRef,
      String(messageRef++),
      "realtime:msg-invites-local-" + user.id,
      "phx_join",
      {
        config: {
          broadcast: { ack: false, self: false },
          presence: { key: "" },
          postgres_changes: [{ event: "*", schema: "public", table: "msg_invites" }]
        },
        access_token: user.token,
        version: "1.0.0"
      }
    ]));
  });
  socket.addEventListener("message", (event) => {
    try {
      const rawFrame = String(event.data);
      const frame = JSON.parse(rawFrame);
      receivedFrames.push(rawFrame.slice(0, 1600));
      if (receivedFrames.length > 12) receivedFrames.shift();
      if (!Array.isArray(frame) || frame.length < 5) return;
      const topic = frame[2];
      const eventName = frame[3];
      const payload = frame[4] || {};
      if (topic !== "realtime:msg-invites-local-" + user.id) return;
      if (eventName === "phx_reply") {
        if (payload.status === "ok") {
          joinPostgresChanges = payload.response?.postgres_changes ?? null;
          if (!Array.isArray(joinPostgresChanges) || !joinPostgresChanges.some((change) =>
            change.schema === "public" && change.table === "msg_invites"
          )) {
            rejectReady(new Error("Realtime phx_join acknowledged without the expected public.msg_invites subscription: " + JSON.stringify(payload.response || payload)));
            return;
          }
          joinAcknowledged = true;
          maybeResolveReady();
        } else {
          rejectReady(new Error("Realtime join rejected: " + JSON.stringify(payload.response || payload)));
        }
      }
      if (eventName === "system" && payload.extension === "postgres_changes") {
        postgresSystemFrames.push(payload);
        if (postgresSystemFrames.length > 8) postgresSystemFrames.shift();
        if (payload.status === "ok") {
          cdcReady = true;
          maybeResolveReady();
        } else if (payload.status === "error" || payload.status === "timeout") {
          rejectReady(new Error("Realtime Postgres Changes subscription reported " + payload.status + ": " + JSON.stringify(payload)));
        }
      }
      if (eventName === "postgres_changes") {
        const data = payload.data || payload;
        const record = data.record || data.new || payload.record || payload.new || {};
        const changeType = data.type || data.eventType || payload.eventType;
        if ((!changeType || String(changeType).toUpperCase() === "INSERT") &&
            record.recipient_id === user.id && record.status === "pending") {
          resolveEvent({ changeType: changeType || "INSERT", record });
        }
      }
      if (eventName === "phx_error" || eventName === "phx_close") {
        const error = new Error("Realtime channel closed: " + JSON.stringify(payload));
        if (!ready) rejectReady(error); else rejectEvent(error);
      }
    } catch (error) {
      rejectEvent(error);
    }
  });
  socket.addEventListener("error", () => {
    const error = new Error("Realtime WebSocket transport error");
    if (!ready) rejectReady(error); else rejectEvent(error);
  });
  try {
    await readyPromise;
    // Diagnostic non secret pendant que le canal est réellement actif :
    // vérifier que Realtime a enregistré la souscription CDC sur la table attendue.
    const subscriptionProbe = spawnSync("psql", [
      process.env.DB_URL,
      "-X", "-A", "-t", "-v", "ON_ERROR_STOP=1",
      "-c",
      "select jsonb_build_object('subscription_id', subscription_id, 'entity', entity::text, 'filters', filters, 'claims_role', claims_role::text, 'action_filter', action_filter)::text from realtime.subscription where entity = 'public.msg_invites'::regclass;"
    ], { encoding: "utf8" });
    if (subscriptionProbe.error || subscriptionProbe.status !== 0) {
      throw new Error("Impossible d'inspecter realtime.subscription : " + (subscriptionProbe.stderr || subscriptionProbe.error?.message || "psql failed"));
    }
    console.log("Realtime CDC subscriptions for public.msg_invites:", subscriptionProbe.stdout.trim() || "(aucune ligne)");
    return {
      waitForInvite: () => eventPromise,
      close: () => { clearTimeout(timeout); socket.close(); }
    };
  } catch (error) {
    clearTimeout(timeout);
    socket.close();
    throw error;
  }
}

const realtimeObserver = await subscribeToInviteChanges(observer);
try {
  const realtimeInvite = await call("/rest/v1/rpc/msg_invite_send", {
    method: "POST",
    bearer: sender.token,
    body: { p_recipient: observer.id },
  });
  const realtimeServiceRow = await call(
    `/rest/v1/msg_invites?select=id,sender_id,recipient_id,status&id=eq.${realtimeInvite}`,
    { key: serviceRoleKey, bearer: serviceRoleKey },
  );
  assert.equal(realtimeServiceRow.length, 1, "Invitation RPC did not persist a row visible to service_role");
  assert.equal(realtimeServiceRow[0].recipient_id, observer.id);
  const realtimeRecipientRow = await call(
    `/rest/v1/msg_invites?select=id,recipient_id,status&id=eq.${realtimeInvite}`,
    { bearer: observer.token },
  );
  assert.equal(realtimeRecipientRow.length, 1, "Recipient RLS cannot read its own pending invitation");
  const realtimeEvent = await realtimeObserver.waitForInvite();
  assert.equal(realtimeEvent.record.id, realtimeInvite, "Realtime event did not match the created invitation");
  assert.equal(realtimeEvent.record.sender_id, sender.id);
  const realtimeCancelled = await call("/rest/v1/rpc/msg_invite_cancel", {
    method: "POST",
    bearer: sender.token,
    body: { p_invite: realtimeInvite },
  });
  assert.equal(realtimeCancelled, true, "Could not clean up the synthetic Realtime invitation");
} finally {
  realtimeObserver.close();
}

const invite = await call("/rest/v1/rpc/msg_invite_send", {
  method: "POST",
  bearer: sender.token,
  body: { p_recipient: recipient.id },
});
assert.match(invite, /^[0-9a-f-]{36}$/i, "Invitation RPC did not return a UUID");

const pending = await call(`/rest/v1/msg_invites?select=id,status&id=eq.${invite}`, {
  bearer: sender.token,
});
assert.equal(pending.length, 1);
assert.equal(pending[0].status, "pending");

const beforeConsent = await call("/rest/v1/msg_conversations?select=id,type&type=eq.direct", {
  bearer: sender.token,
});
assert.equal(beforeConsent.length, 0, "A direct conversation was created before recipient consent");

const senderCannotAccept = await call("/rest/v1/rpc/msg_invite_accept", {
  method: "POST",
  bearer: sender.token,
  body: { p_invite: invite },
  expected: false,
});
assert.ok(senderCannotAccept.status >= 400);

const acceptedConversationId = await call("/rest/v1/rpc/msg_invite_accept", {
  method: "POST",
  bearer: recipient.token,
  body: { p_invite: invite },
});
assert.ok(acceptedConversationId, "Recipient acceptance did not create a direct conversation");

const recipientConversations = await call(
  `/rest/v1/msg_conversations?select=id,type&id=eq.${acceptedConversationId}&type=eq.direct`,
  { bearer: recipient.token },
);
assert.equal(recipientConversations.length, 1, "Recipient cannot read the accepted direct conversation");

const members = await call(
  `/rest/v1/msg_members?select=user_id&conversation_id=eq.${acceptedConversationId}`,
  { bearer: recipient.token },
);
assert.deepEqual(new Set(members.map((member) => member.user_id)), new Set([sender.id, recipient.id]));

const senderConversations = await call(
  `/rest/v1/msg_conversations?select=id,type&id=eq.${acceptedConversationId}&type=eq.direct`,
  { bearer: sender.token },
);
assert.equal(senderConversations.length, 1, "Sender cannot read the conversation after consent");

const accepted = await call(`/rest/v1/msg_invites?select=status&id=eq.${invite}`, {
  bearer: recipient.token,
});
assert.equal(accepted[0]?.status, "accepted");

// La recherche ne retourne que les champs publics prévus et reste limitée au profil scolaire.
const discovered = await call("/rest/v1/rpc/msg_student_search", {
  method: "POST",
  bearer: sender.token,
  body: { p_query: "Test", p_limit: 12 },
});
assert.ok(Array.isArray(discovered));
assert.ok(discovered.some((student) => student.student_id === recipient.id));
assert.ok(discovered.some((student) => student.student_id === observer.id));
assert.ok(discovered.every((student) =>
  Object.keys(student).sort().join(",") === "filiere,niveau,pseudo,student_id,wilaya"
), "Discovery RPC returned fields outside the minimal public contract");

// Un troisième compte non participant ne doit pas pouvoir lire une invitation.
const cancelInvite = await call("/rest/v1/rpc/msg_invite_send", {
  method: "POST",
  bearer: sender.token,
  body: { p_recipient: observer.id },
});
const observerCannotRead = await call(
  `/rest/v1/msg_invites?select=id,status&id=eq.${cancelInvite}`,
  { bearer: recipient.token },
);
assert.equal(observerCannotRead.length, 0, "A non-participant can read another pair's invitation");

// Le destinataire ne peut pas annuler l'invitation sortante ; seul l'expéditeur peut.
const recipientCannotCancel = await call("/rest/v1/rpc/msg_invite_cancel", {
  method: "POST",
  bearer: observer.token,
  body: { p_invite: cancelInvite },
});
assert.equal(recipientCannotCancel, false, "Recipient unexpectedly cancelled sender's invitation");
const senderCancelled = await call("/rest/v1/rpc/msg_invite_cancel", {
  method: "POST",
  bearer: sender.token,
  body: { p_invite: cancelInvite },
});
assert.equal(senderCancelled, true, "Sender could not cancel their pending invitation");
const cancelledState = await call(
  `/rest/v1/msg_invites?select=status&id=eq.${cancelInvite}`,
  { bearer: sender.token },
);
assert.equal(cancelledState[0]?.status, "cancelled");

// L'expéditeur ne peut pas refuser à la place du destinataire ; le destinataire le peut.
const declineInvite = await call("/rest/v1/rpc/msg_invite_send", {
  method: "POST",
  bearer: sender.token,
  body: { p_recipient: observer.id },
});
const senderCannotDecline = await call("/rest/v1/rpc/msg_invite_decline", {
  method: "POST",
  bearer: sender.token,
  body: { p_invite: declineInvite },
});
assert.equal(senderCannotDecline, false, "Sender unexpectedly declined their own invitation");
const observerDeclined = await call("/rest/v1/rpc/msg_invite_decline", {
  method: "POST",
  bearer: observer.token,
  body: { p_invite: declineInvite },
});
assert.equal(observerDeclined, true, "Recipient could not decline the invitation");
const declinedState = await call(
  `/rest/v1/msg_invites?select=status&id=eq.${declineInvite}`,
  { bearer: observer.token },
);
assert.equal(declinedState[0]?.status, "declined");

// Annulation et refus ne doivent pas créer de conversation directe.
const observerDirects = await call("/rest/v1/msg_conversations?select=id,type&type=eq.direct", {
  bearer: observer.token,
});
assert.equal(observerDirects.length, 0, "A direct conversation exists after cancellation/decline");

console.log("PASS: GoTrue JWT, PostgREST, RLS, consentement, recherche minimale, confidentialité des invitations, annulation et refus");


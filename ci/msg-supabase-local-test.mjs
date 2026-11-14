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

async function call(path, { method = "GET", key = anonKey, bearer = key, body, expected = true, prefer } = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    method,
    headers: { ...headers(key, bearer), ...(prefer ? { Prefer: prefer } : {}) },
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
  let closedByTest = false;
  let eventSettled = false;
  let expectedInviteId = null;
  const queuedInviteEvents = [];
  const receivedFrames = [];
  let joinPostgresChanges = null;
  const postgresSystemFrames = [];
  let timeout;
  const fail = (error) => {
    clearTimeout(timeout);
    timeout = null;
    rejectReady(error);
    if (!eventSettled) {
      eventSettled = true;
      rejectEvent(error);
    }
  };
  const failEventTimeout = () => {
    const lateProbe = spawnSync("psql", [
      process.env.DB_URL,
      "-X", "-A", "-t", "-v", "ON_ERROR_STOP=1",
      "-c",
      "select jsonb_build_object('subscription_id', subscription_id, 'entity', entity::text, 'filters', filters, 'claims_role', claims_role::text, 'action_filter', action_filter)::text from realtime.subscription where entity = 'public.msg_invites'::regclass;"
    ], { encoding: "utf8" });
    const diagnostic = lateProbe.status === 0
      ? (lateProbe.stdout.trim() || "(aucune ligne après attente)")
      : (lateProbe.stderr || lateProbe.error?.message || "psql failed");
    fail(new Error("No msg_invites INSERT event received within 12 seconds after CDC readiness; join postgres_changes: " + JSON.stringify(joinPostgresChanges) + "; postgres_changes system frames: " + JSON.stringify(postgresSystemFrames) + "; CDC rows after wait: " + diagnostic + "; received frames: " + JSON.stringify(receivedFrames)));
  };
  const maybeResolveReady = () => {
    if (joinAcknowledged && cdcReady && !ready) {
      ready = true;
      clearTimeout(timeout);
      timeout = setTimeout(failEventTimeout, 12000);
      resolveReady();
    }
  };
  const readyPromise = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
  const eventPromise = new Promise((resolve, reject) => { resolveEvent = resolve; rejectEvent = reject; });
  // L'observateur peut échouer avant que le scénario n'attache son await.
  // Ce handler évite un rejet non traité sans modifier le rejet reçu par waitForInvite().
  eventPromise.catch(() => {});
  timeout = setTimeout(() => {
    fail(new Error("Realtime Postgres Changes subscription did not become CDC-ready within 12 seconds; join ACK: " + JSON.stringify(joinPostgresChanges) + "; system frames: " + JSON.stringify(postgresSystemFrames)));
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
            fail(new Error("Realtime phx_join acknowledged without the expected public.msg_invites subscription: " + JSON.stringify(payload.response || payload)));
            return;
          }
          joinAcknowledged = true;
          maybeResolveReady();
        } else {
          fail(new Error("Realtime join rejected: " + JSON.stringify(payload.response || payload)));
        }
      }
      if (eventName === "system" && payload.extension === "postgres_changes") {
        postgresSystemFrames.push(payload);
        if (postgresSystemFrames.length > 8) postgresSystemFrames.shift();
        if (payload.status === "ok") {
          cdcReady = true;
          maybeResolveReady();
        } else if (payload.status === "error" || payload.status === "timeout") {
          fail(new Error("Realtime Postgres Changes subscription reported " + payload.status + ": " + JSON.stringify(payload)));
        }
      }
      if (eventName === "postgres_changes") {
        const data = payload.data || payload;
        const record = data.record || data.new || payload.record || payload.new || {};
        const changeType = data.type || data.eventType || payload.eventType;
        if (String(changeType || "").toUpperCase() === "INSERT" &&
            record.recipient_id === user.id && record.status === "pending") {
          const inviteEvent = { changeType: "INSERT", record };
          if (expectedInviteId !== null && String(record.id) === expectedInviteId && !eventSettled) {
            eventSettled = true;
            clearTimeout(timeout);
            timeout = null;
            resolveEvent(inviteEvent);
          } else {
            queuedInviteEvents.push(inviteEvent);
            if (queuedInviteEvents.length > 50) queuedInviteEvents.shift();
          }
        }
      }
      if (eventName === "phx_error" || eventName === "phx_close") {
        fail(new Error("Realtime channel closed: " + JSON.stringify(payload)));
      }
    } catch (error) {
      fail(error);
    }
  });
  socket.addEventListener("error", () => {
    fail(new Error("Realtime WebSocket transport error"));
  });
  socket.addEventListener("close", (event) => {
    if (closedByTest) return;
    fail(new Error("Realtime WebSocket closed unexpectedly (code=" +
      event.code + ", reason=" + String(event.reason || "") + ")"));
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
      waitForInvite: (inviteId) => {
        assert.ok(inviteId, "waitForInvite requires the expected invitation id");
        assert.equal(expectedInviteId, null, "waitForInvite can only be called once");
        expectedInviteId = String(inviteId);
        const queuedIndex = queuedInviteEvents.findIndex((change) =>
          String(change.record.id) === expectedInviteId
        );
        if (queuedIndex !== -1 && !eventSettled) {
          eventSettled = true;
          clearTimeout(timeout);
          timeout = null;
          resolveEvent(queuedInviteEvents.splice(queuedIndex, 1)[0]);
        }
        return eventPromise;
      },
      close: () => {
        clearTimeout(timeout);
        timeout = null;
        if (!eventSettled) {
          fail(new Error("Realtime invitation observer closed before receiving its INSERT event"));
        }
        closedByTest = true;
        socket.close();
      }
    };
  } catch (error) {
    clearTimeout(timeout);
    timeout = null;
    closedByTest = true;
    socket.close();
    throw error;
  }
}

// Vérification du transport réel de la table msg_messages, filtré par conversation_id.
async function subscribeToMessageChanges(user, conversationId) {
  assert.equal(typeof WebSocket, "function", "Node 22 WebSocket global is unavailable");
  const topic = "realtime:msg-messages-local-" + user.id + "-" + conversationId;
  const filter = "conversation_id=eq." + conversationId;
  const wsUrl = `ws://127.0.0.1:54321/realtime/v1/websocket?apikey=${encodeURIComponent(anonKey)}&vsn=2.0.0`;
  const socket = new WebSocket(wsUrl);
  let resolveReady, rejectReady, resolveEvent, rejectEvent;
  const updateWaiters = [];
  const queuedUpdates = [];
  let ready = false, joinAcknowledged = false, cdcReady = false, closedByTest = false;
  let timeout;
  const failPending = (error) => {
    clearTimeout(timeout);
    rejectEvent(error);
    while (updateWaiters.length) {
      const waiter = updateWaiters.shift();
      clearTimeout(waiter.timer);
      waiter.reject(error);
    }
  };
  const frames = [];
  const readyPromise = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
  const eventPromise = new Promise((resolve, reject) => { resolveEvent = resolve; rejectEvent = reject; });
  const maybeReady = () => {
    if (joinAcknowledged && cdcReady && !ready) {
      ready = true;
      clearTimeout(timeout);
      timeout = setTimeout(() => failPending(new Error(
        "No msg_messages INSERT event for " + filter + " within 12 seconds; frames: " + JSON.stringify(frames)
      )), 12000);
      resolveReady();
    }
  };
  timeout = setTimeout(() => rejectReady(new Error(
    "msg_messages subscription did not become CDC-ready; frames: " + JSON.stringify(frames)
  )), 12000);
  socket.addEventListener("open", () => {
    socket.send(JSON.stringify([
      "1", "1", topic, "phx_join",
      {
        config: {
          broadcast: { ack: false, self: false },
          presence: { key: "" },
          postgres_changes: [{ event: "*", schema: "public", table: "msg_messages", filter }]
        },
        access_token: user.token,
        version: "1.0.0"
      }
    ]));
  });
  socket.addEventListener("message", (event) => {
    try {
      const raw = String(event.data);
      const frame = JSON.parse(raw);
      frames.push(raw.slice(0, 1400));
      if (frames.length > 10) frames.shift();
      if (!Array.isArray(frame) || frame.length < 5 || frame[2] !== topic) return;
      const eventName = frame[3];
      const payload = frame[4] || {};
      if (eventName === "phx_reply") {
        if (payload.status !== "ok") {
          const error = new Error("msg_messages join rejected: " + JSON.stringify(payload.response || payload));
          if (!ready) rejectReady(error); else failPending(error);
          return;
        }
        const changes = payload.response?.postgres_changes ?? [];
        if (!changes.some((item) => item.schema === "public" && item.table === "msg_messages" &&
            item.filter === filter)) {
          rejectReady(new Error("Realtime did not acknowledge public.msg_messages with the exact conversation filter " +
            filter + ": " + JSON.stringify(changes)));
          return;
        }
        joinAcknowledged = true;
        maybeReady();
      } else if (eventName === "system" && payload.extension === "postgres_changes") {
        if (payload.status === "ok") {
          cdcReady = true;
          maybeReady();
        } else if (payload.status === "error" || payload.status === "timeout") {
          const error = new Error("msg_messages CDC readiness failed: " + JSON.stringify(payload));
          if (!ready) rejectReady(error); else failPending(error);
        }
      } else if (eventName === "postgres_changes") {
        const data = payload.data || payload;
        const record = data.record || data.new || payload.record || payload.new || {};
        const kind = data.type || data.eventType || payload.eventType;
        const eventKind = String(kind || "").toUpperCase();
        if (String(record.conversation_id) === String(conversationId)) {
          const change = { record, frame: payload, kind: eventKind };
          if (eventKind === "INSERT") {
            clearTimeout(timeout);
            resolveEvent(change);
          }
          if (eventKind === "UPDATE") {
            const waiterIndex = updateWaiters.findIndex((waiter) => waiter.matches(change));
            if (waiterIndex !== -1) {
              const [waiter] = updateWaiters.splice(waiterIndex, 1);
              clearTimeout(waiter.timer);
              waiter.resolve(change);
            } else {
              queuedUpdates.push(change);
              // Le harnais ne conserve qu'un historique borné des événements non consommés.
              if (queuedUpdates.length > 50) queuedUpdates.shift();
            }
          }
        }
      } else if (eventName === "phx_error" || eventName === "phx_close") {
        const error = new Error("msg_messages channel closed: " + JSON.stringify(payload));
        if (!ready) rejectReady(error); else failPending(error);
      }
    } catch (error) {
      if (!ready) rejectReady(error); else failPending(error);
    }
  });
  socket.addEventListener("error", () => {
    const error = new Error("msg_messages WebSocket transport error");
    if (!ready) rejectReady(error); else failPending(error);
  });
  socket.addEventListener("close", (event) => {
    if (closedByTest) return;
    const error = new Error("msg_messages WebSocket closed unexpectedly (code=" +
      event.code + ", reason=" + event.reason + ")");
    if (!ready) rejectReady(error); else failPending(error);
  });
  try {
    await readyPromise;
    return {
      waitForMessage: () => eventPromise,
      waitForUpdate: ({ messageId, predicate = () => true, label = "UPDATE" } = {}) => {
        assert.ok(messageId, "waitForUpdate requires the expected message id");
        assert.equal(typeof predicate, "function", "waitForUpdate predicate must be a function");
        const matches = (change) =>
          String(change.record.id) === String(messageId) && predicate(change.record);
        const queuedIndex = queuedUpdates.findIndex(matches);
        if (queuedIndex !== -1) {
          return Promise.resolve(queuedUpdates.splice(queuedIndex, 1)[0]);
        }
        return new Promise((resolve, reject) => {
          const waiter = { resolve, reject, matches, timer: null, label };
          waiter.timer = setTimeout(() => {
            const index = updateWaiters.indexOf(waiter);
            if (index !== -1) updateWaiters.splice(index, 1);
            reject(new Error("No matching msg_messages UPDATE (" + label + ") for message " +
              messageId + " and " + filter + " within 12 seconds; frames: " + JSON.stringify(frames)));
          }, 12000);
          updateWaiters.push(waiter);
        });
      },
      close: () => {
        closedByTest = true;
        clearTimeout(timeout);
        const error = new Error("msg_messages observer closed by test");
        while (updateWaiters.length) {
          const waiter = updateWaiters.shift();
          clearTimeout(waiter.timer);
          waiter.reject(error);
        }
        socket.close();
      }
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
  assert.match(realtimeInvite, /^[0-9a-f-]{36}$/i, "Invitation RPC did not return a UUID");
  const realtimeServiceRow = await call(
    `/rest/v1/msg_invites?select=id,sender_id,recipient_id,status&id=eq.${realtimeInvite}`,
    { key: serviceRoleKey, bearer: serviceRoleKey },
  );
  assert.equal(realtimeServiceRow.length, 1, "Invitation RPC did not persist a row visible to service_role");
  assert.equal(String(realtimeServiceRow[0].id), realtimeInvite);
  assert.equal(realtimeServiceRow[0].sender_id, sender.id);
  assert.equal(realtimeServiceRow[0].recipient_id, observer.id);
  assert.equal(realtimeServiceRow[0].status, "pending");
  const realtimeRecipientRow = await call(
    `/rest/v1/msg_invites?select=id,recipient_id,status&id=eq.${realtimeInvite}`,
    { bearer: observer.token },
  );
  assert.equal(realtimeRecipientRow.length, 1, "Recipient RLS cannot read its own pending invitation");
  assert.equal(String(realtimeRecipientRow[0].id), realtimeInvite);
  assert.equal(realtimeRecipientRow[0].recipient_id, observer.id);
  assert.equal(realtimeRecipientRow[0].status, "pending");
  const realtimeEvent = await realtimeObserver.waitForInvite(realtimeInvite);
  assert.equal(String(realtimeEvent.record.id), realtimeInvite, "Realtime event did not match the created invitation");
  assert.equal(realtimeEvent.record.sender_id, sender.id);
  assert.equal(realtimeEvent.record.recipient_id, observer.id);
  assert.equal(realtimeEvent.record.status, "pending");
  const realtimeCancelled = await call("/rest/v1/rpc/msg_invite_cancel", {
    method: "POST",
    bearer: sender.token,
    body: { p_invite: realtimeInvite },
  });
  assert.equal(realtimeCancelled, true, "Could not clean up the synthetic Realtime invitation");
  const cancelledRealtimeRow = await call(
    `/rest/v1/msg_invites?select=id,status&id=eq.${realtimeInvite}`,
    { key: serviceRoleKey, bearer: serviceRoleKey },
  );
  assert.equal(cancelledRealtimeRow.length, 1, "Cancelled Realtime invitation disappeared unexpectedly");
  assert.equal(cancelledRealtimeRow[0].status, "cancelled",
    "Cancellation RPC returned true but the persisted invitation status did not change");
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

// Une invitation réciproque est volontairement créée avant l'acceptation.
 // L'acceptation de la première doit neutraliser cette demande redondante.
 const reciprocalInvite = await call("/rest/v1/rpc/msg_invite_send", {
   method: "POST",
   bearer: recipient.token,
   body: { p_recipient: sender.id },
 });
 assert.match(reciprocalInvite, /^[0-9a-f-]{36}$/i, "Reciprocal invitation RPC did not return a UUID");
 const reciprocalPending = await call(
   `/rest/v1/msg_invites?select=id,status&id=eq.${reciprocalInvite}`,
   { bearer: recipient.token },
 );
 assert.equal(reciprocalPending.length, 1);
 assert.equal(reciprocalPending[0].status, "pending");

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
assert.match(String(acceptedConversationId), /^\d+$/, "Acceptance RPC did not return a conversation id");

// Rejouer la même acceptation doit être idempotent et retourner le même DM.
const repeatedAcceptance = await call("/rest/v1/rpc/msg_invite_accept", {
  method: "POST",
  bearer: recipient.token,
  body: { p_invite: invite },
});
assert.equal(String(repeatedAcceptance), String(acceptedConversationId),
  "Repeated acceptance created or returned a different direct conversation");

const acceptedInviteState = await call(
  `/rest/v1/msg_invites?select=id,status,conversation_id,responded_at&id=eq.${invite}`,
  { key: serviceRoleKey, bearer: serviceRoleKey },
);
assert.equal(acceptedInviteState.length, 1, "Accepted invitation is missing from service_role view");
assert.equal(acceptedInviteState[0].status, "accepted");
assert.equal(String(acceptedInviteState[0].conversation_id), String(acceptedConversationId));
assert.ok(acceptedInviteState[0].responded_at, "Accepted invitation has no response timestamp");

const reciprocalState = await call(
  `/rest/v1/msg_invites?select=id,status&id=eq.${reciprocalInvite}`,
  { key: serviceRoleKey, bearer: serviceRoleKey },
);
assert.equal(reciprocalState.length, 1, "Reciprocal invitation disappeared unexpectedly");
assert.equal(reciprocalState[0].status, "cancelled",
  "Accepting one direction did not cancel the reciprocal pending invitation");

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


// Souscription témoin : un compte authentifié mais non membre doit pouvoir
// rejoindre le flux CDC, sans recevoir le contenu des conversations privées.
async function observeMessageChanges(user, conversationId) {
  assert.equal(typeof WebSocket, "function", "Node 22 WebSocket global is unavailable");
  const topic = "realtime:msg-messages-outsider-" + user.id + "-" + conversationId;
  const filter = "conversation_id=eq." + conversationId;
  const wsUrl = `ws://127.0.0.1:54321/realtime/v1/websocket?apikey=${encodeURIComponent(anonKey)}&vsn=2.0.0`;
  const socket = new WebSocket(wsUrl);
  let resolveReady, rejectReady, ready = false, joinAcknowledged = false, cdcReady = false, timeout;
  const events = [];
  let terminalError = null;
  const readyPromise = new Promise((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
  const maybeReady = () => {
    if (joinAcknowledged && cdcReady && !ready) {
      ready = true;
      clearTimeout(timeout);
      resolveReady();
    }
  };
  timeout = setTimeout(() => rejectReady(new Error(
    "Non-member Realtime subscription did not become CDC-ready; frames: " + JSON.stringify(events)
  )), 12000);
  socket.addEventListener("open", () => socket.send(JSON.stringify([
    "1", "1", topic, "phx_join",
    {
      config: {
        broadcast: { ack: false, self: false },
        presence: { key: "" },
        postgres_changes: [{ event: "*", schema: "public", table: "msg_messages", filter }]
      },
      access_token: user.token,
      version: "1.0.0"
    }
  ])));
  socket.addEventListener("message", (event) => {
    try {
      const raw = String(event.data);
      const frame = JSON.parse(raw);
      if (!Array.isArray(frame) || frame.length < 5 || frame[2] !== topic) return;
      const name = frame[3], payload = frame[4] || {};
      if (name === "phx_reply") {
        if (payload.status !== "ok") {
          rejectReady(new Error("Non-member Realtime join rejected: " + JSON.stringify(payload.response || payload)));
          return;
        }
        const changes = payload.response?.postgres_changes ?? [];
        if (!changes.some((item) => item.schema === "public" && item.table === "msg_messages" &&
            item.filter === filter)) {
          rejectReady(new Error("Non-member subscription was not acknowledged for msg_messages with exact filter " +
            filter + ": " + JSON.stringify(changes)));
          return;
        }
        joinAcknowledged = true;
        maybeReady();
      } else if (name === "system" && payload.extension === "postgres_changes") {
        if (payload.status === "ok") {
          cdcReady = true;
          maybeReady();
        } else if (payload.status === "error" || payload.status === "timeout") {
          rejectReady(new Error("Non-member CDC readiness failed: " + JSON.stringify(payload)));
        }
      } else if (name === "postgres_changes") {
        const data = payload.data || payload;
        const record = data.record || data.new || payload.record || payload.new || {};
        if (String(record.conversation_id) === String(conversationId)) events.push(record);
      } else if (name === "phx_error" || name === "phx_close") {
        terminalError = new Error("Non-member channel closed after subscription: " + JSON.stringify(payload));
        if (!ready) rejectReady(terminalError);
      }
    } catch (error) {
      if (!ready) rejectReady(error);
    }
  });
  socket.addEventListener("error", () => {
    terminalError = new Error("Non-member Realtime WebSocket transport error");
    if (!ready) rejectReady(terminalError);
  });
  try {
    await readyPromise;
    return {
      events,
      assertHealthy: () => {
        if (terminalError) throw terminalError;
        if (socket.readyState !== WebSocket.OPEN) {
          throw new Error("Non-member Realtime WebSocket is not open after CDC readiness (readyState=" + socket.readyState + ")");
        }
      },
      close: () => { clearTimeout(timeout); socket.close(); }
    };
  } catch (error) {
    clearTimeout(timeout);
    socket.close();
    throw error;
  }
}

// Test de bout en bout du chemin qui manquait : INSERT msg_messages → CDC → WebSocket destinataire → SELECT RLS.
const realtimeMessageObserver = await subscribeToMessageChanges(recipient, acceptedConversationId);
const outsiderRealtimeObserver = await observeMessageChanges(observer, acceptedConversationId);
try {
  const messageBody = "Realtime message delivery smoke test";
  await call("/rest/v1/msg_messages", {
    method: "POST",
    bearer: sender.token,
    body: [{
      conversation_id: acceptedConversationId,
      sender_id: sender.id,
      body: messageBody
    }]
  });
  const receivedMessage = await realtimeMessageObserver.waitForMessage();
  assert.equal(String(receivedMessage.record.conversation_id), String(acceptedConversationId),
    "Realtime message event belongs to another conversation");
  assert.equal(receivedMessage.record.sender_id, sender.id, "Realtime event has the wrong sender");
  assert.equal(receivedMessage.record.body, messageBody, "Realtime event body differs from the inserted message");
  assert.ok(receivedMessage.record.id, "Realtime event did not include the message id");

  const recipientCanReadMessage = await call(
    `/rest/v1/msg_messages?select=id,conversation_id,sender_id,body&id=eq.${receivedMessage.record.id}`,
    { bearer: recipient.token }
  );
  assert.equal(recipientCanReadMessage.length, 1, "Recipient RLS cannot read the message delivered by Realtime");
  assert.equal(recipientCanReadMessage[0].body, messageBody);

  // L'édition autorisée doit produire un UPDATE reçu par le destinataire.
  const editedBody = "Realtime message edited by its sender";
  const editEventPromise = realtimeMessageObserver.waitForUpdate({
    messageId: receivedMessage.record.id,
    label: "édition",
    predicate: (record) => record.body === editedBody
  });
  const editedRows = await call(
    `/rest/v1/msg_messages?id=eq.${receivedMessage.record.id}&select=id,body,edited_at`,
    {
      method: "PATCH",
      bearer: sender.token,
      body: { body: editedBody, edited_at: new Date().toISOString() },
      prefer: "return=representation"
    }
  );
  assert.equal(editedRows.length, 1, "Sender could not edit their own message");
  assert.equal(editedRows[0].body, editedBody);
  const editedEvent = await editEventPromise;
  assert.equal(editedEvent.kind, "UPDATE", "Message edit did not emit an UPDATE event");
  assert.equal(String(editedEvent.record.id), String(receivedMessage.record.id),
    "Realtime edit UPDATE belongs to another message");
  assert.equal(editedEvent.record.body, editedBody, "Realtime UPDATE did not contain the edited body");

  // Un compte extérieur ne peut pas modifier la ligne, même avec son ID.
  const outsiderEdit = await call(
    `/rest/v1/msg_messages?id=eq.${receivedMessage.record.id}&select=id`,
    {
      method: "PATCH",
      bearer: observer.token,
      body: { body: "unauthorized edit" },
      prefer: "return=representation"
    }
  );
  assert.equal(outsiderEdit.length, 0, "Non-member unexpectedly updated a private message");

  // Les privilèges SQL empêchent même l'expéditeur de réassigner sender_id.
  await call(
    `/rest/v1/msg_messages?id=eq.${receivedMessage.record.id}`,
    {
      method: "PATCH",
      bearer: sender.token,
      body: { sender_id: recipient.id },
      expected: false
    }
  );

  // Suppression logique : seul deleted_at est modifié, sans DELETE physique.
  const deleteEventPromise = realtimeMessageObserver.waitForUpdate({
    messageId: receivedMessage.record.id,
    label: "suppression logique",
    predicate: (record) => Boolean(record.deleted_at) && record.deleted_at === deletedAt
  });
  const deletedAt = new Date().toISOString();
  const deletedRows = await call(
    `/rest/v1/msg_messages?id=eq.${receivedMessage.record.id}&select=id,deleted_at`,
    {
      method: "PATCH",
      bearer: sender.token,
      body: { deleted_at: deletedAt },
      prefer: "return=representation"
    }
  );
  assert.equal(deletedRows.length, 1, "Sender could not soft-delete their own message");
  assert.ok(deletedRows[0].deleted_at, "Soft-delete did not persist deleted_at");
  const deleteEvent = await deleteEventPromise;
  assert.equal(deleteEvent.kind, "UPDATE", "Soft-delete did not emit an UPDATE event");
  assert.equal(String(deleteEvent.record.id), String(receivedMessage.record.id),
    "Realtime soft-delete UPDATE belongs to another message");
  assert.equal(deleteEvent.record.deleted_at, deletedAt,
    "Realtime soft-delete event does not match the requested timestamp");

  // Le compte tiers est abonné et CDC-ready avant l'INSERT. Il ne doit recevoir
  // aucun payload de cette conversation, même si le destinataire reçoit le message.
  await new Promise((resolve) => setTimeout(resolve, 2000));
  outsiderRealtimeObserver.assertHealthy();
  assert.equal(outsiderRealtimeObserver.events.length, 0,
    "Non-member unexpectedly received a private msg_messages Realtime event");

  const outsiderCannotReadMessage = await call(
    `/rest/v1/msg_messages?select=id&id=eq.${receivedMessage.record.id}`,
    { bearer: observer.token }
  );
  assert.equal(outsiderCannotReadMessage.length, 0, "Non-member can read a message from another conversation");
  console.log("PASS: msg_messages INSERT/UPDATE → recipient Realtime + RLS, sender edit/soft-delete, column grants, non-member isolation");
} finally {
  realtimeMessageObserver.close();
  outsiderRealtimeObserver.close();
}


const accepted = await call(`/rest/v1/msg_invites?select=status&id=eq.${invite}`, {
  bearer: recipient.token,
});
assert.equal(accepted[0]?.status, "accepted");

// Lot 547 : un DM historique entre les mêmes membres doit être réutilisé.
const historicalReuseInvite = await call("/rest/v1/rpc/msg_invite_send", {
  method: "POST",
  bearer: sender.token,
  body: { p_recipient: recipient.id },
});
assert.match(historicalReuseInvite, /^[0-9a-f-]{36}$/i,
  "Historical-DM reuse invitation RPC did not return a UUID");
const historicalReusePending = await call(
  `/rest/v1/msg_invites?select=id,status&id=eq.${historicalReuseInvite}`,
  { bearer: recipient.token },
);
assert.equal(historicalReusePending.length, 1);
assert.equal(historicalReusePending[0].status, "pending");

const reusedConversationId = await call("/rest/v1/rpc/msg_invite_accept", {
  method: "POST",
  bearer: recipient.token,
  body: { p_invite: historicalReuseInvite },
});
assert.equal(String(reusedConversationId), String(acceptedConversationId),
  "Acceptance did not reuse the existing historical direct conversation");

const historicalReuseState = await call(
  `/rest/v1/msg_invites?select=status,conversation_id,responded_at&id=eq.${historicalReuseInvite}`,
  { key: serviceRoleKey, bearer: serviceRoleKey },
);
assert.equal(historicalReuseState.length, 1);
assert.equal(historicalReuseState[0].status, "accepted");
assert.equal(String(historicalReuseState[0].conversation_id), String(acceptedConversationId));
assert.ok(historicalReuseState[0].responded_at);

const directConversationsAfterReuse = await call(
  "/rest/v1/msg_conversations?select=id,type&type=eq.direct",
  { bearer: recipient.token },
);
assert.equal(directConversationsAfterReuse.length, 1,
  "Accepting an invitation with a historical DM created a duplicate direct conversation");
assert.equal(String(directConversationsAfterReuse[0].id), String(acceptedConversationId));
// La recherche ne retourne que les champs publics prévus et reste limitée au profil scolaire.
const discovered = await call("/rest/v1/rpc/msg_student_search", {
  method: "POST",
  bearer: sender.token,
  body: { p_query: "Test", p_limit: 12 },
});
assert.ok(Array.isArray(discovered));
const recipientResult = discovered.find((student) => student.pseudo === "Test-recipient");
const observerResult = discovered.find((student) => student.pseudo === "Test-observer");
assert.ok(recipientResult?.student_key, "Discovery did not issue an opaque key for recipient");
assert.ok(observerResult?.student_key, "Discovery did not issue an opaque key for observer");
assert.notEqual(recipientResult.student_key, recipient.id, "Discovery exposed the recipient auth UUID");
assert.notEqual(observerResult.student_key, observer.id, "Discovery exposed the observer auth UUID");
assert.ok(discovered.every((student) =>
  Object.keys(student).sort().join(",") === "filiere,niveau,pseudo,student_key,wilaya"
), "Discovery RPC returned fields outside the opaque public contract");

// Un jeton de découverte est lié au compte qui l'a demandé.
await call("/rest/v1/rpc/msg_invite_send_by_key", {
  method: "POST",
  bearer: recipient.token,
  body: { p_student_key: observerResult.student_key },
  expected: false,
});

// L'expéditeur utilise le jeton opaque ; aucun UUID du destinataire ne passe par le navigateur.
const cancelInvite = await call("/rest/v1/rpc/msg_invite_send_by_key", {
  method: "POST",
  bearer: sender.token,
  body: { p_student_key: observerResult.student_key },
});
const observerCannotRead = await call(
  `/rest/v1/msg_invites?select=id,status&id=eq.${cancelInvite}`,
  { bearer: recipient.token },
);
assert.equal(observerCannotRead.length, 0, "A non-participant can read another pair's invitation");

// Le jeton est à usage unique : un rejeu par le même acteur est rejeté.
await call("/rest/v1/rpc/msg_invite_send_by_key", {
  method: "POST",
  bearer: sender.token,
  body: { p_student_key: observerResult.student_key },
  expected: false,
});

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


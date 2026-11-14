import assert from "node:assert/strict";

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

console.log("PASS: GoTrue JWT réel local, RPC PostgREST, consentement du destinataire et RLS des deux membres");

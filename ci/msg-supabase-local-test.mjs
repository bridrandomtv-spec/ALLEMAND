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
const observer = await createUser("observer");

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


import assert from "node:assert/strict";

const api = process.env.API_URL;
const anon = process.env.ANON_KEY;
const service = process.env.SERVICE_ROLE_KEY;
assert.ok(api && anon && service, "Local Supabase keys/API URL are required");
const password = "Lot503-Local-Only-2026!";
const jsonHeaders = (key, token=key) => ({
  apikey:key, Authorization:`Bearer ${token}`, "Content-Type":"application/json"
});
async function request(path, {method="GET", key=service, token=key, body, headers={}}={}) {
  const r=await fetch(api+path,{method,headers:{...jsonHeaders(key,token),...headers},
    ...(body===undefined?{}:{body:JSON.stringify(body)})});
  const raw=await r.text();
  let data=null; try { data=raw?JSON.parse(raw):null; } catch {}
  return {status:r.status,ok:r.ok,data,raw};
}
async function must(path,opts={}) {
  const r=await request(path,opts);
  assert.ok(r.ok,`${opts.method||"GET"} ${path}: HTTP ${r.status} ${r.raw}`);
  return r.data;
}
async function user(label) {
  const email=`lot503-${label}@example.test`;
  const created=await must("/auth/v1/admin/users",{method:"POST",body:{email,password,email_confirm:true}});
  const login=await must("/auth/v1/token?grant_type=password",{method:"POST",key:anon,token:anon,body:{email,password}});
  assert.ok(created.id && login.access_token,"Synthetic Auth user/JWT creation failed");
  return {id:created.id,token:login.access_token};
}
async function upload(who,path) {
  const r=await fetch(`${api}/storage/v1/object/prive/${path.split("/").map(encodeURIComponent).join("/")}`,{
    method:"POST",headers:{apikey:anon,Authorization:`Bearer ${who.token}`,"Content-Type":"application/pdf","x-upsert":"false"},
    body:Buffer.from("%PDF-1.4 lot503 fixture")
  });
  const raw=await r.text();
  assert.ok(r.ok,`Storage upload ${path}: HTTP ${r.status} ${raw}`);
}
async function removeObject(who,path,allowed,bucket='prive') {
  const encoded=path.split('/').map(encodeURIComponent).join('/');
  const url=api+'/storage/v1/object/'+bucket+'/'+encoded;
  const r=await fetch(url,{method:'DELETE',headers:{apikey:anon,Authorization:'Bearer '+who.token,'Content-Type':'application/json'}});
  const raw=await r.text();
  if(allowed) assert.ok(r.ok,'Storage DELETE '+path+': HTTP '+r.status+': '+raw);
  const probe=await fetch(url,{headers:{apikey:service,Authorization:'Bearer '+service}});
  assert.equal(probe.ok,!allowed,'Storage object '+path+': expected exists='+(!allowed)+', GET returned HTTP '+probe.status);
}
async function createMessage(sender,conversationId) {
  const rows=await must("/rest/v1/msg_messages?select=id",{method:"POST",body:{conversation_id:conversationId,sender_id:sender.id,body:"fixture"} ,headers:{"Prefer":"return=representation"}});
  return rows[0].id;
}
async function createAttachment(sender,messageId,path) {
  const rows=await must("/rest/v1/msg_attachments?select=id",{method:"POST",body:{message_id:messageId,uploader:sender.id,storage_path:path,mime:"application/pdf",octets:24,statut:"pending"},headers:{"Prefer":"return=representation"}});
  return rows[0].id;
}
async function deleteMetadata(who,id,allowed) {
  const r=await request(`/rest/v1/msg_attachments?id=eq.${id}&select=id`,{
    method:"DELETE",key:anon,token:who.token,headers:{"Prefer":"return=representation"}
  });
  assert.ok(r.ok,`PostgREST DELETE HTTP ${r.status}: ${r.raw}`);
  assert.equal(Array.isArray(r.data)&&r.data.length===1,allowed,
    `Metadata DELETE id=${id}: expected allowed=${allowed}, got ${r.raw}`);
}
const a=await user("owner"), b=await user("other");
const convRows=await must("/rest/v1/msg_conversations?select=id",{method:"POST",body:{created_by:a.id},headers:{"Prefer":"return=representation"}});
const conv=convRows[0].id;
await must("/rest/v1/msg_members",{method:"POST",body:[{conversation_id:conv,user_id:a.id},{conversation_id:conv,user_id:b.id}]});
const msgA=await createMessage(a,conv), msgB=await createMessage(b,conv);
const pathA=`msg/${conv}/${a.id}-lot503-owner.pdf`;
const pathB=`msg/${conv}/${b.id}-lot503-other.pdf`;
await upload(a,pathA); await upload(b,pathB);
await removeObject(b,pathA,false);
await removeObject(a,pathA,true);
await removeObject(b,pathB,true);
const pendingId=await createAttachment(a,msgA,pathB);
await deleteMetadata(b,pendingId,false);
await deleteMetadata(a,pendingId,true);
const linkedId=await createAttachment(a,msgA,pathB);
await must(`/rest/v1/msg_messages?id=eq.${msgA}`,{method:"PATCH",body:{attachment_id:linkedId}});
await deleteMetadata(a,linkedId,false);
const retainedId=await createAttachment(a,msgA,pathA);
await must(`/rest/v1/msg_attachments?id=eq.${retainedId}`,{method:"PATCH",body:{statut:"ok"}});
await deleteMetadata(a,retainedId,false);
console.log("Lot 503: Storage owner isolation and metadata RLS scenarios passed on ephemeral Supabase.");

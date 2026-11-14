REVOKE EXECUTE ON FUNCTION public.msg_member_ok(bigint, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.msg_member_ok(bigint, uuid) TO authenticated;
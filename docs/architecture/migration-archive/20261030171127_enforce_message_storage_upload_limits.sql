
DROP POLICY IF EXISTS "msg storage upload" ON storage.objects;
CREATE POLICY "msg storage upload"
ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'prive'
  AND (storage.foldername(name))[1] = 'msg'
  AND auth.uid() = owner
  AND public.msg_is_member(
    auth.uid(),
    COALESCE(NULLIF((storage.foldername(name))[2], '')::bigint, 0::bigint)
  )
  AND COALESCE((metadata->>'size')::bigint,0) BETWEEN 1 AND 5242880
  AND lower(COALESCE(metadata->>'mimetype','')) IN
      ('image/png','image/jpeg','image/webp','application/pdf')
);

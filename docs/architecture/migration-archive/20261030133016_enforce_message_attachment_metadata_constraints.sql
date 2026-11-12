ALTER TABLE public.msg_attachments
  ADD CONSTRAINT msg_attachments_octets_range_check
    CHECK (octets BETWEEN 1 AND 5242880),
  ADD CONSTRAINT msg_attachments_mime_allowlist_check
    CHECK (mime IN ('image/png', 'image/jpeg', 'image/webp', 'application/pdf')),
  ADD CONSTRAINT msg_attachments_sha256_format_check
    CHECK (sha256 = '' OR sha256 ~ '^[0-9A-Fa-f]{64}$'),
  ADD CONSTRAINT msg_attachments_storage_path_check
    CHECK (storage_path ~ ('^msg/[0-9]+/' || uploader::text || '-[^/]+$'));
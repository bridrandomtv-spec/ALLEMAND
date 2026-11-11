-- LOT 282 — PROPOSITION UNIQUEMENT
-- Brouillon documentaire : NE PAS EXECUTER sur le projet Supabase actif.
-- Prérequis : revue du hook dans un projet de test isolé et autorisation explicite.
--
-- Objectif limité :
--   enregistrer au plus une observation par session lorsque le Custom Access
--   Token Hook est appelé pour une méthode autre que token_refresh.
--
-- IMPORTANT :
--   Le hook s'exécute AVANT l'émission du jeton. Cet enregistrement signifie
--   "hook traité / émission en préparation", pas une preuve irréfutable que
--   le client a reçu le jeton ou que l'application a été ouverte.
--   Les erreurs d'insertion sont volontairement non bloquantes pour Auth :
--   elles peuvent donc produire des lacunes de journalisation.
--
-- Le hook ne doit stocker ni jeton, ni refresh token, ni adresse IP,
-- ni user-agent, ni adresse e-mail.

BEGIN;

CREATE SCHEMA IF NOT EXISTS private;

-- Ne pas modifier les privilèges du schéma private existant : il peut
-- héberger d'autres objets de l'application.

CREATE TABLE private.security_auth_hook_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id uuid NOT NULL,
    session_id uuid NOT NULL,
    event_type text NOT NULL
        CHECK (event_type = 'auth_token_preissue'),
    authentication_method text NOT NULL
        CHECK (char_length(authentication_method) BETWEEN 1 AND 80),
    occurred_at timestamptz NOT NULL DEFAULT clock_timestamp(),
    outcome text NOT NULL DEFAULT 'hook_passed'
        CHECK (outcome = 'hook_passed'),
    CONSTRAINT security_events_session_unique UNIQUE (session_id)
);

ALTER TABLE private.security_auth_hook_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE private.security_auth_hook_events FROM PUBLIC;
REVOKE ALL ON TABLE private.security_auth_hook_events FROM anon;
REVOKE ALL ON TABLE private.security_auth_hook_events FROM authenticated;
REVOKE ALL ON TABLE private.security_auth_hook_events FROM supabase_auth_admin;

CREATE INDEX IF NOT EXISTS security_events_actor_time_idx
    ON private.security_auth_hook_events (actor_id, occurred_at DESC);

CREATE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    original_claims jsonb;
    v_user_id uuid;
    v_session_id uuid;
    v_authentication_method text;
BEGIN
    original_claims := event -> 'claims';

    -- Des claims manquants ou invalides ne doivent jamais être réécrits
    -- en un jeton incomplet.
    IF pg_catalog.jsonb_typeof(original_claims) IS DISTINCT FROM 'object' THEN
        RAISE EXCEPTION 'Custom access token hook received invalid claims';
    END IF;

    -- La journalisation est best-effort et ne doit pas bloquer Auth.
    BEGIN
        v_authentication_method := event ->> 'authentication_method';

        IF v_authentication_method IS NOT NULL
           AND v_authentication_method <> 'token_refresh'
           AND v_authentication_method <> 'email_change'
           AND (event ->> 'user_id') IS NOT NULL
           AND (original_claims ->> 'sub') = (event ->> 'user_id')
           AND (original_claims ->> 'session_id') IS NOT NULL
        THEN
            v_user_id := (event ->> 'user_id')::uuid;
            v_session_id := (original_claims ->> 'session_id')::uuid;

            INSERT INTO private.security_auth_hook_events (
                actor_id,
                session_id,
                event_type,
                authentication_method
            )
            VALUES (
                v_user_id,
                v_session_id,
                'auth_token_preissue',
                v_authentication_method
            )
            ON CONFLICT (session_id) DO NOTHING;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            -- Fail-open pour l'authentification : une panne du journal
            -- ne doit pas empêcher l'émission du jeton.
            -- Conséquence : l'historique peut être incomplet.
            NULL;
    END;

    RETURN pg_catalog.jsonb_build_object('claims', original_claims);
END;
$function$;

REVOKE ALL ON FUNCTION public.custom_access_token_hook(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.custom_access_token_hook(jsonb) FROM anon;
REVOKE ALL ON FUNCTION public.custom_access_token_hook(jsonb) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb)
    TO supabase_auth_admin;

COMMENT ON TABLE private.security_auth_hook_events IS
    'Journal minimal des passages du Custom Access Token Hook ; ne prouve pas la réception du jeton par le client.';

COMMENT ON FUNCTION public.custom_access_token_hook(jsonb) IS
    'Hook best-effort : exclut les renouvellements, déduplique par session et préserve les claims.';

-- Ne pas COMMIT avant revue et tests sur un projet isolé.
ROLLBACK;

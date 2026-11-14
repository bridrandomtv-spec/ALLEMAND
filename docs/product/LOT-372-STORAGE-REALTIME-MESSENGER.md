# Lot 372 — politiques Storage, bucket privé et Realtime Messenger

Date : 13 novembre 2026  
Source : catalogue PostgreSQL Supabase actif, SELECT uniquement. Aucune lecture d'objet Storage, aucun fichier téléchargé, aucune écriture.

## 1. Bucket Messenger

Le bucket `prive` existe et est configuré `public=false`. Les paramètres globaux `file_size_limit` et `allowed_mime_types` sont NULL. Les restrictions de type et taille observées sont donc portées par les policies et les métadonnées, pas par une limite globale du bucket.

## 2. Policies actives de storage.objects

Policies liées à Messenger :
- `msg storage lecture` (SELECT, authenticated) : bucket `prive`, premier segment `msg`, puis conversation ID ; accès si membre ou modérateur.
- `msg storage upload` (INSERT, authenticated) : bucket `prive`, premier segment `msg`, owner = auth.uid(), membre de la conversation, taille metadata 1–5 242 880 octets et MIME metadata limité à PNG/JPEG/WEBP/PDF.

Policies générales aussi présentes :
- `owner read` : lecture dans `prive` si le premier segment du chemin correspond à auth.uid().
- `owner upload` : upload si le premier segment du chemin correspond à auth.uid().
- `owner delete` : suppression si le premier segment du chemin correspond à auth.uid().

Ces policies doivent être reproduites exactement, en tenant compte de leur combinaison permissive (OR) dans PostgreSQL RLS. Pour les chemins Messenger `msg/<conversation>/<uuid>-...`, les règles génériques owner ne correspondent normalement pas au premier segment `msg`, mais le test doit confirmer les cas de chemins non conformes et les règles de suppression.

## 3. Realtime

La publication `supabase_realtime` contient :
- `public.msg_conversations`
- `public.msg_messages`

Les membres et pièces jointes ne sont pas listés dans l'extraction courante. Le test Realtime réel reste distinct d'un simple test SQL RLS : il nécessite le service Realtime de Supabase ou un harnais clairement limité.

## 4. Audit et séquences

- `profiles_tr_audit_role_fn()` appelle `public.audit_log(...)`.
- `audit_log` est SECURITY DEFINER, search_path `pg_catalog,public`, insère dans `public.audit_logs`; ACL EXECUTE observée : postgres et service_role, pas authenticated.
- Séquences Messenger observées : `msg_attachments_id_seq`, `msg_conversations_id_seq`, `msg_log_id_seq`, `msg_messages_id_seq`, `msg_reports_id_seq`, toutes bigint avec incrément 1.
- La table `audit_logs` et sa politique/structure constituent une dépendance à extraire si les triggers de profil sont conservés dans le test.

## 5. Tests supplémentaires requis

1. Un membre lit le fichier `msg/<conversation>/<autre-uuid>-fichier` d'une conversation dont il est membre.
2. Un non-membre tente de lire le même objet.
3. Un utilisateur tente un upload dans une conversation dont il n'est pas membre.
4. Un utilisateur tente un upload avec mauvais owner, mauvais MIME, taille nulle ou supérieure à 5 MiB.
5. Un utilisateur tente un chemin de fichier qui ne respecte pas le motif Messenger.
6. Un utilisateur tente de supprimer un objet Messenger appartenant à un autre membre.
7. Comparer l'accès Storage signé et les contrôles SQL : RLS sur `storage.objects` n'est pas une preuve de sécurité de l'URL signée ni du service de fichiers complet.
8. Vérifier les changements Realtime visibles par membre et non-membre avec le service Realtime isolé.

## 6. Limites et garde-fous

- Les policies Storage ont été lues depuis `pg_policies`, sans accéder au contenu des fichiers.
- Bucket privé confirmé ; aucune modification de bucket ou de policy.
- Aucun test de Storage ou Realtime exécuté.
- Aucun projet de test créé, aucun coût engagé.
- Projet actif inchangé ; aucun changement main, fusion PR #17 ou déploiement.

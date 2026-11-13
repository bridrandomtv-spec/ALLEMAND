# Lot 385 — manifeste catalogue et constats fonctionnels Messenger

Date : 13 novembre 2026  
Périmètre : audit en lecture seule du projet Supabase actif.

## 1. Extraction réalisée

Le script `tests/messenger/export_catalog_manifest.sql` exporte un objet JSONB canonique contenant :
- les 12 tables ciblées et leurs indicateurs RLS / FORCE RLS ;
- les 30 policies avec commande, rôles, USING et WITH CHECK ;
- les 14 triggers avec état et définition ;
- les contraintes et leurs définitions ;
- les index et leurs définitions ;
- les 10 fonctions critiques avec signature, langage, SECURITY DEFINER, volatilité, configuration et définition.

Le manifeste ne lit aucune ligne métier : ni profil, ni conversation, ni message, ni pièce jointe. Il ne modifie aucun objet.

## 2. Inventaire observé

- Tables ciblées : 12 ; RLS activé sur 12 ; FORCE RLS désactivé sur 12.
- Policies : 30.
- Triggers : 14.
- Fonctions critiques extraites : 10.
- Contraintes : exportées depuis pg_constraint.
- Index : exportés depuis pg_index / pg_get_indexdef.

## 3. Constats fonctionnels à traiter avant ouverture nationale

### C-385-01 — création de DM sans invitation acceptée

La fonction `public.msg_open_direct(p_other uuid)` vérifie l'authentification, refuse le destinataire nul ou soi-même et appelle `msg_can_dm`. Elle recherche ensuite une conversation existante ou crée la conversation et ses deux adhésions.

Elle ne vérifie pas l'existence d'une invitation envoyée par le destinataire, ni son acceptation explicite.

La fonction `public.msg_member_ok(cid, uid)` autorise également le second participant à s'ajouter lui-même à un DM lorsque `msg_can_dm` renvoie vrai. La policy INSERT de `msg_members` appelle cette fonction ; elle ne représente donc pas un mécanisme d'invitation/acceptation.

**Conséquence :** la compatibilité des profils vérifiés ne doit pas être confondue avec le consentement à recevoir une conversation privée. Le flux invitation → acceptation → ouverture effective n'est pas garanti par ces contrôles SQL.

### C-385-02 — blocage non appliqué à l'ouverture d'un DM

La policy d'envoi des messages appelle `msg_not_blocked`, mais `msg_open_direct` n'appelle pas cette fonction avant de retourner une conversation existante ou d'en créer une.

**Conséquence :** la règle de blocage est présente au niveau de l'envoi, mais n'est pas appliquée au point d'entrée de création/réouverture du DM. Il faut définir et tester le comportement attendu pour les deux sens du blocage, sans modifier la base active durant cet audit.

### C-385-03 — vérification scolaire distincte de l'affiliation officielle

`msg_can_dm` s'appuie sur les champs de profil `wilaya`, `niveau`, `filiere` et `verif_statut='verifie'`. Les données initiales de wilaya/niveau/filière peuvent provenir des métadonnées d'inscription fournies par l'utilisateur ; elles ne constituent pas, à elles seules, une preuve officielle d'inscription dans un lycée.

**Conséquence :** l'interface de vérification et la source officielle d'affiliation scolaire doivent être définies séparément. Aucun identifiant de paiement/abonnement ne doit être inventé ni traité comme preuve tant qu'aucun système de paiement n'est autorisé.

## 4. Décision de sécurité

Ces constats sont des résultats d'audit, pas des modifications. Aucune policy, fonction, table, donnée, Storage, Auth ou publication Realtime n'a été changée.

Ne pas activer l'ouverture nationale ni présenter le DM comme un Messenger avec invitations sûres tant que C-385-01 et C-385-02 n'ont pas une spécification de comportement et des tests négatifs/positifs exécutés sur une base PostgreSQL isolée.

## 5. Limites

- Le manifeste catalogue ne remplace pas un dump/restauration PostgreSQL complet.
- Les objets gérés par Supabase Auth, Storage et Realtime nécessitent des adaptateurs spécifiques.
- Aucun test comportemental RLS multi-comptes n'a été exécuté.
- Aucun projet Supabase de test n'a été créé ; aucun coût engagé.
- Aucun workflow CI, déploiement Cloudflare ou fusion PR n'a été lancé.

## 6. Suite

Lot 386 : formaliser les invariants du cycle d'invitation et du blocage (états, transitions, autorisations et scénarios négatifs), puis préparer les tests SQL isolés. Toute correction fonctionnelle sera proposée sous forme de patch distinct et ne sera pas appliquée à Supabase actif sans autorisation explicite.

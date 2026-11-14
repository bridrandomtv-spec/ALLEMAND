# Lot 388 — candidat de migration et revue des points de contournement

Date : 13 novembre 2026  
Statut : **candidat statique uniquement — NON EXÉCUTÉ**  
Branche : `design/prototypes-67-74-alignment` · PR #17

## 1. Artefact créé

`tests/messenger/LOT-388-CANDIDAT-SCHEMA-INVITATIONS-NON-EXECUTER.sql`

Le fichier prépare uniquement la table `public.msg_invitations`, ses contraintes, index et RLS :
- paire d'utilisateurs distincts ;
- états pending / accepted / rejected / cancelled / expired ;
- cohérence stricte entre état terminal, horodatage de réponse et conversation associée ;
- index unique partiel sur la paire non ordonnée pour empêcher les demandes pending concurrentes dans les deux sens ;
- index de boîte de réception, d'envoi et de conversation ;
- lecture limitée aux deux participants ;
- aucune policy d'écriture client : les transitions devront être opérées par des RPC serveur.

Le script est explicitement étiqueté NON EXÉCUTER et ne contient aucun DROP ni changement des tables existantes.

## 2. Découverte de sécurité importante dans la base active

La lecture des définitions PostgreSQL actives révèle un écart qui doit être traité avant toute ouverture :

### C-388-01 — RPC DM toujours appelable sans invitation acceptée
La fonction active `public.msg_open_direct(uuid)` est SECURITY DEFINER. Elle :
1. vérifie `msg_can_dm` ;
2. prend un verrou advisory par paire ;
3. retrouve un DM existant ou crée une conversation ;
4. insère les deux adhésions.

Elle ne vérifie pas l'existence d'une invitation acceptée et ne vérifie pas explicitement les blocages avant la création/réouverture. Le correctif client du lot 324 ne ferme donc pas à lui seul le chemin RPC SQL.

### C-388-02 — ajout du second membre contrôlé par l'ancienne règle
La fonction active `msg_member_ok` permet encore l'auto-ajout dans un DM vide par son créateur et, si un seul membre existe, l'ajout d'un profil compatible via `msg_can_dm`. Elle ne demande aucune invitation acceptée.

### C-388-03 — trigger incompatible avec les contacts nationaux
Le trigger actif `msg_guard_direct` appelle `msg_can_dm` lorsque le deuxième membre est ajouté. Or cette fonction impose actuellement même wilaya, niveau et filière, et exige deux profils marqués `verifie`. Une invitation acceptée ne suffit donc pas à autoriser une paire inter-wilaya.

### C-388-04 — blocage
`msg_not_blocked` est utilisé pour les insertions de messages, mais `msg_open_direct` ne vérifie pas explicitement un blocage bilatéral avant de créer ou réutiliser le DM. Le nouveau flux devra contrôler les deux orientations du blocage à l'envoi, à l'acceptation, à l'ouverture et à l'envoi des messages.

## 3. Décision d'architecture

Le correctif doit être atomique et couvrir simultanément :
- `msg_open_direct` : refuser si aucune invitation accepted exacte n'existe ; vérifier les deux sens de blocage à chaque ouverture ;
- `msg_member_ok` : ne plus autoriser l'auto-ajout direct sur simple compatibilité ;
- `msg_guard_direct` : vérifier l'invitation acceptée liée au DM, sans s'appuyer sur l'ancienne égalité géographique ;
- RPC d'envoi/réponse/annulation : identité issue de `auth.uid()`, destinataire seul habilité à accepter/refuser, demandeur seul habilité à annuler, verrouillage de ligne et transaction unique ;
- création/réutilisation d'un DM et des deux membres dans la transaction d'acceptation, avec lien `conversation_id` vers l'invitation ;
- vérification d'éligibilité nationale institutionnelle, distincte du consentement.

Le candidat SQL actuel ne crée pas les RPC et ne modifie pas les fonctions actives : les déployer avant de disposer de la source officielle d'affiliation pourrait ouvrir un accès non justifié ou laisser des voies de contournement.

## 4. Bloqueur métier non résolu

Les colonnes `profiles.wilaya`, `niveau`, `filiere` et `verif_statut` ne prouvent pas à elles seules l'inscription actuelle d'un élève dans un lycée donné. Aucun registre officiel individuel exploitable n'a été confirmé. La fonction d'éligibilité nationale doit donc rester fail-closed jusqu'à l'intégration d'une preuve institutionnelle.

Aucune facturation n'est requise ou proposée. Le numéro de vérification devra être institutionnel et non financier.

## 5. Validation

- Inspection des définitions SQL actives via requêtes de catalogue SELECT uniquement.
- Le candidat SQL a été écrit dans GitHub ; il n'a pas été soumis à PostgreSQL.
- Aucun test d'intégration PostgreSQL/RLS exécuté.
- Aucune migration, table, RPC, policy, ACL, Auth, Storage ou Realtime modifiée sur Supabase actif.
- Aucun CI hébergé déclenché, aucun déploiement, aucun merge, aucun coût.

**Conclusion : GO pour revue du candidat ; NO-GO pour exécution et ouverture du Messenger national.**

## 6. Étape suivante — Lot 389

Préparer un correctif serveur complet, versionné, qui ferme le chemin direct RPC et les auto-ajouts, avec des tests négatifs multi-comptes sur PostgreSQL 17 isolé. Tant que l'environnement PostgreSQL local isolé n'est pas disponible et que l'affiliation officielle n'est pas résolue, ne pas prétendre que les tests RLS ont passé et ne pas appliquer le patch sur Supabase actif.

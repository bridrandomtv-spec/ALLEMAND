# Lot 389 — décision produit : Messenger national inter-niveaux

Date : 13 novembre 2026  
Statut : décision produit confirmée ; aucune activation backend.

## Décision

L'utilisateur confirme que les élèves doivent pouvoir communiquer entre les trois niveaux du secondaire :

- 1AS ↔ 1AS, 2AS ou 3AS ;
- 2AS ↔ 1AS, 2AS ou 3AS ;
- 3AS ↔ 1AS, 2AS ou 3AS.

Le niveau scolaire ne constitue donc **pas** une condition de compatibilité pour découvrir un élève ou lui envoyer une invitation. Il ne faut pas conserver la règle « même niveau obligatoire » ni imposer la même filière ou la même wilaya pour les conversations entre élèves.

La portée cible est nationale : lycées et wilayas différents, avec filtres facultatifs par niveau, filière, lycée et wilaya. Les filtres aident à trouver des contacts ; ils ne doivent pas devenir des restrictions implicites.

## Parcours autorisé

1. L'élève connecté peut rechercher des profils minimaux autorisés dans l'annuaire national.
2. Un profil visible peut recevoir une invitation selon ses paramètres de confidentialité et les limites anti-abus.
3. Une invitation en attente ne crée aucune conversation et ne permet aucun message privé.
4. Seul le destinataire peut accepter ou refuser ; l'expéditeur peut annuler tant qu'elle est en attente.
5. L'acceptation crée ou rattache le DM et les deux adhésions dans une seule transaction serveur.
6. Le blocage bilatéral prévaut sur l'annuaire, l'invitation, l'acceptation, l'ouverture et l'envoi.
7. Les comptes non vérifiés ou suspendus ne peuvent ni apparaître comme contacts scolaires autorisés ni initier/accepter un DM national.

## Ce que le niveau ne change pas

- Le niveau, la filière et la wilaya restent des attributs d'affichage et de filtrage lorsqu'ils sont validés.
- Ils ne prouvent pas l'identité ni l'inscription dans un lycée.
- Les conversations élève↔professeur conservent une règle distincte : rattachement pédagogique et rôle professionnel vérifiés.
- Les groupes officiels de classe/lycée restent séparés des groupes nationaux thématiques.

## Identité scolaire et absence de facturation

L'utilisateur a précisé qu'aucune facturation ni paiement ne doit être mis en place actuellement. Le texte existant de l'interface qui demande un « numéro d'abonnement après activation du paiement » ne doit donc pas devenir une dépendance du Messenger.

Le parcours doit utiliser, après validation institutionnelle, un identifiant scolaire ou un code de vérification émis par le lycée/organisme compétent, sans paiement. La source officielle vérifiable de l'inscription individuelle de chaque élève n'est toujours pas confirmée. Un numéro saisi librement par l'élève ou les champs de profil ne constituent pas une preuve suffisante.

## Impacts techniques obligatoires avant activation

- Remplacer la compatibilité locale de `msg_can_dm` pour les DM élève↔élève par un résolveur serveur national d'affiliation et d'état de compte ; ne pas simplement supprimer les contrôles actuels.
- Durcir ensemble `msg_open_direct`, `msg_member_ok` et `msg_guard_direct` afin qu'aucun chemin RPC, RLS, trigger ou client ne contourne l'invitation acceptée.
- Garantir l'acceptation atomique et l'identité exacte des deux participants.
- Préserver les conversations historiques par une stratégie explicite et auditée ; ne pas les supprimer ni les considérer automatiquement sûres.
- Ajouter préférences de confidentialité, blocage bilatéral, signalement, limites d'invitations, pagination et protection contre l'énumération.
- Tester avec des comptes synthétiques sur PostgreSQL 17 isolé, avec JWT/roles réels de test et sans utiliser postgres/service_role pour prétendre valider RLS.

## Matrice minimale de recette

| Émetteur | Destinataire | Résultat attendu |
|---|---|---|
| 1AS vérifié | 1AS vérifié, autre lycée | Invitation possible |
| 1AS vérifié | 2AS vérifié, autre wilaya | Invitation possible |
| 1AS vérifié | 3AS vérifié, autre filière | Invitation possible |
| 2AS vérifié | 1AS vérifié | Invitation possible |
| 3AS vérifié | 2AS vérifié | Invitation possible |
| Élève non vérifié | Tout niveau | Refus serveur |
| Élève vérifié bloqué | Tout niveau | Refus serveur |
| Invitation refusée/en attente | Toute paire | Aucun DM utilisable |
| Compte suspendu | Tout niveau | Refus serveur |
| Élève ↔ professeur non affecté | Tout niveau | Refus selon règle professionnelle distincte |

## État de livraison

Cette décision formalise la portée produit, elle ne rend pas la fonction disponible dans l'application. Le code et le backend actuels ne doivent pas être présentés comme un Messenger national inter-niveaux fonctionnel.

- Aucune écriture, migration, RPC, policy, GRANT, Auth, Storage ou Realtime exécutée sur Supabase actif.
- Aucun projet ou branche Supabase supplémentaire créé ; aucun frais ni paiement.
- Aucun test PostgreSQL/RLS comportemental exécuté.
- Aucun workflow CI hébergé, déploiement ou merge lancé.
- PR #17 reste ouverte et non fusionnée ; `main` reste inchangée.

**GO :** décision produit et préparation du patch isolé.  
**NO-GO :** migration active et ouverture de l'annuaire/DM national tant que la preuve institutionnelle d'affiliation et l'environnement PostgreSQL isolé ne sont pas disponibles.

# Lot 382 — identités synthétiques Messenger

Ces identités sont des fixtures de test, pas des comptes à créer dans Supabase actif.
Aucune adresse e-mail réelle, aucun mot de passe, aucun matricule et aucune donnée personnelle.

| Alias | UUID déterministe | Profil | Vérification | Périmètre | Usage |
|---|---|---|---|---|---|
| A | 00000000-0000-4000-8000-00000000000a | eleve | verifie | Wilaya 01 / 2AS / SC | Créateur DM |
| B | 00000000-0000-4000-8000-00000000000b | eleve | verifie | Wilaya 01 / 2AS / SC | Destinataire DM |
| C | 00000000-0000-4000-8000-00000000000c | eleve | verifie | Wilaya 01 / 2AS / SC | Tiers non membre |
| D | 00000000-0000-4000-8000-00000000000d | eleve | verifie | Wilaya 01 / 2AS / SC | Bloqueur / bloqué selon le scénario |
| E | 00000000-0000-4000-8000-00000000000e | eleve | en_attente | Wilaya 01 / 2AS / SC | Demande non vérifiée |
| F | 00000000-0000-4000-8000-00000000000f | eleve | rejete | Wilaya 01 / 2AS / SC | Vérification rejetée |
| G | 00000000-0000-4000-8000-000000000010 | eleve | verifie | Wilaya 02 / 2AS / SC | Autre wilaya |
| H | 00000000-0000-4000-8000-000000000011 | eleve | verifie | Wilaya 01 / 3AS / SC | Autre niveau |
| M1 | 00000000-0000-4000-8000-000000000012 | prof (fixture) | sans objet | Wilaya 01 | Modérateur local à habiliter |
| M2 | 00000000-0000-4000-8000-000000000013 | prof (fixture) | sans objet | Wilaya 02 | Modérateur hors périmètre |
| ADM | 00000000-0000-4000-8000-000000000014 | admin (fixture) | sans objet | National | Contrôle administratif dédié |

Les UUID sont réservés à une base de test jetable. Ils ne doivent jamais être utilisés comme vrais identifiants de comptes.

## Règles de construction

1. Créer les utilisateurs uniquement via un adaptateur de test Auth local, jamais via le projet Supabase actif.
2. Les fixtures doivent être synthétiques et ne contenir ni e-mail réel, ni mot de passe, ni token.
3. La création d'un utilisateur doit d'abord passer par Auth local ; le trigger de création de profil est ensuite testé séparément si son environnement est reproduit.
4. Ne jamais injecter directement `role='admin'` ou `role='prof'` dans une table de production. Dans le test isolé, les privilèges de M1/M2/ADM doivent être accordés par des fixtures administratives explicites et vérifiées.
5. Les tests ne doivent pas conclure qu'une valeur de wilaya/niveau/filière reçue de `raw_user_meta_data` est fiable.
6. Pour les tests d'annuaire national, distinguer profil minimal visible, vérification interne et preuve officielle d'affiliation au lycée.
7. L'identité `E` et `F` ne doit jamais accéder à la messagerie privée si la règle produit exige `verif_statut='verifie'`.

## Scénarios à exécuter quand le PostgreSQL isolé sera disponible

- AUTH-01 : création d'un utilisateur avec `requested_role='parent'` crée une demande parent en attente, sans lui attribuer un rôle parent.
- AUTH-02 : une valeur `requested_role='admin'` reste un compte `eleve`.
- AUTH-03 : les valeurs scolaires déclaratives du signup ne deviennent pas une preuve officielle d'affiliation.
- VER-01 : E et F ne peuvent pas ouvrir un DM avec A/B.
- VER-02 : seul le vérificateur habilité peut passer E de `en_attente` à `verifie`.
- SCOPE-01 : M2 ne peut pas vérifier un profil de Wilaya 01 s'il n'a pas le périmètre correspondant.
- DM-01 : A/B dans le même périmètre vérifié ne peuvent pas établir un DM sans invitation acceptée.
- DM-02 : G et H ne peuvent pas contourner les règles de compatibilité par un appel RPC ou INSERT direct.
- MOD-01 : M1 ne peut effectuer que les actions de modération prévues par ses permissions, M2 reste limité à sa wilaya.

Statut : spécification uniquement. Aucun compte créé et aucun test exécuté.

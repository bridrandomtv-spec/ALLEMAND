# Lot 283 — matrice de tests négatifs du journal Auth

**Statut : plan de test documentaire, non exécuté.** Aucun projet de test Supabase n'est actuellement utilisé dans ce lot.

## 1. Contrat à vérifier

Le hook reçoit un événement avant l'émission du jeton. Le seul événement stocké par le brouillon est `auth_token_preissue`. Il ne faut jamais le présenter comme une preuve de réception du jeton par le navigateur ni comme une ouverture de page.

La fonction doit :
- retourner les claims d'origine sans altération ;
- ne jamais faire confiance à un `user_id` qui ne correspond pas à `claims.sub` ;
- ignorer les renouvellements `token_refresh` et les changements d'e-mail `email_change` ;
- ne conserver qu'une observation par `session_id` ;
- ne pas bloquer l'émission du jeton si la seule opération d'insertion échoue ;
- refuser les claims absents ou non objet, sans fabriquer de jeton incomplet.

## 2. Matrice de tests

| ID | Scénario | Résultat attendu | Gravité si échec |
|---|---|---|---|
| T01 | Événement valide, utilisateur et `claims.sub` identiques | Une ligne avec acteur et session attendus | Critique |
| T02 | `user_id` différent de `claims.sub` | Aucune ligne ; claims inchangés | Critique |
| T03 | `session_id` absent | Aucune ligne ; claims inchangés | Haute |
| T04 | `session_id` non UUID | Aucune ligne ; Auth continue si seule l'insertion échoue | Haute |
| T05 | `token_refresh` répété 20 fois | Aucune nouvelle ligne | Haute |
| T06 | `email_change` | Aucune ligne | Moyenne |
| T07 | Même session envoyée plusieurs fois avec méthode admissible | Une seule ligne, grâce à la contrainte unique | Haute |
| T08 | Méthodes `password`, `otp`, `magiclink`, `invite`, `email/signup` | Comportement documenté et conforme à la politique métier ; aucune assimilation automatique à une connexion interactive | Haute |
| T09 | Utilisateur anonyme | Aucune inclusion dans le rapport des élèves ; règle d'exclusion explicitement testée | Haute |
| T10 | Table indisponible ou insertion refusée | Claims d'origine retournés ; Auth n'est pas bloqué ; lacune de journalisation reconnue | Critique |
| T11 | Claims absents, null ou tableau JSON | Échec fermé du hook ; aucun jeton incomplet émis | Critique |
| T12 | Rôle `anon` | SELECT, INSERT et exécution de la fonction refusés | Critique |
| T13 | Rôle `authenticated` | SELECT, INSERT et exécution de la fonction refusés | Critique |
| T14 | Rôle `supabase_auth_admin` | Peut exécuter le hook selon le paramétrage Supabase ; aucun accès direct non nécessaire à la table | Haute |
| T15 | Jeton, refresh token, e-mail, IP et user-agent | Aucune de ces données dans la table ni les logs applicatifs du hook | Haute |
| T16 | Suppression d'un compte | Politique de rétention/suppression explicitée ; aucune donnée orpheline non maîtrisée | Haute |

## 3. Contrôles SQL de revue (à exécuter uniquement en environnement isolé)

Après création du brouillon dans une base de test, contrôler les privilèges effectifs avec `has_table_privilege`, `has_schema_privilege` et `has_function_privilege` pour `anon`, `authenticated`, `supabase_auth_admin` et le propriétaire de la fonction.

Vérifier également :
- que la table est dans un schéma non exposé par l'API REST ;
- qu'aucune policy RLS n'accorde d'accès direct aux rôles navigateur ;
- que le propriétaire effectif de la fonction est celui attendu ;
- que la fonction n'est pas déjà présente avant installation ;
- que l'exécution du hook par Supabase utilise bien le rôle documenté ;
- que le propriétaire de la fonction a les privilèges requis sur la table ;
- que les erreurs d'insertion sont observables côté opérateur sans divulguer de secrets.

Le brouillon actuel utilise `SECURITY DEFINER` et un `search_path` vide. Il faut néanmoins confirmer le propriétaire et les droits réels après installation dans le projet de test. Le `GRANT EXECUTE` au rôle Auth n'est pas une preuve suffisante à lui seul.

## 4. Points de conception à résoudre avant activation

1. **Signup et invitations :** décider si ces méthodes doivent compter comme une session d'élève, ou rester dans une catégorie distincte.
2. **Anonymes :** exclure explicitement `is_anonymous = true` ou documenter leur traitement.
3. **Échec d'insertion :** le mode fail-open protège l'authentification, mais rend le journal incomplet. Prévoir une métrique opérationnelle indépendante sans bloquer Auth.
4. **Suppression et rétention :** choisir une durée, une purge et une politique de suppression conforme aux obligations de la plateforme.
5. **Sémantique :** conserver `auth_token_preissue`. Ne pas renommer `auth_login_success` tant qu'une source ne prouve pas la réussite effective de l'authentification.
6. **Portée :** ce hook ne couvre pas les échecs d'authentification antérieurs à son invocation.

## 5. Critères de sortie

Le mécanisme ne peut passer à une phase d'implémentation active que si :
- tous les tests critiques et élevés passent dans un projet isolé ;
- les privilèges effectifs sont vérifiés, pas seulement supposés ;
- le comportement signup/invitation/anonyme est décidé ;
- le traitement des erreurs et des lacunes est visible et documenté ;
- la rétention et la suppression sont définies ;
- une autorisation explicite est donnée pour les changements distants.

**Aucun test de cette matrice n'est déclaré réussi dans ce lot.**

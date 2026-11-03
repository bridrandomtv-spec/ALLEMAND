# Dossier de continuité — Lycée Virtuel Algérien (ALLEMAND)

**Dernière mise à jour : 3 novembre 2026**  
**Dépôt :** `bridrandomtv-spec/ALLEMAND`  
**PR de travail :** [#17](https://github.com/bridrandomtv-spec/ALLEMAND/pull/17)  
**Branche :** `design/prototypes-67-74-alignment`  
**Preview validée par l'utilisateur :** https://ec6160ef-allemand.brid-randomtv.workers.dev  
**Production :** https://allemand.brid-randomtv.workers.dev/#accueil

---

## 1. État de référence confirmé

- L'utilisateur a testé la preview Cloudflare du commit `29aafce` et a confirmé : **« tout est super »**.
- Commit : `29aafce28bec6e5ac8541d5e5e52beddccce78ff`.
- Build Cloudflare : réussi.
- Déploiement Cloudflare : réussi, le 3 novembre 2026 à 14:46 UTC.
- CI GitHub : réussie (run #1812).
- PR #17 : ouverte, en brouillon, non fusionnée.
- `main` : inchangée par ce travail.
- Le cache du service worker est en `dz-de-v3.138.0`. Les références CSS, favicon et patch IA ont été alignées.

**Ne pas rouvrir ces vérifications sans nouvel indice concret ou demande de l'utilisateur.** Le rendu de cette preview est accepté par l'utilisateur.

## 2. Règles impératives pour la suite

1. Continuer sur la PR #17 et sa branche existante.
2. Ne créer aucune nouvelle branche.
3. Ne pas fusionner, fermer ou sortir la PR du brouillon.
4. Ne pas modifier `main`.
5. Ne pas lancer de déploiement manuel et ne pas modifier les paramètres Cloudflare.
6. Pas de Tailwind ni de nouvelle dépendance frontend.
7. Préserver les IDs, routes, événements, fonctions et modules existants.
8. Pour les tâches de design, ne pas modifier Supabase, Auth, RLS, schémas ou paiements.
9. Faire des changements ciblés, utiles et vérifiables. Pas de commits cosmétiques ni de réécritures générales.
10. Ne jamais prétendre à un test visuel ou fonctionnel qui n'a pas réellement été exécuté.
11. Ne pas refaire une vérification déjà concluante simplement pour remplir une réponse.
12. Après chaque action, indiquer clairement : ce qui a été modifié, le commit, le résultat des tests et la prochaine action concrète.

## 3. Objectifs produit et design déjà exprimés

- Plateforme secondaire algérienne multi-matières, interface arabe RTL.
- Identité visuelle algérienne : vert, blanc, rouge.
- Navigation horizontale dans l'en-tête, sans barre latérale sur ordinateur ni tiroir latéral sur mobile.
- Typographie arabe élégante et lisible.
- Mode sombre lisible pour le logo, le titre, les textes, les cartes, les champs et la navigation.
- Supprimer complètement « التربية البدنية » de l'offre de matières à étudier.
- Conserver le style apprécié pour les titres d'exercices, par exemple : « تمرين 1: المفردات - الأوقات ».
- Ne pas présenter une matière partielle comme entièrement opérationnelle.
- Préserver les fonctionnalités pédagogiques et les parcours existants.

## 4. Périmètre actuel de la PR #17

La PR comprend des changements visuels mais aussi fonctionnels. Les fichiers examinés dans le dernier audit incluent notamment :

- `app.js` : registre des unités, navigation, flux de réponse du professeur IA.
- `public-portal.js` : exploration publique des matières et des niveaux.
- `js/voice-chat.js` : dictée vocale.
- `index.html` : structure de l'accueil public et de l'application.
- CSS et `sw.js` : présentation, thème et cache.
- `masar.js` : libellés arabes du parcours.

L'audit a relevé que la PR ne doit pas être considérée comme purement graphique. Cela justifie des tests ciblés, pas une boucle de vérifications générales.

## 5. État de la dernière session

L'utilisateur a confirmé que la preview `29aafce` lui convient visuellement (« tout est super »).

L'assistant a ensuite commencé un audit de non-régression et a annoncé vouloir vérifier inscription, connexion, navigation et professeur IA. Aucun nouveau changement de code n'a été effectué pendant cet audit.

L'utilisateur a signalé à juste titre que le travail tourne en rond et qu'il manque un document de continuité réutilisable.

## 6. Prochaine méthode de travail — arrêter les audits circulaires

À la reprise :

1. Lire ce dossier avant toute action.
2. Ne pas refaire le contrôle du cache, de la preview ou du mode sombre : ils sont déjà validés à ce stade.
3. Identifier une seule prochaine tâche produit utile, à partir des demandes encore ouvertes et des changements de la PR.
4. Pour cette tâche, inspecter uniquement les fichiers et fonctions nécessaires.
5. Si une correction est justifiée, la faire directement sur la branche existante de la PR #17, sans nouvelle branche.
6. Exécuter les tests ciblés pertinents et vérifier le résultat.
7. Fournir un compte rendu court avec le commit et le résultat concret.
8. Si aucune action n'est possible sans une information de l'utilisateur, poser une seule question précise au lieu de répéter l'audit.

**Priorité : faire progresser la plateforme par des changements utiles, pas multiplier les vérifications sans résultat.**

## 7. Liens utiles

- PR #17 : https://github.com/bridrandomtv-spec/ALLEMAND/pull/17
- Preview validée : https://ec6160ef-allemand.brid-randomtv.workers.dev
- Production : https://allemand.brid-randomtv.workers.dev/#accueil
- Dépôt : https://github.com/bridrandomtv-spec/ALLEMAND
- Branche de travail : https://github.com/bridrandomtv-spec/ALLEMAND/tree/design/prototypes-67-74-alignment

---

**Règle de reprise :** ce document est la référence de continuité. Ne pas demander à l'utilisateur de répéter les décisions déjà consignées. Mettre à jour ce document lorsqu'un changement réel intervient.


## 8. Avancement du 3 novembre 2026 — garde du portail public

- Comparaison de la PR #13 avec la PR #17 : aucun élément de navigation latérale de la PR #13 n'a été repris, car il contredit la navigation horizontale validée.
- Contrôle des données du portail : 1AS (2 troncs communs), 2AS et 3AS (6 filières chacun) ; allemand uniquement en 2AS/3AS ; anglais marqué partiel ; « التربية البدنية » absent.
- Ajout de `ci/check-public-portal.mjs` pour contrôler automatiquement la cohérence des filières, les matières référencées, les statuts de disponibilité et la transmission du niveau/de la filière vers le formulaire d'inscription existant.
- Ajout de cette vérification au workflow `.github/workflows/deploy.yml`.
- Commit de la garde : `1aa3f0adff71a6ff42a3afd86598bbf703c690ab`.
- Commit d'intégration CI : `7bf6bf0e8d1392f0c14a8412a88b365e1586163d`.
- Exécution GitHub Actions #1815 créée pour `7bf6bf0` ; son état au moment de cette mise à jour est **pending**. Ne pas annoncer le test comme réussi avant la fin du workflow.
- Aucun changement dans `auth.js`, Supabase, Auth côté serveur, RLS, paiements ou production.


### Résultat CI confirmé — 3 novembre 2026

- GitHub Actions #1815 : **success**, terminé à 15:20:54 UTC.
- La nouvelle étape « Vérifier le portail public (catalogue et inscription) » s'est exécutée avec succès.
- Le contrôle de syntaxe JavaScript et les étapes précédentes du workflow ont également terminé sans échec.
- Le test est automatisé dans la CI ; aucun test manuel du navigateur ni validation visuelle nouvelle n'est revendiqué.
- PR #17 reste ouverte, en brouillon et non fusionnée. `main` et la production restent inchangées.


## 9. Revue ciblée du parcours public d'inscription — 3 novembre 2026

- Relecture de `public-portal.js`, `auth.js`, `app.js`, `index.html` et de la garde `ci/check-public-portal.mjs`, sur la branche `design/prototypes-67-74-alignment`.
- Le parcours de préremplissage est cohérent dans le code : le portail affecte le niveau, déclenche son événement `change` (qui recharge les filières), puis affecte la filière avant d'ouvrir l'onglet d'inscription existant.
- `bootGate()` initialise les listes du formulaire et `bindGateEvents()` est appelé sur le portail sans session ; le gestionnaire de soumission lit ensuite les valeurs des champs existants.
- Aucun défaut certain n'a été établi par cette revue statique. Aucun fichier applicatif n'a été modifié et aucun changement Auth/Supabase/RLS n'a été effectué.
- Limite explicite : cette lecture du code et le test CI ne remplacent pas un essai manuel dans un navigateur, de la sélection de la filière jusqu'à la création du compte et à l'ouverture de l'espace.
- Vérification GitHub du commit `533921d` : workflow CI #41663000157 terminé avec succès ; toutes les étapes du job, dont « Vérifier le portail public (catalogue et inscription) », sont en succès.
- État PR #17 au contrôle : ouverte, `mergeable=true`, toujours en brouillon ; base `main` ; aucun merge effectué.
- Prochaine étape avant fusion : un essai navigateur réel du parcours d'inscription/connexion. Tant qu'il n'est pas réalisé, ne pas présenter la validation fonctionnelle complète comme acquise.


### Suivi après la revue — 3 novembre 2026

- CI du commit documentaire `68e4990` : run #41667525171 **success**.
- Dernière preview Cloudflare confirmée dans les commentaires de la PR : `533921d`, build et déploiement réussis ; URL de branche : https://design-prototypes-67-74-alignment-allemand.brid-randomtv.workers.dev ; URL propre au commit : https://4a490678-allemand.brid-randomtv.workers.dev.
- Le commit `68e4990` ne contient qu'une mise à jour documentaire ; la preview Cloudflare confirmée pointe sur `533921d`, qui contient les derniers changements applicatifs et les tests CI, pas le commit documentaire.
- Aucun test interactif dans un navigateur n'a été exécuté par l'assistant. L'essai de bout en bout inscription → connexion → espace utilisateur reste donc à valider manuellement.
- PR #17 toujours ouverte, brouillon, non fusionnée ; `main` inchangée.


### État confirmé après le contrôle CI — 3 novembre 2026, 22 h (heure d'Algérie)

- HEAD actuel de la branche : `84f259b4cb1b45b010495598bc0d2113d3367159`.
- GitHub Actions #1819 (run `41667815989`) : **success** sur ce HEAD.
- Détail du job « Validation structurelle & pédagogique » : toutes les étapes sont en succès, notamment « Vérifier le portail public (catalogue et inscription) », la garde d'accès, la matrice des parcours et les tests de régression.
- Métadonnées GitHub de la PR #17 relues : `state=open`, `draft=true`, `merged=false`, `mergeable=true`. Le signal de fusion est donc actuellement favorable, mais la PR reste volontairement en brouillon.
- La preview Cloudflare de branche confirmée par le bot correspond toujours au commit applicatif `533921d` : https://design-prototypes-67-74-alignment-allemand.brid-randomtv.workers.dev ; build et déploiement annoncés réussis. Le HEAD `84f259b` est documentaire et ne change pas l'application.
- Aucune navigation interactive complète n'a pu être exécutée depuis cet environnement. Le test réel inscription → création du compte → connexion → espace utilisateur et le contrôle visuel mobile/ordinateur ne sont donc pas revendiqués.
- Aucun fichier applicatif modifié pendant ce contrôle ; aucune fusion, aucun changement sur `main`, aucun déploiement de production.
- Prochaine décision : validation manuelle du parcours par l'utilisateur sur la preview. Après confirmation, demander séparément l'autorisation de sortir la PR du brouillon, puis l'autorisation de fusionner.

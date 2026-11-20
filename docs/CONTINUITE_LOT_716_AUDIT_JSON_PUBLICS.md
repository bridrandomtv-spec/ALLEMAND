# Continuité — Lot 716 : audit ciblé des ressources JSON publiques

Date : 2026-11-20  
Branche : `ai/rag-corpus-integrity-lot-635`  
PR : #23  
Portée : lecture seule, vérification ciblée des ressources JSON récemment recensées, des consommateurs JavaScript et des règles Worker. Aucun contenu nominatif, identifiant financier ou numéro de contact n'est reproduit ci-dessous.

## 1. Inventaire réconcilié

L'arbre Git récursif du HEAD `e91f0a474030f33a18290e66db458fb16dc239df` contient **58 fichiers JSON sous `assets/bdd/`**, ce qui confirme le décompte du Lot 713. La mention antérieure de 63 était une erreur de comptage et est corrigée ici. Le présent lot reste un audit ciblé et ne prétend pas avoir audité en profondeur les 58 fichiers individuellement.

## 2. Ressources examinées sans anomalie personnelle évidente

- `questions_eleve.json` : bibliothèque de motifs linguistiques/intentionnels, sans profil ni identifiant d'élève.
- `vocabulaire_eleve.json` : liste lexicale allemande/arabe ; métadonnées indiquant une source fournie par l'utilisateur et une intégration autorisée.
- `onboarding.json` : textes génériques par rôle avec variables de substitution (`{nom}`, `{classe}`), pas de profil nominatif incorporé.
- `intent_eval_set.json` : 103 formulations de test linguistiques et étiquettes d'intention ; pas de profils utilisateurs.
- `intent_eval_results.json` : métriques retirées/infirmées, statut `invalidated_pending_recomputation`, aucun résultat de précision publié.
- `corpus_rag_manifest.json` : manifeste public indiquant zéro document et zéro chunk indexé ; aucune donnée vectorielle ou document source déclarée dans ce manifeste.
- `shards_manifest.json` : manifeste vide (0 shards, 0 chunks).
- `access_config.json` : expose des règles de parcours gratuit/payant et des rôles, mais l'extrait examiné ne contient pas de secret d'authentification. La visibilité de ces règles relève de la configuration produit, pas d'une fuite de clé.

## 3. Données potentiellement identifiantes dans un contenu pédagogique

`assets/bdd/sujet14_farid.json` contient un texte d'exercice avec un personnage nommé et des détails familiaux, âge, professions, ville, établissement scolaire et composition de classe. Les métadonnées indiquent une source fournie par l'utilisateur et une licence d'intégration autorisée, mais ne certifient pas explicitement que tous les éléments narratifs sont fictifs.

- Qualification : **contenu pédagogique potentiellement identifiant, caractère fictif non confirmé**.
- Le nom et les détails ne sont pas reproduits dans ce rapport.
- Aucun lien statique vers ce fichier n'a été trouvé dans la recherche ciblée de `app.js`; cela ne suffit pas à conclure qu'aucun autre mécanisme ne le charge.
- Ne pas supprimer ni réécrire le contenu sans confirmer sa nature et son usage pédagogique.

## 4. Ressource de démonstration correctement étiquetée

`assets/bdd/journee.json` porte une métadonnée explicite de démonstration. `journee.js` lit cette métadonnée et affiche un avertissement « modèle de démonstration » ; les horaires, salles, sections et noms d'enseignants sont présentés comme une maquette et non comme le planning personnel du compte.

Cela réduit le risque de confusion dans l'interface, mais ne constitue pas un contrôle d'accès : le JSON reste lisible publiquement. Aucune donnée élève nominative n'a été identifiée dans l'extrait examiné.

## 5. Réservation : publication fonctionnelle

`reservation.json` est chargé par `reservation.js`. Le canal de contact est réutilisé dans le récapitulatif et le lien WhatsApp de confirmation. Il s'agit donc d'une donnée volontairement consommée par le parcours public de réservation, contrairement aux coordonnées de paiement trouvées dans `config.json`.

- Aucun changement proposé sans validation du propriétaire sur le caractère public et l'exactitude de ces coordonnées.
- Le fait que le fichier soit public doit rester une décision explicite, car il contient également le catalogue des enseignants, villes et tarifs.

## 6. Contrôle Worker et exposition

Le Worker `src/site-worker.js` :
- applique `Cache-Control: no-store` aux chemins `/assets/bdd/` ;
- protège par `PROT` une liste limitée de ressources pédagogiques payantes ;
- ne protège pas `config.json`, `plan_projet.json`, `sujet14_farid.json`, `journee.json` ni `reservation.json`.

`no-store` empêche la mise en cache mais n'empêche ni la lecture anonyme de l'URL statique ni l'accès direct au dépôt GitHub public.

Le chargement de `plan_projet.json` par `projet.js` est direct (`fetch` statique) et aucun contrôle de rôle côté serveur n'a été trouvé dans ce script. La mention « Document confidentiel » reste donc incompatible avec la surface d'accès actuelle, sauf si le propriétaire décide que ce dossier doit finalement être public.

## 7. Décisions nécessaires avant correction

1. **Paiement — priorité haute :** autoriser ou non le retrait des coordonnées de paiement de `config.json` et leur séparation du proxy public `ia_proxy`. Ne pas publier les coordonnées dans un autre fichier public.
2. **Plan de projet — priorité haute :** confirmer si le document marqué confidentiel est destiné à être accessible à tout visiteur. Si non, définir une stratégie de retrait de la surface publique et de l'historique Git ; l'ajout aveugle à `PROT` casserait le chargement actuel sans garantir l'accès aux bons rôles.
3. **Exercice Farid — priorité à confirmer :** confirmer qu'il s'agit d'un personnage entièrement fictif ou d'un texte pédagogique autorisé à être publié avec ces détails.
4. **Réservation — décision produit :** confirmer que les coordonnées de contact et le catalogue enseignants sont bien destinés au public.
5. **Inventaire :** conserver le total vérifié de 58 JSON sous `assets/bdd/` et poursuivre l'examen ciblé des ressources non encore étudiées.

## 8. État des modifications

- Audit en lecture seule : aucun JSON, JS, Worker, règle d'accès ou configuration produit modifié.
- Aucun changement Supabase, Auth, RLS, schéma, abonnement ou paiement.
- Aucune modification de `main`, aucune fusion et aucun déploiement.
- Les rapports ne reproduisent aucune valeur de paiement, aucun téléphone ni donnée nominative du texte pédagogique.
- PR #23 reste ouverte et en brouillon ; les décisions de publication demeurent des points bloquants de sécurité.

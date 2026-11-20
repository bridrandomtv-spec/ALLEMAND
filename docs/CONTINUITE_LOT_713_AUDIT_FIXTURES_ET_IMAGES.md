# Continuité — Lot 713 : audit des fixtures élèves et archives visuelles

Date : 2026-11-20  
Branche : `ai/rag-corpus-integrity-lot-635`  
PR : #23  
Portée : inventaire et audit structurel en lecture seule. Aucune valeur personnelle n'est reproduite dans ce rapport.

## 1. CI du HEAD précédent

Sur le HEAD `1a9c8c08647544cbc6de368cfafb4d692f535885` :
- CI principale `44788376113` : terminée avec succès.
- Validation structurelle et pédagogique : succès.
- Tests autonomes Professeur IA : succès, y compris audit PDF, Worker, contrôles d'accès, QUST, ontologie et régression RAG.
- Trois workflows PostgreSQL `44788376133`, `44788376187`, `44788376240` : succès.

## 2. Inventaire public

Arbre Git de la branche :
- 58 fichiers JSON dans `assets/bdd/`.
- 293 PDF au total dans le dépôt.
- 569 images dans `docs/archive/images/`.
- `docs/private/buch_pages_full.json` reste le seul fichier dans `docs/private/`.

Les exclusions `.assetsignore` de `docs/archive` et `docs/private` empêchent leur inclusion dans le bundle Cloudflare, mais ne rendent pas les fichiers privés dans le dépôt GitHub public.

## 3. Fixtures contenant des champs de données personnelles

L'inspection structurelle des JSON publics a identifié :
- `assets/bdd/eleves.json` : 32 enregistrements élèves avec des champs matricule, prénom, nom, date de naissance, wilaya/ville, téléphone du parent et email ; ces champs sont renseignés dans les enregistrements.
- `assets/bdd/parents.json` : 2 fiches enfant avec nom/prénom, matricule, naissance, localisation et données scolaires.
- `assets/bdd/live.json` : 32 entrées élèves avec nom/prénom, matricule, ville et état de présence/connexion.
- `assets/bdd/classe.json` : données de classes, effectifs, présences, notes et messages, principalement sous forme de maquette structurée.

Les métadonnées de `eleves.json`, `parents.json` et `live.json` affirment que les données sont locales au navigateur (`localStorage`) et ne sont pas transmises à un serveur. Cette déclaration ne neutralise pas l'exposition GitHub : les fichiers JSON eux-mêmes sont dans le dépôt public et ne figurent pas dans les motifs `PROT` du Worker.

**Qualification prudente :** plusieurs champs ont une apparence de données de démonstration/placeholder, mais l'audit n'a pas établi que chaque identité, date, téléphone et adresse électronique est fictif. Il faut donc traiter ces fichiers comme des fixtures potentiellement identifiantes jusqu'à validation par le propriétaire. Aucune valeur personnelle n'est copiée dans ce rapport.

## 4. Archives visuelles

569 fichiers image sont présents sous `docs/archive/images/`. Ils sont exclus du bundle Cloudflare par l'exclusion de `docs/archive`, mais restent consultables directement dans le dépôt public. Leur nature (captures de pages, documents, photos de personnes ou autres) n'a pas encore été classifiée individuellement. Il serait incorrect d'affirmer qu'ils contiennent des données personnelles sans inspection visuelle.

## 5. Décisions nécessaires avant correction

1. Confirmer que les 32 profils de `eleves.json`, les 2 fiches enfant de `parents.json` et les 32 entrées de `live.json` sont exclusivement des données synthétiques.
2. Si ces données ne sont pas toutes fictives, autoriser explicitement leur neutralisation ou leur déplacement vers une source protégée. Aucun fichier n'a été modifié dans ce lot.
3. Faire classifier les 569 images avant toute suppression ou publication maintenue.
4. Décider séparément du retrait de `docs/private/buch_pages_full.json` et du traitement de son historique Git.

## 6. Mesures et limites

- Audit de structure, de clés et de complétude des champs, sans reproduire les valeurs.
- Aucune modification des JSON, images, PDF ou règles Worker.
- Aucun changement Supabase/Auth/RLS/schéma, aucun changement `main`, aucun déploiement.
- Aucun contenu pédagogique supprimé ou réécrit.

PR #23 demeure ouverte, brouillon et non fusionnée.

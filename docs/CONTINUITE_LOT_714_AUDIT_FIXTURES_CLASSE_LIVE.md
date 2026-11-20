# Continuité — Lot 714 : exposition des fixtures de classe et de session live

Date : 2026-11-20  
Branche : `ai/rag-corpus-integrity-lot-635`  
PR : #23  
Portée : audit en lecture seule des JSON, de leurs consommateurs JavaScript et de la garde Worker. Aucune valeur personnelle ou ligne nominative n'est reproduite ici.

## 1. Résultat principal

Les fichiers `assets/bdd/classe.json`, `live.json`, `eleves.json` et `parents.json` sont servis comme actifs statiques. Aucun de leurs chemins ne correspond aux motifs `PROT` de `src/site-worker.js`. Le Worker applique `Cache-Control: no-store` aux chemins `/assets/bdd/`, mais cette directive ne constitue pas un contrôle d'accès : une requête directe sans JWT est transmise à `env.ASSETS.fetch(request)`.

Les fichiers sont également présents dans l'arbre du dépôt GitHub public. L'exclusion éventuelle du bundle Cloudflare ne protège pas les URL GitHub de contenu brut/API.

## 2. Consommateurs vérifiés

- `classe.js` charge directement `assets/bdd/classe.json`, sans contrôle de rôle avant le `fetch`. Le choix de section dépend de `AUTH.session()` côté navigateur, avec repli sur `2AS-3`.
- `live.js` charge directement `assets/bdd/live.json`, sans contrôle de rôle avant le `fetch`.
- `prof.js` vérifie côté client que le rôle vaut `prof` avant de charger `assets/bdd/eleves.json`. Cette vérification protège le rendu de l'interface, pas l'URL statique elle-même.
- `parents.js` vérifie côté client le rôle `parent` avant de charger `assets/bdd/parents.json`. L'en-tête de cette interface précise explicitement que les données affichées sont des données de démonstration et ne représentent pas les résultats d'un élève réel.

Aucun de ces contrôles JavaScript ne remplace une autorisation serveur sur le fichier JSON.

## 3. Qualification par fichier

### `eleves.json`
- 32 profils ; identifiants et noms explicitement génériques, matricules préfixés `DZ-DEMO`, emails sous le domaine réservé `demo.invalid`, villes/lycées libellés comme démonstration.
- Présence de dates artificielles et d'au moins une date calendaire invalide, ce qui renforce l'indice de données synthétiques.
- Le fichier contient néanmoins des champs de nature sensible s'ils étaient réels : date de naissance, téléphone parent, localisation, résultats, absences, retards et appréciations.
- Conclusion : indices forts d'un jeu de démonstration, sans preuve indépendante de l'origine de chaque valeur.

### `parents.json`
- Deux fiches enfant avec identifiants et noms explicitement démonstratifs.
- Le code JavaScript et l'interface identifient explicitement le jeu comme démonstration ; l'interface précise qu'il ne représente pas un élève réel.
- Le JSON contient malgré tout des champs scolaires et de présence qui seraient sensibles s'ils étaient réels.
- Conclusion : jeu de démonstration déclaré, mais inutilement exposé comme ressource publique sans restriction.

### `live.json`
- 32 entrées de classe avec noms, matricules, villes, statut de présence/retard, état micro/caméra, latence, points et participation.
- Les métadonnées décrivent l'absence de stockage serveur des flux audio/vidéo et un chat local ; elles ne déclarent pas clairement que les identités et les métriques statiques sont fictives.
- Les identifiants et noms ne correspondent pas au schéma de placeholders de `eleves.json`. L'audit ne permet donc pas de confirmer que toutes les valeurs sont synthétiques.
- Conclusion : priorité élevée à la confirmation du caractère fictif et à la neutralisation des identités/indicateurs avant exposition publique.

### `classe.json`
- Maquette structurée : ses métadonnées la décrivent comme alignée sur une maquette et mélangent des données de démonstration et des fiches professeurs.
- Le JSON contient des effectifs, emplois du temps, noms d'enseignants, présences, notes, appréciations et messages. Une note d'absence fait même référence à un justificatif médical.
- Le script `classe.js` charge le fichier sans contrôle de rôle préalable.
- Conclusion : données probablement issues de la maquette, mais le caractère synthétique de chaque entrée nominative et de chaque note n'est pas certifié.

## 4. Risque et sévérité

**Risque confirmé : exposition publique sans authentification des quatre JSON.** La présence de `no-store` évite la mise en cache par les intermédiaires compatibles ; elle ne bloque ni la lecture directe ni le téléchargement.

**Risque de confidentialité conditionnel :** si une partie des identités, présences, notes ou indicateurs live correspond à des personnes réelles, leur exposition est non conforme à l'intention de confidentialité annoncée dans les interfaces. L'audit ne publie aucune valeur nominative.

## 5. Décisions requises avant correction

1. Confirmer formellement que toutes les données de `live.json` et `classe.json` sont synthétiques, en particulier les identités, notes, présences et messages.
2. Confirmer que les jeux `eleves.json` et `parents.json` sont exclusivement fictifs et peuvent rester publics en tant que fixtures de démonstration.
3. Choisir une stratégie compatible avec le fonctionnement actuel : retirer les identifiants et champs superflus des fixtures publiques, ou migrer les données qui doivent rester confidentielles vers une source réellement protégée.
4. Ne pas simplement ajouter les quatre chemins à `PROT` sans concevoir le flux d'accès : les consommateurs actuels utilisent des `fetch` statiques sans JWT explicite et le contrôle de rôle est actuellement côté client. Une protection Worker brute pourrait donc casser les écrans.

## 6. Modifications et validations

- Aucun JSON, JavaScript ou Worker modifié.
- Aucun fichier supprimé ou déplacé ; aucun historique Git réécrit.
- Aucun changement Supabase, Auth, RLS, schéma, abonnement ou paiement.
- Aucune modification de `main`, aucune fusion, aucun déploiement.
- Les tests structurels CI existants sur le HEAD `a86bdf4ba83e74ac8a4c48a48dd91ca1c9380941` ont réussi ; ce lot est un audit documentaire et ne modifie pas le code.

PR #23 reste ouverte, en brouillon et non fusionnée.

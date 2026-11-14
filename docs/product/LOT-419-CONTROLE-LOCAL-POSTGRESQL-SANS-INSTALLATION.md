# Lot 419 — Préparation du contrôle local PostgreSQL sans installation

**Date :** 13 novembre 2026  
**Dépôt :** `bridrandomtv-spec/ALLEMAND`  
**Branche :** `design/prototypes-67-74-alignment`

## Objectif

Déterminer si le poste Windows de l'utilisateur dispose déjà des outils nécessaires pour construire une base PostgreSQL locale de test, sans frais, sans installation et sans contacter la base Supabase active.

## Vérifications réalisables depuis cette session

- Le dépôt GitHub et les workflows CI sont accessibles.
- Cette session GitHub ne donne pas accès au terminal Windows, au disque local, aux services Windows, à Docker Desktop ni à WSL de l'utilisateur.
- En conséquence, aucune conclusion n'est possible sur la présence ou l'absence de PostgreSQL, Docker ou WSL sur son PC.
- Aucun outil n'a été installé, aucun conteneur lancé, aucun service démarré et aucun coût engagé.

## Commandes PowerShell à exécuter par l'utilisateur

Ouvrir PowerShell sur le PC Windows et copier-coller :

```powershell
Get-Command psql, pg_dump, pg_restore, postgres, docker, wsl -ErrorAction SilentlyContinue |
  Select-Object Name, Source

if (Get-Command psql -ErrorAction SilentlyContinue) { psql --version }
if (Get-Command pg_dump -ErrorAction SilentlyContinue) { pg_dump --version }
if (Get-Command docker -ErrorAction SilentlyContinue) { docker --version }
if (Get-Command wsl -ErrorAction SilentlyContinue) { wsl --version }
```

Ces commandes sont des contrôles de présence et de version. Elles n'installent rien, ne démarrent aucun service, ne créent aucune base et n'effectuent aucune connexion réseau.

L'utilisateur doit transmettre la sortie complète. Si aucune ligne ne s'affiche, cela signifie seulement que ces exécutables ne sont pas trouvés dans le PATH courant ; cela ne prouve pas à lui seul qu'aucune installation n'existe.

## Décision technique après réception du résultat

1. Si PostgreSQL et ses outils sont déjà installés, vérifier leur version et la disponibilité du serveur local avant toute création de base.
2. Si Docker est déjà installé et opérationnel, vérifier uniquement son état local ; ne télécharger aucune image sans accord explicite.
3. Si WSL est disponible, évaluer les composants déjà présents sans installer de distribution.
4. Si aucun environnement adapté n'est présent, s'arrêter et demander l'autorisation avant toute installation. Aucun service payant ou nouvelle ressource Supabase ne sera proposé comme étape implicite.

## Garde-fous maintenus

- Aucun accès à la base Supabase active et aucune lecture/écriture de données réelles.
- Aucun changement Auth, RLS, schéma, migration, Storage, Realtime ou paiement.
- Aucun déploiement Cloudflare.
- Aucun changement sur `main), aucune fusion de PR #17.
- Les essais futurs utiliseront uniquement des données synthétiques et une base isolée, après vérification d'un baseline PostgreSQL fiable.

## État

**En attente de la sortie PowerShell de l'utilisateur.** Le contrôle local ne peut pas être exécuté à distance depuis GitHub. La prochaine étape technique dépend de cette sortie ; ne pas déclarer PostgreSQL/Docker/WSL absent ou présent avant réception de preuves.


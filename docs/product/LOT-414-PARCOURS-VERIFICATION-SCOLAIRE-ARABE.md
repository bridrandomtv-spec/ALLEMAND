# Lot 414 — parcours et écrans arabes de vérification scolaire gratuite

Date : 13 novembre 2026
Branche : design/prototypes-67-74-alignment
Statut : prototype statique et décision produit clarifiée ; aucun raccordement backend.

## 1. Décision produit faisant foi

Ce lot clarifie une contradiction introduite dans la matrice du Lot 413. La règle demandée par le propriétaire est :
- **ملتقى الطلاب** : accessible gratuitement aux élèves qui possèdent un compte actif inscrit sur la plateforme, sans exiger la vérification scolaire pour participer au forum.
- Publications, commentaires et réactions soumis aux règles communautaires, à la modération, aux limites anti-abus et aux contrôles serveur nécessaires.
- **الرسائل** : conversations privées et premiers contacts réservés aux élèves dont l'identité/affiliation scolaire a été vérifiée. Une demande doit être acceptée explicitement avant création d'un DM.
- **الاشتراك** : uniquement pour les services pédagogiques premium ; jamais une preuve d'identité ni un moyen de contourner un refus, un blocage ou le consentement.
- La vérification scolaire est gratuite, indépendante du paiement. Le numéro d'inscription scolaire est confidentiel et ne doit pas être remplacé par le numéro d'abonnement.

Cette règle remplace toute phrase du Lot 413 qui conditionnerait la participation de base au ملتقى à une vérification scolaire. Les autres principes du Lot 413 (gratuité essentielle, consentement, blocage, sécurité et séparation abonnement/confiance) restent applicables.

## 2. Parcours proposé

1. L'élève connecté ouvre « التحقق من الهوية المدرسية » depuis الرسائل ou son espace de compte.
2. Il renseigne le minimum nécessaire : wilaya, établissement, niveau, classe/filière et, seulement si une source autorisée le requiert, numéro d'inscription scolaire privé.
3. La demande est gratuite et passe à l'état « en attente ».
4. Un responsable habilité, limité à son établissement ou périmètre administratif autorisé, vérifie l'affiliation via une source officielle ou un processus manuel approuvé.
5. Il accepte, demande un complément ou refuse avec motif interne minimal ; l'acteur, l'heure et la décision doivent être journalisés.
6. La validation ouvre l'éligibilité aux demandes de contact privées ; elle ne crée pas automatiquement de conversations.
7. Le destinataire accepte explicitement la demande avant que le DM ne soit créé.

Si aucune source fiable ni aucun responsable habilité n'est disponible, le compte reste non vérifié pour les DM. Il conserve l'accès de base au ملتقى. Ne pas substituer un abonnement ou un paiement à la preuve scolaire.

## 3. Écrans arabes préparés

Prototype : prototypes/school-verification-preview.html.
- **واجهة التلميذ** : formulaire gratuit, établissement, wilaya, niveau, classe/filière, identifiant scolaire facultatif et confidentiel, notice de confidentialité et états de suivi.
- **واجهة المسؤول المخوّل** : demande illustrative, périmètre du vérificateur, données minimales, note interne et décisions possibles.
- Les boutons d'envoi et de décision sont désactivés : maquette statique, sans persistance ni action réelle.
- Les données visibles sont fictives ; aucun dossier réel n'est utilisé.

## 4. Constat sur le code actuel

L'audit de la branche confirme une dépendance existante à corriger ultérieurement :
- supabase/supabase.js — msgRequestVerification(subscriptionNumber, section) exige actuellement un numéro d'abonnement actif appartenant au compte et l'écrit dans profiles.matricule.
- msg.js affiche actuellement une consigne demandant le numéro d'abonnement après paiement.
- Le contrôle client ne constitue pas une autorisation serveur. Les policies, grants, triggers et fonctions SQL déployés doivent être audités avant de concevoir un remplacement.
- Ce lot ne change pas ce comportement et ne prétend pas avoir activé la vérification gratuite.

## 5. Conditions bloquantes avant raccordement

- Identifier officiellement qui peut vérifier les élèves et définir le périmètre exact de chaque rôle.
- Déterminer la source de vérité autorisée ; ne pas demander de justificatif ou de numéro si aucun processus sûr ne permet de le vérifier.
- Séparer le statut de vérification et le statut d'abonnement.
- Protéger les identifiants scolaires par des privilèges de colonnes et des projections minimales ; ne jamais les exposer aux pairs.
- Tests multi-comptes : élève non vérifié, élève vérifié, abonné non vérifié, vérificateur hors périmètre, responsable habilité, compte suspendu.
- Vérifier consentement DM, blocage bilatéral, refus, anti-spam et absence de création automatique de conversation.
- Ne pas activer la découverte nationale des élèves ni le DM avant validation des contrôles serveur/RLS.

## 6. Périmètre du Lot 414

Ajout d'un prototype HTML autonome et d'une documentation. Aucun changement du code applicatif Messenger ou du formulaire actuel. Aucune requête ou écriture Supabase, Auth, SQL, schéma, migration, RLS, Storage, Realtime ou paiement. Aucune donnée personnelle d'élève consultée. Aucun service payant, déploiement Cloudflare, modification de main, synchronisation de branche ou fusion de PR.

## 7. Suite — Lot 415

Contrôler la CI du commit documentaire et du prototype. Puis définir la matrice des rôles vérificateurs (établissement / wilaya / administration centrale), les preuves acceptables et la procédure de recours, sans coder ni modifier la base active.

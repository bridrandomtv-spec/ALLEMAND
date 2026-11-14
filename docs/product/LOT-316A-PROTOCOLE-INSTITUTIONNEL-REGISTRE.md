# Lot 316-A — protocole institutionnel de réception et validation du registre

Date : 12 novembre 2026  
Statut : proposition de gouvernance à faire confirmer par le ministère/DEW ; aucun traitement de données réelles engagé.

## 1. Objet et séparation des référentiels

Le protocole sépare strictement :
1. le référentiel des établissements (données administratives des lycées) ;
2. les actes de création, suppression, fusion, changement de nom ou de statut ;
3. les inscriptions des élèves dans un établissement et une année scolaire.

La réception d'un fichier d'établissements ne prouve aucune inscription d'élève. Un code de lycée saisi librement par un élève ne peut jamais établir son affiliation.

## 2. Demande institutionnelle

Demander à un service ministériel habilité, ou à une DEW dans son périmètre légal, un export signé ou transmis par un canal institutionnel reconnu. La demande doit préciser :
- le périmètre (lycées uniquement ou autres établissements séparés) ;
- l'année scolaire et la date d'extraction ;
- le format et le dictionnaire de données ;
- l'autorité propriétaire du référentiel et le service responsable de sa mise à jour ;
- la signification, l'unicité et la stabilité du numéro d'identification national ;
- les codes administratifs de wilaya/commune et leur version ;
- les statuts possibles et leurs dates d'effet ;
- la procédure de correction, de retrait et de signalement d'un établissement ;
- le calendrier de mise à jour et le canal de support.

Une réponse d'un établissement isolé ne suffit pas à établir l'exhaustivité nationale.

## 3. Réception et chaîne de conservation

À la réception :
1. enregistrer l'émetteur institutionnel, son service, le nom du signataire ou la référence de transmission, la date/heure, le canal et l'année scolaire ;
2. conserver le fichier original en lecture seule dans un espace privé à accès limité ;
3. calculer une empreinte SHA-256 du fichier original ;
4. ne jamais écraser l'original ; chaque nouvelle version est un nouveau lot ;
5. vérifier le type de fichier, la taille, l'encodage, les en-têtes et l'absence de formules actives ;
6. rejeter les macros, liens externes, archives inattendues et fichiers chiffrés non convenus.

Aucun fichier réel ne doit être déposé dans le prototype Lot 315 : celui-ci est un outil local de démonstration, pas un canal de réception sécurisé.

## 4. Prévalidation et rapprochement

Le contrôle est effectué dans une zone isolée, sans accès en écriture à Supabase :
- contrôle de structure et des champs obligatoires ;
- unicité des identifiants dans le lot ;
- contrôle des codes géographiques par rapport à la nomenclature officielle fournie ;
- cohérence des dates d'effet et de l'année scolaire ;
- détection des changements de nom, créations, suppressions, fusions et identifiants réutilisés ;
- rapprochement avec la version précédente sans écrasement de l'historique ;
- rapport des lignes acceptées, rejetées et à clarifier.

Les contrôles automatiques ne certifient ni l'authenticité juridique du fichier ni le statut réel d'un établissement. Ces points doivent être confirmés par l'autorité émettrice.

## 5. Approbation à deux personnes

Avant toute publication :
- un opérateur prépare le lot et documente les anomalies ;
- un second approbateur, distinct du préparateur, vérifie la provenance, le périmètre, l'empreinte, les écarts et les corrections ;
- l'autorité institutionnelle confirme les points ambigus ;
- la décision (accepté, accepté partiellement, rejeté) est datée et motivée.

L'administrateur technique de la plateforme ne peut pas s'auto-attribuer une autorité ministérielle. Le rôle de modérateur Messenger ne donne aucun droit de certifier les établissements.

## 6. Publication, correction et retrait

Seulement après approbation institutionnelle :
- publier une version identifiée et datée du référentiel ;
- garder la référence du lot source et les actes justificatifs ;
- conserver les anciennes valeurs et les périodes de validité ;
- enregistrer les corrections comme événements, sans effacer l'historique ;
- permettre un retrait/signalement et un traitement tracé ;
- afficher la date de dernière validation et le périmètre couvert.

Un établissement absent du fichier ne doit pas être automatiquement déclaré fermé. Une ligne non confirmée ne doit pas être affichée comme officielle.

## 7. Séparation avec les inscriptions et le Messenger

Le futur processus d'affiliation doit être séparé et exige :
- une relation élève/établissement fournie ou confirmée par une source autorisée ;
- une année scolaire, un niveau/filière et une période de validité ;
- un mécanisme de validation par un agent officiellement habilité ;
- des permissions minimales et un historique de vérification.

La recherche nationale, les invitations inter-lycées et les groupes géographiques restent désactivés tant que cette preuve d'affiliation n'existe pas. Les données de contact, matricules et justificatifs ne doivent jamais être exposés dans un annuaire.

## 8. Critères d'acceptation / rejet d'un lot

Accepter uniquement si provenance et périmètre sont vérifiables, dictionnaire documenté, identifiants expliqués, date d'extraction connue, mécanisme de mise à jour défini et approbation à deux personnes obtenue.

Rejeter ou mettre en quarantaine si l'émetteur n'est pas habilité, la couverture nationale est revendiquée sans preuve, l'empreinte/original manque, les identifiants sont ambigus, les statuts ne sont pas définis, les changements ne sont pas datés ou si des données d'élèves non nécessaires sont incluses.

## 9. Décision de sécurité

Ce protocole est un projet de procédure à faire valider par l'autorité institutionnelle compétente. Il n'autorise aucune collecte, aucun import, aucune migration, aucun accès à un registre réel et aucune publication d'un annuaire. Les lots de test restent synthétiques. Toute future migration devra être conçue et testée sur une base PostgreSQL isolée, puis soumise à approbation distincte avant toute action de production.

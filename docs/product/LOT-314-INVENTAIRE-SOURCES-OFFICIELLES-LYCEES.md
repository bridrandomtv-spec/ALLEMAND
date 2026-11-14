# Lot 314 — inventaire des sources officielles du référentiel des lycées

Date : 12 novembre 2026  
Périmètre : recherche documentaire et vérification des sources publiques ; aucune collecte de données personnelles, aucun import, aucune modification Supabase.

## 1. Conclusion exécutive

Une source juridique primaire exploitable a été confirmée : le Journal officiel de la République algérienne démocratique et populaire (JORADP). Ses décrets exécutifs relatifs à la création et à la suppression de lycées publient des listes nominatives comportant notamment les codes de wilaya et de commune, un numéro d'identification nationale de l'établissement, sa dénomination et son adresse.

Cela permet de construire un **historique juridique des changements** et de contrôler des identifiants. Cela ne constitue pas, à lui seul, un registre national courant exhaustif : les décrets ne donnent que les établissements créés ou supprimés à partir d'une année scolaire donnée. Une reconstruction complète exigerait une base de départ fiable, tous les actes de changement pertinents et la confirmation des situations actuelles par le ministère ou les Directions de l'éducation des wilayas (DEW).

Aucun export public centralisé et actualisé de tous les lycées actifs n'a été confirmé pendant cette recherche. Ce constat signifie « non trouvé/confirmé dans les sources examinées », pas « inexistant ».

## 2. Sources primaires confirmées

### 2.1 JORADP — décret exécutif n° 24-224

- Référence : décret exécutif n° 24-224 du 2 juillet 2024, publié au Journal officiel n° 48 du 14 juillet 2024.
- URL officielle : https://www.joradp.dz/FTP/jo-francais/2024/F2024048.pdf
- Objet : création et suppression de lycées à compter de la rentrée 2022-2023.
- Champs présents dans les annexes : code wilaya, wilaya, code commune, commune, numéro d'identification nationale, dénomination et adresse.
- Les créations de l'annexe I portent des identifiants allant de 9609 à 9662 dans les entrées reproduites.
- L'annexe II documente des suppressions et transformations, avec les anciens numéros d'identification.

**Valeur : élevée pour les actes et les champs d'identification publiés. Limite : événementiel et rétrospectif ; ne pas interpréter cette liste comme l'inventaire complet des lycées actifs en novembre 2026.**

### 2.2 JORADP — décret exécutif n° 22-253

- Référence : décret exécutif n° 22-253 du 30 juin 2022, Journal officiel n° 48 du 17 juillet 2022.
- URL officielle : https://www.joradp.dz/FTP/jo-francais/2022/F2022048.pdf
- Objet : créations et suppressions à compter de la rentrée 2021-2022.
- Les annexes contiennent les mêmes familles de champs, dont le numéro d'identification nationale.

**Valeur : élevée pour les événements juridiques 2021-2022 ; historique uniquement.**

### 2.3 JORADP — décret exécutif n° 21-519

- Référence : décret exécutif n° 21-519 du 26 décembre 2021, Journal officiel n° 97 du 27 décembre 2021.
- URL officielle : https://www.joradp.dz/FTP/jo-francais/2021/F2021097.pdf
- Objet : création et suppression de lycées.
- Source complémentaire pour l'historique antérieur.

### 2.4 Loi d'orientation sur l'éducation nationale

- Loi n° 08-04, article 82.
- Source officielle du Premier ministre : https://www.premier-ministre.gov.dz/fr/document/loi-n0-08-04-portant-loi-d-orientation-sur-l-education-nationale
- L'article 82 prévoit que la création et la suppression des lycées interviennent par décret.

**Conséquence opérationnelle :** le registre doit conserver la référence exacte du décret, la date de publication et la date d'effet de chaque événement. Une simple correction manuelle d'un nom ne doit pas effacer l'historique juridique.

## 3. Sources secondaires / données insuffisantes

- Les tableaux de l'ONS consultés donnent des effectifs agrégés historiques par wilaya, pas la liste nominative complète des lycées ni les inscriptions individuelles : https://www.ons.dz/IMG/pdf/Education-3.pdf
- Des annuaires privés/cartographiques affichent des établissements et des filtres géographiques, mais indiquent eux-mêmes une couverture incomplète ou reposent sur des contributions. Ils ne sont pas une autorité d'identification ni une preuve de statut actif.
- Les moteurs de recherche et les copies éditorialisées du Journal officiel sont utiles pour repérer un acte ; la validation doit revenir au PDF publié sur joradp.dz.

## 4. Limites et inconnues à lever

1. Exhaustivité : tous les décrets de création/suppression depuis la constitution du référentiel ne sont pas encore inventoriés.
2. Actualité : la recherche n'a pas confirmé une liste consolidée active à la rentrée 2026-2027.
3. Identifiant : le numéro d'identification nationale est présent dans plusieurs actes ; son format, sa stabilité, sa réutilisation éventuelle et son autorité de gestion doivent être confirmés auprès du ministère.
4. Géographie : les codes et libellés doivent être versionnés ; les changements de wilaya/commune et les variantes linguistiques doivent être traités sans écraser les valeurs officielles.
5. Statut : un acte de création ne prouve pas à lui seul l'ouverture effective, l'activité actuelle ou l'absence de fermeture/transformations ultérieures.
6. Affiliation élève : le référentiel des établissements ne prouve pas qu'un compte étudiant est réellement inscrit dans un établissement donné.

## 5. Protocole d'acquisition recommandé

Adresser une demande institutionnelle au ministère de l'Éducation nationale, avec relais éventuel vers les DEW, pour obtenir :

- un export officiel des lycées actifs pour l'année scolaire courante ;
- le numéro d'identification national et les codes administratifs de wilaya/commune ;
- les dénominations officielles arabe et française, adresse administrative et statut ;
- les dates d'effet, motifs et références des créations, suppressions, fusions, changements de nom ou transformations ;
- la date d'extraction, le responsable émetteur, le format et la procédure de correction ;
- un protocole de mise à jour périodique et un canal de confirmation des établissements.

Exiger une réponse signée ou un export émis par un service habilité. Un fichier reçu d'un établissement ou d'une DEW doit être conservé avec son origine, son horodatage et son empreinte cryptographique. Les données d'élèves ne sont pas nécessaires pour constituer le référentiel des établissements.

## 6. Décision technique

- **GO documentaire** : enregistrer les références officielles et concevoir le schéma d'import/traçabilité.
- **NO-GO données de production** : ne pas créer un annuaire présenté comme national et exhaustif à partir des seuls décrets historiques, d'OpenStreetMap, d'annuaires privés ou de données synthétiques.
- **NO-GO affiliation Messenger** : aucune découverte nationale ni invitation fondée sur le seul choix manuel d'un lycée par l'élève.
- La prochaine étape autorisée sans accès au registre ministériel est le lot 315 : maquette d'import avec données explicitement synthétiques, contrôles de format, doublons, codes géographiques et journal de validation. Aucun import dans Supabase.

## 7. État des opérations

Aucune modification du code applicatif, du schéma SQL, des données, des policies RLS, des GRANT, d'Auth ou de Storage. Aucun changement Cloudflare, aucun déploiement, aucun merge, aucune modification de `main`. PR #17 reste ouverte et non fusionnée.

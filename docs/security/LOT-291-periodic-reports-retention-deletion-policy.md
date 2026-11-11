# Lot 291 — politique de conservation, purge et suppression des rapports périodiques

**Date :** 11 novembre 2026  
**Branche :** `design/prototypes-67-74-alignment`  
**Statut :** conception documentaire ; aucune durée réglementaire ou opérationnelle approuvée ; aucune purge exécutée

## 1. Objectif et périmètre

Ce lot traite le cycle de vie des données nécessaires aux rapports périodiques : préférences, événements observés, exécutions, livraisons et copies éventuelles chez le fournisseur de messagerie. Il constitue un prérequis transversal avant tout endpoint d'envoi ou planificateur.

Aucune durée chiffrée n'est imposée dans ce document. La durée applicable dépend de la finalité précise, de la nécessité opérationnelle, des obligations applicables à l'établissement et des capacités de suppression du fournisseur. Une valeur arbitraire créerait soit une conservation excessive, soit une perte prématurée de preuves utiles.

## 2. Classification et règles de cycle de vie

| Ensemble | Finalité autorisée | Règle de minimisation | Fin de vie proposée |
|---|---|---|---|
| Préférences | Mémoriser fréquence, calendrier, langue et catégories | Une ligne par compte ; aucune adresse destinataire dupliquée | Suppression avec le compte ; suppression ou désactivation à la demande selon le parcours retenu |
| Événements observés | Produire les éléments réellement présents dans un rapport | Liste fermée de types ; horodatage serveur ; pas de jeton, IP, user-agent, contenu privé ou métadonnées libres | Purge à échéance, suppression à la suppression du compte |
| Exécutions | Empêcher les doublons et suivre l'état de génération | Identifiants, période, statut et codes d'erreur bornés ; pas de copie HTML complète | Purge à échéance après la fin du besoin de diagnostic/idempotence |
| Livraisons | Éviter les renvois aveugles et diagnostiquer les réponses fournisseur | Identifiant fournisseur seulement si nécessaire ; adresse destinataire non stockée en clair ; erreurs expurgées | Purge à échéance après résolution des reprises et contestations opérationnelles |
| Copies chez le fournisseur | Acheminer le message | Ne transmettre que le rapport destiné au titulaire du compte | Dépend de la politique et des outils du fournisseur ; à vérifier avant activation |
| Copie dans la boîte du destinataire | Fournir le rapport demandé | Contenu limité aux données autorisées pour la période | La plateforme ne peut pas garantir l'effacement d'un e-mail déjà remis dans une boîte externe |

Les catégories de la maquette ne sont pas toutes alimentées par une source fiable. Aucune catégorie ne doit être conservée ou incluse avant que sa source, sa finalité et son événement soient validés. Les recommandations éditoriales ne doivent pas être transformées en événements personnels observés.

## 3. Décisions de rétention obligatoires avant activation

Les paramètres suivants doivent être fixés et approuvés par le responsable du service avant toute migration ou activation :

1. Durée des événements bruts, par type d'événement ou groupe de finalité.
2. Durée des métadonnées d'exécution et de livraison, notamment après un état final ou ambigu.
3. Durée de conservation des erreurs techniques expurgées.
4. Délai de suppression des données applicatives après fermeture/suppression d'un compte.
5. Durée résiduelle des sauvegardes et délai de purge chez le fournisseur de messagerie.
6. Éventuelles obligations documentées de conservation ou de gel légal, avec autorité, périmètre, date de début, réexamen et date de fin.

**État : non décidé.** Le prototype HTML ne contient aucune durée ni politique de suppression. Ce lot ne présume pas d'une obligation légale particulière et ne remplace pas une validation juridique/organisationnelle.

## 4. Politique de suppression du compte

À concevoir et tester avant mise en production :

- Lorsqu'un compte est supprimé, empêcher immédiatement toute nouvelle génération et annuler les tâches encore en attente.
- Supprimer les préférences et rattacher les événements, exécutions et livraisons à une suppression en cascade ou à un effacement serveur contrôlé, sans laisser de ligne orpheline.
- Si une contrainte documentée impose une conservation limitée, isoler les seules données nécessaires, restreindre leur accès, consigner la justification et supprimer à la date d'expiration. Ne pas utiliser cette exception comme conservation générale.
- Ne jamais conserver une adresse e-mail, un jeton, un corps de rapport ou un contenu fournisseur complet comme moyen de préserver l'historique.
- Informer clairement l'utilisateur que la suppression dans l'application ne peut pas retirer un message déjà remis de sa boîte e-mail.
- Vérifier séparément le cycle de vie des sauvegardes et des copies du fournisseur ; ne pas annoncer une suppression immédiate de ces systèmes sans preuve technique.

## 5. Exécution sûre de la purge

La future purge doit être un traitement serveur uniquement, indépendant du navigateur et idempotent :

1. Calculer les échéances en UTC à partir de règles de rétention approuvées et versionnées.
2. Effectuer d'abord un mode simulation (« dry run ») indiquant les volumes par type, sans afficher de données personnelles.
3. Traiter par lots bornés, avec ordre de dépendance : livraisons/exécutions puis événements, en respectant les contraintes FK.
4. Rejouer sans dommage après interruption ; une seconde exécution ne doit pas réintroduire ni altérer les données restantes.
5. Enregistrer uniquement un résultat agrégé (compte de lignes par catégorie, durée, succès/échec) sans identifiants personnels ni contenu supprimé.
6. Gérer les erreurs par code borné ; aucune requête brute, aucun jeton, aucune adresse ou réponse fournisseur complète dans les journaux.
7. Vérifier après exécution qu'aucune ligne arrivée à échéance ne reste, qu'aucune ligne non échue n'a été supprimée et que les relations restent cohérentes.

Aucun rôle navigateur ne doit pouvoir appeler directement une purge ou modifier les dates d'échéance. Les droits de traitement doivent être strictement limités au serveur.

## 6. Tests négatifs et critères de sortie

| ID | Scénario | Résultat attendu |
|---|---|---|
| R01 | Préférence expirée ou compte supprimé | Préférence supprimée, aucun rapport futur planifié |
| R02 | Purge exécutée deux fois | Résultat idempotent, aucune erreur destructive |
| R03 | Événement non arrivé à échéance | Conservé |
| R04 | Événement arrivé à échéance | Supprimé selon la politique versionnée |
| R05 | Suppression du compte avec livraisons en attente | Envois annulés avant suppression |
| R06 | Compte supprimé avec historique lié | Aucune ligne orpheline ou donnée personnelle résiduelle dans les tables applicatives |
| R07 | Panne au milieu d'un lot | Reprise sûre, état vérifiable |
| R08 | Tentative de purge depuis le navigateur | Refusée |
| R09 | Erreur de purge contenant une donnée sensible | Seul un code expurgé est conservé |
| R10 | Rétention fournisseur/sauvegarde non vérifiée | Activation bloquée ; aucune promesse de suppression complète |
| R11 | Gel légal arrivé à expiration | Données libérées puis purgées selon la règle normale |
| R12 | Date d'expiration falsifiée par le client | Ignorée ; échéance calculée côté serveur |

Critères de sortie : durées et déclencheurs approuvés ; inventaire des copies et sauvegardes documenté ; règles de suppression de compte validées ; purge testée sur données synthétiques dans un environnement isolé ; preuve qu'aucun utilisateur ne peut invoquer le traitement privilégié.

## 7. Séquencement du programme corrigé

Le plan initial du Lot 287 plaçait l'endpoint d'envoi en Lot 291. La revue de cycle de vie montre que la politique de rétention et de suppression doit être décidée avant l'envoi et la planification. Le séquencement est donc ajusté :

| Étape | Livrable | Condition de sortie |
|---|---|---|
| 291 | Politique de rétention, purge et suppression | Durées approuvées et tests de purge spécifiés |
| 292 | Endpoint d'envoi sécurisé | Tests négatifs, idempotence et destinataire confirmé |
| 293 | Planification et historique | Tests de calendrier, reprise et rétention |
| 294 | Activation éventuelle | Autorisation distincte, fournisseur validé et contrôles de sécurité passés |

Ce changement est un ajustement documentaire du plan, pas une autorisation d'implémentation.

## 8. État des opérations

- Aucun SQL ni migration exécuté.
- Aucune table, fonction, politique RLS, grant ou secret créé/modifié.
- Aucun changement de configuration Supabase Auth/SMTP.
- Aucun Worker, Cron ou endpoint d'envoi créé/activé.
- Aucun e-mail envoyé ; aucune purge exécutée.
- Aucun déploiement, achat, service payant ou coût engagé.
- PR #17 maintenue ouverte et non fusionnée ; `main` inchangée.

**Conclusion :** le modèle de suppression et de purge est spécifié, mais la politique n'est pas prête à être activée tant que les durées et obligations de conservation ne sont pas approuvées.

# Lot 292 — contrat de sécurité de l'endpoint d'envoi des rapports périodiques

**Date :** 11 novembre 2026  
**Branche :** design/prototypes-67-74-alignment  
**Statut :** spécification documentaire ; aucun endpoint ni fournisseur activé

## 1. Périmètre et préconditions

Ce lot définit le contrat d'un endpoint serveur destiné à envoyer un rapport déjà généré au titulaire du compte. Il ne crée pas l'endpoint et ne choisit pas de fournisseur.

Préconditions non satisfaites à ce stade :
- politique de conservation : durées et déclencheurs encore à approuver (Lot 291) ;
- source d'événements fiable pour chaque catégorie demandée ;
- fournisseur, domaine expéditeur, politique de rétention fournisseur et capacité de réconciliation à vérifier ;
- tests isolés de l'identité, de l'idempotence, de la suppression et des permissions ;
- autorisation distincte avant tout secret, configuration distante, envoi réel ou déploiement.

## 2. Deux voies d'appel distinctes

### 2.1 Demande utilisateur authentifiée
- Accepter uniquement une requête HTTPS avec un Bearer token Supabase.
- Valider le jeton côté serveur auprès de Supabase Auth /auth/v1/user ; dériver actor_id exclusivement de la réponse validée.
- Ne jamais accepter user_id, adresse destinataire, état sent/accepted, horodatage d'envoi, identifiant fournisseur, période arbitraire ou contenu HTML comme autorité depuis le navigateur.
- La requête utilisateur peut demander un aperçu ou une génération autorisée ; elle ne doit pas pouvoir déclencher un envoi immédiat illimité.
- Vérifier côté serveur que le compte existe, que l'adresse Auth est confirmée, que les rapports sont activés et que la préférence appartient à cet utilisateur.

### 2.2 Tâche planifiée interne
- Utiliser une voie séparée, réservée aux appels internes authentifiés.
- Secret interne conservé uniquement côté serveur, jamais dans le client ni dans les journaux ; prévoir rotation et révocation.
- Le worker sélectionne les rapports échus depuis la base et dérive chaque compte depuis les lignes lues côté serveur.
- Refuser les appels anonymes, les jetons utilisateur utilisés comme secret interne et les requêtes contenant un destinataire arbitraire.

## 3. Contrat de requête et de réponse

Entrée utilisateur minimale : action explicite autorisée (aperçu/génération) et identifiant opaque d'une exécution appartenant au compte validé. Aucun champ de destination ni de statut.

Réponse minimale :
- identifiant opaque d'exécution ;
- état logique autorisé (queued, building, ready, failed, cancelled) ;
- code d'erreur public générique en cas d'échec.

Les identifiants fournisseur, réponses brutes, destinataires et erreurs détaillées ne sont jamais renvoyés au navigateur. Un endpoint de demande ne doit jamais répondre sent avant acceptation réelle par le fournisseur ; même après acceptation, le statut doit être nommé accepted et ne signifie pas livraison, ouverture ou lecture.

## 4. Résolution du destinataire et contenu

- Récupérer l'adresse directement depuis Supabase Auth côté serveur au moment de l'envoi.
- Exiger une adresse présente et confirmée ; sinon aucun envoi et aucun fallback vers une adresse fournie par le client.
- Vérifier que le compte n'est pas supprimé, désactivé ou en attente d'effacement.
- Générer le contenu côté serveur depuis les événements autorisés de la période. Ne jamais envoyer du HTML arbitraire fourni par le navigateur.
- N'inclure que les catégories effectivement disponibles et activées par le propriétaire. Une catégorie sans source fiable doit être omise avec un état explicite dans l'aperçu, pas remplie par des données de démonstration.
- Échapper le contenu textuel et encoder le HTML ; empêcher injection HTML, liens de suivi non autorisés et divulgation de données d'un autre compte.
- Le rapport doit afficher la période et le fuseau de référence, ainsi que la distinction entre événements observés et recommandations éditoriales.

## 5. Autorisation, limitation et idempotence

- Vérifier l'appartenance de chaque exécution au compte dérivé du jeton ; un identifiant deviné ne doit pas permettre l'accès à une autre exécution.
- Appliquer des limites par compte, par action et globalement côté serveur ; les seuils restent à fixer selon le produit et le fournisseur.
- Créer une clé d'idempotence serveur par compte, type de rapport et période locale normalisée ; ne pas accepter une clé arbitraire du navigateur comme seule protection.
- Prendre un verrou/lease atomique avant l'envoi ; une seule tentative active par livraison logique.
- Après une réponse fournisseur positive, enregistrer accepted et l'identifiant fournisseur minimal.
- En cas de délai d'attente après acceptation possible, enregistrer unknown, réconcilier via les capacités du fournisseur et ne pas réessayer aveuglément.
- Les reprises sont bornées et soumises à une politique explicite ; aucun envoi en boucle.

## 6. Gestion des erreurs et confidentialité

- Réponses publiques génériques ; codes internes bornés : AUTH_INVALID, EMAIL_UNCONFIRMED, REPORT_DISABLED, RATE_LIMITED, PROVIDER_REJECTED, PROVIDER_UNKNOWN, INTERNAL_ERROR.
- Ne jamais journaliser Bearer token, secret interne, adresse e-mail en clair, corps complet du rapport, contenu de réponse fournisseur ou données d'autres comptes.
- Les logs opérationnels contiennent seulement identifiants opaques, catégorie d'action, code d'erreur, durée et résultat agrégé, conformément à la politique de rétention approuvée.
- Les erreurs d'insertion DB et de fournisseur doivent laisser un état cohérent et permettre une reprise sans duplication.
- L'échec du service d'e-mail ne doit jamais être affiché comme un succès ; aucune promesse de livraison ou de lecture.

## 7. Matrice de tests négatifs

| ID | Scénario | Résultat attendu |
|---|---|---|
| E01 | Appel sans Bearer token | 401, aucun accès |
| E02 | Jeton expiré/invalide | 401, aucune exécution créée |
| E03 | user_id d'un autre compte dans le corps | Champ ignoré/refusé ; identité du jeton seule |
| E04 | Identifiant d'exécution appartenant à B appelé par A | 404/403 sans fuite |
| E05 | Destinataire arbitraire dans le corps | Refusé et jamais utilisé |
| E06 | Adresse Auth absente ou non confirmée | Aucun envoi |
| E07 | Compte supprimé ou effacement en cours | Aucun envoi ; tâches annulées |
| E08 | Rapports désactivés | Aucun envoi |
| E09 | Appel interne sans secret valide | Refusé |
| E10 | Secret interne présenté dans le navigateur | Refusé ; secret jamais exposé |
| E11 | Deux appels concurrents même période | Une livraison logique au maximum |
| E12 | Réponse fournisseur perdue après acceptation possible | État unknown, réconciliation avant reprise |
| E13 | Fournisseur refuse le message | État failed, code expurgé |
| E14 | Injection HTML dans les données source | Contenu échappé, aucun script exécuté |
| E15 | Catégorie sans source réelle activée | Donnée omise, aucun chiffre inventé |
| E16 | Panne DB avant/après appel fournisseur | État récupérable, pas de renvoi aveugle |
| E17 | Dépassement de débit | 429, aucune livraison supplémentaire |
| E18 | Réponse endpoint | Aucun secret, e-mail, corps de rapport ou identifiant fournisseur exposé |

## 8. Décision de sortie

Le contrat est défini, mais l'endpoint ne peut pas être implémenté/activé tant que les préconditions de la section 1 ne sont pas levées et testées dans un environnement isolé. Le choix du fournisseur et les seuils de limitation restent ouverts. Toute configuration distante, secret, envoi réel et déploiement nécessitera une autorisation explicite distincte.

## 9. Opérations non effectuées

Aucun code endpoint, Worker, Cron, secret, paramètre Supabase Auth/SMTP, table, fonction, migration, policy RLS ou grant n'a été créé ou modifié. Aucun e-mail n'a été envoyé, aucune purge exécutée, aucun déploiement ni achat effectué. Aucun coût engagé. PR #17 reste ouverte et non fusionnée.

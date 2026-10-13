# Manuel d'exploitation — الثانوية الافتراضية / Lycée virtuel
<!-- manuel-ops-v1 -->
Version 1 — 14/10/2026 — rédigé par le propriétaire, publié tel quel avec références d'implémentation.
Statut : loi interne de la plateforme. Tout écart entre ce manuel et le code est un bug ou un lot à planifier.

## 1. Rôles et périmètres

| Rôle | Périmètre |
| --- | --- |
| Administrateur général | Tous les paramètres, tous les rapports et tous les accès autorisés |
| Responsable régional | Wilayas attribuées, agents et statistiques régionales |
| Agent de paiement | Dossiers affectés, justificatifs, reçus et validation selon ses droits |
| Responsable pédagogique | Cours, enseignants, programmes et examens |
| Agent de support | Tickets et informations nécessaires à leur résolution |

Implémentation : `admin_roles` (5 rôles, priorités 10→50), `admin_permissions` (19 paires rôle→permission),
`wilaya_assignments` (périmètre géographique + suspension/révocation immédiates). Lots : ADM-1, ADM-1b, F5.

## 2. Règle de sécurité fondatrice

Créer un compte de sous-administrateur ne donne automatiquement accès ni à tous les élèves, ni aux
recettes nationales, ni aux paramètres généraux. Les permissions sont vérifiées côté serveur et dans
les politiques de sécurité de la base de données — jamais dans l'interface.

Implémentation : `admin_can()` / `admin_sees_wilaya()` (security definer), RLS sur chaque table sensible,
gardes de rôle et de périmètre sur `profiles`, audit indépendant 8 phases (D-1→D-6 closes, vérifiées en base).

## 3. Circuit d'un paiement (exemple canonique)

1. L'élève soumet une demande d'abonnement et transmet sa preuve de paiement, si le moyen utilisé le nécessite.
2. Le dossier arrive dans la file de l'agent autorisé pour la wilaya concernée.
3. L'agent vérifie la transaction, puis accepte ou rejette le dossier avec un motif.
4. Si la validation est autorisée et confirmée, le système enregistre la transaction, génère un reçu unique
   et active les droits prévus par la formule.
5. L'élève reçoit une confirmation et peut consulter son reçu et son accord d'utilisation depuis son compte.
6. L'administrateur général peut auditer l'opération, son auteur, son horodatage et toute modification ultérieure.

Implémentation : paywall (demande) · ADM-2 + F5 (file scopée wilaya, transitions forcées, motif) ·
F3 (reçu numéroté unique, montant confirmé gelé) · ADM-5 (écriture comptable automatique) ·
F4 (reçu consultable/imprimable) · ADM-3 (accords) · `audit_logs` (étape 6).
Écart connu : le téléversement de la preuve à l'étape 1 = lot PJ-PAY-1 (planifié, non bloquant).

## 4. Le circuit financier est auditable

Quatre notions séparées, jamais confondues :
- **Paiement déclaré** : somme annoncée ou preuve soumise, pas encore validée (`payments.statut = declare/en_attente`).
- **Paiement confirmé** : transaction vérifiée et enregistrée (`statut = confirme`).
- **Reçu émis** : document rattaché à la transaction confirmée, numéro unique `REC-AAAA-NNNNNN` (`receipts`, index unique par paiement).
- **Écriture comptable** : enregistrement financier selon les règles applicables (`accounting_entries`, immuable).

Le tableau de bord ne présente jamais une preuve téléchargée comme une recette encaissée : le rapport
calcule `paiements_sans_ecriture` et `ecritures_orphelines` (F6). Remboursements, annulations et
corrections laissent une trace (audit) au lieu de supprimer l'historique ; les périodes clôturées
refusent toute nouvelle écriture (`periode_closee`).

## 5. Documents générés automatiquement

| Document | Contenu minimal | Implémentation |
| --- | --- | --- |
| Reçu de paiement | numéro unique, identité abonné, formule, période, montant, devise, date, moyen, référence | F4 (+ ADM-2/F3) |
| Accord d'utilisation | conditions, version, date d'acceptation, preuve conservée ; procédure mineurs/wali | ADM-3 / ADM-3b / ADM-3d |
| Rapport de caisse & régional | totaux confirmés, attente, remboursements, écarts, détail par agent/wilaya | ADM-5 / F6 + export CSV |
| Dossier d'abonnement | confirmation, reçu, accord accepté, expiration, dans l'espace personnel | #compte (F4, ADM-3) |

Adaptation Algérie : reçus, conditions et durées de conservation à faire relire par un comptable/juriste
selon le statut juridique réel avant ouverture générale (un modèle de reçu ne remplace pas une validation
des obligations légales et fiscales). PDF signé serveur = lot DOC-1 (la vue d'impression actuelle suffit au pilote).

## 6. Modèle de données (entités distinctes, pas une liste d'élèves)

| Entité | Rôle |
| --- | --- |
| profiles | identité, compte et statut de l'utilisateur |
| admin_roles / admin_permissions | rôles et autorisations |
| wilaya_assignments | périmètre géographique de chaque agent |
| plans / subscriptions | offres et droits d'accès |
| payments | transactions et statuts de validation |
| receipts | reçus numérotés et documents associés |
| agreements / agreement_acceptances | versions des accords et preuves d'acceptation |
| accounting_entries | écritures et catégories comptables |
| audit_logs | historique des actions sensibles |
| support_tickets | réclamations et traitement |
| notifications | envois et statut de livraison |

Statut : les onze entités existent en production ; parité dépôt/base vérifiée par 19 compteurs (collage propriétaire).

## 7. Écarts connus et lots planifiés (sur ordre)

- **PJ-PAY-1** : preuve de paiement téléversée, rattachée au dossier, visible des seuls autorisés (plafond 5 Mo déjà en place, MSG-LIM).
- **DOC-1** : PDF signés serveur pour reçus et accords.
- **PEDAGO-1** : espace #admin du responsable pédagogique (programmes, enseignants, examens).
- **MFA-1** : second facteur TOTP interne pour admin/prof/agent.
- **CONTENT-1** : contenus pédagogiques servis derrière authentification (bucket privé/RLS + URLs signées).

## 8. Lancement et rituels

Pilote d'une classe (1–2 semaines) avant ouverture générale 2AS/3AS. Rituels hebdomadaires :
rapport 💰 + export CSV archivé · revue des tickets et signalements · clôture mensuelle en fin de mois.
Modération : deux créneaux quotidiens annoncés + canal WhatsApp d'urgence + bouton 🐞 « signaler un bug »
(ticket pré-rempli page/date/écran/navigateur, OPS-1). Charte de classe et CGU publiées sous
`charte_classe` et `conditions_utilisation` ; acceptations immuables, nom du wali pour les mineurs.

# Lot 629 — inventaire des PDF et préparation de la traçabilité de l'autorisation ministérielle

Date : 2026-11-15  
Branche : `audit/lot-603-corpus-contract-tests`  
Base observée : `68beb61f100fd0a9442e4b0535d0e5aca60d0196`

## Déclaration du responsable du projet

Le responsable indique disposer d'une autorisation des titulaires, accordée par le ministère algérien dans l'intérêt pédagogique des étudiants, pour convertir et exploiter les livres 2AS/3AS et les autres documents scolaires dans le RAG de la plateforme.

Cette déclaration est prise en compte pour préparer le traitement. Le dépôt ne contient toutefois pas, à ce stade de l'audit, la référence de l'acte, son texte, sa date, son émetteur exact ni son périmètre documentaire et technique. Ces champs ne sont pas inventés. Il faudra rattacher la preuve disponible et confirmer que le périmètre couvre les fichiers concernés, l'extraction/OCR, l'indexation et la restitution par l'assistant.

## Inventaire Git

- PDF présents dans l'arbre Git : **293**.
- PDF dans `docs/archive/documents/` : **264**.
- PDF hors de ce dossier : **29**.
- Un inventaire CSV ligne par fichier a été créé : `docs/LOTS/LOT_629_INVENTAIRE_PDF_AUTORISATION_MINISTERIELLE.csv`.
- Les 293 entrées restent au statut « à qualifier / à rapprocher de l'autorisation ». Le nom ou l'emplacement d'un fichier ne prouve ni son titulaire ni sa couverture par l'autorisation.

## Décision technique

1. Ne pas créer de licences fictives ni de références administratives inventées.
2. Conserver le validateur strict du Lot 628.
3. Une fois la référence et le périmètre de l'autorisation consignés, préparer les sidecars documentaires par lot homogène, avec les champs propres à chaque document : source, titulaire/autorité, référence, date, périmètre, déclarant et validation humaine.
4. Commencer par un échantillon autorisé 2AS/3AS : vérifier extraction textuelle, qualité des pages, langue, matière, niveau, puis OCR seulement pour les pages scannées.
5. Générer les chunks RAG avec identifiant du document et numéro de page lorsque l'extraction le permet. Contrôler le manifeste et les postings avant publication du corpus.

## État

- Aucun PDF n'a été extrait, OCRisé, copié ou injecté pendant ce lot.
- Aucun shard RAG n'a été généré.
- Aucun changement de `main`, aucune fusion, aucun déploiement.
- Aucun changement Supabase, Auth, RLS, schéma, données, paiement ou secrets.
- PR #17 reste ouverte et séparée.
- Les tests Python et GitHub Actions restent non certifiés tant que le problème de démarrage des runners du Lot 626 n'est pas résolu.

## Information nécessaire pour l'étape d'ingestion

Pour passer de l'inventaire à l'ingestion, il faudra reporter dans les métadonnées la référence exacte de l'autorisation (ou la référence de la décision/circulaire), sa date, l'autorité émettrice et les catégories de documents/usages couvertes. Il n'est pas nécessaire de publier un document confidentiel dans le dépôt : une référence vérifiable et un emplacement sécurisé de la preuve peuvent être consignés.

# Lot 636 — liaison de génération entre index RAG et shards

## Constat
- Le manifeste présent dans le dépôt était en version 1.0.0 avec zéro shard, alors que `rag.js` n'accepte que la version 2.0.0 avec au moins un shard. Le lecteur utilisait donc le repli sur l'index complet.
- Le contrat navigateur vérifiait les structures, nombres de chunks et unicité des IDs, mais ne prouvait pas que les shards chargés appartenaient à la même génération.
- Le sharder remplaçait les fichiers shard avant le manifeste. Une interruption pouvait laisser un manifeste ancien face à des shards plus récents.

## Correction du contrat
- Génération SHA-256 déterministe calculée sur la représentation JSON canonique de l'index d'entrée.
- La génération est inscrite dans le manifeste et dans chaque fichier shard (`_generation`).
- Le lecteur navigateur exige une empreinte SHA-256 valide dans le manifeste et l'égalité exacte de la génération de chaque shard avant d'accepter le résultat shardé.
- En cas de mélange de générations, le chemin shardé est rejeté en entier et le lecteur conserve le repli sur l'index complet validé ; aucun résultat partiel n'est rendu.
- Tests synthétiques ajoutés pour le format de génération et sa reproductibilité.

## Limites et validation
- Les tests n'ont pas été exécutés dans cette session : disponibilité du runner GitHub non confirmée. Ne pas déclarer CI verte.
- Aucun corpus réel n'a été ingéré, aucun PDF/OCR traité, aucune donnée Supabase/Auth/RLS/paiement modifiée.
- Le manifeste de production du dépôt n'est pas régénéré par ce changement de code ; tant qu'un index réel n'est pas republié avec le sharder, le navigateur reste sur son fallback sûr.
- Aucun déploiement Cloudflare, aucune fusion dans main.

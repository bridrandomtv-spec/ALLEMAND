# 🇩 MODÈLE — Chaîne Allemand (à répliquer pour chaque langue)
> Ce document est la mémoire de la chaîne complète construite pour l'allemand.
> Ne pas oublier : pour ajouter une langue (ex. 1AS anglais), répliquer TOUTE cette chaîne.

## 1) DONNÉES (assets/bdd/) — le contenu
| Fichier | Rôle |
|---|---|
| devoirs.json | Devoirs générés (DV-GEN, texte+questions+corrigé) + devoirs réels transcrits, par unité |
| bac.json / bac_archive.json | Archive examens officiels (texte+corrigé), minuteur + auto-correction |
| buch_pages.json / buch3as_pages.json | Pages du livre (lignes de texte) 2AS/3AS, indexées par page |
| buch_2as.json / buch_3as_lN.json | Leçons interactives (exos auto-corrigés /20) |
| malakhiss.json | الملخصات par unité (idée, grammaire, structures, vocab, conseils) |
| corpus.json | Bibliothèque (documents, sujets, corrigés) + recherche |
| intent_ontology.json | Ontologie darija/ar/fr/arabizi → intents (compréhension) |
| grammaire / vocabulaire | Règles (83) + banque de mots AR↔DE |

## 2) LOGIQUE (js/) — le moteur
| Fichier | Rôle |
|---|---|
| app.js | Boot, séances (déroulé حصة), lecteur livre, coach 🧭, __BOOK__ |
| rag.js | RAG + intents + « lis la page N » + normalisation darija/chiffres |
| voix.js / parle.js / ecoute.js | TTS segmenté par langue, voix, ASR (🎙️) |
| grammaire.js / quiz.js / banque.js | Règles, quiz, banque de contenu |
| devoirnote.js / devoirs_unite.js | Fروض مُنقّطة + devoirs par unité |
| examen.js | Archive BAC minutée |
| masar.js / memoire.js | Parcours + cartes Leitner 🧠 |

## 3) ACCÈS / MONÉTISATION
access.js · paywall.js · billing.js · auth.js · supabase (entitlements, RLS)

## 4) FONCTIONS TRANSVERSES (génériques, réutilisables)
· coach 🧭 (parcours guidé bilingue) · TTS segmenté (voix.js) · ASR (ecoute.js)
· Leitner (memoire.js) · normalisation darija (rag.js) · minuteur+auto-correction

# 🇬 STRATÉGIE 1AS ANGLAIS (répliquer la chaîne)
1. Config langue : code 'en', unités 1AS anglais, TTS en, ASR en.
2. Données : english_pages.json (livre 1AS), english_devoirs.json (DV-GEN par unité),
   english_malakhiss.json, english_vocab/grammar, corpus anglais.
3. Logique : répliquer les modules en paramétrant la langue (ou modules parallèles en.js).
4. Compréhension : étendre intent_ontology (darija → cible anglais).
5. Voix : TTS/ASR en.
6. Accès : access_config par langue.
Priorité : cursus+unités → leçons/livre → devoirs générés → vocab/grammaire →
ملخصات → compréhension → voix → accès.

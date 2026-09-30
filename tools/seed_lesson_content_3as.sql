-- tools/seed_lesson_content_3as.sql — PHASE 7bis : manuel 3AS, Lektion 1 (p5-p9)
-- level='3AS' · unite=10 · free=false → RLS : abonnés actifs uniquement.
-- À exécuter APRÈS supabase/lesson_content.sql (déjà créé). Idempotent.
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p5', 'allemand', '3AS', 10, 5, 'L1 3AS p5 — Deutschland, ein geografischer Überblick (ouverture)', 'Lektion 1 — Deutschland, ein geografischer Überblick (ouverture)
Fotos : Berlin : Nikolaiviertel · Bern : Der Aar
Die deutschsprachigen Länder und Algerien heute : Algier · Wien', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p6', 'allemand', '3AS', 10, 6, 'L1 3AS p6 — Deutschland und seine Nachbarländer (Landkarte)', 'Landkarte : Deutschland und seine Nachbarländer
16 Bundesländer : Schleswig-Holstein · Mecklenburg-Vorpommern · Hamburg · Bremen · Niedersachsen · Brandenburg · Berlin · Sachsen-Anhalt · Nordrhein-Westfalen · Hessen · Thüringen · Sachsen · Rheinland-Pfalz · Saarland · Baden-Württemberg · Bayern
Nachbarländer : Dänemark · Polen · Tschechische Republik · Österreich · Schweiz · Frankreich · Luxemburg · Belgien · Niederlande
Meere : Nordsee · Ostsee', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p7', 'allemand', '3AS', 10, 7, 'L1 3AS p7 — Deutschland, ein geografischer Überblick (Text)', 'Deutschland liegt im Herzen Europas. Seine Hauptstadt ist Berlin. Es besteht aus 16 Bundesländern und gehört zur Europäischen Union. Im Norden grenzt Deutschland an Dänemark und an zwei größere Meere : die Ostsee und die Nordsee, im Osten an Polen und die Tschechische Republik, im Süden an Österreich und die Schweiz und im Westen an Frankreich, Belgien, Luxemburg und Holland.
Der Süden ist bergig und der Norden eine große Ebene. Die Gesamtoberfläche beträgt 357000 Quadratkilometer.
In Deutschland gibt es zwei große Flüsse :
Den Rhein mit einer Gesamtlänge von 1320 Kilometern.
Er entspringt in den schweizerischen Alpen und durchfließt Deutschland in westlicher Richtung über 700 Kilometer und mündet in die Nordsee in Holland.
Er spielt eine wichtige Rolle in der deutschen Ökonomie : 20% aller Waren, die in der BRD transportiert werden, werden auf dem Rhein transportiert.
Der zweite Fluss ist die Donau, sie hat eine Gesamtlänge von 2850 Km und entspringt im Schwarzwald. Sie fließt in östlicher Richtung durch viele Länder und mündet ins Schwarze Meer in Rumänien. Die Donau spielt eine wichtige Rolle in der Produktion von Elektrizität und in der Bewässerung von Agrargebieten.
Andere Flüsse in Deutschland sind die Elbe und die Oder.
Sie fließen von Süden nach Norden und münden in die Nordsee bzw. in die Ostsee. Alle Flüsse in Deutschland führen viel Wasser.
Das Klima in Deutschland ist gemäßigt, d.h. im Sommer ist es warm und im Winter kalt. Die Temperaturen steigen von Minusgraden im Winter bis zu über 30 Grad im Sommer.
Es regnet zu allen Jahreszeiten. Frühling und Herbst sind die schönsten Jahreszeiten.
Deutschland ist ein waldreiches Land. Über ein Viertel seiner Oberfläche ist mit Wäldern bedeckt. Diese helfen, die Luft sauber zu halten.', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p8', 'allemand', '3AS', 10, 8, 'L1 3AS p8 — Übungen 1-4 (R/F · MCQ · Gegenteil · Ergänzen)', '1. Richtig oder falsch ? Begründen Sie Ihre Antwort mit Beispielen aus dem Text.
- Deutschland liegt mitten in Europa.
- Spanien ist sein Nachbarland im Westen.
- Das Klima Deutschlands ist trocken.
- Die Flüsse sind wasserarm.
- Die Donau ist der einzige Fluss, der von Westen nach Osten fließt.
- Der Rhein mündet ins Mittelmeer.
2. Was ist richtig ? Kreuzen Sie an.
- Die Hauptstadt Deutschlands ist : a) Bonn b) Berlin c) Frankfurt
- Die wichtigsten Ströme Deutschlands sind : a) die Elbe und die Oder b) der Rhein und die Donau c) die Oder und die Neisse
- Das Klima in Deutschland ist : a) feucht und kühl b) trocken c) gemäßigt
- Die Gesamtoberfläche beträgt : a) 370000 Km2 b) 320000 Km2 c) 357000 Km2
3. Wie heißt das Gegenteil ?
- Der Norden Deutschlands ist flach, der Süden dagegen ist ...
- Der Rhein ist ein großer Fluss, die Iller ein ...
- In Deutschland ist das Klima gemäßigt, in der Sahara dagegen ...
- Im Sommer ist das Wetter heiß, im Winter ist es dagegen ...
4. Ergänzen Sie. (Berlin · Wäldern · Grenze · 16 Bundesländern · Ebene · waldreich)
- Deutschland besteht aus ...
- ... ist die Hauptstadt Deutschlands.
- Der Norden ist eine große ...
- Der Rhein bildet die natürliche ... zwischen Frankreich und Deutschland.
- Ein großer Teil des Landes ist mit ... bedeckt.
- Deutschland ist ein ... Land.', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p9', 'allemand', '3AS', 10, 9, 'L1 3AS p9 — Übungen 5-7 (Antworten · Übersetzen · grenzen an / gehören zu)', '5. Schreiben Sie die Antworten.
1. Wie heißen die Nachbarländer Deutschlands ? 2. Wie lang ist der Rhein ? 3. Wo mündet die Donau ? 4. In welcher Richtung fließen die meisten Ströme in Deutschland ? 5. Welche Rolle spielen der Rhein und die Donau ? 6. Wozu helfen die Wälder in Deutschland ?
6. Übersetzen Sie ins Arabische.
Deutschland ist ein waldreiches Land.
Die Donau mündet ins Schwarze Meer.
Die größten Flüsse Deutschlands sind der Rhein und die Donau.
Deutschland grenzt im Norden an ...
7. Üben Sie zu zweit wie im Beispiel. (grenzen an + Akkusativ · gehören zu + Dativ)
- An welche Länder grenzt Deutschland im Süden ? → Es grenzt an die Schweiz und Österreich.
- Zu welchem sprachigen Raum gehört Deutschland ? → Es gehört zu den deutschsprachigen Ländern.
- Woran dachten die deutschen Bürger vor 1989 ? → Sie dachten an die Wiedervereinigung Deutschlands.
- Wozu dienen die Schiffe auf dem Rhein ? → Sie dienen zur Beförderung verschiedener Waren.
Tabelle : Deutschland · Algerien · Frankreich · Tunesien · Österreich und die Schweiz · Mali und Niger · das Mittelmeer · Libyen · deutschsprachige Länder · die Maghrebländer · Europäische Union · der Maghreb', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;

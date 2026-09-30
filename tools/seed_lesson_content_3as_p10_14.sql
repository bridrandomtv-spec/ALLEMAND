-- tools/seed_lesson_content_3as_p10_14.sql — PHASE 7bis : manuel 3AS, Lektion 1 (p10-p14)
-- level='3AS' · unite=10 · free=false → RLS : abonnés actifs uniquement.
-- À exécuter APRÈS supabase/lesson_content.sql. Idempotent (on conflict do update).
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p10', 'allemand', '3AS', 10, 10, 'L1 3AS p10 — Fragen bilden · Von wem sprechen Sie ? · Präpositionen ergänzen', '8. Stellen Sie Fragen.
- Die Bäume schützen gegen die Erosion.
- Die Schweiz grenzt an Deutschland im Norden.
- Algerien besteht aus 48 Wilayas.
- Deutschland verfügt über viele Industrieanlagen.
- Wirtschaftlich gehört Deutschland zu den größten Industrienationen der Welt.
Von wem sprechen Sie ?
1. Üben Sie zu zweit wie im Beispiel.
- Von wem sprichst du ?
- Ich spreche von dem Präsidenten.
der Präsident · die Deutschlehrerin · die deutschen Einwohner · die europäischen Bauern
2. Stellen Sie Fragen.
- Wir sprechen von Assia Djebar.
- Sie kümmert sich um die Kinder.
- Peter denkt an seine Brieffreunde.
- Der Professor spricht von der bekannten Kämpferin.
- Der Minister wendet sich an den Präsidenten.
3. Ergänzen Sie die Präposition.
- Die Schweiz besteht … 23 Kantonen.
- Er interessiert sich … das Angebot.
- Algerien grenzt … Tunesien.
- Der grüne Staudamm schützt … der Wüste.
- Wir informieren uns … das Klima.
- Die Jungen bewerben sich … eine Arbeitsstelle.
(um · aus · über · vor · für · an)', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p11', 'allemand', '3AS', 10, 11, 'L1 3AS p11 — Was ist richtig ? (Woran/Womit/Wofür) · Verben mit festen Präpositionen · Komposita', '4. Was ist richtig ?
1. … denken Sie ? a) Woran b) Wovon c) Worauf
2. … sprechen Sie ? a) Womit b) Mit wem c) Wofür
3. … ärgert er sich ? a) Worauf b) Wovon c) Worüber
4. … haben Sie so lange telefoniert ? a) Mit wem b) Womit c) Über wen
Präpositionen in fester Verbindung mit Verben :
denken an + Akkusativ · sich informieren über + Akkusativ · sich unterhalten über + Akkusativ · berichten über + Akkusativ · bestehen aus + Dativ · gehören zu + Dativ · abhängen von + Dativ · schützen vor + Dativ · leiden unter + Dativ · sich interessieren für + Akkusativ · sich freuen über + Akkusativ · sich freuen auf + Akkusativ
1. Bilden Sie Komposita wie im Beispiel.
- Deutschland ist ein Bundesstaat.
- Es hat 16 Bundesländer.
Der Bund + der Staat = der Bundesstaat
Der Bund + das Land = das Bundesland
- Der Bund + die Republik
- Das Land + die Wirtschaft
- Der Handel + die Beziehung
- Der Nachbar + das Land
- Das Holz + die Industrie
- Der Einwohner + die Zahl
- Die Erde + das Öl
- Die Arbeit + der Platz
- Die Industrie + das Land', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p12', 'allemand', '3AS', 10, 12, 'L1 3AS p12 — Futur I : Wo werden Sie Ihre Sommerferien verbringen ?', 'Wo werden Sie Ihre Sommerferien verbringen ?
1. Üben Sie zu zweit wie im Beispiel.
- Wo wirst du nächstes Jahr deine Ferien verbringen ?
- Ich werde in die USA reisen.
Futur : … werden … Infinitiv
Österreich · die Schweiz · Ägypten · Griechenland · Tunesien
2. Setzen Sie die Verben in Klammern ins Futur.
- Was (machen) Sie nächstes Jahr ?
- Die Menschen (reisen) noch mehr.
- Ende Dezember (beginnen) die Winterferien.
- (besuchen) du nächstes Jahr Deutschland ?
3. Bilden Sie Sätze mit werden + Infinitiv.
- Die meisten – schon – am Wochenende – die Arbeiter – nach Hause – fahren.
- Der Verkehr – jährlich – in Algerien – zunehmen.
- Die Regierungen – für dieses Problem – eine Lösung – finden.
- Das – nicht einfach – sein.
- Das Klima – in den nächsten Jahren – sich verändern.', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p13', 'allemand', '3AS', 10, 13, 'L1 3AS p13 — Text : Die deutsche Wirtschaft + Richtig/Falsch', 'Die deutsche Wirtschaft
Deutschland ist die größte Volkswirtschaft in der Europäischen Union und die drittgrößte der Welt.
Deutschland ist Exportweltmeister : Das Warenexportvolumen liegt bei 786 Milliarden Euro (2005). Wichtigste Handelspartner : Frankreich (10,3%), USA (8,8%), Großbritannien (8,3%), Italien (7,1%).
Die wichtigsten Industriebranchen sind : Automobilbau, Maschinenbau, Elektrotechnik, Chemie, Umwelttechnologie, Feinmechanik, Optik, Medizintechnik, Biotechnologie, Luft- und Raumfahrt, Logistik.
Deutschland ist ein attraktiver Standort für ausländische Investoren. Die 500 größten Firmen der Welt sind präsent, insgesamt 22000 ausländische Firmen mit 2,7 Millionen Mitarbeitern.
Deutschland verfügt über eine hoch entwickelte und dynamisch wachsende Infrastruktur. Das Schienennetz der Bahn umfasst 36000 km, das Straßennetz 230000 km. Das Land verfügt über eins der weltweit modernsten Telefon- und Kommunikationsnetze.
Etwa zwei Drittel aller global führenden Branchenmessen finden in Deutschland statt (ca. 140 internationale Messen).
1. Richtig oder falsch ? Begründen Sie Ihre Antwort mit Beispielen aus dem Text.
- Deutschland ist die erstgrößte Volkswirtschaft der Welt.
- Die Landwirtschaft spielt eine große Rolle.
- Deutschland ist nur durch einige Industriebranchen in der Welt bekannt.
- Die ausländischen Unternehmen investieren nicht viel in Deutschland.
- Deutschland hat eine hochentwickelte Infrastruktur.', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p14', 'allemand', '3AS', 10, 14, 'L1 3AS p14 — Wirtschaft : Wörter ergänzen · Antworten · Übersetzen · Passiv', '2. Ergänzen Sie die fehlenden Wörter.
- Deutschland ist ein …
- Der … spielt eine wichtige Rolle.
- Frankreich ist der größte …
- Eine wichtige … ist die Elektrotechnik.
- Es gibt viele … in Deutschland.
(Branche · Messen · Außenhandel · Industrieland · Handelspartner)
3. Schreiben Sie die Antworten.
1. Zu welcher Gemeinschaft gehört Deutschland ?
2. Welche Rolle spielt der Export in der deutschen Wirtschaft ?
3. Was charakterisiert die deutsche Infrastruktur ?
4. Welche Branche in der deutschen Industrie ist international die bekannteste ?
4. Übersetzen Sie ins Arabische.
Deutschland ist eines der reichsten Länder der Welt. Es ist heute die dritte Wirtschaftsmacht in der Welt.
Heute werden viele Autos eingeführt…
5. Hören Sie zu, sprechen Sie nach und variieren Sie das Gespräch.
- Heute werden viele Autos exportiert.
- Früher dagegen wurden mehr landwirtschaftliche Produkte exportiert.
- Vor einigen Jahren ist die Nanotechnologie gefördert worden.
Passiv : Präsens = werden + Partizip II · Präteritum = wurden + Partizip II · Perfekt = sein + Partizip II + worden
heute / früher / seit einigen Jahren / Verb :
Die Deutschen : Milchprodukte / Agrarprodukte / Südfrüchte / konsumieren
Die Algerier : Süßigkeiten / Agrarprodukte / Fleisch / verbrauchen
Die Chinesen : Textilien / Stahl und Eisen / elektronische Produkte / produzieren', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;

-- tools/seed_lesson_content_3as_p15_19.sql — PHASE 7bis : manuel 3AS, Lektion 1 (p15-p19)
-- level='3AS' · unite=10 · free=false → RLS : abonnés actifs uniquement.
-- À exécuter APRÈS supabase/lesson_content.sql. Idempotent (on conflict do update).
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p15', 'allemand', '3AS', 10, 15, 'L1 3AS p15 — Passiv Präsens/Präteritum/Perfekt + Passiv Futur (werden + PII + werden)', '6. Setzen Sie folgende Sätze ins Passiv Präsens, Präteritum und Perfekt.
- Man produziert viele Autos in Deutschland.
- Man transportiert 20% aller Waren auf Schiffen.
- Deutschland führt Erdöl und Erdgas ein.
- Algerien exportiert Erdöl und Erdgas.
- Viele Städte in Deutschland organisieren Messen.
- In Österreich baut man Weizen und Mais an.
Viele Autos werden aus Deutschland ausgeführt werden.
1. Üben Sie zu zweit wie im Beispiel.
- Was wird aus der Schweiz ausgeführt werden ?
- Schokolade wird aus der Schweiz exportiert werden.
Passiv Futur : werden + Partizip II + werden
Die Schweiz exportieren Schokolade · Deutschland einführen Erdgas und Erdöl · Österreich produzieren Holz · Algerien restaurieren die Casbah
2. Setzen Sie diese Sätze ins Passiv Futur.
- Algerien wird Sonnenenergie produzieren.
- Deutschland wird die alten Bauten renovieren.
- Die Länder werden die Wälder schützen.
- Algerien wird in der Zukunft Autos erzeugen.
Foto : Autoindustrie', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p16', 'allemand', '3AS', 10, 16, 'L1 3AS p16 — Text : Algerien heute (Lage · 48 Wilayas · Klima · Wirtschaft)', 'Algerien heute
Algerien liegt in Nordafrika. Es ist ein Staat mit 48 Wilayas, die in 160 Dairas und 1541 Gemeinden unterteilt sind.
Seine Nachbarländer sind : Tunesien und Libyen im Osten, der Niger im Südosten, Mali und Mauretanien im Südwesten, die Westsahara und Marokko im Westen.
Im Norden grenzt Algerien an das Mittelmeer.
Die Fläche Algeriens beträgt 2 376 391 Quadratkilometer. In Algerien leben heute 32,5 Millionen Menschen. Der größte Teil der Bevölkerung (96%) lebt an den Küsten im Norden des Landes, in Großstädten wie Algier, Constantine, Oran und Annaba. In der Hauptstadt leben mehr als 4 Millionen Einwohner.
Das Klima ist ziemlich mild im Norden. Im Süden ist es trocken und heiß.
Algerien hat viele aber wasserarme Flüsse (oueds).
Obwohl die landwirtschaftliche Anbaufläche nicht groß ist (3% der Gesamtoberfläche), spielt die Landwirtschaft eine wichtige Rolle. Vor allem wird Getreide besonders Weizen und Gerste produziert. Die anderen Produkte sind : Kartoffeln, Datteln, Oliven, Orangen, Feigen und Trauben.
Trotzdem muss Algerien noch Nahrungsmittel importieren, denn nur 25% seiner Bedürfnisse werden durch die nationale Produktion befriedigt.
Algerien ist eines der reichsten Länder Afrikas. Das Land, das über sehr große Erdgasreserven verfügt und zu den führenden Erdölproduzenten zählt, hat seine Entwicklung auf die Förderung, die Produktion und die Ausfuhr seiner Bodenschätze gegründet.
Algerien exportiert Erdöl und Erdgas nach Europa und Amerika. Es hat gute Handelsbeziehungen mit den Entwicklungsländern und mit den Industrieländern auf der ganzen Welt.
Fotos : Hassi Messaoud · Hafen', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p17', 'allemand', '3AS', 10, 17, 'L1 3AS p17 — Übungen zu « Algerien heute » (Tabelle · Gegenteile · fehlende Wörter · Fragen)', '1. Ergänzen Sie die Tabelle.
Algerien heute : Lage · Gliederung · Einwohner · Klima · Wirtschaft
2. Geben Sie die Gegenteile von den hier unterstrichenen Wörtern.
- Heute lebt die Mehrheit in den Städten, … lebte sie auf dem Land.
- Im Süden ist es trocken, im Norden ist es …
- Algerien ist reich an Rohstoffen, aber seine Flüsse sind wasser …
3. Ergänzen Sie die fehlenden Wörter.
- Algerien besteht aus …
- Algerien ist reich an …
- Es produziert …
- Die … bildet den großen Teil der Oberfläche.
- Seine Ströme sind …
(wasserarm · Feigen Orangen und Oliven · 160 Dairas · Erdöl und Erdgas · Wüste)
4. Antworten Sie auf die Fragen.
1. Wie heißen die Nachbarländer Algeriens ?
2. Wo konzentrieren sich die Einwohner ?
3. Wie ist das Klima ?
4. Nennen Sie einige algerische Ströme.
5. Wie sind die Handelsbeziehungen Algeriens mit den anderen Ländern der Welt ?', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p18', 'allemand', '3AS', 10, 18, 'L1 3AS p18 — Passiv mit Modalverben (Präsens · Präteritum · Perfekt)', 'Datteln können ausgeführt werden…
1. Üben Sie zu zweit wie im Beispiel.
- Kann Algerien Datteln ausführen ?
- Ja, Datteln können von Algerien ausgeführt werden.
- Konnte Algerien Getreide ausführen ?
- Ja, Getreide konnten von Algerien ausgeführt werden.
Passiv Präsens : kann + ausgeführt werden
Passiv Präteritum : konnte + ausgeführt werden
Algerien ausführen Datteln Getreide · Deutschland produzieren Milchprodukte Fleisch · Die USA exportieren Maschinen Getreide · Österreich erzeugen das Holz Mais · Algerien renovieren die alten Gebäude die Casbah
2. Antworten Sie mit einem Passivsatz im Präsens.
- Muss Algerien Nahrungsmittel einführen ?
- Muss Deutschland Rohstoffe importieren ?
- Kann die deutsche Landwirtschaft alle Bedürfnisse des Landes befriedigen ?
- Kann man viele Produkte per Schiff befördern ?
- Dürfen die Kinder viele Süßigkeiten verbrauchen ?
3. Setzen Sie die Antworten von Übung 2 ins Passiv Präteritum.
4. Üben Sie zu zweit wie im Beispiel.
- Haben genug Autobahnen gebaut werden müssen ?
- Nein, leider nicht genug Autobahnen haben gebaut werden müssen.
Autobahnen bauen · Parks anlegen · Krankenhäuser bauen · Brücken einrichten · Verkehrsmittel modernisieren
Passiv Perfekt : haben + gebaut werden müssen', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p19', 'allemand', '3AS', 10, 19, 'L1 3AS p19 — Passiv Perfekt + Umformungen Passiv/Aktiv (Zeitformen)', '5. Antworten Sie mit einem Passivsatz im Perfekt.
- Hat Algerien Nahrungsmittel importieren müssen ?
- Hat Österreich Rohstoffe einführen müssen ?
- Hat man den Staudamm realisieren können ?
- Haben die Jugendlichen eine Arbeitsstelle finden sollen ?
- Hat Algerien die Landwirtschaft entwickeln müssen ?
6. Setzen Sie ins Passiv. (Achten Sie auf die Zeitform.)
- Man kann Eisen in große Schiffe auf dem Rhein verladen.
- Man sollte viele Lebensmittel erzeugen.
- Man muss das Problem der Arbeitslosigkeit lösen.
- Die Industrieländer haben die Umwelt schützen sollen.
7. Setzen Sie ins Aktiv. (Achten Sie auf die Zeitform.)
- Viele Staudämmer müssen gebaut werden.
- Lebensmittel haben von Algerien importiert werden müssen.
- In Algerien können Datteln, Orangen und Oliven produziert werden.
- Viele Waren konnten nach Amerika und Europa ausgeführt werden.', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;

-- tools/seed_lesson_content_3as_p20_24.sql — PHASE 7bis : manuel 3AS, Lektion 1 (p20-p24)
-- level='3AS' · unite=10 · free=false → RLS : abonnés actifs uniquement.
-- À exécuter APRÈS supabase/lesson_content.sql. Idempotent (on conflict do update).
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p20', 'allemand', '3AS', 10, 20, 'L1 3AS p20 — Text : Österreich (Mitteleuropa · 9 Bundesländer · Wien) + R/F + Tabelle', 'Österreich
Österreich ist ein deutschsprachiges Land. Es liegt in Mitteleuropa. Seine Hauptstadt ist Wien, eine Stadt der Musik, des Theaters und der Kunst.
Österreich gehört der Europäischen Union an. Es besteht aus 9 Bundesländern. Es hat eine Gesamtoberfläche von 84 000 Km². Es ist ein seenreiches und bergiges Land.
Im Norden grenzt Österreich an die Tschechische Republik, im Nordwesten an die Slowakei, im Osten an Slowenien und Italien, im Süden an die Schweiz, im Westen an das Lichtenstein und Deutschland.
In Österreich leben ca 8 184 000 Menschen. Ein Drittel der Bevölkerung lebt in den Großstädten wie Wien, Graz, Linz, Salzburg und Innsbruck.
Die Landwirtschaft beschäftigt 5,7% der Berufstätigen.
Österreich produziert vor allem Gerste, Weizen und Mais.
Das Holz ist einer der großen Reichtümer des Landes.
1. Was ist richtig ? Was ist falsch ? Kreuzen Sie an.
- In Österreich spricht man Deutsch.
- Frankreich ist ein Nachbarland von Österreich.
- Es ist arm an Seen und Bergen.
- Ein Drittel der Bevölkerung lebt auf dem Land.
- Österreich produziert vor allem Erdöl und Erdgas.
2. Sammeln Sie die fehlenden Informationen und ergänzen Sie.
Hauptstadt · Fläche · Einwohnerzahl · wichtige Städte · Amtssprache · längster Fluss · Währung · höchster Berg', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p21', 'allemand', '3AS', 10, 21, 'L1 3AS p21 — Text : Die Schweiz (Bern · Zürich · 20 Kantone · 4 Sprachen) + Richtig/Falsch', 'Die Schweiz
Zum deutschsprachigen Raum gehört auch die Schweiz, ein kleines Land in Südeuropa.
Ihre Hauptstadt ist Bern und die größte Stadt ist Zürich.
Die Schweiz liegt in den westlichen Alpen. Ihre Nachbarländer sind: Frankreich im Westen, Deutschland im Norden, Österreich und das Lichtenstein im Osten und Italien im Süden.
Die Gesamtoberfläche beträgt 41 293 Quadratkilometer. Die Schweiz besteht aus 20 Kantonen und 6 Halb-Kantonen. Sie hat 7 483 700 Einwohner. Es wird in der Schweiz am häufigsten Deutsch, aber auch Französisch, Italienisch und Rätoromanisch gesprochen.
Auch die Schweiz ist ein seen- und bergreiches Land. Die Industrie, die Banken und der Tourismus spielen eine wichtige Rolle in der Wirtschaft des Landes.
(Die Statistik von 2005)
1. Richtig oder falsch ? Begründen Sie Ihre Antwort mit Beispielen aus dem Text.
- Die Schweiz gehört zu den deutschsprachigen Ländern.
- Die Schweiz ist ein mehrsprachiges Land.
- Die Schweiz liegt mitten in Europa.
- Die Schweiz ist ein seen- und bergreiches Land.
- Die Banken sind von größter Bedeutung für die Wirtschaft.
Foto : Genf', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p22', 'allemand', '3AS', 10, 22, 'L1 3AS p22 — Wiederholung Zum Sprechen : Geschichte Deutschlands (BRD/DDR · Mauer · Wiedervereinigung) + Fragen + Daten Algeriens', 'Wiederholung — Zum Sprechen
1. Lesen Sie den Text.
Am Ende des zweiten Weltkriegs wurde Deutschland von den Alliierten besetzt. Das Land wurde in vier Zonen und Berlin in vier Sektoren geteilt. Die meisten deutschen Städte waren stark zerstört.
1949 wurden die zwei deutschen Staaten gegründet : die Bundesrepublik Deutschland (BRD) im Westen und die Deutsche Demokratische Republik (DDR) im Osten.
In den fünfziger Jahren wurde es für die DDR-Bürger immer schwieriger, in den Westen zu flüchten (Eiserner Vorhang).
Am 13. August 1961 wurde die Berliner-Mauer gebaut. Es war jetzt fast unmöglich, nach Westberlin zu kommen. Am 9. November 1989 fiel die Mauer, und die Grenze zwischen Ost- und Westdeutschland wurde geöffnet.
Was in der Nacht des 9. Novembers 1989 geschah, hatte niemand erwartet. Mit Begeisterung feierten die Deutschen dieses bedeutende Ereignis. Am 3. Oktober 1990 wurde Deutschland offiziell vereint.
2. Antworten Sie auf diese Fragen.
1. Wann wurde das Land in vier Zonen geteilt ?
2. Welche Staaten wurden 1949 gegründet ?
3. Was wurde 1961 gebaut ? Warum ?
4. Wann fiel die Mauer ?
5. Was feiern die Deutschen am 3. Oktober jedes Jahres ?
3. Sprechen Sie über die Geschichte Algeriens.
- Was ist geschehen am : 5.7.1830 · 8.5.1945 · 1.11.1954 · 20.8.1955 · 11.12.1960 · 5.7.1962', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p23', 'allemand', '3AS', 10, 23, 'L1 3AS p23 — Zum Lesen : Wien + Hamburg, Tor zur Welt (Hafen · Elbe · Nordostseekanal)', 'Zum Lesen
1. Lesen Sie den Text.
In der Hauptstadt, dem wirtschaftlichen Zentrum ganz im Osten des Landes, wohnen fast zwanzig Prozent aller Österreicher. Reich an Kunst und Kultur.
Wien zieht jedes Jahr zahlreiche Touristen aus aller Welt an. Sie erfreuen sich an der Architektur ebenso wie an den kulinarischen Spezialitäten, die man in den gemütlichen Cafés und Gasthäusern serviert.
2. Stimmt das ? oder stimmt das nicht ? Kreuzen Sie an.
- Wien ist die Hauptstadt Österreichs.
- Wien liegt im Westen des Landes.
- Sie ist kunst- und kulturreich.
- Nicht viele Touristen besuchen sie.
3. Lesen Sie den Text.
Hamburg, Tor zur Welt
Das Tor zur Welt, so nennen die Hamburger ihre Stadt.
Das Tor ist der Hamburger Hafen, einer der größten und modernsten Häfen Europas. Rund 14000 Seeschiffe aus fast 100 Ländern kommen jedes Jahr hierher. Hamburg liegt nicht am Meer, sondern an der Elbe, rund 100 Km von der Nordsee entfernt. Die meisten Schiffe kommen von der Nordsee nach Hamburg, aber viele skandinavische, baltische und russische Schiffe kommen auch von der Ostsee über den Nordostseekanal und die Elbe nach Hamburg.
Die Hamburger sind sehr stolz auf ihren Hafen.', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p24', 'allemand', '3AS', 10, 24, 'L1 3AS p24 — Fragen zu Hamburg + Foto « Der Hafen von Hamburg »', '4. Antworten Sie auf die Fragen.
- Was bedeutet Hamburg für die Hamburger ? Warum ?
- An welchem großen Strom liegt Hamburg ?
- Aus welchen Gegenden kommen die meisten Schiffe nach Hamburg ?
- Welches Gefühl empfinden die Hamburger für ihren Hafen ?
Foto : Der Hafen von Hamburg', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;

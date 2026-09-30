-- tools/seed_lesson_content_3as_p31_35.sql — PHASE 7bis : manuel 3AS, Lektion 2 (p31-p35)
-- level='3AS' · unite=11 · free=false → RLS : abonnés actifs uniquement. Idempotent.
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p31', 'allemand', '3AS', 11, 31, 'L2 3AS p31 — Künstlerleben (ouverture) : Bach · Skandrani · Mozart und Linley', 'Lektion 2 — Künstlerleben (ouverture)
Fotos : Der junge Bach · Mustapha Skandrani · Leopold, Wolfgang und Nannerl
Künstlerleben
Foto : Mozart und Linley', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p32', 'allemand', '3AS', 11, 32, 'L2 3AS p32 — Text : Goethe (1749-1832) + Was stimmt ? + Ergänzen + Antworten + Übersetzen', 'Goethe
Johann Wolfgang von Goethe wurde am 28. August 1749 in Frankfurt am Main geboren. Den ersten Unterricht erhielt er von seinem Vater, der Jurist war. Später wurde der junge Johann von den besten Lehrern Frankfurts erzogen. Zwischen 1765 und 1768 studierte er Rechtswissenschaften in Leipzig. Wegen einer schlimmen Krankheit kehrte er nach Frankfurt zurück, wo er später, aber nur für einige Zeit, als Advokat arbeitete. Danach begann der große Dichter, sich für Theater und Literatur zu interessieren.
Am 22. März 1832 ist der berühmte Schriftsteller in Weimar gestorben.
Goethe ist der wichtigste Vertreter der Weimarer literarischen Klassik, der literarischen Bewegung «Sturm und Drang» und ein bedeutender Vertreter der Weltliteratur.
Einige weltbekannte Werke sind : Faust - eine Tragödie (1. Teil), Faust (2. Teil), «die Leiden des jungen Werthers».
Foto : Johann Wolfgang von Goethe (1749-1832)
1. Was stimmt ? Was stimmt nicht ? Kreuzen Sie an.
- Goethe wurde in Wien geboren.
- Goethes Vater war Jurist.
- Goethe studierte Medizin.
- Er ist 1832 gestorben.
- Er hatte kein Interesse an Theater.
2. Ergänzen Sie. (bedeutend · zurückkehren · erhielt · bekannt · Dichter)
- Kateb Yacine ist ein … Schriftsteller.
- Marie Curie … zwei Nobelpreise.
- Pasteur ist ein … Wissenschaftler.
- Nach seinem Studium … Goethe nach Frankfurt …
- Moufdi Zakaria ist ein berühmter …
3. Antworten Sie.
1. Wann und wo wurde Goethe geboren ?
2. Von wem wurde er erzogen ?
3. Warum blieb er nicht in Leipzig ?
4. Wofür interessierte er sich ?
5. Erklären Sie den folgenden Satz : «Goethe ist einer der wichtigsten Vertreter der Weltliteratur».
4. Übersetzen Sie ins Arabische.
Danach interessierte sich der große Dichter für Theaterstücke und Romane.
Er ist der Vertreter der Weimarer literarischen Klassik.', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p33', 'allemand', '3AS', 11, 33, 'L2 3AS p33 — erst/nur : Konzert-Dialog + Tabelle + Erst oder nur ? + Goethes Haus in Weimar', 'Goethe arbeitete nur für einige Zeit als Rechtsanwalt.
1. Üben Sie zu zweit wie im Beispiel.
- Ich gehe heute abend ins Konzert. Kommst du mit ?
- Ja, aber erst um 21 Uhr. Wie lange dauert das Konzert ?
- Es dauert nur 1 Stunde.
Tabelle : Um 21 Uhr / 1 Stunde · Um 20 Uhr / 2 Stunden · Um 18 Uhr / 1.30 · Um 19 Uhr / 45 Minuten
2. Erst oder nur ?
- Die Musiker spielten … zwei moderne Stücke.
- Der Zuschauer hat die Karten für das Konzert … heute bekommen.
- Das Theater ist fast voll, es gibt … drei freie Plätze.
- Der Dirigent kam … um 22 Uhr an.
- Der Film beginnt … nach den Abendnachrichten.
- Auf dem Programm stand … klassische Musik.
Foto : Goethes Haus in Weimar', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p34', 'allemand', '3AS', 11, 34, 'L2 3AS p34 — Adjektivdeklination : Goethe, ein bedeutender Dichter (Tabellen A/B + ergänzen)', 'Goethe, ein bedeutender Dichter...
1. Üben Sie zu zweit wie im Beispiel.
Wie finden Sie die letzte Oper von Mozart ? → Das ist eine wunderbare Oper.
Tabelle : Oper Mozart / letzt+wunderbar · Filme Lakhdar Hamina / neu+phantastisch · Roman Assia Djebar / letzt+interessant · Theaterstück Thomas Bernhard / erst+monoton · Violinkonzert Tschaikowsky / herrlich
2. Ergänzen Sie die Tabellen.
A- Nom und Akkusativ × Singular/Plural : der alt… Dichter · d… alt … Buch · d… alt… Dichterin · d… alt… Bücher
B- Nom und Akkusativ : ein berühmt … Film · ein berühmt … Theaterstück · ein … berühmt … Sinfonie · berühmt… Filme
3. Ergänzen Sie.
- D… italienisch … Musik hatte ein… groß… Einfluss auf seine später… Werke.
- D… begabt… Junge komponierte schön… Musikstücke.
- Viele gut… Filme kommen aus Amerika.
- D… jung… Pianistin muss täglich sechs Stunden üben.
- Neulich wurde das alt… Stadttheater in Algier renoviert.
- Dies… modern… Museum wurde von einem bekannten Architekten entworfen.', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p35', 'allemand', '3AS', 11, 35, 'L2 3AS p35 — Text : Mozart, das Wunderkind + Stimmt das ? (6)', 'Mozart, das Wunderkind
Wolfgang Amadeus Mozart wurde im Jahre 1756 in Salzburg geboren. Sein Vater Leopold war Musiker von Beruf und brachte dem begabten jungen Wolfgang sehr früh das Klavierspielen bei : Mit 3 Jahren spielte er schon ganze Musikstücke auswendig und mit 5 komponierte er seine ersten Werke.
Ein Jahr später ging er mit seinen Eltern und seiner Schwester Nannerl auf Tournee in die größten Städte Europas (nach Paris, London, München, Wien,…). In Wien spielte er sogar vor dem Kaiser. Überall hatte das Wunderkind großen Erfolg.
Mit 26 Jahren heiratete er Konstanze Weber und lebte mit ihr in Wien. Er verdiente mit seiner Musik genug Geld, aber er gab es immer sofort aus : wenn er nicht komponierte, spielte er Karten oder Billard. Geld interessierte ihn nicht : Er hatte Schulden in ganz Wien.
Mozart hat uns viele Werke hinterlassen : Sinfonien, Konzerte und Opern wie «Die Zauberflöte» oder «Don Giovanni».
Sein letztes Werk ist das «Requiem». Er starb 1791 arm und vergessen.
Man feierte ihn erst viel später als großes Genie.
Foto : Wolfgang Amadeus Mozart (1749-1791)
1. Stimmt das ? Stimmt das nicht ? Kreuzen Sie an. Begründen Sie Ihre Antwort.
- Mozart begann spät das Klavierspielen.
- Er komponierte Musikstücke mit 5 Jahren.
- Er ist nie auf Tournee gegangen.
- Seine Musik hatte keinen Erfolg.
- Er hat wenige Werke hinterlassen.
- Mozart ist reich gestorben.', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;

-- tools/seed_lesson_content_3as_p25_29.sql — PHASE 7bis : manuel 3AS, Lektion 1 (p25-p29)
-- level='3AS' · unite=10 · free=false → RLS : abonnés actifs uniquement.
-- À exécuter APRÈS supabase/lesson_content.sql. Idempotent (on conflict do update).
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p25', 'allemand', '3AS', 10, 25, 'L1 3AS p25 — Zum Hören : Wo war es am schönsten ? (Herr Lang / Herr Ito · deutschsprachige Länder)', 'Zum Hören
1. Hören Sie zu.
Wo war es am schönsten
Herr Lang : Entschuldigen Sie, ist hier noch ein Platz frei ?
Herr Ito : Ja, bitte
Herr Lang : Danke sehr ! Machen Sie nur eine kurze Reise ?
Herr Ito : Ja, ich fahre nur bis Frankfurt. Ich arbeite dort.
Herr Lang : Sie arbeiten in Frankfurt ! Wie lange schon ?
Herr Ito : Seit eineinhalb Jahren bin ich in Europa, die meiste Zeit in Frankfurt. Aber ich war auch einige Monate in der Schweiz. Und zwei Wochen in Österreich. Am 1. März reise ich nach Japan zurück.
Herr Lang : Dann haben Sie ja viel gesehen. Sagen Sie mal, welches Land hat Ihnen am besten gefallen ?
Herr Ito : Das kann ich nicht so einfach sagen. Am interessantesten war für mich Frankfurt, aber landschaftlich finde ich die Schweiz am schönsten, so viel Berge und Seen - es ist wirklich herrlich dort!
Herr Lang : Und wie hat Ihnen Österreich gefallen ?
Herr Ito : Auch sehr gut. Ich war im November zwei Wochen in Wien. Die Leute dort sind sehr nett und freundlich.
Herr Lang : Nun, Sie haben alle diese deutschsprachigen Länder gesehen. In welchem Land möchten Sie am liebsten leben ?
Herr Ito : Tja ... am liebsten in Japan - es ist meine Heimat.
Foto : Frankfurt am Main', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p26', 'allemand', '3AS', 10, 26, 'L1 3AS p26 — Was stimmt ? Was stimmt nicht ? (Herr Ito) + Fotos Köln & Der Rhein', '2. Was stimmt ? Was stimmt nicht ? Kreuzen Sie an.
- Herr Ito ist seit 2 Jahren in Europa.
- Er arbeitet in Frankfurt.
- Er kommt aus Japan.
- Die Schweiz ist landschaftlich am schönsten.
- Er hat die drei deutschsprachigen Länder besucht.
Fotos : Köln (Dom + Brücke) · Der Rhein (Schiff)', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p27', 'allemand', '3AS', 10, 27, 'L1 3AS p27 — Zum Schreiben : E-Mail über Ihr Land + Städte-Tabelle (Gruppenarbeit)', 'Zum Schreiben
1. Schreiben Sie anhand der folgenden Fragen eine E.Mail an Ihren Freund/ Ihre Freundin über Ihr Land.
- Wo liegt Ihr Land ? Wie groß ist es ?
- Wie viele Einwohner hat es ?
- Welche Sprache spricht man?
- Wie heißt die Hauptstadt ? Wie groß ist sie ?
- Welche andere Großstädte gibt es ?
- Wie ist das Klima ?
- Nennen Sie einige Flüsse und Gebirge.
- Nennen Sie die positiven und negativen Eigenschaften ihrer Landsleute.
2. Schreiben Sie ein paar Zeilen über die folgenden Städte (Gruppenarbeit).
Tabelle : Tamanrasset (Im Süden…) · Basel · Salzburg · München
Spalten : Wo liegt sie ? · Einwohnerzahl · Oberfläche · Sehenswürdigkeit/Ereignisse (Fastnacht · Biergärten) · Kulinarische Spezialitäten (Weißwurst)', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p28', 'allemand', '3AS', 10, 28, 'L1 3AS p28 — Informationen : Ein Tor für den Frieden (Brandenburger Tor · Berliner Mauer)', 'Informationen
Ein Tor für den Frieden
Das Brandenburger Tor stand vom Ende des Krieges 1945 bis zum Tag der deutschen Vereinigung direkt an der Grenzlinie zwischen dem Ostsektor und den West-Sektoren Berlins auf Ostberliner Gebiet. 1961 - 1989 gehörte es zum Sperrbezirk an der Berliner Mauer und symbolisierte die Teilung von Ost und West. Seit dem Fall der Mauer ist der Personenverkehr der Deutschen wieder frei.
Fotos : Das Brandenburger Tor · Der Fall der Berliner Mauer', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;
insert into public.lesson_content (id, subject, level, unite, page, titre, body, free) values ('3as-p29', 'allemand', '3AS', 10, 29, 'L1 3AS p29 — Wortschatz L1 (Substantive · Adjektive · Adverbien · Funktionswörter · Verben)', 'Wortschatz
Substantive : die Ausfuhr ≠ die Einfuhr · das Ausland · das Bedürfnis(se) · der Bodenschatz(¨e) · das Ereignis(se) · das Erdöl · das Erdgas · der Export · der Import · die Gerste · das Gebiet(e) · das Getreide · die Heimat · der Kern(e) · das Holz · die Knappheit · der Konzern(e) · die Messe(n) · das Nachbarland(¨er) · der Raum(¨e) · der Reichtum(¨er) · das Schienennetz(e) · der Standort(e) · das Telefonnetz(e) · der Unternehmer(-) · die Währung(en) · der Weizen · das Entwicklungsland(¨er)
Adjektive : arm an + Dativ · berufstätig · durchschnittlich · feucht · gemäßigt · gemütlich · kulinarisch · mild · trocken · reich an + Dativ · landschaftlich · nördlich · südlich · östlich · westlich · gehören zu + Dativ
Adverbien : vor allem · insgesamt · rund · ungefähr
Funktionswörter : trotz + Genitiv
Verben : ab/hängen von+Dativ · an/ziehen · aus/führen · befriedigen · bestehen aus + Dativ · bewässern · durchfließen · ein/führen · entspringen in + Dativ · sich erfreuen an + Dativ · erwarten · exportieren · fließen · flüchten · führen · geschehen · grenzen an + Akkusativ · gründen · liegen bei + Dativ · importieren · münden in + Akkusativ · schützen gegen + Akkusativ · umfassen · zählen zu + Dativ', false) on conflict (id) do update set body = excluded.body, titre = excluded.titre;

# WayGo ✦ — WOW verzia

## Obsah
- `index.html`, `home.html` — vstup a moderná úvodná stránka
- `feed.html` — **201 otázok** priamo v HTML, a–h, čiastočné XP
- `account.html` — registrácia, prihlásenie, profil, leaderboard
- `social.html` — študijné skupiny
- `vip.html` — Free vs VIP **4,99 €/mesiac**
- `admin.html` — admin dashboard (serverom overené oprávnenie)
- `config.js` — verejné Supabase URL a publishable/anon kľúč
- `supabase_setup.sql` — databáza, RLS, RPC a denný limit
- `questions_seed_REVIEW_FIRST.sql` — predbežné kľúče, pred aktiváciou XP overiť
- `functions/` — Supabase Edge Functions pre Stripe Checkout a webhook

## Spustenie
1. Nahraj celý obsah na HTTPS hosting, napr. GitHub Pages/Netlify. Na vizuálne otestovanie stačí otvoriť `index.html` v prehliadači. Bez Supabase funguje **len lokálne demo** (XP a limit sa dajú resetovať a nejde o skutočné zabezpečenie).
2. V Supabase SQL editore spusti `supabase_setup.sql`, potom `questions_seed_REVIEW_FIRST.sql`. V `config.js` doplň `supabaseUrl` a **publishable/anon key**, nikdy service_role.
3. V Supabase Auth nastav Site URL a Redirect URLs. V `account.html` si zaregistruj svoj admin účet. **Heslo sa nikdy neukladá do kódu.** Ak si ho už niekde zverejnila, zmeň ho.
4. V SQL editore nastav admin rolu podľa komentára na konci `supabase_setup.sql`, podľa **UUID existujúceho Auth účtu** alebo e-mailu. Admin panel kontroluje oprávnenie serverovo, nie len e-mailom v JavaScripte.
5. Pre platby vytvor v Stripe produkt s mesačným predplatným **4,99 EUR** a získaj jeho Price ID. Nastav Edge Function secrets `STRIPE_SECRET_KEY`, `STRIPE_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SITE_URL`. Nasaď `create-checkout` a `stripe-webhook` (webhook s `--no-verify-jwt`) a zaregistruj webhook URL v Stripe pre `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
6. **Pred reálnym predajom** over daňové, obchodné, spotrebiteľské a vekové požiadavky poskytovateľa platieb, zásady súkromia a zrušenie predplatného. Pri neplnoletom prevádzkovateľovi je potrebná spolupráca zákonného zástupcu.

## Dôležité limity
- Free má **20 rôznych otázok za deň (UTC)**, VIP nemá limit. Limity sa pri zapnutom Supabase kontrolujú serverovo.
- 0 chýb = 10 XP; 1 = 8; 2 = 6; 3 = 4; 4 = 2; 5+ = 0. Nesprávne zvolené aj vynechané správne možnosti sa počítajú ako chyby. XP len raz na otázku.
- Zdrojové PDF obsahovalo **201 otázok** s chýbajúcim číslom 181. Kľúč je **predbežný**; SQL seed označuje všetky otázky na overenie, teda zatiaľ neprideľujú produkčné XP. Admin môže každú po overení povoliť.
- `questions.json` a embedded JSON vo `feed.html` sú verejné a obsahujú predbežné odpovede; **neslúžia ako bezpečný testový kľúč**. Produkčné XP prideľuje len Supabase RPC, nie klient.
- Platobné funkcie nie sú automaticky aktívne bez tvojich vlastných Stripe účtov a tajných serverových kľúčov. Balík **neobsahuje** hotový portál na zrušenie predplatného; pred verejným spustením ho doplň (napr. Stripe Customer Portal).


## Prihlasovanie (nové stránky)
- `login.html` — e-mail/heslo a Google, Apple, Microsoft OAuth.
- `signup.html` — registrácia a potvrdenie e-mailu.
- `reset-password.html` — odoslanie odkazu na obnovu hesla.
- `update-password.html` — nastavenie nového hesla po kliknutí na odkaz.
- `auth-callback.html` — OAuth a potvrdenie prihlásenia.
- `account.html` — odkazy na autentifikačné stránky, profil, XP a rebríčky.

V Supabase Dashboard → Authentication → Providers zapni Google, Apple a Azure (Microsoft) a vyplň ich Client ID/Secret získané v konzolách jednotlivých poskytovateľov. V Authentication → URL Configuration nastav Site URL na svoju HTTPS doménu a povoľ Redirect URLs: `https://www.waygo.fun/auth-callback.html`, `https://www.waygo.fun/update-password.html`. V konzolách poskytovateľov nastav OAuth callback URL podľa údajov v Supabase (spravidla `https://<project-ref>.supabase.co/auth/v1/callback`). Pre Microsoft nastav provider `azure` a prípadné požadované scopes podľa Supabase dokumentácie. Apple prihlásenie vyžaduje konfiguráciu Apple Developer. Používaj webový server cez HTTPS, nie otvorenie cez `file://`.

**Bezpečnosť:** Nezisťuj existenciu účtu verejným API podľa e-mailu. Pri neúspešnom prihlásení sa z bezpečnostných dôvodov nedá spoľahlivo rozlíšiť nesprávne heslo od neregistrovaného e-mailu; stránka preto ponúkne registráciu bez automatického presmerovania. Pri pokuse o registráciu už existujúceho účtu môže Supabase kvôli ochrane súkromia vrátiť anonymizovanú odpoveď; používateľ uvidí možnosť prihlásenia. Heslá ani service-role kľúče nepatria do `config.js`.


## Osobný kalendár v account.html
Kalendár zobrazuje dnešné a zajtrajšie udalosti a prepínač týždeň/mesiac. Kliknutím na deň pridáš udalosť; cez ikonu ceruzky v agende ju upravíš alebo odstrániš. Pre trvalú synchronizáciu medzi zariadeniami spusti `calendar_setup.sql` v Supabase SQL Editore. Každý používateľ vidí iba vlastné udalosti (RLS). Bez Supabase funguje ukážkový režim uložený iba v lokálnom prehliadači.


## Zošity a poznámky
- `notes.html` — súkromné farebné zošity a jednotlivé poznámky v mriežke podobnej profilu so svojimi príspevkami.
- Vytváranie, úprava, vymazanie, vyhľadávanie a priraďovanie poznámok do zošitov.
- Po prihlásení sa ukladajú do Supabase. Spusti `notes_setup.sql` v SQL Editore po základnom SQL.
- Bez nastavenia Supabase funguje iba lokálny ukážkový režim na jednom zariadení.
- Nie je to publikovanie na verejný feed: poznámky sú súkromné a chránené RLS.

## Nový zošit – štúdio obalov
V `notes.html` klikni na veľké **＋ Nový zošit**. Vyber názov, farebný obal, ikonku a typ stránok (linajkové, štvorčekové, bodkované alebo čisté). Zobrazí sa živý náhľad obalu. Zmeny sa ukladajú v lokálnom demo režime alebo v Supabase po spustení aktualizovaného `notes_setup.sql`.

## Funkcie vo vnútri zošita
Po kliknutí na obal sa otvorí digitálny zošit s papierovými stránkami. Je možné vytvárať a upravovať stránky (poznámky), vyhľadávať ich, radiť podľa dátumu alebo názvu, prepínať linajkový/štvorčekový/bodkovaný/čistý papier, upravovať obal, zapnúť režim sústredenia, exportovať obsah do TXT a tlačiť alebo uložiť ako PDF cez systémové tlačové okno. Papier a stránky sa synchronizujú so Supabase po spustení `notes_setup.sql`. Export TXT je lokálny; neodosiela údaje inam.

## Písanie perom a zvýrazňovanie
V `notes.html` otvor zošit, pridaj stránku a klikni na „pen line Písať perom“. Podporované sú pero, zvýrazňovač, guma, farby, hrúbka čiary, späť/znova, vymazanie, export PNG. Funguje myšou, prstom aj stylusom cez Pointer Events. Po kliknutí na „Uložiť“ sa ťahy ukladajú ako JSON k súkromnej poznámke. Pred používaním so Supabase znovu spusti `notes_setup.sql` (doplní stĺpec `drawing`). Bez prihlásenia ide o lokálne dáta v prehliadači. Guma odstraňuje časti nakreslených ťahov.


## Rebríčky v profile
V `account.html` sú súčasne dva samostatné rebríčky: mesačný a ročný, s pódiom pre prvých troch a zoznamom ďalších študentov (max. 20 zobrazených).
Dáta sa čítajú cez bezpečnú Supabase RPC `get_leaderboard`, ktorá je súčasťou `supabase_setup.sql`. V ukážkovom režime sa nezobrazujú vymyslené skóre. Skutočné XP vznikajú až po overení správnych odpovedí v databáze.


## Ikony bez emotikonov
Všetky emotikony v HTML, JavaScripte a dokumentácii boli odstránené.
Nahrádza ich lokálny súbor `icons.js` so škálovateľnými SVG ikonami, bez nutnosti ďalšej ikonovej knižnice alebo pripojenia k jej CDN.
Ikony sa zobrazujú aj v dynamicky načítanom obsahu, napríklad v rebríčkoch a poznámkach.


## Nové funkcie: všetko v jednom
- `feed.html`: pred každou z 21 tematických skupín (zvyčajne 10 otázok) sa zobrazí učebná kartička. Kartičky sú novovytvorené stručné úvody, NIE doslovný text zdrojového PDF. Súhrny odporúčame odborne overiť.
- `lessons.json`: 21 tém s krátkym vysvetlením a priradenými ID otázok. Počet otázok ostal 201 (v zdroji chýba otázka 181).
- `study.html`: prehľad učenia, denná séria, štatistiky podľa tém, uložené otázky, opakovanie chýb, 25-minútový Focus Mode.
- `assistant.html`: rozhranie AI asistenta, vyžaduje Supabase Edge Function `waygo-ai` a serverový API kľúč. Bez funkcie AI neodpovedá.
- `group-notes.html`: poznámky a spoločné tematické kvízy pre členov študijných skupín.
- `study_features_setup.sql` a `group_notes_setup.sql`: databázové tabuľky a RLS. Spusti po `supabase_setup.sql`.
- Študijné aktivity v ukážkovom režime sa ukladajú iba do localStorage. Na produkcii sa dôveryhodné XP počítajú výhradne cez existujúcu serverovú RPC, nie cez klientské štatistiky.
- Prihlásenie cez externých poskytovateľov, VIP platby a AI vyžadujú samostatné nastavenie poskytovateľov; samotné HTML ich neaktivuje.
- Streak je motivačný, bez sankcie za vynechaný deň.
- Skupinové kvízy sú zdieľané odkazy na tematický blok feedu; nejde o živý multiplayer.


## UX upgrade a kontrola spustenia
- `index.html` je vstupná stránka s voľbou registrácie alebo prihlásenia (už automaticky nepresmerúva).
- `polish.css` a `polish.js` poskytujú viditeľné zameranie klávesnicou, pohodlnejšie ovládanie a jasné označenie ukážkového režimu, keď Supabase nie je nastavený.
- `setup.html` ukáže, či je konfigurácia doplnená, či funguje pripojenie a či je dostupná základná databázová tabuľka. Nezaručuje otestovanie všetkých funkcií.
- Vo feede je prepínač tém a návrat k poslednej otázke (v danom prehliadači). Každá téma sa začína učebnou kartičkou.
- Skutočné online platby, AI, OAuth a ochrana dát stále vyžadujú konfiguráciu poskytovateľov a reálne integračné testy.
- Bez Supabase ide o lokálnu ukážku, nie plnohodnotnú synchronizovanú produkciu.


## Experience 2.0 — vizuálny upgrade
- `experience.css`: zjednotený tmavofialový vizuálny systém, čitateľnejšie tlačidlá, animácie a mobilné úpravy. Rešpektuje `prefers-reduced-motion`.
- `experience.js`: motivačná úvodná karta s pokračovaním, denný dobrovoľný cieľ, indikátor pokroku vo feede, odkaz na ukončenie študijného bloku a zvýraznenie aktívnej navigácie.
- Denný cieľ 10 otázok je **iba vizuálny, dobrovoľný**, bez tlaku a sankcií.
- Nový vzhľad nemení serverové oprávnenia ani bezpečnostné obmedzenia. AI, platby, OAuth a synchronizácia stále vyžadujú konfiguráciu a reálne end-to-end testy.
- Počet otázok v dennom ukazovateli pochádza z lokálne zaznamenaných pokusov na tomto zariadení; nejde o synchronizovaný účet.

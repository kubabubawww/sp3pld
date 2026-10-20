# SP3PLD — strona Klubu Krótkofalowców PZK w Świebodzinie

Statyczna strona (HTML + CSS + Vanilla JS), bez frameworków i CMS. Motyw „Karta QSL” — jasny, wzorowany na historycznej karcie QSL klubu.

## Struktura

```
index.html               strona główna
o-klubie.html            historia, stacja, siedziba, karty QSL klubu
aktualnosci.html         log klubowy (wpisy archiwalne + nowe)
osiagniecia.html         DXCC Honor Roll, tabele DXCC/WAZ, dyplomy
czlonkowie.html          lista członków i Silent Keys
galeria.html             galeria z filtrami i podglądem
linki.html               linkownia
pogoda.html              pogoda i propagacja (HamQSL N0NBH + Windy, wyszukiwarka miejscowości: Open-Meteo) — link tylko w stopce
kontakt.html             adres, e-maile klubu i opiekuna klubu, mapa Google
polityka-prywatnosci.html
404.html
assets/css/style.css     motyw (tokeny kolorów w :root)
assets/js/components.js  pasek stacji, menu i stopka (wspólne dla wszystkich stron)
assets/js/pogoda.js      wyszukiwarka miejscowości → przestawia mapę Windy (geokoder Open-Meteo)
assets/js/main.js        pasek stacji (ticker, zegar UTC, status), A−/A+, kontrast, galeria
assets/img/              zdjęcia (archiwum starej strony), logotypy PZK / ŚDK / herb Gminy
sitemap.xml              mapa strony dla wyszukiwarek
robots.txt               reguły dla robotów + adres mapy strony
_redirects               przekierowania Netlify (bez www → www, stare adresy)
```

`_zrodla/` — materiały źródłowe (kopia starej strony, logotypy PZK, pliki od klubu). Nie jest publikowany (`.gitignore`).

## Podgląd lokalny

```bash
python -m http.server 8732
```

## Dane w plikach JSON

Aktualności, statystyki i lista członków są w katalogu `data/` — wystarczy edytować plik i wypchnąć zmiany, HTML zostaje bez zmian.

### `data/aktualnosci.json` — aktualności

Wpisy wyświetlają się w kolejności z pliku — **nowy wpis dodaj na górze** listy `wpisy`. Trzy pierwsze trafiają też na stronę główną.

```json
{
  "id": "spotkanie-2026",
  "data": "2026-10-09",
  "tytul": "Spotkanie klubowe",
  "zajawka": "Krótki opis na kartę na stronie głównej.",
  "tresc": [
    "Pierwszy akapit. Znaki jak SP3IBM formatują się same.",
    "Drugi akapit z **pogrubieniem**."
  ],
  "autor": "opracował Czesław SP3IBM",
  "zdjecie": { "plik": "2026-spotkanie/1.jpg", "opis": "Członkowie klubu przy stacji" },
  "galeria": ["2026-spotkanie/2.jpg", "2026-spotkanie/3.jpg"],
  "linki": [
    { "tekst": "Relacja na stronie OT 32", "url": "https://ot32.pzk.org.pl/" }
  ]
}
```

| Pole | Wymagane | Opis |
|---|---|---|
| `id` | zalecane | krótki identyfikator bez spacji i polskich znaków — adres wpisu to `aktualnosci.html#id` |
| `data` | nie | `RRRR-MM-DD` lub `RRRR-MM`; wyświetla się jako 09.10.2026 |
| `dataTekst` | nie | dowolny tekst zamiast daty, np. „z archiwum” |
| `tytul` | tak | tytuł wpisu |
| `zajawka` | nie | tekst karty na stronie głównej (domyślnie pierwszy akapit) |
| `tresc` | tak | lista akapitów; `**tekst**` = pogrubienie; lista punktowana = tablica w tablicy: `["punkt 1", "punkt 2"]` |
| `autor` | nie | podpis pod wpisem |
| `zdjecie` | nie | zdjęcie główne (`plik` + `opis` dla niewidomych); bez zdjęcia w jego miejscu wyświetla się zielony pas z napisem SP3PLD (na liście wpisów i na stronie głównej) |
| `galeria` | nie | dodatkowe zdjęcia — miniatury z podglądem po kliknięciu |
| `linki` | nie | linki pod treścią: artykuł, film, relacja, strona |
| `wspomnienie` | nie | `true` — wpis wspomnieniowy (ciemny pasek z boku) |
| `ukryty` | nie | `true` — wpis nie wyświetla się (szkic) |

**Zdjęcia:** wrzuć pliki do `assets/img/aktualnosci/` — najlepiej w podfolderze wpisu, np. `assets/img/aktualnosci/2026-spotkanie/1.jpg` — i w JSON-ie podaj ścieżkę od tego folderu (`"2026-spotkanie/1.jpg"`). Można też podać pełny adres `https://...`. Zalecany rozmiar: ok. 1600 px dłuższy bok, JPG, do ~400 KB.

### `data/osiagniecia.json`

- `stanNa` — data zestawienia (RRRR-MM-DD), wyświetlana nad tabelami,
- `uwaga` — notka pod tabelami (pusty tekst = brak notki),
- `honorRoll.potwierdzone` / `wszystkie` — aktualne podmioty DXCC: licznik „Top of Honor Roll” (strona główna i Osiągnięcia) i zapis „340/340” w tekście,
- `skala.dxcc` / `skala.waz` — wartość odpowiadająca pełnemu paskowi (DXCC: najwyższy wynik, obecnie MIXED 346 — liczby obejmują podmioty usunięte; WAZ: 40 stref),
- `dxcc.emisje`, `dxcc.pasma`, `waz.emisje`, `waz.pasma` — wiersze tabel: `{ "nazwa": "20 m", "worked": 298, "confirmed": 286 }`.
  Brak danych: `null`. Wiersz `MIXED` jest wyróżniony i zasila licznik „Strefy WAZ”.

### `data/czlonkowie.json`

```json
{
  "czlonkowie": [
    { "znak": "SP3XYZ", "imie": "Jan", "qth": "Świebodzin", "uwagi": "" }
  ],
  "silentKeys": [
    { "znak": "SP3ABC", "imie": "Jan", "uwagi": "założyciel klubu" }
  ]
}
```

Wpisy wyświetlają się w kolejności z pliku; przy Silent Keys dopisywane jest „sk”. Pusta tablica `silentKeys` ukrywa całą sekcję. Wpisy przykładowe (`"przyklad": true`) usuń po dodaniu prawdziwych. Publikujemy tylko znak, imię i miejscowość — za zgodą członka.

> Po edycji sprawdź poprawność JSON-a (np. https://jsonlint.com) — jeden brakujący przecinek blokuje wczytanie danych.
> Podgląd lokalny wymaga serwera (`python -m http.server`), bo przeglądarka nie wczyta JSON-a z `file://`.

## Kontakt

Strona nie ma formularza kontaktowego (usunięty 14.10.2026 — wcześniej przygotowana integracja Web3Forms jest w historii gita, commit `0202b17`).
Na stronie **Kontakt** są dane: adres siedziby, spotkania, QRG, QSL, mapa Google oraz e-maile — klubu **sp3pld (małpa) vp.pl** i opiekuna klubu (Czesław SP3IBM, sp3ibm (małpa) vp.pl). E-mail klubu jest też w stopce (`assets/js/components.js`) i w polityce prywatności.

**E-maile są ukryte przed robotami zbierającymi adresy:** w HTML nie ma pełnego adresu ani znaku „@”, tylko np.
`<a data-u="sp3pld" data-d="vp.pl">sp3pld (małpa) vp.pl</a>` — skrypt w `main.js` składa z tego klikalny link `mailto:`.
Dodając nowy adres, używaj tej samej formy; `data-keep-text` zostawia tekst linku (np. przycisk „Napisz e-mail do klubu”).
Nie wpisuj pełnych adresów także w plikach `.md` — GitHub Pages serwuje je publicznie.

## Publikacja

- PROD: **https://www.sp3pld.e7.pl/** — Netlify, wdrożenie z gałęzi `main` (katalog główny).
- DEV: GitHub Pages (gałąź `main`, katalog główny; plik `.nojekyll`).

### Wyszukiwarki

- Adres kanoniczny to wersja z **www** — każda strona ma `<link rel="canonical">` i `og:url` z pełnym adresem, a `_redirects` przekierowuje `sp3pld.e7.pl` (bez www) na `www.sp3pld.e7.pl`.
- Nowa podstrona = dopisz ją do `sitemap.xml` (i ustaw jej `canonical` / `og:url`). Przy większej zmianie treści zaktualizuj `<lastmod>` danej strony.
- Stare adresy poprzedniej strony (`/osi-gni-cia`, `/sp3pld`, `/nasze-karty-qsl`, …) przekierowują 301 na nowe podstrony — reguły w `_redirects`.
- Ponowne indeksowanie: Google Search Console → właściwość `https://www.sp3pld.e7.pl/` → **Mapy witryn**: `sitemap.xml`, a dla najważniejszych stron **Sprawdzenie adresu URL → Poproś o zindeksowanie**.

Created by [kubabuba.pl](https://kubabuba.pl)

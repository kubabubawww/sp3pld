/* Wspólny pasek stacji, header i footer — wstrzykiwane na każdej podstronie.
   Strona ustawia aktywną pozycję menu przez <body data-page="...">. */
(function () {
  const NAV = [
    ['index', 'index.html', 'Klub'],
    ['o-klubie', 'o-klubie.html', 'O klubie'],
    ['aktualnosci', 'aktualnosci.html', 'Aktualności'],
    ['osiagniecia', 'osiagniecia.html', 'Osiągnięcia'],
    ['czlonkowie', 'czlonkowie.html', 'Członkowie'],
    ['galeria', 'galeria.html', 'Galeria'],
    ['kontakt', 'kontakt.html', 'Kontakt'],
  ];
  const page = document.body.dataset.page || 'index';

  const status = `
  <div class="statusbar" role="region" aria-label="Informacje o stacji">
    <div class="wrap">
      <div class="ticker">
        <div class="ticker-track">
          <div class="ticker-items">
            <span><span class="led" data-club-led></span><span data-club-status>Spotkania: piątek 18:00–20:00</span></span>
            <span>QRG <b>145.275</b> MHz</span>
            <span>LOC <b>JO72SF</b></span>
            <span>UTC <b data-utc>--:--</b></span>
          </div>
        </div>
      </div>
      <span class="tools">
        <button type="button" data-fs="-1" aria-label="Zmniejsz tekst">A−</button>
        <button type="button" data-fs="1" aria-label="Powiększ tekst">A+</button>
        <button type="button" id="contrast-btn" aria-pressed="false" aria-label="Wysoki kontrast">◐</button>
      </span>
    </div>
  </div>`;

  const header = `
  <header class="site-header">
    <div class="wrap">
      <a class="brand" href="index.html" aria-label="SP3PLD — strona główna">
        <span class="brand-call">SP3PLD</span>
        <span class="brand-sub">Klub Krótkofalowców PZK<br>przy Świebodzińskim Domu Kultury</span>
      </a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="nav">Menu</button>
      <nav class="nav" id="nav" aria-label="Główna">
        <ul>${NAV.map(([id, href, label]) =>
          `<li><a href="${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a></li>`).join('')}
        </ul>
      </nav>
    </div>
  </header>`;

  const year = new Date().getFullYear();
  const footer = `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <span class="footer-call">SP3PLD</span>
          <p>Klub Krótkofalowców Polskiego Związku Krótkofalowców przy Świebodzińskim Domu Kultury. Działamy od 1981 r. w Oddziale Terenowym nr 32 PZK.</p>
          <div class="footer-logos">
            <a href="https://pzk.org.pl" title="Polski Związek Krótkofalowców" target="_blank" rel="noopener"><img src="assets/img/logo/pzk.png" alt="Polski Związek Krótkofalowców" width="56" height="56" loading="lazy"></a>
            <a href="https://sdk.swiebodzin.pl/" title="Świebodziński Dom Kultury" target="_blank" rel="noopener"><img src="assets/img/logo/sdk.png" alt="Świebodziński Dom Kultury" width="75" height="56" loading="lazy"></a>
            <a href="https://www.swiebodzin.eu/" title="Gmina Świebodzin" target="_blank" rel="noopener"><img src="assets/img/logo/herb-swiebodzin.png" alt="Herb Gminy Świebodzin" width="46" height="56" loading="lazy"></a>
          </div>
        </div>
        <div>
          <h2>Strona</h2>
          <ul>${NAV.map(([, href, label]) => `<li><a href="${href}">${label}</a></li>`).join('')}
            <li><a href="linki.html">Linkownia</a></li>
            <li><a href="pogoda.html">Pogoda i propagacja</a></li>
          </ul>
        </div>
        <div>
          <h2>Współpraca</h2>
          <ul>
            <li><a href="https://pzk.org.pl" target="_blank" rel="noopener">Polski Związek Krótkofalowców</a></li>
            <li><a href="https://ot32.pzk.org.pl/" target="_blank" rel="noopener">OT 32 PZK Zielona Góra</a></li>
            <li><a href="https://sdk.swiebodzin.pl/" target="_blank" rel="noopener">Świebodziński Dom Kultury</a></li>
            <li><a href="https://www.swiebodzin.eu/" target="_blank" rel="noopener">Gmina Świebodzin</a></li>
          </ul>
        </div>
        <div>
          <h2>Kontakt</h2>
          <ul>
            <li>Świebodziński Dom Kultury<br>ul. Piłsudskiego 39/41<br>66-200 Świebodzin</li>
            <li>Piątek 18:00–20:00</li>
            <li class="mono">145.275 MHz FM</li>
            <li><a data-u="sp3pld" data-d="vp.pl">sp3pld (małpa) vp.pl</a></li>
            <li><a href="kontakt.html">Dane kontaktowe →</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} Klub Krótkofalowców SP3PLD · <a href="polityka-prywatnosci.html">Polityka prywatności</a></span>
        <span class="vy73">VY 73!</span>
        <span>Created by <a href="https://kubabuba.pl" target="_blank" rel="noopener">kubabuba.pl</a></span>
      </div>
    </div>
  </footer>`;

  const h = document.getElementById('header-placeholder');
  const f = document.getElementById('footer-placeholder');
  if (h) h.outerHTML = status + header;
  if (f) f.outerHTML = footer;
})();

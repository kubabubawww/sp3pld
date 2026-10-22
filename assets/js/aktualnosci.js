/* Aktualności ładowane z data/aktualnosci.json (kolejność jak w pliku — najnowsze na górze).
   - #news-list                 — pełne wpisy (aktualnosci.html)
   - #news-latest[data-limit]   — karty z zajawką (strona główna)
   Zdjęcia: nazwa pliku względem assets/img/aktualnosci/ albo pełny adres https://...
   W treści: akapit = tekst, lista punktowana = tablica tekstów, **pogrubienie**,
   znaki wywoławcze (np. SP3IBM) formatowane automatycznie. */
(function () {
  const IMG_DIR = 'assets/img/aktualnosci/';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const src = p => /^(https?:)?\/\//.test(p) || p.startsWith('assets/') ? p : IMG_DIR + p;
  const isExternal = u => /^(https?:)?\/\//.test(u);

  // Na Netlify (www.sp3pld.e7.pl) zdjęcia w kartach i miniaturach idą przez Netlify Image CDN:
  // zmniejszone do potrzebnej szerokości i w formacie WebP/AVIF. Po kliknięciu (podgląd) — oryginał.
  // Lokalnie i na innych hostingach — zawsze oryginał.
  const ON_NETLIFY = /(^|\.)sp3pld\.e7\.pl$|\.netlify\.app$/.test(location.hostname);
  const sized = (p, w) => {
    const u = src(p);
    if (!ON_NETLIFY || isExternal(u) || /\.(svg|gif)$/i.test(u)) return u;
    const path = new URL(u, location.origin + '/').pathname; // rozwija ../ w ścieżce
    return '/.netlify/images?url=' + encodeURIComponent(path) + '&w=' + w;
  };

  // zastępcza grafika dla wpisu bez zdjęcia — zielony pas z napisem SP3PLD
  const PLACEHOLDER = '<div class="log-ph" aria-hidden="true">SP3PLD</div>';

  // tekst → HTML: escape, **pogrubienie**, znaki wywoławcze SP/SQ/SO/SN/SR/3Z/HF
  const rich = t => esc(t)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\b((?:S[N-R]|3Z|HF)\d[A-Z]{1,4})\b/g, '<span class="call">$1</span>');

  // akapit (tekst) albo lista punktowana (tablica tekstów)
  const block = p => Array.isArray(p)
    ? `<ul>${p.map(li => `<li>${rich(li)}</li>`).join('')}</ul>`
    : `<p>${rich(p)}</p>`;

  function dateHtml(w) {
    let txt = w.dataTekst;
    if (!txt && w.data) {
      const [y, m, d] = String(w.data).split('-');
      txt = d ? `${d}.${m}.${y}` : m ? `${m}.${y}` : y;
    }
    if (!txt) return '';
    return w.data ? `<time datetime="${esc(w.data)}">${esc(txt)}</time>` : `<time>${esc(txt)}</time>`;
  }

  // w × h — szerokość obrazka do pobrania i proporcje z CSS (4:3 we wpisie, 16:10 w karcie)
  const photo = (z, w, h, lazy = true) => {
    if (!z) return '';
    const o = typeof z === 'string' ? { plik: z } : z;
    return `<img src="${esc(sized(o.plik, w))}" alt="${esc(o.opis || '')}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''}>`;
  };

  function post(w, i) {
    const gal = (w.galeria || []).map((g, i) => {
      const o = typeof g === 'string' ? { plik: g } : g;
      const alt = o.opis || `${w.tytul} — zdjęcie ${i + 1}`;
      return `<a href="${esc(src(o.plik))}"><img src="${esc(sized(o.plik, 240))}" alt="${esc(alt)}" width="240" height="240" loading="lazy"></a>`;
    }).join('');
    const links = (w.linki || []).map(l =>
      `<p><a href="${esc(l.url)}"${isExternal(l.url) ? ' target="_blank" rel="noopener"' : ''}>${esc(l.tekst || l.url)} →</a></p>`).join('');
    const main = w.zdjecie
      ? `<div class="post-photo" data-lightbox><a href="${esc(src(w.zdjecie.plik || w.zdjecie))}">${photo(w.zdjecie, 640, 480, i > 0)}</a></div>`
      : PLACEHOLDER;
    const cls = ['post', w.wspomnienie && 'memoriam'].filter(Boolean).join(' ');
    return `<article class="${cls}"${w.id ? ` id="${esc(w.id)}"` : ''}>
      ${main}
      <div>
        ${dateHtml(w)}
        <h2>${esc(w.tytul)}</h2>
        ${(w.tresc || []).map(block).join('')}
        ${links}
        ${w.autor ? `<p class="by">${rich(w.autor)}</p>` : ''}
        ${gal ? `<div class="thumbs" data-lightbox>${gal}</div>` : ''}
      </div>
    </article>`;
  }

  function card(w) {
    const lead = w.zajawka || (w.tresc || []).find(p => typeof p === 'string') || '';
    const href = 'aktualnosci.html' + (w.id ? '#' + encodeURIComponent(w.id) : '');
    return `<li>
      ${w.zdjecie ? photo(w.zdjecie, 800, 500) : PLACEHOLDER}
      <div class="body">
        ${dateHtml(w)}
        <h3>${esc(w.tytul)}</h3>
        <p>${rich(lead)}</p>
        <a class="more" href="${href}">Czytaj dalej →</a>
      </div>
    </li>`;
  }

  const list = document.getElementById('news-list');
  const latest = document.getElementById('news-latest');
  if (!list && !latest) return;

  fetch('data/aktualnosci.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(d => {
      const wpisy = (d.wpisy || []).filter(w => !w.ukryty);
      if (list) {
        list.innerHTML = wpisy.length ? wpisy.map((w, i) => post(w, i)).join('') : '<p class="note">Brak wpisów.</p>';
        // przewiń do wpisu z adresu (#id), bo treść doszła po załadowaniu strony
        if (location.hash) {
          const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
          if (el) el.scrollIntoView();
        }
      }
      if (latest) {
        const n = parseInt(latest.dataset.limit, 10) || 3;
        latest.innerHTML = wpisy.slice(0, n).map(card).join('');
      }
    })
    .catch(() => {
      const msg = '<p class="note">Nie udało się wczytać aktualności. Spróbuj odświeżyć stronę.</p>';
      if (list) list.innerHTML = msg;
      if (latest) latest.outerHTML = msg;
    });
})();

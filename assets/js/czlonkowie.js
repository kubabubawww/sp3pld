/* Lista członków i Silent Keys ładowana z data/czlonkowie.json — wyświetlana alfabetycznie po znaku.
   Wpis z "przyklad": true jest wyświetlany kursywą (wiersz zastępczy). */
(function () {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Sortowanie po znaku (główny znak, bez części „ex …”); kolejność w pliku nie ma znaczenia:
  // najpierw znaki z 1–2 literami po cyfrze (np. SP3E, SP3SW), potem z 3 i więcej (np. SP3DUG); w grupach alfabetycznie.
  const callKey = r => String(r.znak || '').split(/\s+ex\s+/i)[0].trim().toUpperCase();
  const suffixLen = c => { const m = c.match(/\d([A-Z]+)$/); return m ? m[1].length : 99; };
  const byCall = (a, b) => {
    const ka = callKey(a), kb = callKey(b);
    const ga = suffixLen(ka) <= 2 ? 0 : 1, gb = suffixLen(kb) <= 2 ? 0 : 1;
    return ga - gb || ka.localeCompare(kb, 'pl', { numeric: true });
  };

  function fill(id, rows, cols, empty) {
    const tbody = document.querySelector(`#${id} tbody`);
    if (!tbody) return;
    if (!rows || !rows.length) {
      tbody.innerHTML = `<tr><td colspan="${cols.length}">${empty}</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.slice().sort(byCall).map(r =>
      `<tr${r.przyklad ? ' class="placeholder"' : ''}>` +
      cols.map(c => c === 'znak'
        ? `<td class="call">${esc(r.znak)}${id === 'silent-keys' ? ' sk' : ''}</td>`
        : `<td>${esc(r[c])}</td>`).join('') +
      '</tr>').join('');
  }

  fetch('data/czlonkowie.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(d => {
      fill('members', d.czlonkowie, ['znak', 'imie', 'qth', 'uwagi'], 'Lista w przygotowaniu.');
      fill('silent-keys', d.silentKeys, ['znak', 'imie', 'uwagi'], 'Brak wpisów.');
      const sk = document.getElementById('silent-keys-section');
      if (sk) sk.hidden = !(d.silentKeys && d.silentKeys.length);
    })
    .catch(() => {
      ['members', 'silent-keys'].forEach(id => {
        const tbody = document.querySelector(`#${id} tbody`);
        if (tbody) tbody.innerHTML = '<tr><td colspan="4">Nie udało się wczytać listy. Spróbuj odświeżyć stronę.</td></tr>';
      });
    });
})();

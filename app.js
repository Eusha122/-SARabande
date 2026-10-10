/* NISAR Change Explorer
 * Data: NASA GIBS WMTS, layer NISAR_L2_Geocoded_Polarimetric_Covariance (NISAR L2 GCOV, false-colour backscatter).
 */
(() => {
  const LAYER = 'NISAR_L2_Geocoded_Polarimetric_Covariance';
  const tileUrl = (d) =>
    `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/${LAYER}/default/${d}/GoogleMapsCompatible_Level13/{z}/{y}/{x}.png`;

  const $ = (id) => document.getElementById(id);
  const state = { site: 0, a: null, b: null, mode: 'swipe', thr: 30, split: 0.5 };

  /* ---------- map & basemap ---------- */
  const map = L.map('map', { zoomControl: true, minZoom: 3, maxZoom: 13, zoomSnap: 0.5, attributionControl: true });
  map.createPane('data');   map.getPane('data').style.zIndex = 300;
  map.createPane('labels'); map.getPane('labels').style.zIndex = 450; map.getPane('labels').style.pointerEvents = 'none';

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd', maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO | NASA GIBS / NISAR'
  }).addTo(map);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd', maxZoom: 19, pane: 'labels'
  }).addTo(map);

  let layerA, layerB, layerChange;

  const nisar = (d) => L.tileLayer(tileUrl(d), {
    pane: 'data', maxNativeZoom: 13, maxZoom: 13, crossOrigin: 'anonymous', keepBuffer: 2
  });

  /* ---------- change-detection tile layer ---------- */
  const Change = L.GridLayer.extend({
    initialize(a, b, opts) { L.GridLayer.prototype.initialize.call(this, opts); this._a = a; this._b = b; this.thr = 30; },
    createTile(c, done) {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 256;
      const load = (d) => new Promise((res) => {
        const im = new Image(); im.crossOrigin = 'anonymous';
        im.onload = () => res(im); im.onerror = () => res(null);
        im.src = tileUrl(d).replace('{z}', c.z).replace('{y}', c.y).replace('{x}', c.x);
      });
      Promise.all([load(this._a), load(this._b)]).then(([ia, ib]) => {
        cv._ia = ia; cv._ib = ib;
        this._paint(cv);
        done(null, cv);
      });
      return cv;
    },
    _paint(cv) {
      const ia = cv._ia, ib = cv._ib;
      const ctx = cv.getContext('2d');
      ctx.clearRect(0, 0, 256, 256);
      if (!ia || !ib) return;
      const w = document.createElement('canvas'); w.width = w.height = 256;
      const wc = w.getContext('2d', { willReadFrequently: true });
      wc.drawImage(ia, 0, 0); const A = wc.getImageData(0, 0, 256, 256).data;
      wc.clearRect(0, 0, 256, 256);
      wc.drawImage(ib, 0, 0); const B = wc.getImageData(0, 0, 256, 256).data;
      const out = ctx.createImageData(256, 256), O = out.data, T = this.thr;
      for (let i = 0; i < A.length; i += 4) {
        if (A[i + 3] < 128 || B[i + 3] < 128) continue;           // need both acquisitions
        const la = .299 * A[i] + .587 * A[i + 1] + .114 * A[i + 2];
        const lb = .299 * B[i] + .587 * B[i + 1] + .114 * B[i + 2];
        const d = lb - la, m = Math.abs(d);
        if (m < T) continue;
        const k = Math.min(1, (m - T) / (120 - T + 1));
        const al = 140 + 115 * k;
        if (d > 0) { O[i] = 232; O[i + 1] = 116 + 60 * k; O[i + 2] = 59; }   // increase
        else       { O[i] = 59;  O[i + 1] = 155; O[i + 2] = 232; }            // decrease
        O[i + 3] = al;
      }
      ctx.putImageData(out, 0, 0);
    },
    repaint() { for (const k in this._tiles) { const t = this._tiles[k].el; if (t._ia) this._paint(t); } }
  });

  /* ---------- helpers ---------- */
  const fmt = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
  const days = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);

  function clipB() {
    if (!layerB || state.mode !== 'swipe') return;
    const size = map.getSize(), x = Math.round(size.x * state.split);
    const nw = map.containerPointToLayerPoint([x, 0]);
    const se = map.containerPointToLayerPoint([size.x, size.y]);
    // the tile layer container sits inside the pane; clip in pane coordinates
    layerB.getContainer().style.clip = `rect(${nw.y}px,${se.x}px,${se.y}px,${nw.x}px)`;
    $('handle').style.left = x + 'px';
  }

  function clearLayers() {
    [layerA, layerB, layerChange].forEach((l) => l && map.removeLayer(l));
    layerA = layerB = layerChange = null;
  }

  /* ---------- render current state ---------- */
  function render() {
    const { a, b, mode } = state;
    clearLayers();
    $('handle').hidden = mode !== 'swipe';
    $('thrRow').hidden = $('legend').hidden = mode !== 'change';

    if (mode === 'a') layerA = nisar(a).addTo(map);
    if (mode === 'b') layerB = nisar(b).addTo(map);
    if (mode === 'swipe') { layerA = nisar(a).addTo(map); layerB = nisar(b).addTo(map); }
    if (mode === 'change') {
      layerA = nisar(a).setOpacity(.55).addTo(map);
      layerChange = new Change(a, b, { pane: 'data', maxNativeZoom: 13, maxZoom: 13, tileSize: 256 });
      layerChange.thr = state.thr;
      layerChange.addTo(map);
      layerChange.getContainer().style.zIndex = 5;
    }

    const wrap = (l) => l && l.on('loading', () => $('loading').hidden = false).on('load', () => $('loading').hidden = true);
    wrap(layerA); wrap(layerB); wrap(layerChange);

    const lab = { swipe: [['REF', a], ['CMP', b]], change: [['REF', a], ['CMP', b]], a: [['REF', a]], b: [['CMP', b]] }[mode];
    $('tagA').innerHTML = `<em>${lab[0][0]}</em>${fmt(lab[0][1])}`;
    $('tagB').innerHTML = lab[1] ? `<em>${lab[1][0]}</em>${fmt(lab[1][1])}` : '';
    $('tagB').parentElement.style.display = lab[1] ? '' : 'none';
    $('span').textContent = `Δt = ${days(a, b)} days`;
    clipB();
  }

  /* ---------- UI wiring ---------- */
  const S = window.SITES;

  function buildSites() {
    $('sites').innerHTML = S.map((s, i) =>
      `<li data-i="${i}"><span class="n">${s.name}</span><span class="c">${s.center[0].toFixed(2)}, ${s.center[1].toFixed(2)}</span><span class="t">${s.type}</span></li>`).join('');
    $('sites').onclick = (e) => { const li = e.target.closest('li'); if (li) selectSite(+li.dataset.i); };
  }

  function fillDates(sel, dates, val) {
    sel.innerHTML = dates.map((d) => `<option value="${d}">${fmt(d)}</option>`).join('');
    sel.value = val;
  }

  function selectSite(i, fly = true) {
    state.site = i;
    const s = S[i];
    [...$('sites').children].forEach((li, j) => li.classList.toggle('on', i === j));
    state.a = s.a; state.b = s.b;
    fillDates($('dateA'), s.dates, s.a);
    fillDates($('dateB'), s.dates, s.b);
    if (fly) map.setView(s.center, s.zoom, { animate: false });
    $('notes').innerHTML = `<p>${s.desc}</p><dl><dt>SIGNAL</dt><dd>${s.signal}</dd><dt>TRACK</dt><dd>${s.track}</dd></dl>`;
    render();
  }

  $('dateA').onchange = (e) => { state.a = e.target.value; render(); };
  $('dateB').onchange = (e) => { state.b = e.target.value; render(); };
  $('modes').onclick = (e) => {
    const b = e.target.closest('button'); if (!b) return;
    state.mode = b.dataset.mode;
    [...$('modes').children].forEach((x) => x.classList.toggle('on', x === b));
    render();
  };
  $('thr').oninput = (e) => {
    state.thr = +e.target.value; $('thrOut').textContent = state.thr;
    if (layerChange) { layerChange.thr = state.thr; layerChange.repaint(); }
  };

  /* swipe handle */
  (() => {
    const h = $('handle'); let drag = false;
    const move = (ev) => {
      if (!drag) return;
      const r = $('map').getBoundingClientRect();
      state.split = Math.min(.98, Math.max(.02, (ev.clientX - r.left) / r.width));
      clipB();
    };
    h.addEventListener('pointerdown', (e) => { drag = true; h.setPointerCapture(e.pointerId); map.dragging.disable(); });
    h.addEventListener('pointermove', move);
    h.addEventListener('pointerup', () => { drag = false; map.dragging.enable(); });
  })();
  map.on('move zoom viewreset resize', clipB);
  map.on('layeradd', clipB);
  map.on('mousemove', (e) => { $('coords').textContent = `${e.latlng.lat.toFixed(4)}°N  ${e.latlng.lng.toFixed(4)}°E   z${map.getZoom()}`; });

  buildSites();
  selectSite(0);
})();

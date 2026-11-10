/* Small dependency-free SVG charts for the portal */
(function () {
  'use strict';
  const C = {};
  const fmt = n => Number(n).toLocaleString('en-US');

  C.spark = function (vals, color, w, h) {
    w = w || 84; h = h || 30;
    const mx = Math.max(...vals), mn = Math.min(...vals), r = mx - mn || 1;
    const pts = vals.map((v, i) => [i / (vals.length - 1) * w, h - 3 - (v - mn) / r * (h - 6)]);
    return '<svg width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" aria-hidden="true"><polyline points="' + pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ') + '" fill="none" stroke="' + (color || '#0E6B3E') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  };

  C.ring = function (pct, color, size) {
    size = size || 62; const r = size / 2 - 5, c = 2 * Math.PI * r;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="#E7ECE9" stroke-width="6"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + (c * Math.min(pct, 100) / 100).toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/>' +
      '<text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-size="' + (size / 4.6).toFixed(0) + '" font-weight="700" fill="#111827">' + Math.round(pct) + '%</text></svg>';
  };

  /* segments: [{v, color}] */
  C.donut = function (segs, size, thick, center) {
    size = size || 170; thick = thick || 24; const r = size / 2 - thick / 2 - 2, c = 2 * Math.PI * r;
    const tot = segs.reduce((a, s) => a + s.v, 0) || 1; let off = 0;
    const arcs = segs.map(s => { const len = c * s.v / tot; const a = '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + s.color + '" stroke-width="' + thick + '" stroke-dasharray="' + Math.max(0, len - 1.5).toFixed(1) + ' ' + c.toFixed(1) + '" stroke-dashoffset="' + (-off).toFixed(1) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/>'; off += len; return a; }).join('');
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true">' + arcs + (center || '') + '</svg>';
  };

  // monotone cubic curve (Fritsch–Carlson): smooth, but never overshoots above or below the data points
  function smooth(pts) {
    const n = pts.length, f = v => v.toFixed(1);
    let d = 'M' + f(pts[0][0]) + ' ' + f(pts[0][1]);
    if (n < 2) return d;
    const dx = [], m = [], tg = [];
    for (let i = 0; i < n - 1; i++) { dx[i] = pts[i + 1][0] - pts[i][0]; m[i] = (pts[i + 1][1] - pts[i][1]) / (dx[i] || 1); }
    tg[0] = m[0]; tg[n - 1] = m[n - 2];
    for (let i = 1; i < n - 1; i++) tg[i] = m[i - 1] * m[i] <= 0 ? 0 : (m[i - 1] + m[i]) / 2;
    for (let i = 0; i < n - 1; i++) {
      if (m[i] === 0) { tg[i] = 0; tg[i + 1] = 0; continue; }
      const a = tg[i] / m[i], b = tg[i + 1] / m[i], s = a * a + b * b;
      if (s > 9) { const k = 3 / Math.sqrt(s); tg[i] = k * a * m[i]; tg[i + 1] = k * b * m[i]; }
    }
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      d += ' C' + f(pts[i][0] + h) + ' ' + f(pts[i][1] + tg[i] * h) + ' ' + f(pts[i + 1][0] - h) + ' ' + f(pts[i + 1][1] - tg[i + 1] * h) + ' ' + f(pts[i + 1][0]) + ' ' + f(pts[i + 1][1]);
    }
    return d;
  }
  /* series: [{vals, color, dashed, area}], labels: [[top, bottom]] */
  C.line = function (labels, series, opts) {
    opts = opts || {}; const W = 540, H = 210, L = 38, R = 10, T = 14, Bt = 36;
    const max = opts.max || Math.ceil(Math.max(...series.flatMap(s => s.vals).filter(v => v != null)) / 2000) * 2000;
    const x = i => L + i * (W - L - R) / (labels.length - 1), y = v => T + (1 - v / max) * (H - T - Bt);
    let g = '';
    for (let k = 0; k <= 3; k++) { const v = max * k / 3, yy = y(v); g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + yy + '" y2="' + yy + '" stroke="#EDF1EF"/><text x="' + (L - 8) + '" y="' + (yy + 4) + '" font-size="11" text-anchor="end" fill="#6B7280">' + (v >= 1000 ? (v / 1000) + 'K' : Math.round(v)) + '</text>'; }
    labels.forEach((l, i) => { g += '<text x="' + x(i) + '" y="' + (H - Bt + 16) + '" font-size="11" text-anchor="middle" fill="#374151">' + l[0] + '</text><text x="' + x(i) + '" y="' + (H - Bt + 29) + '" font-size="10.5" text-anchor="middle" fill="#6B7280">' + l[1] + '</text>'; });
    let body = '<defs><linearGradient id="lca" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E6B3E" stop-opacity=".18"/><stop offset="1" stop-color="#0E6B3E" stop-opacity="0"/></linearGradient></defs>';
    const dense = labels.length > 12;
    series.forEach(s => {
      // days without a value (e.g. later this month) leave a gap instead of dropping to zero
      const runs = []; let run = [];
      s.vals.forEach((v, i) => { if (v == null) { if (run.length) runs.push(run); run = []; } else run.push([x(i), y(v)]); });
      if (run.length) runs.push(run);
      runs.forEach(pts => {
        const d = smooth(pts);
        if (s.area && pts.length > 1) body += '<path d="' + d + ' L' + pts[pts.length - 1][0].toFixed(1) + ' ' + y(0) + ' L' + pts[0][0].toFixed(1) + ' ' + y(0) + 'Z" fill="url(#lca)"/>';
        body += '<path d="' + d + '" fill="none" stroke="' + s.color + '" stroke-width="' + (s.dashed ? 1.6 : 2.4) + '"' + (s.dashed ? ' stroke-dasharray="5 4"' : '') + '/>';
        body += pts.map(p => '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (dense ? (s.dashed ? 1.8 : 2.6) : (s.dashed ? 3 : 4)) + '" fill="' + s.color + '" stroke="#fff" stroke-width="' + (dense ? 1 : 1.5) + '"/>').join('');
      });
    });
    if (opts.mark != null && opts.mark >= 0) {
      const i = opts.mark, xx = x(i); const s0 = series[0].vals[i], s1 = series[1] ? series[1].vals[i] : null;
      const bx = opts.markSide === 'right' ? Math.min(W - 130, xx + 10) : Math.min(W - 130, Math.max(L, xx - 50));
      body += '<line x1="' + xx + '" x2="' + xx + '" y1="' + T + '" y2="' + (H - Bt) + '" stroke="#9CA3AF" stroke-dasharray="3 3"/>' +
        '<g transform="translate(' + bx + ' 0)"><rect width="118" height="' + (s1 != null ? 58 : 40) + '" rx="8" fill="#fff" stroke="#E5E7EB"/><text x="10" y="16" font-size="11" fill="#374151">' + opts.markLabel + '</text>' +
        '<circle cx="14" cy="31" r="4" fill="' + series[0].color + '"/><text x="24" y="35" font-size="11" fill="#374151">' + series[0].name + '</text><text x="108" y="35" font-size="11" text-anchor="end" font-weight="700" fill="#111827">' + fmt(s0) + '</text>' +
        (s1 != null ? '<circle cx="14" cy="48" r="4" fill="' + series[1].color + '"/><text x="24" y="52" font-size="11" fill="#374151">' + series[1].name + '</text><text x="108" y="52" font-size="11" text-anchor="end" font-weight="700" fill="#111827">' + fmt(s1) + '</text>' : '') + '</g>';
    }
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opts.aria || 'chart') + '">' + g + body + '</svg>';
  };

  /* stacked bars: data [[present, absent, late]] */
  C.stack = function (labels, data, colors) {
    const W = 380, H = 150, L = 30, T = 8, Bt = 34; const raw = Math.max(...data.map(d => d.reduce((a, b) => a + b, 0))); const step = raw > 3000 ? 2000 : raw > 300 ? 150 : 30; const max = Math.ceil(raw / step) * step;
    const bw = (W - L) / labels.length; let g = '';
    for (let k = 0; k <= 3; k++) { const v = max * k / 3, yy = T + (1 - v / max) * (H - T - Bt); g += '<line x1="' + L + '" x2="' + W + '" y1="' + yy + '" y2="' + yy + '" stroke="#EDF1EF"/><text x="' + (L - 6) + '" y="' + (yy + 4) + '" font-size="10.5" text-anchor="end" fill="#6B7280">' + (v >= 1000 ? (v / 1000) + 'K' : Math.round(v)) + '</text>'; }
    data.forEach((d, i) => {
      let acc = 0; const cx = L + bw * i + bw * .2, w = bw * .6;
      d.forEach((v, j) => { const h = v / max * (H - T - Bt); const yy = H - Bt - acc - h; acc += h; g += '<rect x="' + cx.toFixed(1) + '" y="' + yy.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + colors[j] + '"/>'; });
      g += '<text x="' + (cx + w / 2) + '" y="' + (H - Bt + 14) + '" font-size="10.5" text-anchor="middle" fill="#374151">' + labels[i][0] + '</text><text x="' + (cx + w / 2) + '" y="' + (H - Bt + 27) + '" font-size="10" text-anchor="middle" fill="#6B7280">' + labels[i][1] + '</text>';
    });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' + g + '</svg>';
  };

  window.MMC = C;
})();

/* MM Smart Attendance – brand art (Muscat Municipality look & feel)
 * Drawn as SVG so the demo works offline. Optional real assets override the drawings:
 *   assets/mm-logo.png      – official Muscat Municipality logo (transparent PNG)
 *   assets/login-hero.jpg   – photo for the left half of the login page
 *   assets/banner.jpg       – photo used in page banners
 */
(function () {
  'use strict';
  const B = { has: { logo: false, hero: false, banner: false }, onload: null };
  [['logo', 'assets/mm-logo.png'], ['hero', 'assets/login-hero.jpg'], ['banner', 'assets/banner.jpg']].forEach(([k, src]) => {
    const im = new Image(); im.onload = () => { B.has[k] = true; if (B.onload) B.onload(); }; im.src = src;
  });

  /* logo: official PNG when provided, else a wordmark */
  B.logo = function (size) {
    size = size || 1;
    if (B.has.logo) return '<img class="mmlogo-img" src="assets/mm-logo.png" alt="Muscat Municipality" style="height:' + Math.round(96 * size) + 'px">';
    const w = Math.round(150 * size);
    return '<svg class="mmlogo" width="' + w + '" viewBox="0 0 150 100" role="img" aria-label="Muscat Municipality">' +
      '<g fill="#0E6B3E">' +
      // stylised minarets / arch mark
      '<rect x="44" y="6" width="5" height="34" rx="1.5"/><path d="M46.5 0l3 7h-6z"/>' +
      '<rect x="101" y="6" width="5" height="34" rx="1.5"/><path d="M103.5 0l3 7h-6z"/>' +
      '<path d="M54 40V26a21 21 0 0 1 42 0v14h-7V27a14 14 0 0 0-28 0v13z"/>' +
      '<rect x="36" y="40" width="78" height="5" rx="2"/>' +
      '</g>' +
      '<text x="75" y="70" text-anchor="middle" font-family="\'Reem Kufi\',\'IBM Plex Sans Arabic\',Tahoma,sans-serif" font-size="21" font-weight="700" fill="#111827">بلدية مسقط</text>' +
      '<text x="75" y="92" text-anchor="middle" font-family="Plus Jakarta Sans,Segoe UI,Arial,sans-serif" font-size="10.5" font-weight="800" letter-spacing=".4" fill="#111827">MUSCAT MUNICIPALITY</text></svg>';
  };

  /* thin sand-coloured skyline (fort, gate, mosque, minaret, palm, mountains) */
  B.skyline = function (w, color) {
    return '<svg class="skyline" width="' + (w || 200) + '" viewBox="0 0 240 92" fill="none" stroke="' + (color || '#C9A27A') + '" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M2 88h236"/>' +
      '<path d="M8 88V50h7v-5h4v5h5v-5h4v5h7v43"/><path d="M15 88V66a5 5 0 0 1 10 0v22"/><path d="M38 88V34h-3l5-11 5 11h-3v54"/><path d="M40 23v-5"/>' +
      '<path d="M54 88V52h40v36"/><path d="M62 88V67a12 12 0 0 1 24 0v21"/><path d="M54 52l4-6h32l4 6"/><path d="M58 46v-4M66 46v-4M74 46v-4M82 46v-4M90 46v-4"/>' +
      '<path d="M104 88V60h58v28"/><path d="M114 60a19 19 0 0 1 38 0"/><path d="M133 41v-6"/><circle cx="133" cy="33" r="1.4"/>' +
      '<path d="M110 88V71h8v17M148 88V71h8v17M127 88V73a6 6 0 0 1 12 0v15"/><path d="M106 60a5 5 0 0 1 10 0M150 60a5 5 0 0 1 10 0"/>' +
      '<path d="M170 88V42h8v46"/><path d="M170 42l4-9 4 9"/><path d="M174 33v-5"/><path d="M169 58h10M169 70h10"/>' +
      '<path d="M199 88c0-15 1-27 4-37"/><path d="M203 51c-6-6-14-6-18-2M203 51c6-6 14-6 18-1M203 51c-3-7-10-11-15-10M203 51c3-7 9-11 14-9M203 51c-1 0-8 4-9 12M203 51c1 0 8 4 10 11"/>' +
      '<path d="M212 88l9-13 6 6 9-12"/></svg>';
  };

  /* banner illustration: mountains + Grand-mosque style silhouette + palms */
  B.bannerArt = function (variant) {
    if (B.has.banner) return '<div class="art-photo" style="background-image:url(assets/banner.jpg)"></div>';
    const fort = variant === 'fort';
    return '<svg class="art" viewBox="0 0 640 220" preserveAspectRatio="xMaxYMax slice" aria-hidden="true"><defs>' +
      '<linearGradient id="bsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCE8ED"/><stop offset="1" stop-color="#F4F0E8"/></linearGradient>' +
      '<linearGradient id="bfade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset=".38" stop-color="#fff" stop-opacity=".55"/><stop offset=".62" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<rect width="640" height="220" fill="url(#bsk)"/>' +
      '<path d="M0 160 90 100l50 26 80-70 70 60 60-36 70 48 80-62 70 44 70-30v140H0z" fill="#9FB1B8" opacity=".5"/>' +
      '<path d="M0 178l100-40 70 24 90-38 80 40 100-32 100 34 100-20v74H0z" fill="#8299A1" opacity=".42"/>' +
      (fort ?
        '<path d="M430 200v-62l14-10h70l18 12v60z" fill="#C9B79A"/><path d="M450 128v-26h8v-6h6v6h8v-6h6v6h8v26z" fill="#D5C4A6"/><rect x="498" y="104" width="22" height="36" fill="#CDBB9C"/><path d="M498 104h22l-4-6h-14z" fill="#BCA986"/><rect x="474" y="80" width="2" height="24" fill="#555"/><rect x="476" y="80" width="12" height="3" fill="#D92D20"/><rect x="476" y="83" width="12" height="3" fill="#fff"/><rect x="476" y="86" width="12" height="3" fill="#0E7A43"/>'
        :
        '<rect x="420" y="150" width="190" height="50" fill="#F2EDE3"/>' +
        '<path d="M470 150a45 45 0 0 1 90 0z" fill="#EBE3D3"/><rect x="513" y="96" width="4" height="12" fill="#C9A27A"/><circle cx="515" cy="94" r="3" fill="#C9A27A"/>' +
        '<path d="M432 150a16 16 0 0 1 32 0z" fill="#EBE3D3"/><path d="M566 150a16 16 0 0 1 32 0z" fill="#EBE3D3"/>' +
        '<rect x="410" y="86" width="10" height="114" fill="#F2EDE3"/><path d="M410 86l5-16 5 16z" fill="#E2D8C5"/><rect x="408" y="118" width="14" height="4" fill="#E2D8C5"/>' +
        '<rect x="610" y="86" width="10" height="114" fill="#F2EDE3"/><path d="M610 86l5-16 5 16z" fill="#E2D8C5"/><rect x="608" y="118" width="14" height="4" fill="#E2D8C5"/>' +
        [440, 462, 484, 506, 528, 550, 572].map(x => '<path d="M' + x + ' 196v-22a6 6 0 0 1 12 0v22z" fill="#D9CFBC"/>').join('')) +
      '<rect x="0" y="198" width="640" height="22" fill="#E7E0D1"/>' +
      palm(392, 200, 1) + palm(632, 204, 1.1) + palm(372, 206, .7) +
      '<rect width="640" height="220" fill="url(#bfade)"/></svg>';
  };
  function palm(x, y, s) {
    const fr = '#2F6B4A';
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><path d="M0 0c0-30 2-56 8-76" stroke="#6B5A43" stroke-width="5" fill="none"/>' +
      '<g fill="' + fr + '"><path d="M8-76c-14-8-34-6-44 6 16-6 30-4 44-6z"/><path d="M8-76c14-10 34-8 46 4-16-6-32-4-46-4z"/><path d="M8-76c-6-12-20-20-34-18 14 2 24 10 34 18z"/><path d="M8-76c6-12 18-20 32-18-13 2-23 10-32 18z"/><path d="M8-76c-4 6-14 14-16 30 4-12 10-22 16-30z"/><path d="M8-76c6 6 14 16 14 30-2-12-8-22-14-30z"/></g></g>';
  }

  /* login hero: Muttrah corniche scene */
  B.loginArt = function () {
    return '<svg class="art" viewBox="0 0 900 760" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs>' +
      '<linearGradient id="lsk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFD9EE"/><stop offset=".55" stop-color="#E8EEF0"/><stop offset="1" stop-color="#F3E9DA"/></linearGradient>' +
      '<linearGradient id="lsea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB2C9"/><stop offset="1" stop-color="#3F7E99"/></linearGradient>' +
      '<linearGradient id="lfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>' +
      '<rect width="900" height="760" fill="url(#lsk)"/>' +
      '<path d="M0 470l120-120 70 50 110-140 90 110 80-60 120 140 120-170 110 120 80-50v220H0z" fill="#8C8070" opacity=".55"/>' +
      '<path d="M0 520l140-90 90 40 120-80 100 70 130-90 120 110 100-60 100 50v120H0z" fill="#9C8B73" opacity=".7"/>' +
      // fort on the hill
      '<path d="M560 470l50-110 120-20 70 80 30 60z" fill="#A58D6C"/>' +
      '<path d="M600 380v-46l16-10h70l14 12v44z" fill="#D2BE9D"/><path d="M622 324v-24h7v-6h6v6h8v-6h6v6h8v24z" fill="#DCCBAA"/><rect x="684" y="302" width="22" height="36" fill="#D6C3A2"/>' +
      '<rect x="646" y="258" width="2.5" height="44" fill="#4B5563"/><rect x="648.5" y="258" width="22" height="5" fill="#D92D20"/><rect x="648.5" y="263" width="22" height="5" fill="#fff"/><rect x="648.5" y="268" width="22" height="5" fill="#0E7A43"/><rect x="648.5" y="258" width="7" height="15" fill="#D92D20"/>' +
      // town
      Array.from({ length: 16 }, (_, i) => { const x = 330 + i * 36, h = 40 + (i * 37 % 50); return '<rect x="' + x + '" y="' + (560 - h) + '" width="32" height="' + h + '" fill="' + (i % 3 ? '#F7F3EC' : '#EFE7D8') + '"/><rect x="' + (x + 6) + '" y="' + (568 - h) + '" width="6" height="8" fill="#B9AE9C"/><rect x="' + (x + 18) + '" y="' + (568 - h) + '" width="6" height="8" fill="#B9AE9C"/>'; }).join('') +
      // mosque on the left
      '<rect x="40" y="500" width="120" height="70" fill="#F5F0E6"/><path d="M70 500a30 30 0 0 1 60 0z" fill="#EDE5D4"/><rect x="28" y="420" width="12" height="150" fill="#F5F0E6"/><path d="M28 420l6-20 6 20z" fill="#E3D8C3"/>' +
      // sea + corniche
      '<path d="M0 600c200-20 380-10 520 10 140 20 260 60 380 50v100H0z" fill="url(#lsea)"/>' +
      '<path d="M380 760c60-60 170-120 300-140 90-14 160-10 220-2v142z" fill="#E9DFCE"/><path d="M380 760c60-60 170-120 300-140 90-14 160-10 220-2" stroke="#fff" stroke-width="6" fill="none"/>' +
      palm(450, 640, 1.2) + palm(560, 612, 1.3) + palm(680, 598, 1.4) + palm(800, 600, 1.5) + palm(250, 590, .9) +
      '<rect width="900" height="760" fill="url(#lfade)"/></svg>';
  };

  /* small illustrations for announcements */
  B.thumb = function (kind) {
    if (kind === 'flag') return '<svg viewBox="0 0 80 56"><rect width="80" height="56" fill="#E9EEF2"/><rect x="10" y="8" width="1.6" height="44" fill="#6B7280"/><rect x="11.6" y="8" width="20" height="32" fill="#D92D20"/><rect x="31.6" y="8" width="40" height="10.7" fill="#fff"/><rect x="31.6" y="18.7" width="40" height="10.7" fill="#D92D20"/><rect x="31.6" y="29.4" width="40" height="10.6" fill="#0E7A43"/></svg>';
    if (kind === 'helmet') return '<svg viewBox="0 0 80 56"><rect width="80" height="56" fill="#DCE6EE"/><g><path d="M14 38a12 12 0 0 1 24 0z" fill="#F5B301"/><rect x="11" y="37" width="30" height="4" rx="2" fill="#E0A100"/><circle cx="26" cy="48" r="7" fill="#C8936B"/></g><g><path d="M42 38a12 12 0 0 1 24 0z" fill="#F5B301"/><rect x="39" y="37" width="30" height="4" rx="2" fill="#E0A100"/><circle cx="54" cy="48" r="7" fill="#B9845F"/></g></svg>';
    return '<svg viewBox="0 0 80 56"><rect width="80" height="56" fill="#3B2F25"/><path d="M0 44c20-6 50-6 80 0v12H0z" fill="#5A4636"/><path d="M40 44V28" stroke="#4E8A3C" stroke-width="2.5"/><path d="M40 32c-10-2-14-10-12-16 8 2 12 8 12 16zM40 30c8-4 14-10 12-18-8 2-12 10-12 18z" fill="#6DBE4B"/></svg>';
  };

  window.MMB = B;
})();

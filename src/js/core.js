/* MM Smart Attendance – shared core
 * Data store + sync (demo server or browser storage), server rules engine
 * (geofence, anti-fraud, server time, offline sync, approvals), i18n, helpers.
 * In production this logic lives in the .NET services; here it is simulated in JS. */
(function () {
  'use strict';
  const DBKEY = 'mmsa.db.v3';
  const S = { db: null, mode: 'local', ver: 0, listeners: [], paused: false, reachable: true, lang: 'en' };

  /* ---------------- helpers ---------------- */
  const pad = n => String(n).padStart(2, '0');
  const uid = p => (p || '') + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = o => JSON.parse(JSON.stringify(o));

  /* ---------------- clock (server / NTP time) ---------------- */
  function now() {
    const st = S.db && S.db.settings;
    if (st && st.clock === 'morning') {
      let el = Date.now() - (st.clockStart || Date.now());
      if (el < 0 || el > 6 * 3600e3) el = 0;
      const b = new Date(); b.setHours(7, 28, 14, 0);
      return b.getTime() + el;
    }
    return Date.now();
  }
  function dayStart(ms) { const d = new Date(ms == null ? now() : ms); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function at(h, m, dayOffset) { const d = new Date(dayStart() + (dayOffset || 0) * 864e5); d.setHours(h, m, 0, 0); return d.getTime(); }

  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const MON_L = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MON_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const DAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const DAY_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const ar = () => S.lang === 'ar';
  const fmtTime = ms => { const d = new Date(ms); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  const fmtTimeS = ms => { const d = new Date(ms); return fmtTime(ms) + ':' + pad(d.getSeconds()); };
  // the device's own time zone (all times in the app use the system clock and its zone)
  function tz() {
    const off = -new Date().getTimezoneOffset(), sign = off >= 0 ? '+' : '-', a = Math.abs(off);
    const utc = 'UTC' + sign + Math.floor(a / 60) + (a % 60 ? ':' + pad(a % 60) : '');
    let name = ''; try { name = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { }
    return { utc, name, label: utc + (name ? ' · ' + name.replace(/_/g, ' ') : '') };
  }
  const fmtDate = ms => { const d = new Date(ms); return pad(d.getDate()) + ' ' + (ar() ? MON_AR : MON)[d.getMonth()] + ' ' + d.getFullYear(); };
  const fmtDateShort = ms => { const d = new Date(ms); return pad(d.getDate()) + ' ' + (ar() ? MON_AR : MON)[d.getMonth()]; };
  const fmtDay = ms => (ar() ? DAY_AR : DAY)[new Date(ms).getDay()];
  const monthName = (m, y) => (ar() ? MON_AR : MON_L)[m] + ' ' + y;
  function relDay(ms) {
    const d = Math.round((dayStart(ms) - dayStart()) / 864e5);
    if (d === 0) return t('today'); if (d === -1) return t('yesterday');
    return fmtDateShort(ms);
  }
  const ymd = ms => { const d = new Date(ms); return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()); };
  function fmtDist(m) { return m >= 100000 ? fmtNum(Math.round(m / 1000)) + ' ' + t('km') : m >= 1000 ? (m / 1000).toFixed(1) + ' ' + t('km') : Math.round(m) + ' ' + t('m'); }
  const fmtNum = n => Number(n).toLocaleString('en-US');

  /* ---------------- English → Arabic name transliteration ----------------
     Known Omani / Arabic first names and family names use their standard spelling; anything else is
     spelled phonetically. "Al X" becomes "الX" (joined), "bin" / "bint" become "بن" / "بنت". */
  const AR_NAMES = {
    // first names
    ahmed: 'أحمد', ahmad: 'أحمد', mohammed: 'محمد', mohammad: 'محمد', muhammad: 'محمد', mohamed: 'محمد', mohamad: 'محمد', mohd: 'محمد',
    ali: 'علي', omar: 'عمر', umar: 'عمر', othman: 'عثمان', uthman: 'عثمان', khalid: 'خالد', khaled: 'خالد', salim: 'سالم', saleem: 'سليم', salem: 'سالم',
    said: 'سعيد', saeed: 'سعيد', saud: 'سعود', sultan: 'سلطان', hamad: 'حمد', hamed: 'حامد', hamid: 'حامد', hamood: 'حمود', hamoud: 'حمود', hamdan: 'حمدان',
    hilal: 'هلال', hussain: 'حسين', hussein: 'حسين', hussian: 'حسين', hasan: 'حسن', hassan: 'حسن', ibrahim: 'إبراهيم', ebrahim: 'إبراهيم', ismail: 'إسماعيل',
    yousuf: 'يوسف', yusuf: 'يوسف', youssef: 'يوسف', yousef: 'يوسف', yaqoob: 'يعقوب', yaqub: 'يعقوب', yahya: 'يحيى', younis: 'يونس', yunus: 'يونس',
    abdullah: 'عبدالله', abdulla: 'عبدالله', abdulrahman: 'عبدالرحمن', abdulaziz: 'عبدالعزيز', abdulkarim: 'عبدالكريم', abdulmalik: 'عبدالملك', abdulhakim: 'عبدالحكيم',
    nasser: 'ناصر', nasir: 'ناصر', nasr: 'نصر', mansoor: 'منصور', mansour: 'منصور', majid: 'ماجد', majed: 'ماجد', badr: 'بدر', bader: 'بدر', faisal: 'فيصل', fahad: 'فهد', fahd: 'فهد',
    talal: 'طلال', tariq: 'طارق', tarik: 'طارق', waleed: 'وليد', walid: 'وليد', zaid: 'زيد', zayed: 'زايد', marwan: 'مروان', murad: 'مراد', mubarak: 'مبارك', musallam: 'مسلم',
    rashid: 'راشد', rashed: 'راشد', saif: 'سيف', sayf: 'سيف', sami: 'سامي', samir: 'سمير', sulaiman: 'سليمان', suleiman: 'سليمان', sulaiyam: 'سليم', jamal: 'جمال', jamil: 'جميل',
    adil: 'عادل', adel: 'عادل', amir: 'أمير', ameer: 'أمير', anwar: 'أنور', aziz: 'عزيز', azzan: 'عزان', badar: 'بدر', haitham: 'هيثم', hashim: 'هاشم', idris: 'إدريس',
    issa: 'عيسى', isa: 'عيسى', khamis: 'خميس', khalfan: 'خلفان', mahmood: 'محمود', mahmoud: 'محمود', mazin: 'مازن', mazen: 'مازن', muhanna: 'مهنا', mustafa: 'مصطفى',
    nabil: 'نبيل', nadir: 'نادر', nader: 'نادر', qais: 'قيس', qasim: 'قاسم', rami: 'رامي', riyadh: 'رياض', riyad: 'رياض', salah: 'صلاح', salman: 'سلمان', shihab: 'شهاب',
    talib: 'طالب', taher: 'طاهر', tahir: 'طاهر', turki: 'تركي', ziyad: 'زياد', ziad: 'زياد', omran: 'عمران', imran: 'عمران', asaad: 'أسعد', asad: 'أسد', bilal: 'بلال',
    // women's names
    fatima: 'فاطمة', fatma: 'فاطمة', fathima: 'فاطمة', aisha: 'عائشة', ayesha: 'عائشة', maryam: 'مريم', mariam: 'مريم', khadija: 'خديجة', zainab: 'زينب', zaineb: 'زينب',
    noor: 'نور', nour: 'نور', huda: 'هدى', hoda: 'هدى', layla: 'ليلى', laila: 'ليلى', leila: 'ليلى', salma: 'سلمى', sara: 'سارة', sarah: 'سارة', amal: 'أمل', asma: 'أسماء',
    shamsa: 'شمسة', moza: 'موزة', muna: 'منى', mona: 'منى', rahma: 'رحمة', rawya: 'راوية', reem: 'ريم', rim: 'ريم', shaikha: 'شيخة', sheikha: 'شيخة', wafa: 'وفاء',
    nasra: 'نصرة', thuraya: 'ثريا', aziza: 'عزيزة', badriya: 'بدرية', halima: 'حليمة', hanan: 'حنان', hind: 'هند', iman: 'إيمان', eman: 'إيمان', jamila: 'جميلة',
    lubna: 'لبنى', maha: 'مها', manal: 'منال', nadia: 'نادية', najla: 'نجلاء', nawal: 'نوال', rania: 'رانيا', ruqaya: 'رقية', safiya: 'صفية', samira: 'سميرة',
    suad: 'سعاد', yasmin: 'ياسمين', yasmeen: 'ياسمين', zahra: 'زهراء', zuhra: 'زهرة', ghada: 'غادة', dana: 'دانة', haya: 'هيا', fameeda: 'فميدة', fahmida: 'فهميدة',
    // family / tribe names (written after "Al")
    amri: 'عامري', busaidi: 'بوسعيدي', balushi: 'بلوشي', baloushi: 'بلوشي', hinai: 'هنائي', harthi: 'حارثي', habsi: 'حبسي', kindi: 'كندي', maskari: 'مسكري',
    rawahi: 'رواحي', riyami: 'ريامي', saadi: 'سعدي', shukaili: 'شكيلي', siyabi: 'سيابي', wahaibi: 'وهيبي', zadjali: 'زدجالي', farsi: 'فارسي', ghafri: 'غافري',
    hashmi: 'هاشمي', hosni: 'حسني', jabri: 'جابري', kalbani: 'كلباني', kharusi: 'خروصي', kharousi: 'خروصي', lamki: 'لمكي', lawati: 'لواتي', mahrooqi: 'محروقي',
    mamari: 'معمري', maamari: 'معمري', mandhari: 'منذري', mughairi: 'مغيري', nabhani: 'نبهاني', naabi: 'نعبي', nadabi: 'ندابي', nasri: 'نصري', qasmi: 'قاسمي',
    rashdi: 'راشدي', rasbi: 'راسبي', shamsi: 'شامسي', sinani: 'سناني', suleimani: 'سليماني', sulaimani: 'سليماني', tobi: 'توبي', toobi: 'توبي', wardi: 'وردي',
    yahyai: 'يحيائي', zakwani: 'ذكواني', abri: 'عبري', aufi: 'عوفي', awfi: 'عوفي', bahri: 'بحري', battashi: 'بطاشي', bulushi: 'بلوشي', hadhrami: 'حضرمي',
    hajri: 'هاجري', hatmi: 'حاتمي', ismaili: 'إسماعيلي', jahwari: 'جهوري', jassasi: 'جساسي', khatri: 'خاطري', marzouqi: 'مرزوقي', mashani: 'مشاني', mukhaini: 'مخيني',
    musalhi: 'مسلحي', oufi: 'عوفي', qassabi: 'قصابي', ruqaishi: 'رقيشي', salmi: 'سالمي', shibli: 'شبلي', subhi: 'صبحي', ajmi: 'عجمي', araimi: 'عريمي', ghailani: 'غيلاني',
    ghalib: 'غالب', ghaleb: 'غالب', anas: 'أنس', rayan: 'ريان', ryan: 'ريان', mazrouei: 'مزروعي', mazroui: 'مزروعي', ayman: 'أيمن', ammar: 'عمار', yasir: 'ياسر', yaser: 'ياسر', yasser: 'ياسر', wael: 'وائل', mohsin: 'محسن', muhsin: 'محسن', moosa: 'موسى', musa: 'موسى', haroon: 'هارون', harun: 'هارون', ghanim: 'غانم', ghanem: 'غانم', thani: 'ثاني', obaid: 'عبيد', ubaid: 'عبيد',
    saleh: 'صالح', salih: 'صالح', nizar: 'نزار', nezar: 'نزار', shaik: 'شيخ', shaikh: 'شيخ', sheikh: 'شيخ', shaykh: 'شيخ', kiyumi: 'كيومي', kiyoumi: 'كيومي', mahrouqi: 'محروقي', mahruqi: 'محروقي',
    rashida: 'رشيدة', hamida: 'حميدة', farida: 'فريدة', fareeda: 'فريدة', saida: 'سعيدة', naseem: 'نسيم', nasim: 'نسيم', waseem: 'وسيم', wasim: 'وسيم', kareem: 'كريم', karim: 'كريم',
    hakim: 'حكيم', hakeem: 'حكيم', habib: 'حبيب', khalil: 'خليل', khaleel: 'خليل', jalal: 'جلال', kamal: 'كمال', nawaf: 'نواف', sabah: 'صباح', hamza: 'حمزة', usama: 'أسامة', osama: 'أسامة',
    raid: 'رائد', raed: 'رائد', fawzi: 'فوزي', fuad: 'فؤاد', fouad: 'فؤاد', sharifa: 'شريفة', sharif: 'شريف', jokha: 'جوخة', aflah: 'أفلح', mahfoodh: 'محفوظ', mahfouz: 'محفوظ',
    shaibani: 'شيباني', mazrui: 'مزروعي', mazrooei: 'مزروعي', mawali: 'موالي', hadi: 'هادي', mahri: 'مهري', shahri: 'شحري', kathiri: 'كثيري', ghassani: 'غساني', maawali: 'معولي',
    // connectors
    bin: 'بن', ibn: 'بن', bint: 'بنت', abu: 'أبو', umm: 'أم',
  };
  const AR_DI = { iy: 'ي', ey: 'ي', uw: 'و', sh: 'ش', kh: 'خ', gh: 'غ', th: 'ث', dh: 'ذ', ch: 'تش', ph: 'ف', aa: 'ا', ee: 'ي', ii: 'ي', oo: 'و', ou: 'و', uu: 'و', ai: 'ي', ay: 'ي', ei: 'ي', au: 'و', aw: 'و' };
  const AR_C = { b: 'ب', t: 'ت', j: 'ج', h: 'ه', d: 'د', r: 'ر', z: 'ز', s: 'س', f: 'ف', q: 'ق', k: 'ك', l: 'ل', m: 'م', n: 'ن', w: 'و', y: 'ي', p: 'ب', v: 'ف', g: 'ج', c: 'ك', x: 'كس' };
  // phonetic spelling for words that are not in the list
  function arPhonetic(w) {
    w = w.toLowerCase().replace(/[^a-z]/g, '').replace(/([b-df-hj-np-tv-z])\1+/g, '$1');
    if (!w) return '';
    let out = '', i = 0;
    const V = 'aeiou';
    while (i < w.length) {
      const two = w.substr(i, 2), ch = w[i], first = i === 0, last2 = i + 2 >= w.length, last = i === w.length - 1;
      if (first && V.includes(ch)) { out += ch === 'a' ? 'أ' : ch === 'e' || ch === 'i' ? 'إ' : 'أو'; i += (two === 'aa' || two === 'ee' || two === 'oo' || two === 'ou') ? 2 : 1; continue; }
      if (last && ch === 'a' || (two === 'ah' && last2)) { out += 'ة'; i += two === 'ah' ? 2 : 1; continue; }
      if (AR_DI[two]) { out += AR_DI[two]; i += 2; continue; }
      // "a" before the final consonant is usually long (Nizar, Bilal, Jamal)
      if (ch === 'a' && i === w.length - 2 && !V.includes(w[i + 1]) && i > 1) { out += 'ا'; i++; continue; }
      if (V.includes(ch)) { out += ch === 'i' || (ch === 'e' && last) ? 'ي' : ch === 'o' || ch === 'u' ? 'و' : ''; i++; continue; }
      out += AR_C[ch] || ''; i++;
    }
    return out;
  }
  const arWord = w => { const k = w.toLowerCase().replace(/[^a-z]/g, ''); return AR_NAMES[k] || arPhonetic(k); };
  function toArabicName(en) {
    const words = String(en || '').trim().split(/[\s]+/).filter(Boolean);
    const out = [];
    for (let i = 0; i < words.length; i++) {
      let w = words[i];
      const m = /^(al|el)[-‐']?(.+)$/i.exec(w); // "Al-Amri", "AlAmri", "El-Hinai"
      if (/^(al|el)$/i.test(w)) { out.push(words[i + 1] ? 'ال' + arWord(words[++i]) : 'ال'); continue; }
      if (m && m[2].length > 2 && /[-‐']/.test(w)) { out.push('ال' + arWord(m[2])); continue; }
      out.push(arWord(w));
    }
    return out.join(' ');
  }

  /* ---------------- geometry ---------------- */
  const R = 6371000;
  function haversine(a, b) {
    const toR = x => x * Math.PI / 180;
    const dLat = toR(b.lat - a.lat), dLng = toR(b.lng - a.lng);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(toR(a.lat)) * Math.cos(toR(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function toXY(p, o) { // metres relative to origin o
    return [(p.lng - o.lng) * 111320 * Math.cos(o.lat * Math.PI / 180), (p.lat - o.lat) * 110540];
  }
  function fromXY(x, y, o) { return { lat: o.lat + y / 110540, lng: o.lng + x / (111320 * Math.cos(o.lat * Math.PI / 180)) }; }
  function centroid(poly) { let la = 0, ln = 0; poly.forEach(p => { la += p.lat; ln += p.lng; }); return { lat: la / poly.length, lng: ln / poly.length }; }
  function pointInPoly(pt, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].lng, yi = poly[i].lat, xj = poly[j].lng, yj = poly[j].lat;
      if (((yi > pt.lat) !== (yj > pt.lat)) && (pt.lng < (xj - xi) * (pt.lat - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }
  function segDist(p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    let tt = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1);
    tt = Math.max(0, Math.min(1, tt));
    return Math.hypot(p[0] - (a[0] + tt * dx), p[1] - (a[1] + tt * dy));
  }
  // metres outside the site boundary (0 when inside)
  function distOutside(site, pos) {
    if (site.shape === 'circle') return Math.max(0, haversine(site.center, pos) - site.radius);
    if (pointInPoly(pos, site.polygon)) return 0;
    const o = centroid(site.polygon), p = toXY(pos, o), pts = site.polygon.map(q => toXY(q, o));
    let m = Infinity;
    for (let i = 0; i < pts.length; i++) m = Math.min(m, segDist(p, pts[i], pts[(i + 1) % pts.length]));
    return m;
  }
  // how far a point is inside the zone from its edge (0 when outside)
  function distInside(site, pos) {
    if (site.shape === 'circle') return Math.max(0, site.radius - haversine(site.center, pos));
    if (!pointInPoly(pos, site.polygon)) return 0;
    const o = centroid(site.polygon), p = toXY(pos, o), pts = site.polygon.map(q => toXY(q, o));
    let m = Infinity;
    for (let i = 0; i < pts.length; i++) m = Math.min(m, segDist(p, pts[i], pts[(i + 1) % pts.length]));
    return m;
  }
  // GPS accuracy is good enough when it meets the site's minimum, or when the whole accuracy circle is still inside the zone
  // (then the person is inside wherever they really are – e.g. Wi-Fi / indoor location of ±50–100 m in the middle of a site)
  const MAX_ACC = 150;
  function accOk(site, pos) { return pos.acc <= site.minAcc || (pos.acc <= MAX_ACC && distOutside(site, pos) === 0 && distInside(site, pos) + site.buffer >= pos.acc); }
  function siteCenter(site) { return site.shape === 'circle' ? site.center : centroid(site.polygon); }
  function polyArea(poly) {
    const o = centroid(poly), p = poly.map(q => toXY(q, o)); let a = 0;
    for (let i = 0; i < p.length; i++) { const j = (i + 1) % p.length; a += p[i][0] * p[j][1] - p[j][0] * p[i][1]; }
    return Math.abs(a / 2);
  }
  function siteArea(site) { return site.shape === 'circle' ? Math.PI * site.radius * site.radius : polyArea(site.polygon); }

  /* ---------------- seed data (MM-style sample data) ---------------- */
  const LOC = {
    restRow: { name: 'Restaurant Row, Al Khuwair, Bousher', ar: 'صف المطاعم، الخوير، بوشر', lat: 23.5880, lng: 58.3830, wil: 'Bousher' },
    seebSouq: { name: 'Seeb Souq, Seeb', ar: 'سوق السيب، السيب', lat: 23.6765, lng: 58.1880, wil: 'Seeb' },
    mawaleh: { name: 'Al Mawaleh, Seeb', ar: 'الموالح، السيب', lat: 23.6050, lng: 58.2300, wil: 'Seeb' },
    ruwi: { name: 'Ruwi, Muttrah', ar: 'روي، مطرح', lat: 23.5980, lng: 58.5450, wil: 'Muttrah' },
    amerat: { name: 'Al Amerat Heights', ar: 'مرتفعات العامرات', lat: 23.5200, lng: 58.5000, wil: 'Amerat' },
    qurayat: { name: 'Qurayat', ar: 'قريات', lat: 23.2650, lng: 58.9150, wil: 'Qurayat' },
    bousher: { name: 'Bousher', ar: 'بوشر', lat: 23.5700, lng: 58.4000, wil: 'Bousher' },
    muttrahSouq: { name: 'Muttrah Souq, Muttrah', ar: 'سوق مطرح، مطرح', lat: 23.6200, lng: 58.5600, wil: 'Muttrah' },
    darsait: { name: 'Darsait food outlets, Muttrah', ar: 'منافذ الأغذية، دارسيت', lat: 23.6080, lng: 58.5470, wil: 'Muttrah' },
    khuwairMall: { name: 'Al Khuwair Hypermarket, Bousher', ar: 'هايبرماركت الخوير، بوشر', lat: 23.5950, lng: 58.4050, wil: 'Bousher' },
    ghubra: { name: 'Al Ghubrah bakery, Bousher', ar: 'مخبز الغبرة، بوشر', lat: 23.5900, lng: 58.3950, wil: 'Bousher' },
    corniche: { name: 'Muttrah Corniche, Muscat', ar: 'كورنيش مطرح، مسقط', lat: 23.6195, lng: 58.5720, wil: 'Muttrah' },
    qurum: { name: 'Qurum Natural Park, Qurum', ar: 'حديقة القرم الطبيعية، القرم', lat: 23.6150, lng: 58.4800, wil: 'Bousher' },
    khuwairSt: { name: 'Al Khuwair Street, Bousher', ar: 'شارع الخوير، بوشر', lat: 23.5990, lng: 58.4250, wil: 'Bousher' },
    seebPark: { name: 'Seeb Corniche Park, Seeb', ar: 'حديقة كورنيش السيب، السيب', lat: 23.6820, lng: 58.1950, wil: 'Seeb' },
    ameratRd: { name: 'Al Amerat Main Road, Amerat', ar: 'الطريق الرئيسي، العامرات', lat: 23.5250, lng: 58.4950, wil: 'Amerat' },
    ruwiHigh: { name: 'Ruwi High Street, Ruwi', ar: 'شارع روي التجاري، روي', lat: 23.5940, lng: 58.5440, wil: 'Muttrah' },
    ghubrah: { name: 'Al Ghubrah Drains, Bousher', ar: 'مصارف الغبرة، بوشر', lat: 23.5960, lng: 58.3890, wil: 'Bousher' },
  };
  const TASK_TYPES = { 'Inspection': 'search', 'Waste Management': 'trash', 'Street Cleaning': 'broom', 'Public Area Cleaning': 'broom', 'Maintenance': 'wrench', 'Tree Maintenance': 'tree', 'Graffiti Removal': 'building', 'Drainage': 'drop' };

  function seed() {
    const T = (h, m, d) => at(h, m, d || 0);
    const yesterday = -1;
    const emp = (id, name, nameAr, role, roleAr, wil, dept, site, device, extra) => Object.assign({ id, code: 'MM' + id.slice(1), name, nameAr, role, roleAr, wilayat: wil, dept, siteId: site, device, adStatus: 'active', status: 'active', gender: 'M', email: name.toLowerCase().replace(/^(\w+) al (\w+)$/, '$1.$2').replace(/ /g, '.') + '@muscat.gov.om', phone: '+968 9' + id.slice(1, 4) + ' ' + id.slice(2, 6), joined: '12 Jan 2022', dob: '12 Jan 1990', field: true }, extra || {});
    const F = { gender: 'F' };
    const db = {
      schema: 13, createdAt: Date.now(),
      settings: { clock: 'real', clockStart: Date.now(), tracking: true },
      counters: { fr: 41, tsk: 2301, req: 5120 },
      people: {
        supervisor: { id: 'S-2201', name: 'Salim Al Hinai', nameAr: 'سالم الهنائي', role: 'Supervisor · Health Inspection', roleAr: 'مشرف · التفتيش الصحي' },
        hr: { id: 'H-1007', name: 'Fatma Al Balushi', nameAr: 'فاطمة البلوشي', role: 'HR Admin', roleAr: 'مسؤولة الموارد البشرية' },
        director: { id: 'D-1001', name: 'Ahmed Al Busaidi', nameAr: 'أحمد البوسعيدي', role: 'H & Operations Director', roleAr: 'مدير الموارد والعمليات' },
      },
      employees: [
        emp('100124', 'Salim Al Balushi', 'سالم البلوشي', 'Field Inspector', 'مفتش ميداني', 'Muttrah', 'Field Operations', 'muttrah', 'DEV-0124-S24'),
        emp('100145', 'Fatima Al Zahra', 'فاطمة الزهراء', 'Supervisor', 'مشرفة', 'Bousher', 'Cleaning Services', 'khuwair', 'DEV-0145-IP15', F),
        emp('100167', 'Hassan Al Riyami', 'حسن الريامي', 'Technician', 'فني', 'Bousher', 'Maintenance', 'bousher', 'DEV-0167-A55'),
        emp('100188', 'Aisha Al Hinai', 'عائشة الهنائية', 'Inspector', 'مفتشة', 'Seeb', 'Inspection', 'seeb', 'DEV-0188-IP13', F),
        emp('100201', 'Omar Al Shamsi', 'عمر الشامسي', 'Operator', 'مشغل', 'Amerat', 'Waste Management', 'bousher', 'DEV-0201-RN13'),
        emp('100210', 'Nasser Al Rahbi', 'ناصر الرحبي', 'Field Inspector', 'مفتش ميداني', 'Muttrah', 'Field Operations', 'muttrah', 'DEV-0210-S22', { status: 'leave' }),
        emp('100234', 'Mariam Al Kindi', 'مريم الكندي', 'Staff', 'موظفة', 'Muttrah', 'Cleaning Services', 'muttrah', 'DEV-0234-A14', F),
        emp('100245', 'Khalid Al Maawali', 'خالد المعولي', 'Inspector', 'مفتش', 'Bousher', 'Inspection', 'bousher', 'DEV-0245-P8'),
        emp('100256', 'Zainab Al Rashidi', 'زينب الراشدية', 'Coordinator', 'منسقة', 'Muscat', 'Administration', 'headoffice', 'DEV-0256-IP15', Object.assign({ field: false }, F)),
        emp('100267', 'Yahya Al Mahrouqi', 'يحيى المحروقي', 'Technician', 'فني', 'Seeb', 'Maintenance', 'seeb', 'DEV-0267-A33', { status: 'inactive' }),
        emp('104582', 'Ahmed Al Amri', 'أحمد العامري', 'Health Inspector', 'مفتش صحي', 'Muttrah', 'Health Inspection', 'muttrah', 'DEV-AHMED-IPHONE'),
        emp('104611', 'Noor Al Kindi', 'نور الكندي', 'Inspector', 'مفتشة', 'Seeb', 'Health Inspection', 'seeb', 'DEV-6611-A54', F),
        emp('104637', 'Hamad Al Saadi', 'حمد السعدي', 'Inspector', 'مفتش', 'Bousher', 'Health Inspection', 'bousher', 'DEV-4637-S23'),
        emp('103920', 'Said Al Mahrooqi', 'سعيد المحروقي', 'Duty officer · 24×7 desk', 'ضابط مناوب · مكتب ٢٤×٧', 'Muttrah', 'Health Inspection', 'muttrah', 'DEV-3920-IP13'),
        emp('104205', 'Maryam Al Siyabi', 'مريم السيابي', 'Officer', 'موظفة', 'Muttrah', 'Licensing', 'muttrah', 'DEV-4205-IP14', Object.assign({ field: false }, F)),
        emp('102877', 'Khalid Al Rawahi', 'خالد الرواحي', 'Crew lead', 'رئيس فريق', 'Seeb', 'Road Maintenance', 'seeb', 'DEV-2877-RN12'),
        emp('104455', 'Rashid Al Busaidi', 'راشد البوسعيدي', 'Inspector', 'مفتش', 'Amerat', 'Health Inspection', 'bousher', 'DEV-4455-A34'),
        emp('104512', 'Salma Al Hashmi', 'سلمى الهاشمي', 'Inspector', 'مفتشة', 'Qurayat', 'Health Inspection', 'qurayat', 'DEV-4512-IP12', F),
        emp('104390', 'Yousuf Al Habsi', 'يوسف الحبسي', 'Inspector', 'مفتش', 'Bousher', 'Health Inspection', 'bousher', 'DEV-4390-P7'),
      ],
      sites: [
        { id: 'muttrah', name: 'Muttrah Municipal Office', nameAr: 'مكتب بلدية مطرح', shape: 'polygon', polygon: [{ lat: 23.61765, lng: 58.56445 }, { lat: 23.61755, lng: 58.56565 }, { lat: 23.61680, lng: 58.56560 }, { lat: 23.61685, lng: 58.56450 }], buffer: 25, minAcc: 20, valid: 'permanent', until: '', depts: ['Health Inspection', 'Licensing', 'Muttrah Admin'], staff: 146, parcel: 'MTR-4471-B', wilayat: 'Muttrah' },
        { id: 'bousher', name: 'Bousher Service Centre', nameAr: 'مركز خدمات بوشر', shape: 'circle', center: { lat: 23.5840, lng: 58.4060 }, radius: 120, buffer: 20, minAcc: 20, valid: 'permanent', until: '', depts: ['Health Inspection', 'Customer Service'], staff: 88, parcel: 'BSH-1182-A', wilayat: 'Bousher' },
        { id: 'seeb', name: 'Seeb Central Depot', nameAr: 'مستودع السيب المركزي', shape: 'polygon', polygon: [{ lat: 23.67080, lng: 58.18820 }, { lat: 23.67060, lng: 58.19010 }, { lat: 23.66930, lng: 58.19000 }, { lat: 23.66920, lng: 58.18860 }, { lat: 23.67000, lng: 58.18800 }], buffer: 30, minAcc: 20, valid: 'permanent', until: '', depts: ['Road Maintenance', 'Health Inspection', 'Cleaning Services'], staff: 211, parcel: 'SEB-0907-C', wilayat: 'Seeb' },
        { id: 'khuwair', name: 'Al Khuwair road works', nameAr: 'أعمال طرق الخوير', shape: 'circle', center: { lat: 23.5960, lng: 58.4100 }, radius: 150, buffer: 25, minAcc: 20, valid: 'temporary', until: '30 Nov', depts: ['Road Maintenance'], staff: 37, parcel: 'TMP-2026-114', wilayat: 'Bousher' },
        { id: 'qurayat', name: 'Qurayat Branch Office', nameAr: 'مكتب فرع قريات', shape: 'circle', center: { lat: 23.2600, lng: 58.9180 }, radius: 80, buffer: 20, minAcc: 20, valid: 'permanent', until: '', depts: ['Health Inspection', 'Qurayat Admin'], staff: 54, parcel: 'QRY-0311-A', wilayat: 'Qurayat' },
        { id: 'headoffice', name: 'Muscat Municipality Head Office', nameAr: 'المبنى الرئيسي لبلدية مسقط', shape: 'circle', center: { lat: 23.5880, lng: 58.4085 }, radius: 150, buffer: 25, minAcc: 20, valid: 'permanent', until: '', depts: ['Administration', 'Human Resources', 'Engineering'], staff: 412, parcel: 'HQ-0001-A', wilayat: 'Muscat' },
      ],
      tasks: [
        task('TSK-2291', 'Food outlet inspection', 'تفتيش منفذ أغذية', 'restRow', 'High', '104582', 'assigned', T(11, 0)),
        task('TSK-2300', 'Bakery hygiene follow-up', 'متابعة نظافة مخبز', 'muttrahSouq', 'Normal', '104582', 'assigned', T(13, 0)),
        task('TSK-2295', 'Restaurant licence spot check', 'فحص مفاجئ لترخيص مطعم', 'darsait', 'High', '104582', 'assigned', T(12, 30)),
        task('TSK-2298', 'Bakery licence renewal check', 'فحص تجديد ترخيص مخبز', 'mawaleh', 'Normal', '104611', 'assigned', T(12, 0)),
        task('TSK-2299', 'Complaint follow-up: street food stall', 'متابعة شكوى: كشك أطعمة', 'ruwi', 'Normal', '104637', 'assigned', T(13, 30)),
        task('TSK-2296', 'Market hygiene inspection', 'تفتيش نظافة السوق', 'seebSouq', 'High', '104611', 'ontheway', T(11, 30), { eta: 8 }),
        task('TSK-2287', 'Water tank sampling', 'أخذ عينات خزان المياه', 'amerat', 'Normal', '104455', 'onsite', T(11, 0), { arrivedAt: T(8, 47), distance: 22 }),
        task('TSK-2280', 'Slaughterhouse audit', 'تدقيق المسلخ', 'qurayat', 'High', '104512', 'delayed', T(9, 0), { delayReason: 'Vehicle breakdown' }),
        task('TSK-1043', 'Waste Collection', 'جمع النفايات', 'corniche', 'Normal', '100124', 'inprogress', T(12, 0), { type: 'Waste Management', arrivedAt: T(7, 5), distance: 24, notes: 'Bins along the corniche walkway emptied; two overflowing bins near the fish market.', desc: 'Collect waste from designated bins along Muttrah Corniche. Ensure area is clean and report any issues.', photos: [{ id: 'w1', time: T(7, 10), lat: 23.6195, lng: 58.572, sample: 1 }, { id: 'w2', time: T(7, 16), lat: 23.6195, lng: 58.572, sample: 3 }, { id: 'w3', time: T(7, 22), lat: 23.6195, lng: 58.572, sample: 2 }], history: [['assigned', T(6, 30)], ['ontheway', T(6, 45)], ['onsite', T(7, 5)], ['inprogress', T(7, 8)]] }),
        task('TSK-1044', 'Public Area Cleaning', 'تنظيف المرافق العامة', 'qurum', 'Normal', '100145', 'assigned', T(10, 0), { type: 'Public Area Cleaning' }),
        task('TSK-1045', 'Facility Inspection', 'تفتيش المرافق', 'khuwairSt', 'Normal', '100167', 'assigned', T(11, 30), { type: 'Maintenance' }),
        task('TSK-1046', 'Tree Maintenance', 'صيانة الأشجار', 'seebPark', 'Normal', '100188', 'ontheway', T(13, 0), { type: 'Tree Maintenance', eta: 12 }),
        task('TSK-1047', 'Roadside Cleanup', 'تنظيف جوانب الطرق', 'ameratRd', 'High', '100201', 'delayed', T(7, 0), { type: 'Street Cleaning', delayReason: 'Waiting for equipment' }),
        task('TSK-1048', 'Graffiti Removal', 'إزالة الكتابات على الجدران', 'ruwiHigh', 'Low', '100234', 'assigned', T(15, 30), { type: 'Graffiti Removal' }),
        task('TSK-1049', 'Street Cleaning – Ruwi', 'تنظيف الشوارع – روي', 'ruwi', 'High', '100245', 'onsite', T(12, 0), { type: 'Street Cleaning', arrivedAt: T(7, 12), distance: 31 }),
        task('TSK-1050', 'Drainage Check – Al Ghubrah', 'فحص المصارف – الغبرة', 'ghubrah', 'Normal', '102877', 'done', T(9, 0), { type: 'Drainage', arrivedAt: T(6, 20), completedAt: T(7, 1), distance: 15, notes: 'Drains clear; one grate replaced.', photos: [{ id: 'd1', time: T(6, 40), lat: 23.596, lng: 58.389, sample: 3 }, { id: 'd2', time: T(6, 55), lat: 23.596, lng: 58.389, sample: 2 }] }),
        task('TSK-2276', 'Pest control verification', 'التحقق من مكافحة الآفات', 'bousher', 'Normal', '104637', 'done', T(9, 30), { arrivedAt: T(8, 2), completedAt: T(8, 40), distance: 18, notes: 'Bait stations replaced; no activity found in storage area.', photos: [{ id: 'p3', time: T(8, 10), lat: 23.570, lng: 58.400, sample: 1 }, { id: 'p4', time: T(8, 22), lat: 23.570, lng: 58.400, sample: 2 }, { id: 'p5', time: T(8, 35), lat: 23.570, lng: 58.400, sample: 3 }] }),
      ],
      requests: [
        { id: 'REQ-5101', empId: '104582', type: 'short', status: 'approved', created: T(9, 0, -4), date: T(0, 0, -4), hours: 2, from: '10:00', to: '12:00', reason: 'Hospital appointment', decidedBy: 'Salim Al Hinai', decidedAt: T(9, 40, -4) },
        { id: 'REQ-5108', empId: '104582', type: 'leave', status: 'pending', created: T(10, 0, -2), from: '18 Nov 2026', to: '20 Nov 2026', days: 3, leaveType: 'Annual leave', reason: 'Family travel', stage: 'hr' },
        { id: 'REQ-5115', empId: '102877', type: 'overtime', status: 'pending', created: T(15, 10, -2), date: T(0, 0, -2), detail: '1 h 40 min · above auto-approve limit', evidence: 'Punches inside fence' },
        { id: 'REQ-5117', empId: '104611', type: 'leave', status: 'pending', created: T(8, 20, -1), from: '10 Nov 2026', to: '11 Nov 2026', days: 2, leaveType: 'Annual leave', reason: 'Personal', evidence: 'Covered: roster updated', balance: 18 },
      ],
      punches: [],
      audit: [
        { id: 'A1', time: T(7, 52), empId: '104390', what: 'Mock-location app active during check-in', whatAr: 'تطبيق موقع وهمي نشط أثناء تسجيل الحضور', code: 'LOC_MOCK', decision: 'blocked' },
        { id: 'A2', time: T(7, 35), empId: '104777', what: 'Login from an unregistered phone', whatAr: 'تسجيل دخول من هاتف غير مسجل', code: 'DEVICE_UNBOUND', decision: 'blocked' },
        { id: 'A3', time: T(7, 33), empId: '104455', what: 'GPS accuracy 65 m (needs under 20 m)', whatAr: 'دقة الموقع ٦٥ م (المطلوب أقل من ٢٠ م)', code: 'GPS_LOW_ACC', decision: 'retry', note: 'retry OK 07:34' },
        { id: 'A4', time: T(6, 58), empId: '104512', what: 'Phone clock 47 min ahead of server', whatAr: 'ساعة الهاتف متقدمة ٤٧ دقيقة عن الخادم', code: 'TIME_SKEW', decision: 'accepted' },
      ],
      decisions: [],
      activity: [],
      notifications: [],
      syncLog: [
        { id: 'SL1', time: T(7, 2), device: 'DEV-AHMED-IPHONE', empId: '104582', type: 'delta', rows: 14, result: 'ok' },
        { id: 'SL2', time: T(6, 55), device: 'DEV-6611-A54', empId: '104611', type: 'delta', rows: 9, result: 'ok' },
        { id: 'SL3', time: T(2, 0), device: 'server', empId: '', type: 'Oracle HRMS delta', rows: 214, result: 'ok' },
      ],
      processed: {},
      crew: {
        '104611': { lat: 23.6400, lng: 58.2400, status: 'ontheway', time: T(9, 30), trail: [[23.625, 58.27], [23.632, 58.255], [23.640, 58.240]] },
        '104637': { lat: 23.5700, lng: 58.4000, status: 'onsite', time: T(9, 35) },
        '104582': { lat: 23.58832, lng: 58.38300, status: 'onsite', time: T(9, 21) },
        '104455': { lat: 23.5202, lng: 58.5001, status: 'onsite', time: T(9, 0) },
        '104512': { lat: 23.2650, lng: 58.9150, status: 'delayed', time: T(9, 10) },
        '100124': { lat: 23.6193, lng: 58.5712, status: 'onsite', time: T(7, 24) },
        '100145': { lat: 23.6010, lng: 58.4420, status: 'ontheway', time: T(7, 20), trail: [[23.592, 58.410], [23.597, 58.425], [23.601, 58.442]] },
        '100167': { lat: 23.6120, lng: 58.4760, status: 'onsite', time: T(7, 15) },
        '100188': { lat: 23.6700, lng: 58.2050, status: 'ontheway', time: T(7, 18) },
        '100201': { lat: 23.5260, lng: 58.4960, status: 'delayed', time: T(7, 2) },
        '100234': { lat: 23.6160, lng: 58.5620, status: 'onsite', time: T(7, 25) },
        '100245': { lat: 23.5945, lng: 58.5445, status: 'onsite', time: T(7, 12) },
        '102877': { lat: 23.5962, lng: 58.3893, status: 'onsite', time: T(7, 1) },
        '100267': { lat: 23.6650, lng: 58.2300, status: 'off', time: T(6, 40, -1) },
      },
      roster: {},
      rules: { grace: 15, earlyOut: 10, otAfter: 7, otAuto: 1, missing: 2 },
      shifts: {
        M: { name: 'Morning', ar: 'صباحية', from: '07:30', to: '14:30' },
        E: { name: 'Evening', ar: 'مسائية', from: '14:00', to: '21:00' },
        N: { name: 'Night', ar: 'ليلية', from: '21:00', to: '07:00' },
        S: { name: 'Split', ar: 'مجزأة', from: '07:00–11:00', to: '16:00–20:00' },
        L: { name: 'Leave', ar: 'إجازة' }, O: { name: 'Off', ar: 'راحة' },
      },
      locks: {},
      integrations: [
        { key: 'hrms', name: 'Oracle HRMS', detail: 'daily employee sync', status: 'ok', last: T(2, 0), msg: '214 changes' },
        { key: 'payroll', name: 'Oracle Payroll', detail: 'monthly attendance export', status: 'ok', last: T(2, 0, -4), msg: 'Sent' },
        { key: 'ad', name: 'Active Directory', detail: 'login + leaver block', status: 'ok', last: T(7, 0), msg: 'Live · 3 leavers blocked' },
        { key: 'arcgis', name: 'ArcGIS boundaries', detail: 'parcel → geofence import', status: "ok", last: T(2, 10), msg: "All sites in sync" },
        { key: 'sms', name: 'SMS gateway', detail: 'OTP + urgent alerts', status: 'warn', last: T(7, 41), msg: '2 retries, delivered' },
        { key: 'smtp', name: 'Exchange / SMTP', detail: 'alerts, approvals, reports', status: 'ok', last: T(7, 30), msg: '86 emails today' },
        { key: 'push', name: 'Push (APNs / FCM)', detail: 'reminders, shift changes', status: 'ok', last: T(7, 15), msg: '1,964 delivered' },
      ],
      tiles: [
        { key: 'vehicle', label: 'Vehicle booking', ar: 'حجز مركبة', icon: 'car', on: true },
        { key: 'asset', label: 'Asset request', ar: 'طلب أصول', icon: 'plussq', on: true },
        { key: 'inspections', label: 'Inspections', ar: 'التفتيش', icon: 'search', on: true },
        { key: 'payslip', label: 'Payslip', ar: 'قسيمة الراتب', icon: 'file', on: false },
      ],
      stats: {
        present: 4091, rostered: 4892, total: 4892, late: 78, field: 632, absent: 312, onLeave: 400, activeSites: 41,
        tasksDone: 95, tasksTotal: 632, avgVisit: 42, overdue: 8, completedToday: 60,
        fieldStatus: { onsite: 312, inprogress: 178, completed: 96, delayed: 38, overdue: 8 },
        week: [[4150, 4300], [4480, 4350], [4620, 4380], [4102, 3650], [3900, 4100], [3480, 3800], [3550, 3750]],
        wilayat: [['Muscat', 91], ['Muttrah', 89], ['Bousher', 88], ['Seeb', 86], ['Amerat', 84], ['Qurayat', 82]],
        slots: [['06:45', 120], ['07:00', 330], ['07:15', 920], ['07:30', 1000], ['07:45', 410], ['08:00', 140], ['08:15', 60]],
      },
      exceptions: [
        { empId: '102877', section: 'Road Maintenance', what: 'Missing check-out (yesterday)', whatAr: 'لا يوجد تسجيل انصراف (أمس)', src: 'Nightly batch', go: 'approvals' },
        { empId: '104205', section: 'Licensing', what: 'Late 3 times this week', whatAr: 'تأخر ٣ مرات هذا الأسبوع', src: 'Rules engine', go: 'shifts' },
        { empId: '104390', section: 'Health Inspection', what: 'Mock-location app detected', whatAr: 'تم اكتشاف تطبيق موقع وهمي', src: 'Anti-fraud engine', go: 'audit' },
      ],
    };
    // Ahmed's punch history (last 6 working days)
    for (let d = -6; d <= -1; d++) {
      const late = d === -3;
      db.punches.push({ id: uid('P'), empId: '104582', type: 'IN', photo: { sample: 1 + ((d % 3) + 3) % 3, lat: 23.61721 + d * 1e-5, lng: 58.56505, acc: 6 }, pos: { lat: 23.61721 + d * 1e-5, lng: 58.56505 }, dist: 12 + ((d * 7) % 20 + 20) % 20, time: at(7, late ? 49 : 22 + ((d * 7) % 6 + 6) % 6, d), siteId: 'muttrah', status: 'accepted', late: late ? 19 : 0, acc: 7 });
      db.punches.push({ id: uid('P'), empId: '104582', type: 'OUT', time: at(14, 31 + ((d * 5) % 6 + 6) % 6, d), siteId: 'muttrah', status: 'accepted', acc: 6 });
    }
    // last punch: yesterday 14:36 check-out (missing check-out the day before is the missed-punch story)
    db.punches = db.punches.filter(p => !(p.type === 'OUT' && dayStart(p.time) === dayStart(at(0, 0, -1))));
    db.punches.push({ id: uid('P'), empId: '104582', type: 'OUT', time: at(14, 36, -1), siteId: 'muttrah', status: 'accepted', acc: 6 });
    // today's check-ins for the wider workforce (attendance records, geofence activity)
    [['100124', 6, 52, 'muttrah', 1], ['100145', 6, 43, 'khuwair', 1], ['100167', 6, 58, 'bousher', 1], ['100188', 7, 19, 'seeb', 0], ['100201', 7, 21, 'bousher', 0],
     ['100234', 6, 47, 'muttrah', 1], ['100245', 7, 3, 'bousher', 1], ['100256', 7, 10, 'headoffice', 1], ['102877', 6, 15, 'seeb', 1], ['104611', 6, 50, 'seeb', 1], ['104637', 6, 55, 'bousher', 1]
    ].forEach(([id, h, m, site, inside], i) => {
      db.punches.push({ id: uid('P'), empId: id, type: 'IN', time: at(h, m), siteId: site, status: 'accepted', acc: 5 + (i % 9), late: inside ? 0 : 0, geo: inside ? 'inside' : 'outside', late2: !inside });
      for (let d = -3; d <= -1; d++) {
        db.punches.push({ id: uid('P'), empId: id, type: 'IN', time: at(h, (m + d * 3 + 60) % 60, d), siteId: site, status: 'accepted', acc: 7 });
        db.punches.push({ id: uid('P'), empId: id, type: 'OUT', time: at(15, (m * 2 + d * 5 + 60) % 60, d), siteId: site, status: 'accepted', acc: 7 });
      }
    });
    genWorkforce(db, emp);
    db.activity = [
      { id: 'AC1', time: T(7, 5), title: 'Attendance sync completed', sub: 'All attendance records updated successfully', kind: 'sync' },
      { id: 'AC2', time: T(6, 42), title: 'New field task assigned', sub: 'Road inspection – Ruwi', kind: 'task' },
      { id: 'AC3', time: T(6, 15), title: 'Leave request submitted', sub: 'Fatima Al Zahra', kind: 'request' },
      { id: 'AC4', time: T(5, 50), title: 'Shift updated', sub: 'Night shift – Waste Management', kind: 'shift' },
      { id: 'AC5', time: T(5, 30), title: 'New employee added', sub: 'Khalid Al Maamari', kind: 'employee' },
    ];
    db.requests.push(
      { id: 'REQ-5119', empId: '100145', type: 'leave', status: 'pending', created: T(6, 15), from: '12 Nov 2026', to: '13 Nov 2026', days: 2, leaveType: 'Annual leave', reason: 'Family event', balance: 21 },
      { id: 'REQ-5120', empId: '100201', type: 'shift', status: 'pending', created: T(6, 5), date: T(0, 0, 2), detail: 'Swap Morning → Evening (Mon)', reason: 'Medical appointment in the morning' });
    // ---- Ahmed's phone: a full month of history, more requests and HR / manager messages ----
    const dstr = ms => { const d = new Date(ms); return pad(d.getDate()) + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear(); };
    const SICK = -12, NO_OUT = -15, LATE = { '-9': 14, '-17': 23, '-26': 11 };
    const n0 = new Date(now()), firstPrev = Math.round((new Date(n0.getFullYear(), n0.getMonth() - 1, 1).getTime() - dayStart()) / 864e5);
    for (let d = firstPrev; d <= -7; d++) {
      if (d === SICK || new Date(at(0, 0, d)).getDay() === 5) continue; // sick leave · Friday off
      const lm = LATE[d] || 0;
      db.punches.push({ id: uid('P'), empId: '104582', type: 'IN', photo: { sample: 1 + ((d % 3) + 3) % 3, lat: 23.61721 + d * 1e-5, lng: 58.56505, acc: 6 }, pos: { lat: 23.61721 + d * 1e-5, lng: 58.56505 }, dist: 12 + ((d * 7) % 20 + 20) % 20, time: at(7, lm ? 30 + lm : 18 + ((d * 7) % 9 + 9) % 9, d), siteId: 'muttrah', status: 'accepted', late: lm, acc: 6 + (((d * 3) % 5) + 5) % 5 });
      if (d !== NO_OUT) db.punches.push({ id: uid('P'), empId: '104582', type: 'OUT', time: at(14, 30 + ((d * 5) % 8 + 8) % 8, d), siteId: 'muttrah', status: 'accepted', acc: 7 });
    }
    const r5108 = db.requests.find(r => r.id === 'REQ-5108'); if (r5108) r5108.supAt = T(11, 20, -1);
    // supervisor approval of Ahmed's daily time entries (key: empId|yyyymmdd)
    db.tsApprovals = {};
    for (let d = firstPrev; d <= -1; d++) {
      const k = '104582|' + ymd(at(0, 0, d));
      if (d === NO_OUT) db.tsApprovals[k] = { status: 'returned', by: 'Salim Al Hinai', at: T(9, 15, d + 1), note: 'Check-out is missing. Please submit a missed-punch correction.' };
      else if (d <= -4) db.tsApprovals[k] = { status: 'approved', by: 'Salim Al Hinai', at: T(9, 5 + ((-d * 7) % 40), d + (new Date(at(0, 0, d)).getDay() === 4 ? 2 : 1)), note: LATE[d] ? 'Late arrival accepted – traffic diversion on Sultan Qaboos Street.' : '' };
      else db.tsApprovals[k] = { status: 'pending', submittedAt: T(14, 40, d) };
    }
    // the rest of the Health Inspection team: last 3 working days, most already approved, a few waiting
    for (let d = -3; d <= -1; d++) {
      const h = db.history.find(x => x.day === dayStart(at(12, 0, d))); if (!h) continue;
      ROSTER_ORDER.filter(id => id !== '104582').forEach((id, j) => {
        const idx = db.employees.findIndex(e => e.id === id), c = h.codes[idx];
        if (c !== 'P' && c !== 'L') return;
        const k = id + '|' + ymd(at(0, 0, d));
        db.tsApprovals[k] = (j * 5 + d * 3 + 30) % 4 === 0 || d === -1 && j % 3 === 0
          ? { status: 'pending', submittedAt: T(14, 45 + j, d) }
          : { status: 'approved', by: 'Salim Al Hinai', at: T(18, 5 + j, d), note: c === 'L' ? 'Late arrival noted.' : '' };
      });
    }
    db.requests.push(
      { id: 'REQ-5093', empId: '104582', type: 'leave', status: 'approved', created: T(8, 5, SICK), from: dstr(at(0, 0, SICK)), to: dstr(at(0, 0, SICK)), days: 1, leaveType: 'Sick leave', reason: 'Fever – medical certificate attached', file: 'medical-certificate.pdf', decidedBy: 'HR Department', decidedAt: T(12, 0, SICK + 1), supAt: T(9, 10, SICK) },
      { id: 'REQ-5098', empId: '104582', type: 'remote', status: 'rejected', created: T(7, 40, -9), date: T(0, 0, -9), reason: 'Report writing from home', decidedBy: 'Salim Al Hinai', decidedAt: T(13, 10, -9), note: 'Field visits require check-in at the site.' },
      { id: 'REQ-5112', empId: '104582', type: 'short', status: 'pending', created: T(16, 10, -1), date: T(0, 0, 2), hours: 2, from: '10:00', to: '12:00', reason: 'Bank appointment for housing loan' });
    const N = (id, to, from, kind, time, title, titleAr, text, textAr, link) => db.notifications.push({ id, to, from, kind, time, title, titleAr, text, textAr, link });
    N('NS1', '104582', 'manager', 'task', T(7, 5), 'New task assigned', 'مهمة جديدة', 'Restaurant licence spot check – Darsait. Due today at 12:30 PM.', 'فحص مفاجئ لترخيص مطعم – دارسيت. الموعد اليوم ١٢:٣٠ م.', 'task:TSK-2295');
    N('NS2', 'all', 'system', 'reminder', T(7, 15), 'Shift reminder', 'تذكير بالوردية', 'Your Morning shift starts at 07:30. Check in when you reach Muttrah Municipal Office.', 'تبدأ ورديتك الصباحية الساعة ٠٧:٣٠. سجّل حضورك عند وصولك إلى مكتب بلدية مطرح.', 'attend');
    N('NS3', 'all', 'manager', 'announcement', T(6, 30), 'Safety briefing at 07:30', 'إحاطة السلامة الساعة ٠٧:٣٠', 'All Health Inspection staff: short safety briefing at Muttrah office before field visits.', 'جميع موظفي التفتيش الصحي: إحاطة سلامة قصيرة في مكتب مطرح قبل الزيارات الميدانية.');
    N('NS4', '104582', 'hr', 'request', T(11, 20, -1), 'Leave request with HR', 'طلب الإجازة لدى الموارد البشرية', 'Your annual leave (18–20 Nov) was endorsed by your supervisor and is now with HR for final approval.', 'تمت تزكية إجازتك السنوية (١٨–٢٠ نوفمبر) من المشرف وهي الآن لدى الموارد البشرية للاعتماد النهائي.', 'requests');
    N('NS5', 'all', 'hr', 'announcement', T(9, 0, -3), 'October payslip available', 'كشف راتب أكتوبر متاح', 'Your October payslip is now available in Oracle HRMS self-service.', 'كشف راتب شهر أكتوبر متاح الآن في الخدمة الذاتية لنظام الموارد البشرية.');
    N('NS6', '104582', 'manager', 'approved', T(9, 40, -4), 'Short permission approved', 'تمت الموافقة على الاستئذان', 'Your 2-hour short permission on ' + dstr(at(0, 0, -4)) + ' was approved by Salim Al Hinai.', 'تمت الموافقة على استئذانك لمدة ساعتين من سالم الهنائي.', 'requests');
    N('NS7', 'all', 'hr', 'announcement', T(10, 0, -5), 'Update your emergency contact', 'حدّث جهة الاتصال للطوارئ', 'Please confirm your emergency contact details in HRMS by 15 Nov.', 'يرجى تأكيد بيانات جهة الاتصال للطوارئ في نظام الموارد البشرية قبل ١٥ نوفمبر.');
    N('NS8', '104582', 'manager', 'rejected', T(13, 10, -9), 'Remote work request rejected', 'تم رفض طلب العمل عن بعد', 'Remote work on ' + dstr(at(0, 0, -9)) + ' was rejected: field visits require check-in at the site.', 'تم رفض طلب العمل عن بعد: الزيارات الميدانية تتطلب تسجيل الحضور في الموقع.', 'requests');
    N('NS9', '104582', 'hr', 'approved', T(12, 0, SICK + 1), 'Sick leave approved', 'تمت الموافقة على الإجازة المرضية', 'Your sick leave on ' + dstr(at(0, 0, SICK)) + ' was approved. Medical certificate received.', 'تمت الموافقة على إجازتك المرضية واستلام الشهادة الطبية.', 'requests');
    N('NS10', '104582', 'manager', 'returned', T(9, 15, NO_OUT + 1), 'Time entry returned', 'تمت إعادة سجل الوقت', 'Your time entry for ' + dstr(at(0, 0, NO_OUT)) + ' was returned: check-out is missing. Submit a missed-punch correction.', 'أُعيد سجل وقتك ليوم ' + dstr(at(0, 0, NO_OUT)) + ': لا يوجد تسجيل انصراف. قدّم طلب تصحيح.', 'pending');
    N('NS11', '104582', 'manager', 'approved', T(9, 20, -4), 'Time entries approved', 'تمت الموافقة على سجلات الوقت', 'Your time entries up to ' + dstr(at(0, 0, -4)) + ' were approved and sent to payroll.', 'تمت الموافقة على سجلات وقتك حتى ' + dstr(at(0, 0, -4)) + ' وأُرسلت للرواتب.', 'pending');
    // locks: current month open, previous two payroll-complete
    const d0 = new Date(now());
    for (let i = 0; i < 3; i++) {
      const dd = new Date(d0.getFullYear(), d0.getMonth() - i, 1);
      db.locks[dd.getFullYear() + '-' + pad(dd.getMonth() + 1)] = i === 0 ? 'open' : 'payroll';
    }
    return db;
  }
  /* Sample workforce: every count on every screen is derived from these records */
  function genWorkforce(db, emp) {
    let s = 7; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
    const pick = a => a[Math.floor(rnd() * a.length)];
    const MF = [['Mohammed', 'محمد'], ['Abdullah', 'عبدالله'], ['Saif', 'سيف'], ['Hamood', 'حمود'], ['Sultan', 'سلطان'], ['Faisal', 'فيصل'], ['Majid', 'ماجد'], ['Talal', 'طلال'], ['Hilal', 'هلال'], ['Badr', 'بدر'], ['Ali', 'علي'], ['Juma', 'جمعة'], ['Mazin', 'مازن'], ['Khamis', 'خميس'], ['Younis', 'يونس'], ['Hamed', 'حامد'], ['Waleed', 'وليد'], ['Ibrahim', 'إبراهيم']];
    const FF = [['Shamsa', 'شمسة'], ['Huda', 'هدى'], ['Asma', 'أسماء'], ['Muna', 'منى'], ['Noora', 'نورة'], ['Laila', 'ليلى'], ['Rahma', 'رحمة'], ['Zakiya', 'زكية'], ['Amal', 'أمل'], ['Badriya', 'بدرية']];
    const LN = [['Al Maskari', 'المسكري'], ['Al Harthy', 'الحارثي'], ['Al Abri', 'العبري'], ['Al Ghafri', 'الغافري'], ['Al Shukaili', 'الشكيلي'], ['Al Wahaibi', 'الوهيبي'], ['Al Mamari', 'المعمري'], ['Al Farsi', 'الفارسي'], ['Al Lawati', 'اللواتي'], ['Al Jabri', 'الجابري'], ['Al Nabhani', 'النبهاني'], ['Al Hosni', 'الحوسني'], ['Al Toobi', 'الطوبي'], ['Al Amri', 'العامري'], ['Al Kharusi', 'الخروصي'], ['Al Zadjali', 'الزدجالي']];
    const DEPTS = [['Field Operations', 'Field Inspector', 'مفتش ميداني', 1], ['Cleaning Services', 'Cleaning Staff', 'عامل نظافة', 1], ['Maintenance', 'Technician', 'فني', 1], ['Inspection', 'Inspector', 'مفتش', 1], ['Waste Management', 'Operator', 'مشغل', 1], ['Health Inspection', 'Health Inspector', 'مفتش صحي', 1], ['Road Maintenance', 'Road Crew', 'عامل طرق', 1], ['Administration', 'Administrative Officer', 'موظف إداري', 0], ['Licensing', 'Licensing Officer', 'موظف تراخيص', 0], ['Human Resources', 'HR Officer', 'موظف موارد بشرية', 0], ['Engineering', 'Engineer', 'مهندس', 0]];
    const SITES = [['muttrah', 'Muttrah'], ['bousher', 'Bousher'], ['seeb', 'Seeb'], ['khuwair', 'Bousher'], ['qurayat', 'Qurayat'], ['headoffice', 'Muscat']];
    const d0 = at(0, 0);
    const TARGET = 2000; // workforce size from the proposal (2,000+ staff)
    const FIELD_D = DEPTS.filter(x => x[3]), OFFICE_D = DEPTS.filter(x => !x[3]);
    const toAdd = TARGET - db.employees.length;
    for (let i = 0; i < toAdd; i++) {
      const f = rnd() < .22; const fn = pick(f ? FF : MF), ln = pick(LN), dp = rnd() < .55 ? pick(FIELD_D) : pick(OFFICE_D);
      const site = dp[3] ? pick(SITES.slice(0, 5)) : (rnd() < .7 ? SITES[5] : pick(SITES));
      const id = String(110000 + i * 7);
      const r = rnd(); const status = r < .03 ? 'inactive' : r < .07 ? 'leave' : 'active';
      const e = emp(id, fn[0] + ' ' + ln[0], fn[1] + ' ' + ln[1], dp[1], dp[2], site[1], dp[0], site[0], 'DEV-' + id.slice(2) + '-A' + (i % 9 + 10), Object.assign({ field: !!dp[3], status, gender: f ? 'F' : 'M' }));
      e.email = (fn[0] + '.' + ln[0].replace('Al ', '')).toLowerCase() + (i % 5 ? '' : i) + '@muscat.gov.om';
      db.employees.push(e);
      if (status !== 'active') continue;
      if (rnd() < .06) continue; // absent today (no punch)
      const late = rnd() < .07; const mins = late ? 7 * 60 + 49 + Math.floor(rnd() * 6) - 30 : 6 * 60 + 25 + Math.floor(rnd() * 60);
      const tm = d0 + Math.min(mins, 7 * 60 + 26) * 60000;
      db.punches.push({ id: 'P' + id, empId: id, type: 'IN', time: tm, siteId: site[0], status: 'accepted', acc: 4 + Math.floor(rnd() * 12), late: late ? 18 + Math.floor(rnd() * 20) : 0, geo: 'inside' });
      if (dp[3] && !db.crew[id]) {
        const sc = siteCenter(db.sites.find(x => x.id === site[0]));
        db.crew[id] = { lat: sc.lat + (rnd() - .5) * .03, lng: sc.lng + (rnd() - .5) * .04, status: rnd() < .8 ? 'onsite' : 'ontheway', time: tm + Math.floor(rnd() * 20) * 60000 };
      }
    }
    // ---- today's field tasks, assigned to field staff who are on shift ----
    const TT = {
      'Field Operations': ['Inspection', [['Site inspection', 'تفتيش موقع'], ['Encroachment check', 'فحص تعديات'], ['Permit verification', 'التحقق من التصاريح']]],
      'Cleaning Services': ['Street Cleaning', [['Street cleaning', 'تنظيف الشوارع'], ['Public area cleaning', 'تنظيف المرافق العامة'], ['Beach cleanup', 'تنظيف الشاطئ']]],
      'Maintenance': ['Maintenance', [['Facility inspection', 'تفتيش المرافق'], ['Streetlight repair', 'إصلاح الإنارة'], ['Park equipment repair', 'إصلاح معدات الحدائق']]],
      'Inspection': ['Inspection', [['Shop inspection', 'تفتيش المحلات'], ['Building safety check', 'فحص سلامة المباني'], ['Market inspection', 'تفتيش السوق']]],
      'Waste Management': ['Waste Management', [['Waste collection', 'جمع النفايات'], ['Bin replacement', 'استبدال الحاويات'], ['Bulk waste pickup', 'جمع النفايات الكبيرة']]],
      'Health Inspection': ['Inspection', [['Food outlet inspection', 'تفتيش منفذ أغذية'], ['Bakery hygiene check', 'فحص نظافة مخبز'], ['Restaurant licence check', 'فحص ترخيص مطعم']]],
      'Road Maintenance': ['Maintenance', [['Pothole repair', 'إصلاح الحفر'], ['Road marking', 'تخطيط الطرق'], ['Drainage check', 'فحص المصارف']]],
    };
    const PLACES = { Muttrah: [['Ruwi', 'روي'], ['Darsait', 'دارسيت'], ['Wadi Kabir', 'وادي الكبير'], ['Muttrah Corniche', 'كورنيش مطرح']], Bousher: [['Al Khuwair', 'الخوير'], ['Al Ghubrah', 'الغبرة'], ['Qurum', 'القرم'], ['Azaiba', 'العذيبة']], Seeb: [['Al Mawaleh', 'الموالح'], ['Al Hail', 'الحيل'], ['Seeb Souq', 'سوق السيب'], ['Al Khoud', 'الخوض']], Qurayat: [['Qurayat Souq', 'سوق قريات'], ['Dhabab', 'ضباب']], Muscat: [['Al Khuwair', 'الخوير'], ['Ruwi', 'روي']] };
    const fieldOn = db.employees.filter(e => e.field && e.status === 'active' && db.crew[e.id] && db.punches.some(p => p.empId === e.id)).slice(19);
    const ST = [['assigned', .24], ['ontheway', .10], ['onsite', .14], ['inprogress', .24], ['delayed', .05], ['done', .09], ['signed', .14]];
    const CREW_ST = { ontheway: 'ontheway', onsite: 'onsite', inprogress: 'onsite', delayed: 'delayed' };
    for (let i = 0; i < 160 && i < fieldOn.length; i++) {
      const e = fieldOn[Math.floor(i * fieldOn.length / 160)]; const tt = TT[e.dept] || TT['Field Operations']; const ti = pick(tt[1]);
      const pl = pick(PLACES[e.wilayat] || PLACES.Muscat); const sc = siteCenter(db.sites.find(x => x.id === e.siteId));
      let r = rnd(), status = 'assigned'; for (const [s1, w] of ST) { if (r < w) { status = s1; break; } r -= w; }
      const lat = sc.lat + (rnd() - .5) * .04, lng = sc.lng + (rnd() - .5) * .05, start = d0 + (6 * 60 + 30) * 60000;
      const tk = { id: 'TSK-' + (3001 + i), type: tt[0], title: ti[0] + ' – ' + pl[0], titleAr: ti[1] + ' – ' + pl[1], loc: pl[0] + ', ' + e.wilayat, locAr: pl[1], wilayat: e.wilayat, lat, lng, radius: 100, priority: rnd() < .25 ? 'High' : rnd() < .85 ? 'Normal' : 'Low', assignee: e.id, status, due: d0 + (8 * 60 + Math.floor(rnd() * 7 * 60)) * 60000, createdBy: 'Salim Al Hinai', created: start, photos: [], notes: '', history: [['assigned', start]] };
      const arr = start + Math.floor(15 + rnd() * 35) * 60000;
      if (['ontheway', 'onsite', 'inprogress', 'delayed', 'done', 'signed'].includes(status)) tk.history.push(['ontheway', start + 8 * 60000]);
      if (['onsite', 'inprogress', 'done', 'signed'].includes(status)) { tk.arrivedAt = arr; tk.distance = 10 + Math.floor(rnd() * 60); tk.history.push(['onsite', arr]); }
      if (['inprogress', 'done', 'signed'].includes(status)) { tk.history.push(['inprogress', arr + 3 * 60000]); const n = status === 'inprogress' ? Math.floor(rnd() * 3) : 1 + Math.floor(rnd() * 3); for (let k = 0; k < n; k++) tk.photos.push({ id: tk.id + 'p' + k, time: arr + (5 + k * 4) * 60000, lat, lng, sample: 1 + (k % 3) }); }
      if (status === 'delayed') { tk.delayReason = pick(['Vehicle breakdown', 'Waiting for equipment', 'Site closed', 'Owner not available']); tk.history.push(['delayed', start + 20 * 60000]); }
      if (status === 'done' || status === 'signed') { tk.completedAt = arr + 20 * 60000; tk.history.push(['done', tk.completedAt]); }
      if (status === 'signed') { tk.signedBy = 'Salim Al Hinai'; tk.signedAt = tk.completedAt + 5 * 60000; tk.history.push(['signed', tk.signedAt]); }
      db.tasks.push(tk);
      if (CREW_ST[status]) Object.assign(db.crew[e.id], { lat: lat + (status === 'ontheway' ? .006 : .0002), lng, status: CREW_ST[status] });
    }
    // ---- pending requests and today's blocked attempts, in proportion to the workforce ----
    const gen = db.employees.filter(e => e.status === 'active' && +e.id >= 110000);
    const REQS = [['leave', 9], ['missed', 7], ['overtime', 4], ['remote', 3], ['shift', 3]];
    let rq = 5200;
    REQS.forEach(([type, n]) => { for (let k = 0; k < n; k++) {
      const e = gen[Math.floor(rnd() * gen.length)], dd = 1 + Math.floor(rnd() * 12), from = new Date(at(0, 0, dd));
      const fmtD = x => pad(x.getDate()) + ' ' + MON[x.getMonth()] + ' ' + x.getFullYear();
      const r0 = { id: 'REQ-' + (rq++), empId: e.id, type, status: 'pending', created: at(5, Math.floor(rnd() * 59), -Math.floor(rnd() * 3)) };
      if (type === 'leave') { const days = 1 + Math.floor(rnd() * 4); Object.assign(r0, { leaveType: pick(['Annual leave', 'Annual leave', 'Sick leave']), from: fmtD(from), to: fmtD(new Date(from.getTime() + (days - 1) * 864e5)), days, reason: 'Personal', balance: 8 + Math.floor(rnd() * 22) }); }
      if (type === 'missed') Object.assign(r0, { date: at(0, 0, -1 - Math.floor(rnd() * 3)), punchType: rnd() < .7 ? 'OUT' : 'IN', time: rnd() < .7 ? '14:3' + Math.floor(rnd() * 9) : '07:2' + Math.floor(rnd() * 9), reason: pick(['Phone battery died at end of shift', 'Forgot to check out after site visit', 'App did not open at the gate']) });
      if (type === 'overtime') Object.assign(r0, { date: at(0, 0, -1 - Math.floor(rnd() * 3)), detail: (1 + Math.floor(rnd() * 2)) + ' h ' + (10 + Math.floor(rnd() * 49)) + ' min · above auto-approve limit', evidence: 'Punches inside fence' });
      if (type === 'remote') Object.assign(r0, { date: at(0, 0, 1 + Math.floor(rnd() * 3)), reason: 'Report preparation at another municipal office' });
      if (type === 'shift') Object.assign(r0, { date: at(0, 0, 1 + Math.floor(rnd() * 5)), detail: pick(['Swap Morning → Evening', 'Swap Evening → Morning', 'Swap Night → Morning']), reason: 'Family commitment' });
      db.requests.push(r0);
    } });
    [['LOC_MOCK', 'Mock-location app active during check-in', 'تطبيق موقع وهمي نشط أثناء تسجيل الحضور', 'blocked'], ['GEO_OUTSIDE', 'Check-in 2.4 km outside assigned geofence', 'تسجيل حضور على بعد ٢٫٤ كم خارج النطاق', 'blocked'], ['GEO_OUTSIDE', 'Check-in 860 m outside assigned geofence', 'تسجيل حضور على بعد ٨٦٠ م خارج النطاق', 'blocked'], ['DEVICE_UNBOUND', 'Login from an unregistered phone', 'تسجيل دخول من هاتف غير مسجل', 'blocked'], ['GPS_LOW_ACC', 'GPS accuracy 54 m (needs under 20 m)', 'دقة الموقع ٥٤ م (المطلوب أقل من ٢٠ م)', 'retry'], ['DEV_MODE', 'Developer mode / USB debugging during check-in', 'وضع المطور مفعّل أثناء التسجيل', 'blocked']].forEach(([code, what, whatAr, decision], k) => {
      db.audit.push({ id: 'AG' + k, time: at(6, 20 + k * 9), empId: gen[Math.floor(rnd() * gen.length)].id, what, whatAr, code, decision, note: decision === 'retry' ? 'retry OK' : undefined, ref: 'FR-' + ymd(now()) + '-' + String(30 + k).padStart(4, '0') });
    });
    db.counters.fr = 41; db.counters.req = rq;
    // previous 6 days: one status letter per employee per day (compact), totals derived from it
    //   P present · L late · A absent · V on leave · O off (not rostered) · I inactive
    db.history = [];
    for (let d = -6; d <= -1; d++) {
      const day = at(0, 0, d), wd = new Date(day).getDay(), weekend = wd === 5 || wd === 6;
      const pAbs = .05 + rnd() * .05, pLate = .04 + rnd() * .04;
      const real = {}; db.punches.forEach(p => { if (p.type === 'IN' && dayStart(p.time) === day) real[p.empId] = p.late ? 'L' : 'P'; });
      let codes = '';
      db.employees.forEach(e => {
        let c;
        if (e.status === 'inactive') c = 'I';
        else if (real[e.id]) c = real[e.id];
        else if (weekend && rnd() < .7) c = 'O';
        else if (e.status === 'leave') c = 'V';
        else { const r = rnd(); c = r < pAbs ? 'A' : r < pAbs + .02 ? 'V' : rnd() < pLate ? 'L' : 'P'; }
        codes += c;
      });
      const n = ch => codes.split(ch).length - 1;
      const present = n('P') + n('L');
      db.history.push({ day, codes, rostered: present + n('A') + n('V'), present, late: n('L'), absent: n('A'), leave: n('V') });
    }
    Object.values(db.sites).forEach(s2 => { s2.staff = db.employees.filter(e => e.siteId === s2.id).length; });
  }
  function task(id, title, titleAr, loc, priority, assignee, status, due, extra) {
    const L = LOC[loc];
    return Object.assign({ id, type: 'Inspection', title, titleAr, loc: L.name, locAr: L.ar, wilayat: L.wil, lat: L.lat, lng: L.lng, radius: 100, priority, assignee, status, due, createdBy: 'Salim Al Hinai', created: at(7, 40), photos: [], notes: '', history: [['assigned', at(7, 40)]] }, extra || {});
  }

  /* ---------------- roster ---------------- */
  function weekStart(ms) { const d = new Date(dayStart(ms)); d.setDate(d.getDate() - d.getDay()); return d.getTime(); } // Sunday
  function weekKey(ws) { return ymd(ws); }
  const ROSTER_TEMPLATE = {
    '104582': 'MMMMMMM', '100124': 'MMOEEOO', '100145': 'MMMOMOO', '100167': 'NNONNOO', '100188': 'MOMMOLL', '100201': 'EEEOEOO', '100234': 'OMMMOOO', '100245': 'MNNOMOO', '100256': 'MOOMMOO',
    '104611': 'EELLEOO', '104637': 'SSSMMOO', '103920': 'NNNOONN', '104205': 'MMMMMOO', '102877': 'EEEE OO',
  };
  const ROSTER_ORDER = ['104582', '100124', '100145', '100167', '100188', '100201', '100234', '100245', '100256', '104611', '104637', '103920', '104205', '102877'];
  function rosterFor(db, ws) {
    const k = weekKey(ws);
    if (!db.roster[k]) {
      const r = {};
      Object.keys(ROSTER_TEMPLATE).forEach(id => { r[id] = ROSTER_TEMPLATE[id].split('').map(c => c === ' ' ? '' : c); });
      return { rows: r, published: false, generated: true };
    }
    return db.roster[k];
  }
  function shiftToday(db, empId) {
    const ws = weekStart(now()); const r = rosterFor(db, ws);
    const row = r.rows[empId]; const code = row ? row[new Date(now()).getDay()] : 'M';
    return code || 'M';
  }

  /* ---------------- store / sync ---------------- */
  function emit() { S.listeners.forEach(f => { try { f(S.db); } catch (e) { console.error(e); } }); }
  function onChange(f) { S.listeners.push(f); }
  function sx(method, url, body, headers) {
    const x = new XMLHttpRequest(); x.open(method, url, false);
    Object.entries(headers || {}).forEach(([k, v]) => x.setRequestHeader(k, v));
    // server not running / not reachable: a clear message instead of a browser network error
    try { x.send(body == null ? null : body); } catch (e) { S.reachable = false; const err = new Error(S.lang === 'ar' ? 'تعذّر الوصول إلى خادم العرض. شغّل Start-Demo.bat (وأبقِ نافذته مفتوحة) ثم حاول مجدداً.' : 'Cannot reach the demo server. Start it with Start-Demo.bat (keep its window open), then try again.'); err.code = 'NO_SERVER'; throw err; }
    return x;
  }
  function pullSync() {
    const x = sx('GET', 'api/db?_=' + Date.now());
    S.ver = +x.getResponseHeader('X-Version') || S.ver;
    S.db = x.status === 200 ? JSON.parse(x.responseText) : null;
  }
  function loadLocal() { try { const s = localStorage.getItem(DBKEY); if (s) return JSON.parse(s); } catch (e) { } return null; }
  function saveLocal() { S.db._v = (S.db._v || 0) + 1; S.ver = S.db._v; localStorage.setItem(DBKEY, JSON.stringify(S.db)); }

  function tx(fn) {
    if (S.mode === 'server') {
      for (let i = 0; i < 6; i++) {
        pullSync();
        if (!S.db) S.db = seed();
        const res = fn(S.db);
        const x = sx('PUT', 'api/db', JSON.stringify(S.db), { 'X-Base-Version': String(S.ver), 'Content-Type': 'application/json' });
        if (x.status === 200) { S.ver = JSON.parse(x.responseText).ver; S.reachable = true; emit(); return res; }
      }
      throw new Error('Could not save – please retry');
    }
    S.db = loadLocal() || seed();
    const res = fn(S.db); saveLocal(); emit(); return res;
  }
  // apply a change to the in-memory copy only (used while the phone is offline)
  function localApply(fn) { const r = fn(S.db); emit(); return r; }

  let polling = false;
  async function poll() {
    if (polling) return; polling = true;
    try { await pollOnce(); } finally { polling = false; }
  }
  async function pollOnce() {
    if (S.paused) return;
    try {
      if (S.mode === 'server') {
        const before = S.ver;
        const r = await fetch('api/ver?_=' + Date.now(), { cache: 'no-store' });
        const { ver } = await r.json(); const wasDown = !S.reachable; S.reachable = true; if (wasDown) emit(); // back online → listeners (e.g. the phone's offline queue) react
        if (ver !== S.ver && S.ver === before) {
          const r2 = await fetch('api/db?_=' + Date.now(), { cache: 'no-store' });
          // on a slow phone connection this download can take seconds: if this device saved something
          // meanwhile (e.g. a check-in), the downloaded copy is older – drop it, the next poll fetches the new one
          if (S.ver !== before) return;
          const body = r2.status === 200 ? await r2.json() : null;
          if (S.ver !== before) return;
          S.ver = +r2.headers.get('X-Version') || ver;
          if (body) { S.db = body; emit(); }
          else if (r2.status === 204) { S.db = seed(); tx(() => { }); }
        }
      } else {
        const d = loadLocal();
        if (!d) { S.db = seed(); saveLocal(); emit(); }
        else if (d._v !== S.ver) { S.db = d; S.ver = d._v; emit(); }
      }
    } catch (e) { S.reachable = false; emit(); }
  }

  async function init(opts) {
    opts = opts || {};
    S.lang = localStorage.getItem('mmsa.lang.' + (opts.app || 'x')) || 'en';
    if (location.protocol.startsWith('http')) {
      try { const r = await fetch('api/ver?_=' + Date.now(), { cache: 'no-store' }); if (r.ok) S.mode = 'server'; } catch (e) { }
    }
    if (S.mode === 'server') { pullSync(); if (!S.db) { S.db = seed(); tx(() => { }); } }
    else { S.db = loadLocal(); if (!S.db) { S.db = seed(); saveLocal(); } else S.ver = S.db._v; }
    // sample data is "today"-relative: refresh it automatically on a new day (or an old schema)
    if (!S.db.schema || S.db.schema < 13 || dayStart(S.db.createdAt || 0) !== dayStart(Date.now())) { reset(); }
    window.addEventListener('storage', e => { if (e.key === DBKEY && S.mode === 'local' && !S.paused) poll(); });
    setInterval(poll, S.mode === 'server' ? 1500 : 1000);
    return S.db;
  }
  function reset() {
    if (S.mode === 'server') { sx('DELETE', 'api/db'); S.db = null; tx(() => { }); }
    const fresh = seed();
    tx(db => { Object.keys(db).forEach(k => delete db[k]); Object.assign(db, fresh); });
  }

  /* ---------------- lookups ---------------- */
  const db = () => S.db;
  const empById = id => S.db.employees.find(e => e.id === id);
  const siteById = id => S.db.sites.find(s => s.id === id);
  const empName = id => { const e = empById(id); if (!e) return (ar() ? 'الموظف ' : 'Employee ') + id; return ar() ? e.nameAr : e.name; };
  const nm = o => (ar() && (o.nameAr || o.ar || o.titleAr)) ? (o.nameAr || o.ar || o.titleAr) : (o.name || o.label || o.title);

  /* ---------------- server rules engine ---------------- */
  function nextRef(db) { db.counters.fr++; return 'FR-' + ymd(now()) + '-' + String(db.counters.fr).padStart(4, '0'); }
  function addAudit(db, a) { db.audit.unshift(Object.assign({ id: uid('A'), time: now() }, a)); }
  function addActivity(db, a) { db.activity.unshift(Object.assign({ id: uid('ACT'), time: now() }, a)); db.activity = db.activity.slice(0, 60); }
  function notify(db, to, text, textAr, kind) { db.notifications.push({ id: uid('N'), to, text, textAr, kind: kind || 'info', from: ['approved', 'rejected'].includes(kind) ? 'manager' : 'system', time: now() }); db.notifications = db.notifications.slice(-80); }
  function setCrew(db, empId, pos, status) { if (!pos) return; const c = db.crew[empId] || {}; db.crew[empId] = { lat: pos.lat, lng: pos.lng, status: status || c.status || 'office', time: now() }; }

  /** Evaluate a punch. ev: {empId,type,pos{lat,lng,acc},mock,rooted,devMode,clientTime,deviceId,uuid,time?,offline?} */
  function evalPunch(db, ev) {
    const emp = db.employees.find(e => e.id === ev.empId);
    const site = db.sites.find(s => s.id === emp.siteId);
    const serverTime = ev.time || now();
    const out = distOutside(site, ev.pos);
    const inside = out <= site.buffer;
    const checks = [
      { k: 'geo', ok: inside, detail: inside ? { en: 'Inside ' + site.name, ar: 'داخل ' + site.nameAr } : { en: fmtDistEn(out) + ' from site boundary', ar: fmtDistAr(out) + ' من حدود الموقع' } },
      { k: 'mock', ok: !ev.mock, detail: ev.mock ? { en: 'Fake-GPS app detected on device', ar: 'تم اكتشاف تطبيق موقع وهمي على الجهاز' } : { en: 'Location from GPS chipset', ar: 'الموقع من شريحة GPS' } },
      { k: 'acc', ok: accOk(site, ev.pos), warn: true, detail: ev.pos.acc > site.minAcc && accOk(site, ev.pos) ? { en: 'Current reading ' + Math.round(ev.pos.acc) + ' m · whole accuracy circle inside the zone', ar: 'القراءة الحالية ' + Math.round(ev.pos.acc) + ' م · دائرة الدقة كلها داخل النطاق' } : { en: 'Current reading ' + Math.round(ev.pos.acc) + ' m', ar: 'القراءة الحالية ' + Math.round(ev.pos.acc) + ' م' } },
      { k: 'integrity', ok: !ev.rooted && !ev.devMode, detail: ev.rooted ? { en: 'Rooted / jailbroken device', ar: 'جهاز مكسور الحماية' } : ev.devMode ? { en: 'Developer mode / USB debugging on', ar: 'وضع المطور مفعّل' } : { en: 'Not rooted · developer mode off', ar: 'غير مكسور الحماية · وضع المطور مغلق' } },
      { k: 'time', ok: true, detail: { en: 'Phone clock not used', ar: 'لا يتم استخدام ساعة الهاتف' } },
    ];
    const failed = checks.filter(c => !c.ok);
    const skewMin = ev.clientTime ? Math.round((ev.clientTime - serverTime) / 60000) : 0;
    const res = { checks, serverTime, site, outside: out, inside, type: ev.type };
    const empLabel = emp.name;
    if (failed.length) {
      const code = !checks[1].ok ? 'LOC_MOCK' : !checks[0].ok ? 'GEO_OUTSIDE' : !checks[3].ok ? (ev.rooted ? 'DEVICE_ROOTED' : 'DEV_MODE') : 'GPS_LOW_ACC';
      const what = {
        LOC_MOCK: ['Mock-location app active during check-in', 'تطبيق موقع وهمي نشط أثناء تسجيل الحضور'],
        GEO_OUTSIDE: [(ev.type === 'OUT' ? 'Check-out ' : 'Check-in ') + fmtDistEn(out) + ' outside ' + site.name.replace(' Municipal Office', '') + ' geofence', (ev.type === 'OUT' ? 'تسجيل انصراف' : 'تسجيل حضور') + ' على بعد ' + fmtDistAr(out) + ' خارج نطاق ' + site.nameAr],
        DEVICE_ROOTED: ['Check-in from a rooted / jailbroken phone', 'محاولة من هاتف مكسور الحماية'],
        DEV_MODE: ['Developer mode / USB debugging during check-in', 'وضع المطور مفعّل أثناء التسجيل'],
        GPS_LOW_ACC: ['GPS accuracy ' + Math.round(ev.pos.acc) + ' m (needs under ' + site.minAcc + ' m)', 'دقة الموقع ' + Math.round(ev.pos.acc) + ' م (المطلوب أقل من ' + site.minAcc + ' م)'],
      }[code];
      res.ok = false; res.code = code; res.ref = nextRef(db); res.failed = failed.length;
      addAudit(db, { time: serverTime, empId: ev.empId, what: what[0], whatAr: what[1], code, decision: code === 'GPS_LOW_ACC' ? 'rejected' : 'blocked', ref: res.ref, offline: !!ev.offline, device: ev.deviceId, pos: ev.pos });
      notify(db, 'supervisor', 'Blocked check-in: ' + empLabel + ' (' + code + ')', 'محاولة محظورة: ' + emp.nameAr, 'fraud');
      return res;
    }
    // accepted
    const shiftCode = shiftToday(db, ev.empId);
    const sh = db.shifts[shiftCode] || db.shifts.M;
    let late = 0;
    if (ev.type === 'IN' && sh.from && /^\d\d:\d\d$/.test(sh.from)) {
      const [h, m] = sh.from.split(':').map(Number);
      const start = new Date(serverTime); start.setHours(h, m, 0, 0);
      const diff = Math.round((serverTime - start.getTime()) / 60000);
      if (diff > db.rules.grace) late = diff;
    }
    const p = { id: uid('P'), uuid: ev.uuid, empId: ev.empId, type: ev.type, time: serverTime, siteId: site.id, status: 'accepted', acc: ev.pos.acc, late, offline: !!ev.offline, device: ev.deviceId, pos: { lat: ev.pos.lat, lng: ev.pos.lng }, dist: Math.round(haversine(ev.pos, siteCenter(site))) };
    if (ev.photo) p.photo = Object.assign({}, ev.photo, { time: ev.photo.time || serverTime });
    if (ev.offline && ev.queuedFor > 4 * 3600e3) { p.flag = 'LONG_OFFLINE'; }
    db.punches.push(p);
    if (Math.abs(skewMin) >= 2) addAudit(db, { time: serverTime, empId: ev.empId, what: 'Phone clock ' + Math.abs(skewMin) + ' min ' + (skewMin > 0 ? 'ahead of' : 'behind') + ' server', whatAr: 'ساعة الهاتف ' + (skewMin > 0 ? 'متقدمة ' : 'متأخرة ') + Math.abs(skewMin) + ' دقيقة عن الخادم', code: 'TIME_SKEW', decision: 'accepted' });
    setCrew(db, ev.empId, ev.pos, ev.type === 'IN' ? 'office' : 'off');
    addActivity(db, { empId: ev.empId, text: (ev.type === 'IN' ? 'Checked in at ' : 'Checked out at ') + site.name + (ev.offline ? ' (offline, synced)' : ''), kind: 'punch' });
    if (ev.type === 'OUT') { db.tsApprovals = db.tsApprovals || {}; const k = ev.empId + '|' + ymd(serverTime); if (!db.tsApprovals[k] || db.tsApprovals[k].status === 'open') db.tsApprovals[k] = { status: 'pending', submittedAt: serverTime }; }
    res.ok = true; res.punch = p; res.late = late; res.shift = sh;
    return res;
  }
  function fmtDistEn(m) { return m >= 100000 ? Math.round(m / 1000).toLocaleString('en-US') + ' km' : m >= 1000 ? (m / 1000).toFixed(1) + ' km' : Math.round(m) + ' m'; }
  function fmtDistAr(m) { return m >= 100000 ? Math.round(m / 1000) + ' كم' : m >= 1000 ? (m / 1000).toFixed(1) + ' كم' : Math.round(m) + ' م'; }

  const TASK_FLOW = ['assigned', 'ontheway', 'onsite', 'inprogress', 'done'];
  /** Apply a task action. a: {taskId, action, pos, mock, photo, notes, reason, uuid, time, offline} */
  function evalTask(db, a) {
    const tk = db.tasks.find(x => x.id === a.taskId); if (!tk) return { ok: false, error: 'Task not found' };
    const time = a.time || now();
    const dist = a.pos ? haversine(a.pos, { lat: tk.lat, lng: tk.lng }) : null;
    // task order: one task at a time, in order. An earlier task that has not been started is skipped (not blocking)
    // when the employee is not at its location – they can move on to the next task and come back to it later.
    let skipped = [];
    if (a.action === 'begin' || a.action === 'arrive' || a.action === 'accept') {
      const busy = db.tasks.find(x => x.assignee === tk.assignee && x.id !== tk.id && ['onsite', 'inprogress', 'delayed'].includes(x.status));
      if (busy) return { ok: false, code: 'TASK_BUSY', prev: busy, task: tk };
      const earlier = db.tasks.filter(x => x.assignee === tk.assignee && x.id !== tk.id && dayStart(x.due) === dayStart(tk.due) && (x.due < tk.due || (x.due === tk.due && x.id < tk.id)) && !['done', 'signed'].includes(x.status))
        .sort((p, q) => p.due - q.due);
      const goodFix = a.pos && !a.pos.nofix && !a.mock;
      const prev = goodFix ? earlier.find(x => haversine(a.pos, { lat: x.lat, lng: x.lng }) <= x.radius) : earlier[0];
      if (prev) return { ok: false, code: 'TASK_ORDER', prev, task: tk };
      skipped = earlier;
    }
    const needsSite = ['arrive', 'begin', 'complete', 'photo'].includes(a.action);
    // starting a job is never allowed without a trustworthy location fix
    if ((a.action === 'begin' || a.action === 'arrive') && (!a.pos || a.pos.nofix || a.pos.acc > Math.max(tk.radius, 50))) {
      const ref = nextRef(db), acc = a.pos && !a.pos.nofix ? Math.round(a.pos.acc) : null;
      addAudit(db, { time, empId: tk.assignee, what: (acc ? 'Task start refused – GPS accuracy ±' + acc + ' m · ' : 'Task start refused – no GPS fix · ') + tk.id, whatAr: (acc ? 'رفض بدء المهمة – دقة GPS ±' + acc + ' م · ' : 'رفض بدء المهمة – لا يوجد موقع · ') + tk.id, code: 'GPS_LOW_ACC', decision: 'blocked', ref });
      return { ok: false, code: 'GPS_LOW_ACC', acc, ref, task: tk };
    }
    if (needsSite && a.pos && (dist > tk.radius || a.mock)) {
      const code = a.mock ? 'LOC_MOCK' : 'TASK_OUTSIDE';
      const ref = nextRef(db);
      addAudit(db, { time, empId: tk.assignee, what: (a.mock ? 'Mock location on task update ' : 'Task update from ' + fmtDistEn(dist) + ' away · ') + tk.id, whatAr: (a.mock ? 'موقع وهمي عند تحديث المهمة ' : 'تحديث مهمة من مسافة ' + fmtDistAr(dist) + ' · ') + tk.id, code, decision: 'blocked', ref });
      return { ok: false, code, dist, ref, task: tk };
    }
    const hist = s => tk.history.push([s, time]);
    switch (a.action) {
      case 'accept': tk.status = 'ontheway'; hist('ontheway'); tk.eta = 15; setCrew(db, tk.assignee, a.pos, 'ontheway'); break;
      case 'arrive': tk.status = 'onsite'; tk.arrivedAt = time; tk.distance = Math.round(dist || 0); hist('onsite'); setCrew(db, tk.assignee, a.pos, 'onsite'); break;
      case 'start': tk.status = 'inprogress'; hist('inprogress'); tk.supNote = tk.returned ? tk.supNote : ''; break;
      // one step on the phone: "I'm at the site – start task" = arrived inside the task site + work started
      case 'begin': if (!tk.arrivedAt || !['onsite', 'inprogress', 'delayed'].includes(tk.status)) { tk.arrivedAt = time; tk.distance = Math.round(dist || 0); hist('onsite'); } tk.status = 'inprogress'; hist('inprogress'); tk.supNote = tk.returned ? tk.supNote : ''; setCrew(db, tk.assignee, a.pos, 'onsite');
        skipped.forEach(x => { const d2 = a.pos ? haversine(a.pos, { lat: x.lat, lng: x.lng }) : 0; x.skippedAt = time; addAudit(db, { time, empId: tk.assignee, what: x.id + ' skipped for now – employee ' + fmtDistEn(d2) + ' from its location · started ' + tk.id + ' instead', whatAr: 'تم تخطي ' + x.id + ' مؤقتاً – الموظف على بعد ' + fmtDistAr(d2) + ' من موقعها · بدأ ' + tk.id, code: 'TASK_SKIPPED', decision: 'accepted' }); });
        break;
      case 'photo': tk.photos.push(Object.assign({ id: uid('PH'), time }, a.photo)); if (tk.status === 'onsite') { tk.status = 'inprogress'; hist('inprogress'); } break;
      case 'notes': tk.notes = a.notes; break;
      case 'delay': if (a.notes != null) tk.notes = a.notes; tk.status = 'delayed'; tk.delayReason = a.reason; hist('delayed'); setCrew(db, tk.assignee, a.pos, 'delayed');
        notify(db, 'supervisor', tk.id + ' delayed: ' + a.reason, tk.id + ' متأخرة: ' + a.reason, 'task'); break;
      case 'resume': tk.status = 'inprogress'; hist('inprogress'); setCrew(db, tk.assignee, a.pos, 'onsite'); break;
      case 'complete': if (a.notes != null) tk.notes = a.notes; tk.status = 'done'; tk.completedAt = time; tk.returned = false; hist('done'); setCrew(db, tk.assignee, a.pos, 'office');
        notify(db, 'supervisor', tk.id + ' completed – awaiting your sign-off', tk.id + ' مكتملة – بانتظار اعتمادك', 'task'); break;
    }
    const words = { accept: 'accepted, on the way', arrive: 'on-site check-in (' + Math.round(dist || 0) + ' m from site)', begin: 'arrived and started at site (' + Math.round(dist || 0) + ' m from site)', start: 'work started', photo: 'geo-tagged photo added', notes: 'site notes updated', delay: 'marked delayed – ' + (a.reason || ''), resume: 'work resumed', complete: 'completed & checked out – awaiting sign-off' };
    addActivity(db, { empId: tk.assignee, text: tk.id + ' · ' + (words[a.action] || a.action) + (a.offline ? ' (offline, synced)' : ''), kind: 'task' });
    return { ok: true, task: tk, dist };
  }

  /* ---------------- i18n ---------------- */
  const AR = {
    // common
    'today': 'اليوم', 'yesterday': 'أمس', 'km': 'كم', 'm': 'م', 'min': 'د', 'Back': 'رجوع', 'Cancel': 'إلغاء', 'Save': 'حفظ', 'Close': 'إغلاق', 'Submit': 'إرسال',
    'Approve': 'اعتماد', 'Reject': 'رفض', 'Return': 'إرجاع', 'Approved': 'معتمد', 'Rejected': 'مرفوض', 'Pending': 'قيد الانتظار', 'Returned': 'مُعاد',
    'POC · Sample data': 'نموذج أولي · بيانات تجريبية', 'Smart Attendance': 'الحضور الذكي', 'Muscat Municipality': 'بلدية مسقط',
    'High': 'عالية', 'Normal': 'عادية', 'Low': 'منخفضة',
    // login
    'Attendance & Field Operations': 'الحضور والعمليات الميدانية', 'Prepared for Muscat Municipality': 'مُعد لبلدية مسقط',
    'Employee ID or AD username': 'الرقم الوظيفي أو اسم المستخدم', 'Password': 'كلمة المرور', 'Sign in': 'تسجيل الدخول', 'or': 'أو',
    'Sign in with Face ID': 'الدخول عبر بصمة الوجه', 'Registered device': 'جهاز مسجل', 'Integrity check passed': 'اجتياز فحص السلامة', 'Encrypted (TLS 1.3)': 'مشفر (TLS 1.3)',
    'This account works only on this registered phone. Lost or changed your phone? Ask HR to reset your device.': 'هذا الحساب يعمل فقط على هذا الهاتف المسجل. فقدت هاتفك أو غيرته؟ اطلب من الموارد البشرية إعادة تعيين جهازك.',
    'Look at your phone': 'انظر إلى هاتفك', 'Face ID verified': 'تم التحقق من الوجه',
    'Sign-in blocked': 'تم حظر الدخول', 'This phone is not registered to employee': 'هذا الهاتف غير مسجل للموظف',
    'Account disabled in Active Directory': 'الحساب معطل في الدليل النشط', 'Unknown employee ID': 'رقم وظيفي غير معروف',
    'Unregistered phone': 'هاتف غير مسجل',
    // home
    'Good morning': 'صباح الخير', 'Good afternoon': 'مساء الخير', 'Good evening': 'مساء الخير',
    'Inside geofence': 'داخل النطاق', 'Outside geofence': 'خارج النطاق', 'GPS accuracy': 'دقة الموقع', 'Server time': 'وقت الخادم', 'Device verified': 'الجهاز موثّق', 'Device check failed': 'فشل فحص الجهاز',
    "TODAY'S SHIFT": 'وردية اليوم', 'Grace period': 'فترة السماح', 'On time': 'في الموعد', 'Late': 'متأخر', 'Checked in': 'تم تسجيل الحضور', 'Day off': 'يوم راحة', 'Shift ended': 'انتهت الوردية',
    'Check In': 'تسجيل الحضور', 'Check Out': 'تسجيل الانصراف', 'Last punch': 'آخر بصمة', 'Check-in': 'حضور', 'Check-out': 'انصراف',
    'My tasks': 'مهامي', 'Requests': 'الطلبات', 'History': 'السجل', 'Home': 'الرئيسية', 'Tasks': 'المهام',
    'Dashed tiles are added from the server — no app update needed': 'الخدمات المنقطة تضاف من الخادم — دون تحديث التطبيق',
    'Verifying…': 'جارٍ التحقق…', 'Online': 'متصل', 'Offline': 'غير متصل', 'queued': 'في الانتظار', 'synced': 'تمت المزامنة',
    'Checked in successfully': 'تم تسجيل الحضور بنجاح', 'Checked out successfully': 'تم تسجيل الانصراف بنجاح', 'Recorded with server time': 'سُجل بوقت الخادم',
    'Saved offline': 'حُفظ دون اتصال', 'Will sync automatically when the signal returns. The server re-checks it.': 'ستتم المزامنة تلقائياً عند عودة الإشارة، ويعيد الخادم التحقق منها.',
    'Done': 'تم', 'Phase 2 service': 'خدمة المرحلة الثانية', 'This service is switched on from the server. It will be delivered in Phase 2.': 'هذه الخدمة مفعلة من الخادم وسيتم تسليمها في المرحلة الثانية.',
    // blocked
    'Check in': 'تسجيل الحضور', 'Check-in blocked': 'تم حظر تسجيل الحضور', 'SECURITY CHECKS': 'فحوصات الأمان',
    'Location inside geofence': 'الموقع داخل النطاق', 'Real GPS (no mock location)': 'موقع حقيقي (بدون موقع وهمي)', 'GPS accuracy under': 'دقة الموقع أقل من', 'Device integrity': 'سلامة الجهاز', 'Server time (NTP)': 'وقت الخادم (NTP)',
    'This attempt was recorded (ref': 'تم تسجيل هذه المحاولة (المرجع', ') and sent to your supervisor for review.': ') وإرسالها إلى مشرفك للمراجعة.',
    'Retry location': 'إعادة تحديد الموقع', 'Request remote work': 'طلب عمل عن بُعد',
    'security checks failed': 'فحوصات أمان فشلت', 'security check failed': 'فحص أمان فشل', 'You are': 'أنت على بعد', 'outside': 'خارج', 'your work zone': 'نطاق عملك', 'and': 'و',
    // offline
    'Sync status': 'حالة المزامنة', "You're offline": 'أنت غير متصل', "You're online": 'أنت متصل', 'Keep working as normal.': 'واصل العمل كالمعتاد.',
    'actions are saved securely on this phone and will sync automatically when the signal returns.': 'إجراءات محفوظة بأمان على هذا الهاتف وستتم مزامنتها تلقائياً عند عودة الإشارة.',
    'All actions are synced with the server.': 'جميع الإجراءات متزامنة مع الخادم.',
    'WAITING TO SYNC': 'بانتظار المزامنة', 'Queued': 'في الانتظار', 'Nothing waiting — all synced': 'لا يوجد شيء بالانتظار — تمت المزامنة',
    'HOW YOUR DATA IS PROTECTED': 'كيف نحمي بياناتك', 'Encrypted on the phone (AES-256)': 'مشفرة على الهاتف (AES-256)', 'Time taken from last server sync, not the phone clock': 'الوقت مأخوذ من آخر مزامنة مع الخادم وليس من ساعة الهاتف',
    'Each record has a unique ID — never counted twice': 'لكل سجل معرف فريد — لا يُحتسب مرتين', 'Server re-checks geofence and rules on sync': 'الخادم يعيد فحص النطاق والقواعد عند المزامنة',
    'Last successful sync': 'آخر مزامنة ناجحة', 'records': 'سجلات', 'Sync now': 'زامن الآن', 'waiting for network': 'بانتظار الشبكة', 'Syncing…': 'جارٍ المزامنة…',
    'Synced': 'تمت المزامنة', 'server re-checked each one': 'وأعاد الخادم فحص كل سجل', 'duplicate ignored': 'مكرر تم تجاهله', 'blocked on re-check': 'محظور بعد إعادة الفحص',
    'Status update': 'تحديث الحالة', 'photos': 'صور', 'photo': 'صورة', 'evidence': 'إثبات', 'Geo-tagged': 'موسومة جغرافياً',
    // tasks
    'Active': 'النشطة', 'Completed': 'المكتملة', 'assigned by': 'أسندها', 'Due': 'الاستحقاق', 'No tasks here': 'لا توجد مهام هنا',
    'PROGRESS': 'التقدم', 'Assigned': 'مُسندة', 'On the way': 'في الطريق', 'On site': 'في الموقع', 'In progress': 'قيد التنفيذ', 'Delayed': 'متأخرة', 'Awaiting sign-off': 'بانتظار الاعتماد', 'Signed off': 'معتمدة',
    'EVIDENCE': 'الإثباتات', 'Location + time verified': 'الموقع والوقت موثقان', 'Add photo': 'إضافة صورة', 'Site notes': 'ملاحظات الموقع',
    'Mark delayed': 'تأجيل', 'Complete & check out': 'إنهاء وتسجيل المغادرة', 'Accept & start travel': 'قبول وبدء التوجه', 'On-site check-in': 'تسجيل الوصول للموقع', 'Start work': 'بدء العمل', 'Resume work': 'استئناف العمل',
    'Arrived': 'الوصول', 'from site': 'من الموقع', 'inside task zone': 'داخل نطاق المهمة', 'Not arrived yet': 'لم يتم الوصول بعد',
    'Update blocked': 'تم حظر التحديث', 'Task updates are only accepted inside the task site radius': 'تقبل تحديثات المهمة فقط داخل نطاق موقع المهمة',
    'Add at least one photo before closing the task.': 'أضف صورة واحدة على الأقل قبل إغلاق المهمة.',
    'Completed — waiting for supervisor sign-off': 'مكتملة — بانتظار اعتماد المشرف', 'Signed off by': 'اعتمدها', 'Supervisor feedback': 'ملاحظة المشرف',
    'Reason for delay': 'سبب التأخير', 'Vehicle breakdown': 'عطل المركبة', 'Site closed': 'الموقع مغلق', 'Owner not available': 'المالك غير متواجد', 'Waiting for equipment': 'بانتظار المعدات',
    'Take photo': 'التقاط صورة', 'Use sample photo': 'استخدام صورة نموذجية', 'Camera': 'الكاميرا', 'Photos are taken in the app and stamped with time and GPS. Gallery uploads are not allowed.': 'تُلتقط الصور داخل التطبيق وتُختم بالوقت والموقع. لا يُسمح بالرفع من المعرض.',
    'New task assigned': 'مهمة جديدة مسندة', 'ETA': 'الوصول المتوقع',
    // requests
    'New request': 'طلب جديد', 'Leave': 'إجازة', 'Short permission': 'استئذان', 'Remote work': 'عمل عن بُعد', 'Missed punch': 'بصمة فائتة', 'Overtime': 'عمل إضافي',
    'Date': 'التاريخ', 'Missed punch time': 'وقت البصمة الفائتة', 'Reason': 'السبب', 'Attach file': 'إرفاق ملف', 'Goes to': 'يُرسل إلى', 'Supervisor': 'المشرف', 'HR': 'الموارد البشرية',
    'Submit request': 'إرسال الطلب', 'MY RECENT REQUESTS': 'طلباتي الأخيرة', 'From': 'من', 'To': 'إلى', 'Leave type': 'نوع الإجازة', 'Annual leave': 'إجازة سنوية', 'Sick leave': 'إجازة مرضية', 'Emergency leave': 'إجازة طارئة',
    'days': 'أيام', 'h': 'س', 'Request submitted': 'تم إرسال الطلب', 'Your request was approved': 'تمت الموافقة على طلبك', 'Your request was rejected': 'تم رفض طلبك',
    'Punch type': 'نوع البصمة', 'Time': 'الوقت', 'Please enter a reason.': 'يرجى إدخال السبب.',
    // history
    'Punch history': 'سجل البصمات', 'This month': 'هذا الشهر', 'On-time rate': 'نسبة الالتزام', 'Late arrivals': 'حالات التأخير', 'Hours worked': 'ساعات العمل',
    'Sign out': 'تسجيل الخروج', 'corrected': 'مُصحح', 'offline': 'دون اتصال', 'Device': 'الجهاز', 'Notifications': 'الإشعارات',
    // demo controls
    'Demo controls': 'أدوات العرض', 'Location': 'الموقع', 'Inside Muttrah office': 'داخل مكتب مطرح', '1.2 km outside the fence': 'على بعد ١٫٢ كم خارج النطاق', 'At the task site (35 m)': 'في موقع المهمة (٣٥ م)', 'Real device GPS': 'GPS الجهاز الفعلي',
    'Fake-GPS app running': 'تطبيق موقع وهمي يعمل', 'Weak GPS (48 m)': 'إشارة ضعيفة (٤٨ م)', 'Rooted / jailbroken': 'جهاز مكسور الحماية', 'Developer mode on': 'وضع المطور مفعّل', 'Phone clock +47 min': 'ساعة الهاتف +٤٧ د', 'Airplane mode (offline)': 'وضع الطيران (دون اتصال)', 'Unregistered phone (for login demo)': 'هاتف غير مسجل (لعرض الدخول)',
    'Demo clock': 'ساعة العرض', 'Morning scenario (07:28)': 'سيناريو الصباح (٠٧:٢٨)', 'Real time': 'الوقت الفعلي', 'Reset demo data': 'إعادة ضبط البيانات',
  };
  function t(s) { return S.lang === 'ar' ? (AR[s] || s) : s; }
  function addAR(map) { Object.assign(AR, map); }
  function setLang(app, l) { S.lang = l; localStorage.setItem('mmsa.lang.' + app, l); document.documentElement.lang = l; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'; }
  const AD = '٠١٢٣٤٥٦٧٨٩';
  function arabizeDigits(root) {
    if (S.lang !== 'ar') return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => n.parentElement && n.parentElement.closest('.keep-ltr,script,style,textarea') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    let n; while ((n = w.nextNode())) { if (/\d/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/\d/g, d => AD[d]); }
  }

  /* ---------------- icons ---------------- */
  const IC = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
    utensils: '<path d="M5 3v7a2 2 0 0 0 2 2v9"/><path d="M9 3v7a2 2 0 0 1-2 2"/><path d="M7 3v6"/><path d="M17 21V3c-2.2 1.2-3.5 3.6-3.5 7v3H17"/>',
    store: '<path d="M4 9.5V20h16V9.5"/><path d="M3 9.5 4.8 4h14.4L21 9.5c0 1.5-1.2 2.5-2.5 2.5S16 11 16 9.5c0 1.5-1.2 2.5-2.5 2.5h-3C9.2 12 8 11 8 9.5 8 11 6.8 12 5.5 12S3 11 3 9.5Z"/><path d="M9 20v-4.5h6V20"/>',
    clipcheck: '<rect x="4" y="4" width="16" height="17" rx="2.5"/><path d="M9 2.5h6v3H9z"/><path d="m8.5 13 2.4 2.4 4.6-4.6"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="m3 6 1.2 1.2L6.5 5"/><path d="m3 12 1.2 1.2L6.5 11"/><path d="m3 18 1.2 1.2L6.5 17"/>',
    file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    fileplus: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M12 12v6M9 15h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
    logo: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><path d="m9.2 9.2 2 2 3.8-3.8"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
    ban: '<circle cx="12" cy="12" r="8.5"/><path d="m6 6 12 12"/>', alert: '<path d="M12 7v6M12 16.5v.5"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
    car: '<path d="M5 17v-5l2.2-5h9.6l2.2 5v5"/><path d="M3.5 12h17v5h-17z"/><circle cx="7.5" cy="17.5" r="1.6"/><circle cx="16.5" cy="17.5" r="1.6"/>',
    plussq: '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M12 8v8M8 12h8"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    wifioff: '<path d="M3 3l18 18"/><path d="M8.5 16.4a5 5 0 0 1 7 0"/><path d="M5 12.9a10 10 0 0 1 5.2-2.7"/><path d="M14.5 10.4A10 10 0 0 1 19 12.9"/><path d="M2 8.8a15 15 0 0 1 4.2-2.6"/><path d="M10.7 5.1A15 15 0 0 1 22 8.8"/><path d="M12 20h.01"/>',
    wifi: '<path d="M5 12.9a10 10 0 0 1 14 0"/><path d="M8.5 16.4a5 5 0 0 1 7 0"/><path d="M2 8.8a15 15 0 0 1 20 0"/><path d="M12 20h.01"/>',
    back: '<path d="m15 18-6-6 6-6"/>', fwd: '<path d="m9 18 6-6-6-6"/>', down: '<path d="m6 9 6 6 6-6"/>',
    faceid: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M9 9v1.2M15 9v1.2M12.2 9v4h-1"/><path d="M9.2 15.6a4 4 0 0 0 5.6 0"/>',
    shield: '<path d="M12 3 4.5 6v6c0 4.6 3.2 7.8 7.5 9 4.3-1.2 7.5-4.4 7.5-9V6z"/><path d="m9 12 2 2 4-4"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    clip: '<path d="m20.5 11.5-8.2 8.2a5 5 0 0 1-7-7l8.5-8.5a3.4 3.4 0 0 1 4.8 4.8l-8.4 8.4a1.7 1.7 0 0 1-2.4-2.4l7.7-7.7"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.8-3.8L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8 8 0 0 0 14.8 3.8L21 15"/><path d="M21 20v-5h-5"/>',
    logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 17l-5-5 5-5M5 12h11"/>',
    bell: '<path d="M6 9a6 6 0 0 1 12 0c0 6.5 2.5 8 2.5 8h-17S6 15.5 6 9"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>', unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/>',
    calendar: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 13.6a6.5 6.5 0 0 1 3.5 6.4"/>',
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    chart: '<path d="M4 20V11M10 20V5M16 20v-7M21 20H3"/>', grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    send: '<path d="M21 3 10 14"/><path d="M21 3 14.5 21l-4-7-7-4z"/>', info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.5"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>', monitor: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>', plus: '<path d="M12 5v14M5 12h14"/>', edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    play: '<path d="M7 4v16l13-8z"/>', fence: '<path d="M4 20V8l2.5-3L9 8v12M15 20V8l2.5-3L20 8v12M4 11h16M4 16h16"/>', layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    broom: '<path d="M19 3 11 11"/><path d="M11 11c-2-1-5 0-6 3l-2 6c3 0 6-1 8-3 2-2 2-4 0-6z"/><path d="m6 17 2-2"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8"/><path d="M14.5 6.5 9.5 1.5a4 4 0 0 0-5 5l5 5"/>',
    tree: '<path d="M12 22v-6"/><path d="M12 2 6 10h3l-4 6h14l-4-6h3z"/>',
    building: '<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', apps: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    filter: '<path d="M4 5h16l-6 8v6l-4-2v-4z"/>', more: '<circle cx="5" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="19" cy="12" r="1.3"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>', call: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8M8 13h5"/>', leaf: '<path d="M5 19C5 10 10 5 20 4c0 10-5 15-14 15"/><path d="M5 19 13 11"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h4M7 14h7"/><circle cx="16" cy="11" r="1.6"/>',
    route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7"/>',
    columns: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>', clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10l2 2 4-4M9 16h6"/>',
    swap: '<path d="M4 8h14l-3-3M20 16H6l3 3"/>', home2: '<path d="M3 11 12 4l9 7"/><path d="M6 10v10h12V10"/>', layers2: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    target: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>', expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    userx: '<circle cx="10" cy="8" r="4"/><path d="M3 21a7 7 0 0 1 12-5"/><path d="m17 15 4 4M21 15l-4 4"/>', plane: '<path d="M3 13l7-1 4-8h2l-2 8 6 1v2l-6 1 2 6h-2l-4-6-7-1z"/>',
    fingerprint: '<path d="M6.5 6.5a8 8 0 0 1 11 0M4.5 10a8 8 0 0 1 .8-2M19.5 10.5c.5 2.8.2 5.6-.6 8"/><path d="M8 20c1-2.4 1.4-5 1.4-7.6a2.6 2.6 0 0 1 5.2 0c0 1.6-.1 3.2-.4 4.7"/><path d="M12 12.5c0 3-.6 5.8-1.8 8.4M16.8 13c0 1.5-.1 3-.4 4.4"/>',
  };
  function icon(name, size, sw) { return '<svg class="ic" width="' + (size || 20) + '" height="' + (size || 20) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.9) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (IC[name] || '') + '</svg>'; }

  /* ---------------- sample evidence photo (no network needed) ---------------- */
  function samplePhotoSVG(n) {
    const pal = [['#c7d2cc', '#9fb3ad', '#7d958e'], ['#d6d0c4', '#b8ad9a', '#8f8470'], ['#cfd6dd', '#a9b6c2', '#7f8e9c']][(n - 1) % 3];
    return 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><rect width="160" height="120" fill="' + pal[0] + '"/><rect x="18" y="38" width="70" height="62" fill="' + pal[1] + '"/><rect x="96" y="22" width="48" height="78" fill="' + pal[2] + '"/><rect x="28" y="50" width="16" height="14" fill="#eef2f1"/><rect x="56" y="50" width="16" height="14" fill="#eef2f1"/><rect x="104" y="34" width="12" height="12" fill="#eef2f1"/><rect x="124" y="34" width="12" height="12" fill="#eef2f1"/><rect x="0" y="100" width="160" height="20" fill="' + pal[2] + '"/></svg>');
  }

  /* ---------------- file export helpers ---------------- */
  function download(name, content, type) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: type || 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  function toCSV(rows) { return '\ufeff' + rows.map(r => r.map(v => { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(',')).join('\r\n'); }
  function toXLS(title, rows) {
    const h = rows[0], b = rows.slice(1);
    return '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>' + esc(title.slice(0, 30)) + '</x:Name></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table border="1"><tr><th colspan="' + h.length + '" style="font-size:14pt;text-align:left">' + esc(title) + '</th></tr><tr>' + h.map(c => '<th style="background:#0E6F6B;color:#fff">' + esc(c) + '</th>').join('') + '</tr>' + b.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</table></body></html>';
  }
  function printPDF(title, subtitle, rows) {
    const w = window.open('', '_blank'); if (!w) { alert('Allow pop-ups to export PDF'); return; }
    const h = rows[0], b = rows.slice(1);
    w.document.write('<!doctype html><html><head><meta charset="utf-8"><title>' + esc(title) + '</title><style>body{font-family:Inter,Segoe UI,Arial,sans-serif;color:#111827;margin:32px}h1{font-size:20px;margin:0}p{color:#6b7280;margin:4px 0 18px}table{border-collapse:collapse;width:100%;font-size:12px}th{background:#0E6F6B;color:#fff;text-align:left;padding:7px}td{border-bottom:1px solid #e5e7eb;padding:7px}.hd{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0E6F6B;padding-bottom:12px;margin-bottom:16px}.b{font-weight:700;color:#0E6F6B}</style></head><body><div class="hd"><div><h1>' + esc(title) + '</h1><p>' + esc(subtitle) + '</p></div><div class="b">Muscat Municipality · Smart Attendance</div></div><table><tr>' + h.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr>' + b.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</table><p style="margin-top:18px">Generated ' + new Date(now()).toLocaleString('en-GB') + ' · POC sample data</p><script>setTimeout(()=>print(),300)<\/script></body></html>');
    w.document.close();
  }

  window.MM = {
    S, init, tx, localApply, reset, onChange, poll, db, now, dayStart, at, uid, esc, clone, pad, tz,
    fmtTime, fmtTimeS, fmtDate, fmtDateShort, fmtDay, monthName, relDay, ymd, fmtDist, fmtNum, MON, MON_AR,
    toArabicName, accOk, distInside, haversine, distOutside, siteCenter, siteArea, centroid, toXY, fromXY, pointInPoly,
    empById, siteById, empName, nm, evalPunch, evalTask, addAudit, addActivity, notify, setCrew, nextRef, TASK_FLOW, LOC,
    TASK_TYPES, ROSTER_ORDER, weekStart, weekKey, rosterFor, shiftToday, t, addAR, setLang, arabizeDigits, icon, samplePhotoSVG,
    download, toCSV, toXLS, printPDF, get lang() { return S.lang; }, get mode() { return S.mode; },
    setPaused(p) { S.paused = p; },
  };
})();

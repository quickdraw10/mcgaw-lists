/* McGaw Lists — family lists web app (installable on iPhone from Safari) */
'use strict';

const CFG = window.MCGAW_CONFIG || {};
const DEMO = !CFG.supabaseUrl || !CFG.supabaseAnonKey;

/* ============================================================
   Constants
   ============================================================ */
const FAMILY = [
  { id: 'mike',   name: 'Mike',   role_label: 'Dad', colour: '#0A84FF', sort: 1, can_budget: true },
  { id: 'louise', name: 'Louise', role_label: 'Mum', colour: '#FF375F', sort: 2, can_budget: true },
  { id: 'esme',   name: 'Esme',   role_label: null,  colour: '#BF5AF2', sort: 3 },
  { id: 'oscar',  name: 'Oscar',  role_label: null,  colour: '#30D158', sort: 4 },
];

const IC = {
  voice: '<path d="M12 3v18M8 7v10M16 7v10M4 10.5v3M20 10.5v3"/>',
  cart: '<path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L20.5 8H6.2"/><circle cx="10" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.7 2.7L16.2 9.5"/>',
  brief: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
  gift: '<rect x="3.5" y="9" width="17" height="11.5" rx="1.8"/><path d="M2.5 9h19M12 9v11.5M12 9S10.8 4 8.2 4.4C6 4.8 6.8 9 12 9Zm0 0s1.2-5 3.8-4.6C18 4.8 17.2 9 12 9Z"/>',
  bag: '<rect x="5" y="7" width="14" height="13.5" rx="2.5"/><path d="M9.5 7V4.8a1 1 0 0 1 1-.8h3a1 1 0 0 1 1 .8V7M9 11v6M15 11v6M8 20.5v1M16 20.5v1"/>',
  meal: '<path d="M7 3v7a2 2 0 0 0 2 2v9M11 3v7a2 2 0 0 1-2 2M9 3v6M17 21V3c-2.2 1.3-3 4.2-3 7v2.5h3"/>',
  pin: '<path d="M9 4h6l-1 6 3 3H7l3-3-1-6ZM12 13v8"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  chevR: '<path d="m9.5 6 6 6-6 6"/>',
  chevL: '<path d="m14.5 6-6 6 6 6"/>',
  people: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9.5" r="2.5"/><path d="M15.8 14.6c2.4-.4 4.2 1.1 4.7 4.4"/>',
  more: '<circle cx="6" cy="12" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="18" cy="12" r="1.3"/>',
  grip: '<path d="M5 9h14M5 15h14"/>',
  inbox: '<path d="M4 13l2.5-7.5h11L20 13v5.5H4z"/><path d="M4 13h4.5l1 2h5l1-2H20"/>',
  list: '<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2"/><circle cx="4.5" cy="12" r="1.2"/><circle cx="4.5" cy="18" r="1.2"/>',
  person: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20.5c.8-4 3.8-6.3 7.5-6.3s6.7 2.3 7.5 6.3"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15ZM10 20.5a2.2 2.2 0 0 0 4 0"/>',
  house: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1Z"/>',
  flag: '<path d="M5 21V4M5 4.5h11l-2 4 2 4H5"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M5.5 7l1 12.5a1.5 1.5 0 0 0 1.5 1.5h8a1.5 1.5 0 0 0 1.5-1.5l1-12.5M9 7V4.5h6V7"/>',
  cal: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
};
const EYE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
const EYE_OFF = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18M10.6 5.6A10 10 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3.2 3.9M6.6 6.7C3.9 8.5 2.5 12 2.5 12S6 18.5 12 18.5c1.8 0 3.3-.5 4.6-1.2M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
const pwRow = (id, ph, ac) => `<label class="login-row" for="${id}"><input id="${id}" type="password" placeholder="${ph}" autocomplete="${ac}" autocapitalize="off" autocorrect="off" spellcheck="false" required><button type="button" class="eye" data-eye="${id}" aria-label="Show password">${EYE}</button></label>`;
function wireEyes(root = document) {
  root.querySelectorAll('[data-eye]').forEach((b) => {
    if (b.dataset.wired) return;
    b.dataset.wired = '1';
    b.addEventListener('mousedown', (e) => e.preventDefault()); // keep the keyboard up
    b.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    const flip = () => {
      const inp = document.getElementById(b.dataset.eye);
      const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      b.innerHTML = show ? EYE_OFF : EYE;
      b.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    };
    b.addEventListener('touchend', (e) => { e.preventDefault(); flip(); });
    b.addEventListener('click', flip);
  });
}
const icon = (n, s = 22, w = 1.9) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${IC[n]}</svg>`;

const TYPES = {
  shopping:  { name: 'Shopping',        icon: 'cart',  colour: '#30B05A', title: 'Weekly shop',   desc: 'Sorted by aisle. Tick things into the trolley.', sub: false },
  todo:      { name: 'To do',           icon: 'check', colour: '#0A84FF', title: 'To do',         desc: 'Due dates, sub-tasks and who’s doing what.', sub: true },
  work:      { name: 'Work',            icon: 'brief', colour: '#5E5CE6', title: 'Work',          desc: 'Prioritised tasks, sorted your way or by due date.', sub: true },
  christmas: { name: 'Gift list',       icon: 'gift',  colour: '#E0352B', title: 'Christmas 2026', desc: 'Christmas, birthdays, weddings, christenings — ideas by person, budget and secrets.', sub: true },
  packing:   { name: 'Travel packing', icon: 'bag',   colour: '#FF9500', title: 'Travel packing', desc: 'A bag each, how many of each, and a countdown to departure.', sub: true },
  meals:     { name: 'Meal planner',    icon: 'meal',  colour: '#FF375F', title: 'Meal planner',  desc: 'This week’s meals and who’s home for them.', sub: false },
  notice:    { name: 'Notice board',    icon: 'pin',   colour: '#F5B800', title: 'Notice board',  desc: 'Family notes, pinned with “seen by”.', sub: false },
};
const TYPE_ORDER = ['notice', 'meals', 'shopping', 'todo', 'work', 'christmas', 'packing'];
const BRIGHT = ['#0A84FF', '#5E5CE6', '#BF5AF2', '#FF375F', '#E0352B', '#FF9500', '#F5B800', '#30B05A', '#00A5A8', '#8E8E93'];
const PASTEL = ['#A9CBEF', '#C5B6E8', '#E7B8E6', '#F5BCC9', '#F7C1A8', '#FBD9A6', '#F6E7A1', '#BFE3C4', '#A8DDD6', '#D6CFC7'];
const COLOURS = [...BRIGHT, ...PASTEL];
const THEMES = {
  classic:  { name: 'Classic',  accent: '#0A84FF', bgL: '#F2F2F7', bgD: '#000000', cardD: '#1C1C1E' },
  lavender: { name: 'Lavender', accent: '#7C63C9', bgL: '#F3F0FA', bgD: '#100D18', cardD: '#1E1A28' },
  mint:     { name: 'Mint',     accent: '#239A7C', bgL: '#EDF7F3', bgD: '#0A1411', cardD: '#17221E' },
  peach:    { name: 'Peach',    accent: '#D9714A', bgL: '#FCF1EB', bgD: '#170F0B', cardD: '#261C17' },
  blush:    { name: 'Blush',    accent: '#C95482', bgL: '#FBEFF3', bgD: '#170C11', cardD: '#26191F' },
  sky:      { name: 'Sky',      accent: '#3B8FCB', bgL: '#EDF4FA', bgD: '#0A1117', cardD: '#172029' },
  lemon:    { name: 'Lemon',    accent: '#A98410', bgL: '#FAF7E8', bgD: '#14120A', cardD: '#232014' },
  sage:     { name: 'Sage',     accent: '#5E8A5A', bgL: '#F0F4EE', bgD: '#0E130D', cardD: '#1B2219' },
};
function isLight(hex) {
  const h = (hex || '').replace('#', '');
  if (h.length !== 6) return false;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.62;
}
const ink = (c) => (isLight(c) ? 'rgba(0,0,0,.72)' : '#fff');
function swatchHtml(cur, attrs) {
  const one = (c) => `<button class="swatch ${cur === c ? 'on' : ''}" style="--c:${c}" ${attrs} data-c="${c}" aria-label="Colour"></button>`;
  return `<div class="group swatch-group"><div class="swatch-label">Bright</div><div class="swatches">${BRIGHT.map(one).join('')}</div><div class="swatch-label">Pastel</div><div class="swatches">${PASTEL.map(one).join('')}</div></div>`;
}

/* ---------- Appearance (saved on this iPhone) ---------- */
const PREF = 'mcgaw-lists-pref-';
const pref = (k, d) => { try { const v = localStorage.getItem(PREF + k); return v === null ? d : v; } catch { return d; } };
const setPref = (k, v) => { try { if (v === null) localStorage.removeItem(PREF + k); else localStorage.setItem(PREF + k, v); return true; } catch { return false; } };
function applyAppearance() {
  const root = document.documentElement;
  const mode = pref('mode', 'system');
  if (mode === 'system') delete root.dataset.theme; else root.dataset.theme = mode;
  const t = THEMES[pref('theme', 'classic')] || THEMES.classic;
  let st = document.getElementById('theme-style');
  if (!st) { st = document.createElement('style'); st.id = 'theme-style'; document.head.appendChild(st); }
  st.textContent = `:root{--accent:${t.accent};--bg:${t.bgL}}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:${t.bgD};--card:${t.cardD}}}
:root[data-theme="dark"]{--bg:${t.bgD};--card:${t.cardD}}`;
  let bg = document.getElementById('bg');
  const img = pref('bg', null);
  if (img) {
    if (!bg) { bg = document.createElement('div'); bg.id = 'bg'; document.body.prepend(bg); }
    bg.style.backgroundImage = `url("${img}")`;
    bg.style.setProperty('--dim', String(+pref('dim', '55') / 100));
    document.body.classList.add('has-bg');
  } else {
    if (bg) bg.remove();
    document.body.classList.remove('has-bg');
  }
  const dark = mode === 'dark' || (mode === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute('content', dark ? t.bgD : t.bgL));
}
function inkPass(root) {
  root.querySelectorAll('[style*="--c:"]').forEach((el) => { const c = el.style.getPropertyValue('--c').trim(); if (c.startsWith('#')) el.style.setProperty('--ink', ink(c)); });
}
async function setBackground(file) {
  try {
    const url = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const k = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight));
    const cv = document.createElement('canvas');
    cv.width = Math.round(img.naturalWidth * k); cv.height = Math.round(img.naturalHeight * k);
    cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
    URL.revokeObjectURL(url);
    let ok = setPref('bg', cv.toDataURL('image/jpeg', 0.8));
    if (!ok) ok = setPref('bg', cv.toDataURL('image/jpeg', 0.55));
    if (!ok) return toast('That photo is too large — try a smaller one');
    applyAppearance(); render(); toast('Background updated');
  } catch (e) { console.error(e); toast('Couldn’t open that photo — try another'); }
}

const AISLES = ['Fruit & veg', 'Bakery', 'Meat & fish', 'Dairy & eggs', 'Chilled', 'Frozen', 'Food cupboard', 'Drinks', 'Snacks', 'Household', 'Toiletries', 'Other'];
const AISLE_WORDS = {
  'Fruit & veg': 'apple banana orange lemon lime grape berr strawberr raspberr blueberr melon pear peach plum kiwi mango pineapple avocado tomato potato onion garlic carrot broccoli cauli pepper cucumber lettuce salad spinach kale courgette mushroom leek celery herb coriander parsley basil ginger chilli sweetcorn pea bean sprout veg fruit',
  'Bakery': 'bread loaf roll bagel croissant wrap tortilla pitta naan muffin crumpet cake bun brioche',
  'Meat & fish': 'chicken beef mince pork lamb bacon sausage ham turkey steak fish salmon cod tuna prawn haddock',
  'Dairy & eggs': 'milk butter cheese cheddar yog yoghurt yogurt cream egg creme crème mozzarella parmesan feta halloumi',
  'Chilled': 'hummus houmous dip pesto coleslaw pizza fresh pasta quiche',
  'Frozen': 'frozen ice_cream ice_lolly chips fish_fingers waffle peas_frozen',
  'Food cupboard': 'pasta rice flour sugar oil vinegar sauce ketchup mayo mustard stock cereal oats porridge tin tinned beans soup spice salt honey jam peanut nutella noodle lentil chickpea tomatoes coffee tea',
  'Drinks': 'juice water squash cola lemonade wine beer lager gin prosecco tonic',
  'Snacks': 'crisp biscuit chocolate sweets popcorn nuts bar',
  'Household': 'kitchen_roll toilet_roll loo bin_bag washing up liquid detergent fabric softener dishwasher tablet foil cling bleach sponge battery light bulb',
  'Toiletries': 'shampoo conditioner soap shower gel toothpaste toothbrush deodorant razor plaster paracetamol ibuprofen tissues cotton sun cream suncream',
};
const PACK_ESSENTIALS = ['Passport', 'Phone & charger', 'Toothbrush', 'Underwear', 'Socks', 'Pyjamas', 'T-shirts', 'Shorts / trousers', 'Jumper or hoodie', 'Swimwear', 'Sunglasses', 'Headphones', 'Any medication'];
const PACK_SHARED = ['Tickets / boarding passes', 'Travel insurance', 'Plug adaptors', 'Sun cream', 'First aid kit', 'Toothpaste', 'Shampoo & shower gel', 'Euros / cards', 'Car keys', 'Snacks for the journey'];
const SLOTS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner' };
const GIFT_STATUS = { idea: 'Idea', bought: 'Bought', wrapped: 'Wrapped' };
// To-do priority: stored 0–3, shown top to bottom as 3, 2, 1, 0
const PRIORITY = [
  { v: 0, label: 'Standard' },
  { v: 2, label: 'Urgent', cls: 'orange' },
  { v: 1, label: 'Important', cls: 'blue' },
  { v: 3, label: 'Urgent & important', cls: 'red' },
];
const PRI_ORDER = [3, 2, 1, 0];
const priOf = (it) => Math.max(0, Math.min(3, +it.priority || 0));
const priPill = (it) => { const p = PRIORITY.find((x) => x.v === priOf(it)); return p && p.v ? `<span class="pill ${p.cls}">${p.label}</span>` : ''; };
function parsePackQty(raw) {
  let m = raw.match(/^(.+?)\s*[x×]\s*(\d+)$/i);
  if (m) return { text: m[1].trim().charAt(0).toUpperCase() + m[1].trim().slice(1), qty: m[2] };
  m = raw.match(/^(\d+)\s*[x×]?\s+(.+)$/i);
  if (m) return { text: m[2].charAt(0).toUpperCase() + m[2].slice(1), qty: m[1] };
  return { text: raw, qty: '' };
}
const WORK_STATUS = { todo: 'To do', doing: 'Doing', done: 'Done' };

/* ============================================================
   Helpers
   ============================================================ */
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 3) | 8).toString(16); }));
const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const parseYmd = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const startOfWeek = (d) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return addDays(x, -((x.getDay() + 6) % 7)); };
const today = () => ymd(new Date());
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtDay = (d) => `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
function fmtDue(s) {
  if (!s) return '';
  const diff = Math.round((parseYmd(s) - parseYmd(today())) / 864e5);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff > 1 && diff < 7) return DAYS[parseYmd(s).getDay()];
  return fmtDay(parseYmd(s));
}
function timeAgo(ts) {
  const s = (Date.now() - new Date(ts).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return fmtDay(new Date(ts));
}
const money = (n) => '£' + (Math.round(n * 100) / 100).toLocaleString('en-GB', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const AISLE_PAIRS = Object.entries(AISLE_WORDS).flatMap(([a, ws]) => ws.split(' ').filter(Boolean).map((w) => [a, w])).sort((x, y) => y[1].length - x[1].length);
function guessAisle(text) {
  const t = ' ' + text.toLowerCase() + ' ';
  for (const [aisle, w] of AISLE_PAIRS) if (t.includes(' ' + w.replace(/_/g, ' '))) return aisle;
  return 'Other';
}
function parseQty(s) {
  const m = s.match(/^(\d+(?:\.\d+)?\s*(?:x|kg|g|ml|l|ltr|pk|packs?|tins?|bottles?|bags?|boxes?)?)\s+(.+)$/i);
  return m ? { qty: m[1].replace(/\s+/g, ''), text: m[2].charAt(0).toUpperCase() + m[2].slice(1) } : { qty: '', text: s };
}
const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'; };
const sortItems = (a, b) => a.position - b.position;

/* ============================================================
   Stores — Supabase (real) or Demo (this phone only)
   ============================================================ */
const TABLES = ['members', 'lists', 'list_access', 'items', 'meal_slots', 'meal_presence', 'notifications'];
// Added in the November update — the app keeps working if they're not set up yet
const OPTIONAL = ['gift_status', 'countdowns', 'budget_accounts', 'budget_pots', 'budget_entries', 'budget_recurring', 'budget_transactions'];

class SupaStore {
  constructor() {
    this.sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey, { auth: { persistSession: true, autoRefreshToken: true } });
  }
  async session() { const { data } = await this.sb.auth.getSession(); return data.session; }
  async signIn(email, password) { const { error } = await this.sb.auth.signInWithPassword({ email, password }); if (error) throw error; }
  async signOut() { await this.sb.auth.signOut(); }
  async resetPassword(email) { const { error } = await this.sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname }); if (error) throw error; }
  async setPassword(password) { const { error } = await this.sb.auth.updateUser({ password }); if (error) throw error; }
  async whoAmI() { const { data, error } = await this.sb.rpc('me'); if (error) throw error; return data; }
  async fetchAll(t) {
    const out = [];
    for (let from = 0; ; from += 1000) {
      let q = this.sb.from(t).select('*').range(from, from + 999);
      if (t === 'notifications') q = q.order('created_at', { ascending: false });
      const { data, error } = await q;
      if (error) throw error;
      out.push(...data);
      if (data.length < 1000 || t === 'notifications') break;
    }
    return out;
  }
  async loadAll() {
    const missing = [];
    const opt = (t) => this.fetchAll(t).catch((e) => { missing.push(t); console.warn(t, e.message); return []; });
    const res = await Promise.all([...TABLES.map((t) => this.fetchAll(t)), ...OPTIONAL.map(opt)]);
    const all = [...TABLES, ...OPTIONAL];
    const out = Object.fromEntries(all.map((t, i) => [t, res[i]]));
    out.missing = missing;
    return out;
  }
  async insert(t, rows) { const { error } = await this.sb.from(t).insert(rows); if (error) throw error; }
  async update(t, where, patch) { const { error } = await this.sb.from(t).update(patch).match(where); if (error) throw error; }
  async remove(t, where) { const { error } = await this.sb.from(t).delete().match(where); if (error) throw error; }
  async upsert(t, row, onConflict) { const { error } = await this.sb.from(t).upsert(row, { onConflict }); if (error) throw error; }
  async insertIgnore(t, rows, key) { const { error } = await this.sb.from(t).upsert(rows, { onConflict: key, ignoreDuplicates: true }); if (error) throw error; }
  subscribe(cb) {
    this.sb.channel('mcgaw-all').on('postgres_changes', { event: '*', schema: 'public' }, cb).subscribe();
    this.sb.auth.onAuthStateChange((ev) => { if (ev === 'PASSWORD_RECOVERY') openSheet({ kind: 'password' }); });
  }
  async todo(action, payload = {}) {
    const { data, error } = await this.sb.functions.invoke('todo', { body: { action, ...payload } });
    if (error) {
      let msg = error.message;
      try { const j = await error.context.json(); if (j.error) msg = j.error; } catch { /* keep message */ }
      if (/Failed to send|not found|404/i.test(msg)) msg = 'The To Do sync isn’t set up in Supabase yet';
      throw new Error(msg);
    }
    return data;
  }
  async outlook(action, payload = {}) {
    const { data, error } = await this.sb.functions.invoke('outlook', { body: { action, ...payload } });
    if (error) {
      let msg = error.message;
      try { const j = await error.context.json(); if (j.error) msg = j.error; } catch { /* keep message */ }
      if (/Failed to send|not found|404/i.test(msg)) msg = 'The Outlook connection isn’t set up in Supabase yet';
      throw new Error(msg);
    }
    return data;
  }
  async savePush(sub, me) {
    const j = sub.toJSON();
    await this.upsert('push_subscriptions', { endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, member: me }, 'endpoint');
  }
}

class DemoStore {
  constructor() {
    this.key = 'mcgaw-lists-demo-v7';
    try { this.db = JSON.parse(localStorage.getItem(this.key)); } catch { this.db = null; }
    if (!this.db) this.db = seedDemo();
    this.me = null;
    try { this.me = localStorage.getItem(this.key + '-me'); } catch { /* storage unavailable */ }
  }
  persist() { try { localStorage.setItem(this.key, JSON.stringify(this.db)); } catch { /* storage unavailable */ } }
  async session() { return this.me ? { demo: true } : null; }
  async signInAs(id) { this.me = id; try { localStorage.setItem(this.key + '-me', id); } catch { /* */ } }
  async signOut() { this.me = null; try { localStorage.removeItem(this.key + '-me'); } catch { /* */ } }
  async whoAmI() { return this.me; }
  reset() { this.db = seedDemo(); this.persist(); }
  canSee(listId) { const l = this.db.lists.find((x) => x.id === listId); return !!l && (l.owner === this.me || this.db.list_access.some((a) => a.list_id === listId && a.member === this.me)); }
  async loadAll() {
    const me = this.me, db = this.db;
    const lists = db.lists.filter((l) => this.canSee(l.id));
    const ids = new Set(lists.map((l) => l.id));
    const items = db.items.filter((i) => ids.has(i.list_id) && !(i.hidden_from || []).includes(me));
    const giftOk = new Set(items.filter((i) => i.data?.for !== me).map((i) => i.id));
    const budget = !!db.members.find((m) => m.id === me)?.can_budget;
    return JSON.parse(JSON.stringify({
      members: db.members, lists,
      list_access: db.list_access.filter((a) => ids.has(a.list_id)),
      items,
      gift_status: (db.gift_status || []).filter((g) => giftOk.has(g.item_id)),
      countdowns: (db.countdowns || []).filter((c) => c.owner === me || (c.members || []).includes(me) || (c.list_id && ids.has(c.list_id))),
      budget_accounts: budget ? db.budget_accounts || [] : [],
      budget_pots: budget ? db.budget_pots || [] : [],
      budget_entries: budget ? db.budget_entries || [] : [],
      budget_recurring: budget ? db.budget_recurring || [] : [],
      budget_transactions: budget ? db.budget_transactions || [] : [],
      missing: [],
      meal_slots: db.meal_slots.filter((m) => ids.has(m.list_id)),
      meal_presence: db.meal_presence.filter((m) => ids.has(m.list_id)),
      notifications: db.notifications.filter((n) => n.member === me).sort((a, b) => b.created_at.localeCompare(a.created_at)),
    }));
  }
  match(r, where) { return Object.entries(where).every(([k, v]) => r[k] === v); }
  notify(member, kind, list_id, body, item_id = null) {
    if (member === this.me) return;
    this.db.notifications.push({ id: Date.now() + Math.random(), member, actor: this.me, kind, list_id, item_id, body, read: false, created_at: new Date().toISOString() });
  }
  after(t, op, row, old) {
    const name = memberName(this.me);
    const list = this.db.lists.find((l) => l.id === row.list_id);
    if (t === 'list_access' && list) {
      if (op === 'insert') this.notify(row.member, 'added', row.list_id, `${name} added you to “${list.title}”${row.role === 'admin' ? ' as an admin' : ''}`);
      if (op === 'update' && row.role === 'admin' && old.role !== 'admin') this.notify(row.member, 'admin', row.list_id, `${name} made you an admin of “${list.title}”`);
    }
    if (t === 'items' && list) {
      for (const m of row.assignees || []) {
        if (op === 'insert' || !(old.assignees || []).includes(m)) this.notify(m, 'assigned', row.list_id, `${name} assigned you “${row.text.slice(0, 60)}” in ${list.title}`, row.id);
      }
    }
  }
  async insert(t, rows) {
    if (!this.db[t]) this.db[t] = [];
    for (const r of [].concat(rows)) { this.db[t].push({ ...r }); this.after(t, 'insert', r, null); }
    this.persist();
  }
  async update(t, where, patch) {
    for (const r of this.db[t]) if (this.match(r, where)) { const old = { ...r }; Object.assign(r, patch); this.after(t, 'update', r, old); }
    this.persist();
  }
  async remove(t, where) {
    const gone = this.db[t].filter((r) => this.match(r, where));
    this.db[t] = this.db[t].filter((r) => !this.match(r, where));
    for (const r of gone) {
      if (t === 'lists') for (const tt of ['list_access', 'items', 'meal_slots', 'meal_presence', 'notifications']) this.db[tt] = this.db[tt].filter((x) => x.list_id !== r.id);
      if (t === 'items') { this.db.items = this.db.items.filter((x) => x.parent_id !== r.id); this.db.gift_status = (this.db.gift_status || []).filter((g) => g.item_id !== r.id); }
      if (t === 'budget_accounts') { this.db.budget_entries = this.db.budget_entries.filter((e) => e.account_id !== r.id); this.db.budget_recurring = (this.db.budget_recurring || []).filter((e) => e.account_id !== r.id); this.db.budget_transactions = (this.db.budget_transactions || []).filter((e) => e.account_id !== r.id); }
      if (t === 'budget_recurring') (this.db.budget_transactions || []).forEach((x) => { if (x.matched_rule === r.id) x.matched_rule = null; });
      if (t === 'budget_recurring') this.db.budget_entries = this.db.budget_entries.filter((e) => e.rule_id !== r.id);
    }
    this.persist();
  }
  async upsert(t, row, onConflict) {
    const keys = onConflict.split(',');
    const hit = (this.db[t] || []).find((r) => keys.every((k) => r[k] === row[k]));
    if (!this.db[t]) this.db[t] = [];
    if (hit) Object.assign(hit, row); else this.db[t].push({ ...row });
    this.persist();
  }
  subscribe() {}
  async savePush() {}
  async insertIgnore(t, rows, key) { if (!this.db[t]) this.db[t] = []; const have = new Set(this.db[t].map((r) => r[key])); this.db[t].push(...rows.filter((r) => !have.has(r[key]))); this.persist(); }
  async todo() { throw new Error('Microsoft To Do sync works once the app is connected to Supabase'); }
  async outlook() { throw new Error('Outlook works once the app is connected to Supabase'); }
}

function seedDemo() {
  const now = Date.now() / 1000, t = today(), d = (n) => ymd(addDays(new Date(), n));
  const L = (id, type, title, owner, extra = {}) => ({ id, type, title, owner, colour: TYPES[type].colour, settings: {}, created_at: new Date().toISOString(), ...extra });
  const I = (list_id, text, extra = {}) => ({ id: uid(), list_id, parent_id: null, text, notes: null, done: false, done_by: null, done_at: null, assignees: [], due: null, priority: 0, status: null, category: null, quantity: null, hidden_from: [], data: {}, position: now + Math.random(), created_by: 'mike', created_at: new Date().toISOString(), ...extra });
  const lists = [
    L('l-notice', 'notice', 'Family notices', 'louise'),
    L('l-meals', 'meals', 'Meal planner', 'louise', { settings: { slots: ['dinner'] } }),
    L('l-shop', 'shopping', 'Weekly shop', 'louise'),
    L('l-todo', 'todo', 'House jobs', 'mike'),
    L('l-work', 'work', 'Cloudbass', 'mike'),
    L('l-xmas', 'christmas', 'Christmas 2026', 'mike'),
    L('l-pack', 'packing', 'February half-term', 'louise'),
  ];
  const access = [];
  const share = (list, ids, role = 'member') => ids.forEach((m) => access.push({ list_id: list, member: m, role, added_by: 'mike', added_at: new Date().toISOString() }));
  share('l-notice', ['mike', 'esme', 'oscar']); share('l-meals', ['mike', 'esme', 'oscar']);
  share('l-shop', ['mike'], 'admin'); share('l-shop', ['esme', 'oscar']);
  share('l-todo', ['louise'], 'admin'); share('l-todo', ['esme', 'oscar']);
  share('l-xmas', ['louise'], 'admin'); share('l-xmas', ['oscar']);
  share('l-pack', ['mike', 'esme', 'oscar']);
  const fix = I('l-todo', 'Sort out the garage', { assignees: ['mike', 'oscar'], due: d(1), priority: 1 });
  const lego = I('l-xmas', 'Lego Technic set', { data: { for: 'oscar', price: 89.99 }, created_by: 'oscar' });
  const art = I('l-xmas', 'Art set & sketchbook', { data: { for: 'esme', price: 35 }, hidden_from: ['esme'] });
  const items = [
    I('l-shop', 'Semi-skimmed milk', { quantity: '2', category: 'Dairy & eggs' }),
    I('l-shop', 'Bananas', { category: 'Fruit & veg' }),
    I('l-shop', 'Sourdough loaf', { category: 'Bakery' }),
    I('l-shop', 'Chicken thighs', { category: 'Meat & fish', quantity: '1kg' }),
    ...[['Cheddar', 'Dairy & eggs', 6], ['Eggs', 'Dairy & eggs', 8], ['Butter', 'Dairy & eggs', 3], ['Apples', 'Fruit & veg', 5], ['Broccoli', 'Fruit & veg', 4], ['Pasta', 'Food cupboard', 4], ['Tinned tomatoes', 'Food cupboard', 3], ['Toilet roll', 'Household', 2], ['Washing up liquid', 'Household', 1], ['Orange juice', 'Drinks', 3]]
      .map(([t, c, n]) => I('l-shop', t, { category: c, done: true, data: { cleared: true, uses: n } })),
    I('l-shop', 'Fish fingers', { category: 'Frozen', created_by: 'oscar' }),
    I('l-shop', 'Dishwasher tablets', { category: 'Household' }),
    I('l-shop', 'Free-range eggs', { category: 'Dairy & eggs', done: true, done_by: 'louise' }),
    fix,
    I('l-todo', 'Clear the shelves', { parent_id: fix.id, assignees: ['oscar'], done: true }),
    I('l-todo', 'Take old paint to the tip', { parent_id: fix.id, assignees: ['mike'] }),
    I('l-todo', 'Put bikes on the wall hooks', { parent_id: fix.id, assignees: ['mike', 'oscar'] }),
    I('l-todo', 'Book dentist for the kids', { assignees: ['louise'], due: d(-1), created_by: 'louise', priority: 3 }),
    I('l-todo', 'Renew car insurance', { assignees: ['mike'], due: d(9), priority: 2 }),
    I('l-todo', 'Tidy bedroom', { assignees: ['esme'], due: t, created_by: 'louise' }),
    I('l-todo', 'Fix the gate latch', {}),
    I('l-work', 'Kit list for Saturday OB', { status: 'doing', priority: 1, due: d(2), assignees: ['mike'] }),
    I('l-work', 'Crew hotel bookings', { status: 'todo', due: d(4), assignees: ['mike'] }),
    I('l-work', 'Expenses for October', { status: 'todo', due: d(1), assignees: ['mike'] }),
    I('l-work', 'Send rate card', { status: 'done', done: true, assignees: ['mike'] }),
    lego,
    I('l-xmas', 'Football boots', { data: { for: 'oscar', price: 55 }, hidden_from: ['oscar'] }),
    art,
    I('l-xmas', 'Concert tickets', { data: { for: 'esme', price: 120 }, hidden_from: ['esme'] }),
    I('l-xmas', 'Spa day', { data: { for: 'louise', price: 150 }, hidden_from: ['louise'], created_by: 'mike' }),
    I('l-xmas', 'Biscuit tin & card', { data: { for: 'Grandma', price: 20 } }),
    I('l-pack', 'Passport', { data: { bag: 'esme' }, done: true }),
    I('l-pack', 'Phone & charger', { data: { bag: 'esme' } }),
    I('l-pack', 'Swimwear', { data: { bag: 'esme' } }),
    I('l-pack', 'Underwear', { data: { bag: 'esme' }, quantity: '8' }),
    I('l-pack', 'Passport', { data: { bag: 'oscar' } }),
    I('l-pack', 'Football kit', { data: { bag: 'oscar' } }),
    I('l-pack', 'Passport', { data: { bag: 'mike' }, done: true }),
    I('l-pack', 'Laptop', { data: { bag: 'mike' } }),
    I('l-pack', 'Plug adaptors', { data: { bag: 'shared' } }),
    I('l-pack', 'Sun cream', { data: { bag: 'shared' }, done: true }),
    I('l-notice', 'Bin day is Tuesday', { notes: 'Green bin this week, black next week. Last one out on Monday night puts them out please!', data: { colour: '#30B05A', pinned: true, seen: ['mike', 'louise'] }, created_by: 'louise' }),
    I('l-notice', 'Swimming moved to Thursday', { notes: 'Esme’s lessons are 5:30pm on Thursdays from next week.', data: { colour: '#0A84FF', seen: ['louise'] }, created_by: 'louise' }),
    I('l-notice', 'Wi-Fi password', { notes: 'Guest network is McGaw-Guest — ask Dad for the password.', data: { colour: '#8E8E93', seen: [] }, created_by: 'mike' }),
  ];
  const meal_slots = [], meal_presence = [];
  const meals = ['Spag bol', 'Chicken fajitas', 'Leftovers', 'Fish pie', 'Pizza night', 'Roast chicken', 'Stir fry'];
  const ws = startOfWeek(new Date());
  meals.forEach((m, i) => {
    const day = ymd(addDays(ws, i));
    meal_slots.push({ list_id: 'l-meals', day, slot: 'dinner', meal: m, cook: ['louise', 'mike', null, 'louise', 'mike', 'mike', 'louise'][i], notes: null, ingredients: null });
    for (const mm of ['mike', 'louise', 'esme', 'oscar']) {
      const status = (mm === 'mike' && (i === 1 || i === 2)) ? 'out' : (mm === 'esme' && i === 3) ? 'late' : 'home';
      meal_presence.push({ list_id: 'l-meals', day, slot: 'dinner', member: mm, status });
    }
  });
  const notifications = [
    { id: 1, member: 'mike', actor: 'louise', kind: 'added', list_id: 'l-shop', body: 'Louise added you to “Weekly shop” as an admin', read: false, created_at: new Date(Date.now() - 36e5).toISOString() },
    { id: 2, member: 'esme', actor: 'louise', kind: 'added', list_id: 'l-pack', body: 'Louise added you to “February half-term”', read: false, created_at: new Date(Date.now() - 72e5).toISOString() },
    { id: 3, member: 'oscar', actor: 'mike', kind: 'assigned', list_id: 'l-todo', body: 'Mike assigned you “Sort out the garage” in House jobs', read: false, created_at: new Date(Date.now() - 5e6).toISOString() },
  ];
  const gift_status = [{ item_id: lego.id, status: 'bought', buyer: 'mike' }, { item_id: art.id, status: 'wrapped', buyer: 'louise' }];
  const at = (days, h = 0) => { const x = new Date(); x.setDate(x.getDate() + days); x.setHours(h, 0, 0, 0); return x.toISOString(); };
  const countdowns = [
    { id: uid(), title: 'Departure', target: at(103, 6), colour: '#FF9500', kind: 'departure', list_id: 'l-pack', owner: 'louise', members: [], style: 'station' },
    { id: uid(), title: 'Christmas Day', target: new Date(new Date().getFullYear(), 11, 25).toISOString(), colour: '#E0352B', kind: 'general', list_id: 'l-xmas', owner: 'mike', members: [], style: 'flip' },
    { id: uid(), title: 'Oscar’s birthday', target: at(41), colour: '#30B05A', kind: 'general', list_id: null, owner: 'mike', members: ['louise', 'esme', 'oscar'], style: 'scoreboard' },
  ];
  return { members: FAMILY, lists, list_access: access, items, meal_slots, meal_presence, notifications, gift_status, countdowns, ...seedBudget() };
}

/* ============================================================
   State
   ============================================================ */
const store = DEMO ? new DemoStore() : new SupaStore();
const S = {
  me: null, ready: false,
  data: { members: FAMILY, lists: [], list_access: [], items: [], meal_slots: [], meal_presence: [], notifications: [], gift_status: [], countdowns: [], budget_accounts: [], budget_pots: [], budget_entries: [], budget_recurring: [], budget_transactions: [], missing: [] },
  sheets: [], filter: 'all', ui: {},
};
const ui = (k, def) => (k in S.ui ? S.ui[k] : def);

const member = (id) => S.data.members.find((m) => m.id === id);
function memberName(id) { return (S.data.members.find((m) => m.id === id) || FAMILY.find((m) => m.id === id) || {}).name || 'Someone'; }
const membersSorted = () => [...S.data.members].sort((a, b) => a.sort - b.sort);
const getList = (id) => S.data.lists.find((l) => l.id === id);
const getItem = (id) => S.data.items.find((i) => i.id === id);
const accessOf = (listId) => S.data.list_access.filter((a) => a.list_id === listId);
const listMembers = (l) => membersSorted().filter((m) => m.id === l.owner || accessOf(l.id).some((a) => a.member === m.id));
const isOwner = (l) => l.owner === S.me;
const isAdmin = (l) => isOwner(l) || accessOf(l.id).some((a) => a.member === S.me && a.role === 'admin');
const itemsOf = (listId) => S.data.items.filter((i) => i.list_id === listId && !i.parent_id && !i.data?.cleared).sort(sortItems);
// Shopping items cleared from the trolley are kept (one per name) so they can be suggested again
const pastOf = (listId) => S.data.items.filter((i) => i.list_id === listId && !i.parent_id && i.data?.cleared);
const pastSorted = (listId) => pastOf(listId).sort((a, b) => (b.data.uses || 1) - (a.data.uses || 1) || a.text.localeCompare(b.text));
const childrenOf = (id) => S.data.items.filter((i) => i.parent_id === id).sort(sortItems);
const unreadCount = () => S.data.notifications.filter((n) => !n.read).length;
const listColour = (l) => l.colour || TYPES[l.type].colour;
const giftOf = (id) => (S.data.gift_status || []).find((g) => g.item_id === id) || null;
const giftState = (id) => giftOf(id)?.status || 'idea';
const isMyWish = (it) => it.data?.for === S.me;
const canBudget = () => !!member(S.me)?.can_budget;
const missing = (t) => (S.data.missing || []).includes(t);

function avatar(id, size = 28) {
  const m = member(id) || { name: '?', colour: '#8E8E93' };
  return `<span class="av" style="--c:${m.colour};--s:${size}px" title="${esc(m.name)}">${esc(m.name[0])}</span>`;
}
const avatarStack = (ids, size = 24) => (ids && ids.length ? `<span class="stack">${ids.map((i) => avatar(i, size)).join('')}</span>` : '');

/* ============================================================
   Data changes (optimistic, then saved)
   ============================================================ */
function applyLocal(t, op, a, b) {
  const rows = S.data[t];
  const m = (r, w) => Object.entries(w).every(([k, v]) => r[k] === v);
  if (op === 'insert') rows.push(...[].concat(a).map((r) => ({ ...r })));
  if (op === 'update') rows.forEach((r) => { if (m(r, a)) Object.assign(r, b); });
  if (op === 'remove') S.data[t] = rows.filter((r) => !m(r, a));
  if (op === 'upsert') { const keys = b.split(','); const hit = rows.find((r) => keys.every((k) => r[k] === a[k])); if (hit) Object.assign(hit, a); else rows.push({ ...a }); }
}
async function act(t, op, a, b) {
  applyLocal(t, op, a, b);
  render();
  try {
    await store[op](t, a, b);
    if (DEMO) await reload();
  } catch (e) {
    console.error(e);
    toast(e.message && e.message.length < 90 ? e.message : 'Couldn’t save that — check your connection');
    await reload();
  }
}
const ins = (t, rows) => act(t, 'insert', rows);
const upd = (t, where, patch) => act(t, 'update', where, patch);
const del = (t, where) => act(t, 'remove', where);
const ups = (t, row, keys) => act(t, 'upsert', row, keys);

function newItem(list, text, extra = {}) {
  return { id: uid(), list_id: list.id, parent_id: null, text, notes: null, done: false, done_by: null, done_at: null, assignees: [], due: null, priority: 0, status: null, category: null, quantity: null, hidden_from: [], data: {}, position: Date.now() / 1000, created_by: S.me, created_at: new Date().toISOString(), ...extra };
}

let reloadTimer = null, lastUnread = 0;
async function reload() {
  try {
    const data = await store.loadAll();
    if (!data.members || !data.members.length) data.members = FAMILY;
    S.data = data;
    const u = unreadCount();
    if (S.ready && u > lastUnread) {
      const n = S.data.notifications.find((x) => !x.read);
      if (n) toast(n.body);
    }
    lastUnread = u;
    if (navigator.setAppBadge) { try { u ? navigator.setAppBadge(u) : navigator.clearAppBadge(); } catch { /* not supported */ } }
    S.ready = true;
    render();
  } catch (e) {
    console.error(e);
    toast('Couldn’t load — check your connection');
  }
}
const scheduleReload = () => { clearTimeout(reloadTimer); reloadTimer = setTimeout(reload, 350); };

/* ============================================================
   Routing & rendering
   ============================================================ */
function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [name, id] = h.split('/');
  if (name === 'list' && id) return { name: 'list', id };
  if (['mine', 'activity', 'family', 'countdowns', 'budget', 'tv'].includes(name)) return { name };
  return { name: 'home' };
}
const go = (hash) => { location.hash = hash; };

function render() {
  const app = $('#view');
  if (!S.me) { renderSheets(); return; }
  if (DRAG.active) { DRAG.pending = true; return; }
  const r = route();
  // keep focus & typing across re-renders
  const ae = document.activeElement;
  const keep = ae && ae.id && app.contains(ae) ? { id: ae.id, v: ae.value, s: ae.selectionStart } : null;
  let html = '';
  if (!S.ready) html = '<div class="empty">Loading…</div>';
  else if (r.name === 'list') html = listView(r.id);
  else if (r.name === 'mine') html = mineView();
  else if (r.name === 'activity') html = activityView();
  else if (r.name === 'family') html = familyView();
  else if (r.name === 'countdowns') html = countdownsView();
  else if (r.name === 'budget') html = budgetView();
  else if (r.name === 'tv') html = tvView();
  else html = homeView();
  app.innerHTML = html;
  app.classList.toggle('no-tabs', ['list', 'countdowns', 'budget', 'tv'].includes(r.name));
  document.body.classList.toggle('tv-mode', r.name === 'tv');
  tvWake(r.name === 'tv');
  if (keep) { const el = document.getElementById(keep.id); if (el) { el.value = keep.v; el.focus(); try { el.setSelectionRange(keep.s, keep.s); } catch { /* */ } } }
  inkPass(app);
  spinFlaps(app);
  renderTabs(r);
  renderSheets();
}

/* ---------- TV dashboard (Fire TV / any big screen) ---------- */
// Only lists that more than one person can see — nothing private, no gift lists, no budget.
const tvLists = () => S.data.lists.filter((l) => l.type !== 'christmas' && listMembers(l).length > 1);
function tvBest(type) {
  return tvLists().filter((l) => l.type === type).sort((a, b) => listMembers(b).length - listMembers(a).length || itemsOf(b.id).length - itemsOf(a.id).length)[0];
}
let TV_WAKE = null;
async function tvWake(on) {
  try {
    if (on && !TV_WAKE && navigator.wakeLock) { TV_WAKE = await navigator.wakeLock.request('screen'); TV_WAKE.addEventListener('release', () => { TV_WAKE = null; }); }
    if (!on && TV_WAKE) { await TV_WAKE.release(); TV_WAKE = null; }
  } catch { /* not supported: set the Fire TV screensaver to Never */ }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && route().name === 'tv') tvWake(true); });
function tvView() {
  const who = ui('tvWho', 'family');
  const t = today(), d1 = ymd(addDays(new Date(), 1)), wk = ymd(addDays(new Date(), 7));
  const people = membersSorted();
  const now = new Date();
  const clock = `<div class="tv-clock"><b data-clock>${now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</b><span>${now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span></div>`;
  const chips = `<div class="tv-who">${[['family', 'Everyone'], ...people.map((m) => [m.id, m.name])].map(([k, n]) => `<button class="${who === k ? 'on' : ''}" data-a="setUi" data-k="tvWho" data-v="${k}">${k === 'family' ? '' : avatar(k, 26)}${esc(n)}</button>`).join('')}<button class="tv-exit" data-a="go" data-h="#/family">Exit</button></div>`;
  // Dinner
  const ml = tvBest('meals');
  let dinner = '<div class="tv-card"><div class="tv-k" style="--c:#FF375F">Dinner tonight</div><div class="tv-big muted">No meal planner shared</div></div>';
  if (ml) {
    const slotOf = (day) => S.data.meal_slots.find((m) => m.list_id === ml.id && m.day === day && m.slot === 'dinner') || {};
    const s = slotOf(t);
    const eaters = listMembers(ml);
    const stat = (day, id) => S.data.meal_presence.find((p) => p.list_id === ml.id && p.day === day && p.slot === 'dinner' && p.member === id)?.status || 'home';
    const week = [1, 2, 3, 4, 5, 6].map((n) => ymd(addDays(new Date(), n))).map((day) => `<div class="tv-day"><span>${day === d1 ? 'Tomorrow' : new Date(day + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short' })}</span><b>${esc(slotOf(day).meal || '—')}</b></div>`).join('');
    dinner = `<button class="tv-card" data-a="go" data-h="#/list/${ml.id}"><div class="tv-k" style="--c:#FF375F">Dinner tonight</div>
      <div class="tv-big">${esc(s.meal || 'Not planned yet')}</div>
      ${s.cook ? `<div class="tv-sub">${esc(memberName(s.cook))} cooking</div>` : ''}
      <div class="tv-eaters">${eaters.map((m) => `<span class="tv-eater ${stat(t, m.id)}">${avatar(m.id, 40)}<i>${stat(t, m.id) === 'out' ? 'out' : stat(t, m.id) === 'late' ? 'late' : ''}</i></span>`).join('')}</div>
      <div class="tv-week">${week}</div></button>`;
  }
  // Tasks
  const taskLists = tvLists().filter((l) => l.type === 'todo' || l.type === 'work');
  let tasks = taskLists.flatMap((l) => itemsOf(l.id).filter((i) => !i.done && i.status !== 'done').map((i) => ({ i, l })));
  tasks = tasks.filter(({ i }) => (i.due && i.due <= wk) || (i.priority || 0) >= 2);
  if (who !== 'family') tasks = tasks.filter(({ i, l }) => (i.assignees || []).includes(who) || (!(i.assignees || []).length && l.owner === who));
  tasks.sort((a, b) => (a.i.due || '9999').localeCompare(b.i.due || '9999') || (b.i.priority || 0) - (a.i.priority || 0));
  const dueLabel = (d) => !d ? '' : d < t ? 'Overdue' : d === t ? 'Today' : d === d1 ? 'Tomorrow' : new Date(d + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short' });
  const taskCard = `<div class="tv-card tall"><div class="tv-k" style="--c:#0A84FF">${who === 'family' ? 'Everyone’s week' : `${esc(memberName(who))}’s week`} · ${tasks.length}</div>
    ${tasks.length ? `<div class="tv-tasks">${tasks.slice(0, 9).map(({ i, l }) => `<button class="tv-task ${i.due && i.due < t ? 'late' : ''}" data-a="toggle" data-id="${i.id}"><span class="tv-dot" style="--c:${['#8E8E93', '#0A84FF', '#FF9F0A', '#FF453A'][i.priority || 0]}"></span><span class="tv-tt">${esc(i.text)}</span><span class="tv-due">${dueLabel(i.due)}</span>${avatarStack(i.assignees, 30)}</button>`).join('')}${tasks.length > 9 ? `<div class="tv-more">+${tasks.length - 9} more</div>` : ''}</div>` : '<div class="tv-big muted">Nothing due this week 🎉</div>'}</div>`;
  // Notices
  const nl = tvBest('notice');
  const notes = nl ? itemsOf(nl.id).filter((i) => !i.done && !expired(i)).sort((a, b) => (b.data?.pinned ? 1 : 0) - (a.data?.pinned ? 1 : 0) || b.position - a.position).slice(0, 2) : [];
  const noteCard = notes.length ? `<div class="tv-notes">${notes.map((n) => `<div class="tv-note" style="--n:${n.data?.colour || '#FFD60A'}"><b>${esc(n.text)}</b><span>${esc(memberName(n.created_by))}</span></div>`).join('')}</div>` : '';
  // Countdowns
  const cds = (S.data.countdowns || []).filter((c) => new Date(c.target) > new Date(Date.now() - 864e5) && (!c.list_id || tvLists().some((l) => l.id === c.list_id))).sort((a, b) => a.target.localeCompare(b.target));
  const cdCard = cds.length ? `<button class="tv-card tv-cd" data-a="go" data-h="#/countdowns" style="--c:${cdColour(cds[0])}"><div class="tv-k" style="--c:${cdColour(cds[0])}">${esc(cds[0].title)}</div><div class="tv-cdface">${cdBox(cds[0], 'big')}</div>
    ${cds.slice(1, 3).map((c) => `<div class="tv-cdrow"><span>${esc(c.title)}</span>${cdBox(c, 'chip')}</div>`).join('')}</button>` : '';
  // Shopping
  const sl = tvBest('shopping');
  const shop = sl ? itemsOf(sl.id).filter((i) => !i.done) : [];
  const shopCard = sl ? `<button class="tv-card" data-a="go" data-h="#/list/${sl.id}"><div class="tv-k" style="--c:#30B05A">${esc(sl.title)} · ${shop.length}</div>
    <div class="tv-shop">${shop.length ? shop.slice(0, 14).map((i) => `<span>${esc(i.text)}${i.quantity ? ` <i>${esc(i.quantity)}</i>` : ''}</span>`).join('') + (shop.length > 14 ? `<span class="muted">+${shop.length - 14} more</span>` : '') : '<span class="muted">Nothing on the list</span>'}</div></button>` : '';
  return `<div class="tv-board"><div class="tv-top">${clock}${chips}</div>
    <div class="tv-grid"><div class="tv-col">${dinner}${noteCard}</div><div class="tv-col">${taskCard}</div><div class="tv-col">${cdCard}${shopCard}</div></div></div>`;
}
setInterval(() => { const c = document.querySelector('[data-clock]'); if (c) c.textContent = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); }, 5000);
let TV_DAY = today();
setInterval(() => { if (route().name === 'tv' && today() !== TV_DAY) { TV_DAY = today(); render(); } }, 60000);

function renderTabs(r) {
  const tb = $('#tabbar');
  if (!S.me || ['list', 'countdowns', 'budget', 'tv'].includes(r.name)) { tb.className = 'hide'; tb.innerHTML = ''; return; }
  tb.className = '';
  const mine = myOpenTasks().length;
  const u = unreadCount();
  const tab = (key, hash, ic, label, badge) => `<button class="${r.name === key ? 'on' : ''}" data-a="go" data-h="${hash}">${icon(ic, 26, 1.8)}${badge ? `<span class="badge">${badge}</span>` : ''}<span>${label}</span></button>`;
  tb.innerHTML = tab('home', '#/', 'house', 'Lists') + tab('mine', '#/mine', 'person', 'My tasks', mine || '') + tab('activity', '#/activity', 'bell', 'Activity', u || '') + tab('family', '#/family', 'people', 'Family');
}

/* ---------- Home ---------- */
function listSubtitle(l) {
  const items = itemsOf(l.id);
  const open = items.filter((i) => !i.done);
  switch (l.type) {
    case 'shopping': return open.length ? `${open.length} to get` : 'All got';
    case 'todo': case 'work': {
      const od = open.filter((i) => i.due && i.due < today()).length;
      if (l.type === 'work') {
        const t = today(), tm = ymd(addDays(new Date(), 1)), wk = ymd(addDays(new Date(), 7));
        const hot = open.filter((i) => priOf(i) > 0 && i.due);
        const n = (f) => hot.filter(f).length;
        const pills = [[n((i) => i.due < t), 'overdue', 'red'], [n((i) => i.due === t), 'today', 'red'], [n((i) => i.due === tm), 'tomorrow', 'orange'], [n((i) => i.due > tm && i.due <= wk), 'this week', 'blue']]
          .filter(([c]) => c).map(([c, w, cls]) => `<span class="pill ${cls}">${c} ${w}</span>`).join('');
        return pills ? `<span class="muted">Priority:</span> ${pills}` : `${open.length} open · nothing urgent this week`;
      }
      return `${open.length} open${od ? ` · <span style="color:var(--red)">${od} overdue</span>` : ''}`;
    }
    case 'christmas': {
      const total = items.reduce((s, i) => s + (+i.data?.price || 0), 0);
      return `${items.length} gift${items.length === 1 ? '' : 's'}${total ? ' · ' + money(total) : ''}`;
    }
    case 'packing': return `${items.filter((i) => i.done).length} of ${items.length} packed`;
    case 'meals': {
      const s = S.data.meal_slots.find((m) => m.list_id === l.id && m.day === today() && m.slot === 'dinner');
      return s && s.meal ? `Tonight: ${esc(s.meal)}` : 'Nothing planned tonight';
    }
    case 'notice': return `${items.filter((i) => !expired(i)).length} notes`;
  }
  return '';
}
function shareSummary(l) {
  const others = listMembers(l).filter((m) => m.id !== S.me);
  if (!others.length) return 'Just you';
  if (others.length === S.data.members.length - 1) return 'Everyone';
  return others.map((m) => m.name).join(', ');
}
// Your own order of lists on the home screen (press and hold to move; saved on this phone)
function sortLists(ls) {
  const order = pref('listOrder', []);
  const at = (l) => { const i = order.indexOf(l.id); return i < 0 ? 1e6 : i; };
  return ls.map((l, i) => [l, i]).sort((a, b) => at(a[0]) - at(b[0]) || a[1] - b[1]).map((x) => x[0]);
}
function saveListOrder(ids) {
  const order = pref('listOrder', []).filter((id) => !ids.includes(id));
  // keep this section's new order, slotted in front of everything else
  setPref('listOrder', [...ids, ...order]);
  render();
}
function listRow(l) {
  const others = listMembers(l).map((m) => m.id).filter((id) => id !== S.me);
  return `<div class="row tap" data-a="go" data-h="#/list/${l.id}" data-iid="${l.id}">
    <span class="tile-icon" style="--c:${listColour(l)}">${icon(TYPES[l.type].icon, 22)}</span>
    <div class="row-main"><div class="row-title">${esc(l.title)}</div><div class="row-sub">${listSubtitle(l)}</div></div>
    ${avatarStack(others, 22)}
    <span class="chev">${icon('chevR', 16, 2.4)}</span></div>`;
}
function homeView() {
  const me = member(S.me);
  const mine = myOpenTasks();
  const dueToday = mine.filter((i) => i.due && i.due <= today()).length;
  const unseen = S.data.items.filter((i) => getList(i.list_id)?.type === 'notice' && !i.parent_id && !expired(i) && i.created_by !== S.me && !(i.data?.seen || []).includes(S.me)).length;
  const mealList = S.data.lists.find((l) => l.type === 'meals');
  let tonight = '—', home = '';
  if (mealList) {
    const s = S.data.meal_slots.find((m) => m.list_id === mealList.id && m.day === today() && m.slot === 'dinner');
    tonight = s && s.meal ? esc(s.meal) : 'Not planned';
    const n = S.data.meal_presence.filter((p) => p.list_id === mealList.id && p.day === today() && p.slot === 'dinner' && p.status !== 'out').length;
    home = n ? `${n} home` : '';
  }
  const shopping = S.data.lists.filter((l) => l.type === 'shopping');
  const toGet = shopping.reduce((s, l) => s + itemsOf(l.id).filter((i) => !i.done).length, 0);

  const lists = S.data.lists.filter((l) => S.filter === 'all' || (S.filter === 'mine' ? listMembers(l).length === 1 : S.filter === 'shared' ? listMembers(l).length > 1 : l.type === S.filter));
  const usedTypes = TYPE_ORDER.filter((t) => S.data.lists.some((l) => l.type === t));
  const chip = (k, label, c) => `<button class="chip ${S.filter === k ? 'on' : ''}" data-a="filter" data-k="${k}">${c ? `<span class="dot" style="--c:${c}"></span>` : ''}${label}</button>`;

  const lay = homeLayout();
  const tiles = `<div class="tiles">
    <button class="tile" data-a="go" data-h="#/mine"><div class="top"><span class="tile-icon sm" style="--c:#0A84FF">${icon('person', 18)}</span><span class="num">${mine.length}</span></div><div class="lbl">My tasks${dueToday ? ` · ${dueToday} due` : ''}</div></button>
    <button class="tile" ${mealList ? `data-a="go" data-h="#/list/${mealList.id}"` : 'data-a="newList" data-type="meals"'}><div class="top"><span class="tile-icon sm" style="--c:${TYPES.meals.colour}">${icon('meal', 18)}</span><span class="val">${tonight}</span></div><div class="lbl">Dinner tonight${home ? ' · ' + home : ''}</div></button>
    <button class="tile" ${shopping[0] ? `data-a="go" data-h="#/list/${shopping[0].id}"` : 'data-a="newList" data-type="shopping"'}><div class="top"><span class="tile-icon sm" style="--c:${TYPES.shopping.colour}">${icon('cart', 18)}</span><span class="num">${toGet}</span></div><div class="lbl">To buy</div></button>
    <button class="tile" data-a="noticeTile"><div class="top"><span class="tile-icon sm" style="--c:${TYPES.notice.colour}">${icon('pin', 18)}</span><span class="num">${unseen}</span></div><div class="lbl">New notices</div></button>
  </div>`;
  const chips = `<div class="chips" style="margin-top:14px">${chip('all', 'All')}${chip('shared', 'Shared')}${chip('mine', 'Just me')}${usedTypes.map((t) => chip(t, TYPES[t].name, TYPES[t].colour)).join('')}</div>`;
  let out = '', chipsDone = false, listShown = 0;
  for (const id of lay.order) {
    const hidden = lay.hidden.includes(id);
    if (id === 'tiles') { if (!hidden) out += tiles; continue; }
    if (id === 'budget') { if (!hidden && canBudget()) out += budgetTile(); continue; }
    if (id === 'countdowns') { if (!hidden) out += homeCountdowns(); continue; }
    if (!TYPES[id] || !S.data.lists.length) continue;
    if (hidden && S.filter !== id) continue;
    if (!chipsDone) { out += chips; chipsDone = true; }
    const ls = sortLists(lists.filter((l) => l.type === id));
    if (!ls.length) continue;
    listShown++;
    out += `<div class="section-label">${TYPES[id].name}</div><div class="group" style="--indent:64px" ${ls.length > 1 ? 'data-reorder="lists"' : ''}>${ls.map(listRow).join('')}</div>`;
  }
  if (!S.data.lists.length) out += `<div class="empty"><div class="big">No lists yet</div>Make a shopping list, a meal plan or a notice board, then choose who in the family can see it.<br><br><button class="btn" data-a="newList">${icon('plus', 20, 2.4)} New list</button></div>`;
  else if (!chipsDone) out += chips + '<p class="hint">All list sections are hidden. Pick a type above, or edit the home screen.</p>';
  else if (!listShown) out += '<div class="empty">No lists match that filter.</div>';

  return `
  <div class="nav"><span class="eyebrow">${fmtDay(new Date())}</span><div class="actions"><button class="icon-btn solid" data-a="newList" aria-label="New list">${icon('plus', 20, 2.4)}</button></div></div>
  <h1 class="large">${greet()}, ${esc(me?.name || '')}</h1>
  ${out}
  <button class="link-btn home-edit" data-a="editHome">${icon('grip', 16, 2.4)} Edit home screen</button>`;
}

/* ---------- Home layout (saved on this iPhone) ---------- */
function homeBlocks() {
  return [
    { id: 'tiles', name: 'Quick view', desc: 'My tasks, dinner, shopping, notices', ic: 'house', c: '#0A84FF' },
    { id: 'budget', name: 'Budget', desc: 'Only you and Louise see this', ic: 'brief', c: '#248A3D', show: canBudget() },
    { id: 'countdowns', name: 'Countdowns', ic: 'cal', c: '#5E5CE6', show: !missing('countdowns') },
    ...TYPE_ORDER.map((t) => ({ id: t, name: TYPES[t].name, desc: `${S.data.lists.filter((l) => l.type === t).length} list${S.data.lists.filter((l) => l.type === t).length === 1 ? '' : 's'}`, ic: TYPES[t].icon, c: TYPES[t].colour })),
  ];
}
function homeLayout() {
  let o = null;
  try { o = JSON.parse(pref('home', 'null')); } catch { o = null; }
  o = o || {};
  const ids = homeBlocks().map((b) => b.id);
  const order = (o.order || []).filter((id) => ids.includes(id));
  ids.forEach((id) => { if (!order.includes(id)) order.splice(id === 'tiles' ? 0 : order.length, 0, id); });
  return { order, hidden: (o.hidden || []).filter((id) => ids.includes(id)) };
}
function saveHomeLayout(lay) { setPref('home', JSON.stringify(lay)); render(); renderSheets(true); }
function saveHomeOrder(visibleIds) {
  const lay = homeLayout();
  lay.order = [...visibleIds, ...lay.order.filter((id) => !visibleIds.includes(id))];
  saveHomeLayout(lay);
}
function homeEditSheet() {
  const lay = homeLayout();
  const blocks = homeBlocks().filter((b) => b.show !== false);
  const byId = Object.fromEntries(blocks.map((b) => [b.id, b]));
  const rows = lay.order.filter((id) => byId[id]).map((id) => {
    const b = byId[id], on = !lay.hidden.includes(id);
    return `<div class="row home-row ${on ? '' : 'off'}" data-iid="${id}" style="--indent:58px"><span class="grip-ic">${icon('grip', 18, 2.4)}</span><span class="tile-icon sm" style="--c:${b.c}">${icon(b.ic, 16)}</span><div class="row-main" style="cursor:grab"><div class="row-title">${esc(b.name)}</div>${b.desc ? `<div class="row-sub">${esc(b.desc)}</div>` : ''}</div><span class="switch ${on ? 'on' : ''}" data-a="homeToggle" data-id="${id}" role="switch" aria-checked="${on}"></span></div>`;
  }).join('');
  return head('Home screen', '<button class="txt" data-a="homeReset">Reset</button>') + `
    <p class="hint" style="margin:0 4px 12px">Press and hold a row to move it. Switch off anything you don’t use. This only changes your iPhone, so everyone can set it up their own way.</p>
    <div class="group" data-reorder="home">${rows}</div>
    <p class="hint">Hidden list types are still there — tap their filter on the home screen to see them.</p>`;
}

/* ---------- My tasks ---------- */
function myOpenTasks() {
  return S.data.items.filter((i) => {
    const l = getList(i.list_id);
    return l && !i.done && (i.assignees || []).includes(S.me) && !['notice', 'meals'].includes(l.type);
  });
}
function mineListView(items) {
  const t = today(), wk = ymd(addDays(new Date(), 7));
  const buckets = [
    ['Overdue', items.filter((i) => i.due && i.due < t)],
    ['Today', items.filter((i) => i.due === t)],
    ['This week', items.filter((i) => i.due && i.due > t && i.due <= wk)],
    ['Later', items.filter((i) => i.due && i.due > wk)],
    ['No date', items.filter((i) => !i.due)],
  ];
  let body = '';
  for (const [label, rows] of buckets) {
    if (!rows.length) continue;
    rows.sort((a, b) => priOf(b) - priOf(a) || (a.due || '').localeCompare(b.due || ''));
    body += `<div class="section-label">${label}</div><div class="group">${rows.map((i) => itemRow(i, getList(i.list_id), { context: true })).join('')}</div>`;
  }
  return body;
}

function mineView() {
  const items = myOpenTasks();
  const view = pref('mineView', 'week');
  const views = `<div class="seg small cal-views" style="margin-top:4px">${WORK_VIEWS.map(([k, t]) => `<button class="${view === k ? 'on' : ''}" data-a="setMineView" data-v="${k}">${t}</button>`).join('')}</div>`;
  let body;
  if (!items.length) body = `<div class="empty"><div class="big">All clear 🎉</div>Anything assigned to you across the family’s lists will show up here.</div>`;
  else if (view === 'list') body = mineListView(items);
  else body = workCalendar(null, items, view === 'day' ? 1 : view === '3' ? 3 : 7, true);
  return `<div class="nav"><span></span></div><h1 class="large">My tasks</h1>${items.length ? views : ''}${body}`;
}

/* ---------- Activity ---------- */
function activityView() {
  const ns = S.data.notifications;
  const rows = ns.map((n) => `<div class="row tap" data-a="openNote" data-id="${n.id}">
      ${avatar(n.actor, 34)}
      <div class="row-main"><div class="row-title" style="font-size:15px;${n.read ? '' : 'font-weight:600'}">${esc(n.body)}</div><div class="row-sub">${timeAgo(n.created_at)}</div></div>
      ${n.read ? '' : '<span class="unread-dot"></span>'}</div>`).join('');
  return `<div class="nav"><span></span>${ns.some((n) => !n.read) ? '<button class="link-btn" data-a="readAll">Mark all read</button>' : ''}</div>
    <h1 class="large">Activity</h1>
    ${rows ? `<div class="group">${rows}</div>` : '<div class="empty"><div class="big">Nothing new</div>You’ll see it here when someone adds you to a list or gives you a task.</div>'}`;
}

/* ---------- Family / settings ---------- */
function familyView() {
  const me = member(S.me);
  const standalone = window.navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  const pushOn = typeof Notification !== 'undefined' && Notification.permission === 'granted';
  const fam = membersSorted().map((m) => {
    const shared = S.data.lists.filter((l) => listMembers(l).some((x) => x.id === m.id) && listMembers(l).some((x) => x.id === S.me)).length;
    return `<div class="row">${avatar(m.id, 36)}<div class="row-main" style="cursor:default"><div class="row-title">${esc(m.name)}${m.id === S.me ? ' <span class="muted">(you)</span>' : ''}</div><div class="row-sub">${m.role_label ? esc(m.role_label) + ' · ' : ''}${shared} shared list${shared === 1 ? '' : 's'}</div></div></div>`;
  }).join('');
  return `<div class="nav"><span></span></div><h1 class="large">Family</h1>
    <div class="profile-card">${avatar(S.me, 76)}<h2>${esc(me?.name)}</h2><p>The McGaw Family${DEMO ? ' · demo mode' : ''}</p></div>
    <div class="section-label">This iPhone</div>
    <div class="group">
      <div class="row tap" data-a="push"><span class="tile-icon sm" style="--c:#FF3B30">${icon('bell', 18)}</span><div class="row-main"><div class="row-title">Notifications</div><div class="row-sub">${pushOn ? 'On for this iPhone' : standalone ? 'Tap to turn on' : 'Add to Home Screen first'}</div></div><span class="switch ${pushOn ? 'on' : ''}"></span></div>
      <div class="row tap" data-a="install"><span class="tile-icon sm" style="--c:#8E8E93">${icon('plus', 18, 2.4)}</span><div class="row-main"><div class="row-title">Add to Home Screen</div><div class="row-sub">${standalone ? 'Installed' : 'How to install the app'}</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>
    </div>
    <div class="section-label">Bring in your lists</div>
    <div class="group">
      ${todoRow()}
      ${outlookRow()}
      <div class="row tap" data-a="openImport" data-tab="paste"><span class="tile-icon sm" style="--c:#25A366">${icon('list', 18)}</span><div class="row-main"><div class="row-title">Paste a list</div><div class="row-sub">From WhatsApp, Notes, an email…</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>
    </div>
    <div class="section-label">Alexa</div>
    <div class="group">
      <div class="row tap" data-a="alexaOpen"><span class="tile-icon sm" style="--c:#1AA3D9">${icon('voice', 18, 2.2)}</span><div class="row-main"><div class="row-title">Alexa &amp; Echo Show</div><div class="row-sub">Link your voice, and things to say</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>
    </div>
    <div class="group" style="margin-top:12px">
      <div class="row tap" data-a="go" data-h="#/tv"><span class="tile-icon sm" style="--c:#5E5CE6">${icon('house', 18, 2.2)}</span><div class="row-main"><div class="row-title">TV dashboard</div><div class="row-sub">For the Fire TV: open <b>quickdraw10.github.io/mcgaw-lists/tv</b> in Silk</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>
    </div>
    <div class="section-label">Appearance</div>
    <div class="group">
      <div class="field"><label>Mode</label><div class="seg" style="flex:1">${[['system', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(([k, v]) => `<button class="${pref('mode', 'system') === k ? 'on' : ''}" data-a="setMode" data-v="${k}">${v}</button>`).join('')}</div></div>
      <div class="field col"><label>Countdowns show as</label>${boardSeg()}</div>
      <div class="field col"><label>Theme</label><div class="themes">${Object.entries(THEMES).map(([k, t]) => `<button class="theme-dot ${pref('theme', 'classic') === k ? 'on' : ''}" data-a="setTheme" data-v="${k}" style="--a:${t.accent};--b:${t.bgL}"><span></span>${t.name}</button>`).join('')}</div></div>
      <div class="field col"><label>Background photo</label>
        ${pref('bg', null) ? `<div class="bg-preview" style="background-image:url('${pref('bg', '')}')"></div>
          <div class="dim-row"><span>Photo</span><input type="range" id="bg-dim" min="0" max="90" step="5" value="${pref('dim', '55')}" data-input="bgDim" aria-label="Fade the photo"><span>Faded</span></div>
          <div class="bg-btns"><label class="btn secondary" for="bg-file">Change photo</label><button class="btn danger" data-a="bgRemove">Remove</button></div>`
        : '<label class="btn secondary" for="bg-file">Choose a photo</label>'}
        <input type="file" id="bg-file" accept="image/*" hidden data-change="bgFile">
      </div>
    </div>
    <div class="group" style="margin-top:10px"><div class="row tap" data-a="editHome"><span class="tile-icon sm" style="--c:#5E5CE6">${icon('grip', 18, 2.4)}</span><div class="row-main"><div class="row-title">Home screen layout</div><div class="row-sub">Reorder or hide sections</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div></div>
    <p class="hint">Appearance and layout are saved on this iPhone, so each of you can choose your own.</p>
    <div class="section-label">The McGaws</div><div class="group">${fam}</div>
    <div class="stack-gap" style="margin-top:22px">
      ${DEMO ? '<button class="btn secondary" data-a="resetDemo">Reset demo data</button>' : ''}
      <button class="btn danger" data-a="signOut">${DEMO ? 'Switch person' : 'Sign out'}</button>
    </div>
    <p class="hint" style="text-align:center;margin-top:16px">McGaw Lists · just for the four of us</p>`;
}

/* ============================================================
   List screen
   ============================================================ */
function listView(id) {
  const l = getList(id);
  if (!l) return `<div class="nav"><button class="back" data-a="go" data-h="#/">${icon('chevL', 22, 2.4)}Lists</button></div><div class="empty"><div class="big">List not found</div>It may have been deleted, or you’re no longer on it.</div>`;
  const people = listMembers(l).map((m) => m.id);
  const head = `<div class="nav">
      <button class="back" data-a="go" data-h="#/">${icon('chevL', 22, 2.4)}Lists</button>
      <div class="actions">
        <button data-a="share" data-id="${l.id}" aria-label="Sharing">${avatarStack(people, 28)}</button>
        <button class="icon-btn" data-a="listMenu" data-id="${l.id}" aria-label="List options">${icon('more', 20, 2.6)}</button>
      </div></div>
    <div class="eyebrow" style="color:${isLight(listColour(l)) ? `color-mix(in srgb, ${listColour(l)} 55%, var(--label))` : listColour(l)}">${TYPES[l.type].name}${isOwner(l) ? '' : ' · ' + esc(memberName(l.owner)) + '’s list'}</div>
    <h1 class="large">${esc(l.title)}</h1>${l.type === 'packing' ? '' : listCountdowns(l)}`;
  const body = { shopping: shoppingView, todo: todoView, work: workView, christmas: christmasView, packing: packingView, meals: mealsView, notice: noticeView }[l.type](l);
  return `<div style="--c:${listColour(l)}">${head}${body}</div>`;
}

function itemRow(it, l, opts = {}) {
  const subs = childrenOf(it.id);
  const meta = [];
  if (opts.context) meta.push(`<span>${esc(l.title)}${it.parent_id ? ' · ' + esc(getItem(it.parent_id)?.text || '') : ''}</span>`);
  if (['todo', 'work'].includes(l.type)) { const pp = priPill(it); if (pp) meta.push(pp); }
  if (it.due) meta.push(`<span class="pill ${!it.done && it.due < today() ? 'red' : it.due === today() ? 'orange' : ''}">${fmtDue(it.due)}</span>`);
  if (it.quantity) meta.push(`<span class="pill">${l.type === 'packing' && /^\d+$/.test(it.quantity) ? '×' + esc(it.quantity) : esc(it.quantity)}</span>`);
  if (l.type === 'work' && it.status === 'doing' && !opts.context) meta.push(`<span class="pill blue">Doing</span>`);
  let gift = null;
  if (l.type === 'christmas' && !it.parent_id) {
    if (isMyWish(it)) meta.push('<span class="pill">On your list</span>');
    else {
      gift = giftOf(it.id);
      const st = gift?.status || 'idea';
      meta.push(`<span class="pill ${st === 'bought' ? 'blue' : st === 'wrapped' ? 'green' : ''}">${GIFT_STATUS[st]}</span>`);
      if (gift?.buyer) meta.push(`<span>${esc(memberName(gift.buyer))} buying</span>`);
    }
    if (it.data?.price) meta.push(`<span class="price">${money(+it.data.price)}</span>`);
    if ((it.hidden_from || []).length) meta.push(`<span>🤫 hidden from ${it.hidden_from.map(memberName).join(', ')}</span>`);
  }
  if (subs.length) meta.push(`<span>${subs.filter((s) => s.done).length}/${subs.length} sub-tasks</span>`);
  if (it.notes && l.type !== 'notice') meta.push('<span>📝</span>');
  if (l.type === 'shopping' && it.created_by && it.created_by !== S.me && !it.assignees.length) meta.push(`<span>added by ${esc(memberName(it.created_by))}${it.data?.via === 'alexa' ? ' via Alexa' : ''}</span>`);
  else if (it.data?.via === 'alexa' && !opts.context && !it.done) meta.push('<span>via Alexa</span>');
  const xmas = l.type === 'christmas' && !it.parent_id;
  const half = xmas && gift?.status === 'bought';
  const on = xmas ? gift?.status === 'wrapped' : it.done;
  const c = listColour(l);
  const box = xmas && isMyWish(it)
    ? `<span class="wish" style="--c:${c}" aria-hidden="true">${icon('gift', 16, 2)}</span>`
    : `<button class="check ${on ? 'on' : half ? 'half' : ''}" style="--c:${c}" data-a="toggle" data-id="${it.id}" aria-label="Tick"></button>`;
  return `<div class="row item ${on ? 'done' : ''}" style="--indent:50px" ${opts.context ? '' : `data-iid="${it.id}"`}>
    ${box}
    <div class="row-main" data-a="openItem" data-id="${it.id}"><div class="row-title">${esc(it.text)}</div>${meta.length ? `<div class="row-meta">${meta.join('')}</div>` : ''}</div>
    ${xmas ? '' : avatarStack(it.assignees, 22)}</div>`;
}
const quickAdd = (l, ph, extra = '') => `<div class="quick"><span class="plus">${icon('plus', 22, 2.4)}</span><input id="qa-${l.id}" placeholder="${ph}" enterkeyhint="done" autocomplete="off" data-enter="quickAdd" data-id="${l.id}"${l.type === 'shopping' ? ' data-input="shopSuggest"' : ''}>${extra}</div>${l.type === 'shopping' ? `<div class="suggest" id="sg-${l.id}"></div>` : ''}`;
function suggestChips(l, q) {
  q = q.trim().toLowerCase();
  if (q.length < 1) return '';
  const words = parseQty(q).text.toLowerCase() || q;
  const hits = pastSorted(l.id).filter((i) => i.text.toLowerCase().split(/\s+/).some((w) => w.startsWith(words)) || i.text.toLowerCase().startsWith(words)).slice(0, 6);
  return hits.length ? `<span class="muted">Used before</span>${hits.map((i) => `<button class="chip" data-a="restorePast" data-id="${i.id}">${icon('plus', 13, 2.6)}${esc(i.text)}</button>`).join('')}` : '';
}
function pastSection(l) {
  const past = pastSorted(l.id);
  if (!past.length) return '';
  const open = ui('showPast-' + l.id, true), all = ui('allPast-' + l.id, false), edit = ui('editPast-' + l.id, false);
  const shown = all || edit ? past : past.slice(0, 18);
  return `<div class="section-label"><span>Used before (${past.length})</span><span>${open ? `<button data-a="toggleUi" data-k="editPast-${l.id}">${edit ? 'Done' : 'Edit'}</button> · ` : ''}<button data-a="toggleUi" data-k="showPast-${l.id}">${open ? 'Hide' : 'Show'}</button></span></div>
    ${open ? `<div class="past-chips">${shown.map((i) => edit
      ? `<button class="chip forget" data-a="forgetPast" data-id="${i.id}" aria-label="Forget ${esc(i.text)}">${esc(i.text)}<span class="x">×</span></button>`
      : `<button class="chip" data-a="restorePast" data-id="${i.id}" aria-label="Add ${esc(i.text)} back to the list">${icon('plus', 13, 2.6)}${esc(i.text)}</button>`).join('')}
      ${!all && !edit && past.length > shown.length ? `<button class="chip more" data-a="toggleUi" data-k="allPast-${l.id}">Show all ${past.length}</button>` : ''}</div>
      <p class="hint" style="margin:8px 4px 0">${edit ? 'Tap an item to forget it.' : 'Tap to put something back on the list.'}</p>` : ''}`;
}
const doneSection = (l, done, label, limit = 30) => {
  if (!done.length) return '';
  const open = ui('showDone-' + l.id, l.type === 'shopping');
  return `<div class="section-label"><span>${label} (${done.length})</span><span>${isAdmin(l) || done.every((d) => d.created_by === S.me) ? `<button data-a="clearDone" data-id="${l.id}">Clear</button> · ` : ''}<button data-a="toggleUi" data-k="showDone-${l.id}">${open ? 'Hide' : 'Show'}</button></span></div>
    ${open ? `<div class="group">${done.slice(0, limit).map((i) => itemRow(i, l)).join('')}</div>` : ''}`;
};
function mineToggle(l) {
  const on = ui('mine-' + l.id, false);
  return `<div class="seg" style="margin:12px 0 0"><button class="${on ? '' : 'on'}" data-a="setUi" data-k="mine-${l.id}" data-v="0">Everyone</button><button class="${on ? 'on' : ''}" data-a="setUi" data-k="mine-${l.id}" data-v="1">Just mine</button></div>`;
}

/* ---------- Shopping ---------- */
function shoppingView(l) {
  const items = itemsOf(l.id);
  const open = items.filter((i) => !i.done), done = items.filter((i) => i.done);
  let body = '';
  for (const a of AISLES) {
    const rows = open.filter((i) => (i.category || 'Other') === a);
    if (rows.length) body += `<div class="section-label">${a}</div><div class="group" data-reorder>${rows.map((i) => itemRow(i, l)).join('')}</div>`;
  }
  if (!open.length) body = `<div class="empty"><div class="big">${done.length ? 'Everything’s in the trolley 🛒' : 'Nothing on the list'}</div>Type what you need — try “2 milk” or “500g mince”. Items are sorted into aisles automatically.</div>`;
  return quickAdd(l, 'Add an item') + body + doneSection(l, done, 'In the trolley') + pastSection(l);
}

/* ---------- To do ---------- */
function todoView(l) {
  let items = itemsOf(l.id);
  if (ui('mine-' + l.id, false)) items = items.filter((i) => i.assignees.includes(S.me) || childrenOf(i.id).some((s) => s.assignees.includes(S.me)));
  const open = items.filter((i) => !i.done), done = items.filter((i) => i.done);
  let body = priorityGroups(open, l);
  if (!open.length) body = `<div class="empty"><div class="big">Nothing to do</div>Add a task, then tap it to set a due date, assign it, or break it into sub-tasks.</div>`;
  return quickAdd(l, 'New task') + mineToggle(l) + body + doneSection(l, done, 'Completed') + outlookBar(l);
}

function priorityGroups(rows, l, sort = 'order') {
  const used = PRI_ORDER.filter((p) => rows.some((i) => priOf(i) === p));
  const byDue = (a, b) => (a.due || '9999') < (b.due || '9999') ? -1 : (a.due || '9999') > (b.due || '9999') ? 1 : a.position - b.position;
  let html = '';
  for (const p of used) {
    const g = rows.filter((i) => priOf(i) === p).sort(sort === 'due' ? byDue : (a, b) => a.position - b.position);
    const info = PRIORITY.find((x) => x.v === p);
    const label = p ? info.label : used.length > 1 ? 'Everything else' : '';
    html += `${label ? `<div class="section-label"><span class="pri-label ${info.cls || ''}">${label}</span><span class="muted">${g.length}</span></div>` : '<div style="height:14px"></div>'}<div class="group"${sort === 'due' ? '' : ' data-reorder'}>${g.map((i) => itemRow(i, l)).join('')}</div>`;
  }
  return html;
}

/* ---------- Work ---------- */
// Changing a task's date also moves a countdown made from it (keeping its time of day)
async function setItemDue(it, due) {
  if (!it) return;
  await upd('items', { id: it.id }, { due });
  const cd = it.data?.cd && (S.data.countdowns || []).find((c) => c.id === it.data.cd);
  if (cd && due) {
    const t = new Date(cd.target), hm = `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
    await upd('countdowns', { id: cd.id }, { target: new Date(`${due}T${hm}`).toISOString() });
  }
}
function cdShort(c) {
  const ms = new Date(c.target) - Date.now();
  if (ms <= 0) return 'Here!';
  const d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24;
  return d >= 1 ? `${d} day${d === 1 ? '' : 's'}${d < 3 && h ? ` ${h}h` : ''} to go` : `${h}h ${Math.floor(ms / 6e4) % 60}m to go`;
}
/* ---------- Work: calendar by day, priority rows ---------- */
const WORK_VIEWS = [['day', 'Today'], ['3', '3 days'], ['week', 'Week'], ['list', 'List']];
const PRI_BANDS = [[3, 'Urgent & important', 'U&I', 'red'], [2, 'Urgent', 'Urgent', 'orange'], [1, 'Important', 'Important', 'blue'], [0, 'Everything else', 'Other', 'grey']];
// "This week" = the coming Friday (today if it's Friday)
function nextFriday(from = new Date()) { const d = new Date(from); d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7)); return ymd(d); }
const DUE_SHORTCUTS = () => [['today', 'Today', today()], ['tomorrow', 'Tomorrow', ymd(addDays(new Date(), 1))], ['week', 'This week', nextFriday()]];
function workDueChips(l) {
  const on = ui('wdue-' + l.id, '');
  return `<div class="due-chips">${DUE_SHORTCUTS().map(([k, label, d]) => `<button class="chip ${on === k ? 'on' : ''}" data-a="setWorkDue" data-id="${l.id}" data-v="${k}">${label}${k === 'week' ? ` <i>· ${new Date(d + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}</i>` : ''}</button>`).join('')}</div>`;
}
function workView(l) {
  let items = itemsOf(l.id);
  if (ui('mine-' + l.id, false)) items = items.filter((i) => i.assignees.includes(S.me));
  let st = ui('ws-' + l.id, 'active');
  if (st !== 'done') st = 'active';
  const isDone = (i) => i.status === 'done' || i.done;
  const active = items.filter((i) => !isDone(i)), done = items.filter(isDone);
  const view = pref('workView', 'week');
  const seg = `<div class="seg" style="margin:12px 0 0"><button class="${st === 'active' ? 'on' : ''}" data-a="setUi" data-k="ws-${l.id}" data-v="active">Active · ${active.length}</button><button class="${st === 'done' ? 'on' : ''}" data-a="setUi" data-k="ws-${l.id}" data-v="done">Done · ${done.length}</button></div>`;
  const mine = listMembers(l).length > 1 ? mineToggle(l) : '';
  if (st === 'done') {
    const list = done.length ? priorityGroups(done.slice(0, 40), l, 'order') : '<div class="empty">Nothing finished yet.</div>';
    const clear = done.length && isAdmin(l) ? `<button class="link-btn" data-a="clearDone" data-id="${l.id}">Clear finished tasks</button>` : '';
    return quickAdd(l, 'New work task') + workDueChips(l) + seg + list + clear + outlookBar(l) + mine;
  }
  const views = `<div class="seg small cal-views">${WORK_VIEWS.map(([k, t]) => `<button class="${view === k ? 'on' : ''}" data-a="setWorkView" data-v="${k}">${t}</button>`).join('')}</div>`;
  let body;
  if (view === 'list') {
    const sort = pref('workSort', 'order');
    const sortBar = active.length > 1 ? `<div class="sort-row"><span class="muted">Sort</span><div class="seg small"><button class="${sort === 'order' ? 'on' : ''}" data-a="setWorkSort" data-v="order">My order</button><button class="${sort === 'due' ? 'on' : ''}" data-a="setWorkSort" data-v="due">Due date</button></div></div>` : '';
    body = sortBar + (active.length ? priorityGroups(active, l, sort) : '<div class="empty">Nothing to do. Add a task above.</div>');
  } else body = workCalendar(l, active, view === 'day' ? 1 : view === '3' ? 3 : 7);
  return quickAdd(l, 'New work task') + workDueChips(l) + seg + views + body + outlookBar(l) + mine;
}
function workCalendar(l, items, n, multi = false) {
  const t = today();
  const days = Array.from({ length: n }, (_, i) => ymd(addDays(new Date(), i)));
  const last = days[days.length - 1];
  const colOf = (i) => (!i.due ? 'later' : i.due <= t ? t : i.due > last ? 'later' : i.due);
  const cols = [...days.map((d) => ({ key: d, due: d })), { key: 'later', due: '' }];
  const head = cols.map((c) => {
    const cnt = items.filter((i) => colOf(i) === c.key).length;
    if (c.key === 'later') return `<div class="cal-h later"><b>Later</b><span>${cnt ? cnt + ' · ' : ''}after that / no date</span></div>`;
    const dt = new Date(c.key + 'T12:00'), we = [0, 6].includes(dt.getDay());
    return `<div class="cal-h ${c.key === t ? 'today' : ''} ${we ? 'we' : ''}"><b>${c.key === t ? 'Today' : c.key === days[1] ? 'Tomorrow' : dt.toLocaleDateString('en-GB', { weekday: 'long' })}</b><span>${dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}${cnt ? ` · ${cnt}` : ''}</span></div>`;
  }).join('');
  const card = (i) => {
    const late = i.due && i.due < t;
    const subs = childrenOf(i.id), sd = subs.filter((x) => x.done).length;
    const meta = [];
    if (late) meta.push(`<span class="late">${fmtDue(i.due)}</span>`);
    else if (colOf(i) === 'later' && i.due) meta.push(`<span>${new Date(i.due + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</span>`);
    if (i.status === 'doing') meta.push('<span class="doing">Doing</span>');
    if (subs.length) meta.push(`<span>${sd}/${subs.length}</span>`);
    const L = multi ? getList(i.list_id) : l;
    if (multi && L) meta.unshift(`<span class="lst" style="--c:${listColour(L)}">${esc(L.title)}</span>`);
    return `<div class="cal-card ${late ? 'is-late' : ''}" data-iid="${i.id}"><button class="check sm" style="--c:${listColour(L)}" data-a="toggle" data-id="${i.id}" aria-label="Done"></button><div class="cc-main" data-a="openItem" data-id="${i.id}"><div class="cc-t">${esc(i.text)}</div>${meta.length || (i.assignees || []).some((a) => a !== S.me) ? `<div class="cc-m">${meta.join('')}${(i.assignees || []).filter((a) => a !== S.me).length ? avatarStack(i.assignees, 16) : ''}</div>` : ''}</div></div>`;
  };
  const sortIn = (a, b) => (a.due || '9999').localeCompare(b.due || '9999') || a.position - b.position;
  const bands = PRI_BANDS.map(([p, label, short, cls]) => {
    const inBand = items.filter((i) => priOf(i) === p);
    return `<div class="cal-band ${inBand.length ? '' : 'is-empty'}"><div class="cal-bl ${cls}"><span>${label}</span>${inBand.length ? `<i>${inBand.length}</i>` : ''}</div>
      <div class="cal-row">${cols.map((c) => `<div class="cal-cell ${c.key === 'later' ? 'later' : ''}" data-cell data-due="${c.due}" data-pri="${p}">${inBand.filter((i) => colOf(i) === c.key).sort(sortIn).map(card).join('')}</div>`).join('')}</div></div>`;
  }).join('');
  return `<div class="cal n${n}"><div class="cal-scroll"><div class="cal-grid" style="--cols:${cols.length}"><div class="cal-row cal-head">${head}</div>${bands}</div></div>
    <p class="hint" style="margin:10px 4px 0">Press and hold a task to move it to another day or priority. Overdue tasks sit in Today.</p></div>`;
}
/* ---------- Christmas ---------- */
function giftFor(it) { return it.data?.for || 'unsorted'; }
function forLabel(f) { return member(f) ? member(f).name : f === 'unsorted' ? 'Not decided yet' : f; }
function christmasView(l) {
  const items = itemsOf(l.id);
  const fors = [...new Set(items.map(giftFor))].sort((a, b) => (member(a) ? member(a).sort : 10) - (member(b) ? member(b).sort : 10) || a.localeCompare(b));
  const total = items.reduce((s, i) => s + (+i.data?.price || 0), 0);
  const bought = items.filter((i) => !isMyWish(i) && ['bought', 'wrapped'].includes(giftState(i.id))).reduce((s, i) => s + (+i.data?.price || 0), 0);
  const curFor = ui('for-' + l.id, null);
  const chips = `<div class="chips" style="margin:10px -16px 0">${membersSorted().map((m) => `<button class="chip ${curFor === m.id ? 'on' : ''}" data-a="setUi" data-k="for-${l.id}" data-v="${m.id}"><span class="dot" style="--c:${m.colour}"></span>For ${esc(m.name)}</button>`).join('')}<button class="chip ${curFor && !member(curFor) ? 'on' : ''}" data-a="forOther" data-id="${l.id}">${curFor && !member(curFor) ? 'For ' + esc(curFor) : 'Someone else…'}</button></div>`;
  let body = `<div class="tiles" style="margin-top:14px"><div class="tile"><div class="num price">${money(total)}</div><div class="lbl">Planned</div></div><div class="tile"><div class="num price">${money(bought)}</div><div class="lbl">Bought so far</div></div></div>`;
  for (const f of fors) {
    const rows = items.filter((i) => giftFor(i) === f);
    const sum = rows.reduce((s, i) => s + (+i.data?.price || 0), 0);
    const doneN = rows.filter((i) => giftState(i.id) === 'wrapped').length;
    const mine = f === S.me;
    body += `<div class="ghead">${member(f) ? avatar(f, 30) : `<span class="tile-icon sm" style="--c:#8E8E93">${icon('gift', 16)}</span>`}<span class="t">${mine ? 'Your list' : esc(forLabel(f))}</span><span class="s">${mine ? `${rows.length} idea${rows.length === 1 ? '' : 's'}` : `${doneN}/${rows.length} wrapped`}${sum ? ' · ' + money(sum) : ''}</span></div>
      <div class="group" data-reorder>${rows.map((i) => itemRow(i, l)).join('')}</div>
      ${mine ? '<p class="hint">You won’t see when any of these are bought 🤫</p>' : ''}`;
  }
  if (!items.length) body += '<div class="empty"><div class="big">No gift ideas yet</div>Pick who it’s for, then add ideas. Tap the circle to move a gift from Idea → Bought → Wrapped. The person a gift is for never sees that it’s been bought.</div>';
  return quickAdd(l, curFor ? `Gift idea for ${forLabel(curFor)}` : 'Gift idea (pick who it’s for below)') + chips + body;
}

/* ---------- Packing ---------- */
function packingView(l) {
  const items = itemsOf(l.id);
  const people = listMembers(l);
  const cur = ui('bag-' + l.id, S.me);
  const bags = [...people.map((m) => m.id), 'shared'];
  const chips = `<div class="chips" style="margin:10px -16px 0">${bags.map((b) => `<button class="chip ${cur === b ? 'on' : ''}" data-a="setUi" data-k="bag-${l.id}" data-v="${b}">${b === 'shared' ? '🧳 Shared' : `<span class="dot" style="--c:${member(b).colour}"></span>${esc(member(b).name)}’s bag`}</button>`).join('')}</div>`;
  const all = items.length, packed = items.filter((i) => i.done).length;
  let body = `<div class="ghead" style="margin-top:16px"><span class="t" style="flex:none">${packed} of ${all} packed</span><div class="bar" style="max-width:none"><i style="width:${all ? (packed / all) * 100 : 0}%"></i></div></div>`;
  for (const b of bags) {
    const rows = items.filter((i) => (i.data?.bag || 'shared') === b);
    if (!rows.length) continue;
    const p = rows.filter((i) => i.done).length;
    rows.sort((a, z) => a.done - z.done || a.position - z.position);
    body += `<div class="ghead">${b === 'shared' ? `<span class="tile-icon sm" style="--c:${listColour(l)}">${icon('bag', 16)}</span>` : avatar(b, 30)}<span class="t">${b === 'shared' ? 'Shared' : esc(member(b).name)}</span><span class="s">${p}/${rows.length}</span><div class="bar" style="--c:${b === 'shared' ? listColour(l) : member(b).colour}"><i style="width:${(p / rows.length) * 100}%"></i></div></div><div class="group" data-reorder>${rows.map((i) => itemRow(i, l)).join('')}</div>`;
  }
  if (!all) body += '<div class="empty"><div class="big">Nothing packed yet</div>Choose whose bag above, then add things — or start from the essentials list.</div>';
  return departureCards(l) + quickAdd(l, cur === 'shared' ? 'Add to the shared bag — try “8 socks”' : `Add to ${member(cur)?.name || 'your'}’s bag — try “underwear x8”`) + chips +
    `<button class="link-btn" data-a="essentials" data-id="${l.id}">+ Add the essentials</button>` + body;
}

/* ---------- Meal planner ---------- */
function mealsView(l) {
  const off = ui('week-' + l.id, 0);
  const ws = addDays(startOfWeek(new Date()), off * 7);
  const slots = l.settings?.slots?.length ? l.settings.slots : ['dinner'];
  const people = listMembers(l);
  const label = off === 0 ? 'This week' : off === 1 ? 'Next week' : off === -1 ? 'Last week' : `Week of ${ws.getDate()} ${MONTHS[ws.getMonth()]}`;
  let html = `<div class="week-nav"><button class="icon-btn" data-a="week" data-id="${l.id}" data-d="-1">${icon('chevL', 18, 2.6)}</button><div class="label">${label}<small>${fmtDay(ws)} – ${fmtDay(addDays(ws, 6))}</small></div><button class="icon-btn" data-a="week" data-id="${l.id}" data-d="1">${icon('chevR', 18, 2.6)}</button></div>`;
  for (let i = 0; i < 7; i++) {
    const d = addDays(ws, i), day = ymd(d), isToday = day === today();
    html += `<div class="day ${isToday ? 'today' : ''} ${slots.length === 1 ? 'one-slot' : ''}"><div class="day-head"><b>${DAYS[d.getDay()]} ${d.getDate()}</b><span>${isToday ? 'Today' : MONTHS[d.getMonth()]}</span></div>`;
    for (const slot of slots) {
      const s = S.data.meal_slots.find((m) => m.list_id === l.id && m.day === day && m.slot === slot) || {};
      const pres = (mid) => S.data.meal_presence.find((p) => p.list_id === l.id && p.day === day && p.slot === slot && p.member === mid);
      const homeN = people.filter((m) => ['home', 'late'].includes(pres(m.id)?.status)).length;
      const known = people.filter((m) => pres(m.id)).length;
      html += `<div class="slot"><div class="slot-top" data-a="meal" data-id="${l.id}" data-day="${day}" data-slot="${slot}">
          ${slots.length > 1 ? `<span class="slot-name">${SLOTS[slot]}</span>` : ''}<span class="slot-meal ${s.meal ? '' : 'ph'}">${s.meal ? esc(s.meal) : 'Add a meal'}</span>
          ${s.cook ? `<span title="Cooking">👩‍🍳</span>${avatar(s.cook, 22)}` : ''}</div>
        <div class="presence">${people.map((m) => { const p = pres(m.id); return `<button class="pres ${p ? p.status : 'unset'}" data-a="presence" data-id="${l.id}" data-day="${day}" data-slot="${slot}" data-m="${m.id}" aria-label="${esc(m.name)}">${avatar(m.id, 30)}</button>`; }).join('')}
          <span class="headcount">${known ? `${homeN} home` : 'Who’s in?'}</span></div></div>`;
    }
    html += '</div>';
  }
  html += '<div class="legend"><span>Tap a face: home → out → late → not sure</span></div>';
  if (isAdmin(l)) {
    const hidden = Object.keys(SLOTS).filter((k) => !slots.includes(k));
    html += `<div class="legend">${hidden.map((k) => `<button class="link-btn" data-a="slotToggle" data-id="${l.id}" data-s="${k}">+ Show ${SLOTS[k].toLowerCase()}</button>`).join('')}${slots.filter((k) => k !== 'dinner').map((k) => `<button class="link-btn" data-a="slotToggle" data-id="${l.id}" data-s="${k}">Hide ${SLOTS[k].toLowerCase()}</button>`).join('')}</div>`;
  }
  return html;
}

/* ---------- Notice board ---------- */
function expired(i) { return i.data?.until && i.data.until < today(); }
function noticeView(l) {
  const all = itemsOf(l.id);
  const showOld = ui('old-' + l.id, false);
  const items = all.filter((i) => showOld || !expired(i)).sort((a, b) => (b.data?.pinned ? 1 : 0) - (a.data?.pinned ? 1 : 0) || b.position - a.position);
  const oldN = all.filter(expired).length;
  const cards = items.map((n) => {
    const seen = n.data?.seen || [];
    const c = n.data?.colour || listColour(l);
    const mine = n.created_by === S.me;
    return `<div class="note tint" style="--c:${c}" data-a="openNotice" data-id="${n.id}" data-iid="${n.id}">
      ${n.data?.pinned ? `<span class="pin">${icon('pin', 18, 2.2)}</span>` : ''}
      <h4>${esc(n.text)}</h4>${n.notes ? `<p>${esc(n.notes)}</p>` : ''}
      <div class="note-foot">${avatar(n.created_by, 22)}<span>${esc(memberName(n.created_by))} · ${timeAgo(n.created_at)}${n.data?.until ? ` · until ${fmtDay(parseYmd(n.data.until))}` : ''}</span>
        <span class="seen">${seen.length ? `<span class="muted">Seen</span>${avatarStack(seen, 20)}` : ''}${!mine && !seen.includes(S.me) ? `<button class="seen-btn" data-a="seen" data-id="${n.id}">Mark seen</button>` : ''}</span></div></div>`;
  }).join('');
  return `<button class="btn tinted" data-a="newNotice" data-id="${l.id}" style="--c:${listColour(l)}">${icon('plus', 20, 2.4)} New note</button>
    <div class="notes" style="margin-top:14px" data-reorder data-order="desc">${cards || '<div class="empty"><div class="big">The board is empty</div>Post reminders, plans and house rules for everyone on this board.</div>'}</div>
    ${oldN ? `<button class="link-btn" data-a="toggleUi" data-k="old-${l.id}">${showOld ? 'Hide' : 'Show'} ${oldN} expired note${oldN === 1 ? '' : 's'}</button>` : ''}`;
}

/* ============================================================
   Sheets
   ============================================================ */
function openSheet(s) { S.sheets.push({ ...s, fresh: true }); renderSheets(true); }
function closeSheet() { S.sheets.pop(); renderSheets(true); render(); }
function renderSheets(force) {
  const host = $('#sheets');
  const ae = document.activeElement;
  if (!force && ae && host.contains(ae) && /INPUT|TEXTAREA|SELECT/.test(ae.tagName)) return; // don't disturb typing
  if (DRAG.active) { DRAG.pending = true; return; }
  const scrolls = [...host.querySelectorAll('.sheet')].map((el) => el.scrollTop);
  host.innerHTML = S.sheets.map((s, i) => {
    const html = sheetHtml(s);
    const cls = s.fresh ? ' enter' : '';
    return `<div class="scrim${cls}" data-a="closeSheet" style="z-index:${40 + i * 2}"></div><div class="sheet${cls}" style="z-index:${41 + i * 2}"><div class="grab"></div>${html}</div>`;
  }).join('');
  host.querySelectorAll('.sheet').forEach((el, i) => { if (!S.sheets[i].fresh && scrolls[i]) el.scrollTop = scrolls[i]; });
  wireEyes(host);
  inkPass(host);
  const fresh = S.sheets.find((s) => s.fresh && s.focus);
  S.sheets.forEach((s) => { s.fresh = false; });
  if (fresh) setTimeout(() => { const el = document.getElementById(fresh.focus); if (el) el.focus(); }, 60);
}
const head = (title, left = '<button class="txt" data-a="closeSheet">Cancel</button>', right = '<button class="txt r" data-a="closeSheet">Done</button>') => `<div class="sheet-head">${left}<h3>${title}</h3>${right}</div>`;
const topSheet = () => S.sheets[S.sheets.length - 1];

function sheetHtml(s) {
  switch (s.kind) {
    case 'newList': return newListSheet(s);
    case 'share': return shareSheet(s);
    case 'listMenu': return listMenuSheet(s);
    case 'item': return itemSheet(s);
    case 'meal': return mealSheet(s);
    case 'notice': return noticeSheet(s);
    case 'essentials': return essentialsSheet(s);
    case 'install': return installSheet();
    case 'password': return passwordSheet();
    case 'import': return importSheet(s);
    case 'todo': return todoSheet(s);
    case 'alexa': return alexaSheet(s);
    case 'outlook': return outlookSheet(s);
    case 'countdown': return countdownSheet(s);
    case 'homeEdit': return homeEditSheet();
    case 'bEntry': return budgetEntrySheet(s);
    case 'bPot': return budgetPotSheet(s);
    case 'bAccounts': return budgetAccountsSheet(s);
    case 'bImport': return importSheetB(s);
    case 'bTxn': return txnSheet(s);
  }
  return '';
}

/* ---------- New list ---------- */
const GIFT_OCCASIONS = () => { const y = new Date().getMonth() === 11 && new Date().getDate() > 26 ? new Date().getFullYear() + 1 : new Date().getFullYear(); return [`Christmas ${y}`, 'Birthday', 'Wedding', 'Christening', 'Baby shower', 'Anniversary']; };
function newListSheet(s) {
  const d = s.draft;
  const others = membersSorted().filter((m) => m.id !== S.me);
  return head('New list', undefined, `<button class="txt r" data-a="createList" ${d.title.trim() ? '' : 'disabled style="opacity:.4"'}>Create</button>`) + `
    <div class="types" style="margin-top:6px">${TYPE_ORDER.map((t) => `<button class="type-card ${d.type === t ? 'on' : ''}" style="--c:${TYPES[t].colour}" data-a="pickType" data-t="${t}"><span class="tile-icon sm" style="--c:${TYPES[t].colour}">${icon(TYPES[t].icon, 18)}</span><b>${TYPES[t].name}</b><span>${TYPES[t].desc}</span></button>`).join('')}</div>
    <div class="section-label">Name</div>
    <input class="big-input" id="nl-title" value="${esc(d.title)}" placeholder="List name" data-input="nlTitle" autocomplete="off">
    ${d.type === 'christmas' ? `<div class="past-chips" style="margin-top:10px">${GIFT_OCCASIONS().map((o) => `<button class="chip ${d.title === o ? 'on' : ''}" data-a="nlOccasion" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div>` : ''}
    <div class="section-label">Colour</div>
    ${swatchHtml(d.colour, 'data-a="nlColour"')}
    <div class="section-label"><span>Who can see it</span><button data-a="nlAllAdmin">${others.every((m) => d.share[m.id] === 'admin') ? 'Undo admins' : 'Everyone admin'}</button></div>
    <div class="group" style="--indent:60px">${others.map((m) => shareRowHtml(m, d.share[m.id], 'nlShare')).join('')}</div>
    <p class="hint">Only you can change who sees this list. Admins can rename it, change settings and tidy up anyone’s items. Everyone you add gets a notification.</p>`;
}
function shareRowHtml(m, role, action, disabled = false) {
  const opt = (v, label) => `<button class="${(role || 'off') === v ? 'on' : ''}" ${disabled ? 'disabled' : `data-a="${action}" data-m="${m.id}" data-v="${v}"`}>${label}</button>`;
  return `<div class="row share-row">${avatar(m.id, 36)}<div class="row-main"><div class="row-title">${esc(m.name)}</div></div><div class="mini-seg">${opt('off', 'Hidden')}${opt('member', 'Can see')}${opt('admin', 'Admin')}</div></div>`;
}

/* ---------- Share ---------- */
function shareSheet(s) {
  const l = getList(s.id);
  if (!l) return head('Sharing');
  const owner = member(l.owner);
  const others = membersSorted().filter((m) => m.id !== l.owner);
  const roleOf = (mid) => accessOf(l.id).find((a) => a.member === mid)?.role;
  return head('Who can see this', '<span></span>') + `
    <div class="group" style="--indent:60px"><div class="row">${avatar(owner.id, 36)}<div class="row-main" style="cursor:default"><div class="row-title">${esc(owner.name)}</div><div class="row-sub">Owner</div></div></div></div>
    <div class="section-label"><span>Family</span>${isOwner(l) ? `<button data-a="shareAllAdmin" data-id="${l.id}">Everyone admin</button>` : ''}</div>
    <div class="group" style="--indent:60px">${others.map((m) => shareRowHtml(m, roleOf(m.id), 'shareSet', !isOwner(l))).join('')}</div>
    <p class="hint">${isOwner(l) ? 'People you add are told straight away. Admins can rename the list, change settings and clear anyone’s items, but only you decide who sees it.' : `Only ${esc(owner.name)} can change who sees this list.`}</p>
    ${!isOwner(l) ? `<div style="margin-top:20px"><button class="btn danger" data-a="leaveList" data-id="${l.id}">Leave this list</button></div>` : ''}`;
}

/* ---------- List options ---------- */
function listMenuSheet(s) {
  const l = getList(s.id);
  if (!l) return head('List');
  const admin = isAdmin(l);
  const slots = l.settings?.slots?.length ? l.settings.slots : ['dinner'];
  let html = head('List options', '<span></span>');
  if (admin) {
    html += `<div class="section-label">Name</div><input class="big-input" id="lm-title" value="${esc(l.title)}" data-change="renameList" data-id="${l.id}" autocomplete="off">
      <div class="section-label">Colour</div>${swatchHtml(listColour(l), `data-a="listColour" data-id="${l.id}"`)}`;
    if (l.type === 'meals') {
      html += `<div class="section-label">Meals to plan</div><div class="group">${Object.entries(SLOTS).map(([k, v]) => `<div class="row tap" data-a="slotToggle" data-id="${l.id}" data-s="${k}"><div class="row-main"><div class="row-title">${v}</div></div><span class="switch ${slots.includes(k) ? 'on' : ''}"></span></div>`).join('')}</div>`;
    }
  } else {
    html += `<p class="hint" style="margin-top:12px">${esc(memberName(l.owner))} owns this list. Ask them for admin rights to rename it or change settings.</p>`;
  }
  if (!['meals'].includes(l.type)) html += '<p class="hint" style="margin-top:14px">Tip: press and hold any item to pick it up and move it.</p>';
  html += '<div class="stack-gap" style="margin-top:22px">';
  html += `<button class="btn secondary" data-a="share" data-id="${l.id}">${icon('people', 20)} Sharing</button>`;
  if (!missing('countdowns')) html += `<button class="btn secondary" data-a="newCd" data-list="${l.id}" data-kind="${l.type === 'packing' ? 'departure' : 'general'}">${icon('cal', 20)} Add a countdown</button>`;
  if (!['meals', 'notice'].includes(l.type)) html += `<button class="btn secondary" data-a="openImport" data-tab="paste" data-id="${l.id}">${icon('list', 20)} Paste in items</button>`;
  if (admin && l.type === 'packing') html += `<button class="btn secondary" data-a="unpack" data-id="${l.id}">Unpack everything (reuse list)</button>`;
  if (admin && ['shopping', 'todo', 'work'].includes(l.type)) html += `<button class="btn secondary" data-a="clearDone" data-id="${l.id}">Clear completed items</button>`;
  if (isOwner(l)) html += `<button class="btn danger" data-a="deleteList" data-id="${l.id}">${icon('trash', 20)} Delete list</button>`;
  else html += `<button class="btn danger" data-a="leaveList" data-id="${l.id}">Leave list</button>`;
  return html + '</div>';
}

/* ---------- Item details ---------- */
function itemSheet(s) {
  const it = getItem(s.id);
  if (!it) return head('Item', '<span></span>') + '<div class="empty">This item has been removed.</div>';
  const l = getList(it.list_id);
  const T = l.type;
  const canDelete = isAdmin(l) || it.created_by === S.me;
  const people = listMembers(l);
  const allOn = people.every((m) => it.assignees.includes(m.id));
  const parent = it.parent_id ? getItem(it.parent_id) : null;
  let html = head(parent ? 'Sub-task' : T === 'shopping' ? 'Item' : T === 'christmas' ? 'Gift' : 'Task',
    canDelete ? `<button class="txt danger" data-a="deleteItem" data-id="${it.id}">Delete</button>` : '<span></span>');
  if (parent) html += `<button class="link-btn" data-a="openItem" data-id="${parent.id}" style="padding-top:0">↑ ${esc(parent.text)}</button>`;
  html += `<textarea class="big-input" id="it-text" rows="1" data-change="itemText" data-id="${it.id}">${esc(it.text)}</textarea>`;

  if ((people.length > 1 || T !== 'shopping') && !(T === 'christmas' && !parent)) {
    html += `<div class="section-label"><span>${T === 'packing' ? 'Who’s packing it' : 'Assigned to'}</span>${people.length > 2 ? `<button data-a="assignAll" data-id="${it.id}">${allOn ? 'Clear' : 'Everyone'}</button>` : ''}</div>
      <div class="group" style="padding:12px 10px"><div class="who">${people.map((m) => `<button class="${it.assignees.includes(m.id) ? 'on' : ''}" data-a="assign" data-id="${it.id}" data-m="${m.id}">${avatar(m.id, 46)}${esc(m.name)}</button>`).join('')}</div></div>`;
  }

  const f = [];
  if (['todo', 'work'].includes(T)) {
    f.push(`<div class="field"><label>Due</label><input type="date" value="${it.due || ''}" data-change="itemField" data-f="due" data-id="${it.id}"></div>`);
    f.push(`<div class="field col due-quick"><div class="due-chips" style="margin:0">${DUE_SHORTCUTS().map(([k, label, d]) => `<button class="chip ${it.due === d ? 'on' : ''}" data-a="setDue" data-id="${it.id}" data-v="${d}">${label}${k === 'week' ? ` <i>· ${new Date(d + 'T12:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}</i>` : ''}</button>`).join('')}${it.due ? `<button class="chip" data-a="setDue" data-id="${it.id}" data-v="">No date</button>` : ''}</div></div>`);
    if (it.due && !missing('countdowns')) {
      const cd = it.data?.cd && (S.data.countdowns || []).find((c) => c.id === it.data.cd);
      f.push(cd
        ? `<div class="field tap" data-a="editCd" data-id="${cd.id}"><label>${icon('cal', 16, 2.2)} Countdown</label><span class="muted">${esc(cdShort(cd))} ›</span></div>`
        : `<div class="field tap" data-a="taskCountdown" data-id="${it.id}"><label style="color:var(--accent)">${icon('cal', 16, 2.2)} Make a countdown</label><span class="muted">›</span></div>`);
    }
    f.push(`<div class="field col"><label>Priority</label><div class="pri-grid">${PRIORITY.map((p) => `<button class="pri ${p.cls || ''} ${priOf(it) === p.v ? 'on' : ''}" data-a="setPriority" data-id="${it.id}" data-v="${p.v}">${p.label}</button>`).join('')}</div></div>`);
  }
  if (T === 'work' && !parent) {
    f.push(`<div class="field"><label>Status</label><div class="seg" style="flex:1">${Object.entries(WORK_STATUS).map(([k, v]) => `<button class="${(it.status || 'todo') === k ? 'on' : ''}" data-a="workStatus" data-id="${it.id}" data-v="${k}">${v}</button>`).join('')}</div></div>`);
  }
  if (T === 'shopping') {
    f.push(`<div class="field"><label>Quantity</label><input value="${esc(it.quantity || '')}" placeholder="e.g. 2 or 500g" data-change="itemField" data-f="quantity" data-id="${it.id}"></div>`);
    f.push(`<div class="field"><label>Aisle</label><select data-change="itemField" data-f="category" data-id="${it.id}">${AISLES.map((a) => `<option ${(it.category || 'Other') === a ? 'selected' : ''}>${a}</option>`).join('')}</select></div>`);
  }
  if (T === 'christmas' && !parent) {
    const fr = it.data?.for || '';
    f.push(`<div class="field"><label>For</label><select data-change="giftFor" data-id="${it.id}" ${isMyWish(it) ? 'disabled' : ''}><option value="">Not decided</option>${membersSorted().map((m) => `<option value="${m.id}" ${fr === m.id ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}${fr && !member(fr) ? `<option selected>${esc(fr)}</option>` : ''}<option value="__other">Someone else…</option></select></div>`);
    f.push(`<div class="field"><label>Price (£)</label><input inputmode="decimal" value="${it.data?.price ?? ''}" placeholder="0.00" data-change="giftPrice" data-id="${it.id}"></div>`);
    f.push(`<div class="field"><label>Link</label><input type="url" value="${esc(it.data?.link || '')}" placeholder="Paste a shop link" data-change="giftLink" data-id="${it.id}"></div>`);
    if (it.data?.link) f.push(`<div class="field"><label></label><a href="${esc(it.data.link)}" target="_blank" rel="noopener" style="color:var(--accent);flex:1;text-align:right">Open link ↗</a></div>`);
  }
  if (T === 'packing') f.push(`<div class="field"><label>How many</label><input inputmode="numeric" value="${esc(it.quantity || '')}" placeholder="e.g. 8" data-change="itemField" data-f="quantity" data-id="${it.id}"></div>`);
  if (T === 'packing' && !parent) {
    const bag = it.data?.bag || 'shared';
    f.push(`<div class="field"><label>Bag</label><select data-change="packBag" data-id="${it.id}">${people.map((m) => `<option value="${m.id}" ${bag === m.id ? 'selected' : ''}>${esc(m.name)}’s bag</option>`).join('')}<option value="shared" ${bag === 'shared' ? 'selected' : ''}>Shared</option></select></div>`);
  }
  if (f.length) html += `<div class="group" style="margin-top:18px">${f.join('')}</div>`;

  if (T === 'christmas' && !parent && isMyWish(it)) {
    html += `<p class="hint" style="margin-top:12px">🎁 This is on your list. You won’t see if it’s been bought or wrapped — that stays a surprise.</p>`;
  }
  if (T === 'christmas' && !parent && !isMyWish(it)) {
    const g = giftOf(it.id) || {};
    const forM = member(it.data?.for);
    html += `<div class="section-label">Private${forM ? ` — hidden from ${esc(forM.name)}` : ''}</div>
      <div class="group">
        <div class="field"><label>Status</label><div class="seg" style="flex:1">${Object.entries(GIFT_STATUS).map(([k, v]) => `<button class="${(g.status || 'idea') === k ? 'on' : ''}" data-a="giftStatus" data-id="${it.id}" data-v="${k}">${v}</button>`).join('')}</div></div>
        <div class="field col"><label>Who’s buying it</label><div class="who">${people.filter((m) => m.id !== it.data?.for).map((m) => `<button class="${g.buyer === m.id ? 'on' : ''}" data-a="giftBuyer" data-id="${it.id}" data-m="${m.id}">${avatar(m.id, 40)}${esc(m.name)}</button>`).join('')}</div></div>
        <textarea class="textarea" style="min-height:64px;border-top:.5px solid var(--sep)" placeholder="Private note — where it’s from, where it’s hidden…" data-change="giftNote" data-id="${it.id}">${esc(g.note || '')}</textarea>
      </div>
      ${forM ? `<p class="hint">${esc(forM.name)} can${(it.hidden_from || []).includes(forM.id) ? '’t see this gift at all' : ' see this idea, but never its status, buyer or private note'}.</p>` : ''}`;
    const others = people.filter((m) => m.id !== S.me);
    if (others.length) {
      html += `<div class="section-label">🤫 Keep secret from</div><div class="group" style="padding:12px 10px"><div class="who">${others.map((m) => `<button class="${(it.hidden_from || []).includes(m.id) ? 'on' : ''}" data-a="secret" data-id="${it.id}" data-m="${m.id}">${avatar(m.id, 46)}${esc(m.name)}</button>`).join('')}</div></div>
      <p class="hint">Anyone ticked here won’t see this gift at all.</p>`;
    }
  }

  if (TYPES[T].sub && !parent) {
    const subs = childrenOf(it.id);
    html += `<div class="section-label">Sub-tasks${subs.length ? ` · ${subs.filter((x) => x.done).length}/${subs.length}` : ''}</div><div class="group" data-reorder>
      ${subs.map((x) => `<div class="row item ${x.done ? 'done' : ''}" style="--indent:48px" data-iid="${x.id}"><button class="check sm ${x.done ? 'on' : ''}" style="--c:${listColour(l)}" data-a="toggle" data-id="${x.id}"></button><div class="row-main" data-a="openItem" data-id="${x.id}"><div class="row-title" style="font-size:16px">${esc(x.text)}</div>${x.due ? `<div class="row-meta"><span class="pill ${!x.done && x.due < today() ? 'red' : ''}">${fmtDue(x.due)}</span></div>` : ''}</div>${avatarStack(x.assignees, 22)}</div>`).join('')}
      <div class="row" style="--indent:48px"><span class="plus" style="--c:${listColour(l)};width:20px">${icon('plus', 20, 2.4)}</span><input id="sub-${it.id}" placeholder="Add a sub-task" style="flex:1;border:0;outline:0;background:transparent;padding:8px 0" enterkeyhint="done" data-enter="addSub" data-id="${it.id}" autocomplete="off"></div></div>
      ${subs.length ? '<p class="hint">Tap a sub-task to assign it or give it a date.</p>' : ''}`;
  }

  html += `<div class="section-label">${T === 'christmas' && !parent ? 'Notes — everyone on the list can see' : 'Notes'}</div><div class="group"><textarea class="textarea" placeholder="Add notes" data-change="itemField" data-f="notes" data-id="${it.id}">${esc(it.notes || '')}</textarea></div>`;
  html += `<p class="hint">Added by ${esc(memberName(it.created_by))} · ${timeAgo(it.created_at)}${it.done && it.done_by ? ` · ticked by ${esc(memberName(it.done_by))}` : ''}</p>`;
  return html;
}

/* ---------- Meal ---------- */
function mealSheet(s) {
  const l = getList(s.id);
  const d = s.draft;
  const people = listMembers(l);
  const shopLists = S.data.lists.filter((x) => x.type === 'shopping');
  const date = parseYmd(s.day);
  return head(`${DAYS[date.getDay()]} ${date.getDate()} · ${SLOTS[s.slot]}`, undefined, '<button class="txt r" data-a="saveMeal">Save</button>') + `
    <input class="big-input" id="ml-meal" value="${esc(d.meal)}" placeholder="What’s for ${SLOTS[s.slot].toLowerCase()}?" data-input="mealField" data-f="meal" autocomplete="off" style="margin-top:6px">
    <div class="section-label">Who’s cooking</div>
    <div class="group" style="padding:12px 10px"><div class="who">${people.map((m) => `<button class="${d.cook === m.id ? 'on' : ''}" data-a="mealCook" data-m="${m.id}">${avatar(m.id, 46)}${esc(m.name)}</button>`).join('')}</div></div>
    <div class="section-label">Who’s home</div>
    <div class="group" style="padding:12px 10px"><div class="who">${people.map((m) => { const st = d.presence[m.id]; return `<button class="${st === 'home' || st === 'late' ? 'on' : ''}" data-a="mealPres" data-m="${m.id}">${avatar(m.id, 46)}${st === 'home' ? 'Home' : st === 'late' ? 'Late' : st === 'out' ? 'Out' : esc(m.name)}</button>`; }).join('')}</div></div>
    <div class="section-label">Ingredients</div>
    <div class="group"><textarea class="textarea" placeholder="One per line, e.g.&#10;500g mince&#10;Spaghetti&#10;Chopped tomatoes" data-input="mealField" data-f="ingredients">${esc(d.ingredients)}</textarea></div>
    ${shopLists.length ? `<div class="group" style="margin-top:10px"><div class="field"><label>Shopping list</label><select data-input="mealField" data-f="shopList">${shopLists.map((x) => `<option value="${x.id}" ${d.shopList === x.id ? 'selected' : ''}>${esc(x.title)}</option>`).join('')}</select></div></div>
      <div style="margin-top:10px"><button class="btn secondary" data-a="mealToShop">${icon('cart', 20)} Add ingredients to shopping</button></div>` : '<p class="hint">Make a shopping list to send ingredients straight to it.</p>'}
    <div class="section-label">Notes</div>
    <div class="group"><textarea class="textarea" placeholder="Recipe link, timings…" data-input="mealField" data-f="notes">${esc(d.notes)}</textarea></div>
    ${d.meal ? '<div style="margin-top:16px"><button class="btn danger" data-a="clearMeal">Clear this meal</button></div>' : ''}`;
}

/* ---------- Notice ---------- */
function noticeSheet(s) {
  const d = s.draft;
  const l = getList(s.listId);
  const editing = !!s.id;
  const it = editing ? getItem(s.id) : null;
  const canEdit = !editing || it?.created_by === S.me || isAdmin(l);
  if (!canEdit) {
    const seen = it.data?.seen || [];
    return head('Note', '<span></span>') + `<div class="note tint" style="--c:${it.data?.colour || listColour(l)};margin-top:6px"><h4>${esc(it.text)}</h4>${it.notes ? `<p>${esc(it.notes)}</p>` : ''}<div class="note-foot">${avatar(it.created_by, 22)}<span>${esc(memberName(it.created_by))} · ${timeAgo(it.created_at)}</span></div></div>
      <div class="section-label">Seen by</div><div class="group">${seen.length ? seen.map((m) => `<div class="row">${avatar(m, 30)}<div class="row-main"><div class="row-title">${esc(memberName(m))}</div></div></div>`).join('') : '<div class="row"><div class="row-main muted">Nobody yet</div></div>'}</div>
      ${!seen.includes(S.me) ? `<div style="margin-top:16px"><button class="btn" data-a="seen" data-id="${it.id}">Mark as seen</button></div>` : ''}`;
  }
  const ok = d.text.trim();
  return head(editing ? 'Edit note' : 'New note', editing ? `<button class="txt danger" data-a="deleteNotice">Delete</button>` : undefined, `<button class="txt r" data-a="saveNotice" ${ok ? '' : 'disabled style="opacity:.4"'}>${editing ? 'Save' : 'Post'}</button>`) + `
    <input class="big-input" id="nt-text" value="${esc(d.text)}" placeholder="Headline" data-input="noticeField" data-f="text" autocomplete="off" style="margin-top:6px">
    <div class="group" style="margin-top:10px"><textarea class="textarea" style="min-height:120px" placeholder="Write the note…" data-input="noticeField" data-f="notes">${esc(d.notes)}</textarea></div>
    <div class="section-label">Colour</div>${swatchHtml(d.colour, 'data-a="noticeColour"')}
    <div class="group" style="margin-top:18px">
      <div class="field tap" data-a="noticePin"><label>Pin to top</label><span style="flex:1"></span><span class="switch ${d.pinned ? 'on' : ''}"></span></div>
      <div class="field"><label>Show until</label><input type="date" value="${d.until || ''}" data-input="noticeField" data-f="until"></div>
    </div>
    <p class="hint">Leave “Show until” empty to keep it up until someone deletes it.</p>
    ${editing && it.data?.seen?.length ? `<div class="section-label">Seen by</div><div class="group" style="padding:10px 14px">${avatarStack(it.data.seen, 30)}</div>` : ''}`;
}

/* ---------- Packing essentials ---------- */
function essentialsSheet(s) {
  const l = getList(s.id);
  const bags = [...listMembers(l).map((m) => m.id), 'shared'];
  return head('Add the essentials', undefined, `<button class="txt r" data-a="addEssentials" ${s.pick.length ? '' : 'disabled style="opacity:.4"'}>Add</button>`) + `
    <p class="hint" style="margin-top:4px">Adds a starter set to each bag you choose. Anything already there is skipped.</p>
    <div class="group" style="margin-top:14px">${bags.map((b) => `<div class="row tap" data-a="pickBag" data-b="${b}">${b === 'shared' ? `<span class="tile-icon sm" style="--c:${listColour(l)}">${icon('bag', 16)}</span>` : avatar(b, 30)}<div class="row-main"><div class="row-title">${b === 'shared' ? 'Shared bag' : esc(member(b).name) + '’s bag'}</div><div class="row-sub">${(b === 'shared' ? PACK_SHARED : PACK_ESSENTIALS).length} items</div></div><span class="switch ${s.pick.includes(b) ? 'on' : ''}"></span></div>`).join('')}</div>
    <div class="section-label">Each person gets</div><p class="hint" style="margin-top:0">${PACK_ESSENTIALS.join(' · ')}</p>
    <div class="section-label">Shared bag gets</div><p class="hint" style="margin-top:0">${PACK_SHARED.join(' · ')}</p>`;
}

/* ---------- Import (Microsoft To Do / paste) ---------- */
const IMPORTABLE = ['todo', 'work', 'shopping', 'packing', 'christmas'];
const GRAPH_EXPLORER = 'https://developer.microsoft.com/en-us/graph/graph-explorer';
function parsePasted(text) {
  let lines = text.replace(/\r/g, '').split('\n');
  if (lines.filter((x) => x.trim()).length === 1 && /,/.test(text)) lines = text.split(',');
  const out = [];
  for (let raw of lines) {
    let t = raw
      .replace(/^\s*\[?\d{1,2}[\/.]\d{1,2}[\/.]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:[ap]m)?\]?\s*(?:-\s*)?[^:\n]{1,40}:\s*/i, '') // WhatsApp "[31/10/2026, 12:03] Louise:"
      .trim();
    if (!t) continue;
    let done = false;
    if (/^(?:[✓✔☑✅]|\[[xX]\])/.test(t)) done = true;
    t = t.replace(/^(?:[-*•·◦▪●○◯□☐✓✔☑✅]|\[[ xX]?\]|\d+[.)])\s*/, '').trim();
    if (!t || /^(completed|done|to do|tasks)\s*:?$/i.test(t)) continue;
    out.push({ text: t.slice(0, 300), done });
  }
  return out;
}
function importSheet(s) {
  const targets = S.data.lists.filter((l) => IMPORTABLE.includes(l.type));
  const tabs = `<div class="seg" style="margin:4px 0 14px">${[['todo', 'Microsoft To Do'], ['paste', 'Paste a list']].map(([k, v]) => `<button class="${s.tab === k ? 'on' : ''}" data-a="importTab" data-v="${k}">${v}</button>`).join('')}</div>`;
  let html = head('Import', '<span></span>') + tabs;
  if (s.tab === 'paste') {
    const n = parsePasted(s.text || '').length;
    html += `<div class="group"><div class="field"><label>Add to</label><select data-input="importField" data-f="target">${targets.map((l) => `<option value="${l.id}" ${s.target === l.id ? 'selected' : ''}>${esc(l.title)}</option>`).join('')}</select></div></div>
      <div class="group" style="margin-top:10px"><textarea class="textarea" id="imp-text" style="min-height:200px" placeholder="Paste here — one item per line, or a comma-separated list.&#10;&#10;WhatsApp names and times, bullets and tick boxes are removed for you." data-input="importText">${esc(s.text || '')}</textarea></div>
      <p class="hint" id="imp-count">${n ? `${n} item${n === 1 ? '' : 's'} ready to add` : 'Long-press a message in WhatsApp → Copy, then paste it here.'}</p>
      <div style="margin-top:14px"><button class="btn" data-a="importPaste" ${targets.length ? '' : 'disabled'}>Add items</button></div>
      ${targets.length ? '' : '<p class="hint">Make a list first, then come back to paste into it.</p>'}`;
    return html;
  }
  // Microsoft To Do
  if (!s.lists) {
    html += `<div class="group"><ol class="steps">
        <li>Open <a href="${GRAPH_EXPLORER}" target="_blank" rel="noopener" style="color:var(--accent)">Microsoft Graph Explorer ↗</a>. It’s easiest on a computer.</li>
        <li>Tap <b>Sign in</b> (top right) and use the Microsoft account your To Do lists are in.</li>
        <li>Open the <b>Modify permissions</b> tab, find <b>Tasks.Read</b> and tap <b>Consent</b>, then <b>Accept</b>.</li>
        <li>Tap <b>Run query</b> once, then open the <b>Access token</b> tab and tap the copy button.</li>
        <li>Paste it below. It works for about an hour and isn’t saved anywhere.</li>
      </ol></div>
      <div class="group" style="margin-top:12px"><textarea class="textarea" id="imp-token" style="min-height:90px;font-size:13px;font-family:ui-monospace,Menlo,monospace" placeholder="Paste the access token here" data-input="importField" data-f="token" autocapitalize="off" autocorrect="off" spellcheck="false">${esc(s.token || '')}</textarea></div>
      <div style="margin-top:14px"><button class="btn" data-a="todoConnect" ${s.busy ? 'disabled' : ''}>${s.busy ? 'Connecting…' : 'Show my To Do lists'}</button></div>
      <p class="hint">Tip: open McGaw Lists on the same computer (same web address) and sign in there, so you can copy and paste easily.</p>`;
    return html;
  }
  const opt = (L) => `<option value="new" ${L.target === 'new' ? 'selected' : ''}>New list: “${esc(L.displayName)}”</option>${targets.map((l) => `<option value="${l.id}" ${L.target === l.id ? 'selected' : ''}>Add to ${esc(l.title)}</option>`).join('')}`;
  const picked = s.lists.filter((L) => L.pick).length;
  html += `<p class="hint" style="margin:0 4px 10px">Tick the lists to bring across and choose where each one goes.</p>
    <div class="group">${s.lists.map((L, i) => `<div class="imp-row ${L.pick ? 'on' : ''}">
      <div class="row tap" data-a="todoPick" data-i="${i}"><button class="check ${L.pick ? 'on' : ''}" style="--c:var(--accent)" tabindex="-1"></button><div class="row-main"><div class="row-title">${esc(L.displayName)}</div>${L.wellknownListName === 'defaultList' ? '<div class="row-sub">Your main Tasks list</div>' : ''}</div></div>
      ${L.pick ? `<div class="imp-opts"><select data-change="todoTarget" data-i="${i}">${opt(L)}</select>${L.target === 'new' ? `<select data-change="todoType" data-i="${i}">${IMPORTABLE.map((t) => `<option value="${t}" ${L.type === t ? 'selected' : ''}>As a ${TYPES[t].name.toLowerCase()} list</option>`).join('')}</select>` : ''}</div>` : ''}
    </div>`).join('')}</div>
    <div class="group" style="margin-top:12px"><div class="field tap" data-a="todoDone"><label>Include completed tasks</label><span style="flex:1"></span><span class="switch ${s.includeDone ? 'on' : ''}"></span></div></div>
    <div style="margin-top:14px"><button class="btn" data-a="todoImport" ${picked && !s.busy ? '' : 'disabled'}>${s.busy ? esc(s.busy) : `Import ${picked || ''} list${picked === 1 ? '' : 's'}`}</button></div>
    <p class="hint">New lists start as just yours. Use Sharing afterwards to choose who else sees them.</p>`;
  return html;
}
async function graph(token, url) {
  const r = await fetch(url.startsWith('http') ? url : 'https://graph.microsoft.com/v1.0' + url, { headers: { Authorization: 'Bearer ' + token, Prefer: 'outlook.timezone="Europe/London"' } });
  if (r.status === 401 || r.status === 403) throw new Error('That token has expired or doesn’t have Tasks.Read — copy a fresh one from Graph Explorer.');
  if (!r.ok) throw new Error('Microsoft returned an error (' + r.status + '). Try again in a minute.');
  return r.json();
}
async function graphAll(token, url) {
  const out = [];
  for (let next = url; next;) { const j = await graph(token, next); out.push(...(j.value || [])); next = j['@odata.nextLink']; }
  return out;
}
const stripHtml = (h) => { const d = document.createElement('div'); d.innerHTML = h; return (d.textContent || '').replace(/\n{3,}/g, '\n\n').trim(); };
function guessType(name) {
  const n = name.toLowerCase();
  if (/shop|grocer|tesco|sainsbury|asda|aldi|lidl|waitrose|morrisons|food/.test(n)) return 'shopping';
  if (/work|job|office|cloudbass|project/.test(n)) return 'work';
  if (/christmas|xmas|gift|present|birthday|wedding|christening|baby shower|wish ?list/.test(n)) return 'christmas';
  if (/pack|holiday|trip|travel/.test(n)) return 'packing';
  return 'todo';
}
function rowsFromTask(t, l, pos, includeDone) {
  const done = t.status === 'completed';
  if (done && !includeDone) return [];
  const notesRaw = t.body?.content ? (t.body.contentType === 'html' ? stripHtml(t.body.content) : t.body.content.trim()) : '';
  const extra = { done, done_by: done ? S.me : null, done_at: done ? (t.completedDateTime?.dateTime ? t.completedDateTime.dateTime.slice(0, 19) + 'Z' : new Date().toISOString()) : null, due: t.dueDateTime?.dateTime ? t.dueDateTime.dateTime.slice(0, 10) : null, priority: t.importance === 'high' ? 1 : 0, notes: notesRaw || null, position: pos };
  let text = (t.title || '').trim() || 'Untitled';
  if (l.type === 'shopping') { const p = parseQty(text); text = p.text; extra.quantity = p.qty || null; extra.category = guessAisle(p.text); }
  if (l.type === 'work') extra.status = done ? 'done' : 'todo';
  if (l.type === 'packing') extra.data = { bag: 'shared' };
  if (l.type === 'christmas') { extra.data = {}; extra.done = false; extra.done_by = null; extra.done_at = null; }
  const steps = t.checklistItems || [];
  if (steps.length && !TYPES[l.type].sub) extra.notes = [notesRaw, steps.map((c) => (c.isChecked ? '✓ ' : '• ') + c.displayName).join('\n')].filter(Boolean).join('\n\n');
  const parent = newItem(l, text, extra);
  const rows = [parent];
  if (steps.length && TYPES[l.type].sub) steps.forEach((c, i) => rows.push(newItem(l, c.displayName, { parent_id: parent.id, done: !!c.isChecked, done_by: c.isChecked ? S.me : null, position: pos + (i + 1) / 1000 })));
  return rows;
}
/* ---------- Outlook → Work list ---------- */
// Tasks go to Mike's main daily list, "Ongoing Work To-Do List", when it exists; otherwise any Work list
const outlookKey = (t) => String(t || '').toLowerCase().replace(/[^a-z0-9]/g, '');
const outlookTarget = () => S.data.lists.find((x) => outlookKey(x.title) === 'ongoingworktodolist') || S.data.lists.find((x) => outlookKey(x.title).includes('ongoingwork')) || null;
const outlookShowsOn = (l) => { const t = outlookTarget(); return t ? t.id === l.id : l.type === 'work'; };
async function loadOutlook() {
  if (DEMO || !S.me) return;
  try { S.outlook = await store.outlook('overview'); } catch (e) { console.warn('Outlook', e.message); S.outlook = null; }
  render(); renderSheets(true);
}
function outlookBar(l) {
  const O = S.outlook;
  if (DEMO || !O || !O.configured || !outlookShowsOn(l)) return '';
  if (!O.connected) return `<div class="ob-bar"><span class="ob-ico">O</span><div class="ob-txt"><b>Outlook</b><span>Turn work emails that need action into tasks here.</span></div><button class="ob-go" data-a="outlookConnect">Connect</button></div>`;
  const a = O.account || {};
  const sub = S.outlookBusy ? esc(S.outlookBusy) : a.last_error ? `<span style="color:var(--red)">${esc(a.last_error)}</span>` : a.last_pull ? `Last checked ${timeAgo(a.last_pull)}` : '“Act now” and “Needs a reply” emails become tasks.';
  return `<div class="ob-bar"><span class="ob-ico">O</span><div class="ob-txt"><b>Outlook</b><span>${sub}</span></div><button class="ob-go" data-a="outlookPull" data-id="${l.id}" ${S.outlookBusy ? 'disabled' : ''}>${S.outlookBusy ? 'Working…' : 'Pull from inbox'}</button></div>`;
}
function outlookRow() {
  const O = S.outlook;
  if (DEMO || !O || !O.configured) return '';
  const tile = `<span class="tile-icon sm" style="--c:#0F6CBD">${icon('inbox', 18)}</span>`;
  if (!O.connected) return `<div class="row tap" data-a="outlookConnect">${tile}<div class="row-main"><div class="row-title">Connect work Outlook</div><div class="row-sub">Emails that need action become Work tasks</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>`;
  const a = O.account || {};
  return `<div class="row">${tile}<div class="row-main" style="cursor:default"><div class="row-title">Outlook</div><div class="row-sub">${esc(a.ms_email || 'Connected')}${O.ai ? '' : ' · <span style="color:var(--red)">Claude API key missing</span>'}</div></div><button class="link-btn danger" style="margin:0" data-a="outlookDisconnect">Disconnect</button></div>`;
}
function outlookSheet(s) {
  const l = getList(s.listId);
  const P = s.tasks || [];
  const n = P.filter((p) => p.pick).length;
  const days = `<div class="seg small" style="margin:0 0 12px">${[1, 3, 7].map((d) => `<button class="${s.days === d ? 'on' : ''}" data-a="outlookDays" data-v="${d}">${d === 1 ? 'Last day' : `Last ${d} days`}</button>`).join('')}</div>`;
  let body;
  if (s.busy) body = `<div class="empty"><div class="spinner"></div>${esc(s.busy)}</div>`;
  else if (s.error) body = `<div class="empty" style="color:var(--red)">${esc(s.error)}</div>`;
  else if (!P.length) body = `<div class="empty"><div class="big">Inbox clear</div>Nothing from the last ${s.days === 1 ? 'day' : s.days + ' days'} needs a new task.${s.read === 0 ? '' : ` (${s.read} emails checked.)`}</div>`;
  else body = `<p class="hint" style="margin-top:0">${P.length} suggestion${P.length === 1 ? '' : 's'} from ${s.read} email${s.read === 1 ? '' : 's'}. Untick anything you don’t want, change the priority or date, then add.</p>
    <div class="group">${P.map((p, i) => `<div class="row ob-item ${p.pick ? '' : 'off'}">
      <button class="check ${p.pick ? 'on' : ''}" data-a="outlookPick" data-i="${i}" aria-label="Include"></button>
      <div class="row-main" style="cursor:default"><div class="row-title">${esc(p.text)}</div><div class="row-sub">${esc(p.why)}</div>
        <div class="ob-meta"><select data-change="outlookPri" data-i="${i}" aria-label="Priority">${[3, 2, 1, 0].map((v) => `<option value="${v}" ${v === p.pri ? 'selected' : ''}>${PRI_BANDS.find((b) => b[0] === v)[1]}</option>`).join('')}</select>
        <input type="date" value="${p.due}" data-change="outlookDue" data-i="${i}" aria-label="Due date"><span>${esc(p.from)}${p.ids.length > 1 ? ` · ${p.ids.length} emails` : ''}</span></div></div></div>`).join('')}</div>`;
  return head('From your inbox', '<span></span>') + days + body +
    (P.length && !s.busy ? `<button class="btn" style="margin-top:16px" data-a="outlookAdd" ${n ? '' : 'disabled'}>${n ? `Add ${n} task${n === 1 ? '' : 's'} to ${esc(l ? l.title : 'your list')}` : 'Tick a task to add it'}</button>` : '');
}
async function outlookRun(s) {
  s.busy = `Reading your inbox and sorting it…`; s.error = ''; renderSheets(true);
  S.outlookBusy = 'Checking your inbox…'; render();
  const known = S.data.items.filter((i) => i.list_id === s.listId && Array.isArray(i.data?.email_ids)).flatMap((i) => i.data.email_ids);
  try {
    const r = await store.outlook('pull', { days: s.days, known });
    s.tasks = (r.tasks || []).map((t) => ({ ...t, pick: true })); s.read = r.read;
  } catch (e) { s.error = e.message; }
  s.busy = false; S.outlookBusy = null;
  renderSheets(true); loadOutlook();
}

/* ---------- Microsoft To Do sync ---------- */
function todoRow() {
  const T = S.todo;
  const tile = `<span class="tile-icon sm" style="--c:#2564CF">${icon('check', 18)}</span>`;
  if (DEMO || !T || !T.configured) {
    return `<div class="row tap" data-a="openImport" data-tab="todo">${tile}<div class="row-main"><div class="row-title">Import from Microsoft To Do</div><div class="row-sub">Whole lists, with dates and steps</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>`;
  }
  if (!T.connected) {
    return `<div class="row tap" data-a="todoAuth">${tile}<div class="row-main"><div class="row-title">Connect Microsoft To Do</div><div class="row-sub">Sign in once, then link lists or use #tags</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>`;
  }
  const a = T.account || {};
  const sub = a.last_error ? `<span style="color:var(--red)">${esc(a.last_error)}</span>` : a.last_sync ? `Synced ${timeAgo(a.last_sync)} · ${T.links.length} link${T.links.length === 1 ? '' : 's'}` : 'Connected';
  return `<div class="row tap" data-a="todoOpen">${tile}<div class="row-main"><div class="row-title">Microsoft To Do</div><div class="row-sub">${sub}</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>`;
}
const SYNCABLE = ['todo', 'work', 'shopping', 'packing'];
function todoTargetOptions(s, nameForNew) {
  const lists = S.data.lists.filter((l) => SYNCABLE.includes(l.type));
  return `<option value="new" ${s.target === 'new' ? 'selected' : ''}>${nameForNew ? `New list – ${esc(nameForNew)}` : 'New list'}</option>${lists.map((l) => `<option value="${l.id}" ${s.target === l.id ? 'selected' : ''}>${esc(l.title)}</option>`).join('')}`;
}
function todoTargetFields(s, nameForNew) {
  return `<div class="group"><div class="field"><label>Put into</label><select data-change="todoField" data-f="target">${todoTargetOptions(s, nameForNew)}</select></div>
    ${s.target === 'new' ? `<div class="field"><label>List type</label><select data-change="todoField" data-f="newType">${SYNCABLE.map((t) => `<option value="${t}" ${s.newType === t ? 'selected' : ''}>${TYPES[t].name}</option>`).join('')}</select></div>` : ''}</div>`;
}
const modeSeg = (s) => `<div class="group" style="margin-top:12px"><div class="field col"><label>How it stays in step</label><div class="seg">${[['0', 'Import only'], ['1', 'Two-way']].map(([v, l]) => `<button class="${(s.twoWay ? '1' : '0') === v ? 'on' : ''}" data-a="todoMode" data-v="${v}">${l}</button>`).join('')}</div></div></div>
  <p class="hint">${s.twoWay ? 'Changes in either app show up in both — ticks, edits, new items and deletions.' : 'New and changed tasks come across from To Do. Changes here don’t go back to To Do.'}</p>`;
/* ---------- Alexa ---------- */
const ALEXA_SAYS = [
  ['Add milk and bread', 'goes on the shared shopping list'],
  ['Add book the MOT to my to do list', ''],
  ['What’s on the shopping list?', 'shows it on the Echo Show — tap to tick'],
  ['Tick off eggs', ''],
  ['What’s for dinner tomorrow?', ''],
  ['We’re having lasagne for dinner on Friday', ''],
  ['I’m out for dinner on Thursday', 'needs your voice linked'],
  ['What have I got to do?', 'your tasks due this week'],
  ['How long until Center Parcs?', 'a live countdown on the Show'],
  ['What’s on today?', 'dinner, tasks, shopping and countdown at a glance'],
];
function alexaSheet(s) {
  const left = s.expires ? Math.max(0, Math.round((s.expires - Date.now()) / 60000)) : 0;
  const linked = s.linked === undefined ? '' : s.linked
    ? `<div class="row"><span class="tile-icon sm" style="--c:#30D158">${icon('check', 18)}</span><div class="row-main" style="cursor:default"><div class="row-title">Alexa knows your voice</div><div class="row-sub">Your own lists and tasks work by voice</div></div><button class="link-btn danger" style="margin:0" data-a="alexaForget">Forget</button></div>`
    : `<div class="row"><span class="tile-icon sm" style="--c:#8E8E93">${icon('person', 18)}</span><div class="row-main" style="cursor:default"><div class="row-title">Not linked yet</div><div class="row-sub">Until then Alexa only uses lists the whole family shares</div></div></div>`;
  return head('Alexa', '<span></span>') + `
    <p class="hint" style="margin-top:0">Start with <b>“Alexa, ask family lists…”</b> then say what you want.</p>
    ${s.missing ? '<p class="hint" style="color:var(--red)">Alexa isn’t set up in Supabase yet — run <b>supabase/alexa.sql</b> first.</p>' : ''}
    <div class="section-label">Your voice</div>
    <div class="group">${linked}
      ${s.code ? `<div class="alexa-code"><div class="code">${s.code.split('').join(' ')}</div><p>Say <b>“Alexa, ask family lists, my code is ${s.code}”</b>.<br>Works once, for ${left} more minute${left === 1 ? '' : 's'}.</p></div>`
        : `<div class="row tap" data-a="alexaCode"><span class="tile-icon sm" style="--c:#1AA3D9">${icon('voice', 18, 2.2)}</span><div class="row-main"><div class="row-title">${s.linked ? 'Link again' : 'Link my voice'}</div><div class="row-sub">Get a 4-digit code to say to Alexa</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>`}
    </div>
    <p class="hint">First, in the Alexa app on your phone, set up <b>Voice ID</b> for yourself and turn on <b>Personalise skills</b>. Then get a code and say it to any Echo.</p>
    <div class="section-label">Things to say</div>
    <div class="group">${ALEXA_SAYS.map(([t, sub]) => `<div class="row"><div class="row-main" style="cursor:default"><div class="row-title">“${t}”</div>${sub ? `<div class="row-sub">${sub}</div>` : ''}</div></div>`).join('')}</div>
    <p class="hint">Gift lists and the budget are never available through Alexa — so no surprises get spoiled.</p>`;
}
async function loadAlexa() {
  const s = topSheet();
  if (DEMO) { s.linked = false; return renderSheets(); }
  const { data, error } = await store.sb.from('alexa_voices').select('person_id');
  if (error) s.missing = true; else s.linked = data.length > 0;
  renderSheets();
}
function todoSheet(s) {
  const T = S.todo || {};
  const busyBtn = (label, a, disabled = false) => `<div style="margin-top:16px"><button class="btn" data-a="${a}" ${s.busy || disabled ? 'disabled' : ''}>${s.busy ? esc(s.busy) : label}</button></div>`;
  if (s.mode === 'home') {
    const a = T.account || {};
    const groups = [];
    for (const k of T.links || []) {
      const l = getList(k.list_id);
      const to = l ? esc(l.title) : 'a list';
      if (k.kind === 'task') {
        const g = groups.find((x) => x.kind === 'task' && x.list_id === k.list_id);
        if (g) { g.ids.push(k.id); continue; }
        groups.push({ kind: 'task', list_id: k.list_id, ids: [k.id], title: `Picked tasks → ${to}`, sub: 'Two-way' });
      } else if (k.kind === 'tag') groups.push({ kind: 'tag', ids: [k.id], title: `#${esc(k.tag)} → ${to}`, sub: k.two_way ? 'Two-way' : 'Import only' });
      else groups.push({ kind: 'list', ids: [k.id], title: `${esc(k.todo_list_name || 'To Do list')} → ${to}`, sub: k.two_way ? 'Two-way' : 'Import only' });
    }
    groups.forEach((g) => { if (g.kind === 'task') g.title = `${g.ids.length} picked task${g.ids.length === 1 ? '' : 's'} → ${esc(getList(g.list_id)?.title || 'a list')}`; });
    return head('Microsoft To Do', '<span></span>') + `
      <div class="group"><div class="row"><span class="tile-icon" style="--c:#2564CF">${icon('check', 22)}</span><div class="row-main" style="cursor:default"><div class="row-title">${esc(a.ms_name || 'Connected')}</div><div class="row-sub">${esc(a.ms_email || '')}</div></div></div>
        <div class="row"><div class="row-main" style="cursor:default"><div class="row-sub" style="margin:0">${a.last_error ? `<span style="color:var(--red)">${esc(a.last_error)}</span>` : a.last_sync ? `Last synced ${timeAgo(a.last_sync)}. Syncs every 10 minutes and when you open the app.` : 'Not synced yet.'}</div></div>
        ${a.last_error ? '<button class="link-btn" data-a="todoAuth">Reconnect</button>' : `<button class="link-btn" data-a="todoSync" ${s.busy ? 'disabled' : ''}>${s.busy ? 'Syncing…' : 'Sync now'}</button>`}</div></div>
      <div class="section-label">Linked</div>
      <div class="group">${groups.length ? groups.map((g) => `<div class="row tap" data-a="todoUnlink" data-ids="${g.ids.join(',')}"><div class="row-main"><div class="row-title" style="font-size:16px">${g.title}</div><div class="row-sub">${g.sub}</div></div><span class="link-btn" style="color:var(--red);padding:0">Unlink</span></div>`).join('') : '<div class="row"><div class="row-main muted" style="cursor:default">Nothing linked yet</div></div>'}</div>
      <div class="stack-gap" style="margin-top:16px">
        <button class="btn secondary" data-a="todoMode2" data-v="link">${icon('list', 20)} Link a whole To Do list</button>
        <button class="btn secondary" data-a="todoMode2" data-v="pick">${icon('check', 20)} Pick tasks to bring across</button>
        <button class="btn secondary" data-a="todoMode2" data-v="tag"># Use a tag</button>
        <button class="btn danger" data-a="todoDisconnect">Disconnect Microsoft To Do</button>
      </div>
      <p class="hint">Unlinking or disconnecting stops syncing. Anything already brought across stays in McGaw Lists.</p>`;
  }
  const backBtn = '<button class="txt" data-a="todoMode2" data-v="home">Back</button>';
  if (s.mode === 'link' || s.mode === 'pick') {
    if (!s.msLists) return head(s.mode === 'link' ? 'Link a list' : 'Pick tasks', backBtn) + '<div class="empty">Loading your To Do lists…</div>';
    const cur = s.msLists.find((L) => L.id === s.msList);
    let html = head(s.mode === 'link' ? 'Link a list' : 'Pick tasks', backBtn) + `
      <div class="section-label" style="margin-top:4px">From To Do</div>
      <div class="group">${s.msLists.map((L) => `<div class="row tap" data-a="todoChooseList" data-id="${esc(L.id)}"><button class="check ${s.msList === L.id ? 'on' : ''}" style="--c:var(--accent)" tabindex="-1"></button><div class="row-main"><div class="row-title">${esc(L.name)}</div>${L.main ? '<div class="row-sub">Your main Tasks list</div>' : ''}</div></div>`).join('')}</div>`;
    if (!cur) return html;
    if (s.mode === 'pick') {
      if (!s.tasks) return html + '<div class="empty">Loading tasks…</div>';
      const all = s.tasks.length && s.tasks.every((t) => s.picked.includes(t.id));
      html += `<div class="section-label"><span>Tasks (${s.tasks.length})</span>${s.tasks.length ? `<button data-a="todoPickAll">${all ? 'Clear' : 'Select all'}</button>` : ''}</div>
        <div class="group">${s.tasks.length ? s.tasks.map((t) => `<div class="row tap" data-a="todoPickTask" data-id="${esc(t.id)}"><button class="check ${s.picked.includes(t.id) ? 'on' : ''}" style="--c:var(--accent)" tabindex="-1"></button><div class="row-main"><div class="row-title" style="font-size:16px">${esc(t.title)}</div>${t.due || t.important ? `<div class="row-meta">${t.important ? `<span class="flag">${icon('flag', 13, 2.4)}</span>` : ''}${t.due ? `<span class="pill">${fmtDue(t.due)}</span>` : ''}</div>` : ''}</div></div>`).join('') : '<div class="row"><div class="row-main muted">No open tasks in this list</div></div>'}</div>
        <div class="section-label">Where to</div>${todoTargetFields(s, cur.name)}
        <div class="group" style="margin-top:12px"><div class="field tap" data-a="todoKeep"><label>Keep them linked</label><span style="flex:1"></span><span class="switch ${s.keepLinked ? 'on' : ''}"></span></div></div>
        <p class="hint">${s.keepLinked ? 'Ticks and edits stay in step both ways for these tasks.' : 'A one-off copy. To Do won’t change afterwards.'}</p>
        ${busyBtn(`Bring across ${s.picked.length || ''} task${s.picked.length === 1 ? '' : 's'}`, 'todoDoPick', !s.picked.length)}`;
      return html;
    }
    html += `<div class="section-label">Where to</div>${todoTargetFields(s, cur.name)}${modeSeg(s)}${busyBtn('Link list', 'todoDoLink')}`;
    return html;
  }
  if (s.mode === 'tag') {
    return head('Use a tag', backBtn) + `
      <p class="hint" style="margin:0 4px 12px">Add a tag to any task in To Do, from any list, and it appears here automatically. Siri works too: “Add ‘fix the gate #jobs’ to my To Do”.</p>
      <div class="group"><div class="field"><label>Tag</label><input id="todo-tag" value="${esc(s.tag || '')}" placeholder="#family" autocapitalize="off" autocorrect="off" data-input="todoTag"></div></div>
      <div class="section-label">Where to</div>${todoTargetFields(s, s.tag ? s.tag.replace(/^#/, '') : '')}${modeSeg(s)}${busyBtn('Save tag', 'todoDoTag')}`;
  }
  return head('Microsoft To Do', '<span></span>');
}
let todoLoading = null, lastTodoSync = 0;
async function loadTodo(runSync) {
  if (DEMO || !S.me) return;
  if (todoLoading) return todoLoading;
  todoLoading = (async () => {
    try {
      S.todo = await store.todo('overview');
      render();
      const stale = S.todo.connected && S.todo.links.length && Date.now() - lastTodoSync > 3 * 60 * 1000;
      if (runSync && stale) {
        lastTodoSync = Date.now();
        const r = await store.todo('sync').catch((e) => { console.warn(e); return null; });
        S.todo = await store.todo('overview');
        if (r && r.changes) await reload(); else render();
      }
    } catch (e) { console.warn('To Do', e.message); S.todo = S.todo || null; }
    todoLoading = null;
  })();
  return todoLoading;
}
async function todoRun(label, fn) {
  const s = topSheet();
  if (s) { s.busy = label; renderSheets(true); }
  try { return await fn(); }
  catch (e) { toast(e.message); return null; }
  finally { if (s) { s.busy = false; renderSheets(true); } }
}
function todoTargetPayload(s, name) {
  return s.target === 'new' ? { listId: 'new', newTitle: name, newType: s.newType } : { listId: s.target };
}

function installSheet() {
  return head('Add to Home Screen', '<span></span>') + `
    <div class="group" style="margin-top:6px"><ol class="steps">
      <li>Open this page in <b>Safari</b> on your iPhone.</li>
      <li>Tap the <b>Share</b> button (square with an arrow).</li>
      <li>Scroll down and tap <b>Add to Home Screen</b>, then <b>Add</b>.</li>
      <li>Open <b>McGaw Lists</b> from your Home Screen and sign in.</li>
      <li>Go to <b>Family → Notifications</b> and tap <b>Allow</b>.</li>
    </ol></div>
    <p class="hint">iPhones only allow notifications for web apps that have been added to the Home Screen (iOS 16.4 or later).</p>`;
}
function passwordSheet() {
  return head('Set a new password', '<span></span>', '<span></span>') + `
    <div class="login" style="min-height:0;padding:10px 0"><div class="group">${pwRow('pw-new', 'New password (8+ characters)', 'new-password')}</div>
    <div style="margin-top:14px"><button class="btn" data-a="savePassword">Save password</button></div></div>`;
}

/* ============================================================
   Actions
   ============================================================ */
const A = {
  go: (el) => { if (S.sheets.length) { S.sheets = []; } go(el.dataset.h); },
  filter: (el) => { S.filter = el.dataset.k; render(); },
  toggleUi: (el) => { S.ui[el.dataset.k] = !ui(el.dataset.k, el.dataset.k.startsWith('showDone') ? getList(el.dataset.k.slice(9))?.type === 'shopping' : el.dataset.k.startsWith('showPast')); render(); },
  setWorkSort: (el) => { setPref('workSort', el.dataset.v); render(); },
  setWorkView: (el) => { setPref('workView', el.dataset.v); render(); },
  setMineView: (el) => { setPref('mineView', el.dataset.v); render(); },
  setWorkDue: (el) => { const k = 'wdue-' + el.dataset.id; S.ui[k] = ui(k, '') === el.dataset.v ? '' : el.dataset.v; render(); const q = document.getElementById('qa-' + el.dataset.id); if (q) q.focus(); },
  setUi: (el) => { const v = el.dataset.v; S.ui[el.dataset.k] = v === '1' ? true : v === '0' ? false : v; render(); const q = document.querySelector('.quick input'); if (q && el.dataset.k.match(/^(for|bag)-/)) q.focus(); },
  closeSheet: () => closeSheet(),
  restorePast: async (el) => {
    const i = S.data.items.find((x) => x.id === el.dataset.id);
    if (!i) return;
    const q = document.getElementById('qa-' + i.list_id);
    const typed = q && q.value.trim() ? parseQty(q.value.trim()).qty : null;
    if (q) q.value = '';
    await restorePast(i, typed || null);
  },
  forgetPast: (el) => del('items', { id: el.dataset.id }),
  noticeTile: () => { const l = S.data.lists.find((x) => x.type === 'notice'); l ? go('#/list/' + l.id) : A.newList({ dataset: { type: 'notice' } }); },

  newList: (el) => {
    const type = el.dataset?.type || 'shopping';
    openSheet({ kind: 'newList', draft: { type, title: TYPES[type].title, colour: TYPES[type].colour, share: {}, touched: false } });
  },
  nlOccasion: (el) => { const d = topSheet().draft; d.title = el.dataset.v === 'Birthday' ? '’s birthday' : el.dataset.v; d.touched = true; renderSheets(true); if (el.dataset.v === 'Birthday') setTimeout(() => { const i = $('#nl-title'); if (i) { i.focus(); i.setSelectionRange(0, 0); } }, 50); },
  pickType: (el) => { const d = topSheet().draft; d.type = el.dataset.t; if (!d.touched) d.title = TYPES[d.type].title; d.colour = TYPES[d.type].colour; renderSheets(true); },
  nlColour: (el) => { topSheet().draft.colour = el.dataset.c; renderSheets(true); },
  nlShare: (el) => { const d = topSheet().draft; if (el.dataset.v === 'off') delete d.share[el.dataset.m]; else d.share[el.dataset.m] = el.dataset.v; renderSheets(true); },
  nlAllAdmin: () => { const d = topSheet().draft; const others = membersSorted().filter((m) => m.id !== S.me); const all = others.every((m) => d.share[m.id] === 'admin'); others.forEach((m) => { if (all) d.share[m.id] = 'member'; else d.share[m.id] = 'admin'; }); renderSheets(true); },
  createList: async () => {
    const d = topSheet().draft;
    if (!d.title.trim()) return;
    const id = uid();
    const settings = d.type === 'meals' ? { slots: ['dinner'] } : {};
    S.sheets = [];
    await ins('lists', { id, type: d.type, title: d.title.trim(), colour: d.colour, owner: S.me, settings, created_at: new Date().toISOString() });
    const rows = Object.entries(d.share).map(([member, role]) => ({ list_id: id, member, role, added_by: S.me, added_at: new Date().toISOString() }));
    if (rows.length) await ins('list_access', rows);
    go('#/list/' + id);
  },

  share: (el) => { if (topSheet()?.kind === 'listMenu') S.sheets.pop(); openSheet({ kind: 'share', id: el.dataset.id }); },
  shareSet: async (el) => {
    const l = getList(topSheet().id), m = el.dataset.m, v = el.dataset.v;
    const cur = accessOf(l.id).find((a) => a.member === m);
    if (v === 'off') { if (cur) await del('list_access', { list_id: l.id, member: m }); }
    else if (!cur) await ins('list_access', { list_id: l.id, member: m, role: v, added_by: S.me, added_at: new Date().toISOString() });
    else if (cur.role !== v) await upd('list_access', { list_id: l.id, member: m }, { role: v });
    renderSheets(true);
  },
  shareAllAdmin: async (el) => {
    const l = getList(el.dataset.id);
    for (const m of membersSorted().filter((x) => x.id !== l.owner)) {
      const cur = accessOf(l.id).find((a) => a.member === m.id);
      if (!cur) await ins('list_access', { list_id: l.id, member: m.id, role: 'admin', added_by: S.me, added_at: new Date().toISOString() });
      else if (cur.role !== 'admin') await upd('list_access', { list_id: l.id, member: m.id }, { role: 'admin' });
    }
    renderSheets(true);
  },
  leaveList: async (el) => {
    const l = getList(el.dataset.id);
    if (!await ask(`Leave “${l.title}”? You won’t see it any more unless ${memberName(l.owner)} adds you back.`, 'Leave', true)) return;
    S.sheets = []; go('#/');
    await del('list_access', { list_id: l.id, member: S.me });
  },
  listMenu: (el) => openSheet({ kind: 'listMenu', id: el.dataset.id }),
  listColour: (el) => upd('lists', { id: el.dataset.id }, { colour: el.dataset.c }),
  slotToggle: (el) => {
    const l = getList(el.dataset.id);
    const cur = l.settings?.slots?.length ? l.settings.slots : ['dinner'];
    let next = cur.includes(el.dataset.s) ? cur.filter((x) => x !== el.dataset.s) : [...cur, el.dataset.s];
    next = Object.keys(SLOTS).filter((k) => next.includes(k));
    if (!next.length) return toast('Keep at least one meal');
    upd('lists', { id: l.id }, { settings: { ...(l.settings || {}), slots: next } });
  },
  deleteList: async (el) => {
    const l = getList(el.dataset.id);
    if (!await ask(`Delete “${l.title}” for everyone? This can’t be undone.`, 'Delete', true)) return;
    S.sheets = []; go('#/');
    await del('lists', { id: l.id });
  },
  clearDone: async (el) => {
    const l = getList(el.dataset.id);
    const done = itemsOf(l.id).filter((i) => i.done && (isAdmin(l) || i.created_by === S.me));
    if (!done.length) return toast('Nothing to clear');
    if (!await ask(`Remove ${done.length} completed item${done.length === 1 ? '' : 's'}?`, 'Remove', true)) return;
    if (topSheet()?.kind === 'listMenu') S.sheets.pop();
    if (l.type === 'shopping') return clearShopping(l, done);
    for (const i of done) await del('items', { id: i.id });
  },
  unpack: async (el) => {
    const l = getList(el.dataset.id);
    if (!await ask('Untick everything so you can pack again?', 'Unpack')) return;
    S.sheets = [];
    for (const i of itemsOf(l.id).filter((x) => x.done)) await upd('items', { id: i.id }, { done: false, done_by: null, done_at: null });
  },

  toggle: async (el) => {
    const it = getItem(el.dataset.id), l = getList(it.list_id);
    if (l.type === 'christmas' && !it.parent_id) {
      if (isMyWish(it)) return toast('That’s on your list — no peeking!');
      const order = ['idea', 'bought', 'wrapped'];
      if (navigator.vibrate) navigator.vibrate(8);
      return setGift(it, { status: order[(order.indexOf(giftState(it.id)) + 1) % 3] });
    }
    const done = !it.done;
    const patch = { done, done_by: done ? S.me : null, done_at: done ? new Date().toISOString() : null };
    if (l.type === 'work' && !it.parent_id) patch.status = done ? 'done' : 'todo';
    if (navigator.vibrate) navigator.vibrate(8);
    await upd('items', { id: it.id }, patch);
    if (done) for (const c of childrenOf(it.id).filter((c) => !c.done)) await upd('items', { id: c.id }, patch.status ? { done, done_by: S.me, done_at: patch.done_at } : patch);
  },
  openItem: (el) => {
    const it = getItem(el.dataset.id);
    if (!it) return;
    const t = topSheet();
    if (t && t.kind === 'item') { t.id = it.id; t.fresh = false; renderSheets(true); return; }
    openSheet({ kind: 'item', id: it.id });
  },
  deleteItem: async (el) => {
    const it = getItem(el.dataset.id);
    const parent = it.parent_id;
    if (childrenOf(it.id).length && !await ask('Delete this and its sub-tasks?', 'Delete', true)) return;
    if (parent) topSheet().id = parent; else S.sheets.pop();
    await del('items', { id: it.id });
    renderSheets(true);
  },
  assign: (el) => {
    const it = getItem(el.dataset.id), m = el.dataset.m;
    const a = it.assignees.includes(m) ? it.assignees.filter((x) => x !== m) : [...it.assignees, m];
    upd('items', { id: it.id }, { assignees: a });
    renderSheets(true);
  },
  assignAll: (el) => {
    const it = getItem(el.dataset.id), l = getList(it.list_id);
    const ids = listMembers(l).map((m) => m.id);
    upd('items', { id: it.id }, { assignees: ids.every((x) => it.assignees.includes(x)) ? [] : ids });
    renderSheets(true);
  },
  setDue: async (el) => { await setItemDue(getItem(el.dataset.id), el.dataset.v || null); renderSheets(true); },
  taskCountdown: (el) => {
    const it = getItem(el.dataset.id);
    if (!it || !it.due) return;
    openSheet({ kind: 'countdown', itemId: it.id, focus: null, draft: { title: it.text, date: it.due, time: '17:00', colour: null, list_id: it.list_id, members: [], kind: 'general', style: 'flip' } });
  },
  setPriority: (el) => { upd('items', { id: el.dataset.id }, { priority: +el.dataset.v }); renderSheets(true); },
  giftBuyer: (el) => { const it = getItem(el.dataset.id), g = giftOf(it.id) || {}; setGift(it, { buyer: g.buyer === el.dataset.m ? null : el.dataset.m }); renderSheets(true); },
  workStatus: (el) => { const v = el.dataset.v; upd('items', { id: el.dataset.id }, { status: v, done: v === 'done', done_by: v === 'done' ? S.me : null, done_at: v === 'done' ? new Date().toISOString() : null }); renderSheets(true); },
  giftStatus: (el) => { setGift(getItem(el.dataset.id), { status: el.dataset.v }); renderSheets(true); },
  secret: (el) => {
    const it = getItem(el.dataset.id), m = el.dataset.m;
    const h = (it.hidden_from || []).includes(m) ? it.hidden_from.filter((x) => x !== m) : [...(it.hidden_from || []), m];
    upd('items', { id: it.id }, { hidden_from: h, assignees: it.assignees.filter((x) => !h.includes(x)) });
    renderSheets(true);
  },
  forOther: async (el) => {
    const n = await askText('Who is the gift for?', 'e.g. Grandma');
    if (n && n.trim()) { S.ui['for-' + el.dataset.id] = n.trim(); render(); }
  },

  essentials: (el) => openSheet({ kind: 'essentials', id: el.dataset.id, pick: [ui('bag-' + el.dataset.id, S.me)] }),
  pickBag: (el) => { const s = topSheet(), b = el.dataset.b; s.pick = s.pick.includes(b) ? s.pick.filter((x) => x !== b) : [...s.pick, b]; renderSheets(true); },
  addEssentials: async () => {
    const s = topSheet(), l = getList(s.id);
    const existing = itemsOf(l.id);
    const rows = [];
    let pos = Date.now() / 1000;
    for (const b of s.pick) {
      for (const t of b === 'shared' ? PACK_SHARED : PACK_ESSENTIALS) {
        if (existing.some((i) => (i.data?.bag || 'shared') === b && i.text.toLowerCase() === t.toLowerCase())) continue;
        rows.push(newItem(l, t, { data: { bag: b }, position: (pos += 0.001), assignees: b === 'shared' ? [] : [b] }));
      }
    }
    S.sheets.pop();
    if (rows.length) await ins('items', rows);
    toast(rows.length ? `Added ${rows.length} items` : 'Those bags already have everything');
  },

  week: (el) => { const k = 'week-' + el.dataset.id; S.ui[k] = ui(k, 0) + +el.dataset.d; render(); },
  presence: (el) => {
    const { id, day, slot, m } = el.dataset;
    const cur = S.data.meal_presence.find((p) => p.list_id === id && p.day === day && p.slot === slot && p.member === m)?.status;
    const next = { undefined: 'home', home: 'out', out: 'late', late: undefined }[cur];
    if (navigator.vibrate) navigator.vibrate(6);
    if (next) ups('meal_presence', { list_id: id, day, slot, member: m, status: next }, 'list_id,day,slot,member');
    else del('meal_presence', { list_id: id, day, slot, member: m });
  },
  meal: (el) => {
    const { id, day, slot } = el.dataset;
    const s = S.data.meal_slots.find((m) => m.list_id === id && m.day === day && m.slot === slot) || {};
    const presence = {};
    S.data.meal_presence.filter((p) => p.list_id === id && p.day === day && p.slot === slot).forEach((p) => { presence[p.member] = p.status; });
    const shop = S.data.lists.find((x) => x.type === 'shopping');
    openSheet({ kind: 'meal', id, day, slot, focus: s.meal ? null : 'ml-meal', draft: { meal: s.meal || '', cook: s.cook || null, notes: s.notes || '', ingredients: s.ingredients || '', presence, shopList: shop?.id } });
  },
  mealCook: (el) => { const d = topSheet().draft; d.cook = d.cook === el.dataset.m ? null : el.dataset.m; renderSheets(true); },
  mealPres: (el) => { const d = topSheet().draft, m = el.dataset.m; d.presence[m] = { undefined: 'home', home: 'out', out: 'late', late: undefined }[d.presence[m]]; renderSheets(true); },
  saveMeal: async () => {
    const s = topSheet(), d = s.draft;
    S.sheets.pop();
    await ups('meal_slots', { list_id: s.id, day: s.day, slot: s.slot, meal: d.meal.trim() || null, cook: d.cook, notes: d.notes || null, ingredients: d.ingredients || null, updated_by: S.me }, 'list_id,day,slot');
    const l = getList(s.id);
    for (const m of listMembers(l)) {
      const cur = S.data.meal_presence.find((p) => p.list_id === s.id && p.day === s.day && p.slot === s.slot && p.member === m.id)?.status;
      const want = d.presence[m.id];
      if (cur === want) continue;
      if (want) await ups('meal_presence', { list_id: s.id, day: s.day, slot: s.slot, member: m.id, status: want }, 'list_id,day,slot,member');
      else await del('meal_presence', { list_id: s.id, day: s.day, slot: s.slot, member: m.id });
    }
  },
  clearMeal: async () => {
    const s = topSheet();
    S.sheets.pop();
    await del('meal_slots', { list_id: s.id, day: s.day, slot: s.slot });
  },
  mealToShop: async () => {
    const s = topSheet(), d = s.draft;
    const lines = d.ingredients.split('\n').map((x) => x.trim()).filter(Boolean);
    const shop = getList(d.shopList);
    if (!lines.length) return toast('Add some ingredients first (one per line)');
    if (!shop) return toast('Pick a shopping list');
    const open = itemsOf(shop.id).filter((i) => !i.done).map((i) => i.text.toLowerCase());
    let pos = Date.now() / 1000;
    const rows = lines.map(parseQty).filter((p) => !open.includes(p.text.toLowerCase())).map((p) => newItem(shop, p.text, { quantity: p.qty || null, category: guessAisle(p.text), notes: `For ${d.meal || SLOTS[s.slot].toLowerCase()} on ${fmtDay(parseYmd(s.day))}`, position: (pos += 0.001) }));
    if (rows.length) await ins('items', rows);
    toast(rows.length ? `Added ${rows.length} to ${shop.title}` : 'They’re already on the list');
  },

  newNotice: (el) => openSheet({ kind: 'notice', listId: el.dataset.id, focus: 'nt-text', draft: { text: '', notes: '', colour: COLOURS[0], pinned: false, until: '' } }),
  openNotice: (el, e) => {
    if (e.target.closest('[data-a="seen"]')) return;
    const it = getItem(el.dataset.id);
    openSheet({ kind: 'notice', listId: it.list_id, id: it.id, draft: { text: it.text, notes: it.notes || '', colour: it.data?.colour || COLOURS[0], pinned: !!it.data?.pinned, until: it.data?.until || '' } });
  },
  noticeColour: (el) => { topSheet().draft.colour = el.dataset.c; renderSheets(true); },
  noticePin: () => { const d = topSheet().draft; d.pinned = !d.pinned; renderSheets(true); },
  saveNotice: async () => {
    const s = topSheet(), d = s.draft;
    if (!d.text.trim()) return;
    S.sheets.pop();
    if (s.id) {
      const it = getItem(s.id);
      await upd('items', { id: s.id }, { text: d.text.trim(), notes: d.notes || null, data: { ...it.data, colour: d.colour, pinned: d.pinned, until: d.until || null } });
    } else {
      await ins('items', newItem(getList(s.listId), d.text.trim(), { notes: d.notes || null, data: { colour: d.colour, pinned: d.pinned, until: d.until || null, seen: [] } }));
    }
  },
  deleteNotice: async () => {
    const s = topSheet();
    if (!await ask('Delete this note for everyone?', 'Delete', true)) return;
    S.sheets.pop();
    await del('items', { id: s.id });
  },
  seen: async (el) => {
    const it = getItem(el.dataset.id);
    const seen = [...new Set([...(it.data?.seen || []), S.me])];
    if (topSheet()?.kind === 'notice') S.sheets.pop();
    await upd('items', { id: it.id }, { data: { ...it.data, seen } });
  },

  openNote: async (el) => {
    const n = S.data.notifications.find((x) => String(x.id) === el.dataset.id);
    if (!n) return;
    if (!n.read) upd('notifications', { id: n.id }, { read: true });
    if (n.list_id && getList(n.list_id)) {
      go('#/list/' + n.list_id);
      if (n.item_id && getItem(n.item_id)) setTimeout(() => openSheet({ kind: 'item', id: n.item_id }), 50);
    } else toast('That list isn’t available any more');
  },
  readAll: async () => {
    const unread = S.data.notifications.filter((n) => !n.read);
    unread.forEach((n) => { n.read = true; });
    render();
    try {
      if (DEMO) { for (const n of unread) await store.update('notifications', { id: n.id }, { read: true }); }
      else await store.sb.from('notifications').update({ read: true }).eq('read', false);
    } catch (e) { console.error(e); }
    scheduleReload();
  },

  push: enablePush,
  todoAuth: async () => {
    const r = await todoRun('Opening Microsoft…', () => store.todo('start'));
    if (r && r.url) location.href = r.url;
  },
  outlookConnect: async () => {
    try { const r = await store.outlook('start'); location.href = r.url; } catch (e) { toast(e.message); }
  },
  outlookDisconnect: async () => {
    if (!await ask('Disconnect Outlook? Tasks you’ve already added stay on your list.', 'Disconnect', true)) return;
    try { await store.outlook('disconnect'); } catch (e) { toast(e.message); }
    loadOutlook();
  },
  outlookPull: (el) => {
    const t = outlookTarget() || getList(el.dataset.id);
    const s = { kind: 'outlook', listId: t.id, days: 3, tasks: [] };
    openSheet(s); outlookRun(topSheet());
  },
  outlookDays: (el) => { const s = topSheet(); s.days = +el.dataset.v; outlookRun(s); },
  outlookPick: (el) => { const s = topSheet(); const p = s.tasks[+el.dataset.i]; p.pick = !p.pick; renderSheets(true); },
  outlookAdd: async () => {
    const s = topSheet(), l = getList(s.listId);
    const picked = (s.tasks || []).filter((p) => p.pick);
    if (!l || !picked.length) return;
    const base = Date.now() / 1000;
    const rows = picked.map((p, i) => newItem(l, p.text, {
      priority: p.pri, due: p.due, ...(l.type === 'work' ? { status: 'todo' } : {}), assignees: [S.me],
      notes: [p.why, `From ${p.from}: “${p.subject}”`, p.link ? `Open in Outlook: ${p.link}` : ''].filter(Boolean).join('\n'),
      data: { source: 'outlook', email_ids: p.ids, email_link: p.link }, position: base + i / 1000,
    }));
    closeSheet();
    await ins('items', rows);
    toast(`Added ${rows.length} task${rows.length === 1 ? '' : 's'} to ${l.title}`);
    if (route().name !== 'list' || route().id !== l.id) location.hash = '#/list/' + l.id;
  },
  alexaOpen: () => { openSheet({ kind: 'alexa' }); loadAlexa(); },
  alexaCode: async () => {
    const s = topSheet();
    for (let tries = 0; tries < 5; tries++) {
      const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 10000).padStart(4, '0');
      if (!DEMO) {
        const { error } = await store.sb.from('alexa_codes').insert({ code, member: S.me });
        if (error && error.code === '23505') continue;
        if (error) { s.missing = true; renderSheets(); return toast('Couldn’t make a code — is alexa.sql set up?'); }
      }
      s.code = code; s.expires = Date.now() + 10 * 60000;
      clearInterval(s.tick); s.tick = setInterval(() => { if (topSheet() !== s) return clearInterval(s.tick); if (Date.now() > s.expires) { s.code = null; clearInterval(s.tick); loadAlexa(); } else renderSheets(); }, 30000);
      return renderSheets();
    }
  },
  alexaForget: async () => {
    if (!await ask('Forget your voice? Alexa will treat you as an unknown voice until you link it again.', 'Forget', true)) return;
    if (!DEMO) await store.sb.from('alexa_voices').delete().eq('member', S.me);
    loadAlexa();
  },
  todoOpen: () => { openSheet({ kind: 'todo', mode: 'home' }); loadTodo(false); },
  todoMode: (el) => { topSheet().twoWay = el.dataset.v === '1'; renderSheets(true); },
  todoMode2: async (el) => {
    const s = topSheet();
    Object.assign(s, { mode: el.dataset.v, msList: null, tasks: null, picked: [], target: 'new', newType: 'todo', twoWay: el.dataset.v === 'tag', keepLinked: true, tag: '' });
    renderSheets(true);
    if (s.mode === 'link' || s.mode === 'pick') {
      const r = await todoRun(null, () => store.todo('lists'));
      s.msLists = r ? r.lists : [];
      renderSheets(true);
    }
    if (s.mode === 'tag') setTimeout(() => document.getElementById('todo-tag')?.focus(), 60);
  },
  todoChooseList: async (el) => {
    const s = topSheet();
    s.msList = el.dataset.id;
    const L = s.msLists.find((x) => x.id === s.msList);
    const match = S.data.lists.find((l) => SYNCABLE.includes(l.type) && l.title.toLowerCase() === L.name.toLowerCase());
    s.target = match ? match.id : 'new';
    s.newType = SYNCABLE.includes(guessType(L.name)) ? guessType(L.name) : 'todo';
    s.tasks = null; s.picked = [];
    renderSheets(true);
    if (s.mode === 'pick') {
      const r = await todoRun(null, () => store.todo('tasks', { todoListId: s.msList }));
      s.tasks = r ? r.tasks : [];
      renderSheets(true);
    }
  },
  todoPickTask: (el) => { const s = topSheet(), id = el.dataset.id; s.picked = s.picked.includes(id) ? s.picked.filter((x) => x !== id) : [...s.picked, id]; renderSheets(true); },
  todoPickAll: () => { const s = topSheet(); s.picked = s.tasks.every((t) => s.picked.includes(t.id)) ? [] : s.tasks.map((t) => t.id); renderSheets(true); },
  todoKeep: () => { const s = topSheet(); s.keepLinked = !s.keepLinked; renderSheets(true); },
  todoDoLink: async () => {
    const s = topSheet(), L = s.msLists.find((x) => x.id === s.msList);
    const r = await todoRun(`Bringing across ${L.name}…`, () => store.todo('link', { todoListId: L.id, todoListName: L.name, twoWay: !!s.twoWay, ...todoTargetPayload(s, L.name) }));
    if (!r) return;
    await reload(); S.sheets = []; await loadTodo(false);
    toast(`Linked ${L.name}`); go('#/list/' + r.listId);
  },
  todoDoPick: async () => {
    const s = topSheet(), L = s.msLists.find((x) => x.id === s.msList);
    const r = await todoRun('Bringing tasks across…', () => store.todo('import', { todoListId: L.id, todoListName: L.name, taskIds: s.picked, keepLinked: !!s.keepLinked, ...todoTargetPayload(s, L.name) }));
    if (!r) return;
    await reload(); S.sheets = []; await loadTodo(false);
    toast(`Brought across ${s.picked.length} task${s.picked.length === 1 ? '' : 's'}`); go('#/list/' + r.listId);
  },
  todoDoTag: async () => {
    const s = topSheet(), tag = (s.tag || '').trim().replace(/^#/, '').replace(/\s+/g, '');
    if (!tag) return toast('Type a tag first, e.g. family');
    const r = await todoRun('Looking for #' + tag + '…', () => store.todo('tag', { tag, twoWay: !!s.twoWay, ...todoTargetPayload(s, tag.charAt(0).toUpperCase() + tag.slice(1)) }));
    if (!r) return;
    await reload(); S.sheets = []; await loadTodo(false);
    toast(r.changes ? `Found ${r.changes} #${tag} task${r.changes === 1 ? '' : 's'}` : `Saved — tag tasks with #${tag} in To Do`); go('#/list/' + r.listId);
  },
  todoSync: async () => {
    const r = await todoRun('Syncing…', () => store.todo('sync'));
    lastTodoSync = Date.now();
    if (r) { await reload(); await loadTodo(false); renderSheets(true); toast(r.changes ? `Synced ${r.changes} change${r.changes === 1 ? '' : 's'}` : 'Everything’s up to date'); }
  },
  todoUnlink: async (el) => {
    if (!await ask('Stop syncing this? Anything already brought across stays.', 'Unlink', true)) return;
    for (const id of el.dataset.ids.split(',')) await todoRun('Unlinking…', () => store.todo('unlink', { linkId: id }));
    await loadTodo(false); renderSheets(true);
  },
  todoDisconnect: async () => {
    if (!await ask('Disconnect Microsoft To Do? Syncing stops. Lists already brought across stay.', 'Disconnect', true)) return;
    await todoRun('Disconnecting…', () => store.todo('disconnect'));
    S.sheets = []; await loadTodo(false); render();
  },
  openImport: (el) => {
    const targets = S.data.lists.filter((l) => IMPORTABLE.includes(l.type));
    if (topSheet()?.kind === 'listMenu') S.sheets.pop();
    if (DEMO && el.dataset.tab === 'todo') { /* allowed: shows the steps */ }
    openSheet({ kind: 'import', tab: el.dataset.tab || 'todo', target: el.dataset.id || targets[0]?.id, text: '', token: '', focus: el.dataset.tab === 'paste' ? 'imp-text' : null });
  },
  importTab: (el) => { topSheet().tab = el.dataset.v; renderSheets(true); },
  importPaste: async () => {
    const s = topSheet(), l = getList(s.target);
    if (!l) return toast('Choose a list to add to');
    const parsed = parsePasted(s.text || '');
    if (!parsed.length) return toast('Paste some items first');
    const existing = new Set(itemsOf(l.id).filter((i) => !i.done).map((i) => i.text.toLowerCase()));
    let pos = Date.now() / 1000;
    const rows = [];
    for (const p of parsed) {
      let text = p.text, extra = { done: p.done, done_by: p.done ? S.me : null, position: (pos += 0.001) };
      if (l.type === 'shopping') { const q = parseQty(text); text = q.text; extra.quantity = q.qty || null; extra.category = guessAisle(q.text); }
      if (l.type === 'work') extra.status = p.done ? 'done' : 'todo';
      if (l.type === 'packing') extra.data = { bag: ui('bag-' + l.id, S.me) };
      if (l.type === 'christmas') extra.data = { for: ui('for-' + l.id, null) };
      if (l.type === 'packing') { const q = parsePackQty(text); text = q.text; extra.quantity = q.qty || null; }
      if (existing.has(text.toLowerCase())) continue;
      existing.add(text.toLowerCase());
      rows.push(newItem(l, text, extra));
    }
    S.sheets = [];
    if (rows.length) await ins('items', rows);
    toast(rows.length ? `Added ${rows.length} item${rows.length === 1 ? '' : 's'} to ${l.title}` : 'Those are already on the list');
    go('#/list/' + l.id);
  },
  todoConnect: async () => {
    const s = topSheet();
    s.token = (s.token || '').trim().replace(/^bearer\s+/i, '').replace(/^"|"$/g, '');
    if (s.token.length < 50) return toast('Paste the access token from Graph Explorer first');
    s.busy = true; renderSheets(true);
    try {
      const lists = await graphAll(s.token, '/me/todo/lists');
      const names = new Map(S.data.lists.filter((l) => IMPORTABLE.includes(l.type)).map((l) => [l.title.toLowerCase(), l.id]));
      s.lists = lists.filter((L) => L.wellknownListName !== 'flaggedEmails').map((L) => ({ ...L, pick: false, target: names.get(L.displayName.toLowerCase()) || 'new', type: guessType(L.displayName) }));
      if (!s.lists.length) toast('No To Do lists found on that account');
    } catch (e) { toast(e.message); }
    s.busy = false; renderSheets(true);
  },
  todoPick: (el) => { const L = topSheet().lists[+el.dataset.i]; L.pick = !L.pick; renderSheets(true); },
  todoDone: () => { const s = topSheet(); s.includeDone = !s.includeDone; renderSheets(true); },
  todoImport: async () => {
    const s = topSheet();
    const chosen = s.lists.filter((L) => L.pick);
    let lists = 0, tasks = 0;
    try {
      for (const L of chosen) {
        s.busy = `Importing ${L.displayName}…`; renderSheets(true);
        const todo = await graphAll(s.token, `/me/todo/lists/${encodeURIComponent(L.id)}/tasks?$expand=checklistItems&$top=100`);
        let l = L.target === 'new' ? null : getList(L.target);
        if (!l) {
          l = { id: uid(), type: L.type, title: L.displayName, colour: TYPES[L.type].colour, owner: S.me, settings: {}, created_at: new Date().toISOString() };
          await ins('lists', l);
        }
        const existing = new Set(itemsOf(l.id).map((i) => i.text.toLowerCase()));
        let pos = Date.now() / 1000;
        const rows = [];
        todo.sort((a, b) => (a.createdDateTime || '').localeCompare(b.createdDateTime || ''));
        for (const t of todo) {
          if (existing.has((t.title || '').trim().toLowerCase())) continue;
          rows.push(...rowsFromTask(t, l, (pos += 0.01), s.includeDone));
        }
        for (let i = 0; i < rows.length; i += 200) await ins('items', rows.slice(i, i + 200));
        tasks += rows.filter((r) => !r.parent_id).length; lists++;
      }
      S.sheets = []; renderSheets(true);
      toast(`Imported ${tasks} task${tasks === 1 ? '' : 's'} from ${lists} list${lists === 1 ? '' : 's'}`);
      go('#/');
    } catch (e) { s.busy = false; renderSheets(true); toast(e.message); }
  },
  setMode: (el) => { setPref('mode', el.dataset.v); applyAppearance(); render(); },
  setTheme: (el) => { setPref('theme', el.dataset.v); applyAppearance(); render(); },
  bgRemove: () => { setPref('bg', null); applyAppearance(); render(); toast('Background removed'); },
  install: () => openSheet({ kind: 'install' }),
  resetDemo: async () => { if (await ask('Put the demo data back to how it started?', 'Reset')) { store.reset(); reload(); toast('Demo reset'); } },
  signOut: async () => { if (!DEMO && !await ask('Sign out of McGaw Lists?', 'Sign out', true)) return; await store.signOut(); S.me = null; S.ready = false; S.sheets = []; showLogin(); },
  savePassword: async () => {
    const pw = $('#pw-new').value;
    if (pw.length < 8) return toast('Use at least 8 characters');
    try { await store.setPassword(pw); S.sheets = []; renderSheets(true); toast('Password saved'); } catch (e) { toast(e.message); }
  },
};

/* Typing / changes */
async function clearShopping(l, done) {
  const past = pastOf(l.id);
  for (const i of done) {
    const same = past.filter((p) => p.text.toLowerCase() === i.text.toLowerCase());
    const uses = (i.data?.uses || 0) + same.reduce((n, p) => n + (p.data.uses || 1), 0) + 1;
    for (const p of same) await del('items', { id: p.id });
    // Sub-items aren't needed in the history
    for (const c of childrenOf(i.id)) await del('items', { id: c.id });
    await upd('items', { id: i.id }, { data: { ...(i.data || {}), cleared: true, uses }, notes: null, assignees: [] });
  }
  toast(`Cleared ${done.length} — they’ll be suggested next time`);
}
async function restorePast(i, qty) {
  const data = { ...(i.data || {}) }; delete data.cleared;
  await upd('items', { id: i.id }, { data, done: false, done_by: null, done_at: null, quantity: qty !== undefined ? qty : null, position: Date.now() / 1000 });
  toast(`${i.text} is back on the list`);
}
const ENTER = {
  quickAdd: async (el) => {
    const l = getList(el.dataset.id);
    const raw = el.value.trim();
    if (!raw) return;
    el.value = '';
    if (l.type === 'shopping') {
      const p = parseQty(raw);
      const dup = itemsOf(l.id).find((i) => i.text.toLowerCase() === p.text.toLowerCase());
      if (dup && !dup.done) return toast(`${dup.text} is already on the list`);
      if (dup && dup.done) return upd('items', { id: dup.id }, { done: false, done_by: null, done_at: null, quantity: p.qty || dup.quantity });
      const old = pastOf(l.id).find((i) => i.text.toLowerCase() === p.text.toLowerCase());
      if (old) return restorePast(old, p.qty || null);
      return ins('items', newItem(l, p.text, { quantity: p.qty || null, category: guessAisle(p.text) }));
    }
    if (l.type === 'christmas') {
      const f = ui('for-' + l.id, null);
      const hide = f && member(f) && f !== S.me && listMembers(l).some((m) => m.id === f) ? [f] : [];
      return ins('items', newItem(l, raw, { data: { for: f }, hidden_from: hide }));
    }
    if (l.type === 'packing') {
      const b = ui('bag-' + l.id, S.me);
      const p = parsePackQty(raw);
      return ins('items', newItem(l, p.text, { quantity: p.qty || null, data: { bag: b }, assignees: b === 'shared' ? [] : [b] }));
    }
    if (l.type === 'work') {
      const pick = DUE_SHORTCUTS().find(([k]) => k === ui('wdue-' + l.id, ''));
      return ins('items', newItem(l, raw, { status: 'todo', assignees: [S.me], ...(pick ? { due: pick[2] } : {}) }));
    }
    if (l.type === 'notice') return;
    const solo = listMembers(l).length === 1;
    return ins('items', newItem(l, raw, { assignees: solo ? [S.me] : [] }));
  },
  addSub: async (el) => {
    const parent = getItem(el.dataset.id);
    const raw = el.value.trim();
    if (!raw) return;
    el.value = '';
    await ins('items', newItem(getList(parent.list_id), raw, { parent_id: parent.id, assignees: parent.assignees.length === 1 ? [...parent.assignees] : [] }));
    renderSheets(true);
    setTimeout(() => document.getElementById('sub-' + parent.id)?.focus(), 30);
  },
};
const CHANGE = {
  outlookPri: (el) => { const s = topSheet(); s.tasks[+el.dataset.i].pri = +el.value; },
  outlookDue: (el) => { const s = topSheet(); if (/^\d{4}-\d{2}-\d{2}$/.test(el.value)) s.tasks[+el.dataset.i].due = el.value; },
  itemText: (el) => { const v = el.value.trim(); if (v) upd('items', { id: el.dataset.id }, { text: v }); },
  itemField: (el) => el.dataset.f === 'due' ? setItemDue(getItem(el.dataset.id), el.value || null) : upd('items', { id: el.dataset.id }, { [el.dataset.f]: el.value || null }),
  giftFor: async (el) => {
    const it = getItem(el.dataset.id);
    if (isMyWish(it)) { renderSheets(true); return; }
    let v = el.value;
    if (v === '__other') { v = ((await askText('Who is the gift for?', 'e.g. Grandma')) || '').trim(); if (!v) { renderSheets(true); return; } }
    const l = getList(it.list_id);
    let hidden = it.hidden_from || [];
    if (member(v) && v !== S.me && v !== it.created_by && listMembers(l).some((m) => m.id === v) && !hidden.includes(v)) hidden = [...hidden, v];
    upd('items', { id: it.id }, { data: { ...it.data, for: v || null }, hidden_from: hidden });
    renderSheets(true);
  },
  giftNote: (el) => setGift(getItem(el.dataset.id), { note: el.value.trim() || null }),
  giftPrice: (el) => { const it = getItem(el.dataset.id); const n = parseFloat(el.value.replace(/[£,]/g, '')); upd('items', { id: it.id }, { data: { ...it.data, price: isNaN(n) ? null : n } }); },
  giftLink: (el) => { const it = getItem(el.dataset.id); let v = el.value.trim(); if (v && !/^https?:\/\//i.test(v)) v = 'https://' + v; upd('items', { id: it.id }, { data: { ...it.data, link: v || null } }); renderSheets(true); },
  packBag: (el) => { const it = getItem(el.dataset.id); const b = el.value; upd('items', { id: it.id }, { data: { ...it.data, bag: b }, assignees: b === 'shared' ? it.assignees : [b] }); renderSheets(true); },
  bgFile: (el) => { const f = el.files && el.files[0]; if (f) setBackground(f); el.value = ''; },
  todoTarget: (el) => { topSheet().lists[+el.dataset.i].target = el.value; renderSheets(true); },
  todoType: (el) => { topSheet().lists[+el.dataset.i].type = el.value; },
  todoField: (el) => { topSheet()[el.dataset.f] = el.value; renderSheets(true); },
  renameList: (el) => { const v = el.value.trim(); if (v) upd('lists', { id: el.dataset.id }, { title: v }); },
};
const INPUT = {
  shopSuggest: (el) => { const box = document.getElementById('sg-' + el.dataset.id); if (box) box.innerHTML = suggestChips(getList(el.dataset.id), el.value); },
  nlTitle: (el) => { const d = topSheet().draft; d.title = el.value; d.touched = true; const b = $('[data-a="createList"]'); if (b) { b.disabled = !d.title.trim(); b.style.opacity = d.title.trim() ? 1 : 0.4; } },
  importText: (el) => {
    topSheet().text = el.value;
    const n = parsePasted(el.value).length, c = document.getElementById('imp-count');
    if (c) c.textContent = n ? `${n} item${n === 1 ? '' : 's'} ready to add` : 'Long-press a message in WhatsApp → Copy, then paste it here.';
  },
  todoTag: (el) => { topSheet().tag = el.value; },
  importField: (el) => { topSheet()[el.dataset.f] = el.value; },
  bgDim: (el) => { setPref('dim', el.value); const bg = document.getElementById('bg'); if (bg) bg.style.setProperty('--dim', String(el.value / 100)); },
  mealField: (el) => { topSheet().draft[el.dataset.f] = el.value; },
  noticeField: (el) => { const d = topSheet().draft; d[el.dataset.f] = el.value; const b = $('[data-a="saveNotice"]'); if (b) { b.disabled = !d.text.trim(); b.style.opacity = d.text.trim() ? 1 : 0.4; } },
};

/* ============================================================
   Christmas — private gift status
   ============================================================ */
async function setGift(it, patch) {
  if (!it || isMyWish(it)) return;
  const cur = giftOf(it.id) || { item_id: it.id, status: 'idea', buyer: null, note: null };
  const row = { ...cur, ...patch, item_id: it.id, updated_by: S.me, updated_at: new Date().toISOString() };
  if (patch.status && patch.status !== 'idea' && !row.buyer) row.buyer = S.me;
  if (row.status === 'idea' && !row.buyer && !row.note) {
    if (giftOf(it.id)) return del('gift_status', { item_id: it.id });
    return;
  }
  return ups('gift_status', row, 'item_id');
}

/* ============================================================
   Press and hold to move items
   ============================================================ */
const DRAG = { timer: null, start: null, row: null, group: null, active: false, lastY: 0, until: 0, raf: 0, pending: false, before: '', lastTouch: 0 };
function dragRowFrom(t) {
  if (!t || !t.closest) return null;
  if (t.closest('.check, .seen-btn, input, textarea, select, a, .wish, .switch')) return null;
  const row = t.closest('[data-iid]');
  if (!row || !row.parentElement || !(row.parentElement.hasAttribute('data-reorder') || row.parentElement.hasAttribute('data-cell'))) return null;
  return row;
}
function pressStart(t, x, y) {
  cancelPress();
  const row = dragRowFrom(t);
  if (!row) return;
  DRAG.row = row; DRAG.iid = row.dataset.iid; DRAG.start = { x, y }; DRAG.lastY = y; DRAG.lastX = x;
  DRAG.timer = setTimeout(liftRow, 400);
}
function cancelPress() { clearTimeout(DRAG.timer); DRAG.timer = null; }
function liftRow() {
  DRAG.timer = null;
  if (DRAG.row && !DRAG.row.isConnected) DRAG.row = document.querySelector(`[data-iid="${DRAG.iid}"]`);
  if (DRAG.row?.parentElement?.hasAttribute('data-cell')) return liftCard();
  if (!DRAG.row || !DRAG.row.parentElement?.hasAttribute('data-reorder')) return;
  DRAG.active = true;
  DRAG.group = DRAG.row.parentElement;
  DRAG.before = [...DRAG.group.querySelectorAll(':scope > [data-iid]')].map((e) => e.dataset.iid).join();
  DRAG.row.classList.add('lifted');
  document.body.classList.add('dragging');
  if (navigator.vibrate) navigator.vibrate(12);
  const step = () => {
    if (!DRAG.active) return;
    const sc = DRAG.row.closest('.sheet');
    const top = sc ? sc.getBoundingClientRect().top : 0;
    const bottom = sc ? sc.getBoundingClientRect().bottom : innerHeight;
    const v = DRAG.lastY < top + 80 ? -9 : DRAG.lastY > bottom - 80 ? 9 : 0;
    if (v) { (sc || $('#view')).scrollTop += v; placeRow(DRAG.lastY); }
    DRAG.raf = requestAnimationFrame(step);
  };
  DRAG.raf = requestAnimationFrame(step);
}
// Calendar: lift a card and drop it on another day / priority
function liftCard() {
  const r = DRAG.row.getBoundingClientRect();
  DRAG.active = true; DRAG.cal = true; DRAG.from = DRAG.row.parentElement; DRAG.target = null;
  DRAG.off = { x: DRAG.start.x - r.left, y: DRAG.start.y - r.top };
  const g = DRAG.row.cloneNode(true);
  g.className += ' cal-ghost';
  g.style.width = r.width + 'px';
  document.body.appendChild(g);
  DRAG.ghost = g;
  DRAG.row.classList.add('cal-src');
  document.body.classList.add('dragging');
  if (navigator.vibrate) navigator.vibrate(12);
  moveCard(DRAG.lastX, DRAG.lastY);
  const step = () => {
    if (!DRAG.active) return;
    const sc = DRAG.from.closest('.cal-scroll'), v = $('#view');
    const sr = sc ? sc.getBoundingClientRect() : null;
    const hx = sr ? (DRAG.lastX < sr.left + 40 ? -10 : DRAG.lastX > sr.right - 40 ? 10 : 0) : 0;
    const vy = DRAG.lastY < 110 ? -9 : DRAG.lastY > innerHeight - 90 ? 9 : 0;
    if (hx && sc) sc.scrollLeft += hx;
    if (vy) v.scrollTop += vy;
    if (hx || vy) moveCard(DRAG.lastX, DRAG.lastY);
    DRAG.raf = requestAnimationFrame(step);
  };
  DRAG.raf = requestAnimationFrame(step);
}
function moveCard(x, y) {
  DRAG.ghost.style.transform = `translate(${x - DRAG.off.x}px, ${y - DRAG.off.y}px) rotate(2deg)`;
  const cell = document.elementFromPoint(x, y)?.closest('[data-cell]') || null;
  if (cell !== DRAG.target) {
    DRAG.target?.classList.remove('drop');
    DRAG.target = cell;
    if (cell && cell !== DRAG.from) cell.classList.add('drop');
  }
}
async function dropCard() {
  DRAG.ghost?.remove(); DRAG.ghost = null;
  DRAG.row.classList.remove('cal-src');
  const cell = DRAG.target; DRAG.target?.classList.remove('drop');
  DRAG.cal = false;
  if (!cell || cell === DRAG.from) return;
  const it = getItem(DRAG.iid);
  if (!it) return;
  const pri = +cell.dataset.pri;
  let due = cell.dataset.due || null;
  if (!due) {
    // "Later": keep a date that's already beyond the view, otherwise no date
    const lastDay = [...cell.parentElement.querySelectorAll('[data-cell]')].map((c) => c.dataset.due).filter(Boolean).pop();
    due = it.due && lastDay && it.due > lastDay ? it.due : null;
  }
  const patch = { priority: pri, due };
  if (it.due === due && priOf(it) === pri) return;
  await upd('items', { id: it.id }, patch);
  const label = PRI_BANDS.find((b) => b[0] === pri)[1];
  toast(`${due ? fmtDue(due) : 'No date'} · ${label}`);
}
function placeRow(y) {
  const sibs = [...DRAG.group.children].filter((c) => c !== DRAG.row && c.hasAttribute('data-iid'));
  let before = null;
  for (const s of sibs) { const r = s.getBoundingClientRect(); if (y < r.top + r.height / 2) { before = s; break; } }
  if (before) { if (DRAG.row.nextElementSibling !== before) DRAG.group.insertBefore(DRAG.row, before); }
  else { const last = sibs[sibs.length - 1]; if (last && last.nextElementSibling !== DRAG.row) last.after(DRAG.row); }
}
function pressMove(x, y, e) {
  if (DRAG.active) { if (e.cancelable) e.preventDefault(); DRAG.lastY = y; DRAG.lastX = x; if (DRAG.cal) moveCard(x, y); else placeRow(y); return; }
  if (DRAG.timer && Math.hypot(x - DRAG.start.x, y - DRAG.start.y) > 8) cancelPress();
}
function pressEnd() {
  cancelPress();
  if (!DRAG.active) return;
  cancelAnimationFrame(DRAG.raf);
  DRAG.active = false;
  DRAG.until = Date.now() + 450;
  document.body.classList.remove('dragging');
  if (DRAG.cal) {
    const pend = DRAG.pending;
    dropCard().finally(() => { DRAG.row = null; DRAG.from = null; DRAG.pending = false; if (pend) { render(); renderSheets(true); } });
    return;
  }
  DRAG.row.classList.remove('lifted');
  const ids = [...DRAG.group.querySelectorAll(':scope > [data-iid]')].map((e) => e.dataset.iid);
  if (ids.join() !== DRAG.before) {
    if (DRAG.group.dataset.reorder === 'home') saveHomeOrder(ids);
    else if (DRAG.group.dataset.reorder === 'lists') saveListOrder(ids);
    else savePositions(ids, DRAG.group.dataset.order === 'desc');
  }
  const pending = DRAG.pending;
  DRAG.pending = false; DRAG.row = null; DRAG.group = null;
  if (pending) { render(); renderSheets(true); }
}
async function savePositions(ids, desc) {
  const pos = ids.map((id) => +(getItem(id)?.position) || 0).sort((a, b) => a - b);
  if (desc) pos.reverse();
  for (let i = 1; i < pos.length; i++) {
    if (desc ? pos[i] >= pos[i - 1] : pos[i] <= pos[i - 1]) pos[i] = pos[i - 1] + (desc ? -0.001 : 0.001);
  }
  const changes = ids.map((id, i) => ({ id, position: pos[i] })).filter((c) => getItem(c.id) && getItem(c.id).position !== c.position);
  changes.forEach((c) => applyLocal('items', 'update', { id: c.id }, { position: c.position }));
  render(); renderSheets(true);
  try {
    await Promise.all(changes.map((c) => store.update('items', { id: c.id }, { position: c.position })));
    if (DEMO) await reload();
  } catch (e) { console.error(e); toast('Couldn’t save the new order'); reload(); }
}
document.addEventListener('touchstart', (e) => { DRAG.lastTouch = Date.now(); if (e.touches.length === 1) pressStart(e.target, e.touches[0].clientX, e.touches[0].clientY); else { cancelPress(); } }, { passive: true });
document.addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) pressMove(t.clientX, t.clientY, e); }, { passive: false });
document.addEventListener('touchend', () => pressEnd());
document.addEventListener('touchcancel', () => pressEnd());
document.addEventListener('mousedown', (e) => { if (Date.now() - DRAG.lastTouch < 900 || e.button !== 0) return; pressStart(e.target, e.clientX, e.clientY); });
document.addEventListener('mousemove', (e) => { if (Date.now() - DRAG.lastTouch < 900) return; if (DRAG.active || DRAG.timer) pressMove(e.clientX, e.clientY, e); });
document.addEventListener('mouseup', () => { if (Date.now() - DRAG.lastTouch < 900) return; pressEnd(); });
document.addEventListener('contextmenu', (e) => { if (e.target.closest && e.target.closest('[data-iid]')) e.preventDefault(); });

/* ============================================================
   Countdowns
   ============================================================ */
const FULL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const CD_STYLES = [
  { id: 'standard', name: 'Standard' },
  { id: 'flip', name: 'Flip clock' },
  { id: 'station', name: 'Train station' },
  { id: 'futuristic', name: 'Futuristic' },
  { id: 'scoreboard', name: 'Scoreboard' },
  { id: 'onair', name: 'On Air' },
  { id: 'neon', name: 'Neon' },
  { id: 'calendar', name: 'Tear-off calendar' },
];
const CD_HEAD = { station: 'Departs in', scoreboard: 'Kick-off in', onair: 'Going live in', futuristic: 'T-minus' };
const CD_SEP = { station: ':', futuristic: ':', onair: ':', flip: '' };
const pad2 = (n) => String(n).padStart(2, '0');
const cdStyleOf = (id) => (CD_STYLES.some((x) => x.id === id) ? id : 'standard');
function cdParts(target) {
  const t = new Date(target), now = new Date();
  const ms = t - now, past = ms < 0, abs = Math.abs(ms);
  const days = Math.floor(abs / 864e5), hrs = Math.floor((abs % 864e5) / 36e5), mins = Math.floor((abs % 36e5) / 6e4), secs = Math.floor((abs % 6e4) / 1e3);
  let a = past ? t : now, b = past ? now : t;
  let months = (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
  const plus = (n) => { const x = new Date(a); x.setMonth(x.getMonth() + n); return x; };
  if (plus(months) > b) months--;
  const remDays = Math.floor((b - plus(Math.max(0, months))) / 864e5);
  const sameDay = ymd(t) === ymd(now);
  return { past, days, hrs, mins, secs, months: Math.max(0, months), remDays, sameDay };
}
const monthLineOf = (p) => (p.months ? `${plural(p.months, 'month')}${p.remDays ? ', ' + plural(p.remDays, 'day') : ''}` : '');
function cdInner(target, v, style = 'standard') {
  const p = cdParts(target);
  style = cdStyleOf(style);
  const themed = style !== 'standard' && v !== 'chip';
  if (p.past) {
    const ago = p.sameDay ? 'Today!' : `${plural(p.days, 'day')} ago`;
    if (themed) return `<div class="cd-face ${v === 'small' ? 'sm ' : ''}t-${style} done"><div class="face-done">🎉 ${ago}</div></div>`;
    return v === 'big' ? `<div class="cd-num">🎉</div><div class="cd-hm">${ago}</div>` : `<span class="cd-small-num">${p.sameDay ? '🎉' : ago}</span>`;
  }
  const monthLine = monthLineOf(p);
  if (themed && v === 'small') {
    return `<div class="cd-face sm t-${style}"><b data-u="d">${p.days}</b><i>${p.days === 1 ? 'day' : 'days'}</i><span class="sm-hm"><span data-u="h">${pad2(p.hrs)}</span>:<span data-u="m">${pad2(p.mins)}</span>:<span data-u="s">${pad2(p.secs)}</span></span></div>`;
  }
  if (themed && style === 'calendar') {
    return `<div class="cd-face t-calendar"><div class="cal-rings"><i></i><i></i><i></i><i></i></div><div class="cal-head">${p.days === 1 ? 'Day' : 'Days'} to go</div><div class="cal-num" data-u="d">${p.days}</div><div class="cal-sub"><span data-u="h">${p.hrs}</span> hrs <span data-u="m">${pad2(p.mins)}</span> mins <span data-u="s">${pad2(p.secs)}</span> secs</div>${monthLine ? `<div class="cal-mo" data-u="mo">${monthLine}</div>` : ''}</div>`;
  }
  if (themed) {
    const units = [['d', p.days, 'days'], ['h', pad2(p.hrs), 'hrs'], ['m', pad2(p.mins), 'mins'], ['s', pad2(p.secs), 'secs']];
    const sep = CD_SEP[style] ? `<span class="sep">${CD_SEP[style]}</span>` : '';
    return `<div class="cd-face t-${style}">${CD_HEAD[style] ? `<div class="face-head">${style === 'onair' ? '<span class="lamp">ON AIR</span>' : ''}${CD_HEAD[style]}</div>` : ''}
      <div class="units">${units.map(([k, val, lbl]) => `<div class="u"><b data-u="${k}">${val}</b><i>${lbl}</i></div>`).join(sep)}</div>
      ${monthLine ? `<div class="face-mo" data-u="mo">${monthLine}</div>` : ''}</div>`;
  }
  if (v === 'big') {
    const lead = p.days ? `<div class="cd-num">${p.days.toLocaleString('en-GB')}</div><div class="cd-unit">${p.days === 1 ? 'day' : 'days'}</div><div class="cd-hm">${plural(p.hrs, 'hr')} ${plural(p.mins, 'min')}</div>`
      : `<div class="cd-num">${p.hrs}</div><div class="cd-unit">${p.hrs === 1 ? 'hour' : 'hours'}</div><div class="cd-hm">${plural(p.mins, 'min')}</div>`;
    return lead + (monthLine ? `<div class="cd-mo">${monthLine}</div>` : '');
  }
  if (v === 'small') {
    return p.days ? `<span class="cd-small-num">${p.days.toLocaleString('en-GB')}</span><span class="cd-small-unit">${p.days === 1 ? 'day' : 'days'}</span><span class="cd-small-hm">${p.hrs}h ${p.mins}m</span>`
      : `<span class="cd-small-num">${p.hrs}</span><span class="cd-small-unit">hrs</span><span class="cd-small-hm">${p.mins}m</span>`;
  }
  return p.days ? `${plural(p.days, 'day')} ${plural(p.hrs, 'hr')}` : `${plural(p.hrs, 'hr')} ${plural(p.mins, 'min')}`;
}
const cdBox = (c, v) => `<span class="cd-live" data-cd="${esc(c.target)}" data-v="${v}" data-st="${cdStyleOf(c.style)}">${cdInner(c.target, v, c.style)}</span>`;
function tickCountdowns() {
  document.querySelectorAll('[data-cd]').forEach((el) => {
    const st = el.dataset.st || 'standard', v = el.dataset.v;
    const p = cdParts(el.dataset.cd);
    const units = el.querySelectorAll('[data-u]');
    if (st === 'standard' || v === 'chip' || p.past || !units.length) {
      const html = cdInner(el.dataset.cd, v, st);
      if (el._h !== html) { el.innerHTML = html; el._h = html; }
      return;
    }
    const vals = { d: p.days, h: st === 'calendar' ? p.hrs : pad2(p.hrs), m: pad2(p.mins), s: pad2(p.secs), mo: monthLineOf(p) };
    units.forEach((u) => {
      const nv = String(vals[u.dataset.u]);
      if (u.textContent !== nv) { u.textContent = nv; if (u.dataset.u !== 'mo') { u.classList.remove('tick'); void u.offsetWidth; u.classList.add('tick'); } }
    });
  });
}
setInterval(tickCountdowns, 1000);
const cdColour = (c) => c.colour || (c.list_id && getList(c.list_id) ? listColour(getList(c.list_id)) : '#5E5CE6');
function fmtWhen(target) {
  const d = new Date(target);
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${fmtDay(d)} ${d.getFullYear()}${hm !== '00:00' ? ' · ' + hm : ''}`;
}
const cdSorted = (list) => [...list].sort((a, b) => new Date(a.target) - new Date(b.target));
const upcoming = (c) => new Date(c.target) > Date.now() - 864e5;

/* ---------- Departure boards (personal setting) ---------- */
const BOARD_MODES = [['cards', 'Cards'], ['train', 'Train station'], ['airport', 'Airport']];
const boardMode = () => { const m = pref('cdBoard', 'cards'); return ['train', 'airport'].includes(m) ? m : 'cards'; };
function boardDue(target, kind) {
  const p = cdParts(target);
  if (p.past) return kind === 'airport' ? 'GONE' : '—';
  if (kind === 'airport') return p.days ? `${p.days}D ${pad2(p.hrs)}:${pad2(p.mins)}` : `${pad2(p.hrs)}:${pad2(p.mins)}:${pad2(p.secs)}`;
  return `${p.days ? p.days + 'd ' : ''}${pad2(p.hrs)}:${pad2(p.mins)}:${pad2(p.secs)}`;
}
function boardStatus(target, kind) {
  const h = (new Date(target) - Date.now()) / 36e5;
  if (h < 0) return kind === 'airport' ? ['Departed', 'gone'] : ['Departed', 'gone'];
  if (kind === 'airport') return h <= 2 ? ['Final call', 'red'] : h <= 24 ? ['Boarding', 'green'] : h <= 168 ? ['Check-in open', 'yellow'] : ['Scheduled', ''];
  return h <= 1 ? ['Departing', 'red'] : h <= 24 ? ['Due', 'green'] : ['On time', 'green'];
}
const flaps = (txt, n) => `<span class="flaps" data-flaps="${esc(txt)}">${[...String(txt).toUpperCase().padEnd(n || 0).slice(0, n || 99)].map((ch) => `<i>${ch === ' ' ? '&nbsp;' : esc(ch)}</i>`).join('')}</span>`;
const clockNow = () => { const d = new Date(); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
function cdBoardHtml(list, kind, opts = {}) {
  const rows = list.map((c) => {
    const l = c.list_id && getList(c.list_id);
    const d = new Date(c.target);
    const date = `${d.getDate()} ${MONTHS[d.getMonth()]}`;
    const [st, cls] = boardStatus(c.target, kind);
    const gone = new Date(c.target) < Date.now();
    if (kind === 'airport') {
      return `<div class="board-row ${gone ? 'gone' : ''}" data-a="editCd" data-id="${c.id}">
        <span class="br-dest">${flaps(c.title.length > 17 ? c.title.slice(0, 16) + '…' : c.title, 17)}</span>
        <span class="br-date">${esc(date)}</span>
        <span class="br-due" data-bd="${esc(c.target)}" data-k="airport">${flaps(boardDue(c.target, 'airport'))}</span>
        <span class="br-st st-${cls}" data-bs="${esc(c.target)}" data-k="airport">${st}</span></div>`;
    }
    return `<div class="board-row ${gone ? 'gone' : ''}" data-a="editCd" data-id="${c.id}">
      <span class="br-date">${esc(date)}</span>
      <span class="br-dest">${esc(c.title)}</span>
      <span class="br-sub">${l ? `Plat. ${esc(l.title)} · ` : ''}<b class="st-${cls}" data-bs="${esc(c.target)}" data-k="train">${st}</b></span>
      <span class="br-due" data-bd="${esc(c.target)}" data-k="train">${boardDue(c.target, 'train')}</span></div>`;
  }).join('');
  const empty = `<div class="board-empty">${kind === 'airport' ? 'No flights scheduled' : 'No departures'}</div>`;
  return `<div class="board b-${kind}">
    <div class="board-head"><span>${kind === 'airport' ? '✈ Departures' : 'Departures'}</span><span class="board-clock" data-clock>${clockNow()}</span></div>
    ${kind === 'train' ? '<div class="board-cols"><span>Date</span><span>Destination</span><span>Due in</span></div>' : ''}
    ${rows || empty}
    ${opts.more ? `<div class="board-foot">${opts.more}</div>` : ''}</div>`;
}
const SPUN = new Set();
function spinFlaps(root) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.querySelectorAll('.b-airport .br-dest .flaps').forEach((f) => {
    const key = f.dataset.flaps;
    if (SPUN.has(key)) return;
    SPUN.add(key);
    const tiles = [...f.children];
    const finals = tiles.map((t) => t.innerHTML);
    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let n = 0;
    const timer = setInterval(() => {
      n++;
      tiles.forEach((t, i) => {
        if (n >= 4 + i) t.innerHTML = finals[i];
        else { t.textContent = ABC[Math.floor(Math.random() * ABC.length)]; t.classList.remove('flip'); void t.offsetWidth; t.classList.add('flip'); }
      });
      if (n >= 4 + tiles.length) clearInterval(timer);
    }, 55);
  });
}
function tickBoards() {
  document.querySelectorAll('[data-clock]').forEach((el) => { const v = clockNow(); if (el.textContent !== v) el.textContent = v; });
  document.querySelectorAll('[data-bd]').forEach((el) => {
    const v = boardDue(el.dataset.bd, el.dataset.k);
    if (el.dataset.k === 'train') { if (el.textContent !== v) el.textContent = v; return; }
    const f = el.querySelector('.flaps'); if (!f) return;
    const chars = [...v.toUpperCase()];
    if (f.children.length !== chars.length) { el.innerHTML = flaps(v); return; }
    chars.forEach((ch, i) => { const t = f.children[i], nv = ch === ' ' ? ' ' : ch; if (t.textContent !== nv) { t.textContent = nv; t.classList.remove('flip'); void t.offsetWidth; t.classList.add('flip'); } });
  });
  document.querySelectorAll('[data-bs]').forEach((el) => { const [st, cls] = boardStatus(el.dataset.bs, el.dataset.k); if (el.textContent !== st) { el.textContent = st; el.className = (el.classList.contains('br-st') ? 'br-st ' : '') + 'st-' + cls; } });
}
setInterval(tickBoards, 1000);
const boardSeg = () => `<div class="seg board-seg">${BOARD_MODES.map(([k, v]) => `<button class="${boardMode() === k ? 'on' : ''}" data-a="setBoard" data-v="${k}">${v}</button>`).join('')}</div>`;

function homeCountdowns() {
  if (missing('countdowns')) return '';
  if (boardMode() !== 'cards') {
    const cds = cdSorted(S.data.countdowns.filter(upcoming)).slice(0, 5);
    return `<div class="section-label"><span>Countdowns</span><button data-a="go" data-h="#/countdowns">See all</button></div>
      ${cdBoardHtml(cds, boardMode(), { more: `<button data-a="newCd">+ New countdown</button>` })}`;
  }
  const cds = cdSorted(S.data.countdowns.filter(upcoming)).slice(0, 8);
  const cards = cds.map((c) => `<button class="cd-mini ${cdStyleOf(c.style) !== 'standard' ? 'themed' : ''}" style="--c:${cdColour(c)}" data-a="editCd" data-id="${c.id}"><span class="cd-mini-title">${esc(c.title)}</span>${cdBox(c, 'small')}</button>`).join('');
  return `<div class="section-label"><span>Countdowns</span><button data-a="go" data-h="#/countdowns">See all</button></div>
    <div class="cd-strip">${cards}<button class="cd-mini add" data-a="newCd">${icon('plus', 22, 2.4)}<span class="cd-mini-title">New</span></button></div>`;
}
function listCountdowns(l) {
  if (missing('countdowns')) return '';
  const cds = cdSorted(S.data.countdowns.filter((c) => c.list_id === l.id && upcoming(c)));
  if (!cds.length) return '';
  return `<div class="cd-chips">${cds.map((c) => `<button class="cd-chip" style="--c:${cdColour(c)}" data-a="editCd" data-id="${c.id}">${icon('cal', 15, 2.2)}<b>${esc(c.title)}</b>${cdBox(c, 'chip')}</button>`).join('')}</div>`;
}
function departureCards(l) {
  if (missing('countdowns')) return '';
  const cds = cdSorted(S.data.countdowns.filter((c) => c.list_id === l.id && upcoming(c)));
  if (boardMode() !== 'cards' && cds.length) return `<div class="cd-hero-wrap">${cdBoardHtml(cds, boardMode())}<button class="link-btn" data-a="newCd" data-list="${l.id}" data-kind="departure" style="padding-top:6px">+ Add another countdown</button></div>`;
  const cards = cds.map((c) => `<div class="cd-card hero" style="--c:${cdColour(c)}" data-a="editCd" data-id="${c.id}">
      <div class="cd-top"><span class="cd-title">✈️ ${esc(c.title)}</span><span class="cd-date">${fmtWhen(c.target)}</span></div>
      <div class="cd-body">${cdBox(c, 'big')}</div></div>`).join('');
  return `<div class="cd-hero-wrap">${cards}<button class="link-btn" data-a="newCd" data-list="${l.id}" data-kind="departure" style="padding-top:${cds.length ? 6 : 0}px">${cds.length ? '+ Add another countdown' : '✈️ Add departure date'}</button></div>`;
}
function countdownsView() {
  const back = `<div class="nav"><button class="back" data-a="go" data-h="#/">${icon('chevL', 22, 2.4)}Lists</button><div class="actions"><button class="icon-btn solid" data-a="newCd" aria-label="New countdown">${icon('plus', 20, 2.4)}</button></div></div><h1 class="large">Countdowns</h1>`;
  if (missing('countdowns')) return back + '<div class="empty"><div class="big">One more setup step</div>Run the November update in Supabase to switch on countdowns.</div>';
  const all = cdSorted(S.data.countdowns);
  const next = all.filter(upcoming), old = all.filter((c) => !upcoming(c)).reverse();
  if (boardMode() !== 'cards') {
    return back + boardSeg() + cdBoardHtml(next, boardMode(), { more: '<button data-a="newCd">+ New countdown</button>' })
      + (old.length ? `<div class="section-label">Passed</div>${cdBoardHtml(old.slice(0, 8), boardMode())}` : '');
  }
  const card = (c) => {
    const l = c.list_id && getList(c.list_id);
    return `<div class="cd-card" style="--c:${cdColour(c)}" data-a="editCd" data-id="${c.id}">
      <div class="cd-top"><span class="cd-title">${esc(c.title)}</span>${l ? `<span class="pill">${icon(TYPES[l.type].icon, 12, 2.2)} ${esc(l.title)}</span>` : ''}</div>
      <div class="cd-body">${cdBox(c, 'big')}</div>
      <div class="cd-date">${fmtWhen(c.target)}</div></div>`;
  };
  return back + boardSeg() + (next.length ? `<div class="cd-grid">${next.map(card).join('')}</div>` : '<div class="empty"><div class="big">Nothing to count down to</div>Add a trip, a birthday, a match or a deadline. You can link it to a list too.</div>')
    + (old.length ? `<div class="section-label">Passed</div><div class="cd-grid past">${old.slice(0, 10).map(card).join('')}</div>` : '');
}
function countdownSheet(s) {
  const d = s.draft;
  const c = s.id ? S.data.countdowns.find((x) => x.id === s.id) : null;
  const l = d.list_id && getList(d.list_id);
  const canDel = c && (c.owner === S.me || (c.list_id && getList(c.list_id) && isAdmin(getList(c.list_id))));
  const others = membersSorted().filter((m) => m.id !== (c ? c.owner : S.me));
  const ok = d.title.trim() && d.date;
  return head(c ? 'Countdown' : 'New countdown', '<button class="txt back" data-a="closeSheet" aria-label="Back without saving">‹ Back</button>', `<button class="txt r" data-a="saveCd" ${ok ? '' : 'disabled style="opacity:.4"'}>${c ? 'Save' : 'Add'}</button>`) + `
    <div class="section-label" style="margin-top:4px">Name</div>
    <input class="big-input" id="cd-title" value="${esc(d.title)}" placeholder="e.g. Lapland trip, Esme’s birthday" data-input="cdField" data-f="title" autocomplete="off">
    <div class="group" style="margin-top:12px">
      <div class="field"><label>Date</label><input type="date" value="${d.date}" data-input="cdField" data-f="date"></div>
      <div class="field"><label>Time</label><input type="time" value="${d.time}" data-input="cdField" data-f="time"></div>
      <div class="field"><label>Link to a list</label><select data-change="cdList"><option value="">No list</option>${S.data.lists.map((x) => `<option value="${x.id}" ${d.list_id === x.id ? 'selected' : ''}>${esc(x.title)}</option>`).join('')}</select></div>
    </div>
    ${d.date ? `<div class="cd-preview" style="--c:${d.colour || (l ? listColour(l) : '#5E5CE6')}"><span class="cd-live" data-cd="${new Date(`${d.date}T${d.time || '00:00'}`).toISOString()}" data-v="big" data-st="${cdStyleOf(d.style)}">${cdInner(new Date(`${d.date}T${d.time || '00:00'}`).toISOString(), 'big', d.style)}</span></div>` : ''}
    <div class="section-label">Style</div>
    <div class="style-grid">${CD_STYLES.map((st) => `<button class="style-tile ${cdStyleOf(d.style) === st.id ? 'on' : ''}" data-a="cdStyle" data-v="${st.id}"><span class="style-sample" style="--c:${d.colour || (l ? listColour(l) : '#5E5CE6')}"><div class="cd-face sm t-${st.id}"><b>12</b><i>days</i><span class="sm-hm">${st.id === 'standard' ? '4h 20m' : '04:20:09'}</span></div></span><span class="style-name">${st.name}</span></button>`).join('')}</div>
    <div class="section-label">Colour</div>${swatchHtml(d.colour, 'data-a="cdColour"')}
    <div class="section-label">Who can see it</div>
    ${l ? `<p class="hint" style="margin:0 4px 8px">Everyone on “${esc(l.title)}” can see it. Add anyone else below.</p>` : ''}
    <div class="group" style="padding:12px 10px"><div class="who">${others.map((m) => `<button class="${d.members.includes(m.id) ? 'on' : ''}" data-a="cdMember" data-m="${m.id}">${avatar(m.id, 46)}${esc(m.name)}</button>`).join('')}</div></div>
    <p class="hint">Shows on the home screen${l ? ' and at the top of the list' : ''} for everyone who can see it.</p>
    ${c && canDel ? '<button class="btn danger" style="margin-top:18px" data-a="deleteCd">Delete countdown</button>' : ''}`;
}
Object.assign(A, {
  newCd: (el) => {
    const listId = el.dataset?.list || null, kind = el.dataset?.kind || 'general';
    if (topSheet()?.kind === 'listMenu') S.sheets.pop();
    const d = new Date(); d.setDate(d.getDate() + 7);
    openSheet({ kind: 'countdown', focus: 'cd-title', draft: { title: kind === 'departure' ? 'Departure' : '', date: kind === 'departure' ? '' : ymd(d), time: kind === 'departure' ? '09:00' : '', colour: null, list_id: listId, members: [], kind, style: kind === 'departure' ? 'station' : 'flip' } });
  },
  editCd: (el) => {
    const c = S.data.countdowns.find((x) => x.id === el.dataset.id);
    if (!c) return;
    const t = new Date(c.target);
    const time = `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
    openSheet({ kind: 'countdown', id: c.id, draft: { title: c.title, date: ymd(t), time: time === '00:00' ? '' : time, colour: c.colour, list_id: c.list_id, members: [...(c.members || [])], kind: c.kind, style: cdStyleOf(c.style) } });
  },
  cdStyle: (el) => { topSheet().draft.style = el.dataset.v; renderSheets(true); },
  cdColour: (el) => { const d = topSheet().draft; d.colour = d.colour === el.dataset.c ? null : el.dataset.c; renderSheets(true); },
  cdMember: (el) => { const d = topSheet().draft, m = el.dataset.m; d.members = d.members.includes(m) ? d.members.filter((x) => x !== m) : [...d.members, m]; renderSheets(true); },
  saveCd: async () => {
    const s = topSheet(), d = s.draft;
    if (!d.title.trim() || !d.date) return;
    const row = { title: d.title.trim(), target: new Date(`${d.date}T${d.time || '00:00'}`).toISOString(), colour: d.colour, list_id: d.list_id || null, members: d.members, kind: d.kind || 'general', style: cdStyleOf(d.style) };
    S.sheets.pop();
    if (s.id) await upd('countdowns', { id: s.id }, row);
    else {
      const id = uid();
      await ins('countdowns', { id, owner: S.me, created_at: new Date().toISOString(), ...row });
      // Made from a task: remember it, so changing the task's date moves the countdown too
      const it = s.itemId && getItem(s.itemId);
      if (it) await upd('items', { id: it.id }, { data: { ...(it.data || {}), cd: id } });
    }
    toast(s.id ? 'Countdown saved' : 'Countdown added');
  },
  deleteCd: async () => {
    const s = topSheet();
    if (!await ask('Delete this countdown for everyone?', 'Delete', true)) return;
    S.sheets.pop();
    await del('countdowns', { id: s.id });
  },
});
Object.assign(CHANGE, { cdList: (el) => { topSheet().draft.list_id = el.value || null; renderSheets(true); } });
Object.assign(INPUT, {
  cdField: (el) => {
    const s = topSheet(), d = s.draft;
    d[el.dataset.f] = el.value;
    const b = $('[data-a="saveCd"]'); const ok = d.title.trim() && d.date;
    if (b) { b.disabled = !ok; b.style.opacity = ok ? 1 : 0.4; }
    const pv = document.querySelector('.cd-preview');
    if (pv && d.date) { const iso = new Date(`${d.date}T${d.time || '00:00'}`).toISOString(); pv.innerHTML = `<span class="cd-live" data-cd="${iso}" data-v="big" data-st="${cdStyleOf(d.style)}">${cdInner(iso, 'big', d.style)}</span>`; }
    else if (!pv && d.date && el.dataset.f !== 'title') renderSheets(true);
  },
});

/* ============================================================
   Monthly budget (Mike & Louise)
   Regular payments are set up once (budget_recurring) and appear in
   every month they apply to. One-offs and per-month changes live in
   budget_entries (rule_id set = a change to a regular payment).
   ============================================================ */
const B_KINDS = { in: 'Money in', out: 'Bills & spending', save: 'Savings', transfer: 'Transfers' };
const B_KIND_SHORT = { in: 'In', out: 'Out', save: 'Saving', transfer: 'Transfer' };
const B_CATS = ['Mortgage / rent', 'Council tax', 'Energy', 'Water', 'Phone & broadband', 'Insurance', 'Car', 'Fuel', 'Food shopping', 'Kids', 'Pocket money', 'Clubs & activities', 'Subscriptions', 'Eating out', 'Holidays', 'Gifts', 'Other'];
const FREQS = [['once', 'Just this month'], ['weekly', 'Every week'], ['fortnightly', 'Every 2 weeks'], ['4weekly', 'Every 4 weeks'], ['monthly', 'Every month'], ['yearly', 'Every year']];
const STEP = { weekly: 7, fortnightly: 14, '4weekly': 28 };
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WD_ORDER = [1, 2, 3, 4, 5, 6, 0];
const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
const curMonth = () => monthKey(new Date());
const addMonths = (k, n) => { const [y, m] = k.split('-').map(Number); return monthKey(new Date(y, m - 1 + n, 1)); };
const monthLabel = (k, short) => { const [y, m] = k.split('-').map(Number); return short ? `${MONTHS[m - 1]} ${String(y).slice(2)}` : `${FULL_MONTHS[m - 1]} ${y}`; };
const ordinal = (n) => n + (['th', 'st', 'nd', 'rd'][(n % 100 >> 3 ^ 1 && n % 10) || 0] || 'th');
const n2 = (v) => Math.round((+v || 0) * 100) / 100;
const gbp = (v) => { const x = n2(v); return (x < 0 ? '−' : '') + '£' + Math.abs(x).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
const bAccounts = () => [...S.data.budget_accounts].sort((a, b) => a.sort - b.sort);
const bPots = () => [...S.data.budget_pots].sort((a, b) => a.sort - b.sort);
const bAccount = (id) => S.data.budget_accounts.find((a) => a.id === id);
const bPot = (id) => S.data.budget_pots.find((p) => p.id === id);
const bRules = () => S.data.budget_recurring || [];
const bRule = (id) => bRules().find((r) => r.id === id);
const bMonth = () => ui('bMonth', curMonth());
const dayDiff = (a, b) => Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / 864e5);

// Every date a regular payment falls on within a month
function ruleDates(r, month) {
  const [y, m] = month.split('-').map(Number);
  const first = new Date(y, m - 1, 1), last = new Date(y, m, 0);
  const start = parseYmd(r.start_date), end = r.end_date ? parseYmd(r.end_date) : null;
  if (start > last || (end && end < first)) return [];
  const ok = (d) => d >= start && (!end || d <= end);
  const out = [];
  if (r.freq === 'monthly') {
    const dd = !r.day || r.day > last.getDate() ? last.getDate() : r.day;
    const d = new Date(y, m - 1, dd); if (ok(d)) out.push(d);
  } else if (r.freq === 'yearly') {
    if (start.getMonth() === m - 1) { const d = new Date(y, m - 1, Math.min(start.getDate(), last.getDate())); if (ok(d)) out.push(d); }
  } else {
    const step = STEP[r.freq] || 7;
    const wd = r.weekday ?? start.getDay();
    const anchor = new Date(start.getFullYear(), start.getMonth(), start.getDate() + ((wd - start.getDay() + 7) % 7));
    let k = Math.max(0, Math.ceil(dayDiff(anchor, first) / step));
    for (let d = new Date(anchor.getFullYear(), anchor.getMonth(), anchor.getDate() + k * step); d <= last; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + step)) if (ok(d)) out.push(d);
  }
  return out;
}
function nextOccurrence(r, fromDate) {
  for (let k = 0; k < 24; k++) {
    const mk = addMonths(monthKey(fromDate), k);
    const d = ruleDates(r, mk).find((x) => x >= fromDate);
    if (d) return d;
  }
  return null;
}
function freqText(r) {
  if (r.freq === 'monthly') return `Monthly · ${!r.day ? 'last day' : ordinal(r.day)}`;
  if (r.freq === 'yearly') { const s = parseYmd(r.start_date); return `Yearly · ${s.getDate()} ${MONTHS[s.getMonth()]}`; }
  const wd = WEEKDAYS[r.weekday ?? parseYmd(r.start_date).getDay()];
  return { weekly: `Every ${wd}`, fortnightly: `Every other ${wd}`, '4weekly': `Every 4th ${wd}` }[r.freq];
}

// Everything that counts in a month: regular payments + one-offs
function bRows(month) {
  const rows = [];
  for (const r of bRules()) {
    const dates = ruleDates(r, month);
    if (!dates.length) continue;
    const ov = S.data.budget_entries.find((e) => e.rule_id === r.id && e.month === month);
    const auto = n2(r.amount * dates.length);
    rows.push({ key: 'r:' + r.id, rule: r, ov, kind: r.kind, name: r.name, amount: ov && ov.custom_amount ? n2(ov.amount) : auto, auto, each: n2(r.amount), count: dates.length, day: dates[0].getDate(), account_id: r.account_id, to_account_id: r.to_account_id, pot_id: r.pot_id, category: r.category, note: (ov && ov.note) || r.note, included: ov ? ov.included : true });
  }
  for (const e of S.data.budget_entries.filter((x) => x.month === month && !x.rule_id)) {
    rows.push({ key: 'e:' + e.id, entry: e, kind: e.kind, name: e.name, amount: n2(e.amount), day: e.day, account_id: e.account_id, to_account_id: e.to_account_id, pot_id: e.pot_id, category: e.category, note: e.note, included: e.included });
  }
  return rows;
}
function bTotals(month, acc, onlyIncluded = true) {
  const rs = bRows(month).filter((e) => !onlyIncluded || e.included);
  const sum = (f) => n2(rs.filter(f).reduce((s, e) => s + e.amount, 0));
  let tIn, tOut, tSave;
  if (!acc) { tIn = sum((e) => e.kind === 'in'); tOut = sum((e) => e.kind === 'out'); tSave = sum((e) => e.kind === 'save'); }
  else {
    tIn = sum((e) => (e.kind === 'in' && e.account_id === acc) || ((e.kind === 'transfer' || e.kind === 'save') && e.to_account_id === acc));
    tOut = sum((e) => (e.kind === 'out' && e.account_id === acc) || (e.kind === 'transfer' && e.account_id === acc));
    tSave = sum((e) => e.kind === 'save' && e.account_id === acc);
  }
  return { in: tIn, out: tOut, save: tSave, left: n2(tIn - tOut - tSave) };
}
function bFirstMonth() {
  const ks = [...bRules().map((r) => monthKey(parseYmd(r.start_date))), ...S.data.budget_entries.map((e) => e.month)];
  return ks.length ? ks.sort()[0] : null;
}
function bMonths() {
  const first = bFirstMonth();
  if (!first) return [];
  const lastEntry = S.data.budget_entries.map((e) => e.month).sort().pop() || first;
  const last = [curMonth(), lastEntry].sort().pop();
  const out = [];
  for (let k = first; k <= last && out.length < 120; k = addMonths(k, 1)) out.push(k);
  return out.reverse();
}
function potBalance(pot, upTo) {
  let bal = +pot.opening || 0;
  const first = bFirstMonth();
  if (first) for (let k = first; k <= upTo; k = addMonths(k, 1)) bal += bRows(k).filter((e) => e.kind === 'save' && e.included && e.pot_id === pot.id).reduce((s, e) => s + e.amount, 0);
  return n2(bal);
}
function budgetTile() {
  const m = curMonth();
  const has = !missing('budget_entries') && bRows(m).length;
  const t = has ? bTotals(m) : null;
  return `<button class="budget-tile" data-a="go" data-h="#/budget">
    <span class="tile-icon sm" style="--c:#248A3D">£</span>
    <span class="bt-main"><span class="bt-title">Budget · ${FULL_MONTHS[new Date().getMonth()]}</span><span class="bt-sub">${missing('budget_entries') ? 'Finish setting up' : has ? `In ${gbp(t.in)} · Out ${gbp(t.out + t.save)}` : 'Add your regular payments'}</span></span>
    ${has ? `<span class="bt-left ${t.left < 0 ? 'neg' : ''}">${gbp(t.left)}<small>left</small></span>` : ''}
    <span class="chev">${icon('chevR', 16, 2.4)}</span></button>`;
}
function budgetRow(e, acc) {
  const a = bAccount(e.account_id), to = bAccount(e.to_account_id), pot = bPot(e.pot_id);
  const meta = [];
  if (e.rule) meta.push(`<span class="pill">${icon('cal', 11, 2.4)} ${esc(freqText(e.rule))}${e.count > 1 ? ` ×${e.count}` : ''}</span>`);
  else meta.push(`<span class="pill">One-off${e.day ? ' · ' + ordinal(e.day) : ''}</span>`);
  if (e.rule && e.rule.end_date) meta.push(`<span>until ${fmtDay(parseYmd(e.rule.end_date))} ${parseYmd(e.rule.end_date).getFullYear()}</span>`);
  const moves = e.kind === 'transfer' || (e.kind === 'save' && to);
  if (!acc && a && !moves) meta.push(`<span class="acc-dot" style="--c:${a.colour || '#8E8E93'}">${esc(a.name)}</span>`);
  if (moves) meta.push(`<span>${esc(a?.name || '?')} → ${esc(to?.name || '?')}</span>`);
  if (e.kind === 'save' && pot) meta.push(`<span>→ ${esc(pot.name)}</span>`);
  if (e.category) meta.push(`<span>${esc(e.category)}</span>`);
  if (e.ov && e.ov.custom_amount) meta.push('<span class="pill orange">Changed this month</span>');
  const st = e.included ? ruleStatus(e, bMonth()) : null;
  if (st) meta.unshift(st);
  const sign = e.kind === 'in' || (acc && (e.kind === 'transfer' || e.kind === 'save') && e.to_account_id === acc) ? 'in' : '';
  return `<div class="row b-row ${e.included ? '' : 'off'}" style="--indent:50px">
    <button class="check ${e.included ? 'on' : ''}" style="--c:var(--accent)" data-a="bToggle" data-k="${e.key}" aria-label="Count this month"></button>
    <div class="row-main" data-a="bEdit" data-k="${e.key}"><div class="row-title">${esc(e.name)}</div><div class="row-meta">${meta.join('')}</div></div>
    <span class="b-amt-wrap"><span class="b-amt ${sign}">${sign ? '+' : ''}${gbp(e.amount)}</span>${e.rule && e.count > 1 && !(e.ov && e.ov.custom_amount) ? `<small>${gbp(e.each)} × ${e.count}</small>` : ''}</span></div>`;
}
function budgetView() {
  const nav = `<div class="nav"><button class="back" data-a="go" data-h="#/">${icon('chevL', 22, 2.4)}Lists</button><div class="actions">${canBudget() && !missing('budget_entries') && bAccounts().length ? `<button class="icon-btn" data-a="bAccounts" aria-label="Accounts and pots">${icon('more', 20, 2.6)}</button><button class="icon-btn solid" data-a="bNew" aria-label="Add">${icon('plus', 20, 2.4)}</button>` : ''}</div></div><h1 class="large">Budget</h1>`;
  if (!canBudget()) return nav + '<div class="empty"><div class="big">Private</div>Only Mike and Louise can see the budget.</div>';
  if (missing('budget_entries') || missing('budget_recurring')) return nav + '<div class="empty"><div class="big">One more setup step</div>Run the latest November update in Supabase to switch on the budget.</div>';
  if (!bAccounts().length) {
    return nav + `<div class="card-pad"><div class="big-q">Which accounts do you want to track?</div>
      <p class="hint" style="margin:6px 0 14px">Tap to add. You can rename or add more later.</p>
      <div class="chips wrap">${['Joint account', 'Mike’s account', 'Louise’s account', 'Credit card'].map((n) => `<button class="chip" data-a="bQuickAcc" data-n="${esc(n)}">${icon('plus', 14, 2.6)} ${esc(n)}</button>`).join('')}</div>
      <div style="margin-top:16px"><button class="btn secondary" data-a="bAccounts">Add a different account</button></div></div>
      <p class="hint" style="margin-top:14px">Only Mike and Louise can see anything on this page.</p>`;
  }
  const m = bMonth(), acc = ui('bAcc', null);
  const accs = bAccounts();
  const monthNav = `<div class="week-nav"><button class="icon-btn" data-a="bMonth" data-d="-1">${icon('chevL', 18, 2.6)}</button><div class="label">${monthLabel(m)}<small>${m === curMonth() ? 'This month' : m < curMonth() ? 'Past month' : 'Coming up'}</small></div><button class="icon-btn" data-a="bMonth" data-d="1">${icon('chevR', 18, 2.6)}</button></div>`;
  const chips = `<div class="chips" style="margin-top:12px">${[[null, 'All accounts'], ...accs.map((a) => [a.id, a.name])].map(([id, n]) => `<button class="chip ${acc === id ? 'on' : ''}" data-a="bAcc" data-v="${id || ''}">${id ? `<span class="dot" style="--c:${bAccount(id).colour || '#8E8E93'}"></span>` : ''}${esc(n)}</button>`).join('')}</div>`;
  const all = bRows(m);
  if (!all.length) {
    return nav + monthNav + `<div class="empty"><div class="big">Nothing in ${monthLabel(m)}</div>Add your wages, bills, savings and transfers once — choose how often they repeat and they’ll fill every month for you.<br><br>
      <button class="btn" data-a="bNew">${icon('plus', 20, 2.4)} Add a regular payment</button></div>` + statementSection(m, acc) + (bPots().length ? potsSection(m) : '') + budgetLog(m);
  }
  const t = bTotals(m, acc), full = bTotals(m, acc, false);
  const diff = n2(full.out + full.save - t.out - t.save - (full.in - t.in));
  const shown = all.filter((e) => !acc || e.account_id === acc || e.to_account_id === acc);
  const sortMode = pref('bSort', 'date');
  const byDate = (a, b) => (a.day || 99) - (b.day || 99) || a.name.localeCompare(b.name);
  const sortE = { date: byDate, late: (a, b) => (b.day || 0) - (a.day || 0) || a.name.localeCompare(b.name), low: (a, b) => a.amount - b.amount || byDate(a, b), high: (a, b) => b.amount - a.amount || byDate(a, b) }[sortMode] || byDate;
  const sortBar = `<div class="b-sort"><span>Sort</span><div class="seg">${[['date', 'Date ↑'], ['late', 'Date ↓'], ['low', '£ ↑'], ['high', '£ ↓']].map(([k, v]) => `<button class="${sortMode === k ? 'on' : ''}" data-a="bSort" data-v="${k}" aria-label="${{ date: 'Earliest payment day first', late: 'Latest payment day first', low: 'Smallest amount first', high: 'Largest amount first' }[k]}">${v}</button>`).join('')}</div></div>`;
  let sections = '';
  for (const k of ['in', 'out', 'save', 'transfer']) {
    const rows = shown.filter((e) => e.kind === k).sort(sortE);
    if (!rows.length && k === 'transfer') continue;
    const tot = n2(rows.filter((e) => e.included).reduce((s, e) => s + e.amount, 0));
    sections += `<div class="section-label"><span>${B_KINDS[k]}${rows.length ? ` · ${gbp(tot)}` : ''}</span><button data-a="bNew" data-kind="${k}">+ Add</button></div>
      ${rows.length ? `<div class="group">${rows.map((e) => budgetRow(e, acc)).join('')}</div>` : ''}`;
  }
  const summary = `<div class="b-summary">
      <div class="b-left ${t.left < 0 ? 'neg' : ''}"><span>${acc ? esc(bAccount(acc).name) + ' · ' : ''}Left over</span><b>${gbp(t.left)}</b></div>
      <div class="b-grid"><div><span>In</span><b class="in">${gbp(t.in)}</b></div><div><span>Out</span><b>${gbp(t.out)}</b></div><div><span>Savings</span><b>${gbp(t.save)}</b></div></div>
      ${diff ? `<div class="b-diff">Unticked this month: ${diff > 0 ? `you’d save ${gbp(diff)}` : `${gbp(-diff)} less coming in`}</div>` : '<div class="b-diff">Untick anything to see the difference this month</div>'}
    </div>`;
  const perAcc = !acc && accs.length > 1 ? `<div class="section-label">By account</div><div class="group">${accs.map((a) => { const x = bTotals(m, a.id); return `<div class="row tap" data-a="bAcc" data-v="${a.id}"><span class="acc-swatch" style="--c:${a.colour || '#8E8E93'}"></span><div class="row-main"><div class="row-title">${esc(a.name)}</div><div class="row-sub">In ${gbp(x.in)} · Out ${gbp(x.out)}${x.save ? ` · Saved ${gbp(x.save)}` : ''}</div></div><span class="b-amt ${x.left < 0 ? 'neg' : ''}">${gbp(x.left)}</span></div>`; }).join('')}</div>` : '';
  return nav + monthNav + chips + summary + statementSection(m, acc) + perAcc + sortBar + sections + (bPots().length ? potsSection(m) : '') + budgetLog(m);
}
function potsSection(m) {
  const pots = bPots();
  const rows = pots.map((p) => {
    const bal = potBalance(p, m);
    const added = n2(bRows(m).filter((e) => e.kind === 'save' && e.included && e.pot_id === p.id).reduce((s, e) => s + e.amount, 0));
    const pct = p.target ? Math.min(100, (bal / p.target) * 100) : 0;
    return `<div class="pot" style="--c:${p.colour || '#30B05A'}" data-a="bPot" data-id="${p.id}">
      <div class="pot-top"><b>${esc(p.name)}</b><span>${gbp(bal)}</span></div>
      ${p.target ? `<div class="bar"><i style="width:${pct}%"></i></div><div class="pot-sub">${Math.round(pct)}% of ${gbp(p.target)}${added ? ` · +${gbp(added)} this month` : ''}</div>` : `<div class="pot-sub">${added ? `+${gbp(added)} this month` : 'Nothing added this month'}</div>`}
    </div>`;
  }).join('');
  const total = n2(pots.reduce((s, p) => s + potBalance(p, m), 0));
  return `<div class="section-label"><span>Savings pots${pots.length ? ` · ${gbp(total)}` : ''}</span><button data-a="bPot">+ New pot</button></div>
    ${pots.length ? `<div class="pots">${rows}</div>` : '<p class="hint" style="margin-top:0">Make a pot for each thing you save for — holidays, Christmas, a rainy day.</p>'}`;
}
function budgetLog(cur) {
  const months = bMonths();
  if (!months.length) return '';
  const rows = months.slice(0, 36).map((k) => { const t = bTotals(k); return `<tr class="${k === cur ? 'on' : ''}" data-a="bGoMonth" data-m="${k}"><td>${monthLabel(k, true)}</td><td class="in">${gbp(t.in)}</td><td>${gbp(t.out)}</td><td>${gbp(t.save)}</td><td class="${t.left < 0 ? 'neg' : ''}"><b>${gbp(t.left)}</b></td></tr>`; }).join('');
  const tot = months.reduce((s, k) => { const t = bTotals(k); return { in: s.in + t.in, out: s.out + t.out, save: s.save + t.save, left: s.left + t.left }; }, { in: 0, out: 0, save: 0, left: 0 });
  return `<div class="section-label">Monthly log</div>
    <div class="group b-log-wrap"><table class="b-log"><thead><tr><th>Month</th><th>In</th><th>Out</th><th>Saved</th><th>Left</th></tr></thead><tbody>${rows}</tbody>
    ${months.length > 1 ? `<tfoot><tr><td>Total</td><td class="in">${gbp(tot.in)}</td><td>${gbp(tot.out)}</td><td>${gbp(tot.save)}</td><td><b>${gbp(tot.left)}</b></td></tr></tfoot>` : ''}</table></div>
    <p class="hint">All accounts, ticked items only. Tap a month to open it.</p>`;
}

/* ---------- Add / edit sheet ---------- */
function budgetEntrySheet(s) {
  const d = s.draft;
  const accs = bAccounts(), pots = bPots();
  const ok = d.name.trim() && d.amount !== '' && !isNaN(parseAmt(d.amount));
  const accSel = (f, label) => `<div class="field"><label>${label}</label><select data-change="bField" data-f="${f}">${f === 'to_account_id' ? '<option value="">Choose…</option>' : ''}${accs.map((a) => `<option value="${a.id}" ${d[f] === a.id ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select></div>`;
  const rep = d.freq !== 'once';
  const weekly = !!STEP[d.freq];
  const r = s.ruleId && bRule(s.ruleId);
  const count = rep ? ruleDates(draftRule(d), d.month).length : 1;
  const amt = parseAmt(d.amount);
  let html = head(s.ruleId || s.entryId ? 'Edit' : 'Add', s.ruleId || s.entryId ? '<span></span>' : undefined, `<button class="txt r" data-a="bSave" ${ok ? '' : 'disabled style="opacity:.4"'}>Save</button>`) + `
    <div class="seg" style="margin:4px 0 12px">${Object.entries(B_KIND_SHORT).map(([k, v]) => `<button class="${d.kind === k ? 'on' : ''}" data-a="bKind" data-v="${k}">${v}</button>`).join('')}</div>
    <input class="big-input" id="b-name" value="${esc(d.name)}" placeholder="${{ in: 'e.g. Salary', out: 'e.g. Mortgage', save: 'e.g. Holiday fund', transfer: 'e.g. Weekly spending money' }[d.kind]}" data-input="bText" data-f="name" autocomplete="off">
    <div class="group" style="margin-top:12px">
      <div class="field"><label>${rep ? 'Each payment (£)' : 'Amount (£)'}</label><input id="b-amount" inputmode="decimal" value="${esc(d.amount)}" placeholder="0.00" data-input="bText" data-f="amount"></div>
      ${accSel('account_id', d.kind === 'transfer' || d.kind === 'save' ? 'From' : d.kind === 'in' ? 'Into' : 'From account')}
      ${d.kind === 'transfer' || d.kind === 'save' ? accSel('to_account_id', d.kind === 'save' ? 'Into savings account' : 'To') : ''}
      ${d.kind === 'save' ? `<div class="field"><label>Pot (optional)</label><select data-change="bField" data-f="pot_id"><option value="">No pot</option>${pots.map((p) => `<option value="${p.id}" ${d.pot_id === p.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}<option value="__new">+ New pot…</option></select></div>` : ''}
      ${d.kind === 'out' ? `<div class="field"><label>Category</label><input list="b-cats" value="${esc(d.category || '')}" placeholder="Optional" data-input="bText" data-f="category"></div><datalist id="b-cats">${[...new Set([...B_CATS, ...bRules().map((x) => x.category), ...S.data.budget_entries.map((e) => e.category)].filter(Boolean))].map((c) => `<option value="${esc(c)}">`).join('')}</datalist>` : ''}
    </div>
    <div class="section-label">How often</div>
    <div class="group">
      <div class="field"><label>Repeats</label><select data-change="bField" data-f="freq">${FREQS.map(([k, v]) => `<option value="${k}" ${d.freq === k ? 'selected' : ''}>${v}</option>`).join('')}</select></div>
      ${weekly ? `<div class="field col"><label>On</label><div class="wd-row">${WD_ORDER.map((w) => `<button class="${+d.weekday === w ? 'on' : ''}" data-a="bWeekday" data-v="${w}">${WEEKDAYS[w].slice(0, 3)}</button>`).join('')}</div></div>` : ''}
      ${d.freq === 'monthly' || d.freq === 'once' ? `<div class="field"><label>Day of month</label><select data-change="bField" data-f="day">${d.freq === 'once' ? '<option value="">Not set</option>' : ''}${Array.from({ length: 31 }, (_, i) => i + 1).map((n) => `<option value="${n}" ${+d.day === n ? 'selected' : ''}>${ordinal(n)}</option>`).join('')}${d.freq === 'monthly' ? `<option value="0" ${+d.day === 0 && d.day !== '' ? 'selected' : ''}>Last day</option>` : ''}</select></div>` : ''}
      ${rep ? `<div class="field"><label>${d.freq === 'yearly' ? 'Date' : 'Starting'}</label><input type="date" value="${d.start_date}" data-change="bField" data-f="start_date"></div>
      <div class="field"><label>Ends</label><div class="seg" style="flex:1"><button class="${d.ends ? '' : 'on'}" data-a="bEnds" data-v="0">Never</button><button class="${d.ends ? 'on' : ''}" data-a="bEnds" data-v="1">On a date</button></div></div>
      ${d.ends ? `<div class="field"><label>Last payment by</label><input type="date" value="${d.end_date || ''}" data-change="bField" data-f="end_date"></div>` : ''}` : ''}
    </div>
    ${rep && !isNaN(amt) ? `<p class="hint">${monthLabel(d.month)}: ${count} payment${count === 1 ? '' : 's'} = <b>${gbp(amt * count)}</b>. ${d.ends && d.end_date ? `Stops after ${fmtDay(parseYmd(d.end_date))} ${parseYmd(d.end_date).getFullYear()}.` : 'Carries on every month until you stop it.'}</p>` : ''}
    ${!rep ? `<p class="hint">Only counts in ${monthLabel(d.month)}.</p>` : ''}
    ${d.kind === 'save' ? '<p class="hint">Savings work like transfers: choose where the money comes from and which savings account it goes into. A pot is optional. To take money back out, use a minus amount, e.g. −200.</p>' : ''}`;
  if (r) {
    const ov = S.data.budget_entries.find((e) => e.rule_id === r.id && e.month === d.month);
    const auto = n2(r.amount * ruleDates(r, d.month).length);
    html += `<div class="section-label">Just for ${monthLabel(d.month)}</div>
      <div class="group">
        <div class="field tap" data-a="bOvIncluded"><label>Counted this month</label><span style="flex:1"></span><span class="switch ${ov ? (ov.included ? 'on' : '') : 'on'}"></span></div>
        <div class="field"><label>This month’s total</label><input inputmode="decimal" value="${ov && ov.custom_amount ? n2(ov.amount) : ''}" placeholder="${n2(auto).toFixed(2)}" data-change="bOvAmount"></div>
      </div>
      <p class="hint">Use these if one month is different. Leave the total blank to use the usual amount.</p>`;
  }
  html += `<div class="section-label">Note</div><div class="group"><textarea class="textarea" style="min-height:64px" placeholder="Optional" data-input="bText" data-f="note">${esc(d.note || '')}</textarea></div>`;
  if (r) {
    const started = monthKey(parseYmd(r.start_date)) < d.month;
    html += `<div class="stack-gap" style="margin-top:20px">
      ${started ? `<button class="btn secondary" data-a="bStop">Stop it from ${monthLabel(d.month)}</button>` : ''}
      <button class="btn danger" data-a="bDeleteRule">Delete from every month</button></div>
      <p class="hint">${started ? 'Stopping keeps it in earlier months’ totals, so your log stays right. ' : ''}Changing the amount, account or timing starts from ${monthLabel(d.month)} — earlier months keep the old figures.</p>`;
  } else if (s.entryId) {
    html += `<div style="margin-top:20px"><button class="btn danger" data-a="bDeleteEntry">Delete</button></div>`;
  }
  return html;
}
const parseAmt = (v) => parseFloat(String(v).replace(/[£,\s]/g, '').replace('−', '-'));
function draftRule(d) {
  return { freq: d.freq, amount: parseAmt(d.amount) || 0, day: d.day === '' ? 1 : +d.day, weekday: +d.weekday, start_date: d.start_date, end_date: d.ends ? d.end_date || null : null };
}
function budgetPotSheet(s) {
  const d = s.draft;
  const p = s.id ? bPot(s.id) : null;
  const hist = p ? bMonths().map((k) => bRows(k).filter((e) => e.kind === 'save' && e.included && e.pot_id === p.id).map((e) => ({ k, e }))).flat().slice(0, 30) : [];
  return head(p ? 'Savings pot' : 'New pot', p ? '<button class="txt danger" data-a="bPotDelete">Delete</button>' : undefined, `<button class="txt r" data-a="bPotSave" ${d.name.trim() ? '' : 'disabled style="opacity:.4"'}>Save</button>`) + `
    <input class="big-input" id="pot-name" value="${esc(d.name)}" placeholder="e.g. Holiday" data-input="bPotText" data-f="name" autocomplete="off" style="margin-top:6px">
    <div class="group" style="margin-top:12px">
      <div class="field"><label>Already in it (£)</label><input inputmode="decimal" value="${esc(d.opening)}" placeholder="0.00" data-input="bPotText" data-f="opening"></div>
      <div class="field"><label>Target (£)</label><input inputmode="decimal" value="${esc(d.target)}" placeholder="Optional" data-input="bPotText" data-f="target"></div>
    </div>
    <div class="section-label">Colour</div>${swatchHtml(d.colour, 'data-a="bPotColour"')}
    ${p ? `<div class="section-label">Paid in</div><div class="group">${hist.map(({ k, e }) => `<div class="row"><div class="row-main" style="cursor:default"><div class="row-title" style="font-size:15px">${monthLabel(k, true)} · ${esc(e.name)}</div></div><span class="b-amt ${e.amount >= 0 ? 'in' : ''}">${e.amount >= 0 ? '+' : ''}${gbp(e.amount)}</span></div>`).join('') || '<div class="row"><div class="row-main muted">Nothing paid in yet</div></div>'}</div>` : ''}
    <p class="hint">The pot total is what was already in it plus every ticked saving into it, month by month.</p>`;
}
function budgetAccountsSheet() {
  const accs = bAccounts();
  return head('Accounts', '<span></span>') + `
    <div class="group">${accs.map((a) => `<div class="row"><span class="acc-swatch" style="--c:${a.colour || '#8E8E93'}"></span><input class="acc-name" value="${esc(a.name)}" data-change="bAccName" data-id="${a.id}"><button class="link-btn" style="color:var(--red)" data-a="bAccDelete" data-id="${a.id}">Delete</button></div>`).join('')}
      <div class="row"><span class="plus" style="width:20px">${icon('plus', 20, 2.4)}</span><input id="acc-new" class="acc-name" placeholder="Add an account" enterkeyhint="done" data-enter="bAccAdd" autocomplete="off"></div></div>
    <p class="hint">Deleting an account removes its payments from every month.</p>
    ${missing('budget_transactions') ? '' : statementsList() + (bTxns().some((t) => !t.matched_rule) ? '<div style="margin-top:10px"><button class="btn secondary" data-a="bRematch">Check unmatched transactions again</button></div>' : '')}
    <div class="section-label">Regular payments</div>
    <div class="group">${bRules().filter((r) => !r.end_date || r.end_date >= today()).sort((a, b) => a.name.localeCompare(b.name)).map((r) => `<div class="row tap" data-a="bEditRule" data-id="${r.id}"><div class="row-main"><div class="row-title">${esc(r.name)}</div><div class="row-sub">${esc(freqText(r))} · ${gbp(r.amount)}${r.end_date ? ` · until ${fmtDay(parseYmd(r.end_date))}` : ''}</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>`).join('') || '<div class="row"><div class="row-main muted">None yet</div></div>'}</div>
    <div class="section-label">Savings pots</div>
    <div class="group">${bPots().map((p) => `<div class="row tap" data-a="bPot" data-id="${p.id}"><span class="acc-swatch" style="--c:${p.colour || '#30B05A'}"></span><div class="row-main"><div class="row-title">${esc(p.name)}</div><div class="row-sub">${gbp(potBalance(p, curMonth()))}</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>`).join('')}
      <div class="row tap" data-a="bPot"><span class="plus" style="width:20px">${icon('plus', 20, 2.4)}</span><div class="row-main"><div class="row-title" style="color:var(--accent)">New pot</div></div></div></div>`;
}
const ACC_COLOURS = ['#0A84FF', '#FF375F', '#5E5CE6', '#30B05A', '#FF9500', '#00A5A8', '#BF5AF2', '#8E8E93'];
const firstOf = (k) => k;
const lastOf = (k) => { const [y, m] = k.split('-').map(Number); return ymd(new Date(y, m, 0)); };
const dayBefore = (s) => { const d = parseYmd(s); d.setDate(d.getDate() - 1); return ymd(d); };
function draftFromRule(r, month) {
  return { kind: r.kind, name: r.name, amount: String(n2(r.amount)), account_id: r.account_id, to_account_id: r.to_account_id || '', pot_id: r.pot_id || '', category: r.category || '', note: r.note || '', freq: r.freq, day: r.day ?? 1, weekday: r.weekday ?? parseYmd(r.start_date).getDay(), start_date: r.start_date, ends: !!r.end_date, end_date: r.end_date || '', month };
}
function draftFromEntry(e) {
  return { kind: e.kind, name: e.name, amount: String(n2(e.amount)), account_id: e.account_id, to_account_id: e.to_account_id || '', pot_id: e.pot_id || '', category: e.category || '', note: e.note || '', freq: 'once', day: e.day || '', weekday: 5, start_date: e.month, ends: false, end_date: '', month: e.month };
}
async function setOverride(rule, month, patch) {
  const ov = S.data.budget_entries.find((e) => e.rule_id === rule.id && e.month === month);
  const next = { included: ov ? ov.included : true, custom_amount: ov ? ov.custom_amount : false, amount: ov ? ov.amount : 0, ...patch };
  if (!next.custom_amount && next.included && !(ov && ov.note)) { if (ov) await del('budget_entries', { id: ov.id }); return; }
  if (ov) await upd('budget_entries', { id: ov.id }, next);
  else await ins('budget_entries', { id: uid(), rule_id: rule.id, month, kind: rule.kind, name: rule.name, account_id: rule.account_id, created_by: S.me, created_at: new Date().toISOString(), ...next });
}
Object.assign(A, {
  bMonth: (el) => { S.ui.bMonth = addMonths(bMonth(), +el.dataset.d); render(); },
  bGoMonth: (el) => { S.ui.bMonth = el.dataset.m; render(); $('#view').scrollTop = 0; },
  bAcc: (el) => { S.ui.bAcc = el.dataset.v || null; render(); },
  bSort: (el) => { setPref('bSort', el.dataset.v); render(); },
  bQuickAcc: (el) => ins('budget_accounts', { id: uid(), name: el.dataset.n, colour: ACC_COLOURS[bAccounts().length % ACC_COLOURS.length], sort: Date.now() / 1000, created_at: new Date().toISOString() }),
  bAccounts: () => openSheet({ kind: 'bAccounts' }),
  bAccDelete: async (el) => {
    const a = bAccount(el.dataset.id);
    if (!await ask(`Delete “${a.name}” and its payments from every month?`, 'Delete', true)) return;
    applyLocal('budget_entries', 'remove', { account_id: a.id });
    applyLocal('budget_recurring', 'remove', { account_id: a.id });
    await del('budget_accounts', { id: a.id });
    if (S.ui.bAcc === a.id) S.ui.bAcc = null;
    renderSheets(true);
  },
  bNew: (el) => {
    if (!bAccounts().length) return toast('Add an account first');
    const m = bMonth();
    const acc = ui('bAcc', null) || bAccounts()[0].id;
    const start = m;
    openSheet({ kind: 'bEntry', focus: 'b-name', draft: { kind: el.dataset?.kind || 'out', name: '', amount: '', account_id: acc, to_account_id: '', pot_id: '', category: '', note: '', freq: 'monthly', day: 1, weekday: 5, start_date: start, ends: false, end_date: '', month: m } });
  },
  bEdit: (el) => {
    const [t, id] = el.dataset.k.split(':');
    if (t === 'r') { const r = bRule(id); if (r) openSheet({ kind: 'bEntry', ruleId: r.id, draft: draftFromRule(r, bMonth()) }); }
    else { const e = S.data.budget_entries.find((x) => x.id === id); if (e) openSheet({ kind: 'bEntry', entryId: e.id, draft: draftFromEntry(e) }); }
  },
  bEditRule: (el) => { const r = bRule(el.dataset.id); if (r) openSheet({ kind: 'bEntry', ruleId: r.id, draft: draftFromRule(r, bMonth()) }); },
  bKind: (el) => { topSheet().draft.kind = el.dataset.v; renderSheets(true); },
  bWeekday: (el) => { topSheet().draft.weekday = +el.dataset.v; renderSheets(true); },
  bEnds: (el) => { const d = topSheet().draft; d.ends = el.dataset.v === '1'; if (d.ends && !d.end_date) { const x = new Date(); x.setFullYear(x.getFullYear() + 1); d.end_date = ymd(x); } renderSheets(true); },
  bToggle: (el) => {
    const [t, id] = el.dataset.k.split(':');
    if (navigator.vibrate) navigator.vibrate(6);
    if (t === 'e') { const e = S.data.budget_entries.find((x) => x.id === id); upd('budget_entries', { id: e.id }, { included: !e.included }); return; }
    const r = bRule(id), m = bMonth();
    const ov = S.data.budget_entries.find((e) => e.rule_id === r.id && e.month === m);
    setOverride(r, m, { included: ov ? !ov.included : false });
  },
  bOvIncluded: async () => {
    const s = topSheet(), r = bRule(s.ruleId), m = s.draft.month;
    const ov = S.data.budget_entries.find((e) => e.rule_id === r.id && e.month === m);
    await setOverride(r, m, { included: ov ? !ov.included : false });
    renderSheets(true);
  },
  bSave: async () => {
    const s = topSheet(), d = s.draft;
    const amount = parseAmt(d.amount);
    if (!d.name.trim() || isNaN(amount)) return;
    if (d.kind === 'transfer' && (!d.to_account_id || d.to_account_id === d.account_id)) return toast('Choose a different account to transfer to');
    if (d.kind === 'save' && d.to_account_id && d.to_account_id === d.account_id) return toast('Choose a different savings account');
    if (d.freq !== 'once' && d.ends && d.end_date && d.end_date < d.start_date) return toast('The end date is before it starts');
    const base = { kind: d.kind, name: d.name.trim(), amount: n2(amount), account_id: d.account_id || null, to_account_id: d.kind === 'transfer' || d.kind === 'save' ? d.to_account_id || null : null, pot_id: d.kind === 'save' ? d.pot_id || null : null, category: d.kind === 'out' ? d.category?.trim() || null : null, note: d.note?.trim() || null };
    const ruleFields = { freq: d.freq, day: d.freq === 'monthly' ? (d.day === '' ? 1 : +d.day) : null, weekday: STEP[d.freq] ? +d.weekday : null, start_date: d.start_date, end_date: d.ends ? d.end_date || null : null };
    S.sheets.pop();
    const month = d.month;
    // --- one-off ---
    if (d.freq === 'once') {
      const row = { ...base, day: d.day === '' ? null : +d.day };
      if (s.entryId) return upd('budget_entries', { id: s.entryId }, row);
      if (s.ruleId) { const r = bRule(s.ruleId); await endRuleBefore(r, month); }
      return ins('budget_entries', { id: uid(), month, included: true, created_by: S.me, created_at: new Date().toISOString(), ...row });
    }
    // --- regular payment ---
    if (s.entryId) await del('budget_entries', { id: s.entryId });
    if (!s.ruleId) {
      const nid = uid();
      await ins('budget_recurring', { id: nid, created_by: S.me, created_at: new Date().toISOString(), ...base, ...ruleFields });
      if (s.fromTxn) { await upd('budget_transactions', { id: s.fromTxn }, { matched_rule: nid }); await A.bRematch(); }
      return;
    }
    const r = bRule(s.ruleId);
    const money = ['amount', 'account_id', 'to_account_id', 'pot_id'].some((k) => (r[k] ?? null) !== (base[k] ?? null)) || ['freq', 'day', 'weekday'].some((k) => (r[k] ?? null) !== (ruleFields[k] ?? null)) || r.start_date !== ruleFields.start_date;
    const startedEarlier = monthKey(parseYmd(r.start_date)) < month;
    if (money && startedEarlier && r.start_date === ruleFields.start_date) {
      // keep history: old version ends before this month, new version starts here
      const from = nextOccurrence({ ...r, ...ruleFields }, parseYmd(month)) || parseYmd(month);
      const newId = uid();
      await upd('budget_recurring', { id: r.id }, { end_date: dayBefore(month) });
      await ins('budget_recurring', { id: newId, created_by: S.me, created_at: new Date().toISOString(), ...base, ...ruleFields, start_date: ymd(from) });
      for (const e of S.data.budget_entries.filter((x) => x.rule_id === r.id && x.month >= month)) await upd('budget_entries', { id: e.id }, { rule_id: newId });
      toast(`Changed from ${monthLabel(month)} on`);
    } else {
      await upd('budget_recurring', { id: r.id }, { ...base, ...ruleFields });
    }
  },
  bStop: async () => {
    const s = topSheet(), r = bRule(s.ruleId);
    if (!await ask(`Stop “${r.name}” from ${monthLabel(s.draft.month)}? It stays in earlier months.`, 'Stop')) return;
    S.sheets.pop();
    await endRuleBefore(r, s.draft.month);
  },
  bDeleteRule: async () => {
    const s = topSheet(), r = bRule(s.ruleId);
    if (!await ask(`Delete “${r.name}” from every month, including past ones?`, 'Delete', true)) return;
    S.sheets.pop();
    applyLocal('budget_entries', 'remove', { rule_id: r.id });
    await del('budget_recurring', { id: r.id });
  },
  bDeleteEntry: async () => {
    const s = topSheet();
    if (!await ask(`Delete “${s.draft.name}” from ${monthLabel(s.draft.month)}?`, 'Delete', true)) return;
    S.sheets.pop();
    await del('budget_entries', { id: s.entryId });
  },
  bPot: (el) => {
    const p = el.dataset?.id ? bPot(el.dataset.id) : null;
    openSheet({ kind: 'bPot', id: p?.id, focus: p ? null : 'pot-name', draft: p ? { name: p.name, opening: p.opening != null ? String(n2(p.opening)) : '', target: p.target != null ? String(n2(p.target)) : '', colour: p.colour } : { name: '', opening: '', target: '', colour: '#30B05A' } });
  },
  bPotColour: (el) => { topSheet().draft.colour = el.dataset.c; renderSheets(true); },
  bPotSave: async () => {
    const s = topSheet(), d = s.draft;
    if (!d.name.trim()) return;
    const num = (v) => { const x = parseAmt(v); return isNaN(x) ? null : n2(x); };
    const row = { name: d.name.trim(), opening: num(d.opening) || 0, target: num(d.target), colour: d.colour };
    S.sheets.pop();
    if (s.id) await upd('budget_pots', { id: s.id }, row);
    else {
      const id = uid();
      await ins('budget_pots', { id, sort: Date.now() / 1000, created_at: new Date().toISOString(), ...row });
      const t = topSheet();
      if (t?.kind === 'bEntry' && t.draft.pickingPot) { t.draft.pot_id = id; t.draft.pickingPot = false; renderSheets(true); }
    }
  },
  bPotDelete: async () => {
    const s = topSheet();
    if (!await ask('Delete this pot? Savings stay but won’t be linked to a pot.', 'Delete', true)) return;
    S.sheets.pop();
    await del('budget_pots', { id: s.id });
  },
});
async function endRuleBefore(r, month) {
  if (monthKey(parseYmd(r.start_date)) >= month) {
    applyLocal('budget_entries', 'remove', { rule_id: r.id });
    return del('budget_recurring', { id: r.id });
  }
  for (const e of S.data.budget_entries.filter((x) => x.rule_id === r.id && x.month >= month)) await del('budget_entries', { id: e.id });
  return upd('budget_recurring', { id: r.id }, { end_date: dayBefore(month) });
}
Object.assign(CHANGE, {
  bField: (el) => {
    const d = topSheet().draft;
    if (el.dataset.f === 'pot_id' && el.value === '__new') { d.pickingPot = true; renderSheets(true); A.bPot({ dataset: {} }); return; }
    d[el.dataset.f] = el.value;
    if (el.dataset.f === 'freq' && d.freq === 'monthly' && (d.day === '' || d.day == null)) d.day = 1;
    renderSheets(true);
  },
  bOvAmount: async (el) => {
    const s = topSheet(), r = bRule(s.ruleId);
    const v = parseAmt(el.value);
    await setOverride(r, s.draft.month, isNaN(v) || el.value.trim() === '' ? { custom_amount: false, amount: 0 } : { custom_amount: true, amount: n2(v) });
    renderSheets(true);
  },
  bAccName: (el) => { const v = el.value.trim(); if (v) upd('budget_accounts', { id: el.dataset.id }, { name: v }); },
});
Object.assign(INPUT, {
  bText: (el) => {
    const d = topSheet().draft; d[el.dataset.f] = el.value;
    const ok = d.name.trim() && d.amount !== '' && !isNaN(parseAmt(d.amount));
    const b = $('[data-a="bSave"]'); if (b) { b.disabled = !ok; b.style.opacity = ok ? 1 : 0.4; }
  },
  bPotText: (el) => {
    const d = topSheet().draft; d[el.dataset.f] = el.value;
    const b = $('[data-a="bPotSave"]'); if (b) { b.disabled = !d.name.trim(); b.style.opacity = d.name.trim() ? 1 : 0.4; }
  },
});
Object.assign(ENTER, {
  bAccAdd: async (el) => {
    const v = el.value.trim(); if (!v) return; el.value = '';
    await ins('budget_accounts', { id: uid(), name: v, colour: ACC_COLOURS[bAccounts().length % ACC_COLOURS.length], sort: Date.now() / 1000, created_at: new Date().toISOString() });
    renderSheets(true); setTimeout(() => document.getElementById('acc-new')?.focus(), 30);
  },
});

/* ============================================================
   Bank statement import (CSV / OFX / QIF / Santander text)
   Files are read on the phone; only the transactions are saved.
   ============================================================ */
const bTxns = () => S.data.budget_transactions || [];
const ymdOf = (y, m, d) => (m >= 1 && m <= 12 && d >= 1 && d <= 31 && y > 1990 && y < 2100 ? `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` : null);
function parseDateAny(raw) {
  const s = String(raw || '').trim().replace(/^"|"$/g, '').replace(/'/g, '/');
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/); if (m) return ymdOf(+m[1], +m[2], +m[3]);
  m = s.match(/^((?:19|20)\d{2})(\d{2})(\d{2})/); if (m) return ymdOf(+m[1], +m[2], +m[3]);
  m = s.match(/^(\d{1,2})[/.\-](\d{1,2})[/.\-](\d{2,4})/); if (m) { let y = +m[3]; if (y < 100) y += 2000; return ymdOf(y, +m[2], +m[1]); }
  m = s.match(/^(\d{1,2})[\s\-]+([A-Za-z]{3,9})[\s\-,]+(\d{2,4})/);
  if (m) { const mi = MONTHS.findIndex((x) => m[2].toLowerCase().startsWith(x.toLowerCase())); let y = +m[3]; if (y < 100) y += 2000; if (mi >= 0) return ymdOf(y, mi + 1, +m[1]); }
  return null;
}
function parseMoney(raw) {
  if (raw == null) return null;
  let t = String(raw).trim().replace(/ /g, ' ');
  if (!t) return null;
  let neg = false;
  if (/^\(.*\)$/.test(t)) { neg = true; t = t.slice(1, -1); }
  if (/\bDR\b/i.test(t)) neg = true;
  t = t.replace(/\b(CR|DR|GBP)\b/gi, '').replace(/[£$€,\s]|\uFFFD/g, '').replace('−', '-');
  if (!/^[-+]?\d*\.?\d+$/.test(t)) return null;
  const v = parseFloat(t);
  return neg ? -Math.abs(v) : v;
}
function parseCsvText(text) {
  const first = text.split('\n').slice(0, 5).join('\n');
  const delim = (first.match(/\t/g) || []).length > (first.match(/,/g) || []).length ? '\t' : (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : ',';
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === delim) { row.push(f); f = ''; }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else if (c !== '\r') f += c;
  }
  if (f || row.length) { row.push(f); rows.push(row); }
  return rows.map((r) => r.map((x) => x.trim())).filter((r) => r.some((x) => x));
}
function readCsvRows(rows) {
  const hi = rows.slice(0, 15).findIndex((r) => r.some((c) => /date/i.test(c)) && r.some((c) => /amount|debit|credit|paid|value|money/i.test(c)));
  let cols, data, amex = false;
  if (hi >= 0) {
    const h = rows[hi].map((x) => x.toLowerCase());
    const pick = (res, not) => { for (const re of res) { const i = h.findIndex((x) => re.test(x) && !(not && not.test(x))); if (i >= 0) return i; } return -1; };
    cols = {
      date: pick([/transaction date/, /^date$/, /posting date|posted/, /date/]),
      desc: pick([/^description$/, /transaction description/, /description/, /details/, /^memo$/, /memo/, /narrative/, /payee|merchant/, /^name$/, /reference/], /date|type|amount|balance|number|sort code|account/),
      amount: pick([/^amount$/, /^amount\b/, /^value$/, /transaction amount/], /balance/),
      debit: pick([/debit/, /paid out/, /money out/, /withdraw/, /^out$/]),
      credit: pick([/credit/, /paid in/, /money in/, /deposit/, /^in$/]),
    };
    amex = h.some((x) => /extended details|appears on your statement/.test(x));
    data = rows.slice(hi + 1);
  } else {
    const sample = rows.slice(0, 30), n = Math.max(...sample.map((r) => r.length));
    const share = (i, f) => sample.filter((r) => f(r[i])).length / sample.length;
    const idx = [...Array(n).keys()];
    const date = idx.sort((a, b) => share(b, parseDateAny) - share(a, parseDateAny))[0];
    const nums = [...Array(n).keys()].filter((i) => i !== date && share(i, (v) => parseMoney(v) != null) > 0.7);
    const texts = [...Array(n).keys()].filter((i) => i !== date && !nums.includes(i));
    const avgLen = (i) => sample.reduce((s, r) => s + (r[i] || '').length, 0);
    cols = { date, amount: nums[0] ?? -1, debit: -1, credit: -1, desc: texts.sort((a, b) => avgLen(b) - avgLen(a))[0] ?? -1 };
    data = rows;
  }
  const out = [];
  for (const r of data) {
    const date = parseDateAny(r[cols.date]);
    let amt = cols.amount >= 0 ? parseMoney(r[cols.amount]) : null;
    if (amt == null && (cols.debit >= 0 || cols.credit >= 0)) {
      const d = cols.debit >= 0 ? parseMoney(r[cols.debit]) : null, c = cols.credit >= 0 ? parseMoney(r[cols.credit]) : null;
      if (d) amt = -Math.abs(d); else if (c) amt = Math.abs(c); else if (d === 0 || c === 0) amt = 0;
    }
    if (!date || amt == null || amt === 0) continue;
    const desc = cols.desc >= 0 ? r[cols.desc] : r.filter((_, i) => i !== cols.date && i !== cols.amount).join(' ');
    out.push({ date, amount: n2(amt), description: (desc || '').replace(/\s+/g, ' ').trim() });
  }
  return { rows: out, amex };
}
function parseStatement(text) {
  text = text.replace(/^﻿/, '').replace(/ /g, ' ');
  if (/<STMTTRN>/i.test(text)) {
    const rows = [];
    for (const block of text.split(/<STMTTRN>/i).slice(1)) {
      const tag = (t) => { const m = block.match(new RegExp(`<${t}>([^<\\r\\n]*)`, 'i')); return m ? m[1].trim() : ''; };
      const date = parseDateAny(tag('DTPOSTED')), amt = parseMoney(tag('TRNAMT'));
      if (date && amt) rows.push({ date, amount: n2(amt), description: [tag('NAME'), tag('MEMO')].filter(Boolean).join(' ').replace(/\s+/g, ' ') });
    }
    return { rows, format: 'OFX', amex: false };
  }
  if (/^!Type:/im.test(text)) {
    const rows = [];
    for (const block of text.split(/^\^/m)) {
      const get = (c) => { const m = block.match(new RegExp(`^${c}(.*)$`, 'm')); return m ? m[1].trim() : ''; };
      const date = parseDateAny(get('D')), amt = parseMoney(get('T') || get('U'));
      if (date && amt) rows.push({ date, amount: n2(amt), description: [get('P'), get('M')].filter(Boolean).join(' ') });
    }
    return { rows, format: 'QIF', amex: false };
  }
  if (/^\s*Date:\s*\S/im.test(text) && /^\s*Description:/im.test(text)) {
    const rows = [];
    const re = /Date:\s*([^\n]+?)\s*\n\s*Description:\s*([^\n]*?)\s*\n\s*Amount:\s*([^\n]+?)\s*(?:\n|$)/gi;
    let m;
    while ((m = re.exec(text))) { const date = parseDateAny(m[1]), amt = parseMoney(m[3]); if (date && amt) rows.push({ date, amount: n2(amt), description: m[2].replace(/\s+/g, ' ') }); }
    return { rows, format: 'Santander text', amex: false };
  }
  const r = readCsvRows(parseCsvText(text));
  return { ...r, format: 'CSV' };
}
function readFileText(file) {
  const read = (enc) => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsText(file, enc); });
  return read('utf-8').then((t) => (t.includes('\uFFFD') ? read('windows-1252') : t));
}

/* ---------- matching ---------- */
const STOP = new Set(['payment', 'monthly', 'account', 'transfer', 'direct', 'debit', 'standing', 'order', 'card', 'bill', 'joint', 'from', 'into', 'with', 'money', 'fund', 'saving', 'savings']);
const tokensOf = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length >= 4 && !STOP.has(w));
function matchTxn(t) {
  const d = parseYmd(t.date), mk = monthKey(d);
  let best = null, bestScore = 0, bestNear = 99;
  for (const r of bRules()) {
    const outSide = t.amount < 0 && r.account_id === t.account_id && ['out', 'save', 'transfer'].includes(r.kind);
    const inSide = t.amount > 0 && ((r.kind === 'in' && r.account_id === t.account_id) || (['save', 'transfer'].includes(r.kind) && r.to_account_id === t.account_id));
    if (!outSide && !inSide) continue;
    const dates = [...ruleDates(r, addMonths(mk, -1)), ...ruleDates(r, mk), ...ruleDates(r, addMonths(mk, 1))];
    if (!dates.length) continue;
    const near = Math.min(...dates.map((x) => Math.abs(dayDiff(x, d))));
    const diff = Math.abs(Math.abs(t.amount) - r.amount), rel = r.amount ? diff / r.amount : 1;
    const nameHit = tokensOf(r.name).some((w) => t.description.toLowerCase().includes(w));
    let score = 0;
    if (diff < 0.01 && near <= 5) score = 3;
    else if (nameHit && near <= 7 && rel <= 0.3) score = 2.5;
    else if (nameHit && near <= 10) score = 1.5;
    else if (rel <= 0.02 && near <= 3) score = 1.2;
    if (score > bestScore || (score && score === bestScore && near < bestNear)) { best = r; bestScore = score; bestNear = near; }
  }
  return best ? best.id : null;
}
const txMonth = (t) => t.date.slice(0, 7) + '-01';
const normDesc = (s) => String(s).toUpperCase().replace(/[*#/\\.,:;'"()-]/g, ' ').replace(/\S*\d\S*/g, ' ').replace(/\b(CD|CARD|POS|DD|SO|BGC|FPI|FPO|TFR|VIS|ON|GBR|GB|UK|LTD)\b/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 24);
function ruleStatus(row, month) {
  if (!row.rule) return null;
  const ts = bTxns().filter((t) => t.matched_rule === row.rule.id && !t.ignored && txMonth(t) === month && (t.amount < 0 ? t.account_id === row.rule.account_id : true));
  const acc = row.rule.account_id;
  if (ts.length) {
    const sum = n2(ts.reduce((s, t) => s + Math.abs(t.amount), 0));
    const last = ts.map((t) => t.date).sort().pop();
    if (Math.abs(sum - row.amount) < 0.01) return `<span class="pill green">✓ Paid ${ts.length > 1 ? '×' + ts.length : parseYmd(last).getDate() + ' ' + MONTHS[parseYmd(last).getMonth()]}</span>`;
    return `<span class="pill orange">Paid ${gbp(sum)}</span>`;
  }
  const accTx = bTxns().filter((t) => t.account_id === acc);
  if (!accTx.length) return null;
  const covered = accTx.map((t) => t.date).sort().pop();
  const due = ruleDates(row.rule, month)[0];
  if (due && ymd(new Date(due.getFullYear(), due.getMonth(), due.getDate() + 3)) <= covered) return '<span class="pill red">Not seen</span>';
  return null;
}
function actualFor(month, acc) {
  const ts = bTxns().filter((t) => txMonth(t) === month && !t.ignored && (!acc || t.account_id === acc));
  const between = (t) => { const r = t.matched_rule && bRule(t.matched_rule); return r && (r.kind === 'transfer' || r.kind === 'save'); };
  const out = n2(-ts.filter((t) => t.amount < 0 && !between(t)).reduce((s, t) => s + t.amount, 0));
  const inn = n2(ts.filter((t) => t.amount > 0 && !between(t)).reduce((s, t) => s + t.amount, 0));
  const unplanned = ts.filter((t) => t.amount < 0 && !t.matched_rule).sort((a, b) => a.amount - b.amount);
  return { ts, out, inn, unplanned, unplannedTotal: n2(-unplanned.reduce((s, t) => s + t.amount, 0)) };
}
function looksRegular(t) {
  const k = normDesc(t.description);
  if (k.length < 3) return false;
  const months = new Set(bTxns().filter((x) => x.account_id === t.account_id && x.amount < 0 && !x.matched_rule && normDesc(x.description) === k).map(txMonth));
  return months.size >= 2;
}
function statementSection(month, acc) {
  const has = bTxns().some((t) => !acc || t.account_id === acc);
  const btn = `<button class="btn secondary b-import" data-a="bImport">${icon('list', 18)} Import a statement</button>`;
  if (!has) return `<div style="margin-top:14px">${btn}</div><p class="hint">Download a statement file from online banking and import it to see what’s actually been paid.</p>`;
  const a = actualFor(month, acc);
  if (!a.ts.length) return `<div style="margin-top:14px">${btn}</div><p class="hint">No statement transactions for ${monthLabel(month)} yet.</p>`;
  const showAll = ui('unplannedAll', false);
  const list = a.unplanned.slice(0, showAll ? 999 : 8);
  return `<div class="section-label">From your statements</div>
    <div class="b-actual">
      <div><span>Actually out</span><b>${gbp(a.out)}</b></div>
      <div><span>Actually in</span><b class="in">${gbp(a.inn)}</b></div>
      <div><span>Not in budget</span><b class="${a.unplannedTotal ? 'warn' : ''}">${gbp(a.unplannedTotal)}</b></div>
    </div>
    <p class="hint">Moving money between your own accounts is left out of these totals.</p>
    ${a.unplanned.length ? `<div class="section-label"><span>Not in your budget · ${a.unplanned.length}</span>${a.unplanned.length > 8 ? `<button data-a="toggleUi" data-k="unplannedAll">${showAll ? 'Show fewer' : 'Show all'}</button>` : ''}</div>
      <div class="group">${list.map((t) => txRow(t, acc)).join('')}</div>` : ''}
    <div style="margin-top:14px">${btn}</div>`;
}
function txRow(t, acc) {
  const a = bAccount(t.account_id);
  const d = parseYmd(t.date);
  return `<div class="row tap" data-a="bTxn" data-id="${t.id}"><div class="row-main"><div class="row-title" style="font-size:15px">${esc(t.description || 'No description')}</div>
    <div class="row-meta"><span>${d.getDate()} ${MONTHS[d.getMonth()]}</span>${!acc && a ? `<span class="acc-dot" style="--c:${a.colour || '#8E8E93'}">${esc(a.name)}</span>` : ''}${looksRegular(t) ? '<span class="pill blue">Looks regular</span>' : ''}</div></div>
    <span class="b-amt ${t.amount > 0 ? 'in' : ''}">${t.amount > 0 ? '+' : ''}${gbp(Math.abs(t.amount))}</span></div>`;
}

/* ---------- sheets ---------- */
const BANK_HELP = [
  ['HSBC', 'Online banking (website) → account → Download transactions → CSV'],
  ['Barclays', 'Online banking (website) → account → Export → CSV'],
  ['Santander', 'Online banking → Download transactions → Text file or Excel (CSV)'],
  ['Lloyds / Halifax', 'Online banking → account → Export → CSV'],
  ['Atom', 'App → account → Statements / Export → CSV'],
  ['Amex', 'americanexpress.co.uk → Statements & Activity → Download → CSV'],
];
function importSheetB(s) {
  const accs = bAccounts();
  let html = head('Import a statement', '<span></span>', s.parsed ? `<button class="txt r" data-a="bImportGo" ${s.busy || !s.newRows.length ? 'disabled style="opacity:.4"' : ''}>Import</button>` : '<span></span>');
  html += `<div class="group"><div class="field"><label>Account</label><select data-change="bImpAcc">${accs.map((a) => `<option value="${a.id}" ${s.account === a.id ? 'selected' : ''}>${esc(a.name)}</option>`).join('')}</select></div></div>
    <div style="margin-top:12px"><label class="btn ${s.parsed ? 'secondary' : ''}" for="b-file">${s.parsed ? 'Choose a different file' : 'Choose statement file'}</label>
    <input type="file" id="b-file" accept=".csv,.txt,.ofx,.qfx,.qif,text/csv,text/plain" hidden data-change="bImpFile"></div>`;
  if (s.error) html += `<p class="hint" style="color:var(--red)">${esc(s.error)}</p>`;
  if (s.parsed) {
    const rows = s.rows;
    const out = n2(-rows.filter((r) => r.amount < 0).reduce((x, r) => x + r.amount, 0)), inn = n2(rows.filter((r) => r.amount > 0).reduce((x, r) => x + r.amount, 0));
    const dates = rows.map((r) => r.date).sort();
    const fd = (x) => { const d = parseYmd(x); return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
    html += `<div class="section-label">${esc(s.fileName)} · ${s.format}</div>
      <div class="b-actual"><div><span>Transactions</span><b>${rows.length}</b></div><div><span>Money out</span><b>${gbp(out)}</b></div><div><span>Money in</span><b class="in">${gbp(inn)}</b></div></div>
      <p class="hint">${rows.length ? `${fd(dates[0])} – ${fd(dates[dates.length - 1])}. ` : ''}${s.dupes ? `${s.dupes} already imported, so they’ll be skipped.` : ''}</p>
      <div class="group" style="margin-top:10px"><div class="field tap" data-a="bImpFlip"><label>Spending shows as positive<br><small class="muted">Usually credit cards, e.g. Amex</small></label><span style="flex:1"></span><span class="switch ${s.flip ? 'on' : ''}"></span></div></div>
      <div class="section-label">First few — check money out shows as out</div>
      <div class="group">${rows.slice(0, 6).map((r) => `<div class="row"><div class="row-main" style="cursor:default"><div class="row-title" style="font-size:15px">${esc(r.description || '—')}</div><div class="row-meta"><span>${fd(r.date)}</span></div></div><span class="b-amt ${r.amount > 0 ? 'in' : ''}">${r.amount > 0 ? '+' : '−'}${gbp(Math.abs(r.amount))}</span></div>`).join('')}</div>
      <div style="margin-top:16px"><button class="btn" data-a="bImportGo" ${s.busy || !s.newRows.length ? 'disabled' : ''}>${s.busy ? 'Importing…' : s.newRows.length ? `Import ${s.newRows.length} transaction${s.newRows.length === 1 ? '' : 's'}` : 'Nothing new to import'}</button></div>`;
  } else {
    html += `<div class="section-label">Getting the file</div><div class="group">${BANK_HELP.map(([b, h]) => `<div class="row"><div class="row-main" style="cursor:default"><div class="row-title" style="font-size:15px">${b}</div><div class="row-sub">${h}</div></div></div>`).join('')}</div>
      <p class="hint">Most banks only offer downloads on their website, not in the app. Save the file to your iPhone’s Files, then choose it here. CSV, OFX, QIF and Santander text files all work.</p>
      <p class="hint">The file is read on your phone. Only the date, description and amount of each transaction are saved, and only you and Louise can see them.</p>`;
  }
  return html;
}
function txnSheet(s) {
  const t = bTxns().find((x) => x.id === s.id);
  if (!t) return head('Transaction', '<span></span>');
  const a = bAccount(t.account_id), d = parseYmd(t.date);
  const rules = bRules().filter((r) => (t.amount < 0 ? r.account_id === t.account_id && ['out', 'save', 'transfer'].includes(r.kind) : (r.kind === 'in' && r.account_id === t.account_id) || r.to_account_id === t.account_id));
  return head('Transaction', '<button class="txt danger" data-a="bTxnDelete">Delete</button>') + `
    <div class="card-pad" style="margin-top:4px"><div class="big-q" style="font-size:18px">${esc(t.description || 'No description')}</div>
      <div class="row-meta" style="margin-top:6px"><span>${WEEKDAYS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}</span>${a ? `<span class="acc-dot" style="--c:${a.colour || '#8E8E93'}">${esc(a.name)}</span>` : ''}</div>
      <div class="b-left" style="margin-top:8px"><b style="color:${t.amount > 0 ? 'var(--ok-green)' : 'var(--label)'}">${t.amount > 0 ? '+' : '−'}${gbp(Math.abs(t.amount))}</b></div></div>
    <div class="section-label">Which regular payment is this?</div>
    <div class="group"><div class="field"><label>Matches</label><select data-change="bTxnRule"><option value="">Not in the budget</option>${rules.map((r) => `<option value="${r.id}" ${t.matched_rule === r.id ? 'selected' : ''}>${esc(r.name)} (${gbp(r.amount)})</option>`).join('')}</select></div>
      <div class="field tap" data-a="bTxnIgnore"><label>Leave out of totals<br><small class="muted">e.g. moving money between our accounts</small></label><span style="flex:1"></span><span class="switch ${t.ignored ? 'on' : ''}"></span></div></div>
    ${!t.matched_rule && t.amount < 0 ? `<div style="margin-top:14px"><button class="btn secondary" data-a="bTxnAdd">${icon('plus', 18, 2.4)} Add as a regular payment</button></div>${looksRegular(t) ? '<p class="hint">This shows up in more than one month, so it may be a regular payment.</p>' : ''}` : ''}`;
}
function statementsList() {
  const batches = {};
  for (const t of bTxns()) { const k = t.batch_id || 'none'; (batches[k] = batches[k] || { id: k, account: t.account_id, n: 0, from: t.date, to: t.date, at: t.created_at }); const b = batches[k]; b.n++; if (t.date < b.from) b.from = t.date; if (t.date > b.to) b.to = t.date; }
  const list = Object.values(batches).sort((a, b) => (b.at || '').localeCompare(a.at || ''));
  const fd = (x) => { const d = parseYmd(x); return `${d.getDate()} ${MONTHS[d.getMonth()]}`; };
  return `<div class="section-label"><span>Imported statements</span><button data-a="bImport">+ Import</button></div>
    <div class="group">${list.map((b) => `<div class="row"><span class="acc-swatch" style="--c:${bAccount(b.account)?.colour || '#8E8E93'}"></span><div class="row-main" style="cursor:default"><div class="row-title" style="font-size:15px">${esc(bAccount(b.account)?.name || 'Account')}</div><div class="row-sub">${b.n} transactions · ${fd(b.from)} – ${fd(b.to)}</div></div>${b.id !== 'none' ? `<button class="link-btn" style="color:var(--red)" data-a="bBatchDelete" data-id="${b.id}">Remove</button>` : ''}</div>`).join('') || '<div class="row"><div class="row-main muted">None yet</div></div>'}</div>`;
}
async function runImport(s) {
  s.busy = true; renderSheets(true);
  const batch = uid();
  const rows = s.newRows.map((r) => {
    const t = { id: uid(), account_id: s.account, date: r.date, amount: r.amount, description: r.description, fingerprint: r.fp, batch_id: batch, ignored: false, created_by: S.me, created_at: new Date().toISOString() };
    t.matched_rule = matchTxn(t);
    return t;
  });
  try {
    for (let i = 0; i < rows.length; i += 300) await store.insertIgnore('budget_transactions', rows.slice(i, i + 300), 'fingerprint');
    await reload();
    S.sheets = []; renderSheets(true);
    const matched = rows.filter((r) => r.matched_rule).length;
    toast(`Imported ${rows.length} · ${matched} matched to regular payments`);
    const months = [...new Set(rows.map(txMonth))].sort();
    if (months.length) { S.ui.bMonth = months[months.length - 1]; render(); }
  } catch (e) { console.error(e); s.busy = false; s.error = e.message; renderSheets(true); }
}
function prepImport(s) {
  const sign = s.flip ? -1 : 1;
  const have = new Set(bTxns().map((t) => t.fingerprint));
  const seen = {};
  s.rows = s.raw.map((r) => ({ ...r, amount: n2(r.amount * sign) }));
  s.newRows = [];
  s.dupes = 0;
  for (const r of s.rows) {
    const base = `${s.account}|${r.date}|${r.amount.toFixed(2)}|${normDesc(r.description)}`;
    seen[base] = (seen[base] || 0) + 1;
    r.fp = `${base}|${seen[base]}`;
    if (have.has(r.fp)) s.dupes++; else s.newRows.push(r);
  }
}
Object.assign(A, {
  bImport: () => {
    if (!bAccounts().length) return toast('Add an account first');
    if (missing('budget_transactions')) return toast('Run the latest update in Supabase to switch on statement import');
    const acc = ui('bAcc', null) || bAccounts()[0].id;
    openSheet({ kind: 'bImport', account: acc });
  },
  bImpFlip: () => { const s = topSheet(); s.flip = !s.flip; prepImport(s); renderSheets(true); },
  bImportGo: () => { const s = topSheet(); if (s.newRows?.length && !s.busy) runImport(s); },
  bTxn: (el) => openSheet({ kind: 'bTxn', id: el.dataset.id }),
  bTxnIgnore: () => { const t = bTxns().find((x) => x.id === topSheet().id); upd('budget_transactions', { id: t.id }, { ignored: !t.ignored }); renderSheets(true); },
  bTxnDelete: async () => { const id = topSheet().id; if (!await ask('Delete this transaction?', 'Delete', true)) return; S.sheets.pop(); await del('budget_transactions', { id }); },
  bTxnAdd: () => {
    const t = bTxns().find((x) => x.id === topSheet().id);
    const name = normDesc(t.description).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || 'Payment';
    const firstSeen = bTxns().filter((x) => x.account_id === t.account_id && normDesc(x.description) === normDesc(t.description)).map((x) => x.date).sort()[0] || t.date;
    S.sheets.pop();
    openSheet({ kind: 'bEntry', fromTxn: t.id, draft: { kind: 'out', name, amount: String(Math.abs(t.amount)), account_id: t.account_id, to_account_id: '', pot_id: '', category: '', note: '', freq: 'monthly', day: parseYmd(t.date).getDate(), weekday: parseYmd(t.date).getDay(), start_date: firstSeen.slice(0, 7) + '-01', ends: false, end_date: '', month: txMonth(t) } });
  },
  bBatchDelete: async (el) => {
    const n = bTxns().filter((t) => t.batch_id === el.dataset.id).length;
    if (!await ask(`Remove these ${n} imported transactions?`, 'Remove', true)) return;
    await del('budget_transactions', { batch_id: el.dataset.id });
    renderSheets(true);
  },
  bRematch: async () => {
    const un = bTxns().filter((t) => !t.matched_rule && !t.ignored);
    let n = 0;
    for (const t of un) { const r = matchTxn(t); if (r) { n++; await store.update('budget_transactions', { id: t.id }, { matched_rule: r }); } }
    await reload();
    toast(n ? `Matched ${n} more` : 'No new matches');
  },
});
Object.assign(CHANGE, {
  bImpAcc: (el) => { const s = topSheet(); s.account = el.value; const a = bAccount(s.account); if (s.raw) { s.flip = s.amex || /amex|american express|credit card/i.test(a?.name || ''); prepImport(s); } renderSheets(true); },
  bImpFile: async (el) => {
    const s = topSheet(), f = el.files && el.files[0];
    el.value = '';
    if (!f) return;
    s.error = null;
    try {
      const text = await readFileText(f);
      const p = parseStatement(text);
      if (!p.rows.length) { s.parsed = false; s.error = 'Couldn’t find any transactions in that file. Try the CSV download from online banking.'; renderSheets(true); return; }
      const a = bAccount(s.account);
      Object.assign(s, { parsed: true, raw: p.rows, format: p.format, amex: p.amex, fileName: f.name, flip: p.amex || /amex|american express|credit card/i.test(a?.name || '') });
      prepImport(s);
    } catch (e) { console.error(e); s.error = 'Couldn’t read that file.'; }
    renderSheets(true);
  },
  bTxnRule: (el) => { upd('budget_transactions', { id: topSheet().id }, { matched_rule: el.value || null }); renderSheets(true); },
});

/* Demo-only example budget (never used with the real database) */
function seedBudget() {
  const d = new Date();
  const start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`.replace(/^(\d+)-(\d+)/, (_, y, m) => { const x = new Date(+y, +m - 3, 1); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}`; });
  const id = () => uid();
  const joint = id(), mike = id(), lou = id(), sav = id(), isa = id();
  const accounts = [
    { id: joint, name: 'Joint account', colour: '#0A84FF', sort: 1 },
    { id: mike, name: 'Mike’s account', colour: '#5E5CE6', sort: 2 },
    { id: lou, name: 'Louise’s account', colour: '#FF375F', sort: 3 },
    { id: sav, name: 'Holiday saver', colour: '#FF9500', sort: 4 },
    { id: isa, name: 'Family ISA', colour: '#00A5A8', sort: 5 },
  ];
  const pots = [];
  const endNext = (() => { const x = new Date(d.getFullYear(), d.getMonth() + 7, 0); return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`; })();
  const R = (kind, name, amount, account_id, extra) => ({ id: uid(), kind, name, amount, account_id, to_account_id: null, pot_id: null, category: null, freq: 'monthly', day: 1, weekday: null, start_date: start, end_date: null, note: null, created_by: 'mike', ...extra });
  const rules = [
    R('in', 'Mike salary', 2900, mike, { day: 28 }),
    R('in', 'Louise salary', 2100, lou, { day: 25 }),
    R('in', 'Child benefit', 44, joint, { freq: 'weekly', day: null, weekday: 1 }),
    R('transfer', 'Mike → joint', 1700, mike, { to_account_id: joint, day: 28 }),
    R('transfer', 'Louise → joint', 1300, lou, { to_account_id: joint, day: 25 }),
    R('transfer', 'Spending money', 75, joint, { to_account_id: lou, freq: 'weekly', day: null, weekday: 5 }),
    R('out', 'Mortgage', 1150, joint, { category: 'Mortgage / rent' }),
    R('out', 'Council tax', 210, joint, { category: 'Council tax' }),
    R('out', 'Energy', 165, joint, { category: 'Energy', day: 5 }),
    R('out', 'Broadband & TV', 72, joint, { category: 'Phone & broadband', day: 12 }),
    R('out', 'Car finance', 245, joint, { category: 'Car', day: 15, end_date: endNext }),
    R('out', 'Big shop', 120, joint, { category: 'Food shopping', freq: 'weekly', day: null, weekday: 6 }),
    R('out', 'Pocket money', 10, joint, { category: 'Pocket money', freq: 'weekly', day: null, weekday: 5 }),
    R('out', 'Streaming', 28, joint, { category: 'Subscriptions', day: 9 }),
    R('out', 'Football club', 35, joint, { category: 'Clubs & activities', day: 3 }),
    R('out', 'Car insurance', 540, joint, { category: 'Insurance', freq: 'yearly', day: null, start_date: `${start.slice(0, 7)}-20` }),
    R('save', 'Holiday fund', 250, joint, { to_account_id: sav, day: 2 }),
    R('save', 'Rainy day', 150, joint, { to_account_id: isa, day: 2 }),
    R('save', 'Christmas', 25, joint, { to_account_id: sav, freq: 'weekly', day: null, weekday: 5 }),
  ];
  const cur = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  const entries = [
    { id: uid(), rule_id: null, month: cur, kind: 'out', name: 'School trip', amount: 45, account_id: joint, category: 'Kids', day: 18, included: true, custom_amount: false },
    { id: uid(), rule_id: rules.find((r) => r.name === 'Streaming').id, month: cur, kind: 'out', name: 'Streaming', amount: 0, account_id: joint, included: false, custom_amount: false },
  ];
  const T = (day, amount, description, mOff = 0, account_id = joint) => { const x = new Date(d.getFullYear(), d.getMonth() + mOff, day); return { id: uid(), account_id, date: `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`, amount, description, fingerprint: uid(), batch_id: 'demo', ignored: false, created_at: new Date().toISOString() }; };
  const byName = (n) => rules.find((r) => r.name === n).id;
  const txns = [
    { ...T(1, -1150, 'NATIONWIDE BS MORTGAGE DD'), matched_rule: byName('Mortgage') },
    { ...T(1, -210, 'COUNCIL TAX DD'), matched_rule: byName('Council tax') },
    { ...T(3, -35, 'FC JUNIORS SO'), matched_rule: byName('Football club') },
    { ...T(5, -172.4, 'OCTOPUS ENERGY DD'), matched_rule: byName('Energy') },
    { ...T(2, -250, 'TFR HOLIDAY SAVER'), matched_rule: byName('Holiday fund') },
    T(2, -84.12, 'TESCO STORES 2231'), T(4, -23.99, 'AMAZON MKTPLACE'), T(4, -61.2, 'SHELL HARROGATE'), T(3, -11.99, 'SPOTIFY P1A2B3'), T(3, -11.99, 'SPOTIFY P9X8Y7', -1),
  ];
  return { budget_accounts: accounts, budget_pots: pots, budget_recurring: rules, budget_entries: entries, budget_transactions: txns };
}

Object.assign(A, {
  editHome: () => openSheet({ kind: 'homeEdit' }),
  setBoard: (el) => { setPref('cdBoard', el.dataset.v); SPUN.clear(); render(); },
  homeToggle: (el) => { const lay = homeLayout(), id = el.dataset.id; lay.hidden = lay.hidden.includes(id) ? lay.hidden.filter((x) => x !== id) : [...lay.hidden, id]; saveHomeLayout(lay); },
  homeReset: async () => { if (!await ask('Put the home screen back to how it started?', 'Reset')) return; setPref('home', null); render(); renderSheets(true); },
});

document.addEventListener('click', (e) => {
  if (Date.now() < DRAG.until) { e.preventDefault(); e.stopPropagation(); return; }
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const fn = A[el.dataset.a];
  if (fn) { e.preventDefault(); fn(el, e); }
});
document.addEventListener('keydown', (e) => {
  const el = e.target;
  if (e.key === 'Enter' && el.dataset?.enter) { e.preventDefault(); ENTER[el.dataset.enter](el); }
  if (e.key === 'Enter' && el.id === 'it-text') { e.preventDefault(); el.blur(); }
});
document.addEventListener('change', (e) => { const el = e.target; if (el.dataset?.change) CHANGE[el.dataset.change](el); });
document.addEventListener('input', (e) => {
  const el = e.target;
  if (el.dataset?.input) INPUT[el.dataset.input](el);
  if (el.tagName === 'TEXTAREA' && el.classList.contains('big-input')) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
});

/* ============================================================
   Push notifications
   ============================================================ */
function b64ToU8(s) {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}
async function enablePush() {
  const standalone = window.navigator.standalone || matchMedia('(display-mode: standalone)').matches;
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || typeof Notification === 'undefined') {
    toast(standalone ? 'This iPhone needs iOS 16.4 or later for notifications' : 'Add McGaw Lists to your Home Screen first');
    if (!standalone) openSheet({ kind: 'install' });
    return;
  }
  try {
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return toast('Notifications are off — you can change this in iPhone Settings → Notifications');
    const reg = await navigator.serviceWorker.ready;
    if (!DEMO && CFG.vapidPublicKey) {
      const sub = (await reg.pushManager.getSubscription()) || (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(CFG.vapidPublicKey) }));
      await store.savePush(sub, S.me);
    }
    toast('Notifications are on for this iPhone');
    render();
  } catch (e) {
    console.error(e);
    toast('Couldn’t turn on notifications: ' + (e.message || e));
  }
}

/* ============================================================
   Alerts (iOS style, in-app)
   ============================================================ */
function ask(message, ok = 'OK', danger = false, withInput = false, placeholder = '') {
  return new Promise((resolve) => {
    const host = document.createElement('div');
    host.className = 'alert-host';
    host.innerHTML = `<div class="alert" role="alertdialog" aria-modal="true"><p>${esc(message)}</p>${withInput ? `<input id="alert-input" placeholder="${esc(placeholder)}" autocomplete="off">` : ''}<div class="alert-btns"><button data-r="0">Cancel</button><button data-r="1" class="${danger ? 'danger' : 'strong'}">${esc(ok)}</button></div></div>`;
    document.body.appendChild(host);
    const input = host.querySelector('input');
    const done = (r) => { host.remove(); resolve(withInput ? (r ? input.value : null) : r); };
    host.addEventListener('click', (e) => { const b = e.target.closest('[data-r]'); if (b) { e.stopPropagation(); done(b.dataset.r === '1'); } });
    if (input) { setTimeout(() => input.focus(), 30); input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); done(true); } }); }
  });
}
const askText = (title, placeholder) => ask(title, 'OK', false, true, placeholder);

/* ============================================================
   Toast
   ============================================================ */
let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ============================================================
   Login
   ============================================================ */
function showLogin() {
  $('#tabbar').className = 'hide';
  $('#view').innerHTML = `<div class="login">
    <img class="logo" src="icons/icon-192.png" alt="">
    <h1>McGaw Lists</h1>
    <p class="sub">Shopping, jobs, meals and notices<br>for Mike, Louise, Esme &amp; Oscar</p>
    ${DEMO ? `
      <div class="section-label" style="margin:0 4px 8px">Demo — who are you?</div>
      <div class="demo-who">${FAMILY.map((m) => `<button data-login="${m.id}">${`<span class="av" style="--c:${m.colour};--s:44px">${m.name[0]}</span>`}${m.name}</button>`).join('')}</div>
      <p class="hint" style="text-align:center;margin-top:18px">Demo mode: nothing is shared yet and everything stays on this device. Connect Supabase (see the setup guide) to sync between your iPhones.</p>`
    : `
      <form id="login-form" novalidate><div class="group"><label class="login-row" for="email"><input id="email" type="email" inputmode="email" placeholder="Email" autocomplete="username" autocapitalize="off" autocorrect="off" spellcheck="false" required></label>${pwRow('password', 'Password', 'current-password')}</div>
      <div style="margin-top:16px"><button class="btn" type="submit" id="login-btn">Sign in</button></div></form>
      <div class="err" id="login-err"></div>
      <button class="link-btn" style="display:block;margin:6px auto 0" id="forgot">Forgotten password?</button>`}
  </div>`;
  if (DEMO) {
    document.querySelectorAll('[data-login]').forEach((b) => b.addEventListener('click', async () => { await store.signInAs(b.dataset.login); start(); }));
  } else {
    wireEyes();
    $('#login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#login-btn'); btn.disabled = true; btn.textContent = 'Signing in…';
      try { await store.signIn($('#email').value.trim(), $('#password').value); await start(); }
      catch (err) { $('#login-err').textContent = /invalid/i.test(err.message) ? 'That email or password isn’t right' : err.message; btn.disabled = false; btn.textContent = 'Sign in'; }
    });
    $('#forgot').addEventListener('click', async () => {
      const email = $('#email').value.trim();
      if (!email) { $('#login-err').textContent = 'Type your email first, then tap this again'; return; }
      try { await store.resetPassword(email); $('#login-err').textContent = ''; toast('Check your email for a reset link'); } catch (err) { $('#login-err').textContent = err.message; }
    });
  }
}

async function start() {
  try {
    const sess = await store.session();
    if (!sess) return showLogin();
    const me = await store.whoAmI();
    if (!me) {
      await store.signOut();
      showLogin();
      $('#login-err') && ($('#login-err').textContent = 'That email isn’t on the family list. Ask Mike to add it in Supabase.');
      return;
    }
    S.me = me;
    render();
    await reload();
    store.subscribe(scheduleReload);
    loadTodo(true);
    loadOutlook();
  } catch (e) {
    console.error(e);
    showLogin();
    if ($('#login-err')) $('#login-err').textContent = 'Couldn’t connect. Check your signal and try again.';
  }
}

window.addEventListener('hashchange', () => { S.sheets = []; render(); $('#view').scrollTop = 0; });
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.me) { reload(); loadTodo(true); } });
(() => {
  const q = new URLSearchParams(location.search).get('outlook');
  if (!q) return;
  history.replaceState(null, '', location.pathname + (location.hash || '#/family'));
  const msg = { connected: 'Outlook connected — open your Work list and tap Pull from inbox', denied: 'Outlook access wasn’t allowed', cancelled: 'Microsoft sign-in was cancelled', expired: 'That took too long — try connecting again', error: 'Couldn’t connect to Outlook — try again' }[q];
  if (msg) setTimeout(() => toast(msg), 900);
})();
(() => {
  const q = new URLSearchParams(location.search).get('todo');
  if (!q) return;
  history.replaceState(null, '', location.pathname + (location.hash || '#/family'));
  const msg = { connected: 'Microsoft To Do connected — now link a list', cancelled: 'Microsoft sign-in was cancelled', expired: 'That took too long — try connecting again', error: 'Couldn’t connect to Microsoft — try again' }[q];
  if (msg) setTimeout(() => { toast(msg); if (q === 'connected') setTimeout(() => A.todoOpen(), 900); }, 900);
})();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch((e) => console.warn('SW', e));
  navigator.serviceWorker.addEventListener('message', (e) => { if (e.data?.url) location.hash = e.data.url.replace(/^.*#/, '#'); });
}
applyAppearance();
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyAppearance);
start();

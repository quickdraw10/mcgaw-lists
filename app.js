/* McGaw Lists — family lists web app (installable on iPhone from Safari) */
'use strict';

const CFG = window.MCGAW_CONFIG || {};
const DEMO = !CFG.supabaseUrl || !CFG.supabaseAnonKey;

/* ============================================================
   Constants
   ============================================================ */
const FAMILY = [
  { id: 'mike',   name: 'Mike',   role_label: 'Dad', colour: '#0A84FF', sort: 1 },
  { id: 'louise', name: 'Louise', role_label: 'Mum', colour: '#FF375F', sort: 2 },
  { id: 'esme',   name: 'Esme',   role_label: null,  colour: '#BF5AF2', sort: 3 },
  { id: 'oscar',  name: 'Oscar',  role_label: null,  colour: '#30D158', sort: 4 },
];

const IC = {
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
  work:      { name: 'Work',            icon: 'brief', colour: '#5E5CE6', title: 'Work',          desc: 'Prioritised tasks moving To do → Doing → Done.', sub: true },
  christmas: { name: 'Christmas',       icon: 'gift',  colour: '#E0352B', title: 'Christmas 2026', desc: 'Gift ideas by person, budget, and secrets.', sub: true },
  packing:   { name: 'Holiday packing', icon: 'bag',   colour: '#FF9500', title: 'Holiday packing', desc: 'A bag for each of us, plus shared bits.', sub: true },
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
    const res = await Promise.all(TABLES.map((t) => this.fetchAll(t)));
    return Object.fromEntries(TABLES.map((t, i) => [t, res[i]]));
  }
  async insert(t, rows) { const { error } = await this.sb.from(t).insert(rows); if (error) throw error; }
  async update(t, where, patch) { const { error } = await this.sb.from(t).update(patch).match(where); if (error) throw error; }
  async remove(t, where) { const { error } = await this.sb.from(t).delete().match(where); if (error) throw error; }
  async upsert(t, row, onConflict) { const { error } = await this.sb.from(t).upsert(row, { onConflict }); if (error) throw error; }
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
  async savePush(sub, me) {
    const j = sub.toJSON();
    await this.upsert('push_subscriptions', { endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth, member: me }, 'endpoint');
  }
}

class DemoStore {
  constructor() {
    this.key = 'mcgaw-lists-demo-v2';
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
    return JSON.parse(JSON.stringify({
      members: db.members, lists,
      list_access: db.list_access.filter((a) => ids.has(a.list_id)),
      items: db.items.filter((i) => ids.has(i.list_id) && !(i.hidden_from || []).includes(me)),
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
      if (t === 'items') this.db.items = this.db.items.filter((x) => x.parent_id !== r.id);
    }
    this.persist();
  }
  async upsert(t, row, onConflict) {
    const keys = onConflict.split(',');
    const hit = this.db[t].find((r) => keys.every((k) => r[k] === row[k]));
    if (hit) Object.assign(hit, row); else this.db[t].push({ ...row });
    this.persist();
  }
  subscribe() {}
  async savePush() {}
  async todo() { throw new Error('Microsoft To Do sync works once the app is connected to Supabase'); }
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
  share('l-xmas', ['louise'], 'admin');
  share('l-pack', ['mike', 'esme', 'oscar']);
  const fix = I('l-todo', 'Sort out the garage', { assignees: ['mike', 'oscar'], due: d(1), priority: 1 });
  const items = [
    I('l-shop', 'Semi-skimmed milk', { quantity: '2', category: 'Dairy & eggs' }),
    I('l-shop', 'Bananas', { category: 'Fruit & veg' }),
    I('l-shop', 'Sourdough loaf', { category: 'Bakery' }),
    I('l-shop', 'Chicken thighs', { category: 'Meat & fish', quantity: '1kg' }),
    I('l-shop', 'Fish fingers', { category: 'Frozen', created_by: 'oscar' }),
    I('l-shop', 'Dishwasher tablets', { category: 'Household' }),
    I('l-shop', 'Free-range eggs', { category: 'Dairy & eggs', done: true, done_by: 'louise' }),
    fix,
    I('l-todo', 'Clear the shelves', { parent_id: fix.id, assignees: ['oscar'], done: true }),
    I('l-todo', 'Take old paint to the tip', { parent_id: fix.id, assignees: ['mike'] }),
    I('l-todo', 'Put bikes on the wall hooks', { parent_id: fix.id, assignees: ['mike', 'oscar'] }),
    I('l-todo', 'Book dentist for the kids', { assignees: ['louise'], due: d(-1), created_by: 'louise' }),
    I('l-todo', 'Renew car insurance', { assignees: ['mike'], due: d(9) }),
    I('l-todo', 'Tidy bedroom', { assignees: ['esme'], due: t, created_by: 'louise' }),
    I('l-todo', 'Fix the gate latch', {}),
    I('l-work', 'Kit list for Saturday OB', { status: 'doing', priority: 1, due: d(2), assignees: ['mike'] }),
    I('l-work', 'Crew hotel bookings', { status: 'todo', due: d(4), assignees: ['mike'] }),
    I('l-work', 'Expenses for October', { status: 'todo', due: d(1), assignees: ['mike'] }),
    I('l-work', 'Send rate card', { status: 'done', done: true, assignees: ['mike'] }),
    I('l-xmas', 'Lego Technic set', { data: { for: 'oscar', price: 89.99, status: 'bought' }, hidden_from: ['oscar'], done: false }),
    I('l-xmas', 'Football boots', { data: { for: 'oscar', price: 55, status: 'idea' }, hidden_from: ['oscar'] }),
    I('l-xmas', 'Art set & sketchbook', { data: { for: 'esme', price: 35, status: 'wrapped' }, hidden_from: ['esme'], done: true }),
    I('l-xmas', 'Concert tickets', { data: { for: 'esme', price: 120, status: 'idea' }, hidden_from: ['esme'] }),
    I('l-xmas', 'Spa day', { data: { for: 'louise', price: 150, status: 'idea' }, hidden_from: ['louise'], created_by: 'mike' }),
    I('l-xmas', 'Biscuit tin & card', { data: { for: 'Grandma', price: 20, status: 'idea' } }),
    I('l-pack', 'Passport', { data: { bag: 'esme' }, done: true }),
    I('l-pack', 'Phone & charger', { data: { bag: 'esme' } }),
    I('l-pack', 'Swimwear', { data: { bag: 'esme' } }),
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
  return { members: FAMILY, lists, list_access: access, items, meal_slots, meal_presence, notifications };
}

/* ============================================================
   State
   ============================================================ */
const store = DEMO ? new DemoStore() : new SupaStore();
const S = {
  me: null, ready: false,
  data: { members: FAMILY, lists: [], list_access: [], items: [], meal_slots: [], meal_presence: [], notifications: [] },
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
const itemsOf = (listId) => S.data.items.filter((i) => i.list_id === listId && !i.parent_id).sort(sortItems);
const childrenOf = (id) => S.data.items.filter((i) => i.parent_id === id).sort(sortItems);
const unreadCount = () => S.data.notifications.filter((n) => !n.read).length;
const listColour = (l) => l.colour || TYPES[l.type].colour;

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
  if (['mine', 'activity', 'family'].includes(name)) return { name };
  return { name: 'home' };
}
const go = (hash) => { location.hash = hash; };

function render() {
  const app = $('#view');
  if (!S.me) { renderSheets(); return; }
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
  else html = homeView();
  app.innerHTML = html;
  app.classList.toggle('no-tabs', r.name === 'list');
  if (keep) { const el = document.getElementById(keep.id); if (el) { el.value = keep.v; el.focus(); try { el.setSelectionRange(keep.s, keep.s); } catch { /* */ } } }
  inkPass(app);
  renderTabs(r);
  renderSheets();
}

function renderTabs(r) {
  const tb = $('#tabbar');
  if (!S.me || r.name === 'list') { tb.className = 'hide'; tb.innerHTML = ''; return; }
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
function listRow(l) {
  const others = listMembers(l).map((m) => m.id).filter((id) => id !== S.me);
  return `<div class="row tap" data-a="go" data-h="#/list/${l.id}">
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

  let body = '';
  if (!S.data.lists.length) {
    body = `<div class="empty"><div class="big">No lists yet</div>Make a shopping list, a meal plan or a notice board, then choose who in the family can see it.<br><br><button class="btn" data-a="newList">${icon('plus', 20, 2.4)} New list</button></div>`;
  } else {
    for (const t of TYPE_ORDER) {
      const ls = lists.filter((l) => l.type === t);
      if (!ls.length) continue;
      body += `<div class="section-label">${TYPES[t].name}</div><div class="group" style="--indent:64px">${ls.map(listRow).join('')}</div>`;
    }
    if (!body) body = '<div class="empty">No lists match that filter.</div>';
  }

  return `
  <div class="nav"><span class="eyebrow">${fmtDay(new Date())}</span><div class="actions"><button class="icon-btn solid" data-a="newList" aria-label="New list">${icon('plus', 20, 2.4)}</button></div></div>
  <h1 class="large">${greet()}, ${esc(me?.name || '')}</h1>
  <div class="tiles">
    <button class="tile" data-a="go" data-h="#/mine"><div class="top"><span class="tile-icon sm" style="--c:#0A84FF">${icon('person', 18)}</span><span class="num">${mine.length}</span></div><div class="lbl">My tasks${dueToday ? ` · ${dueToday} due` : ''}</div></button>
    <button class="tile" ${mealList ? `data-a="go" data-h="#/list/${mealList.id}"` : 'data-a="newList" data-type="meals"'}><div class="top"><span class="tile-icon sm" style="--c:${TYPES.meals.colour}">${icon('meal', 18)}</span><span class="val">${tonight}</span></div><div class="lbl">Dinner tonight${home ? ' · ' + home : ''}</div></button>
    <button class="tile" ${shopping[0] ? `data-a="go" data-h="#/list/${shopping[0].id}"` : 'data-a="newList" data-type="shopping"'}><div class="top"><span class="tile-icon sm" style="--c:${TYPES.shopping.colour}">${icon('cart', 18)}</span><span class="num">${toGet}</span></div><div class="lbl">To buy</div></button>
    <button class="tile" data-a="noticeTile"><div class="top"><span class="tile-icon sm" style="--c:${TYPES.notice.colour}">${icon('pin', 18)}</span><span class="num">${unseen}</span></div><div class="lbl">New notices</div></button>
  </div>
  <div class="chips" style="margin-top:14px">${chip('all', 'All')}${chip('shared', 'Shared')}${chip('mine', 'Just me')}${usedTypes.map((t) => chip(t, TYPES[t].name, TYPES[t].colour)).join('')}</div>
  ${body}`;
}

/* ---------- My tasks ---------- */
function myOpenTasks() {
  return S.data.items.filter((i) => {
    const l = getList(i.list_id);
    return l && !i.done && (i.assignees || []).includes(S.me) && !['notice', 'meals'].includes(l.type);
  });
}
function mineView() {
  const items = myOpenTasks();
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
    rows.sort((a, b) => (a.due || '').localeCompare(b.due || '') || b.priority - a.priority);
    body += `<div class="section-label">${label}</div><div class="group">${rows.map((i) => itemRow(i, getList(i.list_id), { context: true })).join('')}</div>`;
  }
  if (!body) body = `<div class="empty"><div class="big">All clear 🎉</div>Anything assigned to you across the family’s lists will show up here.</div>`;
  return `<div class="nav"><span></span></div><h1 class="large">My tasks</h1>${body}`;
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
      <div class="row tap" data-a="openImport" data-tab="paste"><span class="tile-icon sm" style="--c:#25A366">${icon('list', 18)}</span><div class="row-main"><div class="row-title">Paste a list</div><div class="row-sub">From WhatsApp, Notes, an email…</div></div><span class="chev">${icon('chevR', 16, 2.4)}</span></div>
    </div>
    <div class="section-label">Appearance</div>
    <div class="group">
      <div class="field"><label>Mode</label><div class="seg" style="flex:1">${[['system', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(([k, v]) => `<button class="${pref('mode', 'system') === k ? 'on' : ''}" data-a="setMode" data-v="${k}">${v}</button>`).join('')}</div></div>
      <div class="field col"><label>Theme</label><div class="themes">${Object.entries(THEMES).map(([k, t]) => `<button class="theme-dot ${pref('theme', 'classic') === k ? 'on' : ''}" data-a="setTheme" data-v="${k}" style="--a:${t.accent};--b:${t.bgL}"><span></span>${t.name}</button>`).join('')}</div></div>
      <div class="field col"><label>Background photo</label>
        ${pref('bg', null) ? `<div class="bg-preview" style="background-image:url('${pref('bg', '')}')"></div>
          <div class="dim-row"><span>Photo</span><input type="range" id="bg-dim" min="0" max="90" step="5" value="${pref('dim', '55')}" data-input="bgDim" aria-label="Fade the photo"><span>Faded</span></div>
          <div class="bg-btns"><label class="btn secondary" for="bg-file">Change photo</label><button class="btn danger" data-a="bgRemove">Remove</button></div>`
        : '<label class="btn secondary" for="bg-file">Choose a photo</label>'}
        <input type="file" id="bg-file" accept="image/*" hidden data-change="bgFile">
      </div>
    </div>
    <p class="hint">Appearance is saved on this iPhone, so each of you can choose your own.</p>
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
    <h1 class="large">${esc(l.title)}</h1>`;
  const body = { shopping: shoppingView, todo: todoView, work: workView, christmas: christmasView, packing: packingView, meals: mealsView, notice: noticeView }[l.type](l);
  return `<div style="--c:${listColour(l)}">${head}${body}</div>`;
}

function itemRow(it, l, opts = {}) {
  const subs = childrenOf(it.id);
  const meta = [];
  if (opts.context) meta.push(`<span>${esc(l.title)}${it.parent_id ? ' · ' + esc(getItem(it.parent_id)?.text || '') : ''}</span>`);
  if (it.priority) meta.push(`<span class="flag">${icon('flag', 13, 2.4)}</span>`);
  if (it.due) meta.push(`<span class="pill ${!it.done && it.due < today() ? 'red' : it.due === today() ? 'orange' : ''}">${fmtDue(it.due)}</span>`);
  if (it.quantity) meta.push(`<span class="pill">${esc(it.quantity)}</span>`);
  if (l.type === 'work' && it.status && !opts.context) meta.push(`<span class="pill ${it.status === 'doing' ? 'blue' : it.status === 'done' ? 'green' : ''}">${WORK_STATUS[it.status]}</span>`);
  if (l.type === 'christmas') {
    const st = it.data?.status || 'idea';
    meta.push(`<span class="pill ${st === 'bought' ? 'blue' : st === 'wrapped' ? 'green' : ''}">${GIFT_STATUS[st]}</span>`);
    if (it.data?.price) meta.push(`<span class="price">${money(+it.data.price)}</span>`);
    if ((it.hidden_from || []).length) meta.push(`<span>🤫 hidden from ${it.hidden_from.map(memberName).join(', ')}</span>`);
  }
  if (subs.length) meta.push(`<span>${subs.filter((s) => s.done).length}/${subs.length} sub-tasks</span>`);
  if (it.notes && l.type !== 'notice') meta.push('<span>📝</span>');
  if (l.type === 'shopping' && it.created_by && it.created_by !== S.me && !it.assignees.length) meta.push(`<span>added by ${esc(memberName(it.created_by))}</span>`);
  const half = l.type === 'christmas' && it.data?.status === 'bought';
  const c = listColour(l);
  return `<div class="row item ${it.done ? 'done' : ''}" style="--indent:50px">
    <button class="check ${it.done ? 'on' : half ? 'half' : ''}" style="--c:${c}" data-a="toggle" data-id="${it.id}" aria-label="Tick"></button>
    <div class="row-main" data-a="openItem" data-id="${it.id}"><div class="row-title">${esc(it.text)}</div>${meta.length ? `<div class="row-meta">${meta.join('')}</div>` : ''}</div>
    ${avatarStack(it.assignees, 22)}</div>`;
}
const quickAdd = (l, ph, extra = '') => `<div class="quick"><span class="plus">${icon('plus', 22, 2.4)}</span><input id="qa-${l.id}" placeholder="${ph}" enterkeyhint="done" autocomplete="off" data-enter="quickAdd" data-id="${l.id}">${extra}</div>`;
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
    if (rows.length) body += `<div class="section-label">${a}</div><div class="group">${rows.map((i) => itemRow(i, l)).join('')}</div>`;
  }
  if (!open.length) body = `<div class="empty"><div class="big">${done.length ? 'Everything’s in the trolley 🛒' : 'Nothing on the list'}</div>Type what you need — try “2 milk” or “500g mince”. Items are sorted into aisles automatically.</div>`;
  return quickAdd(l, 'Add an item') + body + doneSection(l, done, 'In the trolley');
}

/* ---------- To do ---------- */
function todoView(l) {
  let items = itemsOf(l.id);
  if (ui('mine-' + l.id, false)) items = items.filter((i) => i.assignees.includes(S.me) || childrenOf(i.id).some((s) => s.assignees.includes(S.me)));
  const open = items.filter((i) => !i.done), done = items.filter((i) => i.done);
  const t = today();
  const groups = [['Overdue', open.filter((i) => i.due && i.due < t)], ['Today', open.filter((i) => i.due === t)], ['Coming up', open.filter((i) => i.due && i.due > t)], ['Any time', open.filter((i) => !i.due)]];
  let body = '';
  for (const [label, rows] of groups) {
    if (!rows.length) continue;
    rows.sort((a, b) => (a.due || '').localeCompare(b.due || '') || b.priority - a.priority || a.position - b.position);
    body += `<div class="section-label"><span ${label === 'Overdue' ? 'style="color:var(--red)"' : ''}>${label}</span></div><div class="group">${rows.map((i) => itemRow(i, l)).join('')}</div>`;
  }
  if (!open.length) body = `<div class="empty"><div class="big">Nothing to do</div>Add a task, then tap it to set a due date, assign it, or break it into sub-tasks.</div>`;
  return quickAdd(l, 'New task') + mineToggle(l) + body + doneSection(l, done, 'Completed');
}

/* ---------- Work ---------- */
function workView(l) {
  let items = itemsOf(l.id);
  if (ui('mine-' + l.id, false)) items = items.filter((i) => i.assignees.includes(S.me));
  const st = ui('ws-' + l.id, 'todo');
  const count = (s) => items.filter((i) => (i.status || 'todo') === s).length;
  const rows = items.filter((i) => (i.status || 'todo') === st).sort((a, b) => b.priority - a.priority || (a.due || '9').localeCompare(b.due || '9') || a.position - b.position);
  const seg = `<div class="seg" style="margin:12px 0 0">${Object.entries(WORK_STATUS).map(([k, v]) => `<button class="${st === k ? 'on' : ''}" data-a="setUi" data-k="ws-${l.id}" data-v="${k}">${v} · ${count(k)}</button>`).join('')}</div>`;
  const list = rows.length ? `<div class="group" style="margin-top:14px">${rows.slice(0, st === 'done' ? 40 : 999).map((i) => itemRow(i, l)).join('')}</div>` : `<div class="empty">${st === 'done' ? 'Nothing finished yet.' : st === 'doing' ? 'Nothing in progress. Open a task and set it to Doing.' : 'No tasks waiting. Add one above.'}</div>`;
  const clear = st === 'done' && rows.length && isAdmin(l) ? `<button class="link-btn" data-a="clearDone" data-id="${l.id}">Clear finished tasks</button>` : '';
  return quickAdd(l, 'New work task') + seg + list + clear + (listMembers(l).length > 1 ? mineToggle(l) : '');
}

/* ---------- Christmas ---------- */
function giftFor(it) { return it.data?.for || 'unsorted'; }
function forLabel(f) { return member(f) ? member(f).name : f === 'unsorted' ? 'Not decided yet' : f; }
function christmasView(l) {
  const items = itemsOf(l.id);
  const fors = [...new Set(items.map(giftFor))].sort((a, b) => (member(a) ? member(a).sort : 10) - (member(b) ? member(b).sort : 10) || a.localeCompare(b));
  const total = items.reduce((s, i) => s + (+i.data?.price || 0), 0);
  const bought = items.filter((i) => ['bought', 'wrapped'].includes(i.data?.status)).reduce((s, i) => s + (+i.data?.price || 0), 0);
  const curFor = ui('for-' + l.id, null);
  const chips = `<div class="chips" style="margin:10px -16px 0">${membersSorted().map((m) => `<button class="chip ${curFor === m.id ? 'on' : ''}" data-a="setUi" data-k="for-${l.id}" data-v="${m.id}"><span class="dot" style="--c:${m.colour}"></span>For ${esc(m.name)}</button>`).join('')}<button class="chip ${curFor && !member(curFor) ? 'on' : ''}" data-a="forOther" data-id="${l.id}">${curFor && !member(curFor) ? 'For ' + esc(curFor) : 'Someone else…'}</button></div>`;
  let body = `<div class="tiles" style="margin-top:14px"><div class="tile"><div class="num price">${money(total)}</div><div class="lbl">Planned</div></div><div class="tile"><div class="num price">${money(bought)}</div><div class="lbl">Bought so far</div></div></div>`;
  for (const f of fors) {
    const rows = items.filter((i) => giftFor(i) === f);
    const sum = rows.reduce((s, i) => s + (+i.data?.price || 0), 0);
    const doneN = rows.filter((i) => i.data?.status === 'wrapped').length;
    body += `<div class="ghead">${member(f) ? avatar(f, 30) : `<span class="tile-icon sm" style="--c:#8E8E93">${icon('gift', 16)}</span>`}<span class="t">${esc(forLabel(f))}</span><span class="s">${doneN}/${rows.length} wrapped${sum ? ' · ' + money(sum) : ''}</span></div><div class="group">${rows.map((i) => itemRow(i, l)).join('')}</div>`;
  }
  if (!items.length) body += '<div class="empty"><div class="big">No gift ideas yet</div>Pick who it’s for, then add ideas. Tap the circle to move a gift from Idea → Bought → Wrapped. Open a gift to keep it secret from someone.</div>';
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
    body += `<div class="ghead">${b === 'shared' ? `<span class="tile-icon sm" style="--c:${listColour(l)}">${icon('bag', 16)}</span>` : avatar(b, 30)}<span class="t">${b === 'shared' ? 'Shared' : esc(member(b).name)}</span><span class="s">${p}/${rows.length}</span><div class="bar" style="--c:${b === 'shared' ? listColour(l) : member(b).colour}"><i style="width:${(p / rows.length) * 100}%"></i></div></div><div class="group">${rows.map((i) => itemRow(i, l)).join('')}</div>`;
  }
  if (!all) body += '<div class="empty"><div class="big">Nothing packed yet</div>Choose whose bag above, then add things — or start from the essentials list.</div>';
  return quickAdd(l, cur === 'shared' ? 'Add to the shared bag' : `Add to ${member(cur)?.name || 'your'}’s bag`) + chips +
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
  const items = all.filter((i) => showOld || !expired(i)).sort((a, b) => (b.data?.pinned ? 1 : 0) - (a.data?.pinned ? 1 : 0) || b.created_at.localeCompare(a.created_at));
  const oldN = all.filter(expired).length;
  const cards = items.map((n) => {
    const seen = n.data?.seen || [];
    const c = n.data?.colour || listColour(l);
    const mine = n.created_by === S.me;
    return `<div class="note tint" style="--c:${c}" data-a="openNotice" data-id="${n.id}">
      ${n.data?.pinned ? `<span class="pin">${icon('pin', 18, 2.2)}</span>` : ''}
      <h4>${esc(n.text)}</h4>${n.notes ? `<p>${esc(n.notes)}</p>` : ''}
      <div class="note-foot">${avatar(n.created_by, 22)}<span>${esc(memberName(n.created_by))} · ${timeAgo(n.created_at)}${n.data?.until ? ` · until ${fmtDay(parseYmd(n.data.until))}` : ''}</span>
        <span class="seen">${seen.length ? `<span class="muted">Seen</span>${avatarStack(seen, 20)}` : ''}${!mine && !seen.includes(S.me) ? `<button class="seen-btn" data-a="seen" data-id="${n.id}">Mark seen</button>` : ''}</span></div></div>`;
  }).join('');
  return `<button class="btn tinted" data-a="newNotice" data-id="${l.id}" style="--c:${listColour(l)}">${icon('plus', 20, 2.4)} New note</button>
    <div class="notes" style="margin-top:14px">${cards || '<div class="empty"><div class="big">The board is empty</div>Post reminders, plans and house rules for everyone on this board.</div>'}</div>
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
  }
  return '';
}

/* ---------- New list ---------- */
function newListSheet(s) {
  const d = s.draft;
  const others = membersSorted().filter((m) => m.id !== S.me);
  return head('New list', undefined, `<button class="txt r" data-a="createList" ${d.title.trim() ? '' : 'disabled style="opacity:.4"'}>Create</button>`) + `
    <div class="types" style="margin-top:6px">${TYPE_ORDER.map((t) => `<button class="type-card ${d.type === t ? 'on' : ''}" style="--c:${TYPES[t].colour}" data-a="pickType" data-t="${t}"><span class="tile-icon sm" style="--c:${TYPES[t].colour}">${icon(TYPES[t].icon, 18)}</span><b>${TYPES[t].name}</b><span>${TYPES[t].desc}</span></button>`).join('')}</div>
    <div class="section-label">Name</div>
    <input class="big-input" id="nl-title" value="${esc(d.title)}" placeholder="List name" data-input="nlTitle" autocomplete="off">
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
  html += '<div class="stack-gap" style="margin-top:22px">';
  html += `<button class="btn secondary" data-a="share" data-id="${l.id}">${icon('people', 20)} Sharing</button>`;
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

  if (people.length > 1 || T !== 'shopping') {
    html += `<div class="section-label"><span>${T === 'packing' ? 'Who’s packing it' : 'Assigned to'}</span>${people.length > 2 ? `<button data-a="assignAll" data-id="${it.id}">${allOn ? 'Clear' : 'Everyone'}</button>` : ''}</div>
      <div class="group" style="padding:12px 10px"><div class="who">${people.map((m) => `<button class="${it.assignees.includes(m.id) ? 'on' : ''}" data-a="assign" data-id="${it.id}" data-m="${m.id}">${avatar(m.id, 46)}${esc(m.name)}</button>`).join('')}</div></div>`;
  }

  const f = [];
  if (['todo', 'work'].includes(T)) {
    f.push(`<div class="field"><label>Due</label><input type="date" value="${it.due || ''}" data-change="itemField" data-f="due" data-id="${it.id}"></div>`);
    f.push(`<div class="field tap" data-a="priority" data-id="${it.id}"><label>Important</label><span style="flex:1"></span><span class="switch ${it.priority ? 'on' : ''}"></span></div>`);
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
    f.push(`<div class="field"><label>For</label><select data-change="giftFor" data-id="${it.id}"><option value="">Not decided</option>${membersSorted().map((m) => `<option value="${m.id}" ${fr === m.id ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}${fr && !member(fr) ? `<option selected>${esc(fr)}</option>` : ''}<option value="__other">Someone else…</option></select></div>`);
    f.push(`<div class="field"><label>Price (£)</label><input inputmode="decimal" value="${it.data?.price ?? ''}" placeholder="0.00" data-change="giftPrice" data-id="${it.id}"></div>`);
    f.push(`<div class="field"><label>Link</label><input type="url" value="${esc(it.data?.link || '')}" placeholder="Paste a shop link" data-change="giftLink" data-id="${it.id}"></div>`);
    if (it.data?.link) f.push(`<div class="field"><label></label><a href="${esc(it.data.link)}" target="_blank" rel="noopener" style="color:var(--accent);flex:1;text-align:right">Open link ↗</a></div>`);
    f.push(`<div class="field"><label>Status</label><div class="seg" style="flex:1">${Object.entries(GIFT_STATUS).map(([k, v]) => `<button class="${(it.data?.status || 'idea') === k ? 'on' : ''}" data-a="giftStatus" data-id="${it.id}" data-v="${k}">${v}</button>`).join('')}</div></div>`);
  }
  if (T === 'packing' && !parent) {
    const bag = it.data?.bag || 'shared';
    f.push(`<div class="field"><label>Bag</label><select data-change="packBag" data-id="${it.id}">${people.map((m) => `<option value="${m.id}" ${bag === m.id ? 'selected' : ''}>${esc(m.name)}’s bag</option>`).join('')}<option value="shared" ${bag === 'shared' ? 'selected' : ''}>Shared</option></select></div>`);
  }
  if (f.length) html += `<div class="group" style="margin-top:18px">${f.join('')}</div>`;

  if (T === 'christmas' && !parent) {
    const others = people.filter((m) => m.id !== S.me);
    if (others.length) {
      html += `<div class="section-label">🤫 Keep secret from</div><div class="group" style="padding:12px 10px"><div class="who">${others.map((m) => `<button class="${(it.hidden_from || []).includes(m.id) ? 'on' : ''}" data-a="secret" data-id="${it.id}" data-m="${m.id}">${avatar(m.id, 46)}${esc(m.name)}</button>`).join('')}</div></div>
      <p class="hint">They won’t see this gift at all, even though they can see the list.</p>`;
    }
  }

  if (TYPES[T].sub && !parent) {
    const subs = childrenOf(it.id);
    html += `<div class="section-label">Sub-tasks${subs.length ? ` · ${subs.filter((x) => x.done).length}/${subs.length}` : ''}</div><div class="group">
      ${subs.map((x) => `<div class="row item ${x.done ? 'done' : ''}" style="--indent:48px"><button class="check sm ${x.done ? 'on' : ''}" style="--c:${listColour(l)}" data-a="toggle" data-id="${x.id}"></button><div class="row-main" data-a="openItem" data-id="${x.id}"><div class="row-title" style="font-size:16px">${esc(x.text)}</div>${x.due ? `<div class="row-meta"><span class="pill ${!x.done && x.due < today() ? 'red' : ''}">${fmtDue(x.due)}</span></div>` : ''}</div>${avatarStack(x.assignees, 22)}</div>`).join('')}
      <div class="row" style="--indent:48px"><span class="plus" style="--c:${listColour(l)};width:20px">${icon('plus', 20, 2.4)}</span><input id="sub-${it.id}" placeholder="Add a sub-task" style="flex:1;border:0;outline:0;background:transparent;padding:8px 0" enterkeyhint="done" data-enter="addSub" data-id="${it.id}" autocomplete="off"></div></div>
      ${subs.length ? '<p class="hint">Tap a sub-task to assign it or give it a date.</p>' : ''}`;
  }

  html += `<div class="section-label">Notes</div><div class="group"><textarea class="textarea" placeholder="Add notes" data-change="itemField" data-f="notes" data-id="${it.id}">${esc(it.notes || '')}</textarea></div>`;
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
  if (/christmas|xmas|gift|present|birthday/.test(n)) return 'christmas';
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
  if (l.type === 'christmas') extra.data = { status: done ? 'wrapped' : 'idea' };
  const steps = t.checklistItems || [];
  if (steps.length && !TYPES[l.type].sub) extra.notes = [notesRaw, steps.map((c) => (c.isChecked ? '✓ ' : '• ') + c.displayName).join('\n')].filter(Boolean).join('\n\n');
  const parent = newItem(l, text, extra);
  const rows = [parent];
  if (steps.length && TYPES[l.type].sub) steps.forEach((c, i) => rows.push(newItem(l, c.displayName, { parent_id: parent.id, done: !!c.isChecked, done_by: c.isChecked ? S.me : null, position: pos + (i + 1) / 1000 })));
  return rows;
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
function todoTargetOptions(s, nameForNew) {
  const lists = S.data.lists.filter((l) => IMPORTABLE.includes(l.type));
  return `<option value="new" ${s.target === 'new' ? 'selected' : ''}>${nameForNew ? `New list – ${esc(nameForNew)}` : 'New list'}</option>${lists.map((l) => `<option value="${l.id}" ${s.target === l.id ? 'selected' : ''}>${esc(l.title)}</option>`).join('')}`;
}
function todoTargetFields(s, nameForNew) {
  return `<div class="group"><div class="field"><label>Put into</label><select data-change="todoField" data-f="target">${todoTargetOptions(s, nameForNew)}</select></div>
    ${s.target === 'new' ? `<div class="field"><label>List type</label><select data-change="todoField" data-f="newType">${IMPORTABLE.map((t) => `<option value="${t}" ${s.newType === t ? 'selected' : ''}>${TYPES[t].name}</option>`).join('')}</select></div>` : ''}</div>`;
}
const modeSeg = (s) => `<div class="group" style="margin-top:12px"><div class="field col"><label>How it stays in step</label><div class="seg">${[['0', 'Import only'], ['1', 'Two-way']].map(([v, l]) => `<button class="${(s.twoWay ? '1' : '0') === v ? 'on' : ''}" data-a="todoMode" data-v="${v}">${l}</button>`).join('')}</div></div></div>
  <p class="hint">${s.twoWay ? 'Changes in either app show up in both — ticks, edits, new items and deletions.' : 'New and changed tasks come across from To Do. Changes here don’t go back to To Do.'}</p>`;
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
  toggleUi: (el) => { S.ui[el.dataset.k] = !ui(el.dataset.k, el.dataset.k.startsWith('showDone') ? getList(el.dataset.k.slice(9))?.type === 'shopping' : false); render(); },
  setUi: (el) => { const v = el.dataset.v; S.ui[el.dataset.k] = v === '1' ? true : v === '0' ? false : v; render(); const q = document.querySelector('.quick input'); if (q && el.dataset.k.match(/^(for|bag)-/)) q.focus(); },
  closeSheet: () => closeSheet(),
  noticeTile: () => { const l = S.data.lists.find((x) => x.type === 'notice'); l ? go('#/list/' + l.id) : A.newList({ dataset: { type: 'notice' } }); },

  newList: (el) => {
    const type = el.dataset?.type || 'shopping';
    openSheet({ kind: 'newList', draft: { type, title: TYPES[type].title, colour: TYPES[type].colour, share: {}, touched: false } });
  },
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
      const order = ['idea', 'bought', 'wrapped'];
      const next = order[(order.indexOf(it.data?.status || 'idea') + 1) % 3];
      return upd('items', { id: it.id }, { data: { ...it.data, status: next }, done: next === 'wrapped', done_by: next === 'wrapped' ? S.me : null });
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
  priority: (el) => { const it = getItem(el.dataset.id); upd('items', { id: it.id }, { priority: it.priority ? 0 : 1 }); renderSheets(true); },
  workStatus: (el) => { const v = el.dataset.v; upd('items', { id: el.dataset.id }, { status: v, done: v === 'done', done_by: v === 'done' ? S.me : null, done_at: v === 'done' ? new Date().toISOString() : null }); renderSheets(true); },
  giftStatus: (el) => { const it = getItem(el.dataset.id), v = el.dataset.v; upd('items', { id: it.id }, { data: { ...it.data, status: v }, done: v === 'wrapped' }); renderSheets(true); },
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
    const match = S.data.lists.find((l) => IMPORTABLE.includes(l.type) && l.title.toLowerCase() === L.name.toLowerCase());
    s.target = match ? match.id : 'new';
    s.newType = guessType(L.name);
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
      if (l.type === 'christmas') extra.data = { status: 'idea', for: ui('for-' + l.id, null) };
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
      return ins('items', newItem(l, p.text, { quantity: p.qty || null, category: guessAisle(p.text) }));
    }
    if (l.type === 'christmas') {
      const f = ui('for-' + l.id, null);
      const hide = f && member(f) && f !== S.me && listMembers(l).some((m) => m.id === f) ? [f] : [];
      return ins('items', newItem(l, raw, { data: { for: f, status: 'idea' }, hidden_from: hide }));
    }
    if (l.type === 'packing') {
      const b = ui('bag-' + l.id, S.me);
      return ins('items', newItem(l, raw, { data: { bag: b }, assignees: b === 'shared' ? [] : [b] }));
    }
    if (l.type === 'work') return ins('items', newItem(l, raw, { status: ui('ws-' + l.id, 'todo') === 'doing' ? 'doing' : 'todo', assignees: [S.me] }));
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
  itemText: (el) => { const v = el.value.trim(); if (v) upd('items', { id: el.dataset.id }, { text: v }); },
  itemField: (el) => upd('items', { id: el.dataset.id }, { [el.dataset.f]: el.value || null }),
  giftFor: async (el) => {
    const it = getItem(el.dataset.id);
    let v = el.value;
    if (v === '__other') { v = ((await askText('Who is the gift for?', 'e.g. Grandma')) || '').trim(); if (!v) { renderSheets(true); return; } }
    const l = getList(it.list_id);
    let hidden = it.hidden_from || [];
    if (member(v) && v !== S.me && listMembers(l).some((m) => m.id === v) && !hidden.includes(v)) hidden = [...hidden, v];
    upd('items', { id: it.id }, { data: { ...it.data, for: v || null }, hidden_from: hidden });
    renderSheets(true);
  },
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

document.addEventListener('click', (e) => {
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
  } catch (e) {
    console.error(e);
    showLogin();
    if ($('#login-err')) $('#login-err').textContent = 'Couldn’t connect. Check your signal and try again.';
  }
}

window.addEventListener('hashchange', () => { S.sheets = []; render(); window.scrollTo(0, 0); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.me) { reload(); loadTodo(true); } });
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

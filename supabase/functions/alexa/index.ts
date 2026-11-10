// McGaw Lists — Alexa skill.
// Deploy as an Edge Function named "alexa" with "Verify JWT" turned OFF
// (Alexa can't send a Supabase login). Every request is checked instead:
// Amazon's signature, the timestamp, your skill ID and a secret in the URL.
//
// Secrets: ALEXA_SKILL_ID (amzn1.ask.skill....), ALEXA_URL_KEY (any long random word)
import { createClient } from "npm:@supabase/supabase-js@2";
import * as x509 from "npm:@peculiar/x509@1.12.3";

const env = (k: string) => Deno.env.get(k) ?? "";
function serviceKey() {
  const k = env("SUPABASE_SERVICE_ROLE_KEY");
  if (k) return k;
  try {
    const j = JSON.parse(env("SUPABASE_SECRET_KEYS"));
    return (j.default ?? Object.values(j)[0]) as string;
  } catch {
    return "";
  }
}
// deno-lint-ignore-file no-explicit-any
type Any = any;
let db: Any = null;
export function setDb(x: Any) { db = x; }
const getDb = () => db ?? (db = createClient(env("SUPABASE_URL"), serviceKey(), { auth: { persistSession: false } }));

const TZ = "Europe/London";
const TYPE_COLOUR: Record<string, string> = { shopping: "#30B05A", todo: "#0A84FF", work: "#5E5CE6", packing: "#FF9500", meals: "#FF375F", notice: "#F5B800" };
const TYPE_NAME: Record<string, string> = { shopping: "shopping list", todo: "to do list", work: "work list", packing: "packing list", meals: "meal planner", notice: "notice board" };
const PRI_NAME: Record<number, string> = { 3: "Urgent & important", 2: "Urgent", 1: "Important", 0: "" };
const PRI_COLOUR: Record<number, string> = { 3: "#FF453A", 2: "#FF9F0A", 1: "#0A84FF", 0: "#8E8E93" };

/* ================ Amazon request checks ================ */
// Checks that a request really came from Amazon's Alexa service for your skill.
// https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-a-web-service.html

const certCache = new Map<string, { certs: x509.X509Certificate[]; at: number }>();

export function certUrlOk(raw: string | null) {
  if (!raw) return false;
  let u: URL;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol.toLowerCase() !== "https:") return false;
  if (u.hostname.toLowerCase() !== "s3.amazonaws.com") return false;
  if (u.port && u.port !== "443") return false;
  // URL() already normalises "/echo.api/../" style paths
  return u.pathname.startsWith("/echo.api/");
}

function splitPem(pem: string) {
  return (pem.match(/-----BEGIN CERTIFICATE-----[\s\S]+?-----END CERTIFICATE-----/g) ?? []).map((p) => new x509.X509Certificate(p));
}

async function chainFor(url: string, fetcher: typeof fetch) {
  const hit = certCache.get(url);
  if (hit && Date.now() - hit.at < 3600_000) return hit.certs;
  const res = await fetcher(url);
  if (!res.ok) throw new Error("cert download failed");
  const certs = splitPem(await res.text());
  certCache.set(url, { certs, at: Date.now() });
  return certs;
}

function b64(s: string) {
  const bin = atob(s.replace(/\s+/g, ""));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// Returns null when everything checks out, otherwise the reason it was rejected
export async function verifyAlexa(headers: Headers, body: string, req: any, skillId: string, opts: { fetcher?: typeof fetch; now?: number; skipTrust?: boolean } = {}) {
  const now = opts.now ?? Date.now();
  // 1. Your skill only
  const appId = req?.context?.System?.application?.applicationId ?? req?.session?.application?.applicationId;
  if (!skillId || appId !== skillId) return "wrong skill id";
  // 2. Fresh (stops replays)
  const ts = Date.parse(req?.request?.timestamp ?? "");
  if (!ts || Math.abs(now - ts) > 150_000) return "stale timestamp";
  // 3. Amazon's certificate
  const url = headers.get("SignatureCertChainUrl") ?? headers.get("signaturecertchainurl");
  if (!certUrlOk(url)) return "bad cert url";
  const sig = headers.get("Signature-256") ?? headers.get("signature-256");
  if (!sig) return "no signature";
  let certs: x509.X509Certificate[];
  try { certs = await chainFor(url!, opts.fetcher ?? fetch); } catch { return "no cert"; }
  if (!certs.length) return "empty cert";
  const leaf = certs[0];
  const t = new Date(now);
  if (leaf.notBefore > t || leaf.notAfter < t) return "cert expired";
  const san = leaf.getExtension(x509.SubjectAlternativeNameExtension);
  const names = san ? san.names.items.filter((n) => n.type === "dns").map((n) => n.value.toLowerCase()) : [];
  if (!names.includes("echo-api.amazon.com")) return "cert not for echo-api.amazon.com";
  // Each certificate must be signed by the next one up the chain
  for (let i = 0; i < certs.length - 1; i++) {
    const c = certs[i], up = certs[i + 1];
    if (up.notBefore > t || up.notAfter < t) return "chain expired";
    if (!(await c.verify({ publicKey: up, signatureOnly: true }))) return "broken chain";
  }
  if (!opts.skipTrust) {
    const top = certs[certs.length - 1];
    if (!/O=Amazon|O=Starfield|O=DigiCert/i.test(top.issuer)) return "untrusted issuer";
  }
  // 4. The body was signed by that certificate
  try {
    const key = await crypto.subtle.importKey("spki", leaf.publicKey.rawData, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64(sig), new TextEncoder().encode(body));
    if (!ok) return "bad signature";
  } catch {
    return "signature check failed";
  }
  return null;
}

/* ================ Echo Show screens ================ */
// Echo Show screens (Alexa Presentation Language documents).

const BG = "#0B0B0F", CARD = "#1C1C1E", GREY = "#8E8E93", TEXT = "#FFFFFF";
const SCALE = "${viewport.width >= 1800 ? 1.45 : viewport.width >= 1200 ? 1.1 : 0.82}";
const px = (n: number) => "${" + n + " * k}dp";

function doc(items: Any, idle = 120000) {
  return {
    type: "APL",
    version: "2023.2",
    theme: "dark",
    settings: { idleTimeout: idle },
    // On Fire TV you move with the remote: whatever is selected gets a blue outline
    styles: {
      focusFrame: { values: [{ backgroundColor: CARD, borderColor: CARD, borderWidth: "3dp" }, { when: "${state.focused}", borderColor: "#0A84FF", borderWidth: "4dp" }] },
    },
    mainTemplate: {
      parameters: ["payload"],
      items: [{
        type: "Frame",
        width: "100vw",
        height: "100vh",
        backgroundColor: BG,
        bind: [{ name: "k", value: SCALE }],
        item: items,
      }],
    },
  };
}
const wrap = (document: Any, d: Any) => ({ document, datasources: { d } });

function header(kicker: string, title: string, right: string, colour: string) {
  return {
    type: "Container",
    direction: "row",
    alignItems: "center",
    paddingBottom: px(10),
    items: [
      { type: "Frame", width: px(10), height: px(70), borderRadius: px(5), backgroundColor: colour },
      {
        type: "Container", grow: 1, shrink: 1, paddingLeft: px(18),
        items: [
          { type: "Text", text: kicker, color: colour, fontSize: px(19), fontWeight: "700", letterSpacing: "1dp" },
          { type: "Text", text: title, color: TEXT, fontSize: px(46), fontWeight: "800", maxLines: 1 },
        ],
      },
      { type: "Text", text: right, color: GREY, fontSize: px(24), fontWeight: "600" },
    ],
  };
}

/* ---------- a list (shopping, to do, work, packing, notice board, my tasks) ---------- */
function listDoc(d: { title: string; kicker: string; subtitle: string; colour: string; listId: string; rows: Any[] }) {
  const tickRow = {
    type: "TouchWrapper",
    spacing: px(10),
    onPress: { type: "SendEvent", arguments: ["tick", "${data.listId ?? payload.d.listId}", "${data.id}"] },
    item: {
      type: "Frame",
      style: "focusFrame",
      inheritParentState: true,
      borderRadius: px(18),
      item: {
        type: "Container", direction: "row", alignItems: "center",
        paddingLeft: px(18), paddingRight: px(18), paddingTop: px(14), paddingBottom: px(14),
        items: [
          {
            type: "Frame", width: px(40), height: px(40), borderRadius: px(20), borderWidth: "3dp",
            borderColor: "${data.done ? payload.d.colour : (data.pri ?? '#636366')}",
            backgroundColor: "${data.done ? payload.d.colour : 'transparent'}",
            item: { type: "Text", text: "${data.done ? '✓' : ''}", color: TEXT, fontSize: px(24), fontWeight: "800", textAlign: "center", textAlignVertical: "center", width: "100%", height: "100%" },
          },
          {
            type: "Container", grow: 1, shrink: 1, paddingLeft: px(18),
            items: [
              { type: "Text", text: "${data.text}", color: "${data.done ? '#636366' : '#FFFFFF'}", fontSize: px(30), fontWeight: "500", maxLines: 2 },
              { type: "Text", when: "${data.meta != ''}", text: "${data.meta}", color: "${data.late ? '#FF453A' : '#8E8E93'}", fontSize: px(20), maxLines: 1, paddingTop: "2dp" },
            ],
          },
        ],
      },
    },
  };
  const doc_ = doc({
    type: "Container",
    width: "100%", height: "100%",
    paddingLeft: px(40), paddingRight: px(40), paddingTop: px(28),
    items: [
      header("${payload.d.kicker}", "${payload.d.title}", "${payload.d.subtitle}", "${payload.d.colour}"),
      {
        type: "Sequence",
        grow: 1, shrink: 1,
        width: "100%",
        data: "${payload.d.rows}",
        paddingBottom: px(30),
        items: [
          { when: "${data.type == 'label'}", type: "Text", text: "${data.text}", color: "${data.colour ?? '#8E8E93'}", fontSize: px(19), fontWeight: "700", letterSpacing: "1dp", paddingTop: px(22), paddingBottom: px(2) },
          { when: "${data.type == 'empty'}", type: "Text", text: "${data.text}", color: GREY, fontSize: px(36), fontWeight: "600", textAlign: "center", paddingTop: px(90) },
          {
            when: "${data.type == 'note'}", type: "Frame", spacing: px(12), backgroundColor: "${data.colour}", borderRadius: px(18),
            item: {
              type: "Container", paddingLeft: px(22), paddingRight: px(22), paddingTop: px(18), paddingBottom: px(18),
              items: [
                { type: "Text", text: "${data.text}", color: "#1C1C1E", fontSize: px(30), fontWeight: "600", maxLines: 4 },
                { type: "Text", text: "${data.meta}", color: "#3A3A3C", fontSize: px(19), paddingTop: "4dp" },
              ],
            },
          },
          tickRow,
        ],
      },
    ],
  });
  return wrap(doc_, d);
}

/* ---------- this week's dinners ---------- */
function mealsDoc(d: { title: string; colour: string; days: Any[] }) {
  const person = {
    type: "Frame", width: px(34), height: px(34), borderRadius: px(17), spacing: px(6),
    backgroundColor: "${data.colour}",
    borderWidth: "${data.status == 'late' ? 3 : 0}", borderColor: "#FFD60A",
    opacity: "${data.status == 'out' ? 0.22 : 1}",
    item: { type: "Text", text: "${data.initial}", color: TEXT, fontSize: px(17), fontWeight: "800", textAlign: "center", textAlignVertical: "center", width: "100%", height: "100%" },
  };
  const day = {
    type: "Frame", grow: 1, shrink: 1, width: "0dp", spacing: px(12),
    backgroundColor: "${data.focus ? '#3A1720' : '#1C1C1E'}",
    borderColor: "${data.focus ? payload.d.colour : '#1C1C1E'}", borderWidth: "2dp",
    borderRadius: px(20),
    item: {
      type: "Container", height: "100%", paddingLeft: px(16), paddingRight: px(14), paddingTop: px(16), paddingBottom: px(14),
      items: [
        { type: "Text", text: "${data.day}", color: "${payload.d.colour}", fontSize: px(20), fontWeight: "700", maxLines: 1 },
        { type: "Text", grow: 1, text: "${data.meal}", color: TEXT, fontSize: px(28), fontWeight: "700", maxLines: 4, paddingTop: px(8) },
        { type: "Text", text: "${data.cook}", color: GREY, fontSize: px(18), maxLines: 2, paddingBottom: px(10) },
        { type: "Container", direction: "row", wrap: "wrap", data: "${data.people}", items: [person] },
      ],
    },
  };
  return wrap(doc({
    type: "Container", width: "100%", height: "100%", paddingLeft: px(36), paddingRight: px(36), paddingTop: px(28), paddingBottom: px(32),
    items: [
      header("DINNER THIS WEEK", "${payload.d.title}", "faded = out  ·  ringed = late", "${payload.d.colour}"),
      { type: "Container", direction: "row", grow: 1, paddingTop: px(14), data: "${payload.d.days}", items: [day] },
    ],
  }), d);
}

/* ---------- countdowns (they tick live) ---------- */
function liveBinds() {
  return [
    { name: "r", value: "${Math.max(0, payload.d.remaining - elapsedTime)}" },
    { name: "dd", value: "${Math.floor(r / 86400000)}" },
    { name: "hh", value: "${Math.floor(r / 3600000) % 24}" },
    { name: "mm", value: "${Math.floor(r / 60000) % 60}" },
    { name: "ss", value: "${Math.floor(r / 1000) % 60}" },
  ];
}
const pad = (v: string) => "${" + v + " < 10 ? '0' + " + v + " : '' + " + v + "}";

function countdownDoc(d: { title: string; remaining: number; style: string; colour: string; when: string; others: Any[] }) {
  const style = ["flip", "calendar"].includes(d.style) ? "flip" : ["station", "scoreboard", "onair"].includes(d.style) ? "board" : "standard";
  const ink = style === "board" ? "#FFB000" : TEXT;
  const head = style === "board" ? ({ station: "DEPARTS IN", scoreboard: "KICK-OFF IN", onair: "GOING LIVE IN" } as Any)[d.style] ?? "DEPARTS IN" : "COUNTDOWN";
  const unit = (val: string, label: string, accent = false) => {
    const num = { type: "Text", text: val, color: accent && style === "standard" ? "${payload.d.colour}" : ink, fontSize: px(118), fontWeight: "800", textAlign: "center", width: "100%" };
    const face = style === "standard" ? num : {
      type: "Container", width: "100%", items: [
        { type: "Frame", backgroundColor: style === "flip" ? "#26262A" : "#151515", borderRadius: px(style === "flip" ? 18 : 6), paddingTop: px(6), paddingBottom: px(6), item: num },
        ...(style === "flip" ? [{ type: "Frame", position: "absolute", left: 0, right: 0, top: "50%", height: "3dp", backgroundColor: BG }] : []),
      ],
    };
    return {
      type: "Container", grow: 1, shrink: 1, width: "0dp", spacing: px(18), alignItems: "center",
      items: [face, { type: "Text", text: label, color: GREY, fontSize: px(22), fontWeight: "700", letterSpacing: "2dp", paddingTop: px(10) }],
    };
  };
  const body = {
    type: "Container", width: "100%", height: "100%", bind: liveBinds(),
    justifyContent: "center", paddingLeft: px(50), paddingRight: px(50),
    items: [
      { type: "Text", text: head, color: style === "board" ? ink : "${payload.d.colour}", fontSize: px(22), fontWeight: "800", letterSpacing: "3dp", textAlign: "center" },
      { type: "Text", text: "${payload.d.title}", color: TEXT, fontSize: px(54), fontWeight: "800", textAlign: "center", maxLines: 2, paddingTop: px(6) },
      { type: "Text", text: "${payload.d.when}", color: GREY, fontSize: px(22), textAlign: "center", paddingBottom: px(34) },
      {
        type: "Container", direction: "row", width: "100%",
        items: [unit("${dd}", "DAYS", true), unit(pad("hh"), "HOURS"), unit(pad("mm"), "MINS"), unit(pad("ss"), "SECS")],
      },
      { type: "Text", when: "${r == 0}", text: "It’s here!", color: "${payload.d.colour}", fontSize: px(40), fontWeight: "800", textAlign: "center", paddingTop: px(20) },
      {
        type: "Container", direction: "row", justifyContent: "center", paddingTop: px(40), data: "${payload.d.others}",
        items: [{ type: "Text", spacing: px(30), text: "${data.title}  ·  ${data.when}", color: GREY, fontSize: px(20), maxLines: 1 }],
      },
    ],
  };
  return wrap(doc(body, 600000), d);
}

/* ---------- today at a glance ---------- */
function todayDoc(d: Any) {
  const card = (items: Any[], ev: string[], extra: Any = {}) => ({
    type: "TouchWrapper", grow: 1, shrink: 1, height: "0dp", spacing: px(16),
    onPress: { type: "SendEvent", arguments: ev },
    item: {
      type: "Frame", height: "100%", style: "focusFrame", inheritParentState: true, borderRadius: px(24), ...extra,
      item: { type: "Container", height: "100%", paddingLeft: px(22), paddingRight: px(22), paddingTop: px(20), paddingBottom: px(18), items },
    },
  });
  const label = (t: string, colour: string) => ({ type: "Text", text: t, color: colour, fontSize: px(18), fontWeight: "800", letterSpacing: "1dp" });
  const dinner = card([
    label("DINNER TONIGHT", "#FF375F"),
    { type: "Text", text: "${payload.d.dinner}", color: TEXT, fontSize: px(38), fontWeight: "800", maxLines: 3, paddingTop: px(10) },
    { type: "Text", text: "${payload.d.cook}", color: GREY, fontSize: px(21), paddingTop: px(8) },
    { type: "Text", text: "${payload.d.home}", color: GREY, fontSize: px(21), maxLines: 2, paddingTop: px(4) },
  ], ["open", d.mealsId ?? "", ""]);
  const tasks = card([
    label("DUE TODAY  ·  ${payload.d.taskCount}", "#0A84FF"),
    { type: "Text", when: "${payload.d.taskCount == 0}", text: "Nothing due", color: GREY, fontSize: px(28), fontWeight: "600", paddingTop: px(14) },
    {
      type: "Container", paddingTop: px(8), data: "${payload.d.tasks}",
      items: [{
        type: "Container", direction: "row", alignItems: "center", paddingTop: px(10),
        items: [
          { type: "Frame", width: px(14), height: px(14), borderRadius: px(7), backgroundColor: "${data.late ? '#FF453A' : data.pri}" },
          { type: "Text", text: "${data.text}", color: "${data.late ? '#FF453A' : '#FFFFFF'}", fontSize: px(25), fontWeight: "500", maxLines: 1, paddingLeft: px(12), grow: 1, shrink: 1 },
        ],
      }],
    },
  ], ["open", "mine", ""]);
  const shop = card([
    label("${payload.d.shopTitle}  ·  ${payload.d.shopCount}", "#30B05A"),
    { type: "Text", text: "${payload.d.shopLine}", color: TEXT, fontSize: px(24), maxLines: 4, paddingTop: px(10) },
  ], ["open", d.shopId ?? "", ""]);
  const cd = {
    type: "TouchWrapper", grow: 1, shrink: 1, height: "0dp", spacing: px(16), when: "${payload.d.cd != null}",
    onPress: { type: "SendEvent", arguments: ["open", "countdown", ""] },
    item: {
      type: "Frame", height: "100%", style: "focusFrame", inheritParentState: true, borderRadius: px(24),
      item: {
        type: "Container", height: "100%", paddingLeft: px(22), paddingRight: px(22), paddingTop: px(20), paddingBottom: px(18),
        bind: [
          { name: "r", value: "${Math.max(0, payload.d.cd.remaining - elapsedTime)}" },
          { name: "dd", value: "${Math.floor(r / 86400000)}" },
          { name: "hh", value: "${Math.floor(r / 3600000) % 24}" },
          { name: "mm", value: "${Math.floor(r / 60000) % 60}" },
          { name: "ss", value: "${Math.floor(r / 1000) % 60}" },
        ],
        items: [
          label("COUNTDOWN", "#BF5AF2"),
          { type: "Text", text: "${payload.d.cd.title}", color: TEXT, fontSize: px(26), fontWeight: "700", maxLines: 1, paddingTop: px(8) },
          { type: "Text", text: "${dd} ${dd == 1 ? 'day' : 'days'}", color: "#BF5AF2", fontSize: px(52), fontWeight: "800" },
          { type: "Text", text: "${(hh < 10 ? '0' : '') + hh}:${(mm < 10 ? '0' : '') + mm}:${(ss < 10 ? '0' : '') + ss}", color: GREY, fontSize: px(26), fontWeight: "600" },
        ],
      },
    },
  };
  const note = {
    type: "Frame", when: "${payload.d.note != null}", spacing: px(16), grow: 1, shrink: 1, height: "0dp", backgroundColor: "${payload.d.note.colour}", borderRadius: px(24),
    item: {
      type: "Container", paddingLeft: px(22), paddingRight: px(22), paddingTop: px(18), paddingBottom: px(16),
      items: [
        { type: "Text", text: "NOTICE BOARD", color: "#3A3A3C", fontSize: px(17), fontWeight: "800", letterSpacing: "1dp" },
        { type: "Text", text: "${payload.d.note.text}", color: "#1C1C1E", fontSize: px(25), fontWeight: "600", maxLines: 3, paddingTop: px(6) },
        { type: "Text", text: "${payload.d.note.by}", color: "#3A3A3C", fontSize: px(18), paddingTop: px(4) },
      ],
    },
  };
  const data = { ...d, shopLine: d.shop.length ? d.shop.join(", ") + (d.shopCount > d.shop.length ? ` +${d.shopCount - d.shop.length} more` : "") : "Nothing on the list" };
  return wrap(doc({
    type: "Container", width: "100%", height: "100%", paddingLeft: px(36), paddingRight: px(36), paddingTop: px(28), paddingBottom: px(30),
    items: [
      {
        type: "Container", direction: "row", alignItems: "end", paddingBottom: px(14),
        items: [
          { type: "Text", text: "${payload.d.hello}", color: TEXT, fontSize: px(44), fontWeight: "800", grow: 1, shrink: 1, maxLines: 1 },
          { type: "Text", text: "${payload.d.date}", color: GREY, fontSize: px(24), fontWeight: "600" },
        ],
      },
      {
        type: "Container", direction: "row", grow: 1,
        items: [
          { type: "Container", grow: 1, shrink: 1, width: "0dp", items: [{ ...dinner, spacing: 0 }, note] },
          { type: "Container", grow: 1, shrink: 1, width: "0dp", spacing: px(16), items: [{ ...tasks, spacing: 0 }] },
          { type: "Container", grow: 1, shrink: 1, width: "0dp", spacing: px(16), items: [{ ...cd, spacing: 0 }, shop] },
        ],
      },
    ],
  }, 300000), data);
}

const V = { listDoc, mealsDoc, countdownDoc, todayDoc };

/* ---------------- small helpers ---------------- */
export function ymd(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}
const addDays = (s: string, n: number) => { const d = new Date(s + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const dayName = (s: string) => new Date(s + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
const shortDay = (s: string) => new Date(s + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
function whenWord(s: string) {
  const t = ymd();
  if (s === t) return "today";
  if (s === addDays(t, 1)) return "tomorrow";
  if (s === addDays(t, -1)) return "yesterday";
  if (s > t && s < addDays(t, 7)) return "on " + dayName(s);
  return "on " + new Date(s + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
}
const norm = (s: string) => (s || "").toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
function joinWords(a: string[], last = "and") {
  if (a.length <= 1) return a.join("");
  return a.slice(0, -1).join(", ") + " " + last + " " + a[a.length - 1];
}
const plural = (n: number, w: string, p = w + "s") => `${n} ${n === 1 ? w : p}`;

const NUMS: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, "a couple of": 2, "a dozen": 12 };
export function parseSpoken(raw: string) {
  let s = raw.trim().replace(/^(some|more)\s+/i, "");
  let qty = "";
  const m = s.match(/^(\d+(?:\.\d+)?)\s*(x|kg|kilos?|g|grams?|ml|l|litres?|liters?|pints?|packs?|tins?|cans?|bottles?|bags?|boxes?|loaves|loaf)?\s+(?:of\s+)?(.+)$/i);
  const w = s.match(/^(a couple of|a dozen|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty)\s+(?:(kilos?|grams?|litres?|pints?|packs?|tins?|cans?|bottles?|bags?|boxes?|loaves|loaf)\s+)?(?:of\s+)?(.+)$/i);
  if (m) { qty = m[1] + (m[2] ? unit(m[2]) : ""); s = m[3]; }
  else if (w) { qty = String(NUMS[w[1].toLowerCase()]) + (w[2] ? unit(w[2]) : ""); s = w[3]; }
  return { qty, text: cap(s.trim()) };
}
function unit(u: string) {
  u = u.toLowerCase();
  if (/^kilo|^kg/.test(u)) return "kg";
  if (/^gram|^g$/.test(u)) return "g";
  if (/^litre|^liter|^l$/.test(u)) return "l";
  if (/^ml/.test(u)) return "ml";
  if (/^x$/.test(u)) return "";
  return " " + u;
}
// Alexa doesn't hear commas: "eggs bananas and cheese" → eggs / bananas / cheese
const SINGLES = new Set("milk bread eggs butter cheese bananas apples oranges grapes pears tomatoes potatoes onions carrots cucumber lettuce peppers mushrooms garlic lemons limes broccoli strawberries blueberries raspberries avocados chicken mince bacon sausages ham salmon pasta rice cereal porridge coffee tea flour sugar ketchup mayo beans soup juice water wine beer crisps biscuits chocolate yoghurts yogurts cream nappies wipes tissues shampoo toothpaste batteries foil".split(" "));
const COMPOUNDS = new Set(["garlic bread", "chicken soup", "tomato soup", "coffee beans", "chocolate biscuits", "cheese biscuits", "bread flour", "rice pudding", "chocolate milk", "potato wedges", "cream cheese", "sour cream", "ice cream", "orange juice", "apple juice", "tomato ketchup"]);
export function splitItems(raw: string) {
  return raw.split(/\s*,\s*|\s+and\s+|\s+&\s+|\s+plus\s+/i).map((x) => x.trim()).filter(Boolean).flatMap((chunk) => {
    const words = chunk.toLowerCase().split(/\s+/);
    if (words.length < 2 || COMPOUNDS.has(words.join(" ")) || !words.every((w) => SINGLES.has(w))) return [chunk];
    return words;
  });
}

const AISLE_WORDS: Record<string, string> = {
  "Fruit & veg": "apple banana orange lemon lime grape berr strawberr raspberr blueberr melon pear peach plum kiwi mango pineapple avocado tomato potato onion garlic carrot broccoli cauli pepper cucumber lettuce salad spinach kale courgette mushroom leek celery herb coriander parsley basil ginger chilli sweetcorn pea bean sprout veg fruit",
  "Bakery": "bread loaf roll bagel croissant wrap tortilla pitta naan muffin crumpet cake bun brioche",
  "Meat & fish": "chicken beef mince pork lamb bacon sausage ham turkey steak fish salmon cod tuna prawn haddock",
  "Dairy & eggs": "milk butter cheese cheddar yog yoghurt yogurt cream egg creme crème mozzarella parmesan feta halloumi",
  "Chilled": "hummus houmous dip pesto coleslaw pizza fresh pasta quiche",
  "Frozen": "frozen ice_cream ice_lolly chips fish_fingers waffle peas_frozen",
  "Food cupboard": "pasta rice flour sugar oil vinegar sauce ketchup mayo mustard stock cereal oats porridge tin tinned beans soup spice salt honey jam peanut nutella noodle lentil chickpea tomatoes coffee tea",
  "Drinks": "juice water squash cola lemonade wine beer lager gin prosecco tonic",
  "Snacks": "crisp biscuit chocolate sweets popcorn nuts bar",
  "Household": "kitchen_roll toilet_roll loo bin_bag washing up liquid detergent fabric softener dishwasher tablet foil cling bleach sponge battery light bulb",
  "Toiletries": "shampoo conditioner soap shower gel toothpaste toothbrush deodorant razor plaster paracetamol ibuprofen tissues cotton sun cream suncream",
};
const AISLES = ["Fruit & veg", "Bakery", "Meat & fish", "Dairy & eggs", "Chilled", "Frozen", "Food cupboard", "Drinks", "Snacks", "Household", "Toiletries", "Other"];
const AISLE_PAIRS = Object.entries(AISLE_WORDS).flatMap(([a, ws]) => ws.split(" ").filter(Boolean).map((w) => [a, w])).sort((x, y) => y[1].length - x[1].length);
export function guessAisle(text: string) {
  const t = " " + text.toLowerCase() + " ";
  for (const [aisle, w] of AISLE_PAIRS) if (t.includes(" " + w.replace(/_/g, " "))) return aisle;
  return "Other";
}

/* ---------------- who's speaking, what can they see ---------------- */
type Ctx = {
  member: string | null; // null = voice not recognised
  personId: string | null;
  members: Any[];
  lists: Any[]; // lists this speaker may use (never Christmas)
  access: Any[];
  apl: boolean;
  viewport: Any;
};
const nameOf = (c: Ctx, id: string | null) => c.members.find((m) => m.id === id)?.name ?? "";

async function context(req: Any): Promise<Ctx> {
  const sys = req.context?.System ?? {};
  const personId = sys.person?.personId ?? null;
  const d = getDb();
  const [{ data: members }, { data: lists }, { data: access }] = await Promise.all([
    d.from("members").select("*"),
    d.from("lists").select("*"),
    d.from("list_access").select("*"),
  ]);
  let member: string | null = null;
  if (personId) {
    const { data: v } = await d.from("alexa_voices").select("*").eq("person_id", personId);
    member = v?.[0]?.member ?? null;
  }
  const all = (members ?? []).map((m: Any) => m.id);
  const seers = (l: Any) => new Set([l.owner, ...(access ?? []).filter((a: Any) => a.list_id === l.id).map((a: Any) => a.member)]);
  const visible = (lists ?? []).filter((l: Any) => {
    if (l.type === "christmas") return false; // gift secrets never go near a speaker
    const s = seers(l);
    return member ? s.has(member) : all.every((m: string) => s.has(m)); // unknown voice: whole-family lists only
  });
  const apl = !!sys.device?.supportedInterfaces?.["Alexa.Presentation.APL"];
  return { member, personId, members: members ?? [], lists: visible, access: access ?? [], apl, viewport: req.context?.Viewport ?? null };
}
const seersOf = (c: Ctx, l: Any) => new Set([l.owner, ...c.access.filter((a) => a.list_id === l.id).map((a) => a.member)]);

async function itemsFor(c: Ctx, listIds: string[]) {
  if (!listIds.length) return [];
  const { data } = await getDb().from("items").select("*").in("list_id", listIds);
  return (data ?? []).filter((i: Any) => !i.parent_id && !(c.member ? (i.hidden_from ?? []).includes(c.member) : (i.hidden_from ?? []).length));
}

// Best list of a type: yours first (to do / work), else the most shared, else the busiest
function bestList(c: Ctx, type: string) {
  const ls = c.lists.filter((l) => l.type === type);
  if (!ls.length) return null;
  return ls.sort((a, b) => {
    if (c.member && (type === "todo" || type === "work")) {
      const ao = a.owner === c.member ? 1 : 0, bo = b.owner === c.member ? 1 : 0;
      if (ao !== bo) return bo - ao;
    }
    return seersOf(c, b).size - seersOf(c, a).size || String(a.created_at).localeCompare(String(b.created_at));
  })[0];
}
const TYPE_WORDS: [RegExp, string][] = [
  [/shop|grocer|trolley|supermarket|tesco|sainsbury|asda|aldi|lidl|waitrose|morrisons/, "shopping"],
  [/work|office/, "work"],
  [/to ?do|todo|task|jobs/, "todo"],
  [/pack|travel|holiday|suitcase|trip/, "packing"],
  [/notice|board|note/, "notice"],
  [/meal|dinner|tea|food plan/, "meals"],
];
export function findList(c: Ctx, spoken: string | undefined, fallback = "shopping") {
  const s = norm(spoken ?? "").replace(/\b(the|my|our|list)\b/g, " ").replace(/\s+/g, " ").trim();
  if (s) {
    const exact = c.lists.find((l) => norm(l.title) === s) ?? c.lists.find((l) => norm(l.title).replace(/\blist\b/g, "").trim() === s);
    if (exact) return exact;
    const part = c.lists.find((l) => norm(l.title).includes(s) || s.includes(norm(l.title)));
    if (part) return part;
    for (const [re, type] of TYPE_WORDS) if (re.test(s)) return bestList(c, type);
    return null;
  }
  return bestList(c, fallback);
}

/* ---------------- Alexa response ---------------- */
type Out = { speech: string; screen?: Any; end?: boolean; reprompt?: string; card?: string };
function respond(c: Ctx | null, o: Out) {
  const response: Any = { outputSpeech: { type: "PlainText", text: o.speech } };
  if (o.reprompt) {
    response.reprompt = { outputSpeech: { type: "PlainText", text: o.reprompt } };
    response.shouldEndSession = false;
  } else if (c?.apl && o.screen) {
    // On the Echo Show: leave the screen up (and touchable) without opening the mic
  } else {
    response.shouldEndSession = o.end ?? true;
  }
  if (c?.apl && o.screen) {
    response.directives = [{ type: "Alexa.Presentation.APL.RenderDocument", token: "mcgaw", document: o.screen.document, datasources: o.screen.datasources }];
  }
  if (o.card) response.card = { type: "Simple", title: "McGaw Lists", content: o.card };
  return { version: "1.0", response };
}
const slot = (req: Any, k: string) => {
  const s = req.request?.intent?.slots?.[k];
  return s?.slotValue?.value ?? s?.value ?? undefined;
};

/* ---------------- intents ---------------- */
async function addItems(c: Ctx, req: Any): Promise<Out> {
  const raw = slot(req, "Item");
  let listName = slot(req, "ListName");
  if (!raw) return { speech: "What would you like me to add?", reprompt: "Say something like, add milk and bread." };
  let phrase = raw;
  // "milk to the shopping list" sometimes arrives all in the item
  const m = phrase.match(/^(.*?)\s+(?:to|on|onto)\s+(?:the |my |our )?(.+?)(?: list)?$/i);
  if (!listName && m && findList(c, m[2], "")) { phrase = m[1]; listName = m[2]; }
  const l = findList(c, listName);
  if (!l) return { speech: listName ? `I couldn't find a list called ${listName}.` : "You don't have a shopping list I can use yet." };
  if (l.type === "meals") return { speech: "To plan a meal, say something like: we're having lasagne for dinner on Friday." };
  const items = await itemsFor(c, [l.id]);
  const added: string[] = [], already: string[] = [], back: string[] = [];
  const now = Date.now() / 1000;
  const by = c.member ?? l.owner;
  for (const part of splitItems(phrase)) {
    const p = l.type === "shopping" || l.type === "packing" ? parseSpoken(part) : { qty: "", text: cap(part) };
    if (!p.text) continue;
    const same = items.filter((i: Any) => norm(i.text) === norm(p.text));
    const open = same.find((i: Any) => !i.done && !i.data?.cleared);
    if (open) { already.push(p.text); continue; }
    const old = same.find((i: Any) => i.done || i.data?.cleared);
    if (old && l.type === "shopping") {
      const data = { ...(old.data ?? {}) }; delete data.cleared;
      await getDb().from("items").update({ done: false, done_by: null, done_at: null, quantity: p.qty || null, data, position: now + back.length / 1000 }).eq("id", old.id);
      back.push(p.text); continue;
    }
    const row: Any = { list_id: l.id, text: p.text, created_by: by, position: now + added.length / 1000, data: { via: "alexa" } };
    if (l.type === "shopping") { row.quantity = p.qty || null; row.category = guessAisle(p.text); }
    if (l.type === "packing") { row.quantity = p.qty || null; row.data.bag = c.member ?? "shared"; row.assignees = c.member ? [c.member] : []; }
    if (l.type === "work") { row.status = "todo"; row.assignees = c.member ? [c.member] : []; }
    if (l.type === "notice") { row.data.colour = "#FFD60A"; row.data.seen = c.member ? [c.member] : []; }
    await getDb().from("items").insert(row);
    added.push(p.text);
  }
  const bits: string[] = [];
  const done = [...added, ...back];
  if (done.length) bits.push(`Added ${joinWords(done.map((x) => x.toLowerCase()))} to ${l.title}.`);
  if (already.length) bits.push(`${cap(joinWords(already.map((x) => x.toLowerCase())))} ${already.length === 1 ? "is" : "are"} already on it.`);
  return { speech: bits.join(" ") || "I didn't catch what to add.", screen: c.apl ? await listScreen(c, l) : undefined };
}

async function tickItem(c: Ctx, req: Any): Promise<Out> {
  const raw = slot(req, "Item");
  const listName = slot(req, "ListName");
  if (!raw) return { speech: "What should I tick off?", reprompt: "Say something like, tick off milk." };
  const lists = listName ? [findList(c, listName)].filter(Boolean) : c.lists.filter((l) => !["meals", "notice"].includes(l.type));
  if (!lists.length) return { speech: `I couldn't find a list called ${listName}.` };
  const items = (await itemsFor(c, lists.map((l: Any) => l.id))).filter((i: Any) => !i.done && !i.data?.cleared);
  const ticked: string[] = [], missing: string[] = [];
  let lastList: Any = null;
  // Shopping first, then your own lists
  const rank = (i: Any) => { const l = lists.find((x: Any) => x.id === i.list_id); return (l.type === "shopping" ? 0 : 2) - (l.owner === c.member ? 1 : 0); };
  for (const part of splitItems(raw)) {
    const q = norm(parseSpoken(part).text);
    const hit = items.filter((i: Any) => norm(i.text) === q).sort((a: Any, b: Any) => rank(a) - rank(b))[0]
      ?? items.filter((i: Any) => norm(i.text).includes(q) || q.includes(norm(i.text))).sort((a: Any, b: Any) => rank(a) - rank(b))[0];
    if (!hit) { missing.push(part); continue; }
    const upd: Any = { done: true, done_by: c.member, done_at: new Date().toISOString() };
    const l = lists.find((x: Any) => x.id === hit.list_id);
    if (l.type === "work") upd.status = "done";
    await getDb().from("items").update(upd).eq("id", hit.id);
    hit.done = true; ticked.push(hit.text); lastList = l;
  }
  const bits: string[] = [];
  if (ticked.length) bits.push(`Ticked off ${joinWords(ticked.map((x) => x.toLowerCase()))}${lastList ? ` on ${lastList.title}` : ""}.`);
  if (missing.length) bits.push(`I couldn't find ${joinWords(missing, "or")}.`);
  return { speech: bits.join(" "), screen: c.apl && lastList ? await listScreen(c, lastList) : undefined };
}

async function readList(c: Ctx, req: Any): Promise<Out> {
  const listName = slot(req, "ListName");
  const l = findList(c, listName);
  if (!l) return { speech: listName ? `I couldn't find a list called ${listName}.` : "I couldn't find a shopping list." };
  if (l.type === "meals") return weekMeals(c);
  const items = (await itemsFor(c, [l.id])).filter((i: Any) => !i.done && !i.data?.cleared && !(l.type === "notice" && i.data?.until && i.data.until < ymd()));
  let speech: string;
  if (!items.length) speech = `${l.title} is empty.`;
  else {
    const ordered = orderForSpeech(l, items);
    const names = ordered.slice(0, 12).map((i: Any) => (i.quantity ? `${i.quantity} ${i.text}` : i.text).toLowerCase());
    const more = ordered.length > 12 ? `, and ${ordered.length - 12} more` : "";
    speech = l.type === "notice"
      ? `There ${items.length === 1 ? "is one note" : `are ${items.length} notes`} on ${l.title}. ${ordered.slice(0, 5).map((i: Any) => i.text).join(". ")}.`
      : `${l.title} has ${plural(items.length, "thing")}: ${names.join(", ")}${more}.`;
  }
  return { speech, screen: c.apl ? await listScreen(c, l) : undefined };
}
function orderForSpeech(l: Any, items: Any[]) {
  if (l.type === "shopping") return [...items].sort((a, b) => AISLES.indexOf(a.category || "Other") - AISLES.indexOf(b.category || "Other") || a.position - b.position);
  if (l.type === "notice") return [...items].sort((a, b) => (b.data?.pinned ? 1 : 0) - (a.data?.pinned ? 1 : 0) || b.position - a.position);
  return [...items].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0) || (a.due || "9999").localeCompare(b.due || "9999") || a.position - b.position);
}

async function listScreen(c: Ctx, l: Any) {
  const items = (await itemsFor(c, [l.id])).filter((i: Any) => !i.data?.cleared && !(l.type === "notice" && i.data?.until && i.data.until < ymd()));
  const colour = l.colour || TYPE_COLOUR[l.type] || "#0A84FF";
  const t = ymd();
  const row = (i: Any) => {
    const meta: string[] = [];
    if (i.quantity) meta.push(i.quantity);
    if (i.due) meta.push(i.due < t ? "Overdue" : i.due === t ? "Today" : shortDay(i.due));
    if (i.status === "doing") meta.push("Doing");
    if ((i.assignees ?? []).length && i.assignees.length < c.members.length) meta.push(i.assignees.map((a: string) => nameOf(c, a)).join(" & "));
    return { type: "row", id: i.id, text: i.text, meta: meta.join("  ·  "), done: !!i.done, late: !!(i.due && i.due < t && !i.done), tick: l.type !== "notice" };
  };
  const rows: Any[] = [];
  const open = items.filter((i: Any) => !i.done), done = items.filter((i: Any) => i.done);
  if (l.type === "shopping") {
    for (const a of AISLES) {
      const g = open.filter((i: Any) => (i.category || "Other") === a).sort((x: Any, y: Any) => x.position - y.position);
      if (g.length) rows.push({ type: "label", text: a.toUpperCase() }, ...g.map(row));
    }
    if (done.length) rows.push({ type: "label", text: `IN THE TROLLEY (${done.length})` }, ...done.slice(0, 20).map(row));
  } else if (l.type === "notice") {
    for (const i of orderForSpeech(l, open)) rows.push({ type: "note", id: i.id, text: i.text, meta: [i.data?.pinned ? "Pinned" : "", `${nameOf(c, i.created_by)}`].filter(Boolean).join("  ·  "), colour: i.data?.colour || "#FFD60A" });
  } else if (l.type === "packing") {
    const bags = [...new Set(open.map((i: Any) => i.data?.bag || "shared"))];
    for (const b of bags as string[]) rows.push({ type: "label", text: (b === "shared" ? "SHARED" : nameOf(c, b) || b).toUpperCase() }, ...open.filter((i: Any) => (i.data?.bag || "shared") === b).map(row));
  } else {
    const act = l.type === "work" ? items.filter((i: Any) => i.status !== "done" && !i.done) : open;
    for (const p of [3, 2, 1, 0]) {
      const g = act.filter((i: Any) => (i.priority ?? 0) === p).sort((a: Any, b: Any) => (a.due || "9999").localeCompare(b.due || "9999") || a.position - b.position);
      if (g.length) rows.push({ type: "label", text: (PRI_NAME[p] || (rows.length ? "EVERYTHING ELSE" : "")).toUpperCase(), colour: PRI_COLOUR[p] }, ...g.map(row));
    }
  }
  if (!rows.length) rows.push({ type: "empty", text: l.type === "shopping" ? "Nothing on the list" : "All clear" });
  const n = open.length;
  return V.listDoc({ title: l.title, kicker: (TYPE_NAME[l.type] || "").toUpperCase(), subtitle: l.type === "notice" ? plural(n, "note") : `${n} to go`, colour, listId: l.id, rows });
}

async function mainMeals(c: Ctx) { return bestList(c, "meals"); }
async function mealData(c: Ctx, l: Any, from: string, to: string) {
  const d = getDb();
  const [{ data: slots }, { data: pres }] = await Promise.all([
    d.from("meal_slots").select("*").eq("list_id", l.id),
    d.from("meal_presence").select("*").eq("list_id", l.id),
  ]);
  return {
    slots: (slots ?? []).filter((s: Any) => s.day >= from && s.day <= to && s.slot === "dinner"),
    pres: (pres ?? []).filter((s: Any) => s.day >= from && s.day <= to && s.slot === "dinner"),
  };
}
function dayFromSlot(v: string | undefined) {
  if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  return ymd();
}
function presenceWords(c: Ctx, l: Any, pres: Any[], day: string) {
  const eaters = [...seersOf(c, l)];
  const out = pres.filter((p) => p.day === day && p.status === "out").map((p) => nameOf(c, p.member));
  const late = pres.filter((p) => p.day === day && p.status === "late").map((p) => nameOf(c, p.member));
  const bits: string[] = [];
  if (out.length) bits.push(`${joinWords(out)} ${out.length === 1 ? "is" : "are"} out`);
  if (late.length) bits.push(`${joinWords(late)} will be late`);
  const home = eaters.length - out.length;
  return { text: bits.join(", and "), home };
}
async function dinner(c: Ctx, req: Any): Promise<Out> {
  const l = await mainMeals(c);
  if (!l) return { speech: "There's no meal planner I can see yet." };
  const day = dayFromSlot(slot(req, "Day"));
  const { slots, pres } = await mealData(c, l, addDays(ymd(), -1), addDays(ymd(), 8));
  const s = slots.find((x: Any) => x.day === day);
  const w = whenWord(day);
  const pw = presenceWords(c, l, pres, day);
  let speech = s?.meal ? `${w === "today" ? "Tonight" : cap(w)} it's ${s.meal}${s.cook ? `, and ${nameOf(c, s.cook)} is cooking` : ""}.` : `Nothing's planned for dinner ${w === "today" ? "tonight" : w} yet.`;
  if (pw.text) speech += ` ${pw.text}.`;
  return { speech, screen: c.apl ? await mealsScreen(c, l, day) : undefined };
}
async function weekMeals(c: Ctx): Promise<Out> {
  const l = await mainMeals(c);
  if (!l) return { speech: "There's no meal planner I can see yet." };
  const t = ymd();
  const { slots } = await mealData(c, l, t, addDays(t, 6));
  const planned = [0, 1, 2, 3, 4, 5, 6].map((n) => addDays(t, n)).map((d) => ({ d, s: slots.find((x: Any) => x.day === d) })).filter((x) => x.s?.meal);
  const speech = planned.length
    ? planned.slice(0, 7).map((x) => `${x.d === t ? "Tonight" : x.d === addDays(t, 1) ? "Tomorrow" : dayName(x.d)}, ${x.s.meal}`).join(". ") + "."
    : "Nothing's planned for dinner this week yet.";
  return { speech, screen: c.apl ? await mealsScreen(c, l, t) : undefined };
}
async function mealsScreen(c: Ctx, l: Any, focus: string) {
  const t = ymd();
  const start = focus < t || focus > addDays(t, 6) ? focus : t;
  const { slots, pres } = await mealData(c, l, start, addDays(start, 6));
  const eaters = [...seersOf(c, l)].map((id: Any) => c.members.find((m) => m.id === id)).filter(Boolean);
  const days = [0, 1, 2, 3, 4, 5, 6].map((n) => addDays(start, n)).map((d) => {
    const s = slots.find((x: Any) => x.day === d);
    return {
      day: d === t ? "Tonight" : d === addDays(t, 1) ? "Tomorrow" : new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", timeZone: "UTC" }),
      meal: s?.meal || "—",
      cook: s?.cook ? `${nameOf(c, s.cook)} cooking` : "",
      focus: d === focus,
      people: eaters.map((m: Any) => {
        const p = pres.find((x: Any) => x.day === d && x.member === m.id);
        return { initial: m.name[0], colour: m.colour, status: p?.status || "home" };
      }),
    };
  });
  return V.mealsDoc({ title: l.title, colour: l.colour || TYPE_COLOUR.meals, days });
}

async function setDinner(c: Ctx, req: Any): Promise<Out> {
  const meal = slot(req, "Meal");
  if (!meal) return { speech: "What are you having?", reprompt: "Say something like, we're having lasagne for dinner on Friday." };
  const l = await mainMeals(c);
  if (!l) return { speech: "There's no meal planner I can see yet." };
  const day = dayFromSlot(slot(req, "Day"));
  const d = getDb();
  const { data: cur } = await d.from("meal_slots").select("*").eq("list_id", l.id).eq("day", day).eq("slot", "dinner");
  const row = { ...(cur?.[0] ?? {}), list_id: l.id, day, slot: "dinner", meal: cap(meal), updated_by: c.member };
  await d.from("meal_slots").upsert(row);
  return { speech: `${cap(meal)} for dinner ${whenWord(day)}. Got it.`, screen: c.apl ? await mealsScreen(c, l, day) : undefined };
}

async function presence(c: Ctx, req: Any): Promise<Out> {
  if (!c.member) return notKnown("mark who's home for dinner");
  const l = await mainMeals(c);
  if (!l) return { speech: "There's no meal planner I can see yet." };
  const raw = norm(slot(req, "Status") ?? "");
  const status = /late/.test(raw) ? "late" : /out|away|not/.test(raw) ? "out" : /home|in|back|here/.test(raw) ? "home" : null;
  if (!status) return { speech: "Are you home, out or late for dinner?", reprompt: "Say I'm out for dinner, or I'll be late for dinner." };
  const day = dayFromSlot(slot(req, "Day"));
  await getDb().from("meal_presence").upsert({ list_id: l.id, day, slot: "dinner", member: c.member, status });
  const w = whenWord(day);
  const speech = status === "out" ? `OK ${nameOf(c, c.member)}, you're out for dinner ${w}.` : status === "late" ? `OK, I've put you down as late for dinner ${w}.` : `OK, you're home for dinner ${w}.`;
  return { speech, screen: c.apl ? await mealsScreen(c, l, day) : undefined };
}

async function myTasks(c: Ctx): Promise<Out> {
  const t = ymd(), weekEnd = addDays(t, 7);
  const lists = c.lists.filter((l) => l.type === "todo" || l.type === "work");
  const items = (await itemsFor(c, lists.map((l) => l.id))).filter((i: Any) => !i.done && i.status !== "done");
  const mine = items.filter((i: Any) => c.member ? (i.assignees ?? []).includes(c.member) || (!(i.assignees ?? []).length && lists.find((l) => l.id === i.list_id)?.owner === c.member) : true);
  const relevant = mine.filter((i: Any) => (i.due && i.due <= weekEnd) || (i.priority ?? 0) >= 2);
  const overdue = relevant.filter((i: Any) => i.due && i.due < t), today = relevant.filter((i: Any) => i.due === t);
  const who = c.member ? "You've" : "The family has";
  let speech: string;
  if (!relevant.length) speech = c.member ? `Nothing's due this week, ${nameOf(c, c.member)}. Nice.` : "Nothing's due on the family lists this week.";
  else {
    const bits: string[] = [];
    if (overdue.length) bits.push(`${plural(overdue.length, "overdue task")}`);
    if (today.length) bits.push(`${plural(today.length, "task")} due today`);
    const top = [...overdue, ...today].slice(0, 4).map((i: Any) => i.text);
    speech = bits.length ? `${who} got ${joinWords(bits)}: ${joinWords(top)}.` : `${who} got ${plural(relevant.length, "task")} coming up this week. The first is ${relevant.sort((a: Any, b: Any) => (a.due || "9999").localeCompare(b.due || "9999"))[0].text}.`;
  }
  if (!c.member) speech += " I don't know whose voice this is, so that's the family lists only.";
  const buckets: [string, (i: Any) => boolean][] = [
    ["OVERDUE", (i) => !!i.due && i.due < t],
    ["TODAY", (i) => i.due === t],
    ["TOMORROW", (i) => i.due === addDays(t, 1)],
    ["THIS WEEK", (i) => !!i.due && i.due > addDays(t, 1) && i.due <= weekEnd],
    ["URGENT, NO DATE", (i) => !i.due || i.due > weekEnd],
  ];
  const rows: Any[] = [];
  for (const [label, f] of buckets) {
    const g = relevant.filter(f).sort((a: Any, b: Any) => (b.priority ?? 0) - (a.priority ?? 0) || (a.due || "").localeCompare(b.due || ""));
    if (g.length) rows.push({ type: "label", text: label, colour: label === "OVERDUE" ? "#FF453A" : undefined }, ...g.map((i: Any) => {
      const l = lists.find((x) => x.id === i.list_id);
      return { type: "row", id: i.id, listId: i.list_id, text: i.text, meta: [l?.title, PRI_NAME[i.priority ?? 0], i.due && label !== "TODAY" && label !== "TOMORROW" ? shortDay(i.due) : ""].filter(Boolean).join("  ·  "), done: false, late: label === "OVERDUE", tick: true, pri: PRI_COLOUR[i.priority ?? 0] };
    }));
  }
  if (!rows.length) rows.push({ type: "empty", text: "Nothing due this week" });
  return { speech, screen: c.apl ? V.listDoc({ title: c.member ? `${nameOf(c, c.member)}’s week` : "This week", kicker: "TASKS", subtitle: `${plural(relevant.length, "task")}`, colour: "#0A84FF", listId: "mine", rows }) : undefined };
}

async function countdownsFor(c: Ctx) {
  const { data, error } = await getDb().from("countdowns").select("*");
  if (error) return [];
  const all = c.members.map((m) => m.id);
  return (data ?? []).filter((x: Any) => {
    if (new Date(x.target).getTime() < Date.now() - 86400000) return false;
    const linked = x.list_id && c.lists.some((l) => l.id === x.list_id);
    if (c.member) return x.owner === c.member || (x.members ?? []).includes(c.member) || linked;
    return linked || all.every((m) => m === x.owner || (x.members ?? []).includes(m));
  }).sort((a: Any, b: Any) => String(a.target).localeCompare(String(b.target)));
}
function untilWords(ms: number) {
  if (ms <= 0) return "It's here";
  const d = Math.floor(ms / 86400000), h = Math.floor(ms / 3600000) % 24, m = Math.floor(ms / 60000) % 60;
  if (d >= 100) { const months = Math.floor(d / 30.44); return `${plural(d, "day")}, which is about ${plural(months, "month")}`; }
  if (d >= 2) return `${plural(d, "day")}${h ? ` and ${plural(h, "hour")}` : ""}`;
  if (d === 1) return `1 day${h ? `, ${plural(h, "hour")}` : ""}`;
  if (h) return `${plural(h, "hour")} and ${plural(m, "minute")}`;
  return plural(Math.max(1, m), "minute");
}
async function countdown(c: Ctx, req: Any): Promise<Out> {
  const all = await countdownsFor(c);
  if (!all.length) return { speech: "There aren't any countdowns yet. You can make one in the app." };
  const q = norm(slot(req, "Countdown") ?? "");
  let cd = all[0];
  if (q) {
    const hit = all.find((x: Any) => norm(x.title) === q) ?? all.find((x: Any) => norm(x.title).includes(q) || q.includes(norm(x.title)))
      ?? all.find((x: Any) => q.split(" ").some((w) => w.length > 3 && norm(x.title).includes(w)));
    if (!hit) return { speech: `I couldn't find a countdown called ${q}. The next one is ${all[0].title}, in ${untilWords(new Date(all[0].target).getTime() - Date.now())}.`, screen: c.apl ? cdScreen(c, all[0], all) : undefined };
    cd = hit;
  }
  const ms = new Date(cd.target).getTime() - Date.now();
  const speech = ms <= 0 ? `${cd.title} is here!` : `${cd.title} is in ${untilWords(ms)}.`;
  return { speech, screen: c.apl ? cdScreen(c, cd, all) : undefined };
}
function cdScreen(c: Ctx, cd: Any, all: Any[]) {
  const l = cd.list_id ? c.lists.find((x) => x.id === cd.list_id) : null;
  const colour = cd.colour || (l ? l.colour || TYPE_COLOUR[l.type] : "#5E5CE6");
  const others = all.filter((x) => x.id !== cd.id).slice(0, 3).map((x) => ({ title: x.title, when: untilWords(new Date(x.target).getTime() - Date.now()) }));
  const when = new Date(cd.target).toLocaleString("en-GB", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  return V.countdownDoc({ title: cd.title, remaining: Math.max(0, new Date(cd.target).getTime() - Date.now()), style: cd.style || "standard", colour, when, others });
}

async function today(c: Ctx): Promise<Out> {
  const t = ymd();
  const ml = await mainMeals(c);
  const meal = ml ? await mealData(c, ml, t, t) : { slots: [], pres: [] };
  const s = meal.slots[0];
  const shop = bestList(c, "shopping");
  const noticeL = bestList(c, "notice");
  const taskLists = c.lists.filter((l) => l.type === "todo" || l.type === "work");
  const ids = [shop?.id, noticeL?.id, ...taskLists.map((l) => l.id)].filter(Boolean) as string[];
  const items = await itemsFor(c, ids);
  const shopOpen = shop ? items.filter((i: Any) => i.list_id === shop.id && !i.done && !i.data?.cleared) : [];
  const notes = noticeL ? items.filter((i: Any) => i.list_id === noticeL.id && !(i.data?.until && i.data.until < t)).sort((a: Any, b: Any) => (b.data?.pinned ? 1 : 0) - (a.data?.pinned ? 1 : 0) || b.position - a.position) : [];
  const tasks = items.filter((i: Any) => taskLists.some((l) => l.id === i.list_id) && !i.done && i.status !== "done" && i.due && i.due <= t
    && (c.member ? (i.assignees ?? []).includes(c.member) || (!(i.assignees ?? []).length && taskLists.find((l) => l.id === i.list_id)?.owner === c.member) : true))
    .sort((a: Any, b: Any) => (b.priority ?? 0) - (a.priority ?? 0));
  const cds = await countdownsFor(c);
  const h = Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", hour12: false }).format(new Date()));
  const hello = `${h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"}${c.member ? `, ${nameOf(c, c.member)}` : ""}`;
  const bits = [hello + "."];
  bits.push(s?.meal ? `Dinner tonight is ${s.meal}${s.cook ? `, cooked by ${nameOf(c, s.cook)}` : ""}.` : "Nothing's planned for dinner yet.");
  if (tasks.length) bits.push(`${c.member ? "You've" : "There are"} ${plural(tasks.length, "task")} due${tasks.some((i: Any) => i.due < t) ? " or overdue" : " today"}, starting with ${tasks[0].text}.`);
  if (shop) bits.push(`${plural(shopOpen.length, "thing")} on the shopping list.`);
  if (cds[0]) bits.push(`${cds[0].title} is in ${untilWords(new Date(cds[0].target).getTime() - Date.now())}.`);
  const pw = ml ? presenceWords(c, ml, meal.pres, t) : { text: "", home: 0 };
  const screen = c.apl ? V.todayDoc({
    hello,
    date: new Date().toLocaleDateString("en-GB", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" }),
    dinner: s?.meal || "Not planned yet", cook: s?.cook ? `${nameOf(c, s.cook)} cooking` : "", home: pw.text || (ml ? `${pw.home} home` : ""),
    tasks: tasks.slice(0, 5).map((i: Any) => ({ text: i.text, late: i.due < t, pri: PRI_COLOUR[i.priority ?? 0] })), taskCount: tasks.length,
    shop: shopOpen.slice(0, 6).map((i: Any) => i.text), shopCount: shopOpen.length, shopTitle: shop?.title || "Shopping",
    cd: cds[0] ? { title: cds[0].title, remaining: Math.max(0, new Date(cds[0].target).getTime() - Date.now()) } : null,
    mealsId: ml?.id ?? null, shopId: shop?.id ?? null,
    note: notes[0] ? { text: notes[0].text, colour: notes[0].data?.colour || "#FFD60A", by: nameOf(c, notes[0].created_by) } : null,
  }) : undefined;
  return { speech: bits.join(" "), screen };
}

async function linkVoice(c: Ctx, req: Any): Promise<Out> {
  const code = String(slot(req, "Code") ?? "").replace(/\D/g, "");
  if (!c.personId) return { speech: "I can't tell who's speaking yet. In the Alexa app, set up a voice ID, turn on Personalise skills for it, then say your code again." };
  if (code.length !== 4) return { speech: "What's the four digit code from the app?", reprompt: "Say, my code is, then the four numbers." };
  const d = getDb();
  const { data } = await d.from("alexa_codes").select("*").eq("code", code);
  const row = (data ?? []).find((r: Any) => new Date(r.expires_at).getTime() > Date.now());
  if (!row) return { speech: "That code didn't work, or it's run out. Make a new one in the app under Family, then Alexa." };
  await d.from("alexa_voices").upsert({ person_id: c.personId, member: row.member });
  await d.from("alexa_codes").delete().eq("code", code);
  return { speech: `Hi ${nameOf(c, row.member)}! I'll know your voice from now on, so your own lists and tasks will work.` };
}
function notKnown(what: string): Out {
  return { speech: `I don't know whose voice this is, so I can't ${what}. Open the app, go to Family, then Alexa, to link your voice.` };
}

/* ---------------- touch on the Echo Show ---------------- */
async function touch(c: Ctx, req: Any): Promise<Out> {
  const [kind, listId, itemId] = req.request.arguments ?? [];
  if (kind === "tick" && itemId) {
    const l = listId === "mine" ? null : c.lists.find((x) => x.id === listId);
    const { data } = await getDb().from("items").select("*").eq("id", itemId);
    const it = data?.[0];
    const ok = it && c.lists.some((x) => x.id === it.list_id) && !(c.member ? (it.hidden_from ?? []).includes(c.member) : (it.hidden_from ?? []).length);
    if (!ok) return { speech: "" };
    const itl = c.lists.find((x) => x.id === it.list_id);
    const done = !it.done;
    const upd: Any = { done, done_by: done ? c.member : null, done_at: done ? new Date().toISOString() : null };
    if (itl.type === "work") upd.status = done ? "done" : "todo";
    await getDb().from("items").update(upd).eq("id", it.id);
    if (listId === "mine") return { ...(await myTasks(c)), speech: "" };
    return { speech: "", screen: l ? await listScreen(c, l) : undefined };
  }
  if (kind === "open" && listId) {
    const l = c.lists.find((x) => x.id === listId);
    if (l?.type === "meals") return { ...(await weekMeals(c)), speech: "" };
    if (listId === "mine") return { ...(await myTasks(c)), speech: "" };
    if (listId === "countdown") return { ...(await countdown(c, { request: { intent: { slots: {} } } })), speech: "" };
    if (l) return { speech: "", screen: await listScreen(c, l) };
  }
  if (kind === "home") return { ...(await today(c)), speech: "" };
  return { speech: "" };
}

const HELP = "You can say things like: add milk and bread. What's on the shopping list? Tick off eggs. What's for dinner tomorrow? I'm out for dinner on Friday. What have I got to do? How long until the holiday? Or, what's on today?";

async function route(req: Any): Promise<Any> {
  const type = req.request?.type;
  if (type === "SessionEndedRequest") return { version: "1.0", response: {} };
  const c = await context(req);
  let out: Out;
  if (type === "LaunchRequest") {
    const t = await today(c);
    out = { ...t, speech: t.speech + " What would you like to do?", reprompt: "You can say add something, read a list, or what's for dinner." };
    if (!c.member && c.personId) out.speech = t.speech + " By the way, I don't know whose voice this is yet. You can link it from the app, under Family, then Alexa. What would you like to do?";
  } else if (type === "Alexa.Presentation.APL.UserEvent") {
    out = await touch(c, req);
    if (!out.speech) {
      const r = respond(c, out);
      delete r.response.outputSpeech;
      return r;
    }
  } else if (type === "IntentRequest") {
    const name = req.request.intent.name;
    switch (name) {
      case "AddItemIntent": out = await addItems(c, req); break;
      case "TickItemIntent": out = await tickItem(c, req); break;
      case "ReadListIntent": out = await readList(c, req); break;
      case "DinnerIntent": out = await dinner(c, req); break;
      case "WeekMealsIntent": out = await weekMeals(c); break;
      case "SetDinnerIntent": out = await setDinner(c, req); break;
      case "PresenceIntent": out = await presence(c, req); break;
      case "MyTasksIntent": out = await myTasks(c); break;
      case "CountdownIntent": out = await countdown(c, req); break;
      case "NoticeIntent": out = await readList(c, { request: { intent: { slots: { ListName: { value: "notice board" } } } } }); break;
      case "TodayIntent": out = await today(c); break;
      case "LinkVoiceIntent": out = await linkVoice(c, req); break;
      case "WhoAmIIntent": out = { speech: c.member ? `You're ${nameOf(c, c.member)}.` : c.personId ? "I don't know your voice yet. Make a code in the app under Family, then Alexa, and tell me: my code is, and the number." : "I can't tell voices apart yet. Each person needs a voice ID in the Alexa app with Personalise skills turned on." }; break;
      case "AMAZON.HelpIntent": out = { speech: HELP, reprompt: "What would you like to do?" }; break;
      case "AMAZON.NavigateHomeIntent": out = await today(c); break;
      case "AMAZON.CancelIntent": case "AMAZON.StopIntent": out = { speech: "Bye!", end: true }; return respond(null, out);
      case "AMAZON.FallbackIntent": default: out = { speech: "Sorry, I didn't get that. " + HELP, reprompt: "What would you like to do?" };
    }
  } else {
    out = { speech: "Sorry, something went wrong." };
  }
  return respond(c, out);
}
export { route };

if (!Deno.env.get("ALEXA_TEST")) Deno.serve(async (r: Request) => {
  if (r.method !== "POST") return new Response("McGaw Lists Alexa skill", { status: 200 });
  const url = new URL(r.url);
  const key = env("ALEXA_URL_KEY");
  if (!key || url.searchParams.get("key") !== key) return new Response("Not found", { status: 404 });
  const body = await r.text();
  let req: Any;
  try { req = JSON.parse(body); } catch { return new Response("Bad request", { status: 400 }); }
  const problem = await verifyAlexa(r.headers, body, req, env("ALEXA_SKILL_ID"));
  if (problem) { console.warn("Rejected Alexa request:", problem); return new Response("Forbidden", { status: 403 }); }
  try {
    return Response.json(await route(req));
  } catch (e) {
    console.error(e);
    return Response.json(respond(null, { speech: "Sorry, McGaw Lists had a problem. Try again in a moment." }));
  }
});

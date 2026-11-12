// McGaw Lists — Outlook → Work list.
// Reads recent work emails (read-only), asks Claude which ones need action,
// and hands back suggested tasks for the person to tick in the app.
// Nothing is sent, moved or changed in Outlook.
//
// Deploy as an Edge Function named "outlook" with JWT verification turned OFF
// (Microsoft's sign-in redirect can't send a Supabase token; every action checks the login itself).
// Secrets: MS_CLIENT_ID, MS_CLIENT_SECRET (same as To Do), ANTHROPIC_API_KEY. Optional: OUTLOOK_MODEL, APP_URL.
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string) => Deno.env.get(k) ?? "";
const SB_URL = env("SUPABASE_URL");
function serviceKey() {
  const k = env("SUPABASE_SERVICE_ROLE_KEY");
  if (k) return k;
  try { const j = JSON.parse(env("SUPABASE_SECRET_KEYS")); return (j.default ?? Object.values(j)[0]) as string; } catch { return ""; }
}
// deno-lint-ignore no-explicit-any
type Row = Record<string, any>;
let db: Row | null = null;
const getDb = () => db ?? (db = createClient(SB_URL, serviceKey(), { auth: { persistSession: false } }));

const CLIENT_ID = env("MS_CLIENT_ID");
const CLIENT_SECRET = env("MS_CLIENT_SECRET");
const AI_KEY = env("ANTHROPIC_API_KEY");
const MODEL = env("OUTLOOK_MODEL") || "claude-haiku-5-5";
const REDIRECT = `${SB_URL}/functions/v1/outlook`;
const APP_URL = env("APP_URL") || "https://quickdraw10.github.io/mcgaw-lists/";
// Work and school accounts (Microsoft 365)
const AUTH = "https://login.microsoftonline.com/organizations/oauth2/v2.0";
const SCOPE = "offline_access Mail.Read User.Read";
const TZ = "Europe/London";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const back = (q: string) => new Response(null, { status: 302, headers: { Location: `${APP_URL}?outlook=${q}#/family` } });

/* ---------- Microsoft ---------- */
async function tokenRequest(params: Record<string, string>) {
  const r = await fetch(`${AUTH}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, scope: SCOPE, ...params }),
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error_description || j.error || "Microsoft sign-in failed");
  return j;
}
async function tokenFor(member: string) {
  const { data: a } = await getDb().from("outlook_accounts").select("*").eq("member", member).maybeSingle();
  if (!a) throw new Error("Outlook isn’t connected");
  try {
    const j = await tokenRequest({ grant_type: "refresh_token", refresh_token: a.refresh_token, redirect_uri: REDIRECT });
    if (j.refresh_token) await getDb().from("outlook_accounts").update({ refresh_token: j.refresh_token, last_error: null }).eq("member", member);
    return j.access_token as string;
  } catch {
    await getDb().from("outlook_accounts").update({ last_error: "Outlook sign-in has expired — reconnect" }).eq("member", member);
    throw new Error("Outlook sign-in has expired — reconnect it under Family");
  }
}
async function graph(token: string, path: string): Promise<Row> {
  const url = path.startsWith("http") ? path : `https://graph.microsoft.com/v1.0${path}`;
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Prefer: `outlook.timezone="${TZ}", outlook.body-content-type="text"` } });
    if (r.status === 429 && attempt < 3) { await new Promise((res) => setTimeout(res, 1500 * (attempt + 1))); continue; }
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`Outlook error ${r.status}: ${j?.error?.message ?? ""}`);
    return j;
  }
}
async function memberFrom(req: Request) {
  const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!jwt) return null;
  const { data, error } = await getDb().auth.getUser(jwt);
  if (error || !data.user?.email) return null;
  const { data: ms } = await getDb().from("members").select("id,email,name");
  return ms?.find((m: Row) => m.email.toLowerCase() === data.user!.email!.toLowerCase()) ?? null;
}

/* ---------- reading the inbox ---------- */
const clean = (s: unknown) => String(s ?? "").replace(/\r/g, "").replace(/[​-‍͏ ]+/g, " ").replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
export type Mail = { id: string; subject: string; from: string; fromEmail: string; received: string; isRead: boolean; preview: string; link: string | null; toCount: number; toMe: boolean; focused: boolean };

async function recentMail(token: string, days: number, myEmail: string): Promise<Mail[]> {
  const after = new Date(Date.now() - days * 864e5).toISOString();
  const select = "id,subject,from,toRecipients,ccRecipients,receivedDateTime,isRead,bodyPreview,webLink,inferenceClassification";
  let next: string | undefined = `/me/mailFolders/inbox/messages?$filter=receivedDateTime ge ${after}&$orderby=receivedDateTime desc&$top=50&$select=${select}`;
  const out: Mail[] = [];
  for (let page = 0; next && page < 3; page++) {
    const j: Row = await graph(token, next);
    for (const m of j.value || []) {
      const to = (m.toRecipients || []).map((r: Row) => String(r.emailAddress?.address || "").toLowerCase());
      out.push({
        id: m.id, subject: clean(m.subject), from: m.from?.emailAddress?.name || "", fromEmail: m.from?.emailAddress?.address || "",
        received: m.receivedDateTime, isRead: !!m.isRead, preview: clean(m.bodyPreview).slice(0, 420), link: m.webLink || null,
        toCount: to.length + (m.ccRecipients || []).length, toMe: !!myEmail && to.includes(myEmail.toLowerCase()), focused: m.inferenceClassification !== "other",
      });
    }
    next = j["@odata.nextLink"];
  }
  return out;
}

/* ---------- Claude sorts them ---------- */
export function triagePrompt(mails: Mail[], who: string, todayStr: string) {
  const lines = mails.map((m, i) =>
    `[${i}] ${m.received} | From: ${m.from} <${m.fromEmail}> | ${m.toMe ? "sent to him" : "cc / group"} (${m.toCount} recipients) | ${m.isRead ? "read" : "UNREAD"}${m.focused ? "" : " | Other folder"}\nSubject: ${m.subject}\nPreview: ${m.preview}`).join("\n\n");
  return `You turn a work inbox into a to-do list for ${who}, Senior Project Manager at Cloudbass, a UK outside broadcast facilities company. Today is ${todayStr}. Write in British English.

Keep ONLY emails where ${who} personally has to do something:
- "act": a decision, approval, booking, purchase order, quote or deadline that needs him soon
- "reply": someone is waiting on his answer, but it is less pressing
Leave out FYI mail, calendar acceptances, automatic replies, marketing, cold sales, newsletters, all-staff social emails, and threads that others have already answered.
Several emails in the same thread (same subject, Re:/RE:/FW:) become ONE task; list all their indexes.

For each task give:
- "task": a short imperative to-do, max 9 words, naming the person, company or job (e.g. "Approve PO for Tait radio rack (£1,245)")
- "cat": "act" or "reply"
- "priority": 3 if "act" and due today or tomorrow, 2 if "act" but later, 1 for "reply"
- "due": YYYY-MM-DD if the email states or clearly implies a date, otherwise null
- "why": max 14 words on what is being asked
- "emails": array of the email indexes

Reply with only JSON: {"tasks":[{"task":"...","cat":"act","priority":3,"due":null,"why":"...","emails":[0,4]}]}

Emails:
${lines}`;
}
// Reads Claude's answer even if it's wrapped in ``` fences, has extra words, or was cut off part-way:
// any complete task objects are kept.
export function extractJson(text: string): Row {
  const t = text.replace(/```(?:json)?/gi, "");
  const s = t.indexOf("{"), e = t.lastIndexOf("}");
  if (s >= 0 && e > s) {
    try { return JSON.parse(t.slice(s, e + 1)); } catch { /* fall through to salvage */ }
  }
  const start = t.indexOf("[", t.indexOf('"tasks"'));
  if (start < 0) throw new Error("Claude’s answer wasn’t readable — try again");
  const tasks: Row[] = [];
  let depth = 0, from = -1, inStr = false, esc = false;
  for (let i = start + 1; i < t.length; i++) {
    const c = t[i];
    if (inStr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === "{") { if (depth === 0) from = i; depth++; }
    else if (c === "}") { depth--; if (depth === 0 && from >= 0) { try { tasks.push(JSON.parse(t.slice(from, i + 1))); } catch { /* skip a broken one */ } from = -1; } }
    else if (c === "]" && depth === 0) break;
  }
  return { tasks };
}
const ymd = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
function nextWorkingDay() { const d = new Date(); do { d.setDate(d.getDate() + 1); } while ([0, 6].includes(d.getDay())); return ymd(d); }
export function shapeTasks(raw: Row, mails: Mail[]): Row[] {
  const today = ymd(new Date());
  const tasks = Array.isArray(raw?.tasks) ? raw.tasks : [];
  return tasks.map((t: Row): Row | null => {
    const idx = (Array.isArray(t.emails) ? t.emails : []).map(Number).filter((n: number) => mails[n]);
    if (!idx.length || !t.task) return null;
    const cat = t.cat === "act" ? "act" : "reply";
    const pri = [0, 1, 2, 3].includes(+t.priority) ? +t.priority : cat === "act" ? 3 : 1;
    const first = mails[idx[0]];
    const due = typeof t.due === "string" && /^\d{4}-\d{2}-\d{2}$/.test(t.due) ? (t.due < today ? today : t.due) : cat === "act" ? today : nextWorkingDay();
    return { text: String(t.task).slice(0, 140), cat, pri, due, why: String(t.why || "").slice(0, 200), ids: idx.map((n: number) => mails[n].id), from: first.from || first.fromEmail, subject: first.subject, link: first.link };
  }).filter((x: Row | null): x is Row => !!x).sort((a: Row, b: Row) => b.pri - a.pri || a.due.localeCompare(b.due));
}
async function askClaude(prompt: string) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": AI_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, max_tokens: 8000, messages: [{ role: "user", content: prompt }] }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const m = j?.error?.message || `error ${r.status}`;
    if (r.status === 401) throw new Error("The Claude API key isn’t right — check ANTHROPIC_API_KEY in Supabase");
    if (/credit|billing/i.test(m)) throw new Error("Your Claude API account needs credit — top up at console.anthropic.com");
    throw new Error(`Claude couldn’t sort the emails (${m})`);
  }
  const text = (j.content || []).filter((b: Row) => b.type === "text").map((b: Row) => b.text).join("");
  if (j.stop_reason === "max_tokens") console.warn("Claude's answer was cut off; keeping the complete tasks");
  return text;
}

/* ---------- requests ---------- */
async function handle(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const url = new URL(req.url);

  // Microsoft sends people back here after they sign in
  if (req.method === "GET") {
    if (url.searchParams.get("error")) return back(url.searchParams.get("error") === "access_denied" ? "denied" : "cancelled");
    const code = url.searchParams.get("code"), state = url.searchParams.get("state");
    if (!code || !state) return back("error");
    const { data: st } = await getDb().from("ms_auth_states").select("*").eq("state", state).maybeSingle();
    if (!st || Date.now() - Date.parse(st.created_at) > 30 * 60 * 1000) return back("expired");
    await getDb().from("ms_auth_states").delete().eq("state", state);
    try {
      const tok = await tokenRequest({ grant_type: "authorization_code", code, redirect_uri: REDIRECT });
      const me = await graph(tok.access_token, "/me?$select=displayName,mail,userPrincipalName");
      await getDb().from("outlook_accounts").upsert({
        member: st.member, refresh_token: tok.refresh_token, ms_name: me.displayName ?? null,
        ms_email: me.mail ?? me.userPrincipalName ?? null, connected_at: new Date().toISOString(), last_error: null,
      });
      return back("connected");
    } catch (e) {
      console.error(e);
      return back("error");
    }
  }

  const body = await req.json().catch(() => ({}));
  const member = await memberFrom(req);
  if (!member) return json({ error: "Please sign in again" }, 401);
  const configured = !!(CLIENT_ID && CLIENT_SECRET);

  try {
    switch (body.action) {
      case "overview": {
        const { data: a } = await getDb().from("outlook_accounts").select("ms_name,ms_email,last_pull,last_error,connected_at").eq("member", member.id).maybeSingle();
        return json({ configured, ai: !!AI_KEY, connected: !!a, account: a });
      }
      case "start": {
        if (!configured) return json({ error: "Microsoft details haven’t been added to Supabase yet" }, 400);
        await getDb().from("ms_auth_states").delete().lt("created_at", new Date(Date.now() - 3600_000).toISOString());
        const state = crypto.randomUUID();
        await getDb().from("ms_auth_states").insert({ state, member: member.id });
        const p = new URLSearchParams({ client_id: CLIENT_ID, response_type: "code", redirect_uri: REDIRECT, response_mode: "query", scope: SCOPE, state, prompt: "select_account" });
        return json({ url: `${AUTH}/authorize?${p}` });
      }
      case "disconnect": {
        await getDb().from("outlook_accounts").delete().eq("member", member.id);
        return json({ ok: true });
      }
      case "pull": {
        if (!AI_KEY) return json({ error: "Add your Claude API key (ANTHROPIC_API_KEY) in Supabase first" }, 400);
        const days = Math.min(14, Math.max(1, +body.days || 3));
        const token = await tokenFor(member.id);
        const { data: a } = await getDb().from("outlook_accounts").select("ms_email").eq("member", member.id).maybeSingle();
        const skip = new Set<string>(Array.isArray(body.known) ? body.known : []);
        const mails = (await recentMail(token, days, a?.ms_email || "")).filter((m) => !skip.has(m.id)).slice(0, 60);
        let tasks: Row[] = [];
        if (mails.length) {
          const who = (member.name || "Mike") + " McGaw";
          const todayStr = new Date().toLocaleDateString("en-GB", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" });
          const answer = await askClaude(triagePrompt(mails, who, todayStr));
          let parsed: Row;
          try { parsed = extractJson(answer); } catch (e) { console.error("Unreadable answer:", answer.slice(0, 1500)); throw e; }
          tasks = shapeTasks(parsed, mails);
        }
        await getDb().from("outlook_accounts").update({ last_pull: new Date().toISOString(), last_error: null }).eq("member", member.id);
        return json({ read: mails.length, days, tasks });
      }
    }
    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message || "Something went wrong" }, 500);
  }
}
export { handle, setTestDb };
function setTestDb(x: Row) { db = x; }

if (!Deno.env.get("OUTLOOK_TEST")) Deno.serve(handle);

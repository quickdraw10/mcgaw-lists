// McGaw Lists — Microsoft To Do sync.
// Deploy as an Edge Function named "todo" with JWT verification turned OFF
// (Microsoft's sign-in redirect can't send a Supabase token; every action
// below checks the person's login itself).
//
// Secrets: MS_CLIENT_ID, MS_CLIENT_SECRET, CRON_SECRET (APP_URL optional)
import { createClient } from "npm:@supabase/supabase-js@2";

const env = (k: string) => Deno.env.get(k) ?? "";
const SB_URL = env("SUPABASE_URL");
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
const db = createClient(SB_URL, serviceKey(), { auth: { persistSession: false } });
const CLIENT_ID = env("MS_CLIENT_ID");
const CLIENT_SECRET = env("MS_CLIENT_SECRET");
const REDIRECT = `${SB_URL}/functions/v1/todo`;
const APP_URL = env("APP_URL") || "https://quickdraw10.github.io/mcgaw-lists/";
const AUTH = "https://login.microsoftonline.com/consumers/oauth2/v2.0";
const SCOPE = "offline_access Tasks.ReadWrite User.Read";
const TZ = "Europe/London";
const COLOURS: Record<string, string> = { todo: "#0A84FF", work: "#5E5CE6", shopping: "#30B05A", packing: "#FF9500", christmas: "#E0352B" };
const HAS_STEPS = new Set(["todo", "work", "packing", "christmas"]);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const back = (q: string) => new Response(null, { status: 302, headers: { Location: `${APP_URL}?todo=${q}#/family` } });

// ---------- small helpers ----------
type Row = Record<string, any>;
const clean = (s: unknown) => (s ?? "").toString().trim();
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function stripHtml(h: string) {
  return h.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|li)>/gi, "\n").replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\n{3,}/g, "\n\n").trim();
}
const msNotes = (t: Row) => (t.body?.content ? (t.body.contentType === "html" ? stripHtml(t.body.content) : clean(t.body.content)) : "");
const msDue = (t: Row) => (t.dueDateTime?.dateTime ? String(t.dueDateTime.dateTime).slice(0, 10) : null);
const stripTag = (title: string, tag: string | null) => clean(tag ? (title || "").replace(new RegExp(`\\s*#${escapeRe(tag)}\\b`, "ig"), "") : title);
const cmp = (a: unknown[], b: unknown[]) => JSON.stringify(a).localeCompare(JSON.stringify(b));
const appTitle = (i: Row) => (i.quantity ? `${i.quantity} ${i.text}` : i.text);

const AISLES: Record<string, string> = {
  "Fruit & veg": "apple banana orange lemon lime grape berr strawberr raspberr blueberr melon pear peach plum kiwi mango pineapple avocado tomato potato onion garlic carrot broccoli cauli pepper cucumber lettuce salad spinach kale courgette mushroom leek celery herb coriander parsley basil ginger chilli sweetcorn pea bean sprout veg fruit",
  "Bakery": "bread loaf roll bagel croissant wrap tortilla pitta naan muffin crumpet cake bun brioche",
  "Meat & fish": "chicken beef mince pork lamb bacon sausage ham turkey steak fish salmon cod tuna prawn haddock",
  "Dairy & eggs": "milk butter cheese cheddar yog yoghurt yogurt cream egg creme mozzarella parmesan feta halloumi",
  "Chilled": "hummus houmous dip pesto coleslaw pizza fresh_pasta quiche",
  "Frozen": "frozen ice_cream ice_lolly chips fish_fingers waffle",
  "Food cupboard": "pasta rice flour sugar oil vinegar sauce ketchup mayo mustard stock cereal oats porridge tin tinned beans soup spice salt honey jam peanut nutella noodle lentil chickpea tomatoes coffee tea",
  "Drinks": "juice water squash cola lemonade wine beer lager gin prosecco tonic",
  "Snacks": "crisp biscuit chocolate sweets popcorn nuts bar",
  "Household": "kitchen_roll toilet_roll loo bin_bag washing_up detergent fabric softener dishwasher tablet foil cling bleach sponge battery light_bulb",
  "Toiletries": "shampoo conditioner soap shower_gel toothpaste toothbrush deodorant razor plaster paracetamol ibuprofen tissues cotton sun_cream suncream",
};
const AISLE_PAIRS = Object.entries(AISLES).flatMap(([a, ws]) => ws.split(" ").map((w) => [a, w.replace(/_/g, " ")])).sort((x, y) => y[1].length - x[1].length);
function guessAisle(text: string) {
  const t = " " + text.toLowerCase() + " ";
  for (const [a, w] of AISLE_PAIRS) if (t.includes(" " + w)) return a;
  return "Other";
}
function parseQty(s: string) {
  const m = s.match(/^(\d+(?:\.\d+)?\s*(?:x|kg|g|ml|l|ltr|pk|packs?|tins?|bottles?|bags?|boxes?)?)\s+(.+)$/i);
  return m ? { qty: m[1].replace(/\s+/g, ""), text: m[2].charAt(0).toUpperCase() + m[2].slice(1) } : { qty: "", text: s };
}

// One shape for both sides, so we can tell what changed
function normMS(t: Row, tag: string | null, type: string) {
  return JSON.stringify({
    x: stripTag(t.title, tag).toLowerCase(), d: t.status === "completed", p: t.importance === "high", due: msDue(t), n: msNotes(t),
    c: HAS_STEPS.has(type) ? (t.checklistItems || []).map((c: Row) => [clean(c.displayName).toLowerCase(), !!c.isChecked]).sort(cmp) : [],
  });
}
function normApp(i: Row, kids: Row[], type: string) {
  return JSON.stringify({
    x: clean(appTitle(i)).toLowerCase(), d: !!i.done, p: !!i.priority, due: i.due || null, n: clean(i.notes),
    c: HAS_STEPS.has(type) ? kids.map((k) => [clean(k.text).toLowerCase(), !!k.done]).sort(cmp) : [],
  });
}

// ---------- Microsoft ----------
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
  const { data: a } = await db.from("ms_accounts").select("*").eq("member", member).maybeSingle();
  if (!a) throw new Error("Microsoft To Do isn’t connected");
  try {
    const j = await tokenRequest({ grant_type: "refresh_token", refresh_token: a.refresh_token, redirect_uri: REDIRECT });
    if (j.refresh_token) await db.from("ms_accounts").update({ refresh_token: j.refresh_token }).eq("member", member);
    return j.access_token as string;
  } catch {
    await db.from("ms_accounts").update({ last_error: "Microsoft sign-in has expired — tap Reconnect" }).eq("member", member);
    throw new Error("Microsoft sign-in has expired — tap Reconnect");
  }
}
async function g(token: string, path: string, init: RequestInit = {}): Promise<Row> {
  const url = path.startsWith("http") ? path : `https://graph.microsoft.com/v1.0${path}`;
  for (let attempt = 0; ; attempt++) {
    const r = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: `outlook.timezone="${TZ}"` } });
    if (r.status === 429 && attempt < 3) { await new Promise((res) => setTimeout(res, 1500 * (attempt + 1))); continue; }
    if (r.status === 204) return {};
    if (r.status === 404) return { __notFound: true };
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(`Microsoft error ${r.status}: ${j?.error?.message ?? ""}`);
    return j;
  }
}
async function gAll(token: string, path: string) {
  const out: Row[] = [];
  for (let next: string | undefined = path; next;) {
    const j = await g(token, next);
    if (j.__notFound) throw Object.assign(new Error("not found"), { notFound: true });
    out.push(...(j.value || []));
    next = j["@odata.nextLink"];
  }
  return out;
}
const msFields = (i: Row, title: string) => ({
  title,
  status: i.done ? "completed" : "notStarted",
  importance: i.priority ? "high" : "normal",
  dueDateTime: i.due ? { dateTime: `${i.due}T00:00:00`, timeZone: TZ } : null,
  body: { content: i.notes || "", contentType: "text" },
});

// ---------- people & lists ----------
async function memberFrom(req: Request) {
  const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  if (!jwt) return null;
  const { data, error } = await db.auth.getUser(jwt);
  if (error || !data.user?.email) return null;
  const { data: ms } = await db.from("members").select("id,email");
  return ms?.find((m) => m.email.toLowerCase() === data.user!.email!.toLowerCase())?.id ?? null;
}
async function canSee(member: string, listId: string) {
  const { data: l } = await db.from("lists").select("owner").eq("id", listId).maybeSingle();
  if (!l) return false;
  if (l.owner === member) return true;
  const { data: a } = await db.from("list_access").select("member").eq("list_id", listId).eq("member", member).maybeSingle();
  return !!a;
}
async function targetList(member: string, body: Row) {
  if (body.listId && body.listId !== "new") {
    if (!(await canSee(member, body.listId))) throw new Error("You can’t add to that list");
    const { data } = await db.from("lists").select("*").eq("id", body.listId).single();
    return data;
  }
  const type = COLOURS[body.newType] ? body.newType : "todo";
  const row = { id: crypto.randomUUID(), type, title: clean(body.newTitle) || "To Do", colour: COLOURS[type], owner: member, settings: {} };
  const { error } = await db.from("lists").insert(row);
  if (error) throw error;
  return row;
}

// ---------- building items ----------
function itemFromMS(t: Row, list: Row, member: string, tag: string | null, pos: number) {
  const title = stripTag(t.title, tag) || "Untitled";
  let text = title, quantity: string | null = null, category: string | null = null;
  if (list.type === "shopping") { const p = parseQty(title); text = p.text; quantity = p.qty || null; category = guessAisle(p.text); }
  const done = t.status === "completed";
  return {
    id: crypto.randomUUID(), list_id: list.id, parent_id: null, text, notes: msNotes(t) || null,
    done, done_by: done ? member : null, done_at: done ? new Date().toISOString() : null,
    assignees: [], due: msDue(t), priority: t.importance === "high" ? 1 : 0,
    status: list.type === "work" ? (done ? "done" : "todo") : null, category, quantity, hidden_from: [],
    data: list.type === "packing" ? { bag: "shared" } : list.type === "christmas" ? { status: done ? "wrapped" : "idea" } : {},
    position: pos, created_by: member,
  };
}
const kidRow = (parent: Row, c: Row, member: string, pos: number) => ({
  id: crypto.randomUUID(), list_id: parent.list_id, parent_id: parent.id, text: clean(c.displayName) || "Step",
  done: !!c.isChecked, done_by: c.isChecked ? member : null, assignees: [], hidden_from: [], data: {}, position: pos, created_by: member,
});

// Microsoft → app: make the item (and its sub-tasks) match the To Do task
async function pull(t: Row, item: Row, kids: Row[], children: Row, list: Row, member: string, tag: string | null, isNew: boolean) {
  if (!isNew) {
    const title = stripTag(t.title, tag) || item.text;
    const done = t.status === "completed";
    const patch: Row = { notes: msNotes(t) || null, due: msDue(t), priority: t.importance === "high" ? 1 : 0, done };
    if (list.type === "shopping") { const p = parseQty(title); patch.text = p.text; patch.quantity = p.qty || null; } else patch.text = title;
    if (done !== !!item.done) { patch.done_by = done ? member : null; patch.done_at = done ? new Date().toISOString() : null; }
    if (list.type === "work") patch.status = done ? "done" : (item.status === "done" ? "todo" : item.status || "todo");
    if (list.type === "christmas") patch.data = { ...(item.data || {}), status: done ? "wrapped" : (item.data?.status === "wrapped" ? "bought" : item.data?.status || "idea") };
    await db.from("items").update(patch).eq("id", item.id);
  }
  if (!HAS_STEPS.has(list.type)) return children;
  const map = { ...children };
  const checklist: Row[] = t.checklistItems || [];
  let pos = Date.now() / 1000;
  for (const c of checklist) {
    const kid = kids.find((k) => k.id === map[c.id]);
    if (kid) {
      if (clean(kid.text) !== clean(c.displayName) || !!kid.done !== !!c.isChecked) {
        await db.from("items").update({ text: clean(c.displayName), done: !!c.isChecked, done_by: c.isChecked ? member : null }).eq("id", kid.id);
      }
    } else {
      const nk = kidRow(item, c, member, (pos += 0.001));
      await db.from("items").insert(nk);
      map[c.id] = nk.id;
    }
  }
  for (const [cid, kidId] of Object.entries(map)) {
    if (!checklist.some((c) => c.id === cid)) { await db.from("items").delete().eq("id", kidId); delete map[cid]; }
  }
  return map;
}

// app → Microsoft: make the To Do task match the item
async function push(token: string, tl: string, t: Row, item: Row, kids: Row[], children: Row, list: Row, tag: string | null) {
  const base = `/me/todo/lists/${tl}/tasks/${t.id}`;
  await g(token, base, { method: "PATCH", body: JSON.stringify(msFields(item, appTitle(item) + (tag ? ` #${tag}` : ""))) });
  if (!HAS_STEPS.has(list.type)) return children;
  const map = { ...children };
  const checklist: Row[] = t.checklistItems || [];
  const byKid = Object.fromEntries(Object.entries(map).map(([c, k]) => [k, c]));
  for (const kid of kids) {
    const cid = byKid[kid.id];
    const c = cid && checklist.find((x) => x.id === cid);
    if (c) {
      if (clean(c.displayName) !== clean(kid.text) || !!c.isChecked !== !!kid.done) {
        await g(token, `${base}/checklistItems/${cid}`, { method: "PATCH", body: JSON.stringify({ displayName: kid.text, isChecked: !!kid.done }) });
      }
    } else {
      const made = await g(token, `${base}/checklistItems`, { method: "POST", body: JSON.stringify({ displayName: kid.text, isChecked: !!kid.done }) });
      if (made.id) map[made.id] = kid.id;
      if (cid) delete map[cid];
    }
  }
  for (const [cid, kidId] of Object.entries(map)) {
    if (!kids.some((k) => k.id === kidId)) {
      if (checklist.some((c) => c.id === cid)) await g(token, `${base}/checklistItems/${cid}`, { method: "DELETE" });
      delete map[cid];
    }
  }
  return map;
}

// ---------- the sync ----------
async function syncMember(member: string) {
  const token = await tokenFor(member);
  const { data: links } = await db.from("todo_links").select("*").eq("member", member);
  let changes = 0;
  if (links?.length) {
    const { data: mapsData } = await db.from("todo_map").select("*").eq("member", member);
    const maps: Row[] = mapsData || [];
    const listIds = [...new Set(links.map((l) => l.list_id))];
    const { data: lists } = await db.from("lists").select("*").in("id", listIds);
    const { data: itemsData } = await db.from("items").select("*").in("list_id", listIds);
    const items: Row[] = itemsData || [];
    const byId = new Map(items.map((i) => [i.id, i]));
    const kidsOf = (id: string) => items.filter((i) => i.parent_id === id).sort((a, b) => a.position - b.position);
    const cache = new Map<string, Row[]>();
    const tasksOf = async (tl: string) => {
      if (!cache.has(tl)) cache.set(tl, await gAll(token, `/me/todo/lists/${tl}/tasks?$expand=checklistItems&$top=100`));
      return cache.get(tl)!;
    };
    let allLists: Row[] | null = null;
    let pos = Date.now() / 1000;

    for (const link of links) {
      const list = lists?.find((l) => l.id === link.list_id);
      if (!list) continue;
      const tag: string | null = link.kind === "tag" ? link.tag : null;
      let found: { t: Row; tl: string }[] = [];
      try {
        if (link.kind === "list") found = (await tasksOf(link.todo_list_id)).map((t) => ({ t, tl: link.todo_list_id }));
        else if (link.kind === "task") {
          const t = await g(token, `/me/todo/lists/${link.todo_list_id}/tasks/${link.todo_task_id}?$expand=checklistItems`);
          found = t.__notFound ? [] : [{ t, tl: link.todo_list_id }];
        } else {
          if (!allLists) allLists = (await gAll(token, "/me/todo/lists")).filter((L) => L.wellknownListName !== "flaggedEmails");
          const re = new RegExp(`(^|\\s)#${escapeRe(tag!)}\\b`, "i");
          for (const L of allLists) for (const t of await tasksOf(L.id)) if (re.test(t.title || "")) found.push({ t, tl: L.id });
        }
      } catch (e) {
        if ((e as Row).notFound) { await db.from("todo_links").delete().eq("id", link.id); changes++; continue; }
        throw e;
      }

      const mine = () => maps.filter((m) => m.link_id === link.id);
      const seen = new Set<string>();
      for (const { t, tl } of found) {
        seen.add(t.id);
        const m = mine().find((x) => x.todo_task_id === t.id);
        if (!m) {
          if (t.status === "completed") continue;
          const mapped = new Set(maps.map((x) => x.item_id));
          const title = stripTag(t.title, tag).toLowerCase();
          let item = items.find((i) => i.list_id === list.id && !i.parent_id && !i.done && !mapped.has(i.id) && clean(appTitle(i)).toLowerCase() === title);
          const isNew = !item;
          if (!item) {
            item = itemFromMS(t, list, member, tag, (pos += 0.01));
            const { error } = await db.from("items").insert(item);
            if (error) throw error;
            items.push(item); byId.set(item.id, item);
          }
          const children = await pull(t, item, [], {}, list, member, tag, isNew);
          const row = { member, link_id: link.id, item_id: item.id, todo_list_id: tl, todo_task_id: t.id, children, sig: normMS(t, tag, list.type) };
          const { data: ins } = await db.from("todo_map").insert(row).select().single();
          maps.push(ins || row);
          changes++;
          continue;
        }
        if (!m.item_id) continue; // removed in the app on an import-only link
        const item = byId.get(m.item_id);
        if (!item) {
          if (link.two_way) { await g(token, `/me/todo/lists/${tl}/tasks/${t.id}`, { method: "DELETE" }); await db.from("todo_map").delete().eq("id", m.id); }
          else await db.from("todo_map").update({ item_id: null }).eq("id", m.id);
          changes++;
          continue;
        }
        const kids = kidsOf(item.id);
        const msN = normMS(t, tag, list.type), appN = normApp(item, kids, list.type);
        if (msN === appN) { if (m.sig !== msN) await db.from("todo_map").update({ sig: msN }).eq("id", m.id); continue; }
        const msChanged = msN !== m.sig, appChanged = appN !== m.sig;
        const appTime = Math.max(...[item, ...kids].map((i) => Date.parse(i.updated_at || i.created_at || 0)));
        const msTime = Date.parse(t.lastModifiedDateTime || 0);
        let children = m.children || {}, sig = m.sig;
        if (msChanged && (!appChanged || !link.two_way || msTime >= appTime)) {
          children = await pull(t, item, kids, children, list, member, tag, false);
          sig = msN;
        } else if (appChanged && link.two_way) {
          children = await push(token, tl, t, item, kids, children, list, tag);
          const fresh = await g(token, `/me/todo/lists/${tl}/tasks/${t.id}?$expand=checklistItems`);
          sig = fresh.__notFound ? appN : normMS(fresh, tag, list.type);
        } else continue;
        await db.from("todo_map").update({ children, sig }).eq("id", m.id);
        changes++;
      }

      // Tasks that have gone from To Do (or lost their #tag)
      for (const m of mine()) {
        if (seen.has(m.todo_task_id)) continue;
        if (link.kind !== "tag" && link.two_way && m.item_id && byId.get(m.item_id)) await db.from("items").delete().eq("id", m.item_id);
        await db.from("todo_map").delete().eq("id", m.id);
        changes++;
      }
      if (link.kind === "task" && !found.length) await db.from("todo_links").delete().eq("id", link.id);

      // New things added in the app go to To Do (two-way list links)
      if (link.kind === "list" && link.two_way) {
        const mapped = new Set(maps.map((x) => x.item_id));
        const fresh = items.filter((i) => i.list_id === list.id && !i.parent_id && !i.done && !mapped.has(i.id) && Date.parse(i.created_at) > Date.parse(link.created_at));
        for (const item of fresh) {
          const made = await g(token, `/me/todo/lists/${link.todo_list_id}/tasks`, { method: "POST", body: JSON.stringify(msFields(item, appTitle(item))) });
          if (!made.id) continue;
          const kids = kidsOf(item.id);
          const children = await push(token, link.todo_list_id, { ...made, checklistItems: [] }, item, kids, {}, list, null);
          const sig = normApp(item, kids, list.type);
          const row = { member, link_id: link.id, item_id: item.id, todo_list_id: link.todo_list_id, todo_task_id: made.id, children, sig };
          await db.from("todo_map").insert(row);
          maps.push(row);
          changes++;
        }
      }
    }
  }
  await db.from("ms_accounts").update({ last_sync: new Date().toISOString(), last_error: null }).eq("member", member);
  return changes;
}

// ---------- requests ----------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const url = new URL(req.url);

  // Microsoft sends people back here after they sign in
  if (req.method === "GET") {
    if (url.searchParams.get("error")) return back("cancelled");
    const code = url.searchParams.get("code"), state = url.searchParams.get("state");
    if (!code || !state) return back("error");
    const { data: st } = await db.from("ms_auth_states").select("*").eq("state", state).maybeSingle();
    if (!st || Date.now() - Date.parse(st.created_at) > 30 * 60 * 1000) return back("expired");
    await db.from("ms_auth_states").delete().eq("state", state);
    try {
      const tok = await tokenRequest({ grant_type: "authorization_code", code, redirect_uri: REDIRECT });
      const me = await g(tok.access_token, "/me");
      await db.from("ms_accounts").upsert({
        member: st.member, refresh_token: tok.refresh_token, ms_name: me.displayName ?? null,
        ms_email: me.userPrincipalName ?? me.mail ?? null, connected_at: new Date().toISOString(), last_error: null,
      });
      return back("connected");
    } catch (e) {
      console.error(e);
      return back("error");
    }
  }

  const body = await req.json().catch(() => ({}));

  // Background sync every few minutes
  if (body.action === "cron") {
    if (!env("CRON_SECRET") || req.headers.get("x-cron-secret") !== env("CRON_SECRET")) return json({ error: "Not allowed" }, 401);
    const { data: accts } = await db.from("ms_accounts").select("member");
    const result: Row = {};
    for (const a of accts || []) {
      try { result[a.member] = await syncMember(a.member); }
      catch (e) { result[a.member] = String((e as Error).message); await db.from("ms_accounts").update({ last_error: String((e as Error).message).slice(0, 200) }).eq("member", a.member); }
    }
    return json(result);
  }

  const member = await memberFrom(req);
  if (!member) return json({ error: "Please sign in again" }, 401);
  const configured = !!(CLIENT_ID && CLIENT_SECRET);

  try {
    switch (body.action) {
      case "overview": {
        const { data: a } = await db.from("ms_accounts").select("ms_name,ms_email,last_sync,last_error,connected_at").eq("member", member).maybeSingle();
        const { data: links } = await db.from("todo_links").select("id,kind,todo_list_name,tag,list_id,two_way,created_at").eq("member", member).order("created_at");
        return json({ configured, connected: !!a, account: a, links: links || [] });
      }
      case "start": {
        if (!configured) return json({ error: "Microsoft details haven’t been added to Supabase yet" }, 400);
        await db.from("ms_auth_states").delete().lt("created_at", new Date(Date.now() - 3600_000).toISOString());
        const state = crypto.randomUUID();
        await db.from("ms_auth_states").insert({ state, member });
        const p = new URLSearchParams({ client_id: CLIENT_ID, response_type: "code", redirect_uri: REDIRECT, response_mode: "query", scope: SCOPE, state, prompt: "select_account" });
        return json({ url: `${AUTH}/authorize?${p}` });
      }
      case "disconnect": {
        await db.from("todo_links").delete().eq("member", member);
        await db.from("ms_accounts").delete().eq("member", member);
        return json({ ok: true });
      }
      case "lists": {
        const token = await tokenFor(member);
        const lists = (await gAll(token, "/me/todo/lists")).filter((L) => L.wellknownListName !== "flaggedEmails");
        return json({ lists: lists.map((L) => ({ id: L.id, name: L.displayName, main: L.wellknownListName === "defaultList" })) });
      }
      case "tasks": {
        const token = await tokenFor(member);
        const tasks = await gAll(token, `/me/todo/lists/${body.todoListId}/tasks?$top=100`);
        return json({ tasks: tasks.filter((t) => t.status !== "completed").map((t) => ({ id: t.id, title: t.title, due: msDue(t), important: t.importance === "high" })) });
      }
      case "link": { // whole list, kept in sync
        const list = await targetList(member, body);
        const { error } = await db.from("todo_links").insert({ member, kind: "list", todo_list_id: body.todoListId, todo_list_name: body.todoListName, list_id: list.id, two_way: !!body.twoWay });
        if (error) throw error;
        const changes = await syncMember(member);
        return json({ listId: list.id, changes });
      }
      case "tag": {
        const tag = clean(body.tag).replace(/^#/, "").replace(/\s+/g, "");
        if (!tag) return json({ error: "Type a tag, e.g. family" }, 400);
        const list = await targetList(member, body);
        const { error } = await db.from("todo_links").insert({ member, kind: "tag", tag, list_id: list.id, two_way: !!body.twoWay });
        if (error) throw error;
        const changes = await syncMember(member);
        return json({ listId: list.id, changes });
      }
      case "import": { // chosen tasks, optionally kept linked
        const token = await tokenFor(member);
        const list = await targetList(member, body);
        const ids: string[] = body.taskIds || [];
        if (body.keepLinked) {
          const rows = ids.map((id) => ({ member, kind: "task", todo_list_id: body.todoListId, todo_list_name: body.todoListName, todo_task_id: id, list_id: list.id, two_way: true }));
          if (rows.length) { const { error } = await db.from("todo_links").insert(rows); if (error) throw error; }
          const changes = await syncMember(member);
          return json({ listId: list.id, changes });
        }
        const all = await gAll(token, `/me/todo/lists/${body.todoListId}/tasks?$expand=checklistItems&$top=100`);
        const { data: existing } = await db.from("items").select("text,quantity").eq("list_id", list.id).is("parent_id", null);
        const have = new Set((existing || []).map((i) => clean(appTitle(i)).toLowerCase()));
        let pos = Date.now() / 1000, count = 0;
        for (const t of all.filter((x) => ids.includes(x.id))) {
          if (have.has(clean(t.title).toLowerCase())) continue;
          const item = itemFromMS(t, list, member, null, (pos += 0.01));
          await db.from("items").insert(item);
          await pull(t, item, [], {}, list, member, null, true);
          count++;
        }
        return json({ listId: list.id, changes: count });
      }
      case "unlink": {
        await db.from("todo_links").delete().eq("id", body.linkId).eq("member", member);
        return json({ ok: true });
      }
      case "sync": {
        const changes = await syncMember(member);
        return json({ changes });
      }
    }
    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: (e as Error).message || "Something went wrong" }, 500);
  }
});

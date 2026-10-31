// McGaw Lists — sends an iPhone notification whenever a row is added to
// the `notifications` table. Called by a Supabase Database Webhook.
//
// Secrets to set in Supabase → Edge Functions → Secrets:
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_CONTACT (your email)
//   PUSH_SECRET (optional — if set, the webhook must send header x-push-secret)
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const secret = Deno.env.get("PUSH_SECRET");
  if (secret && req.headers.get("x-push-secret") !== secret) {
    return new Response("Unauthorised", { status: 401 });
  }

  const payload = await req.json().catch(() => null);
  const n = payload?.record;
  if (!n?.member) return new Response("No record", { status: 200 });

  webpush.setVapidDetails(
    "mailto:" + (Deno.env.get("VAPID_CONTACT") ?? "family@example.com"),
    Deno.env.get("VAPID_PUBLIC_KEY")!,
    Deno.env.get("VAPID_PRIVATE_KEY")!,
  );

  let key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!key) {
    try { const j = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}"); key = j.default ?? Object.values(j)[0] ?? ""; } catch { /* none */ }
  }
  const db = createClient(Deno.env.get("SUPABASE_URL")!, key);

  const { data: subs } = await db
    .from("push_subscriptions")
    .select("*")
    .eq("member", n.member);

  const { count } = await db
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("member", n.member)
    .eq("read", false);

  const message = JSON.stringify({
    title: "McGaw Lists",
    body: n.body,
    url: n.list_id ? `#/list/${n.list_id}` : "#/activity",
    badge: count ?? 1,
  });

  let sent = 0;
  for (const s of subs ?? []) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        message,
      );
      sent++;
    } catch (err) {
      const code = (err as { statusCode?: number }).statusCode;
      if (code === 404 || code === 410) {
        await db.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
      }
    }
  }
  return new Response(JSON.stringify({ sent }), {
    headers: { "Content-Type": "application/json" },
  });
});

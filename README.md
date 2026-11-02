# McGaw Lists

A private lists app for Mike, Louise, Esme and Oscar. It runs in Safari and installs on each iPhone's Home Screen like a normal app — no App Store or Apple Developer account needed.

Same building blocks as Vouch: **GitHub Pages** hosts the app, **Supabase** stores the lists, handles logins and sends notifications. Both free.

---

## What's in it

| List type | How it works |
|---|---|
| **Shopping** | Type “2 milk” or “500g mince” — it works out the quantity and sorts by aisle. Tick into “In the trolley”, then Clear. |
| **To do** | Overdue / Today / Coming up / Any time. Due dates, “Important” flag, sub-tasks, assign to 1, 2 or everyone. “Just mine” filter. |
| **Work** | To do → Doing → Done tabs, priority first. Sub-tasks and due dates. |
| **Christmas** | Gifts grouped by who they're for, with price, link and Idea → Bought → Wrapped. Total planned and spent. **Keep secret from** hides a gift from someone even on a shared list (done automatically when you add a gift for someone on the list). |
| **Travel packing** | A bag per person plus a Shared bag, progress bars, one-tap “essentials” starter list, “Unpack everything” to reuse next trip. |
| **Meal planner** | Dinner each night by default (breakfast and lunch can be shown with one tap at the bottom, or in list options), who's cooking, and tap each face for **home → out → late → not sure** with a head-count. Ingredients go straight to a shopping list. |
| **Notice board** | Coloured notes, pin to top, “show until” date, and “seen by” ticks. |

**Sharing:** whoever makes a list owns it and is the only one who decides who sees it. For each person: *Hidden*, *Can see* (add, tick, edit) or *Admin* (also rename, change settings, clear anyone's items). There's an “Everyone admin” button. People are notified when they're added, made admin, or assigned a task.

**Other screens:** My tasks (everything assigned to you across all lists), Activity (notifications), Family (notifications switch, install help, sign out).

---

## Try it now (demo mode)

With `config.js` left empty, the app runs in demo mode: pick who you are, and everything is stored on that one device only. Good for seeing how it feels before setting anything up.

---

## Set it up for the family (about 30 minutes, once)

### 1. Supabase project
1. Go to **supabase.com** → **New project**. Name it `mcgaw-lists`, region **London**, make a strong database password (save it somewhere).
2. When it's ready, open **SQL Editor** → **New query**.
3. Paste in everything from `supabase/schema.sql`. **Change the four example emails** near the top to your real ones. Click **Run**. You should see “Success”.

### 2. Make the four logins
1. **Authentication → Sign In / Providers → Email**: turn **off** “Allow new users to sign up” (so nobody else can join) and turn **off** “Confirm email”.
2. **Authentication → Users → Add user → Create new user** — do this four times, with the same emails you put in the SQL and a password for each.
3. **Authentication → URL Configuration**: set **Site URL** to your app address from step 4 (e.g. `https://quickdraw10.github.io/mcgaw-lists/`) so “Forgotten password” emails link back to the app.

### 3. Connect the app
1. **Project Settings → API** (or **Data API**). Copy the **Project URL** and the **anon / publishable key**.
2. Open `config.js` and paste them in:
   ```js
   supabaseUrl: 'https://xxxx.supabase.co',
   supabaseAnonKey: 'eyJ...',
   ```
   The anon key is safe to be public — the database rules only show each person the lists they're on.

### 4. Put it online with GitHub Pages
1. On GitHub, **New repository** → name `mcgaw-lists` → Public → Create.
2. **Add file → Upload files** → drag in everything from this folder **except `push-keys.txt`** → Commit.
3. **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main` / root → Save. After a minute your address appears, e.g. `https://quickdraw10.github.io/mcgaw-lists/`.

### 5. Install on each iPhone
1. Open the address in **Safari** → Share → **Add to Home Screen** → Add.
2. Open **Lists** from the Home Screen and sign in.
3. **Family → Notifications** → Allow.

### 6. Turn on iPhone notifications (Supabase side)
Notifications already appear inside the app (Activity tab, badge and a pop-up). This step makes them arrive on the lock screen too.
1. **Edge Functions → Deploy a new function → Via editor**. Name it `send-push`, paste in `supabase/functions/send-push/index.ts`, Deploy.
2. **Edge Functions → Secrets** → add:
   - `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` — from `push-keys.txt`
   - `VAPID_CONTACT` — your email
3. **Database → Webhooks → Create a new hook**: name `push`, table `notifications`, events **Insert**, type **Supabase Edge Functions**, function `send-push`. Create.
4. Test: from your phone add Louise to a list — her iPhone should buzz within a few seconds.

If the webhook shows a 401 error: open the function's settings, turn off **Enforce JWT verification**, add a secret `PUSH_SECRET` with any random word, and add an HTTP header `x-push-secret` with the same word to the webhook.

---

## Good to know
- **Updates:** upload changed files to GitHub; phones pick them up next time the app opens.
- **Free tier:** Supabase pauses a free project after a week with no use at all. Daily family use keeps it awake; if it ever pauses, click *Restore* in the dashboard.
- **Adding/changing someone:** edit the `members` table in Supabase (Table Editor) and add their login under Authentication → Users.
- **Meal planner ↔ shopping:** each meal has an ingredients box and an “Add ingredients to shopping” button. Deeper linking (recipes, auto-building the week's shop) can come later.

## Files
- `index.html`, `styles.css`, `app.js` — the app
- `config.js` — your Supabase details
- `sw.js`, `manifest.webmanifest`, `icons/` — Home Screen install, offline, notifications
- `supabase/schema.sql` — database, sharing rules, notification triggers
- `supabase/functions/send-push/index.ts` — sends iPhone notifications
- `push-keys.txt` — private notification keys (**don't upload**)


## November 2026 update
Run `supabase/update-nov-2026.sql` once in Supabase → SQL Editor, then redeploy the `todo` Edge Function with the new code.

- **Christmas privacy:** bought / wrapped, who's buying and private notes live in a separate table the gift's recipient can't read. Their own wishes stay visible to them.
- **Priorities:** Standard, Urgent, Important, Urgent & important (shown in that order of importance, top to bottom: U&I, Urgent, Important, then everything else).
- **Travel packing:** item counts (“underwear x8”), departure countdowns (as many as you like).
- **Press and hold** any item to move it.
- **Countdowns:** stand-alone or linked to any list; days, hours, minutes and months.
- **Budget:** Mike & Louise only (enforced by the database). Accounts, money in/out, savings, transfers, untick to see the difference, savings pots, monthly log.

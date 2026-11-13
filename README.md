# McGaw Lists

A private lists app for Mike, Louise, Esme and Oscar. It runs in Safari and installs on each iPhone's Home Screen like a normal app — no App Store or Apple Developer account needed.

Same building blocks as Vouch: **GitHub Pages** hosts the app, **Supabase** stores the lists, handles logins and sends notifications. Both free.

---

## What's in it

| List type | How it works |
|---|---|
| **Shopping** | Type “2 milk” or “500g mince” — it works out the quantity and sorts by aisle. Tick into “In the trolley”, then Clear. Cleared items are remembered: they’re suggested as you type and listed under “Used before” (most-bought first) — tap to put one back. |
| **To do** | Overdue / Today / Coming up / Any time. Due dates, “Important” flag, sub-tasks, assign to 1, 2 or everyone. “Just mine” filter. |
| **Work** | A calendar: priority rows (Urgent & important, Urgent, Important, everything else) across day columns — Today, 3 days or Week — plus a Later column (after that, or no date). Overdue tasks sit in Today. Press and hold a task to drag it to another day or priority. Quick dates when adding: Today, Tomorrow, This week (the coming Friday). A List view is still there. |
| **Gift list** | For Christmas, birthdays, weddings, christenings. Gifts grouped by who they're for, with price, link and Idea → Bought → Wrapped. Total planned and spent. **Keep secret from** hides a gift from someone even on a shared list (done automatically when you add a gift for someone on the list). |
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

- **Gift list privacy:** bought / wrapped, who's buying and private notes live in a separate table the gift's recipient can't read. Their own wishes stay visible to them.
- **Priorities:** Standard, Urgent, Important, Urgent & important (shown in that order of importance, top to bottom: U&I, Urgent, Important, then everything else).
- **Travel packing:** item counts (“underwear x8”), departure countdowns (as many as you like).
- **Press and hold** any item to move it.
- **Countdowns:** stand-alone or linked to any list; days, hours, minutes and months.
- **Budget:** Mike & Louise only (enforced by the database). Accounts, money in/out, savings, transfers, untick to see the difference, savings pots, monthly log.

- **Budget — regular payments:** set up once (every week / 2 weeks / 4 weeks / month / year, on a weekday or day of the month, ongoing or until a date) and they fill every month. Change one month only, or change from a month onwards — earlier months keep their figures.
- **Work lists on the home screen** show how many urgent/important tasks are overdue, due today, tomorrow and later this week.
- **Statement import:** Budget → Import a statement. Reads CSV (HSBC, Barclays, Lloyds/Halifax, Atom, Amex and most others), OFX, QIF and Santander text files on the phone; saves date, description and amount only. Matches transactions to regular payments (✓ Paid / Paid £x / Not seen), shows actual in/out and anything not in the budget, and spots payments that look regular.


## Alexa & Echo Show
Say **“Alexa, ask family lists…”** then: *add milk and bread*, *what's on the shopping list*, *tick off eggs*, *what's for dinner tomorrow*, *we're having lasagne on Friday*, *I'm out for dinner Thursday*, *what have I got to do*, *how long until Center Parcs*, *what's on today*. On an Echo Show the list, the week's dinners, your tasks, a live countdown or a "today" dashboard appear on screen — tap an item to tick it.

- **Who's speaking:** each person sets up Voice ID in the Alexa app (with *Personalise skills* on), then in the app goes to **Family → Alexa → Link my voice** and says the 4-digit code. Unknown voices only get lists the whole family shares.
- **Never available by voice:** gift lists and the budget.

**Setup (once):**
1. Run `supabase/alexa.sql` in Supabase → SQL Editor.
2. Edge Functions → Deploy a new function → Via editor → name `alexa`, paste `supabase/functions/alexa/index.ts`, Deploy. In its settings turn **off** “Enforce JWT verification”.
3. developer.amazon.com → Alexa Developer Console (sign in with the Amazon account your Echos use) → Create Skill: name *McGaw Lists*, English (UK), Other → Custom → Provision your own → Start from scratch.
4. Build → Interaction Model → JSON Editor → paste `alexa/interaction-model-en-GB.json` → Save → Build skill.
5. Build → Interfaces → turn on **Alexa Presentation Language** (tick all the Hub sizes and **TV Fullscreen**) → Save. Build → Permissions → turn on **Skill Personalization**.
6. Build → Endpoint → HTTPS → Default region `https://YOUR-PROJECT.supabase.co/functions/v1/alexa?key=YOUR-SECRET-WORD`, certificate option “My development endpoint has a certificate from a trusted certificate authority” → Save. Copy the **Skill ID** shown there.
7. Supabase → Edge Functions → Secrets: `ALEXA_SKILL_ID` (the Skill ID) and `ALEXA_URL_KEY` (your secret word).
8. Distribution → Privacy Policy URL `https://quickdraw10.github.io/mcgaw-lists/privacy.html` → Save (don't submit). Test tab → set to **Development**. Then: “Alexa, open family lists”.

## TV dashboard (Fire TV or any big screen)
On the Fire TV open **Silk Browser**, go to `quickdraw10.github.io/mcgaw-lists/tv`, sign in once, and bookmark it. Shows the clock, tonight's dinner and the week, everyone's tasks for the week (or pick a person), notice board, live countdown and the shopping list — updating live. Only lists more than one person can see appear (nothing private, no gift lists, no budget). Set the Fire TV screensaver to *Never* if you want it to stay on.

## Outlook → Work list
A **Pull from inbox** button on your Work list (the “Ongoing Work To-Do List” if you have one). It reads the last 1/3/7 days of your work inbox (read-only), Claude picks out emails you need to act on or reply to, and you tick which become tasks — with priority and due date filled in, and a link back to the email. Nothing in Outlook is changed.

Setup: run `supabase/outlook.sql`; deploy `supabase/functions/outlook/index.ts` as an Edge Function called `outlook` (JWT verification off); in Azure, let the existing app sign in work accounts, add the redirect `https://YOUR-PROJECT.supabase.co/functions/v1/outlook` and the **Mail.Read** permission; add a Claude API key as the `ANTHROPIC_API_KEY` secret. Then Family → Connect work Outlook.

## Themes
Family → Appearance → **Theme** opens the theme page: a live light/dark preview, 16 preset themes, and **Your own colours** (accent, background and cards for light and dark mode, with colour pickers). Text automatically stays readable. Saved per phone.

## Fire TV app
`firetv/` is a small Android app that opens the TV dashboard full screen (keeps the screen awake, remote arrows move between buttons). GitHub builds it automatically (`.github/workflows/firetv.yml`) and publishes it at `quickdraw10.github.io/mcgaw-lists/tv.apk`. Install on the Fire TV with the free **Downloader** app.

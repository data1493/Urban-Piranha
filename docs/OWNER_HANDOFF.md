# Urban Piranha — owner handoff

Plug the **owner’s** Stripe, Mailchimp, and Google into the shop + Chimpsheets. Do not ship the demo login, demo Sheet, or test purchases.

This Chimpsheets app (`chimp-sheets-2.vercel.app`) is **one Stripe account**. When the owner is ready, their keys replace the current test keys.

## Owner creates (send us the results)

1. **Stripe** — [dashboard.stripe.com](https://dashboard.stripe.com)  
   Send: Secret key (`sk_test_…` first, `sk_live_…` when selling for real).
2. **Chimpsheets** — [chimp-sheets-2.vercel.app/auth](https://chimp-sheets-2.vercel.app/auth)  
   New login (their email). Send: that email. We copy their user id into the shop.
3. **Google** — on Chimpsheets **Settings → Connect Google Account**  
   Use the Google account that should **own the Orders spreadsheet**.  
   If Google says the app is in testing, we add that Gmail as a test user (or publish the OAuth consent screen).
4. **Mailchimp** — Settings → paste **their** API key → Save.  
   Optional: audience / list id if they don’t want “first list.”

They never need `test@email.com`, `jbal03@gmail.com`, or the current demo Sheet.

## We paste (shop)

On the Urban Piranha host (local `.env` now, Vercel later):

| Variable | From |
|---|---|
| `STRIPE_SECRET_KEY` | Owner’s Stripe secret |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook for **this shop** (`/api/stripe/webhook`) |
| `CHIMP_SHEETS_OWNER_ID` | Chimpsheets user UUID for their login (Supabase Auth → Users) |
| `DATABASE_URL` | Neon (production only; skip until deploy) |

`.env.example` lists these. Never commit real keys.

## We paste (Chimpsheets on Vercel)

Same **owner** Stripe account as the shop:

| Variable | From |
|---|---|
| `STRIPE_SECRET_KEY` | Owner’s Stripe secret (same as shop) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook for **Chimpsheets** (`/api/webhook`) |
| `MAILCHIMP_LIST_ID` | Optional; else first Mailchimp list |

## Stripe Dashboard (owner’s account)

Two endpoints, both `checkout.session.completed`:

1. `https://<shop-host>/api/stripe/webhook` — shop order ticket  
2. `https://chimp-sheets-2.vercel.app/api/webhook` — Mailchimp + Orders sheet  

Each endpoint has its own `whsec_…`. Local shop uses Stripe CLI `listen` instead of (1).

## Google Cloud (us, once)

OAuth client already allows:

- `http://localhost:3000/api/auth/google/callback`
- `https://chimp-sheets-2.vercel.app/api/auth/google/callback`

When the owner’s Gmail is known: [Google Auth audience](https://console.cloud.google.com/auth/audience) → **Test users → Add users**. Or set the consent screen to **In production** (unverified-app warning is OK for one brand).

## Sheet

The current spreadsheet is a **demo**. Test rows stay there.

When the owner connects Google, Chimpsheets creates a **new** Orders table on **their** Drive. Do not copy demo rows over.

## When we deploy (later)

Site polish is done, then:

1. Neon `DATABASE_URL` on the shop  
2. Deploy Urban Piranha (Vercel)  
3. Owner Stripe webhooks to the public shop URL + Chimpsheets  
4. Test-mode charge on **their** keys, confirm **their** Sheet  
5. Live keys, then DNS for `urbanpiranhaclothingcompany.com`

Until then: keep building `/up` locally. Checkout against test Stripe is enough to demo.

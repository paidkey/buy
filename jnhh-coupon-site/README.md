# JNHH Gaming — Coupon Request Site

A Next.js (App Router) site for requesting coupons/keys and routing payment
webhooks to a push notification on your phone via [ntfy.sh](https://ntfy.sh).
Built to run entirely on free tiers: **Vercel Hobby**, **GitHub**, **ntfy.sh**.

## What's included

- Landing page matching the JNHH key-system look: dark background, red neon
  glow accents, pill badges/buttons, sticky "get your coupon first" banner.
- `Request Your Code` form (`/api/request-coupon`) — registers a request and
  sends you a notification. No payment is charged from this form.
- Pricing section: a free tier (links out to the existing key system) and a
  paid tier with 3 selectable plans (1 Month / 1 Year / Lifetime) that carry
  into the request form as context.
- Webhook receivers under `app/api/webhooks/` for **Ko-fi**, **PayPal**,
  **Razorpay** (UPI/cards), and **NOWPayments** (BTC/LTC/SOL/ETH/USDT).
  Each one parses that provider's payload and forwards a normalized message
  to your private ntfy.sh topic.

## 1. Local setup

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local`:

- `NTFY_TOPIC` — **required**. Pick a private, hard-to-guess topic name
  (e.g. `jnhh-orders-8f2a91`). Install the ntfy app (iOS/Android) or visit
  `https://ntfy.sh/<your-topic>` in a browser and subscribe to it — that's
  where order notifications will show up. No account or paid plan needed.
- The other variables are optional but recommended — they let each webhook
  verify the request really came from that payment provider before trusting
  it. Leave them blank while testing locally; the routes still work, they
  just skip signature verification.

Run the dev server:

```bash
npm run dev
```

## 2. Wire up each payment provider

For each provider, point its webhook/IPN URL at your deployed site:

| Provider | Where to set the webhook URL | URL to use |
|---|---|---|
| Ko-fi | Settings → API → Webhooks | `https://YOUR-DOMAIN/api/webhooks/kofi` |
| PayPal | Developer Dashboard → your app → Webhooks | `https://YOUR-DOMAIN/api/webhooks/paypal` |
| Razorpay | Settings → Webhooks | `https://YOUR-DOMAIN/api/webhooks/razorpay` |
| NOWPayments | Store Settings → IPN | `https://YOUR-DOMAIN/api/webhooks/nowpayments` |

Copy each provider's signing secret into the matching env var
(`KOFI_VERIFICATION_TOKEN`, `RAZORPAY_WEBHOOK_SECRET`, `NOWPAYMENTS_IPN_SECRET`)
so the route can verify the payload is genuine. See the comments at the top
of each file in `app/api/webhooks/` for provider-specific docs links — the
PayPal route in particular still needs its signature-verification API call
wired up once you have live PayPal app credentials.

## 3. Deploy to Vercel

1. Push this project to a GitHub repo.
2. Import the repo at [vercel.com/new](https://vercel.com/new) (free Hobby
   plan is enough).
3. Add the same environment variables from `.env.local` under
   **Project Settings → Environment Variables**.
4. Deploy. Vercel gives you a `https://your-project.vercel.app` URL — use
   that as `YOUR-DOMAIN` above.

## Notes

- **`NTFY_TOPIC` must be swapped from the placeholder before going live** —
  routes log a warning and skip sending if it's left as
  `REPLACE_WITH_MY_PRIVATE_TOPIC`.
- Update the social links in `components/SiteHeader.tsx` and
  `components/SiteFooter.tsx` if they ever change.
- The free-tier card links to `https://jnhh-keysystem.vercel.app` — update
  that URL in `components/PricingSection.tsx` if the free site moves.

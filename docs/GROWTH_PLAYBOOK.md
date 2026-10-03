# The CA Hub — Growth & Monetization Playbook

## Strategy in one paragraph
Keep practice **free forever**. That is the SEO and word-of-mouth engine, and the brand promise. Make money from:
1. **Pro**: unlimited timed Exam Simulator, ad-free, early access to new banks. Priced by country.
2. **Ads** for free users only.
3. **Direct sponsorships** from tuition academies and recruiters.

Expand country by country in order of demand, using the `/exams/<body>` waitlists to measure that demand.

## Market priorities (research, Oct 2026)
| Priority | Market | Why |
|---|---|---|
| 1 | ICAP (live) | Home market. No dominant paid ICAP MCQ product exists. |
| 2 | ACCA Applied Knowledge (BT/MA/FA) | ~530k students worldwide; PK, India, UAE and UK are big markets. Exams are 100% MCQ and on-demand. Users can pay in GBP/USD/AED. |
| 3 | ICAI Foundation/Inter | ~1M students. Users won't pay much and ICAI gives MCQs away free, so make it **ads + SEO**, not Pro. |
| 4 | CIMA OT, ICAEW Certificate | Objective-test exams with UK-level users willing to pay. |
| Skip | US CPA | Becker, UWorld and Gleim are entrenched. |

Payments: Paddle (merchant of record, accepts Pakistani sellers, pays out to a bank or Payoneer) for cards. Local wallets for PKR. Lemon Squeezy pays Pakistan out only via PayPal, which doesn't work there, so avoid it. Stripe isn't available to Pakistani businesses.

## What shipped in this release
- **Region by IP**: `src/proxy.ts` sets a `cah_country` cookie from the Vercel geo header. It never redirects, so existing URLs and SEO are untouched. A region switcher in the header lets visitors change it.
- **Exams hub**: `/exams` and `/exams/<body>` landing pages for 9 bodies, with SEO metadata, FAQ JSON-LD and a waitlist. The registry lives in `src/data/regions.ts`.
- **Pro**: `/pro` shows local prices (PKR/INR/BDT/LKR/NGN/AED/SAR/GBP/USD). Paddle handles card checkout. JazzCash/Easypaisa/bank/bKash payments are activated manually with a one-click approval link emailed to you.
- **Exam Simulator** (`?mode=exam`): timed and auto-submitting. Free users get 1 a day; Pro is unlimited.
- **Ads**:
  - `public/ads.txt` (it was missing, which caps AdSense earnings).
  - Real ad units on the practice hub, subject pages, quiz results and blog posts.
  - The ad script is not loaded at all for Pro members.
- **Security fixes**:
  - The progress API now requires a valid session token. Before, anyone could read or overwrite any email's progress.
  - Session tokens are now random, and up to 5 devices can stay signed in.
  - An OTP code now locks after 5 wrong tries.
  - Removed `/api/admin/seed-caf2`, a public GET that **deleted all CAF-2 questions**.

## Launch checklist (owner)
1. **Supabase**: run `supabase/migrations/20261003_growth.sql` in the SQL editor.
2. **Vercel env vars**:

   | Var | What |
   |---|---|
   | `NEXT_PUBLIC_ADSENSE_SLOT` | AdSense → Ads → By ad unit → Display ad → slot id |
   | `ADMIN_SECRET` | any long random string (signs approval links) |
   | `ADMIN_EMAIL` | where payment notifications go (defaults to `GMAIL_USER`) |
   | `NEXT_PUBLIC_PAY_JAZZCASH` | e.g. `0300-1234567 (Account title)` |
   | `NEXT_PUBLIC_PAY_EASYPAISA` | same format |
   | `NEXT_PUBLIC_PAY_BANK` | `Bank · IBAN PK.. · Title` |
   | `NEXT_PUBLIC_PAY_BKASH` | optional, for Bangladesh |
   | `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` | Paddle → Developer tools → Authentication |
   | `NEXT_PUBLIC_PADDLE_PRICE_MONTHLY` | recurring monthly price id (`pri_…`) |
   | `NEXT_PUBLIC_PADDLE_PRICE_SITTING` | one-time price id |
   | `PADDLE_WEBHOOK_SECRET` | Paddle → Notifications; URL `https://thecahub.com/api/webhooks/paddle`; events `transaction.completed`, `subscription.created`, `subscription.updated`, `subscription.canceled` |
   | `NEXT_PUBLIC_PADDLE_ENV` | `sandbox` while testing |

   Any payment option without its env var is hidden automatically. The page works with just JazzCash configured.
3. **Paddle**: on both prices, add **country price overrides** matching `PRICE_BOOKS` in `src/data/regions.ts`, so checkout charges what the page shows.
4. **AdSense**: create one responsive display unit and paste its slot id. Check *Sites → thecahub.com* shows ads.txt "Authorized" (it can take a few days).
5. Do a test purchase in Paddle sandbox, then switch to production.

## 90-day operating plan
- **Weeks 1–2**: launch Pro to ICAP students.
  - Post in ICAP Facebook and WhatsApp groups, aiming at the 2–4 weeks before each sitting.
  - Message angle: "free forever + timed exams from a 6-paper gold medalist".
  - Run a launch offer: first 100 sitting passes at Rs 1,499.
- **Weeks 2–4**: sponsorships.
  - Pitch Pakistani tuition academies: "Recommended academy" slot on PRC/CAF pages and the CV maker.
  - Target Rs 50–150k per month per slot; quote monthly visitor numbers from GA.
  - Pitch firm recruiters a sponsored "Hiring now" card on the CV maker.
- **Weeks 3–8**: ACCA BT/MA/FA bank (biggest new revenue).
  - Pay contributors per verified question.
  - Ingest with the existing `scripts/import-*.ts` pattern, using subject ids like `acca-fa`.
  - Then flip `status: "live"` in `regions.ts` and add the subjects to `src/data/subjects.ts`.
- **Ongoing**:
  - Check demand weekly: `select body_id, count(*) from waitlist group by 1 order by 2 desc;`. Build the body with the most demand next.
  - Email each waitlist the day its bank opens.
- **Upsells**:
  - Paid 1:1 CFAP strategy calls (Rs 3–5k).
  - Premium CV review (Rs 999).
  - Lifetime "All CAF" bundle (Rs 4,999).

## Revenue model (conservative estimates, not guarantees)
| Stream | Assumption | Year 1 |
|---|---|---|
| ICAP Pro | 10k MAU × 3% × Rs 1,999 × 2 sittings | ≈ Rs 1.2M (~$4.3k) |
| ACCA Pro | 300 passes × $25 × 3 sittings | ≈ $22k |
| Sponsorships | 2 slots × Rs 75k × 10 months | ≈ Rs 1.5M (~$5.4k) |
| AdSense | 500k pageviews/mo × $1 RPM | ≈ $6k |

## Social auto-posting (Facebook + Instagram)
Each day at 04:00 UTC (09:00 PKT), Vercel Cron calls `/api/cron/social`. It does three things:
- Posts a "Question of the Day" image card (`/api/social/card?body=…`): one card for ICAP every day, plus one for a rotating global body.
- On Facebook, the caption has links. On Instagram, it says "link in bio".
- The answer and explanation go in the first comment.

Each channel is switched on by its own env vars:

| Var | What |
|---|---|
| `CRON_SECRET` | Any long random string. Vercel sends it automatically to cron routes. |
| `FB_PAGE_ID` | Facebook Page → About → Page ID |
| `FB_PAGE_TOKEN` | Long-lived Page access token with `pages_manage_posts`, `pages_read_engagement`, `instagram_basic` and `instagram_content_publish` |
| `IG_USER_ID` | The ID of the Instagram Business account linked to the Page (Graph API: `GET /{page-id}?fields=instagram_business_account`) |

To check a post without publishing it: `curl -H "Authorization: Bearer $CRON_SECRET" "https://www.thecahub.com/api/cron/social?dry=1"`.

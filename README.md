# Ananga Jewels — website

Next.js 16 (App Router, Cache Components) + Tailwind CSS 4 + Sanity CMS. Replaces the legacy PHP site in `../anangajewels`.

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional for local dev
npm run dev                  # http://localhost:3000
```

Without a Sanity project ID the site runs on the bundled catalogue in `src/data/products.json` (migrated from the PHP site's `products.json`) with images in `public/products/`.

## Structure

| Path | What it is |
| --- | --- |
| `src/app/(site)/` | Public pages: home, shop, product detail (`shop/[slug]`), about, contact, privacy, terms |
| `src/app/studio/` | Embedded Sanity Studio (the admin) at `/studio` |
| `src/app/api/revalidate/` | Webhook Sanity calls on publish, refreshes cached pages |
| `src/lib/data.ts` | All data access — Sanity when configured, local JSON otherwise. Cached with `'use cache'` + tags |
| `src/lib/catalog.ts` | Categories, styles and business details (WhatsApp number, email, socials) |
| `src/sanity/schemas/` | CMS content model: `product`, `siteSettings` |
| `scripts/` | `migrate-legacy.ts` (PHP JSON → typed JSON), `import-to-sanity.ts` (typed JSON → Sanity) |

## Setting up the CMS (one-off)

1. Create a free project at [sanity.io/manage](https://www.sanity.io/manage) (dataset `production`).
2. In the project's **API → CORS origins**, add `http://localhost:3000` and `https://www.anangajewels.com` with *Allow credentials* ticked.
3. Put `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`.
4. Create an **Editor** API token, set `SANITY_API_WRITE_TOKEN`, then import the existing catalogue:
   ```bash
   npx tsx --env-file=.env.local scripts/import-to-sanity.ts
   ```
5. Open `/studio`, log in, and check the products. Invite the shop owner under **Members**.
6. Add a webhook (**API → Webhooks**): URL `https://www.anangajewels.com/api/revalidate`, trigger on create/update/delete, filter `_type in ["product", "siteSettings"]`, projection `{_type}`, and a secret that matches `SANITY_REVALIDATE_SECRET`.

After that, publishing in the Studio updates the live site within seconds — no redeploys.

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel (framework preset: Next.js).
2. Add the environment variables from `.env.example`.
3. Contact form: create a [Resend](https://resend.com) account, verify the `anangajewels.com` domain, and set `RESEND_API_KEY`.
4. Add the domain in Vercel and point DNS at it. Old `.php` URLs 308-redirect to the new routes (see `next.config.ts`).

## Checks

```bash
npx eslint src scripts && npx tsc --noEmit && npm run build
```

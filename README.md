# J Berry Construction — Next.js site

Statically generated Next.js site: SEO location pages, cost guides, noindexed Google Ads landing pages, WhatsApp widget with Ads conversion tracking, lead API (email + Supabase).

## Run locally
```
npm install
npm run dev
```

## Deploy
Push to GitHub → import into Vercel → add env vars from `.env.local.example` → deploy.

## Before launch
1. **Domain decision** — if the old WordPress site stays live on jberryconstruction.co.uk with identical branding, you split authority and risk duplicate content. Preferred: replace the old site (301 old URLs to new equivalents), or at minimum run the new build on the main domain.
2. Replace every `REPLACE:` marker in `data/*.json` — the localDetail fields are what stop location pages being clones. Ten strong pages beat forty thin ones.
3. Real testimonials harvested (with permission) into `data/testimonials.json`.
4. Real phone/WhatsApp numbers in `lib/site.ts` + env vars.
5. Create `jberry_leads` table in Supabase: name, phone, postcode, message, service, location, page, created_at (default now()).
6. Google Ads: URL-based conversion on `/thank-you`; WhatsApp click conversion as **secondary** action initially.
7. Add gtag snippet to `app/layout.tsx` once the Ads account is linked.

## Adding a location
Add one object to `data/locations.json` with genuinely local `localDetail` → rebuild. Every service page for that town generates automatically.

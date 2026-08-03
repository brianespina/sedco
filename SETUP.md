# Cloning This Site for the Next Client

This is the productised process. Budget about a day for config + integrations, and most of the
remaining time on writing the client's actual page copy — which is the part that cannot be
templated (see [The anti-doorway rule](#the-anti-doorway-rule)).

---

## 1. Start the new repo

```bash
git clone <this-repo> newclient-site
cd newclient-site
rm -rf .git && git init
npm install
cp .env.example .env
```

Update `name` in `package.json` and in `wrangler.jsonc` (the Worker name — must be unique in the
Cloudflare account).

---

## 2. Fill in `src/config/site.ts`

This is the bulk of the job. Nothing else in the codebase holds client values.

### Business identity

| Field | What it is |
| --- | --- |
| `url` | Canonical origin, no trailing slash. **Generates every canonical tag** — must match the live domain. |
| `business.name` | Trading name |
| `business.phone` | One number, used everywhere. `tel:` links derive from it. |
| `business.email` | Where form confirmations go |
| `business.license` / `licenseClass` | Contractor licence number and class (C-36 for plumbing; C-10 electrical, C-20 HVAC, etc.) |
| `business.owner`, `yearFounded` | Named in About and city copy |
| `business.hours` | Human-readable, as printed in copy |
| `business.hoursSchema` | Same hours in schema.org format, e.g. `Mo-Fr 07:00-18:00` |
| `business.warranty`, `estimatePolicy` | Exact terms — do not paraphrase these |
| `business.locality`, `region`, `postalCode`, `county` | Service-area business: **no street address** |
| `business.tagline` | Small uppercase line under the logo |

Any field left as a `[BRACKETED]` token renders as a dashed placeholder chip on the page, so
unfinished data is impossible to miss. `npm run verify` counts what is left.

### Profiles

`profiles.google`, `profiles.googleReview`, `profiles.yelp`, `profiles.facebook`. Empty or
placeholder values are simply omitted from the footer and from schema `sameAs` — no broken icons.

### Services and cities

- `services[]` — one entry per service: `slug`, `name`, `navLabel`, `cardLine` (homepage grid),
  `hubLabel` + `hubLine` (services hub card), `group`, and `cities` (which cities get a
  service×city child page).
- `serviceGroups[]` — the hub's section headings, each with a `slugs` array fixing card order.
- `cities[]` — one entry per city: `slug`, `name`, `tier`, `descriptor`, `neighborhoods`,
  `waterDistrict`, `nearby`, optional `nearbyNote`.

**The service×city matrix is derived from `services[].cities`.** Don't maintain it separately.

Changing the service or city count needs no component edits — nav dropdowns, footer columns,
card grids, form dropdowns, sitemap, and schema `areaServed` all read from these arrays.

---

## 3. Swap the branding

**Design tokens** — `src/styles/tokens.css`. Colours, fonts, spacing, radii, shadows, and the
signature gradients are all here. Rebranding is mostly this one file.

**Fonts** — installed via `@fontsource`, imported at the top of
`src/layouts/BaseLayout.astro`. To change: `npm i @fontsource/<family>`, swap the imports, and
update `--font-display` / `--font-body` in `tokens.css`.

**Logo and photos** — drop files in `src/assets/images/`, then update `src/lib/images.ts`. Pages
reference images by **role** (`heroHome`, `heroService`, `whyUs`, …), never by filename, so this
is the only file to touch. Keep the SEO filename convention: `slab-leak-repair-el-cajon.jpg`.

**Favicon** — `public/favicon.svg`.

> ⚠️ Every photo currently in `src/assets/images/` is licensed stock from the design handoff and
> is a **placeholder**. The guide (Part 7.4) asks for the client's real trucks, techs, and jobs.
> The logo is the one real brand asset.

---

## 4. Replace the content collections

Delete the contents of `src/content/services/`, `service-areas/`, and `service-city/`, and write
the new client's pages. Each YAML file mirrors one page's spec block plus its copy:

```yaml
service: drain-cleaning          # must match a slug in site.ts
title: ...                       # title tag, verbatim from the content guide
description: ...                 # meta description, verbatim
primaryKeyword: ...
supportingKeywords: [...]
heroBadge: ...                   # badge pill above the H1
heroStat: ...                    # frosted hero card stat
heroStatLabel: ...
heroPoints: [...]                # green-check credential rows
h1: ...                          # the single H1
intro: [...]                     # opening paragraph(s); the first appears in the hero
sections:                        # H2/H3 body sections, in the guide's order
  - heading: ...
    level: 2
    paragraphs: [...]
    list: [...]                  # supports [anchor](/path/) inline links
faqs:                            # feeds the accordion AND FAQPage schema
  - question: ...
    answer: [...]
ctaHeading: ...                  # the closing H2
ctaBody: ...
internalLinks:                   # the guide's exact anchor text
  - href: /services/sewer-lines/
    anchor: sewer line repair and replacement
    group: service               # service | city | combo | page
```

`group` decides where a link is placed: `service` → Related Services card, `city` → city pills,
`combo` → the sibling cross-link, `page` → anywhere else.

Zod validates every file at build time, so a missing title or malformed link fails the build
rather than shipping broken.

### The anti-doorway rule

The guide's one unbreakable rule, and it applies to every clone: **never duplicate a page and
swap the city name.** Google penalises doorway pages. Every city and service×city page needs its
own local substance — real neighbourhoods, housing stock, water district, terrain, and the
problems specific to that area. If a page cannot say something true and specific about a place,
it should not exist.

This is why the content collections are the slow part of a clone. The templates transfer; the
copy does not.

---

## 5. Web3Forms

1. Create the account at [web3forms.com](https://web3forms.com) on the **client's** email — one
   account per client, owned by the client. The signup address is where every lead lands, so using
   your own email sends the client's leads to your inbox instead of theirs. Signup verifies the
   address, so this step needs either the client doing it themselves or access to their mailbox.
2. Copy the access key into `.env` as `WEB3FORMS_ACCESS_KEY=...`

The cleanest handoff is the client signing up (Google sign-in on the business account they already
use for GBP is quickest) and sending you just the key. If you create the account for them, hand the
credentials over through a password manager rather than email, and have them reset the password on
first login. The key itself needs no such care — see below.

**The key is read at build time, not runtime.** Every public page is prerendered, so the key is
baked into the HTML by `astro build`. Set it wherever the build runs — `.env` is enough for
`npm run deploy`, since that builds locally; if you move the build into CI or Cloudflare's build
system, add it there as a build-time environment variable. `wrangler secret put` does **not** work
for this: a runtime Worker secret is never seen by already-prerendered HTML, and the contact form
would deploy dead.

The key is not a credential — it ships as a hidden input in the page HTML and is visible in
view-source by design. Nothing is leaked by sharing it.

Until it is set, `npm run verify` fails loudly and the form posts nothing. One free account per
client keeps leads in their own inbox.

**Free plan limits worth telling the client:** 250 submissions/month, and no dashboard on the free
tier — email is the only record of a lead. If a lead email is deleted, it is gone.

Form fields come from config — the city dropdown is the `cities` array plus "Other", and the
service dropdown is the `services` array plus "Not sure / something else".

---

## 6. Keystatic Cloud

1. Create a team + project at [keystatic.cloud](https://keystatic.cloud) — **one team per client**.
2. Set `integrations.keystaticProject` in `src/config/site.ts` to `'team/project'`.
3. Deploy. The client signs in at `https://<domain>/keystatic` — Keystatic Cloud handles auth, so
   there are no credentials to manage.

**Local editing without Keystatic Cloud:** run `KEYSTATIC_LOCAL=1 npm run dev`. Edits write
straight to `src/content/blog/` on disk. No account needed, and nothing to remember to revert —
every build and deploy uses Cloud regardless of that variable.

### Publishing has to be automated, or the CMS looks broken

Keystatic Cloud saves a post by **committing to the GitHub repo**. It does not deploy. With a
manual `npm run deploy`, a client hits Save, sees success, and their post never appears on the
site — the worst kind of failure, because nothing looks wrong.

Connect the repo to **Cloudflare Workers Builds** (or any CI that runs `npm run build && wrangler
deploy` on push to `main`) before handing the CMS to the client. Set `WEB3FORMS_ACCESS_KEY` as a
build-time variable there too — the contact form is prerendered, so a build without it ships a
dead form.

### Astro 7 compatibility

`src/middleware.ts` shims `locals.runtime.env` for `/api/keystatic` requests. `@keystatic/astro`
still reads a property Astro removed in v6, and without the shim every CMS API call returns 500 on
Cloudflare. `astro.config.mjs` also sets `trailingSlash: 'ignore'` because the admin requests its
API and OAuth callback URLs without trailing slashes. Do not change either without re-testing
`/keystatic` against `npx wrangler dev`.

The blog schema deliberately makes title, meta description, slug, and card blurb **required**, and
the body is Markdoc — so a client filling in content cannot break the page's SEO structure or
layout.

---

## 7. Analytics

Set `integrations.ga4` in config to the GA4 measurement ID (`G-XXXXXXXXXX`). Leave it empty and no
analytics script is injected at all.

> Call tracking: the guide (Part 7.4) allows it **only** with dynamic number insertion that keeps
> the same number visible to Google. Ask before adding one.

---

## 8. Deploy to Cloudflare

```bash
npx wrangler login
npm run deploy
```

Then in the Cloudflare dashboard for the domain:

1. **Rules → Redirect Rules** — 301 from `www.<domain>/*` to `<domain>/:splat` (or the reverse).
   The direction must match `url` in `site.ts`, since that generates every canonical tag.
2. **SSL/TLS → Edge Certificates** — enable "Always Use HTTPS".

Host-level redirects cannot go in `public/_redirects` (Cloudflare rejects absolute URLs there);
that file is for path-level redirects from the client's old site.

Switching hosts instead? Replace `@astrojs/cloudflare` in `astro.config.mjs` with the Vercel,
Netlify, or Node adapter. Nothing else in the codebase is host-specific, but keep
`image.service` pointed at sharp so images are still optimised at build time.

---

## 9. Pre-launch checklist

```bash
npm run check     # 0 errors expected
npm run verify    # structural checks; placeholder count must reach 0
```

`npm run verify` enforces: one H1 per page · unique titles and meta descriptions · self-referencing
canonicals · valid JSON-LD · no broken internal links · no orphans · nothing deeper than 3 clicks ·
no `[PLACEHOLDER]` tokens remaining.

Then, from the guide's Part 9:

- [ ] Every config placeholder filled — `npm run verify` reports 0 tokens
- [ ] Real client photos in place of the stock placeholders
- [ ] Real reviews in `src/config/reviews.ts`, and `reviewsArePlaceholder` set to `false`
- [ ] Real coverage map replacing the `ServiceAreaMap` placeholder card
- [ ] Privacy policy reviewed and approved by the client
- [ ] Google Business Profile configured as a service-area business (address hidden), categories
      and services matching the site
- [ ] Sitemap submitted in Search Console; GA4 confirmed receiving data
- [ ] Form tested end to end — a real submission arrives in the client's inbox
- [ ] Core Web Vitals pass on mobile (PageSpeed Insights)
- [ ] Rich Results Test run on a service page, a city page, and a blog post

---

## Open items on the Sedco build

These need a decision or client input before this specific site launches.

### 1. Duplicate title tag — decided: follow the guide

The content guide assigns the **same** title tag to two pages:

- `/services/general-plumbing/` → `Plumber in El Cajon, CA | Sedco Plumbing`
- `/service-areas/el-cajon/` → `Plumber in El Cajon, CA | Sedco Plumbing`

Both also target the same primary keyword, `plumber El Cajon`. This contradicts the guide's own
Part 7.4 rule ("unique title tag and meta description per page ... never duplicate across pages").

**Decision: ship the guide's copy verbatim.** The guide is the source of truth, and the conflict is
the guide's to resolve, not the build's. The accepted consequence is that the two pages compete for
`plumber El Cajon` — Google will pick one and may filter the other from results for that query.

If Search Console later shows the two cannibalising each other, the fix is to retitle the service
page to `Plumbing Services in El Cajon, CA | Sedco Plumbing` in
`src/content/services/general-plumbing.yaml`, then delete the entry from
`ACKNOWLEDGED_DUPLICATE_TITLES` in `scripts/verify-build.mjs`. `verify` prints the duplicate on
every run so it stays visible as a recorded decision rather than an oversight.

### 2. Blog cost post — pricing needed

`src/content/blog/slab-leak-repair-cost-san-diego-county.mdoc` is written in full, but every dollar
figure is a placeholder (`[DETECTION PRICE RANGE]`, `[SPOT REPAIR RANGE]`, `[REROUTE RANGE]`,
`[REPIPE RANGE]`). The guide asks cost posts to state real ranges; inventing a contractor's prices
was not an option. The post carries a visible editorial note listing exactly what to replace.
Delete the `{% note %}` block once the figures are in.

### 3. Facts the guide flags for client confirmation

Guide Part 9 asks these to be verified before launch, and they appear in the copy as written:

- Water district boundaries named on city pages (Helix / Padre Dam / Otay, and the Spring Valley
  split between Helix and Otay)
- Response-time claims — "10–15 minutes", "20–25 minutes to Alpine", "within the hour"
- Hard-water figures — "14 to 18 grains per gallon"
- The 25% grease-trap rule as enforced by San Diego County

### 4. Still placeholder content

Nothing in this list announces itself on the page any more. Placeholder sections render as
neutral content or hide entirely, and the reminders live here and in `npm run verify` output
instead of in the HTML — a note written for the developer should never reach a visitor.

- **Photos** — all stock from the design handoff; the logo is the only real asset
- **Reviews** — `src/config/reviews.ts` holds 12 reviews curated from the client's Yelp and
  Foursquare profiles. Every one still needs a `city` (the source reviews don't state one, and the
  guide asks reviews to be tagged by city); `verify` counts what is missing. The six Yelp entries
  come from Yelp's "not currently recommended" bucket — confirm the client is comfortable
  republishing them, and prefer Yelp's recommended reviews and Google reviews as they arrive.
- **Google review button** — `/reviews/` hides the "Leave a Google review" button the guide asks
  for until `profiles.googleReview` is set in `src/config/site.ts`. `verify` warns while it is unset.
- **Service-area map** — `ServiceAreaMap.astro` renders a caption card over a decorative
  background, with no pins or boundaries, because placing invented locations on a map is a factual
  claim we cannot make. Replace the background with a real San Diego County coverage map that
  highlights the service area — never a storefront pin, since the address is hidden. The guide
  (Part 3, Homepage) marks this graphic optional, so dropping the card is also a valid choice; the
  city links beside it already carry the section.
- **Team photos on About** — the guide marks these optional ("team photos, community involvement,
  sponsorships — add when available"). Nothing is stubbed on the page; add a section to
  `src/pages/about.astro` when the client supplies photos.
- **Privacy policy** — the text accurately describes what the *website* collects (the Web3Forms
  submission, analytics if enabled, no first-party tracking cookies), but nobody has confirmed how
  the *business* handles that data off the site: retention, whether leads reach subcontractors, and
  any CCPA obligations. Have the client review it with legal advice, then set
  `legal.privacyPolicyApproved: true` in `src/config/site.ts`; `verify` warns until you do. The
  "Last updated" line reads from `legal.privacyPolicyUpdated` — bump it when the text changes, not
  on every deploy.
- **Blog** — 2 of the guide's 12 starter posts are written; posts 3–12 have briefs in Part 8

### 5. Blog images

Posts currently fall back to a stock photo. Add per-post featured images through Keystatic
(they save to `src/assets/blog/`) or set `featuredImage` in the post frontmatter.

# Sedco Plumbing — Local Service Business Site System

A config-driven Astro site for a local service business. Built first for **Sedco Plumbing**
(plumber, El Cajon CA), designed to be cloned for the next contractor by editing config and
content rather than components.

**To clone this for a new client, follow [SETUP.md](./SETUP.md).**

## Stack

| Piece | Choice | Why |
| --- | --- | --- |
| Framework | Astro 7, `output: 'static'` | 52+ prerendered pages; only `/keystatic` renders on demand |
| Styling | Plain CSS + custom properties | No build-time CSS framework; tokens in `src/styles/tokens.css` |
| Hosting | Cloudflare Workers (`@astrojs/cloudflare`) | Static assets at the edge, Worker only for the CMS routes |
| CMS | Keystatic + Keystatic Cloud | Client edits the blog; auth handled by Keystatic Cloud |
| Blog body | Markdoc | Rich text without letting content inject components |
| Forms | Web3Forms | Client's own free account, leads to their inbox |
| Images | sharp at build time | WebP/AVIF variants generated during `astro build` |
| Fonts | `@fontsource` (self-hosted) | No third-party font request on the critical path |

React is installed **only** because the Keystatic admin UI needs it. No public page ships React.

## Commands

```bash
npm install
npm run dev       # dev server at localhost:4321, includes /keystatic
npm run build     # production build into dist/
npm run verify    # build, then run the pre-launch structural checks
npm run check     # astro check (TypeScript + Astro diagnostics)
npm run preview   # serve the build locally through workerd
npm run deploy    # build + wrangler deploy
```

### About the dev server

`npm run dev` runs on plain **Node**, so it behaves like any ordinary Astro project.

Astro 7 runs `astro dev` as a **background daemon**, so the command returns immediately rather
than staying attached:

```bash
npx astro dev status   # is it running, and on which port
npx astro dev logs     # tail its output
npx astro dev stop     # shut it down
```

#### Why the adapter is split between dev and build

`astro.config.mjs` uses **`@astrojs/node` for `dev`** and **`@astrojs/cloudflare` for `build`**.
An adapter is needed at all only because of Keystatic's two on-demand routes; every public page
is prerendered.

Since Astro 6, `@astrojs/cloudflare` runs `astro dev` inside Cloudflare's `workerd` runtime.
workerd cannot load native `.node` binaries, so dev then depends on Rolldown's wasm binding and
breaks with `Cannot find native binding` / `no match for module: @rolldown/binding-wasm32-wasi`
whenever that binding is missing or the Vite cache is stale — which shows up in the browser as
the page flashing between content and an error overlay. Nothing here needs workerd during
development, so dev runs on Node and stays quiet.

Production is unaffected: `npm run build` and `npm run deploy` use the Cloudflare adapter exactly
as before. To test against workerd deliberately:

```bash
DEV_ADAPTER=cloudflare npm run dev   # opt back into workerd
npm run preview                      # always uses the real Cloudflare build
```

If you ever hit a stale-cache error in dev, clear it and restart:

```bash
npx astro dev stop && rm -rf .astro node_modules/.vite && npm run dev
```

`npm run verify` is the important one before launch. It checks the generated HTML against the
content guide's technical requirements: one H1 per page, unique title and meta description,
self-referencing canonicals, valid JSON-LD, no broken internal links, no orphan pages, nothing
more than 3 clicks from the homepage, and it reports any `[PLACEHOLDER]` tokens still unfilled.

## Architecture

```
src/
  config/
    site.ts            ← SINGLE SOURCE OF TRUTH for all client values
    reviews.ts         ← review content (placeholder until the client's real ones land)
  content/
    services/          ← 16 service pages (YAML: spec block + copy)
    service-areas/     ← 10 city pages
    service-city/      ← 20 service x city pages
    blog/              ← Keystatic-managed posts (.mdoc)
  content.config.ts    ← Zod schemas for the four collections
  layouts/BaseLayout.astro
  components/
    Header, Footer, Breadcrumbs, Hero, HeroCtas, ServiceCardGrid, CityCardGrid,
    FaqBlock, CtaSection, ContactForm, SideCallCard, SideLinkCard, Sections,
    Droplet, Phone, ServiceAreaMap, Seo
    schema/            ← LocalBusiness, Service, FAQPage, BreadcrumbList, Article, PageSchema
  lib/
    tokens.ts          ← resolves [PLACEHOLDER] tokens from site.ts
    images.ts          ← image registry: pages reference images by role, not filename
    types.ts
  pages/
    index, about, contact, reviews, privacy-policy
    services/index, services/[service]/index, services/[service]/[city]
    service-areas/index, service-areas/[city]
    blog/index, blog/[slug]
    robots.txt.ts
  styles/tokens.css, base.css
scripts/verify-build.mjs
keystatic.config.ts
markdoc.config.mjs
```

### The two rules that keep this reusable

**1. No client value is hardcoded anywhere but `src/config/site.ts`.**
Phone, email, license, hours, owner, warranty, ZIP, service list, city list, and the
service×city matrix all live there. Components and pages read from it. There is not a single
hardcoded phone number or license string in any component.

**2. Copy stays verbatim, placeholders resolve at render time.**
The content guide's copy is stored exactly as written, including its `[PHONE]`, `[LICENSE #]`
tokens. `src/lib/tokens.ts` resolves those from config when the page renders. A token whose
config value is still unfilled renders as a dashed **placeholder chip**, so anything missing is
visible on the page instead of silently shipping. Fill the config value and every chip for it
disappears site-wide.

Content files also support `[anchor text](/path/)` for in-sentence internal links — a safe,
markdown-style syntax, so content can carry links without being allowed to inject raw HTML.

### Derived data

The 20 service×city combos are **derived** from `services[].cities` in config, not listed
separately. That single list drives the combo routes, the sitemap, the parent-page child links,
and the sibling cross-links. Adding a combo means adding one city slug to a service plus one
content file.

## SEO implementation

Everything below is wired per the content guide's Part 7:

- **JSON-LD** — `Plumber`/LocalBusiness on the homepage and every city page (same `@id`, same
  `areaServed`, so the entity is never published with conflicting data); `Service` on every
  service and combo page; `FAQPage` generated from the same array the page renders, so answers
  cannot drift from the visible copy; `BreadcrumbList` on every page below the homepage;
  `BlogPosting` on posts. **No** Review/AggregateRating markup — the guide permits it only for
  genuine first-party reviews, never for reviews copied from Google.
- **Internal linking** — hub-and-spoke, wired with the guide's exact anchor text. Verified: 0
  broken links, 0 orphans, max depth 2 clicks.
- **Service-area business** — schema address uses locality/region/ZIP only; no street address.
- **Titles/descriptions** — verbatim from each page's spec block, uniqueness enforced by
  `npm run verify`.
- **URLs** — lowercase, hyphens, trailing slash, no dates or params.
- **Mobile** — persistent click-to-call bar below 860px; hamburger drawer below 1180px.
- **Accessibility** — labelled form fields, visible focus states, skip link, 44px tap targets,
  `prefers-reduced-motion` honoured.

## Known items before launch

See the bottom of [SETUP.md](./SETUP.md) for the full list. `npm run verify` prints the live ones
on every run — unfilled config placeholders, reviews without a city, the unapproved privacy policy,
and the duplicate title tag the content guide itself assigns to two pages (shipped verbatim as a
recorded decision).

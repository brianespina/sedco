#!/usr/bin/env node
/**
 * PRE-LAUNCH BUILD VERIFICATION
 *
 * Run after `npm run build`. Checks the generated HTML against the content
 * guide's technical requirements (Part 7.4) and the Part 9 launch checklist:
 *
 *   - every internal link resolves; no orphan pages; everything within 3 clicks
 *   - one H1 per page
 *   - unique title tag and meta description per page
 *   - self-referencing canonical on every page
 *   - JSON-LD present and parseable
 *   - remaining [BRACKETED] placeholders reported (must be zero at launch)
 *
 * Exits non-zero on hard failures. Placeholder counts are reported as warnings
 * so the site can be built and reviewed before the client's details arrive.
 *
 * Usage: node scripts/verify-build.mjs
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist/client';
const IGNORED_PREFIXES = ['/_astro', '/api/'];
const NON_PAGE_TARGETS = new Set([
  '/robots.txt',
  '/sitemap-index.xml',
  '/sitemap-0.xml',
  '/favicon.svg',
  '/keystatic/',
]);

/**
 * KNOWN CONFLICT IN THE CONTENT GUIDE — awaiting a client decision.
 *
 * The guide specifies the same title tag for two pages:
 *   /services/general-plumbing/  and  /service-areas/el-cajon/
 * both get "Plumber in El Cajon, CA | Sedco Plumbing", and both target the
 * primary keyword "plumber El Cajon".
 *
 * That contradicts the guide's own Part 7.4 rule ("unique title tag ... never
 * duplicate across pages") and risks the two pages competing for one query.
 * The copy is left exactly as written rather than silently rewritten; this
 * entry keeps the conflict visible on every run until it is resolved.
 *
 * TO RESOLVE: differentiate one title in its content entry — the service page
 * reads naturally as "Plumbing Services in El Cajon, CA | Sedco Plumbing" —
 * then delete this entry.
 */
const ACKNOWLEDGED_DUPLICATE_TITLES = new Set(['Plumber in El Cajon, CA | Sedco Plumbing']);

/** Hard failures block launch; warnings are informational. */
const failures = [];
const warnings = [];

/** Append `value` to the array stored at `key`, creating it when absent. */
const push = (map, key, value) => {
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(value);
};

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

let files;
try {
  files = walk(DIST).filter((f) => f.endsWith('index.html'));
} catch {
  console.error(`✗ ${DIST} not found. Run \`npm run build\` first.`);
  process.exit(1);
}

const pages = new Map();
for (const file of files) {
  const dir = relative(DIST, file).replace(/index\.html$/, '');
  const url = '/' + dir.replace(/\\/g, '/');
  pages.set(url, readFileSync(file, 'utf8'));
}

const titles = new Map();
const descriptions = new Map();
const outgoing = new Map();
const incoming = new Map();
let placeholderPages = 0;
let placeholderTotal = 0;
const formsMissingKey = new Set();

for (const [url, html] of pages) {
  // ---- one H1 per page ----
  const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1Count !== 1) failures.push(`${url} has ${h1Count} H1 elements (expected exactly 1)`);

  // ---- title / description ----
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="(.*?)"/s)?.[1]?.trim();
  if (!title) failures.push(`${url} is missing a title tag`);
  if (!description) failures.push(`${url} is missing a meta description`);
  if (title) push(titles, title, url);
  if (description) push(descriptions, description, url);

  // ---- self-referencing canonical ----
  // Strip the origin so only the path is compared against this page's URL.
  const canonical = html.match(/<link rel="canonical" href="https?:\/\/[^/"]+(\/[^"]*)"/)?.[1];
  if (canonical !== url) {
    failures.push(`${url} canonical points to ${canonical ?? 'nothing'} instead of itself`);
  }

  // ---- JSON-LD parses ----
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
  if (blocks.length === 0) warnings.push(`${url} has no JSON-LD block`);
  for (const [, json] of blocks) {
    try {
      JSON.parse(json);
    } catch (error) {
      failures.push(`${url} has invalid JSON-LD: ${error.message}`);
    }
  }

  // ---- Web3Forms key ----
  // The contact form no longer shows an on-page warning when the access key is
  // missing, so this is the safeguard: an empty access_key means submissions
  // fail and leads are lost silently.
  // Astro renders an empty string as a bare `value` attribute, not `value=""`,
  // so both spellings count as unset.
  const keyAttr = html.match(/name="access_key"\s+value(?:="([^"]*)")?/);
  if (keyAttr && !keyAttr[1]) {
    formsMissingKey.add(url);
  }

  // ---- unreplaced placeholders ----
  const leftover = html.match(/\[[A-Z][A-Z0-9 #_]*\]/g) ?? [];
  if (leftover.length > 0) {
    placeholderPages += 1;
    placeholderTotal += leftover.length;
  }

  // ---- link graph ----
  const links = new Set();
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (IGNORED_PREFIXES.some((prefix) => href.startsWith(prefix))) continue;
    const hasExtension = href.split('/').pop()?.includes('.');
    const target = href.endsWith('/') || hasExtension ? href : `${href}/`;
    links.add(target);
    if (pages.has(target)) {
      if (!incoming.has(target)) incoming.set(target, new Set());
      incoming.get(target).add(url);
    } else if (!NON_PAGE_TARGETS.has(target)) {
      failures.push(`${url} links to ${target}, which does not exist`);
    }
  }
  outgoing.set(url, links);
}

// ---- duplicates ----
for (const [title, urls] of titles) {
  if (urls.length === 1) continue;
  const message = `Duplicate title "${title}" on: ${urls.join(', ')}`;
  if (ACKNOWLEDGED_DUPLICATE_TITLES.has(title)) {
    warnings.push(`${message} — known guide conflict, needs a decision before launch`);
  } else {
    failures.push(message);
  }
}
for (const [description, urls] of descriptions) {
  if (urls.length > 1) {
    failures.push(`Duplicate meta description on: ${urls.join(', ')}`);
  }
}

// ---- orphans ----
for (const url of pages.keys()) {
  if (url !== '/' && !incoming.get(url)?.size) failures.push(`${url} is an orphan page`);
}

// ---- click depth ----
const depth = new Map([['/', 0]]);
let frontier = ['/'];
while (frontier.length) {
  const next = [];
  for (const url of frontier) {
    for (const target of outgoing.get(url) ?? []) {
      if (pages.has(target) && !depth.has(target)) {
        depth.set(target, depth.get(url) + 1);
        next.push(target);
      }
    }
  }
  frontier = next;
}
for (const url of pages.keys()) {
  const d = depth.get(url);
  if (d === undefined) failures.push(`${url} is unreachable from the homepage`);
  else if (d > 3) failures.push(`${url} is ${d} clicks from the homepage (max 3)`);
}

// ---- report ----
console.log(`Checked ${pages.size} pages in ${DIST}\n`);

if (formsMissingKey.size > 0) {
  warnings.push(
    `WEB3FORMS_ACCESS_KEY is not set — the contact form on ${formsMissingKey.size} page(s) will ` +
      `fail silently and leads will be lost. Set it before launch (SETUP.md step 5).`,
  );
}

if (placeholderTotal > 0) {
  warnings.push(
    `${placeholderTotal} unreplaced [PLACEHOLDER] tokens across ${placeholderPages} pages — ` +
      `fill src/config/site.ts before launch (guide Part 9)`,
  );
}

for (const warning of warnings) console.log(`  ! ${warning}`);
if (warnings.length) console.log('');

if (failures.length === 0) {
  console.log('✓ All structural checks passed.');
  process.exit(0);
}

console.error(`✗ ${failures.length} problem(s) found:\n`);
for (const failure of failures) console.error(`  - ${failure}`);
process.exit(1);

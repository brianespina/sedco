/**
 * Placeholder token resolution.
 *
 * The content guide's copy is stored verbatim, including its bracketed tokens
 * ([PHONE], [LICENSE #], ...). Those tokens resolve from src/config/site.ts at
 * render time, so a single config edit updates every page, title tag, meta
 * description, and JSON-LD block at once.
 *
 * A token whose config value is still unfilled renders as a dashed placeholder
 * chip (per the design), making unfinished client data obvious on the page
 * rather than something that silently ships.
 */

import { site } from '@config/site';

/** Guide Part 9 placeholder list, mapped to config fields. */
const TOKENS: Record<string, string> = {
  '[PHONE]': site.business.phone,
  '[EMAIL]': site.business.email,
  '[LICENSE #]': site.business.license,
  '[YEAR FOUNDED]': site.business.yearFounded,
  '[OWNER NAME]': site.business.owner,
  '[HOURS]': site.business.hours,
  '[WARRANTY TERMS]': site.business.warranty,
  '[ZIP]': site.business.postalCode,
  '[ESTIMATE POLICY]': site.business.estimatePolicy,
  '[GOOGLE BUSINESS PROFILE URL]': site.profiles.google,
  '[GOOGLE REVIEW LINK]': site.profiles.googleReview,
  '[YELP URL]': site.profiles.yelp,
  '[FACEBOOK URL]': site.profiles.facebook,
};

const TOKEN_PATTERN = /\[[A-Z][A-Z0-9 #_]*\]/g;

/**
 * Inline links in content copy use a markdown-style `[anchor](/path/)`, so the
 * guide's in-sentence internal links can live in YAML without allowing raw HTML
 * (which would let content inject arbitrary markup into a page).
 *
 * Only site-relative paths are accepted; anything else stays literal text.
 */
const INLINE_LINK = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

/**
 * Private-use code points fence extracted links while the surrounding text is
 * escaped: they cannot collide with real copy, survive escaping untouched, and
 * add no stray whitespace around the link.
 */
const LINK_OPEN = '\uE000';
const LINK_CLOSE = '\uE001';
const LINK_SLOT = /\uE000(\d+)\uE001/g;

/** True when a config value is an unreplaced placeholder token. */
export const isPlaceholder = (value: string | null | undefined): boolean =>
  typeof value === 'string' && /^\[[^\]]+\]$/.test(value.trim());

/** Every config field still holding a placeholder — reported by `npm run check`. */
export const unfilledPlaceholders = (): string[] =>
  Object.entries(TOKENS)
    .filter(([, value]) => isPlaceholder(value))
    .map(([token]) => token);

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const resolveTokens = (text: string, asChip: boolean): string =>
  text.replace(TOKEN_PATTERN, (token) => {
    const value = TOKENS[token];
    if (value === undefined) return token;
    if (!isPlaceholder(value)) return asChip ? escapeHtml(value) : value;
    return asChip
      ? `<span class="ph-chip" title="Replace in src/config/site.ts before launch">${escapeHtml(token)}</span>`
      : token;
  });

/**
 * Replace tokens with their config values as plain text, and strip inline link
 * syntax down to its anchor text.
 *
 * Use for title tags, meta descriptions, alt text, JSON-LD, and form values.
 * Unfilled tokens are left as-is so they stay greppable before launch.
 */
export const t = (text: string): string =>
  resolveTokens(text.replace(INLINE_LINK, '$1'), false);

/**
 * Replace tokens for rendering in the page body. Returns escaped HTML, with
 * unfilled tokens wrapped in a dashed placeholder chip and `[anchor](/path/)`
 * resolved to real links. Use with `set:html`.
 */
export const th = (text: string): string => {
  const links: string[] = [];

  const fenced = text.replace(INLINE_LINK, (_match, anchor: string, href: string) => {
    const slot = links.push(`<a href="${escapeHtml(href)}">${escapeHtml(anchor)}</a>`) - 1;
    return LINK_OPEN + slot + LINK_CLOSE;
  });

  const escaped = resolveTokens(escapeHtml(fenced), true);

  return escaped.replace(LINK_SLOT, (_match, slot: string) => links[Number(slot)]);
};

/**
 * `tel:` target for the phone number. Before the real number is set this keeps
 * the design's literal `tel:PHONE`, which is visibly wrong rather than
 * silently dialling something incorrect.
 */
export const phoneHref = (): string => {
  const { phone } = site.business;
  if (isPlaceholder(phone)) return 'tel:PHONE';
  const digits = phone.replace(/\D/g, '');
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
};

/** `mailto:` target for the business email. */
export const emailHref = (): string => {
  const { email } = site.business;
  return isPlaceholder(email) ? 'mailto:EMAIL' : `mailto:${email}`;
};

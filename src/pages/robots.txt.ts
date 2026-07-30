import type { APIRoute } from 'astro';
import { site, absolute } from '@config/site';

/**
 * robots.txt — allows every public page (guide Part 7.4) and points crawlers at
 * the sitemap. Only the Keystatic admin and its API are disallowed; they are
 * the editor, not content.
 */
export const GET: APIRoute = () =>
  new Response(
    `# ${site.business.name}
User-agent: *
Allow: /
Disallow: /keystatic
Disallow: /api/

Sitemap: ${absolute('/sitemap-index.xml')}
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );

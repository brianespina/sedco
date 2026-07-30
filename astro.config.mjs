// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import node from '@astrojs/node';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import keystatic from '@keystatic/astro';

import { site as siteConfig } from './src/config/site.ts';

/**
 * Public pages are all prerendered (`output: 'static'`). Only the Keystatic
 * admin and its API routes render on demand, via `export const prerender = false`.
 *
 * ADAPTER: an adapter is required because of those two Keystatic routes.
 *
 *   dev   → @astrojs/node    plain Node, normal `astro dev`
 *   build → @astrojs/cloudflare
 *
 * Why the split: since Astro 6, @astrojs/cloudflare runs `astro dev` inside
 * Cloudflare's workerd runtime. workerd cannot load native `.node` binaries, so
 * dev then depends on Rolldown's wasm binding and fails with
 * "Cannot find native binding" whenever that binding is missing or stale.
 * Nothing in this site needs workerd at development time — every public page is
 * static — so dev uses Node and stays boring. Production still builds and
 * deploys to Cloudflare Workers, unchanged.
 *
 * Set DEV_ADAPTER=cloudflare to opt back into workerd locally (useful only if
 * you add code that touches Cloudflare bindings and want to test it for real).
 */
const isDev = process.argv.includes('dev');
const useCloudflareInDev = process.env.DEV_ADAPTER === 'cloudflare';

const adapter =
  isDev && !useCloudflareInDev
    ? node({ mode: 'standalone' })
    : cloudflare({
        // 'custom' hands image handling to the sharp service configured below.
        // The adapter's own modes route through workerd, which cannot transform
        // at build time here and silently passes images through unoptimized.
        imageService: 'custom',
        // sharp is a native module, so prerendering must run in Node.
        prerenderEnvironment: 'node',
      });

export default defineConfig({
  site: siteConfig.url,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },

  adapter,

  integrations: [
    // Markdoc powers the Keystatic-edited blog bodies: rich text without
    // letting a client drop arbitrary components into the layout.
    markdoc(),
    // React is required by the Keystatic admin UI only. No public page ships it.
    react(),
    keystatic(),
    sitemap({
      // Exclude the Keystatic admin and the noindex privacy page, so the
      // sitemap lists exactly the public pages we want crawled.
      filter: (page) => !page.includes('/keystatic') && !page.includes('/privacy-policy'),
    }),
  ],

  image: {
    // Build-time optimization to WebP/AVIF for the LCP target (guide Part 7.4).
    // Safe because every public page is prerendered; only /keystatic is on demand.
    service: { entrypoint: 'astro/assets/services/sharp' },
    responsiveStyles: true,
  },
});

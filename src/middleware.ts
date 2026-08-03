import { defineMiddleware } from 'astro:middleware';

/**
 * KEYSTATIC / ASTRO 7 COMPATIBILITY SHIM.
 *
 * `@keystatic/astro@5.2.0` reads `context.locals.runtime.env` to pick up the
 * three KEYSTATIC_GITHUB_* variables used by GitHub storage mode. Astro removed
 * that property in v6 and replaced it with a getter that throws, and the
 * package's optional chaining (`locals?.runtime?.env`) cannot catch a throwing
 * getter — so on Cloudflare every /api/keystatic request 500s before it reaches
 * Keystatic at all. The admin loads and then fails on its first read.
 *
 * Giving the route a plain `runtime.env` object satisfies the lookup. The three
 * variables are genuinely absent here: this site uses Keystatic Cloud storage,
 * where Keystatic Cloud handles auth and no GitHub app credentials exist. If
 * this template is ever switched to `storage: { kind: 'github' }`, read them
 * from `cloudflare:workers` env and pass them through here instead.
 *
 * Scoped to the Keystatic API paths so nothing else sees a fabricated runtime.
 * Remove once @keystatic/astro supports Astro 6+ natively.
 */
export const onRequest = defineMiddleware((context, next) => {
  if (context.url.pathname.startsWith('/api/keystatic')) {
    // `locals.runtime` itself is non-configurable, so replace the throwing
    // `env` getter on the object Astro already put there.
    const runtime = (context.locals as unknown as Record<string, unknown>).runtime;
    if (runtime && typeof runtime === 'object') {
      try {
        Object.defineProperty(runtime, 'env', { value: {}, configurable: true });
      } catch {
        // Left as-is: the route then fails the same way it does today, which is
        // loud rather than silent.
      }
    }
  }
  return next();
});

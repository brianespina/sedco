import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

import { site } from './config/site';

/**
 * CONTENT COLLECTIONS
 *
 * The guide's page specs and copy are stored as data, not markup: each entry
 * carries its own title tag, meta description, keywords, H1, body sections,
 * FAQ, CTA, and internal links. Routes render them through shared components,
 * so structure stays DRY while every page keeps its unique local copy.
 *
 * Blog posts are the exception — they are Markdown, because Keystatic edits
 * them.
 */

/** An internal link with the descriptive anchor text the guide specifies. */
const internalLink = z.object({
  href: z.string().startsWith('/'),
  anchor: z.string().min(1),
  /**
   * Where the template places this link:
   *  - `service`  Related Services card / prose
   *  - `city`     City pills ("in [city]" or "also serving nearby")
   *  - `combo`    Service x city child pages
   *  - `page`     Any other page (about, reviews, hubs, contact)
   */
  group: z.enum(['service', 'city', 'combo', 'page']).default('page'),
});

/** One body section: an H2 (or H3) with its paragraphs, list, and link pills. */
const section = z.object({
  heading: z.string().min(1),
  level: z.union([z.literal(2), z.literal(3)]).default(2),
  paragraphs: z.array(z.string()).default([]),
  list: z.array(z.string()).default([]),
  links: z.array(internalLink).default([]),
});

const faq = z.object({
  question: z.string().min(1),
  answer: z.array(z.string()).min(1),
});

/**
 * Fields shared by every guide-driven page. Title tag and meta description are
 * required and must be unique per page (guide Part 7.4).
 */
const pageSpec = {
  /** Title tag, verbatim from the page's spec block */
  title: z.string().min(1).max(120),
  /** Meta description, verbatim from the page's spec block */
  description: z.string().min(1).max(220),
  primaryKeyword: z.string().min(1),
  supportingKeywords: z.array(z.string()).default([]),

  /** The single H1 for the page */
  h1: z.string().min(1),
  /** Opening paragraph(s) that follow the H1 */
  intro: z.array(z.string()).min(1),

  /** Badge pill text above the H1 in the hero */
  heroBadge: z.string().optional(),

  sections: z.array(section).default([]),
  faqs: z.array(faq).default([]),
  /** The guide's FAQ H2, when it differs from the default */
  faqHeading: z.string().default('Frequently Asked Questions'),

  /** Closing CTA: the guide's final H2 and its paragraph */
  ctaHeading: z.string().min(1),
  ctaBody: z.string().min(1),

  internalLinks: z.array(internalLink).default([]),
};

const services = defineCollection({
  loader: glob({ base: './src/content/services', pattern: '**/*.yaml' }),
  schema: z.object({
    ...pageSpec,
    /** Must match a service slug in src/config/site.ts */
    service: z.string().min(1),
    /** Stat shown on the frosted hero card, e.g. "Same day" */
    heroStat: z.string().optional(),
    heroStatLabel: z.string().optional(),
    /** Green-check credential rows on the frosted hero card */
    heroPoints: z.array(z.string()).default([]),
  }),
});

const serviceAreas = defineCollection({
  loader: glob({ base: './src/content/service-areas', pattern: '**/*.yaml' }),
  schema: z.object({
    ...pageSpec,
    /** Must match a city slug in src/config/site.ts */
    city: z.string().min(1),
    heroStat: z.string().optional(),
    heroStatLabel: z.string().optional(),
    heroPoints: z.array(z.string()).default([]),
    /** Closing "Also serving nearby:" sentence, verbatim from the guide */
    alsoServing: z.string().optional(),
  }),
});

const serviceCity = defineCollection({
  loader: glob({ base: './src/content/service-city', pattern: '**/*.yaml' }),
  schema: z.object({
    ...pageSpec,
    /** Must match a service slug in src/config/site.ts */
    service: z.string().min(1),
    /** Must match a city slug in src/config/site.ts */
    city: z.string().min(1),
    heroStat: z.string().optional(),
    heroStatLabel: z.string().optional(),
    heroPoints: z.array(z.string()).default([]),
  }),
});

/**
 * Blog — Keystatic-managed. Title, meta description, and slug are required so
 * a client filling content cannot break the page's SEO structure.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.mdoc' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1).max(120),
      /** Meta description — required; the client cannot publish without it */
      metaDescription: z.string().min(1).max(220),
      /** Title tag override; falls back to `title` */
      seoTitle: z.string().max(120).optional(),
      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      /** Category pill shown on cards and above the post H1 */
      category: z.string().default('Plumbing Tips'),
      /** Card blurb on the blog index */
      excerpt: z.string().min(1).max(300),
      featuredImage: image().optional(),
      featuredImageAlt: z.string().default(''),
      author: z.string().default(site.business.name),
      /** Highlighted answer box near the top of the post (guide Part 8) */
      answerBox: z
        .object({
          question: z.string().min(1),
          answer: z.array(z.string()).min(1),
        })
        .optional(),
      /** The 2-3 deliberate internal links each post must carry */
      internalLinks: z.array(internalLink).default([]),
      /** Related posts for the "Keep Reading" sidebar */
      related: z.array(reference('blog')).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { services, serviceAreas, serviceCity, blog };

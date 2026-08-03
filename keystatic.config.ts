import { config, collection, fields, singleton } from '@keystatic/core';

import { site } from './src/config/site';

/**
 * KEYSTATIC — client-editable blog.
 *
 * Storage is Keystatic Cloud (one team/project per client), which also handles
 * admin authentication in production. For local editing without Keystatic
 * Cloud, see SETUP.md: swap `storage` to `{ kind: 'local' }`.
 *
 * The schema deliberately makes the SEO-critical fields required — title,
 * meta description, slug, and excerpt — so a client filling in content cannot
 * publish a post that breaks the page's SEO structure or layout. Body content
 * is Markdoc, so posts cannot inject arbitrary components.
 */
/**
 * STORAGE MODE is env-driven so nobody has to hand-edit this file and remember
 * to change it back. `KEYSTATIC_LOCAL=1 npm run dev` writes edits straight to
 * src/content/blog/ on disk with no Keystatic Cloud account; every other run —
 * including every build and deploy — uses Cloud.
 */
const useLocalStorage = process.env.KEYSTATIC_LOCAL === '1';

export default config({
  storage: useLocalStorage ? { kind: 'local' } : { kind: 'cloud' },
  cloud: { project: site.integrations.keystaticProject },

  ui: {
    brand: { name: site.business.name },
    navigation: {
      Content: ['posts'],
      'Business details': ['business'],
    },
  },

  singletons: {
    /**
     * BUSINESS DETAILS — the guide's Part 9 placeholder list, editable by the
     * client instead of by a developer. Written to
     * src/content/settings/business.json and merged into site.business /
     * site.profiles, so every page, CTA, footer and schema block picks the
     * change up on the next build.
     *
     * Deliberately absent: the trading name, the service-area locality, region
     * and county. The guide's copy is written around those, so changing one
     * would leave 52 pages contradicting the schema.
     *
     * Values still in [BRACKETS] render as dashed placeholder chips on the
     * page, so an unfilled field is visible rather than silently blank.
     */
    business: singleton({
      label: 'Business details',
      path: 'src/content/settings/business',
      format: { data: 'json' },
      schema: {
        phone: fields.text({
          label: 'Phone number',
          description:
            'One number, used in the header, every CTA, the footer and schema. Format it the way you want it read, e.g. (619) 555-0134.',
          validation: { isRequired: true },
        }),
        email: fields.text({
          label: 'Email address',
          description: 'Where contact-form notifications and enquiries go.',
          validation: { isRequired: true },
        }),
        license: fields.text({
          label: 'Contractor licence number',
          description: 'Shown on the About page, footer and service pages.',
          validation: { isRequired: true },
        }),
        licenseClass: fields.text({
          label: 'Licence class',
          description: 'C-36 for plumbing. Change only if the licence itself changes.',
          validation: { isRequired: true },
        }),
        yearFounded: fields.text({
          label: 'Year founded',
          description: 'Named in the About page and homepage copy, e.g. 1998.',
          validation: { isRequired: true },
        }),
        owner: fields.text({
          label: 'Owner name',
          description: 'Named in the About page copy.',
          validation: { isRequired: true },
        }),
        hours: fields.text({
          label: 'Business hours (as written)',
          description:
            'Printed in the footer, the contact page and FAQ answers, e.g. "Mon-Fri 7am-6pm, emergency service 24/7".',
          validation: { isRequired: true },
        }),
        hoursSchema: fields.text({
          label: 'Business hours (for search engines)',
          description:
            'The same hours in schema.org format, e.g. "Mo-Fr 07:00-18:00". Ask your developer if unsure.',
          validation: { isRequired: true },
        }),
        warranty: fields.text({
          label: 'Workmanship warranty',
          description: 'The exact terms, e.g. "1-year workmanship warranty". Do not paraphrase.',
          validation: { isRequired: true },
        }),
        estimatePolicy: fields.text({
          label: 'Estimate policy',
          description:
            'What a customer is charged before work starts, e.g. "Free estimates on replacements; flat diagnostic fee on repairs."',
          multiline: true,
          validation: { isRequired: true },
        }),
        postalCode: fields.text({
          label: 'ZIP code',
          description: 'Used in schema only — no street address is published.',
          validation: { isRequired: true },
        }),

        profiles: fields.object(
          {
            google: fields.text({
              label: 'Google Business Profile URL',
              description: 'Leave blank if you do not have one yet.',
            }),
            googleReview: fields.text({
              label: 'Google "write a review" link',
              description:
                'The direct review link from your Google Business Profile. The Reviews page button is hidden until this is set.',
            }),
            yelp: fields.text({ label: 'Yelp URL' }),
            facebook: fields.text({ label: 'Facebook URL' }),
          },
          {
            label: 'Profile links',
            description:
              'Linked in the footer and declared in search-engine schema. Blank fields are simply left out.',
          },
        ),
      },
    }),
  },

  collections: {
    posts: collection({
      label: 'Blog posts',
      path: 'src/content/blog/*',
      slugField: 'title',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'publishDate'],

      schema: {
        title: fields.slug({
          name: {
            label: 'Post title',
            description: 'Shown as the page H1. Keep it specific and local.',
            validation: { isRequired: true, length: { max: 120 } },
          },
          slug: {
            label: 'URL slug',
            description: 'Lowercase words separated by hyphens. Do not change after publishing.',
          },
        }),

        metaDescription: fields.text({
          label: 'Meta description',
          description:
            'The one-or-two-sentence summary Google shows in search results. Required, 150-160 characters is ideal.',
          multiline: true,
          validation: { isRequired: true, length: { min: 40, max: 220 } },
        }),

        seoTitle: fields.text({
          label: 'Title tag (optional)',
          description: 'Overrides the post title in the browser tab and search results.',
          validation: { isRequired: false, length: { max: 120 } },
        }),

        excerpt: fields.text({
          label: 'Card blurb',
          description: 'Shown on the blog index card.',
          multiline: true,
          validation: { isRequired: true, length: { min: 20, max: 300 } },
        }),

        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Plumbing Tips', value: 'Plumbing Tips' },
            { label: 'Costs & Pricing', value: 'Costs & Pricing' },
            { label: 'Water Quality', value: 'Water Quality' },
            { label: 'Leaks & Lines', value: 'Leaks & Lines' },
            { label: 'Water Heaters', value: 'Water Heaters' },
            { label: 'Seasonal', value: 'Seasonal' },
            { label: 'Local Guides', value: 'Local Guides' },
          ],
          defaultValue: 'Plumbing Tips',
        }),

        publishDate: fields.date({
          label: 'Publish date',
          validation: { isRequired: true },
        }),

        updatedDate: fields.date({
          label: 'Last updated (optional)',
        }),

        author: fields.text({
          label: 'Author',
          defaultValue: site.business.name,
        }),

        featuredImage: fields.image({
          label: 'Featured image',
          description: 'Lead image at the top of the post. Landscape, at least 1200px wide.',
          directory: 'src/assets/blog',
          publicPath: '../../assets/blog/',
        }),

        featuredImageAlt: fields.text({
          label: 'Featured image alt text',
          description: 'Plainly describe what the photo shows.',
        }),

        answerBox: fields.object(
          {
            question: fields.text({ label: 'Question' }),
            answer: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
              label: 'Answer paragraphs',
              itemLabel: (props) => props.value?.slice(0, 60) ?? 'Paragraph',
            }),
          },
          {
            label: 'Answer box',
            description:
              'The highlighted question answered in 2-3 direct sentences near the top of the post. Also emitted as FAQPage schema.',
          },
        ),

        internalLinks: fields.array(
          fields.object({
            href: fields.text({
              label: 'Path',
              description: 'Site-relative, e.g. /services/slab-leak-repair/',
              validation: { isRequired: true },
            }),
            anchor: fields.text({
              label: 'Anchor text',
              description: 'Describe the destination, e.g. "slab leak repair in La Mesa".',
              validation: { isRequired: true },
            }),
          }),
          {
            label: 'Internal links',
            description: 'Every post links to at least one service page and one city page.',
            itemLabel: (props) => props.fields.anchor.value || 'Link',
          },
        ),

        related: fields.array(
          fields.relationship({
            label: 'Related post',
            collection: 'posts',
          }),
          {
            label: 'Keep reading',
            description: 'Other posts to offer in the sidebar. Two or three is plenty.',
            itemLabel: (props) => props.value ?? 'Post',
          },
        ),

        draft: fields.checkbox({
          label: 'Draft',
          description: 'Drafts are excluded from the published site.',
          defaultValue: false,
        }),

        content: fields.markdoc({
          label: 'Post body',
          options: {
            image: {
              directory: 'src/assets/blog',
              publicPath: '../../assets/blog/',
            },
          },
        }),
      },
    }),
  },
});

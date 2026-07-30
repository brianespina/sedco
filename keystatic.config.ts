import { config, collection, fields } from '@keystatic/core';

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
export default config({
  storage: { kind: 'cloud' },
  cloud: { project: site.integrations.keystaticProject },

  ui: {
    brand: { name: `${site.business.name} — Blog` },
    navigation: {
      Content: ['posts'],
    },
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

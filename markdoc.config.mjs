import { defineMarkdocConfig, component } from '@astrojs/markdoc/config';

/**
 * Markdoc config for Keystatic-edited blog bodies.
 *
 * Deliberately minimal: clients get headings, lists, tables, images, and links
 * from Markdoc's defaults, plus one editorial `note` tag. There is no mechanism
 * to inject arbitrary components, so post content cannot break page layout or
 * SEO structure.
 */
export default defineMarkdocConfig({
  tags: {
    /**
     * {% note %}...{% /note %} — a visible editorial callout, used for
     * pre-launch reminders (e.g. pricing that must be confirmed with the
     * client) so they cannot ship unnoticed the way an HTML comment would.
     */
    note: {
      render: component('./src/components/blog/EditorialNote.astro'),
      attributes: {
        label: { type: String, required: false },
      },
    },
  },
});

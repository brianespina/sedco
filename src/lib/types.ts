/** Shared shapes used by components, content schemas, and JSON-LD builders. */

/** One FAQ entry. `answer` is an array so multi-paragraph answers stay intact. */
export interface Faq {
  question: string;
  answer: string[];
}

/** One breadcrumb. The current page's crumb has no `href`. */
export interface Crumb {
  name: string;
  href?: string;
}

/**
 * Where a template places an internal link. Matches the `group` field in the
 * content collections (see src/content.config.ts).
 */
export type LinkGroup = 'service' | 'city' | 'combo' | 'page';

/** An internal link with the descriptive anchor text the guide specifies. */
export interface InternalLink {
  href: string;
  anchor: string;
  group?: LinkGroup;
}

/** A body section of guide copy: an H2 (or H3) plus its paragraphs and list. */
export interface Section {
  heading: string;
  level?: 2 | 3;
  paragraphs?: string[];
  /** Bulleted list items, rendered after the paragraphs */
  list?: string[];
  /** Links rendered as pills after the list (e.g. "services in [city]") */
  links?: InternalLink[];
}

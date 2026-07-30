/**
 * REVIEWS — PLACEHOLDER CONTENT
 *
 * These are the design's sample reviews. Replace them with the client's real
 * reviews (curate 8-12 with first name, city, and service performed, per guide
 * Part 3), or wire up a live Google reviews feed.
 *
 * Deliberately NOT marked up with Review/AggregateRating schema: the guide
 * (Part 7.1) allows that only for genuine first-party reviews collected and
 * displayed on the site, never for reviews copied from Google.
 */

export interface Review {
  quote: string;
  /** First name and last initial, as displayed */
  name: string;
  /** "Service performed — City" */
  detail: string;
  /** City slug, so reviews can be grouped by area (guide Part 3) */
  city: string;
}

/** Set false once these are replaced with the client's real reviews. */
export const reviewsArePlaceholder = true;

export const reviews: Review[] = [
  {
    quote:
      'Showed up the same day, found the slab leak fast, and the price was exactly what they quoted. Left the place spotless.',
    name: 'Maria S.',
    detail: 'Slab leak repair — Santee',
    city: 'santee',
  },
  {
    quote:
      'Our water heater died on a Sunday. Sedco had a new one installed that afternoon and walked us through everything.',
    name: 'David R.',
    detail: 'Water heater replacement — La Mesa',
    city: 'la-mesa',
  },
  {
    quote:
      'Honest, on time, and no upsell. They cleared the main line and showed us the camera footage. Highly recommend.',
    name: 'Tanya G.',
    detail: 'Drain cleaning — Lakeside',
    city: 'lakeside',
  },
  {
    quote:
      'Repiped our 1960s house in El Cajon. Clean work, clear price, and the pressure is night and day.',
    name: 'James P.',
    detail: 'Repipe — El Cajon',
    city: 'el-cajon',
  },
  {
    quote:
      'Fixed a pinhole leak behind the wall and made it painless with our insurance. Genuinely kind crew.',
    name: 'Linda M.',
    detail: 'Copper leak — Rancho San Diego',
    city: 'rancho-san-diego',
  },
  {
    quote:
      'Trenchless sewer replacement without tearing up the whole yard. Explained every option first.',
    name: 'Robert C.',
    detail: 'Sewer line — La Mesa',
    city: 'la-mesa',
  },
  {
    quote:
      'New pressure regulator on our hillside place — no more banging pipes. Fair, fast, professional.',
    name: 'Ana V.',
    detail: 'Pressure regulator — Spring Valley',
    city: 'spring-valley',
  },
  {
    quote:
      'Grease trap service for our restaurant, right on schedule and inspection-ready. Reliable every time.',
    name: 'Marco D.',
    detail: 'Grease trap — El Cajon',
    city: 'el-cajon',
  },
  {
    quote: 'Tankless install done to code with the permit handled for us. Couldn’t ask for more.',
    name: 'Priya N.',
    detail: 'Tankless water heater — Santee',
    city: 'santee',
  },
];

/** The three excerpts the homepage shows. */
export const featuredReviews = reviews.slice(0, 3);

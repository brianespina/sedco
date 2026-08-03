/**
 * REVIEWS — curated from the client's third-party review profiles.
 *
 * SOURCES: Yelp (the six entries Yelp lists as "not currently recommended",
 * posted 13-20 Nov 2023) and Foursquare (surfaced through the client's Birdeye
 * aggregation, posted ~2023). Quotes are reproduced verbatim; names are
 * shortened to first name + last initial per guide Part 3.
 *
 * FLAG FOR THE CLIENT before launch:
 *  - The Yelp six sit in Yelp's filtered bucket and are excluded from the
 *    business's star rating. They were posted 5 stars each inside one week by
 *    accounts with no other review history. Confirm the client is comfortable
 *    republishing them, and prefer Yelp's *recommended* reviews and Google
 *    reviews as they become available.
 *  - `city` is null on every entry: none of the source reviews state a city,
 *    and the guide asks for the city the work was done in. The client can map
 *    each reviewer to the job address from their records. Until then the city
 *    tag simply does not render. `npm run verify` reports the count.
 *
 * Deliberately NOT marked up with Review/AggregateRating schema: the guide
 * (Part 7.1) allows that only for genuine first-party reviews collected and
 * displayed on the site, never for reviews copied from another platform.
 */

export interface Review {
  /** Verbatim review text, without surrounding quote marks */
  quote: string;
  /** First name and last initial, as displayed */
  name: string;
  /** Service performed, as described by the reviewer */
  service: string;
  /** City slug the work was done in — null until the client confirms it */
  city: string | null;
  /** Platform the review was published on, shown as attribution */
  source: 'Yelp' | 'Foursquare' | 'Google';
  /** Star rating, when the source displays one. Omitted when it does not. */
  rating?: number;
  /** Publication date as shown by the source (ISO where known) */
  date?: string;
}

/**
 * True while the reviews are the design's invented samples. Now false: the
 * entries below are real reviews from the client's public profiles.
 * `npm run verify` fails the build while this is true.
 */
export const reviewsArePlaceholder = false;

export const reviews: Review[] = [
  {
    quote:
      'Drain cleaning has never been so hassle-free until we called Sedco. They were able to schedule us right away, the service was quick, and there’s been no sign of clogging since. Total lifesavers!',
    name: 'Sam A.',
    service: 'Drain cleaning',
    city: null,
    source: 'Foursquare',
  },
  {
    quote:
      'Toilet repairs are often a nuisance, but Sedco Plumbing made the process painless. They were swift to respond, fix the issue, and leave everything spotless. Their service is truly first-rate.',
    name: 'Thomas C.',
    service: 'Toilet repair',
    city: null,
    source: 'Yelp',
    rating: 5,
    date: '2023-11-19',
  },
  {
    quote:
      'Sedco Plumbing’s team addressed my residential plumbing issues with such efficiency. They were punctual and courteous, and the quality of work was beyond satisfactory.',
    name: 'Kate S.',
    service: 'Residential plumbing repairs',
    city: null,
    source: 'Foursquare',
  },
  {
    quote:
      'For all-around general plumbing services, Sedco Plumbing is unparalleled. They’ve handled multiple jobs for me, each time with the utmost professionalism and attention to detail. Their team is always courteous and thorough.',
    name: 'Jim L.',
    service: 'General plumbing',
    city: null,
    source: 'Yelp',
    rating: 5,
    date: '2023-11-18',
  },
  {
    quote:
      'Sedco Plumbing has provided us with a top-tier water system. Their installation was quick, clean, and professional. The water tastes and feels better. A noticeable change that we’re all happy about.',
    name: 'John L.',
    service: 'Water filtration system installation',
    city: null,
    source: 'Foursquare',
  },
  {
    quote:
      'Water line repairs can be disruptive, but not with Sedco Plumbing. They were meticulous and efficient, ensuring minimal downtime for our business. Their friendly demeanor and technical know-how were impressive.',
    name: 'Arney L.',
    service: 'Water line repair',
    city: null,
    source: 'Yelp',
    rating: 5,
    date: '2023-11-17',
  },
  {
    quote:
      'Our kitchen remodel was a breeze, thanks to Sedco. Not a single pipe issue since installation! They worked neatly and quickly, and their expertise shone through.',
    name: 'Arney L.',
    service: 'Kitchen remodel plumbing',
    city: null,
    source: 'Foursquare',
  },
  {
    quote:
      'Superb bathroom plumbing services provided by Sedco. Their team not only arrived on time but also completed the work with a level of craftsmanship.',
    name: 'Curtis S.',
    service: 'Bathroom plumbing',
    city: null,
    source: 'Foursquare',
  },
  {
    quote:
      'We recently hired Sedco Plumbing for our commercial kitchen, and they surpassed all expectations. Not only did they install our grease traps efficiently, but their team also offered valuable maintenance advice to keep our systems running smoothly.',
    name: 'Alex M.',
    service: 'Grease trap installation',
    city: null,
    source: 'Yelp',
    rating: 5,
    date: '2023-11-20',
  },
  {
    quote:
      'If you’re dealing with grease traps, Sedco Plumbing is the company to call. They installed ours with such precision and cleanliness, and their service was quick without sacrificing quality. They’re definitely experts in their field.',
    name: 'Rob P.',
    service: 'Grease trap installation',
    city: null,
    source: 'Yelp',
    rating: 5,
    date: '2023-11-14',
  },
  {
    quote:
      'The commercial plumbing service from Sedco, especially with grease trap maintenance, has been stellar. They’ve proven to be reliable and knowledgeable, making them our preferred plumbing experts.',
    name: 'Sara M.',
    service: 'Grease trap maintenance',
    city: null,
    source: 'Foursquare',
  },
  {
    quote:
      'Sedco Plumbing truly excels in commercial plumbing services. They handled our complex systems with ease and expertise, ensuring everything was up to code. Their team’s professionalism and punctuality made the experience outstanding.',
    name: 'John K.',
    service: 'Commercial plumbing',
    city: null,
    source: 'Yelp',
    rating: 5,
    date: '2023-11-13',
  },
];

/** Reviews still waiting on a city, reported by `npm run verify`. */
export const reviewsMissingCity = reviews.filter((review) => !review.city).length;

/**
 * The three excerpts the homepage shows (guide Part 3: "Pull 3 short review
 * excerpts with first name + city"). Residential work leads, since the
 * homepage speaks to homeowners.
 */
export const featuredReviews = reviews.slice(0, 3);

/**
 * SEDCO PLUMBING — SINGLE SOURCE OF TRUTH
 * ---------------------------------------------------------------------------
 * Every client-specific value lives here. No component, page, or content file
 * may hardcode a phone number, email, license number, city, or service name.
 *
 * CLONING THIS SITE FOR A NEW CLIENT: edit this file, swap the content
 * collections in src/content/, replace the logo + photos in src/assets/, and
 * set the two integration keys (Keystatic Cloud project, Web3Forms key).
 * See SETUP.md for the full runbook.
 *
 * PLACEHOLDERS: fields still holding a `[BRACKETED]` token are unfilled. They
 * render as dashed "placeholder chips" everywhere they appear (per the design),
 * so anything missing is visible on the page instead of silently shipping.
 * Replace the token with the real value and the chip disappears site-wide.
 */

export type ServiceGroup = 'repairs' | 'water' | 'lines' | 'installs';
export type CityTier = 1 | 2 | 3 | 4;

/** A header nav item. `dropdown` marks the two mega-menu entries. */
export interface NavItem {
  label: string;
  href: string;
  dropdown?: 'services' | 'cities';
}

export interface ServiceDef {
  /** URL segment: /services/[slug]/ */
  slug: string;
  /** Full service name, as used in nav, cards, and Service schema serviceType */
  name: string;
  /** Shorter label for nav dropdowns and footer columns */
  navLabel: string;
  /** One-line description for the homepage card grid (guide Part 3) */
  cardLine: string;
  /** Card title on the Services hub, where the guide names some services differently */
  hubLabel: string;
  /** Distinct one-line description for the Services hub card (per the design) */
  hubLine: string;
  /** Which Services-hub section this card belongs to (guide Part 3) */
  group: ServiceGroup;
  /** City slugs that get a /services/[slug]/[city]/ child page */
  cities: string[];
}

export interface CityDef {
  /** URL segment: /service-areas/[slug]/ */
  slug: string;
  /** City name without state */
  name: string;
  /** Proximity/priority tier (guide Part 1) */
  tier: CityTier;
  /** One distinct descriptive line for the Service Areas hub card grid */
  descriptor: string;
  /** Named neighborhoods the guide's copy references for this city */
  neighborhoods: string[];
  /** Retail water provider named in this city's copy, or null when the guide names none */
  waterDistrict: string | null;
  /** "Also serving nearby" links at the foot of the city page */
  nearby: string[];
  /** Extra prose appended to a nearby link, e.g. "via our San Diego page" */
  nearbyNote?: string;
}

export const site = {
  /** Canonical origin. No trailing slash. */
  url: 'https://sedcoplumbing.com',

  business: {
    name: 'Sedco Plumbing',
    /** Contractor license class, e.g. C-36 for plumbing */
    licenseClass: 'C-36',

    // ---- PLACEHOLDERS: replace before launch (guide Part 9) ----
    phone: '[PHONE]',
    email: '[EMAIL]',
    license: '[LICENSE #]',
    yearFounded: '[YEAR FOUNDED]',
    owner: '[OWNER NAME]',
    /** Human-readable hours, as printed in copy and the footer */
    hours: '[HOURS]',
    /** Same hours in schema.org format, e.g. "Mo-Fr 07:00-18:00" */
    hoursSchema: '[HOURS]',
    warranty: '[WARRANTY TERMS]',
    estimatePolicy: '[ESTIMATE POLICY]',
    postalCode: '[ZIP]',
    // -----------------------------------------------------------

    /** Service-area business: locality/region only, street address hidden (guide Part 7) */
    locality: 'El Cajon',
    region: 'CA',
    regionName: 'California',
    country: 'US',
    county: 'San Diego County',
    priceRange: '$$',
    tagline: 'El Cajon, California',
  },

  profiles: {
    google: '[GOOGLE BUSINESS PROFILE URL]',
    /** Direct "write a review" link used by the Reviews page button */
    googleReview: '[GOOGLE REVIEW LINK]',
    yelp: '[YELP URL]',
    facebook: '[FACEBOOK URL]',
  },

  legal: {
    /**
     * Month and year printed as "Last updated" on the privacy policy. Bump it
     * when the policy text changes — never derive it from the build date, or
     * every deploy tells visitors the policy was revised when it was not.
     */
    privacyPolicyUpdated: 'July 2026',
    /**
     * Set true once the client has reviewed and approved the privacy policy
     * (with legal advice). `npm run verify` warns while this is false: the text
     * describes what the website collects, but only the client can confirm how
     * the business handles that data off the website.
     */
    privacyPolicyApproved: false,
  },

  integrations: {
    /** Web3Forms access key — set WEB3FORMS_ACCESS_KEY in .env / Cloudflare secrets */
    web3formsKey: import.meta.env.WEB3FORMS_ACCESS_KEY ?? '',
    /** Keystatic Cloud project, one team per client */
    keystaticProject: '[KEYSTATIC_TEAM]/[KEYSTATIC_PROJECT]',
    /** GA4 measurement ID, e.g. G-XXXXXXXXXX. Empty = no analytics injected. */
    ga4: '',
  },

  /** Header navigation, in order (guide Part 2) */
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services/', dropdown: 'services' },
    { label: 'Service Areas', href: '/service-areas/', dropdown: 'cities' },
    { label: 'About', href: '/about/' },
    { label: 'Reviews', href: '/reviews/' },
    { label: 'Blog', href: '/blog/' },
    { label: 'Contact', href: '/contact/' },
  ] satisfies NavItem[] as NavItem[],

  /**
   * Services-hub sections (guide Part 3). `slugs` fixes the card order the
   * guide specifies within each section, which differs from homepage order.
   */
  serviceGroups: [
    {
      id: 'repairs' as const,
      heading: 'Repairs & Emergency Work',
      glyph: '🔧',
      slugs: [
        'general-plumbing',
        'drain-cleaning',
        'toilet-repair-installation',
        'garbage-disposal',
        'faucet-services',
        'sink-services',
      ],
    },
    {
      id: 'water' as const,
      heading: 'Water Heaters & Water Quality',
      glyph: '🔥',
      slugs: ['water-heater', 'water-filtration', 'water-pressure-regulators'],
    },
    {
      id: 'lines' as const,
      heading: 'Leaks, Lines & Underground Work',
      glyph: '💧',
      slugs: ['slab-leak-repair', 'water-lines', 'sewer-lines', 'gas-lines'],
    },
    {
      id: 'installs' as const,
      heading: 'Installations & Remodels',
      glyph: '🛠️',
      slugs: ['shower-installation', 'kitchen-bath-remodels', 'grease-trap'],
    },
  ],

  /** All 16 services, in the guide's homepage card-grid order */
  services: [
    {
      slug: 'general-plumbing',
      name: 'General Plumbing',
      navLabel: 'General Plumbing',
      cardLine: 'General Plumbing Services — repairs, maintenance, and inspections',
      hubLabel: 'General Plumbing',
      hubLine: 'Repairs, installations, and emergencies for the whole system.',
      group: 'repairs',
      cities: [],
    },
    {
      slug: 'drain-cleaning',
      name: 'Drain Cleaning',
      navLabel: 'Drain Cleaning',
      cardLine: 'Drain Cleaning — clogged sinks, tubs, and main lines',
      hubLabel: 'Drain Cleaning',
      hubLine: 'Snaking, hydro jetting, and camera inspections for any line.',
      group: 'repairs',
      cities: ['la-mesa', 'santee', 'lakeside', 'spring-valley'],
    },
    {
      slug: 'toilet-repair-installation',
      name: 'Toilet Repair & Installation',
      navLabel: 'Toilet Repair & Installation',
      cardLine: 'Toilet Repair & Installation',
      hubLabel: 'Toilet Repair & Installation',
      hubLine: 'Running, leaking, clogged, or cleanly replaced.',
      group: 'repairs',
      cities: ['la-mesa', 'santee', 'lakeside', 'spring-valley'],
    },
    {
      slug: 'garbage-disposal',
      name: 'Garbage Disposal',
      navLabel: 'Garbage Disposal',
      cardLine: 'Garbage Disposal repair and replacement',
      hubLabel: 'Garbage Disposal',
      hubLine: 'Jams, leaks, and full replacements — often same day.',
      group: 'repairs',
      cities: [],
    },
    {
      slug: 'grease-trap',
      name: 'Grease Trap Services',
      navLabel: 'Grease Trap',
      cardLine: 'Grease Trap services for restaurants and commercial kitchens',
      hubLabel: 'Grease Trap (commercial)',
      hubLine: 'Pumping, cleaning, and repair for commercial kitchens.',
      group: 'installs',
      cities: [],
    },
    {
      slug: 'water-heater',
      name: 'Water Heater Repair & Installation',
      navLabel: 'Water Heater',
      cardLine: 'Water Heater repair, replacement, and tankless installation',
      hubLabel: 'Water Heater',
      hubLine: 'Repair, replacement, and tankless upgrades to code.',
      group: 'water',
      cities: ['la-mesa', 'santee', 'lakeside', 'spring-valley'],
    },
    {
      slug: 'water-filtration',
      name: 'Water Filtration Systems',
      navLabel: 'Water Filtration',
      cardLine: "Water Filtration Systems for East County's hard water",
      hubLabel: 'Water Filtration Systems',
      hubLine: 'Softeners and filtration for East County hard water.',
      group: 'water',
      cities: [],
    },
    {
      slug: 'sink-services',
      name: 'Sink Services',
      navLabel: 'Sink Services',
      cardLine: 'Sink Services — kitchen, bathroom, and utility',
      hubLabel: 'Sink Services',
      hubLine: 'Kitchen, bathroom, and utility sink repair and installs.',
      group: 'repairs',
      cities: [],
    },
    {
      slug: 'faucet-services',
      name: 'Faucet Repair & Installation',
      navLabel: 'Faucet Repair & Installation',
      cardLine: 'Faucet Repair & Installation',
      hubLabel: 'Faucet Services',
      hubLine: 'Drips and stuck valves fixed; new fixtures installed.',
      group: 'repairs',
      cities: [],
    },
    {
      slug: 'slab-leak-repair',
      name: 'Slab Leak Detection & Repair',
      navLabel: 'Slab Leak Detection & Repair',
      cardLine: 'Slab Leak Detection & Repair',
      hubLabel: 'Slab Leak Detection & Repair',
      hubLine: 'Electronic detection with minimal-dig repairs.',
      group: 'lines',
      cities: ['la-mesa', 'santee', 'lakeside', 'spring-valley'],
    },
    {
      slug: 'gas-lines',
      name: 'Gas Line Installation & Repair',
      navLabel: 'Gas Lines',
      cardLine: 'Gas Line installation and repair',
      hubLabel: 'Gas Lines',
      hubLine: 'Installation and repair, including shutoff valves.',
      group: 'lines',
      cities: [],
    },
    {
      slug: 'water-lines',
      name: 'Water Line Repair & Repiping',
      navLabel: 'Water Lines',
      cardLine: 'Water Line repair and repiping',
      hubLabel: 'Water Lines',
      hubLine: 'Repair and whole-home repiping for galvanized-era homes.',
      group: 'lines',
      cities: [],
    },
    {
      slug: 'sewer-lines',
      name: 'Sewer Line Repair & Replacement',
      navLabel: 'Sewer Lines',
      cardLine: 'Sewer Line repair and replacement',
      hubLabel: 'Sewer Lines',
      hubLine: 'Repair and replacement, with trenchless options.',
      group: 'lines',
      cities: ['la-mesa', 'santee', 'lakeside', 'spring-valley'],
    },
    {
      slug: 'water-pressure-regulators',
      name: 'Water Pressure Regulator Replacement',
      navLabel: 'Water Pressure Regulators',
      cardLine: 'Water Pressure Regulators',
      hubLabel: 'Water Pressure Regulators',
      hubLine: 'Replacement for high-pressure hillside lines.',
      group: 'water',
      cities: [],
    },
    {
      slug: 'shower-installation',
      name: 'Shower Installation & Remodel',
      navLabel: 'Shower Installation',
      cardLine: 'Shower Installation',
      hubLabel: 'Shower Installation',
      hubLine: 'New showers, walk-in conversions, and valve work.',
      group: 'installs',
      cities: [],
    },
    {
      slug: 'kitchen-bath-remodels',
      name: 'Kitchen & Bathroom Remodel Plumbing',
      navLabel: 'Kitchen & Bath Remodels',
      cardLine: 'Kitchen & Bath Remodel plumbing',
      hubLabel: 'Kitchen & Bath Remodels',
      hubLine: 'Rough-in and fixture setting, coordinated with your GC.',
      group: 'installs',
      cities: [],
    },
  ] satisfies ServiceDef[] as ServiceDef[],

  /** All 10 service-area cities, in the guide's hub order */
  cities: [
    {
      slug: 'el-cajon',
      name: 'El Cajon',
      tier: 1,
      descriptor: 'our hometown and home base',
      neighborhoods: ['Fletcher Hills', 'Bostonia', 'Granite Hills', 'Downtown El Cajon'],
      waterDistrict: 'Helix Water District',
      nearby: ['la-mesa', 'santee', 'lakeside', 'rancho-san-diego'],
    },
    {
      slug: 'la-mesa',
      name: 'La Mesa',
      tier: 2,
      descriptor: 'Mount Helix to La Mesa Village',
      neighborhoods: ['La Mesa Village', 'Mount Helix', 'Grossmont'],
      waterDistrict: 'Helix Water District',
      nearby: ['el-cajon', 'lemon-grove', 'spring-valley', 'san-diego'],
      nearbyNote: 'the College Area via our San Diego page',
    },
    {
      slug: 'santee',
      name: 'Santee',
      tier: 2,
      descriptor: 'Carlton Hills, Sky Ranch, and beyond',
      neighborhoods: ['Carlton Hills', 'Sky Ranch'],
      waterDistrict: 'Padre Dam Municipal Water District',
      nearby: ['lakeside', 'el-cajon', 'san-diego'],
      nearbyNote: 'San Carlos via our San Diego page',
    },
    {
      slug: 'lakeside',
      name: 'Lakeside',
      tier: 2,
      descriptor: 'including Winter Gardens and Eucalyptus Hills',
      neighborhoods: ['Eucalyptus Hills', 'Winter Gardens'],
      waterDistrict: 'Padre Dam Municipal Water District',
      nearby: ['santee', 'el-cajon', 'alpine'],
    },
    {
      slug: 'spring-valley',
      name: 'Spring Valley',
      tier: 2,
      descriptor: 'Casa de Oro, La Presa, Dictionary Hill',
      neighborhoods: ['Casa de Oro', 'La Presa', 'Dictionary Hill'],
      waterDistrict: 'Helix Water District and Otay Water District',
      nearby: ['la-mesa', 'lemon-grove', 'rancho-san-diego', 'jamul'],
    },
    {
      slug: 'lemon-grove',
      name: 'Lemon Grove',
      tier: 3,
      descriptor: "East County's classic bungalow neighborhoods",
      neighborhoods: [],
      waterDistrict: 'Helix Water District',
      nearby: ['la-mesa', 'spring-valley', 'san-diego'],
      nearbyNote: 'Rolando via our San Diego page',
    },
    {
      slug: 'alpine',
      name: 'Alpine',
      tier: 3,
      descriptor: 'rural East County properties, large lots, wells',
      neighborhoods: [],
      waterDistrict: 'Padre Dam Municipal Water District (plus private wells)',
      nearby: ['lakeside', 'jamul', 'el-cajon'],
    },
    {
      slug: 'rancho-san-diego',
      name: 'Rancho San Diego',
      tier: 3,
      descriptor: "Jamacha Valley's master-planned communities",
      neighborhoods: ['Jamacha Valley', 'Cuyamaca College area'],
      waterDistrict: 'Otay Water District',
      nearby: ['el-cajon', 'spring-valley', 'jamul'],
    },
    {
      slug: 'jamul',
      name: 'Jamul',
      tier: 3,
      descriptor: 'rural homes, septic systems, long private drives',
      neighborhoods: [],
      waterDistrict: 'Otay Water District (in part; wells elsewhere)',
      nearby: ['rancho-san-diego', 'spring-valley', 'alpine'],
    },
    {
      slug: 'san-diego',
      name: 'San Diego',
      tier: 4,
      descriptor: 'San Carlos, Del Cerro, Allied Gardens, College Area, Rolando',
      neighborhoods: ['San Carlos', 'Del Cerro', 'Allied Gardens', 'College Area', 'Rolando'],
      waterDistrict: null,
      nearby: ['la-mesa', 'lemon-grove', 'santee', 'el-cajon'],
    },
  ] satisfies CityDef[] as CityDef[],
} as const;

/* ---------------------------------------------------------------------------
 * Derived lookups — keep pages and components from re-deriving these.
 * ------------------------------------------------------------------------- */

export type Site = typeof site;

export const getService = (slug: string): ServiceDef => {
  const match = site.services.find((s) => s.slug === slug);
  if (!match) throw new Error(`Unknown service slug in site config: "${slug}"`);
  return match;
};

export const getCity = (slug: string): CityDef => {
  const match = site.cities.find((c) => c.slug === slug);
  if (!match) throw new Error(`Unknown city slug in site config: "${slug}"`);
  return match;
};

/** Services in a hub section, in the guide's specified card order. */
export const servicesByGroup = (group: ServiceGroup): ServiceDef[] => {
  const def = site.serviceGroups.find((g) => g.id === group);
  if (!def) throw new Error(`Unknown service group: "${group}"`);
  return def.slugs.map((slug) => getService(slug));
};

export const citiesByTier = (...tiers: CityTier[]): CityDef[] =>
  site.cities.filter((c) => tiers.includes(c.tier));

/** The service x city matrix, derived from services[].cities — the 20 combo pages. */
export const serviceCityPairs: { service: ServiceDef; city: CityDef }[] = site.services.flatMap(
  (service) => service.cities.map((citySlug) => ({ service, city: getCity(citySlug) })),
);

/** Sibling combos for the same city, used for the "across" internal link. */
export const siblingCombos = (serviceSlug: string, citySlug: string) =>
  serviceCityPairs.filter(
    (pair) => pair.city.slug === citySlug && pair.service.slug !== serviceSlug,
  );

/* ---------------------------------------------------------------------------
 * URL builders — the guide's URL rules live in one place (lowercase, hyphens,
 * trailing slash, no dates or params).
 * ------------------------------------------------------------------------- */

export const paths = {
  home: '/',
  about: '/about/',
  contact: '/contact/',
  reviews: '/reviews/',
  privacy: '/privacy-policy/',
  servicesHub: '/services/',
  service: (slug: string) => `/services/${slug}/`,
  serviceCity: (serviceSlug: string, citySlug: string) => `/services/${serviceSlug}/${citySlug}/`,
  areasHub: '/service-areas/',
  city: (slug: string) => `/service-areas/${slug}/`,
  blog: '/blog/',
  post: (slug: string) => `/blog/${slug}/`,
} as const;

/** Absolute URL for canonicals, og:url, and JSON-LD @id values. */
export const absolute = (path: string): string => new URL(path, site.url).href;

/**
 * Stable @id for the business entity. Every Service/schema block references
 * this rather than restating the business (guide Part 7.1).
 */
export const BUSINESS_ID = `${site.url}/#business`;

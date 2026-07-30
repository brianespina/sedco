/**
 * Image registry.
 *
 * Pages and components reference images by ROLE, never by filename, so
 * swapping in a client's real photos means editing only this file. Alt text
 * lives here too, keeping it descriptive and in one place.
 *
 * NOTE: every photo below is licensed stock from the design handoff and is a
 * PLACEHOLDER. Replace with the client's own trucks/techs/jobs before launch
 * (guide Part 7.4 asks for real local photos). The logo is the real brand mark.
 */

import { site } from '@config/site';

import logo from '../assets/images/sedco-plumbing-logo.jpeg';
import heroPlumber from '../assets/images/plumber-el-cajon-hero.jpg';
import plumberVertical from '../assets/images/licensed-plumber-el-cajon.jpg';
import serviceAreaMap from '../assets/images/plumbing-service-area-san-diego-county.jpg';
import pipeWork from '../assets/images/pipe-repair-el-cajon.jpg';
import underSink from '../assets/images/under-sink-plumbing-repair-el-cajon.jpg';
import bathSink from '../assets/images/bathroom-sink-fixtures-el-cajon.jpg';
import bathroom from '../assets/images/bathroom-remodel-plumbing-el-cajon.jpg';
import runningWater from '../assets/images/hard-water-east-county.jpg';

export interface SiteImage {
  src: ImageMetadata;
  alt: string;
}

export const images = {
  logo: {
    src: logo,
    alt: site.business.name,
  },
  /** Homepage hero background */
  heroHome: {
    src: heroPlumber,
    alt: 'Plumber working on a residential water line in El Cajon',
  },
  /** Service page hero background */
  heroService: {
    src: pipeWork,
    alt: 'Close-up of copper supply pipes during a plumbing repair',
  },
  /** City / service-area page hero background */
  heroCity: {
    src: serviceAreaMap,
    alt: 'Plumber servicing a bathroom in a San Diego County home',
  },
  /** Hub, blog, and core-page hero background */
  heroGeneral: {
    src: bathroom,
    alt: 'Bathroom fixtures in a remodeled East County home',
  },
  /** Full-bleed dark trust strip on the homepage */
  trustBand: {
    src: underSink,
    alt: 'Plumber tightening a fitting on an under-sink drain assembly',
  },
  /** "Why Sedco" vertical portrait */
  whyUs: {
    src: plumberVertical,
    alt: `Licensed ${site.business.name} technician at work`,
  },
  /** Services-section framed photo */
  servicesIntro: {
    src: bathSink,
    alt: 'Modern bathroom sink and fixtures',
  },
  /** Service-area map placeholder card */
  serviceAreaMap: {
    src: serviceAreaMap,
    alt: `${site.business.name} service area across ${site.business.county}`,
  },
  /** Blog lead image fallback */
  blogDefault: {
    src: runningWater,
    alt: 'Water running from a kitchen faucet',
  },
} satisfies Record<string, SiteImage>;

export type ImageRole = keyof typeof images;

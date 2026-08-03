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
 *
 * ALT TEXT describes what is actually in the frame and nothing more. It names
 * no city: these are stock photos shot somewhere unknown, so "in El Cajon"
 * would be a claim we cannot support — to a screen-reader user it is simply
 * false, and to a crawler it reads as keyword stuffing. Locations go back in
 * when the photos are the client's own. FILENAMES describe their contents for
 * the same reason. When the client's real photos replace these, name them on
 * the guide's SEO convention instead — service plus city, e.g.
 * `slab-leak-repair-el-cajon.jpg` — which is accurate once the photo really was
 * taken on an El Cajon job.
 */

import { site } from '@config/site';

import logo from '../assets/images/sedco-plumbing-logo.jpeg';
import heroPlumber from '../assets/images/plumber-under-sink-shutoff-valves.jpg';
import plumberVertical from '../assets/images/plumber-drain-trap-under-sink.jpg';
import bathroomPipes from '../assets/images/plumber-supply-pipes-tiled-bathroom.jpg';
import pipeWork from '../assets/images/brass-valve-fitting-wrench.jpg';
import kitchenFaucet from '../assets/images/kitchen-faucet-running-water.jpg';
import fullBathroom from '../assets/images/tiled-bathroom-tub-shower-sink-toilet.jpg';
import vesselSink from '../assets/images/vessel-sink-brass-faucet-bathroom.jpg';
import radiator from '../assets/images/radiator-threaded-connector.jpg';

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
    alt: 'Plumber reaching under a sink to work on the shutoff valves and drain trap',
  },
  /** Service page hero background */
  heroService: {
    src: pipeWork,
    alt: 'Hands tightening a threaded brass valve fitting with a wrench',
  },
  /** City / service-area page hero background */
  heroCity: {
    src: bathroomPipes,
    alt: 'Plumber working on supply pipes in a tiled bathroom',
  },
  /** Hub, blog, and core-page hero background */
  heroGeneral: {
    src: vesselSink,
    alt: 'Vessel sink with a brass faucet on a wood counter in a tiled bathroom',
  },
  /** Full-bleed dark trust strip on the homepage */
  trustBand: {
    src: kitchenFaucet,
    alt: 'Water running from a kitchen faucet into a dark sink',
  },
  /** "Why Sedco" vertical portrait */
  whyUs: {
    src: plumberVertical,
    alt: 'Plumber working on the drain trap beneath a sink',
  },
  /** Services-section framed photo */
  servicesIntro: {
    src: fullBathroom,
    alt: 'Bathtub, shower fixtures, wall-hung sink and toilet in a tiled bathroom',
  },
  /** Homepage service-area card background (decorative — see ServiceAreaMap.astro) */
  serviceAreaMap: {
    src: bathroomPipes,
    alt: 'Plumber working on supply pipes in a tiled bathroom',
  },
  /** Blog lead image fallback. The stock photo shows a radiator, which is not a
   *  fixture East County homes have — swap it when real photos arrive. */
  blogDefault: {
    src: radiator,
    alt: 'Gloved hands fitting a threaded connector to a white radiator',
  },
} satisfies Record<string, SiteImage>;

export type ImageRole = keyof typeof images;

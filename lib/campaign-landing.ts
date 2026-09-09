import services from '@/data/services.json';
import locations from '@/data/campaigns/locations.json';
import campaignOnlyServices from '@/data/campaigns/campaign-services.json';
import type { ServiceLandingData } from '@/components/ServiceLandingPage';

export type CampaignLocation = {
  slug: string;
  name: string;
  areasHeadline: string;
  areasBody: string;
  planningNote: string;
  travelLine: string;
  locationFaqs: { q: string; a: string }[];
};

export type CampaignService = {
  slug: string;
  name: string;
  shortName: string;
  headline: string;
  priceFrom: number;
  priceTo: number;
  buildWeeks: string;
  testimonialCategory: string;
  projectType: string;
  landing: ServiceLandingData;
};

const SEO_SERVICE_SLUGS = ['loft-conversions', 'extensions'] as const;

export const CAMPAIGN_LOCATIONS = locations as CampaignLocation[];

export const CAMPAIGN_SERVICE_SLUGS = [
  'loft-conversions',
  'extensions',
  'house-fit-outs',
  'new-builds',
] as const;

export type CampaignServiceSlug = (typeof CAMPAIGN_SERVICE_SLUGS)[number];
export type CampaignLocationSlug = 'london' | 'kent' | 'essex';

const SERVICE_EYEBROW_LABELS: Record<CampaignServiceSlug, string> = {
  'loft-conversions': 'Loft conversions',
  extensions: 'House extensions',
  'house-fit-outs': 'House fit outs',
  'new-builds': 'New builds',
};

function getBaseService(serviceSlug: CampaignServiceSlug): CampaignService {
  if (SEO_SERVICE_SLUGS.includes(serviceSlug as (typeof SEO_SERVICE_SLUGS)[number])) {
    const seo = services.find((s) => s.slug === serviceSlug);
    if (!seo) throw new Error(`SEO service not found: ${serviceSlug}`);
    return {
      slug: seo.slug,
      name: seo.name,
      shortName: seo.shortName,
      headline: seo.headline,
      priceFrom: seo.priceFrom,
      priceTo: seo.priceTo,
      buildWeeks: seo.buildWeeks,
      testimonialCategory: serviceSlug === 'loft-conversions' ? 'loft-conversion' : 'extension',
      projectType: serviceSlug === 'loft-conversions' ? 'loft-conversion' : 'extension',
      landing: { ...seo.landing, costLink: null },
    };
  }

  const campaign = campaignOnlyServices.find((s) => s.slug === serviceSlug);
  if (!campaign) throw new Error(`Campaign service not found: ${serviceSlug}`);
  return campaign as CampaignService;
}

function localiseHeroSub(sub: string, locationName: string, priceFrom: number, priceTo: number): string {
  const priceStr = `£${priceFrom.toLocaleString()} and £${priceTo.toLocaleString()}`;
  return sub
    .replace(/Hertfordshire and Essex/gi, locationName)
    .replace(/Hertfordshire & Essex/gi, locationName)
    .replace(/between £[\d,]+ and £[\d,]+/i, `between ${priceStr}`);
}

function localiseFinalCta(body: string, locationName: string): string {
  return body
    .replace(/Covering Hertfordshire and Essex\.?/gi, `Covering ${locationName}.`)
    .replace(/Hertfordshire and Essex/gi, locationName);
}

function localiseIntroParagraphs(
  paragraphs: string[],
  serviceSlug: CampaignServiceSlug,
  locationName: string,
): string[] {
  return paragraphs.map((para) => {
    let text = para
      .replace(/Hertfordshire and Essex/gi, locationName)
      .replace(/Hertfordshire & Essex/gi, locationName);

    // Extensions SEO copy says "nothing else" — keep on extension pages only
    if (serviceSlug === 'extensions') {
      text = text.replace(
        'J.Berry builds extensions and loft conversions, nothing else.',
        `J.Berry builds extensions across ${locationName}, director-led, one team from first visit to handover.`,
      );
    }

    return text;
  });
}

export function getCampaignLocation(slug: string): CampaignLocation | undefined {
  return CAMPAIGN_LOCATIONS.find((l) => l.slug === slug);
}

export function getCampaignService(serviceSlug: string): CampaignService | undefined {
  if (!CAMPAIGN_SERVICE_SLUGS.includes(serviceSlug as CampaignServiceSlug)) return undefined;
  return getBaseService(serviceSlug as CampaignServiceSlug);
}

export function buildCampaignLanding(
  locationSlug: string,
  serviceSlug: string,
): {
  service: CampaignService;
  location: CampaignLocation;
  landing: ServiceLandingData;
} | null {
  const location = getCampaignLocation(locationSlug);
  const service = getCampaignService(serviceSlug);
  if (!location || !service) return null;

  const eyebrowLabel = SERVICE_EYEBROW_LABELS[service.slug as CampaignServiceSlug];
  const base = service.landing;

  const areasHeadline = `${eyebrowLabel} across ${location.name}`;
  const areasBody = `${location.areasBody} ${location.planningNote}`;

  const landing: ServiceLandingData = {
    ...base,
    heroEyebrow: `${eyebrowLabel} · ${location.name}`,
    heroSub: localiseHeroSub(base.heroSub, location.name, service.priceFrom, service.priceTo),
    intro: localiseIntroParagraphs(base.intro, service.slug as CampaignServiceSlug, location.name),
    areasHeadline,
    areasBody,
    finalCtaBody: localiseFinalCta(
      base.finalCtaBody.replace(
        /A name, a number and a postcode is all we need to start\./,
        `${location.travelLine} A name, a number and a postcode is all we need to start.`,
      ),
      location.name,
    ),
    costLink: null,
    faqs: [...base.faqs, ...location.locationFaqs],
  };

  return { service, location, landing };
}

export function campaignStaticParams(): { location: string; service: string }[] {
  return CAMPAIGN_LOCATIONS.flatMap((loc) =>
    CAMPAIGN_SERVICE_SLUGS.map((svc) => ({ location: loc.slug, service: svc })),
  );
}

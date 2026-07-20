import type { Metadata } from 'next';
import services from '@/data/services.json';
import { serviceLandingSchema, faqSchema, JsonLd } from '@/lib/schema';
import { site } from '@/lib/site';
import ServiceLandingPage from '@/components/ServiceLandingPage';

const s = services.find((x) => x.slug === 'extensions')!;

export const metadata: Metadata = {
  title: `House Extensions in London, Kent & Essex, from £${(s.priceFrom / 1000).toFixed(0)}k`,
  description: `Director-led house extensions by ${site.name}. Single-storey, double-storey, wraparound and side-return, itemised quotations, the price we quote is the price you pay.`,
  alternates: { canonical: '/extensions' },
};

export default function ExtensionsPage() {
  return (
    <>
      <JsonLd data={serviceLandingSchema(s.name, s.priceFrom, s.priceTo, '/extensions')} />
      <JsonLd data={faqSchema(s.landing.faqs)} />
      <ServiceLandingPage
        serviceSlug={s.slug}
        serviceName={s.name}
        shortName={s.shortName}
        landing={s.landing}
      />
    </>
  );
}

import type { Metadata } from 'next';
import services from '@/data/services.json';
import { serviceLandingSchema, faqSchema, JsonLd } from '@/lib/schema';
import { site } from '@/lib/site';
import type { Testimonial } from '@/lib/testimonials';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import { sanityFetch } from '@/sanity/live';
import { TESTIMONIALS_BY_CATEGORY_QUERY } from '@/sanity/queries';

const s = services.find((x) => x.slug === 'extensions')!;

export const metadata: Metadata = {
  title: `House Extensions in London, Kent & Essex, from £${(s.priceFrom / 1000).toFixed(0)}k`,
  description: `Director-led house extensions by ${site.name}. Single-storey, double-storey, wraparound and side-return, itemised quotations, the price we quote is the price you pay.`,
  alternates: { canonical: '/extensions' },
};

export default async function ExtensionsPage() {
  const { data } = await sanityFetch({
    query: TESTIMONIALS_BY_CATEGORY_QUERY,
    params: { category: 'extension' },
  });
  const testimonials = (data || []) as Testimonial[];

  return (
    <>
      <JsonLd data={serviceLandingSchema(s.name, s.priceFrom, s.priceTo, '/extensions')} />
      <JsonLd data={faqSchema(s.landing.faqs)} />
      <ServiceLandingPage
        serviceSlug={s.slug}
        serviceName={s.name}
        shortName={s.shortName}
        landing={s.landing}
        testimonials={testimonials}
      />
    </>
  );
}

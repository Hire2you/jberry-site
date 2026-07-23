import type { Metadata } from 'next';
import services from '@/data/services.json';
import { serviceLandingSchema, faqSchema, JsonLd } from '@/lib/schema';
import { site } from '@/lib/site';
import type { Testimonial } from '@/lib/testimonials';
import ServiceLandingPage from '@/components/ServiceLandingPage';
import { sanityFetch } from '@/sanity/live';
import { TESTIMONIALS_BY_CATEGORY_QUERY } from '@/sanity/queries';

const s = services.find((x) => x.slug === 'loft-conversions')!;

export const metadata: Metadata = {
  title: `Loft Conversions in London, Kent & Essex, from £${(s.priceFrom / 1000).toFixed(0)}k`,
  description: `Director-led loft conversions by ${site.name}. Dormer, hip-to-gable, mansard and Velux, itemised quotations, the price we quote is the price you pay.`,
  alternates: { canonical: '/loft-conversions' },
};

export default async function LoftConversionsPage() {
  const { data } = await sanityFetch({
    query: TESTIMONIALS_BY_CATEGORY_QUERY,
    params: { category: 'loft-conversion' },
  });
  const testimonials = (data || []) as Testimonial[];

  return (
    <>
      <JsonLd data={serviceLandingSchema(s.name, s.priceFrom, s.priceTo, '/loft-conversions')} />
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

import type { Metadata } from 'next';
import hub from '@/data/county-hubs/loft-kent.json';
import { countyServiceSchema, breadcrumbSchema, faqSchema, JsonLd } from '@/lib/schema';
import CountyHubLanding from '@/components/CountyHubLanding';

export const metadata: Metadata = {
  title: { absolute: hub.seo.title },
  description: hub.seo.description,
  alternates: { canonical: hub.seo.canonical },
  openGraph: {
    title: hub.seo.title,
    description: hub.seo.description,
    url: hub.seo.canonical,
    images: [{ url: hub.hero.image.src, alt: hub.hero.image.alt }],
  },
};

export default function KentLoftConversionsPage() {
  return (
    <>
      <JsonLd
        data={countyServiceSchema({
          serviceType: 'Loft conversions',
          areaName: hub.county,
          path: hub.seo.canonical,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Loft Conversions', path: '/loft-conversions' },
          { name: 'Kent', path: '/loft-conversions/kent' },
        ])}
      />
      <JsonLd data={faqSchema(hub.faqs)} />
      <CountyHubLanding data={hub} />
    </>
  );
}

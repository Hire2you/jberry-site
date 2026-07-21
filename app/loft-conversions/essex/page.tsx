import type { Metadata } from 'next';
import hub from '@/data/county-hubs/loft-essex.json';
import { countyServiceSchema, breadcrumbSchema, faqSchema, JsonLd } from '@/lib/schema';
import CountyHubLanding from '@/components/CountyHubLanding';

export const metadata: Metadata = {
  title: { absolute: hub.seo.title },
  description: hub.seo.description,
  alternates: { canonical: hub.seo.canonical },
};

export default function EssexLoftConversionsPage() {
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
          { name: hub.county, path: hub.seo.canonical },
        ])}
      />
      <JsonLd data={faqSchema(hub.faqs)} />
      <CountyHubLanding data={hub} />
    </>
  );
}

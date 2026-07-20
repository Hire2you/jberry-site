import { site } from './site';

// JSON-LD builders — same dual-schema pattern as the SMCT location pages
export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: site.name,
    url: site.domain,
    telephone: site.phone,
    founder: { '@type': 'Person', name: site.director },
    address: { '@type': 'PostalAddress', addressLocality: 'Sawbridgeworth', addressRegion: 'Hertfordshire', postalCode: 'CM21', addressCountry: 'GB' },
    areaServed: site.areaServed.map((a) => ({ '@type': 'AdministrativeArea', name: a })),
  };
}

export function serviceSchema(serviceName: string, locationName: string, priceFrom: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${serviceName} in ${locationName}`,
    provider: { '@type': 'HomeAndConstructionBusiness', name: site.name },
    areaServed: { '@type': 'City', name: locationName },
    offers: { '@type': 'Offer', priceCurrency: 'GBP', price: priceFrom, description: 'Guide price from' },
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

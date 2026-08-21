import { site } from './site';

// JSON-LD builders — same dual-schema pattern as the SMCT location pages
function e164Phone(phone: string) {
  return `+44${phone.replace(/^0/, '').replace(/\s/g, '')}`;
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: site.name,
    url: site.domain,
    telephone: e164Phone(site.phone),
    email: site.email,
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

export function serviceLandingSchema(serviceName: string, priceFrom: number, priceTo: number, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    url: `${site.domain}${path}`,
    provider: { '@type': 'HomeAndConstructionBusiness', name: site.name, telephone: site.phone },
    areaServed: site.areaServed.map((a) => ({ '@type': 'AdministrativeArea', name: a })),
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'GBP',
      lowPrice: priceFrom,
      highPrice: priceTo,
      description: 'Itemised fixed-price quotation',
    },
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

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${site.domain}${item.path === '/' ? '' : item.path}`,
    })),
  };
}

/** Town landing Service schema: scoped to one City (e.g. Chelmsford). */
export function townServiceSchema({
  serviceType,
  townName,
  path,
}: {
  serviceType: string;
  townName: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    provider: {
      '@type': 'GeneralContractor',
      name: site.name,
      url: site.domain,
      telephone: e164Phone(site.phone),
      address: {
        '@type': 'PostalAddress',
        streetAddress: '19 Mansfield, High Wych',
        addressLocality: 'Sawbridgeworth',
        addressRegion: 'Hertfordshire',
        postalCode: 'CM21 0JT',
        addressCountry: 'GB',
      },
    },
    areaServed: { '@type': 'City', name: townName },
    url: `${site.domain}${path}`,
  };
}

/** County-hub Service schema: scoped to one AdministrativeArea (e.g. Essex). */
export function countyServiceSchema({
  serviceType,
  areaName,
  path,
  areaType,
}: {
  serviceType: string;
  areaName: string;
  path: string;
  areaType?: 'AdministrativeArea' | 'City';
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType,
    provider: {
      '@type': 'GeneralContractor',
      name: site.name,
      telephone: e164Phone(site.phone),
      address: {
        '@type': 'PostalAddress',
        streetAddress: '19 Mansfield, High Wych',
        addressLocality: 'Sawbridgeworth',
        addressRegion: 'Hertfordshire',
        postalCode: 'CM21 0JT',
        addressCountry: 'GB',
      },
    },
    areaServed: {
      '@type': areaType ?? 'AdministrativeArea',
      name: areaName,
    },
    url: `${site.domain}${path}`,
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

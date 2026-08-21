import type {MetadataRoute} from 'next'
import services from '@/data/services.json'
import {normalizeLocationSlug} from '@/lib/location-page'
import {site} from '@/lib/site'
import {sanityFetch} from '@/sanity/live'
import {LOCATION_PAGES_FOR_SITEMAP_QUERY, POST_SLUGS_QUERY} from '@/sanity/queries'

type SitemapLocation = {
  slug: string
  serviceType: 'extension' | 'loft-conversion' | 'both'
}

function locationSitemapEntries(docs: SitemapLocation[]): MetadataRoute.Sitemap {
  const urls = new Set<string>()

  for (const doc of docs) {
    const slug = normalizeLocationSlug(doc.slug)
    if (!slug) continue

    if (doc.serviceType === 'extension' || doc.serviceType === 'both') {
      urls.add(`${site.domain}/extensions/${slug}`)
    }
    if (doc.serviceType === 'loft-conversion' || doc.serviceType === 'both') {
      // County hub lives at /loft-conversions/essex — skip duplicate town slug
      if (slug === 'essex') continue
      urls.add(`${site.domain}/loft-conversions/${slug}`)
    }
  }

  return [...urls].sort().map((url) => ({
    url,
    changeFrequency: 'monthly' as const,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const servicePages = services.map((s) => ({
    url: `${site.domain}/${s.slug}`,
    changeFrequency: 'weekly' as const,
  }))

  const [{data: postData}, {data: locationData}] = await Promise.all([
    sanityFetch({
      query: POST_SLUGS_QUERY,
      perspective: 'published',
      stega: false,
    }),
    sanityFetch({
      query: LOCATION_PAGES_FOR_SITEMAP_QUERY,
      perspective: 'published',
      stega: false,
    }),
  ])

  const blogPages = ((postData || []) as Array<{slug: string}>).map((post) => ({
    url: `${site.domain}/blog/${post.slug}`,
    changeFrequency: 'monthly' as const,
  }))

  const locationPages = locationSitemapEntries((locationData || []) as SitemapLocation[])

  const countyHubs = [
    {url: `${site.domain}/loft-conversions/essex`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/chelmsford`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/chigwell`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/ongar`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/loughton`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/brentwood`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/epping`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/braintree`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/witham`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/maldon`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/colchester`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/basildon`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/billericay`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/wickford`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/harlow`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/grays`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/extensions/essex/leigh-on-sea`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/loft-conversions/essex/chelmsford`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/loft-conversions/essex/grays`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/loft-conversions/essex/leigh-on-sea`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/loft-conversions/essex/loughton`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/loft-conversions/essex/southend-on-sea`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/loft-conversions/essex/billericay`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/loft-conversions/essex/braintree`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/loft-conversions/essex/buckhurst-hill`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/loft-conversions/essex/colchester`, changeFrequency: 'monthly' as const},
    {url: `${site.domain}/loft-conversions/essex/witham`, changeFrequency: 'monthly' as const},
  ]

  return [
    {url: site.domain, changeFrequency: 'weekly'},
    ...servicePages,
    ...countyHubs,
    {url: `${site.domain}/cost-guides/loft-conversion-cost`, changeFrequency: 'monthly'},
    {url: `${site.domain}/blog`, changeFrequency: 'weekly'},
    {url: `${site.domain}/blog/house-extension-cost-guide`, changeFrequency: 'monthly'},
    {url: `${site.domain}/blog/how-long-does-a-house-extension-take`, changeFrequency: 'monthly'},
    {url: `${site.domain}/blog/how-long-does-a-loft-conversion-take`, changeFrequency: 'monthly'},
    ...blogPages,
    {url: `${site.domain}/contact`, changeFrequency: 'yearly'},
    ...locationPages,
  ]
}

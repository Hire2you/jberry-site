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
  ]

  return [
    {url: site.domain, changeFrequency: 'weekly'},
    ...servicePages,
    ...countyHubs,
    {url: `${site.domain}/cost-guides/loft-conversion-cost`, changeFrequency: 'monthly'},
    {url: `${site.domain}/blog`, changeFrequency: 'weekly'},
    ...blogPages,
    {url: `${site.domain}/contact`, changeFrequency: 'yearly'},
    ...locationPages,
  ]
}

export type LocationPage = {
  _id: string
  town: string
  county: string
  serviceType: 'extension' | 'loft-conversion' | 'both'
  slug: string
  active?: boolean
}

/** Resolve a locationPage slug into an href for the current service landing page. */
export function locationPageHref(location: LocationPage, serviceSlug: string) {
  const raw = location.slug.trim()
  if (raw.startsWith('/')) return raw
  return `/${serviceSlug}/${raw.replace(/^\/+/, '')}`
}

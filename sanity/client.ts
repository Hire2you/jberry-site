import {createClient} from 'next-sanity'
import {apiVersion, dataset, projectId} from './env'

const studioUrl =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_URL ||
  (process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : 'https://jberryextensions.sanity.studio')

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: {
    studioUrl,
  },
})

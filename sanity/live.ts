import {defineLive} from 'next-sanity/live'
import {client} from './client'

/**
 * Viewer/read token enables draft content + stega in Draft Mode.
 * Without it, published content still works; Presentation preview will not.
 */
const token = process.env.SANITY_API_READ_TOKEN

export const {sanityFetch, SanityLive} = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})

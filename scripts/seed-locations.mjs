import {createClient} from 'next-sanity'
import {readFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const existing = JSON.parse(readFileSync(join(__dirname, '../data/locations.json'), 'utf8'))

/**
 * Seed the existing town pages as locationPage documents.
 * serviceType 'both' + town slug means each page builds /extensions/{slug} or /loft-conversions/{slug}.
 */
const SEED = existing.map((loc) => ({
  town: loc.name,
  county: loc.county,
  serviceType: 'both',
  slug: loc.slug,
  active: true,
}))

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error(
    'Missing SANITY_API_WRITE_TOKEN. Create a token with Editor access in Sanity Manage → API → Tokens.',
  )
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'jlv5r4w7',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-05-15',
  token,
  useCdn: false,
})

async function seed() {
  const existingTowns = await client.fetch(`*[_type == "locationPage"].town`)
  const existingSet = new Set(existingTowns || [])

  let created = 0
  let skipped = 0

  for (const item of SEED) {
    if (existingSet.has(item.town)) {
      console.log(`Skip (already exists): ${item.town}`)
      skipped += 1
      continue
    }

    const doc = await client.create({
      _type: 'locationPage',
      town: item.town,
      county: item.county,
      serviceType: item.serviceType,
      slug: item.slug,
      active: item.active,
    })

    console.log(`Created: ${item.town} (${doc._id}) → slug "${item.slug}"`)
    created += 1
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped}.`)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

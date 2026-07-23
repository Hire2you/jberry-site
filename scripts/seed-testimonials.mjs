import {createClient} from 'next-sanity'
import {readFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const existing = JSON.parse(readFileSync(join(__dirname, '../data/testimonials.json'), 'utf8'))

/**
 * Maps the original hardcoded testimonials into Sanity documents.
 * Categories are assigned so homepage / extensions / loft pages have content.
 */
const SEED = [
  {
    ...existing[0],
    category: 'extension',
    featured: true,
  },
  {
    ...existing[1],
    category: 'loft-conversion',
    featured: true,
  },
  {
    ...existing[2],
    category: 'extension',
    featured: true,
  },
  {
    ...existing[3],
    category: 'extension',
    featured: true,
  },
]

const token = process.env.SANITY_API_WRITE_TOKEN
if (!token) {
  console.error('Missing SANITY_API_WRITE_TOKEN. Create a token with Editor access in Sanity Manage → API → Tokens.')
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
  const existingNames = await client.fetch(`*[_type == "testimonial"].customerName`)
  const existingSet = new Set(existingNames || [])

  let created = 0
  let skipped = 0

  for (const item of SEED) {
    if (existingSet.has(item.name)) {
      console.log(`Skip (already exists): ${item.name}`)
      skipped += 1
      continue
    }

    const doc = await client.create({
      _type: 'testimonial',
      quote: item.quote,
      customerName: item.name,
      location: item.location || '',
      projectType: item.project,
      highlightTag: item.highlight || '',
      category: item.category,
      featured: item.featured,
    })

    console.log(`Created: ${item.name} (${doc._id})`)
    created += 1
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped}.`)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

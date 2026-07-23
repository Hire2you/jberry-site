import {createClient} from 'next-sanity'
import {createReadStream, existsSync} from 'node:fs'
import {basename, dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const LOCAL_IMAGES = join(__dirname, '../public/images')
const LIVE_ORIGIN = process.env.SEED_IMAGE_ORIGIN || 'https://jberry-construction.vercel.app'

/**
 * Existing hardcoded ProjectCarousel slides, mapped to the new Project schema.
 */
const SEED = [
  {
    title: 'Rear extension',
    location: 'Essex',
    projectType: 'extension',
    subType: 'Rear extension',
    imagePath: '/images/extension-rear-bifolds.webp',
    alt: 'Full-width rear extension with bifold doors',
    featured: true,
    displayOrder: 1,
  },
  {
    title: 'Dormer loft conversion',
    location: 'Essex',
    projectType: 'loft-conversion',
    subType: 'Dormer loft conversion',
    imagePath: '/images/loft-dormer-front.webp',
    alt: 'Contemporary clad dormer loft conversion',
    featured: true,
    displayOrder: 2,
  },
  {
    title: 'Orangery extension',
    location: 'Hertfordshire',
    projectType: 'extension',
    subType: 'Orangery extension',
    imagePath: '/images/extension-orangery.webp',
    alt: 'Orangery-style extension to a period property',
    featured: true,
    displayOrder: 3,
  },
  {
    title: 'Loft conversion',
    location: 'South Woodford',
    projectType: 'loft-conversion',
    subType: 'Loft conversion',
    imagePath: '/images/loft-wardrobes.webp',
    alt: 'Loft bedroom with full-length built-in wardrobes',
    featured: true,
    displayOrder: 4,
  },
  {
    title: 'Garden room',
    location: 'Hertfordshire',
    projectType: 'extension',
    subType: 'Garden room',
    imagePath: '/images/barn-garden-room.webp',
    alt: 'Garden room with exposed timber frame',
    featured: true,
    displayOrder: 5,
  },
]

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

async function loadImageBuffer(imagePath) {
  const filename = basename(imagePath)
  const localPath = join(LOCAL_IMAGES, filename)

  if (existsSync(localPath)) {
    return {stream: createReadStream(localPath), filename, source: localPath}
  }

  const url = `${LIVE_ORIGIN}${imagePath}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to download ${url} (${res.status})`)
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  return {stream: buffer, filename, source: url}
}

async function seed() {
  const existingTitles = await client.fetch(`*[_type == "project"].title`)
  const existingSet = new Set(existingTitles || [])

  let created = 0
  let skipped = 0

  for (const item of SEED) {
    if (existingSet.has(item.title)) {
      console.log(`Skip (already exists): ${item.title}`)
      skipped += 1
      continue
    }

    console.log(`Uploading image for ${item.title}...`)
    const {stream, filename, source} = await loadImageBuffer(item.imagePath)
    const asset = await client.assets.upload('image', stream, {filename})
    console.log(`  Image from ${source} → ${asset._id}`)

    const doc = await client.create({
      _type: 'project',
      title: item.title,
      location: item.location,
      projectType: item.projectType,
      subType: item.subType,
      featured: item.featured,
      displayOrder: item.displayOrder,
      mainImage: {
        _type: 'image',
        alt: item.alt,
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
    })

    console.log(`Created: ${item.title} (${doc._id})`)
    created += 1
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped}.`)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})

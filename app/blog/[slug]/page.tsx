import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from 'next-sanity'
import {
  coverImageAlt,
  coverImageUrl,
  formatPostDate,
  readingMinutes,
  type BlogPost,
} from '@/lib/blog'
import {site} from '@/lib/site'
import {JsonLd} from '@/lib/schema'
import QuoteBand from '@/components/QuoteBand'
import {sanityFetch} from '@/sanity/live'
import {POST_QUERY, POST_SLUGS_QUERY} from '@/sanity/queries'

type Props = {params: Promise<{slug: string}>}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: POST_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })

  return ((data || []) as Array<{slug: string}>).map((post) => ({slug: post.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: POST_QUERY,
    params: {slug},
    stega: false,
  })
  const post = data as BlogPost | null
  if (!post) return {}

  const imageUrl = coverImageUrl(post.coverImage)

  return {
    title: post.title,
    description: post.description,
    alternates: {canonical: `/blog/${post.slug}`},
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author] : undefined,
      images: [{url: imageUrl}],
    },
  }
}

function blogPostingSchema(post: BlogPost, imageUrl: string) {
  const absoluteImage = imageUrl.startsWith('http') ? imageUrl : `${site.domain}${imageUrl}`

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    image: absoluteImage,
    url: `${site.domain}/blog/${post.slug}`,
    author: { '@type': 'Person', name: post.author || site.director },
    publisher: { '@type': 'HomeAndConstructionBusiness', name: site.name },
  }
}

export default async function BlogPostPage({params}: Props) {
  const {slug} = await params
  const {data} = await sanityFetch({
    query: POST_QUERY,
    params: {slug},
  })
  const post = data as BlogPost | null
  if (!post) notFound()

  const imageUrl = coverImageUrl(post.coverImage, 2400, 1350)
  const minutes = readingMinutes(post.plainText)
  const author = post.author || site.director

  return (
    <>
      <JsonLd data={blogPostingSchema(post, imageUrl)} />

      <section className="relative">
        <div className="relative flex min-h-[52svh] w-full flex-col justify-end">
          <Image
            src={imageUrl}
            alt={coverImageAlt(post.coverImage, post.title)}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] from-[6%] via-black/70 via-[50%] to-black/40" />
          <div className="relative">
            <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-24 md:pt-32">
              {post.category && (
                <p className="eyebrow !text-[#EBCF8E] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] md:[text-shadow:none]">
                  {post.category}
                </p>
              )}
              <h1 className="mt-3 max-w-3xl text-4xl leading-[1.08] text-white md:text-5xl md:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                {post.title}
              </h1>
              <p className="mt-4 text-xs font-semibold uppercase tracking-eyebrow text-white/80">
                {formatPostDate(post.publishedAt)} · {minutes} min read · By {author}
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-14 md:py-20">
        <div className="prose prose-stone max-w-none prose-headings:font-display prose-headings:font-normal prose-headings:text-ink prose-p:text-stone prose-p:leading-relaxed prose-li:text-stone prose-strong:text-ink prose-a:font-semibold prose-a:text-ink prose-a:underline prose-a:decoration-gold prose-a:underline-offset-4 hover:prose-a:text-goldDeep prose-blockquote:border-l-gold prose-blockquote:font-display prose-blockquote:text-xl prose-blockquote:italic prose-blockquote:text-ink prose-em:font-display prose-em:text-ink prose-hr:border-line">
          {Array.isArray(post.body) && post.body.length > 0 ? (
            <PortableText value={post.body} />
          ) : null}
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <p className="eyebrow">Written by</p>
          <p className="mt-3 font-display text-2xl">{author}</p>
          <p className="mt-2 text-sm leading-relaxed text-stone">
            Director of {site.name}. Every J.Berry project — extension or loft conversion — is
            personally surveyed, quoted and run by {site.director}, from first site visit to
            handover.
          </p>
          <p className="mt-4 text-sm text-stone">
            <Link
              href="/blog"
              className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
            >
              ← All articles
            </Link>
          </p>
        </div>
      </article>

      <QuoteBand
        eyebrow="Thinking about your own project?"
        heading="Get a straight answer for your home"
        text={`Articles are general, your house is specific. Tell us what you're planning and ${site.director} will call you back, usually the same working day.`}
      />
    </>
  )
}

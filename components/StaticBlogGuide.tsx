import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/lib/site'
import { faqSchema, JsonLd } from '@/lib/schema'
import { formatPostDate, readingMinutes } from '@/lib/blog'
import QuoteBand from '@/components/QuoteBand'
import FaqSection from '@/components/FaqSection'

export type StaticGuideBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'callout'; label: string; text: string }
  | { type: 'image'; src: string; alt: string; caption?: string }

export type StaticGuideData = {
  slug: string
  title: string
  metaTitle: string
  description: string
  publishedAt: string
  category: string
  author: string
  coverSrc: string
  coverAlt: string
  coverCaption?: string
  blocks: StaticGuideBlock[]
  faqs: { q: string; a: string }[]
  relatedLinks: { href: string; label: string }[]
  cta: { eyebrow: string; heading: string; text: string }
  plainText: string
}

function blogPostingSchema(post: StaticGuideData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: `${site.domain}${post.coverSrc}`,
    author: { '@type': 'Person', name: post.author || site.director },
    publisher: {
      '@type': 'HomeAndConstructionBusiness',
      name: site.name,
      url: site.domain,
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${site.domain}/blog/${post.slug}`,
    },
  }
}

function Callout({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside className="my-8 border-l-2 border-gold bg-ivory px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-eyebrow text-goldDeep">{label}</p>
      <div className="mt-2 text-stone leading-relaxed">{children}</div>
    </aside>
  )
}

export default function StaticBlogGuide({ data }: { data: StaticGuideData }) {
  const minutes = readingMinutes(data.plainText)
  const author = data.author || site.director

  return (
    <>
      <JsonLd data={blogPostingSchema(data)} />
      {data.faqs.length > 0 && <JsonLd data={faqSchema(data.faqs)} />}

      <section className="relative">
        <div className="relative flex min-h-[52svh] w-full flex-col justify-end">
          <Image
            src={data.coverSrc}
            alt={data.coverAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] from-[6%] via-black/70 via-[50%] to-black/40" />
          <div className="relative">
            <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-24 md:pt-32">
              {data.category && (
                <p className="eyebrow !text-[#EBCF8E] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] md:[text-shadow:none]">
                  {data.category}
                </p>
              )}
              <h1 className="mt-3 max-w-3xl text-4xl leading-[1.08] text-white md:text-5xl md:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                {data.title}
              </h1>
              <p className="mt-4 text-xs font-semibold uppercase tracking-eyebrow text-white/80">
                {formatPostDate(data.publishedAt)} · {minutes} min read · By {author}
              </p>
            </div>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-3xl px-4 py-14 md:py-20">
        <div className="prose prose-stone max-w-none prose-headings:font-display prose-headings:font-normal prose-headings:text-ink prose-p:text-stone prose-p:leading-relaxed prose-li:text-stone prose-strong:text-ink prose-a:font-semibold prose-a:text-ink prose-a:underline prose-a:decoration-gold prose-a:underline-offset-4 hover:prose-a:text-goldDeep">
          {data.blocks.map((block, i) => {
            const key = `${block.type}-${i}`
            if (block.type === 'h2') return <h2 key={key}>{block.text}</h2>
            if (block.type === 'h3') return <h3 key={key}>{block.text}</h3>
            if (block.type === 'callout') {
              return (
                <Callout key={key} label={block.label}>
                  <p>{block.text}</p>
                </Callout>
              )
            }
            if (block.type === 'image') {
              return (
                <figure key={key} className="my-10">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={block.src}
                      alt={block.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 768px"
                      className="object-cover"
                    />
                  </div>
                  {block.caption && (
                    <figcaption className="mt-3 text-sm italic text-stone">{block.caption}</figcaption>
                  )}
                </figure>
              )
            }
            return <p key={key}>{block.text}</p>
          })}
        </div>

        {data.relatedLinks.length > 0 && (
          <div className="mt-14 border-t border-line pt-10">
            <p className="eyebrow">Useful next steps</p>
            <h2 className="mt-3 text-3xl">Keep reading</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {data.relatedLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

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

      {data.faqs.length > 0 && (
        <FaqSection
          faqs={data.faqs}
          label="Questions"
          heading={`${data.title.split(':')[0]} questions, answered straight`}
          intro="The questions homeowners ask before they speak to a builder."
        />
      )}

      <QuoteBand eyebrow={data.cta.eyebrow} heading={data.cta.heading} text={data.cta.text} />
    </>
  )
}

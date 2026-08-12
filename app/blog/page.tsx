import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import QuoteBand from '@/components/QuoteBand'
import Reveal from '@/components/Reveal'
import GoldPattern from '@/components/GoldPattern'
import {
  coverImageAlt,
  coverImageUrl,
  formatPostDate,
  readingMinutes,
  type BlogPostListItem,
} from '@/lib/blog'
import {mergeBlogPosts, staticPostCover} from '@/lib/static-blog'
import {sanityFetch} from '@/sanity/live'
import {POSTS_QUERY} from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Blog — Advice on extensions & loft conversions',
  description:
    'Straight answers on planning permission, costs and building extensions and loft conversions, written by the director who builds them.',
  alternates: {canonical: '/blog'},
}

function postImage(post: BlogPostListItem) {
  const staticCover = staticPostCover(post.slug)
  if (staticCover) {
    return {src: staticCover.coverSrc, alt: staticCover.coverAlt}
  }
  return {
    src: coverImageUrl(post.coverImage),
    alt: coverImageAlt(post.coverImage, post.title),
  }
}

export default async function BlogIndex() {
  const {data} = await sanityFetch({query: POSTS_QUERY})
  const posts = mergeBlogPosts((data || []) as BlogPostListItem[])
  const [featured, ...rest] = posts

  return (
    <>
      <section className="relative border-b border-line bg-ivory">
        <GoldPattern id="lattice-blog" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Reveal>
            <p className="eyebrow">The J.Berry blog</p>
            <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] md:text-6xl">
              Straight answers, from the scaffold
            </h1>
            <p className="mt-4 max-w-xl font-display italic text-lg text-stone">
              Planning, costs and honest advice on extensions and loft conversions, written by the
              person who builds them.
            </p>
          </Reveal>
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Reveal>
            <p className="eyebrow">Latest</p>
            <Link
              href={`/blog/${featured.slug}`}
              className="group mt-6 grid gap-8 lg:grid-cols-2 lg:items-center"
            >
              <div className="img-zoom relative aspect-[16/10]">
                <Image
                  src={postImage(featured).src}
                  alt={postImage(featured).alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                {featured.category && (
                  <span className="absolute left-0 top-4 bg-charcoal px-3 py-1.5 text-xs font-semibold uppercase tracking-eyebrow text-gold">
                    {featured.category}
                  </span>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-eyebrow text-stone">
                  {formatPostDate(featured.publishedAt)} · {readingMinutes(featured.plainText)} min
                  read
                </p>
                <h2 className="mt-3 text-3xl transition-colors group-hover:text-goldDeep md:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-stone leading-relaxed">{featured.description}</p>
                <p className="mt-6 text-xs font-semibold uppercase tracking-eyebrow text-goldDeep">
                  Read the article →
                </p>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {rest.length > 0 && (
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <Reveal>
              <p className="eyebrow">All articles</p>
            </Reveal>
            <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => {
                const image = postImage(post)
                return (
                  <Reveal key={post._id} delay={i * 100}>
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <div className="img-zoom relative aspect-[16/10]">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover"
                        />
                        {post.category && (
                          <span className="absolute left-0 top-4 bg-charcoal px-3 py-1.5 text-xs font-semibold uppercase tracking-eyebrow text-gold">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-eyebrow text-stone">
                        {formatPostDate(post.publishedAt)} · {readingMinutes(post.plainText)} min
                        read
                      </p>
                      <h2 className="mt-2 text-2xl transition-colors group-hover:text-goldDeep">
                        {post.title}
                      </h2>
                      <p className="mt-3 text-sm leading-relaxed text-stone">{post.description}</p>
                    </Link>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <section className="mx-auto max-w-6xl px-4 py-24 text-center">
          <p className="font-display italic text-lg text-stone">
            Articles are on their way, check back soon.
          </p>
        </section>
      )}

      <QuoteBand
        eyebrow="Done reading?"
        heading="Get answers for your own home"
        text="Articles are general, your roof and your street are specific. Tell us about the project and Jason will call you back, usually the same working day."
      />
    </>
  )
}

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPost, formatPostDate } from '@/lib/blog';
import { site } from '@/lib/site';
import { JsonLd } from '@/lib/schema';
import QuoteBand from '@/components/QuoteBand';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.coverImage }],
    },
  };
}

function blogPostingSchema(post: { title: string; description: string; date: string; author: string; slug: string; coverImage: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: `${site.domain}${post.coverImage}`,
    url: `${site.domain}/blog/${post.slug}`,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'HomeAndConstructionBusiness', name: site.name },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd data={blogPostingSchema(post)} />

      {/* Article hero */}
      <section className="relative">
        <div className="relative flex min-h-[52svh] w-full flex-col justify-end">
          <Image src={post.coverImage} alt={post.coverAlt} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] from-[6%] via-black/70 via-[50%] to-black/40" />
          <div className="relative">
            <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-24 md:pt-32">
              <p className="eyebrow !text-[#EBCF8E] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] md:[text-shadow:none]">{post.category}</p>
              <h1 className="mt-3 max-w-3xl text-4xl leading-[1.08] text-white md:text-5xl md:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                {post.title}
              </h1>
              <p className="mt-4 text-xs font-semibold uppercase tracking-eyebrow text-white/80">
                {formatPostDate(post.date)} · {post.readingMinutes} min read · By {post.author}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="mx-auto max-w-3xl px-4 py-14 md:py-20">
        <div
          className="prose prose-stone max-w-none prose-headings:font-display prose-headings:font-normal prose-headings:text-ink prose-p:text-stone prose-p:leading-relaxed prose-li:text-stone prose-strong:text-ink prose-a:font-semibold prose-a:text-ink prose-a:underline prose-a:decoration-gold prose-a:underline-offset-4 hover:prose-a:text-goldDeep prose-blockquote:border-l-gold prose-blockquote:font-display prose-blockquote:text-xl prose-blockquote:italic prose-blockquote:text-ink prose-em:font-display prose-em:text-ink prose-hr:border-line"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Author strip */}
        <div className="mt-14 border-t border-line pt-8">
          <p className="eyebrow">Written by</p>
          <p className="mt-3 font-display text-2xl">{post.author}</p>
          <p className="mt-2 text-sm leading-relaxed text-stone">
            Director of {site.name}. Every J.Berry project — extension or loft conversion — is
            personally surveyed, quoted and run by {site.director}, from first site visit to handover.
          </p>
          <p className="mt-4 text-sm text-stone">
            <Link href="/blog" className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep">
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
  );
}

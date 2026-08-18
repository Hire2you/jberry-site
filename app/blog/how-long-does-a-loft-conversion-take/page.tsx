import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { site } from '@/lib/site'
import { faqSchema, JsonLd } from '@/lib/schema'
import { formatPostDate, readingMinutes } from '@/lib/blog'
import { staticBlogPosts } from '@/lib/static-blog'
import QuoteBand from '@/components/QuoteBand'
import FaqSection from '@/components/FaqSection'

const post = staticBlogPosts.find((p) => p.slug === 'how-long-does-a-loft-conversion-take')!

const faqs = [
  {
    q: 'How long does a loft conversion take to build?',
    a: 'The building work commonly takes around six to eight weeks on site, less for a simple rooflight conversion and more for a mansard or larger job. The whole project, including design, planning and lead times, more typically runs three to five months from decision to finished room, because most of the time is spent before construction starts.',
  },
  {
    q: 'How long does a dormer loft conversion take?',
    a: 'A dormer conversion commonly takes around six weeks or so on site, sitting between a quicker rooflight conversion and a longer mansard. The full project timeline, including design, any planning and lead times, is longer, usually a few months. Adding an ensuite adds a little for the extra plumbing and fit-out.',
  },
  {
    q: 'Why does a loft conversion take longer overall than the build?',
    a: 'Because the design, obtaining planning permission or confirming permitted development, the building-regulations details, party wall notices, and ordering windows and materials all happen before the builders start. Together these commonly take a couple of months, much of it in sequence, so the whole project runs longer than the on-site build alone.',
  },
  {
    q: 'Can I live in my house during a loft conversion?',
    a: 'Usually yes, which is a real advantage of a loft over an extension. Most of the work happens in the roof, reached from scaffolding outside, so the rest of the house keeps functioning. The main disruption is a noisy, dusty day or two when the builders break through to fit the staircase, which is worth planning around but short.',
  },
  {
    q: 'Which type of loft conversion is quickest?',
    a: 'A rooflight (Velux) conversion is the quickest, because the roof is not reshaped, just fitted with windows, the floor strengthened and a staircase added. A dormer takes a little longer, a hip-to-gable a bit more, and a mansard the longest, because it rebuilds a roof slope. The build time tracks how much the roof is changed.',
  },
  {
    q: 'Does weather affect how long a loft conversion takes?',
    a: 'It can, mainly during the stage when the roof is opened up and reshaped. A good builder keeps the work watertight day to day, but a prolonged wet spell during the roof-open phase can add time. Once the conversion is watertight, the internal work is largely unaffected by weather.',
  },
  {
    q: 'What can delay a loft conversion?',
    a: 'Bad weather during the roof-open stage, structural surprises found in the existing roof or floor, lead times on windows and rooflights ordered too late, changes of mind mid-build, and party wall issues on terraces and semis. Most are foreseeable, and ordering materials early and finalising the design prevent much of it.',
  },
  {
    q: 'Should I choose the builder who promises the shortest time?',
    a: 'Not on timeline alone. Structural work, building-control inspections and window lead times cannot be rushed, so an unrealistically short promise is a warning sign rather than a strength. A builder who gives you an honest programme, allowing for the roof works, the weather-sensitive stage and the sign-offs, and then meets it, is worth more than one who tells you what you want to hear.',
  },
]

export const metadata: Metadata = {
  title: { absolute: 'How Long Does a Loft Conversion Take? Full Timeline' },
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    title: 'How Long Does a Loft Conversion Take?',
    description: post.description,
    type: 'article',
    publishedTime: post.publishedAt,
    authors: [post.author || site.director],
    url: `/blog/${post.slug}`,
    images: [{ url: post.coverSrc, alt: post.coverAlt }],
  },
}

function blogPostingSchema() {
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

export default function LoftConversionTimelineGuidePage() {
  const minutes = readingMinutes(post.plainText)
  const author = post.author || site.director

  return (
    <>
      <JsonLd data={blogPostingSchema()} />
      <JsonLd data={faqSchema(faqs)} />

      <section className="relative">
        <div className="relative flex min-h-[52svh] w-full flex-col justify-end">
          <Image
            src={post.coverSrc}
            alt={post.coverAlt}
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
        <div className="prose prose-stone max-w-none prose-headings:font-display prose-headings:font-normal prose-headings:text-ink prose-p:text-stone prose-p:leading-relaxed prose-li:text-stone prose-strong:text-ink prose-a:font-semibold prose-a:text-ink prose-a:underline prose-a:decoration-gold prose-a:underline-offset-4 hover:prose-a:text-goldDeep">
          <p>
            The building work for a typical loft conversion usually takes around six to eight weeks
            on site, though the whole project, from deciding to go ahead through design, planning
            and lead times to a finished room, commonly runs three to five months. A simple
            rooflight conversion is quicker; a dormer sits in the middle; a mansard, or a conversion
            with an ensuite, takes longer. And a real advantage of a loft: because most of the work
            happens in the roof, you can usually live in the house throughout.
          </p>
          <p>
            This guide separates the build time from the whole project honestly, walks through the
            stages, gives a sense of how long each type takes, and answers the question people most
            want to know, whether they can stay in the house. Timings are typical ranges, not
            promises, because the type, the structure and the weather all affect them.
          </p>

          <h2>How long does a loft conversion take?</h2>
          <p>The short version:</p>
          <p>
            <strong>Build time on site:</strong> commonly around six to eight weeks for a typical
            conversion, a little less for a simple rooflight conversion, a little more for a mansard
            or a larger job.
          </p>
          <p>
            <strong>The whole project,</strong> including design, planning and lead times: commonly
            around three to five months from decision to finished room.
          </p>
          <p>
            As with an{' '}
            <Link href="/blog/how-long-does-a-house-extension-take">extension</Link>, most of the
            calendar is not the build, it is the design, the approvals and the wait for materials.
            Understanding that split is the key to planning sensibly, and to not being surprised
            that a &ldquo;six-week job&rdquo; takes a few months start to finish.
          </p>

          <h2>Build time vs the whole project</h2>
          <p>The two figures people mix up:</p>
          <p>
            <strong>Build time</strong> is how long the builders are on site converting the loft,
            commonly six to eight weeks.
          </p>
          <p>
            <strong>The whole project</strong> is everything: designing the conversion, obtaining
            planning permission or confirming permitted development, the building-regulations
            details, serving party wall notices where they apply, ordering materials (especially
            windows and rooflights, which have lead times), and waiting for a start slot. Then the
            build.
          </p>
          <p>
            Most of the timeline is the run-up. That is not wasted time, it is what lets the build
            run smoothly, but it is why you should start earlier than you think if you are working
            towards a date.
          </p>

          <h2>The design and planning run-up</h2>
          <p>Before the builders arrive, the run-up typically involves:</p>
          <ul>
            <li>
              Design and drawings, turning your idea into a proper design, including working out the
              staircase and, for a dormer or mansard, the roof form.
            </li>
            <li>
              Planning, either confirming permitted development (worth a Lawful Development
              Certificate) or, for a mansard, front dormer or conservation-area conversion, a
              planning application, with the council&rsquo;s usual target of around eight weeks for a
              decision.
            </li>
            <li>Building regulations, the structural, fire-safety and staircase details.</li>
            <li>
              Party wall, on terraces and semis, where notice usually has to be served around two
              months before work starts, which can set your earliest start date.
            </li>
            <li>
              Ordering materials, especially the windows and rooflights, which can have lead times.
            </li>
          </ul>
          <p>
            Run these in parallel where possible and the run-up is shorter; leave them in sequence
            and it stretches. A good builder manages them so everything is ready for the start date.
          </p>

          <h2>The build, stage by stage</h2>
          <p>Once work starts, a loft conversion runs roughly like this:</p>
          <ol>
            <li>
              <strong>Scaffolding and access.</strong> Scaffolding goes up so the roof can be
              worked on from outside, which is part of why the house below stays usable.
            </li>
            <li>
              <strong>Structural floor and steel.</strong> The new, stronger floor is installed,
              often on steel beams, the structural heart of the conversion.
            </li>
            <li>
              <strong>Roof works.</strong> For a dormer, hip-to-gable or mansard, the roof is opened
              up and reshaped or extended. For a rooflight conversion, this is minimal.
            </li>
            <li>
              <strong>Watertight.</strong> The new roof structure, dormer and windows or rooflights
              are made weatherproof, a turning point, after which the weather matters far less.
            </li>
            <li>
              <strong>The staircase.</strong> The new staircase is formed, connecting the loft to
              the floor below, this is the point the conversion &ldquo;breaks through&rdquo; into
              the house.
            </li>
            <li>
              <strong>First fix.</strong> Electrics and plumbing (including any ensuite) run through
              before the walls are closed up.
            </li>
            <li>
              <strong>Insulation and plastering.</strong>
            </li>
            <li>
              <strong>Second fix and fit-out.</strong> Fittings, any ensuite, and the room finished.
            </li>
            <li>
              <strong>Decorating, flooring and snagging,</strong> then building-control sign-off and
              the completion certificate.
            </li>
          </ol>
          <p>
            For the fuller picture of what a build is like day to day, see our guide on what to
            expect during your build.
          </p>

          <h2>How long each type takes</h2>
          <p>
            The type of conversion affects the build time, roughly in line with how much it
            reshapes the roof:
          </p>
          <p>
            <strong>Rooflight conversion:</strong> the quickest, because the roof is not reshaped,
            often a few weeks.
          </p>
          <p>
            <strong>Dormer conversion:</strong> the common middle ground, commonly around six weeks
            or so.
          </p>
          <p>
            <strong>Hip-to-gable</strong> (often with a dormer): a little longer, reflecting the extra
            roof works.
          </p>
          <p>
            <strong>Mansard conversion:</strong> the longest, because it rebuilds a roof slope, often
            eight weeks or more.
          </p>
          <p>
            Adding an ensuite adds a little to any of these, for the extra plumbing and fit-out.
            These are guides, not guarantees; the structure, the weather and the finish all move
            them.
          </p>

          <h2>Can you live in the house during a loft conversion?</h2>
          <p>
            This is a real advantage of a loft over an extension: yes, you can usually live in the
            house throughout.
          </p>
          <p>
            Because most of the work happens in the roof, reached from scaffolding outside, the
            ground floor and existing bedrooms carry on functioning for most of the conversion. You
            are not without a kitchen or a living room the way you might be during a kitchen
            extension.
          </p>
          <p>
            The main disruption comes at one point: when the builders break through to connect the
            new staircase, cutting through the ceiling of the floor below to form the stairwell.
            That is a noisy, dusty day or two, and it is worth planning around, clearing the area,
            expecting mess, but it is short. For most of the conversion, life goes on beneath a
            building site in the roof rather than in a building site.
          </p>
          <Callout label="Worth knowing">
            <p>
              A big advantage of a loft conversion is that you can usually live in the house
              throughout, because the work happens in the roof, reached from scaffolding outside,
              rather than in your living space. The main exception is the day or two when the
              builders break through to fit the staircase, which is noisy and dusty. Clear that area
              and expect mess for a short spell, and the rest is far less disruptive than an
              extension.
            </p>
          </Callout>
          <Callout label="Common misconception">
            <p>
              &ldquo;The loft is separate, so there&rsquo;s no disruption to the house at
              all.&rdquo; Not quite. There is a noisy, dusty period when the builders cut through to
              form the stairwell and connect the loft to the floor below, and scaffolding and
              deliveries affect the outside of the house throughout. It is much less disruptive than
              an extension, but it is not disruption-free, so plan for the break-through stage.
            </p>
          </Callout>

          <h2>What can slow a loft conversion down</h2>
          <p>Most loft overruns come from a few predictable causes:</p>
          <ul>
            <li>
              Weather during the roof-open stage. While the roof is opened up, a wet spell can slow
              progress; a good builder keeps it watertight day to day, but the reshaping stage is
              the weather-sensitive one.
            </li>
            <li>
              Structural surprises. Something unexpected in the existing roof or floor structure
              found once work starts.
            </li>
            <li>Materials lead times, especially windows and rooflights ordered too late.</li>
            <li>Changes of mind mid-build, which cost time as well as money.</li>
            <li>Party wall issues, if notices are late or disputed on a terrace or semi.</li>
          </ul>
          <p>
            Most are foreseeable, and a good builder allows for them in a realistic programme rather
            than an optimistic one.
          </p>

          <h2>Keeping your loft conversion on schedule</h2>
          <p>
            A loft conversion runs to time when the design and approvals are sorted early, the
            windows and materials are ordered promptly, and the build is managed properly.
          </p>
          <p>
            This is where we come in, gently. We{' '}
            <Link href="/loft-conversions">design and build loft conversions</Link> with one team
            from start to finish, so there is no gap between trades where a job stalls. At the free,
            no-obligation site visit we set out a realistic programme for your specific conversion,
            allowing honestly for the type, the roof works, the weather-sensitive stage and the lead
            times, rather than an optimistic number to win the job. We manage the planning, building
            regs and party wall so they do not hold up the start, and see the work through to the
            completion certificate. You get an itemised quote and a timeline you can plan around.
            Most of our work comes through recommendation, which does not happen when jobs drag.
          </p>
          <Callout label="Next step">
            <p>
              Planning a loft conversion around a timeline? Book a free, no-obligation site visit on{' '}
              <a href={site.phoneHref}>{site.phone}</a> for a realistic programme for your
              conversion and an itemised quote. No pressure, and no obligation to proceed.
            </p>
          </Callout>
        </div>

        <div className="mt-14 border-t border-line pt-10">
          <p className="eyebrow">Useful next steps</p>
          <h2 className="mt-3 text-3xl">Keep reading</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/loft-conversions"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              Loft conversions
            </Link>
            <Link
              href="/cost-guides/loft-conversion-cost"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              Loft conversion cost guide
            </Link>
            <Link
              href="/blog/how-long-does-a-house-extension-take"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              How long a house extension takes
            </Link>
            <Link
              href="/loft-conversions/essex"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              Loft conversions in Essex
            </Link>
            <Link
              href="/contact"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              Contact us
            </Link>
          </div>
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

      <FaqSection
        faqs={faqs}
        label="Questions"
        heading="Loft conversion timeline questions, answered straight"
        intro="The timing questions homeowners ask before they speak to a builder."
      />

      <QuoteBand
        eyebrow="Planning a loft conversion around a timeline?"
        heading="Get a realistic programme for your home"
        text="Book a free, no-obligation site visit. We will look at your roof, the type of conversion and the lead times, then set out a programme you can actually plan around. No pressure, and no obligation to proceed."
      />
    </>
  )
}

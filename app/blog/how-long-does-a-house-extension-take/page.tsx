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

const post = staticBlogPosts.find((p) => p.slug === 'how-long-does-a-house-extension-take')!

const faqs = [
  {
    q: 'How long does a single-storey extension take to build?',
    a: 'The building work commonly takes around eight to fourteen weeks on site, from breaking ground to handover, depending on size, ground conditions and weather. The whole project, including design and planning, more typically runs six to nine months, because most of the time is spent before construction starts.',
  },
  {
    q: 'How long does a double storey extension take?',
    a: 'Longer than a single storey, commonly three to four months or more of build time, because there is more structure and roof, work at height, and it often ties into the upstairs of the existing house. The full project timeline, with design and planning, is correspondingly longer.',
  },
  {
    q: 'Why does an extension take so long before building even starts?',
    a: 'Because the pre-build stage includes design and drawings, planning permission or a permitted development check, building regulations, party wall notices where they apply, agreeing a quote, and waiting for a start slot with a good builder. Together these commonly take three to six months, and much of it happens in sequence.',
  },
  {
    q: 'What causes extensions to overrun?',
    a: 'The most common causes are ground surprises requiring deeper or more complex foundations, bad weather during groundworks, long lead times on made-to-order materials like glazing, changes of mind once building has started, party wall delays, and difficult access. Ordering materials early and finalising the design before work starts prevent much of it.',
  },
  {
    q: 'Can I live in my house during an extension?',
    a: 'Usually yes. For a rear or side extension the house stays largely intact until the wall between old and new is opened near the end. The hardest case is a kitchen extension, where you will be without a working kitchen for weeks, so a temporary kitchen setup is worth arranging in advance.',
  },
  {
    q: 'How long will I be without a kitchen during a kitchen extension?',
    a: 'Usually weeks rather than days, from the old kitchen being removed to the new one being fitted and working. Plan a temporary kitchen with a microwave, kettle and fridge elsewhere in the house before the work starts.',
  },
  {
    q: 'Does the time of year affect how long an extension takes?',
    a: 'It can. Groundworks and getting the structure watertight are weather-dependent, so a wet winter can add time to the early stages. Once the extension is watertight, the internal work is largely unaffected by weather.',
  },
  {
    q: 'Should I choose the builder with the shortest timeline?',
    a: 'Not on timeline alone. An unrealistically short programme is a warning sign rather than a strength, because foundations, curing and materials lead times cannot be rushed. A slightly longer, honest timeline that a builder can actually meet is worth more than an optimistic one they cannot.',
  },
]

export const metadata: Metadata = {
  title: { absolute: 'How Long Does a House Extension Take? Full Timeline' },
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    title: 'How Long Does a House Extension Take?',
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

export default function HouseExtensionTimelineGuidePage() {
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
            The building work for a typical single-storey extension usually takes somewhere around
            two to three months on site, from breaking ground to handover. But the whole project,
            from your first idea through design and planning to a finished room, more commonly runs
            six to nine months, because most of that time is spent before anyone picks up a tool.
            Bigger or more complex extensions take longer on both counts.
          </p>
          <p>
            This guide separates those two questions honestly, because confusing them is where
            people get caught out. It covers how long the design and planning stage takes, how long
            the build itself takes for each type of extension, what causes delays, and whether you
            can live in the house while it happens.
          </p>

          <h2>How long does a house extension take?</h2>
          <p>The short version, for a straightforward single-storey rear extension on an ordinary house:</p>
          <p>
            <strong>Build time on site:</strong> commonly around eight to fourteen weeks.
          </p>
          <p>
            <strong>Total project time,</strong> including design, planning and the wait for a start
            date: commonly around six to nine months.
          </p>
          <p>
            Those are typical ranges, not promises, because the honest answer depends on the size
            and complexity of the extension, the ground you are building on, the time of year, and
            whether it needs planning permission. A large, double storey or wrap-around project, or
            one held up at planning, can run well beyond these.
          </p>
          <p>
            The single most useful thing to understand is that the build is often the shorter part.
            Most of the wait happens before the builders arrive.
          </p>
          <Callout label="Worth knowing">
            <p>
              When someone says an extension &ldquo;took a year&rdquo;, they almost always mean the
              whole journey, idea to finished room, not a year of building work. The actual
              construction is usually a matter of weeks or a few months. Separating the two in your
              head makes the whole thing far less daunting, and far easier to plan around.
            </p>
          </Callout>

          <h2>Build time vs total project time: two different questions</h2>
          <p>
            It is worth being clear about the two, because a builder quoting &ldquo;twelve
            weeks&rdquo; and a neighbour saying &ldquo;it took us nine months&rdquo; can both be
            telling the truth.
          </p>
          <p>
            <strong>Build time</strong> is the time the builders are on site, from breaking ground
            to handover. This is what a builder means by their programme, and for a single-storey
            extension it is usually a couple of months.
          </p>
          <p>
            <strong>Total project time</strong> is everything: working out what you want, getting
            drawings done, obtaining planning permission or confirming permitted development,
            building regulations, party wall notices where they apply, agreeing a quote, and waiting
            for a start slot with a good builder. Then the build. Then finishing touches.
          </p>
          <p>
            Most of the calendar is the first part. That is not wasted time, it is what makes the
            build go smoothly, but it is why you should start earlier than you think if you have a
            date in mind, such as a new baby or a family event.
          </p>

          <h2>The design and planning stage: how long before anyone is on site</h2>
          <p>This stage varies more than the build, and it is worth knowing what is in it.</p>
          <p>
            <strong>Design and drawings.</strong> Turning a rough idea into a proper design and a
            set of drawings takes a few weeks, longer if the design goes through several rounds.
          </p>
          <p>
            <strong>Planning.</strong> If your extension is permitted development, there is no
            application to wait for, though a Lawful Development Certificate is worth getting. If it
            needs full planning permission, the council&rsquo;s target is around eight weeks for a
            decision, sometimes longer. The prior approval route for larger single-storey extensions
            sits in between.
          </p>
          <p>
            <strong>Building regulations.</strong> These can run alongside, but the structural
            calculations and details take time to prepare.
          </p>
          <p>
            <strong>Party wall.</strong> If the{' '}
            <a
              href="https://www.gov.uk/guidance/party-wall-etc-act-1996-guidance"
              target="_blank"
              rel="noopener noreferrer"
            >
              Party Wall Act
            </a>{' '}
            applies, typically on a terrace or where you build near a boundary, formal notice usually
            has to be served about two months before work starts. This can quietly become the thing
            that sets your start date.
          </p>
          <p>
            <strong>Booking a good builder.</strong> A builder worth having is rarely free next
            week. A wait of a few weeks to a few months for a start slot is normal, and often a good
            sign.
          </p>
          <p>
            Add these up and the pre-build stage is commonly three to six months. Running them in
            parallel where possible, rather than one after another, is the main way to shorten it.
          </p>

          <h2>The build itself: how long on site, by extension type</h2>
          <p>Once work starts, how long it takes depends mostly on what you are building. As typical ranges:</p>
          <p>
            <strong>Single-storey rear extension:</strong> commonly around eight to fourteen weeks.
          </p>
          <p>
            <strong>Side return extension:</strong> often a similar or slightly longer period despite
            the smaller size, because the structural work, removing two load-bearing walls and
            sometimes underpinning shallow footings, is demanding for the floor area.
          </p>
          <p>
            <strong>Wrap-around extension:</strong> longer again, because it combines a rear
            extension and a side return, so expect several months.
          </p>
          <p>
            <strong>Double storey extension:</strong> longer than a single storey, commonly three to
            four months or more, because there is more structure, more roof, working at height, and
            often tying into the upstairs of the existing house.
          </p>
          <p>
            <strong>Loft conversion:</strong> varies widely with type, but a straightforward dormer
            loft is commonly a couple of months. See{' '}
            <Link href="/blog/how-long-does-a-loft-conversion-take">
              how long a loft conversion takes
            </Link>{' '}
            for the full breakdown.
          </p>
          <p>These are guides, not guarantees. The ground, the weather and the specification all move them.</p>

          <h2>What the build weeks actually involve</h2>
          <p>
            Rather than repeat a full week-by-week breakdown here, the short version of how the
            build flows is: setting up and groundworks and foundations first, then brickwork up to
            damp-proof course and the floor slab, then walls, structural steel and getting the roof
            on and watertight, then windows and doors and first-fix electrics and plumbing, then
            plastering, second fix and the kitchen fit-out, and finally decorating, flooring and
            snagging before handover.
          </p>
          <p>
            The order matters because some stages simply cannot be rushed or overlapped.
            Foundations and certain finishes need time to cure and dry. A builder who claims to
            compress all of this dramatically is usually the one to be wary of.
          </p>
          <p>
            For the full week-by-week picture of what happens and when, and what it is like to live
            alongside, see our guide on what to expect during your build.
          </p>

          <h2>What makes an extension take longer than expected</h2>
          <p>
            Most overruns come from a handful of predictable things. Knowing them helps you plan
            realistically and spot an over-optimistic quote.
          </p>
          <p>
            <strong>Ground surprises.</strong> The most common. If the foundations have to go
            deeper than expected, or the ground turns out soft, wet or previously disturbed, the
            groundworks take longer. This is exactly why a good builder wants to understand the
            ground before starting.
          </p>
          <p>
            <strong>Weather.</strong> Groundworks and getting the structure watertight are
            weather-dependent. A wet winter can add time to the early stages in particular.
          </p>
          <p>
            <strong>Materials lead times.</strong> Made-to-order items, especially glazing like
            sliding doors and roof lanterns, and sometimes steel, can have lead times of weeks.
            Ordering them early is one of the biggest levers on keeping to schedule.
          </p>
          <p>
            <strong>Changes mid-build.</strong> Every change of mind once work has started, a moved
            wall, a different layout, an added rooflight, costs time as well as money. Decisions
            made at the design stage are nearly free; the same decisions made on site are not.
          </p>
          <p>
            <strong>Party wall and neighbour issues.</strong> A dispute, or notice served late, can
            push a start date back by weeks.
          </p>
          <p>
            <strong>Complexity and access.</strong> Difficult access, and complex structure, both
            add time that a simple job does not have.
          </p>
          <Callout label="Worth knowing">
            <p>
              The two delays most within your control are materials and changes. Order the
              long-lead items, especially the glazing, as early as the design allows, and lock the
              design down before work starts. Those two habits alone prevent a large share of the
              overruns that plague extensions.
            </p>
          </Callout>

          <h2>Can you live in the house during the build?</h2>
          <p>Usually yes, and most people do, but it depends on the job.</p>
          <p>
            For a rear or side extension, the existing house stays largely intact until near the
            end, when the wall between old and new is opened up. Up to that point you live around
            the work, with dust, noise and builders in the garden, but a functioning home.
          </p>
          <p>
            The hard case is a kitchen extension, because for a chunk of the project you will be
            without a proper kitchen. This is the single most underestimated part of living through
            an extension.
          </p>
          <Callout label="Common misconception">
            <p>
              &ldquo;I&rsquo;ll only be without a kitchen for a few days.&rdquo; On a kitchen
              extension it is usually weeks, not days, from the old kitchen coming out to the new
              one being fitted and working. Plan a temporary kitchen somewhere, a microwave, kettle
              and fridge in another room, before you start, rather than discovering the problem
              halfway through. It makes a huge difference to how bearable the build feels.
            </p>
          </Callout>
          <p>
            A double storey is more disruptive again, because it often affects the bedrooms too.
            None of it is unmanageable, but it is worth planning for honestly rather than assuming
            it will be a minor inconvenience.
          </p>

          <h2>How to keep your extension on schedule</h2>
          <p>
            The biggest single factor in an extension running to time is how well it was planned
            and run, not luck.
          </p>
          <p>
            This is where we come in, gently. We{' '}
            <Link href="/extensions">design and build extensions</Link> with one team from start to
            finish, so there is no gap between trades where a job stalls and no one to chase. At the
            free, no-obligation site visit we set out a realistic programme for your specific
            project, allowing honestly for the ground, the season and the lead times, rather than
            quoting an optimistic number to win the job. You get a clear, itemised written quote, and
            a timeline you can actually plan around. Most of our work comes through recommendation,
            which does not happen when jobs drag.
          </p>
          <p>
            If you are working towards a date, tell us early. The sooner the design and planning
            start, the more of the calendar is on your side.
          </p>
          <Callout label="Next step">
            <p>
              Planning an extension around a deadline? Book a free, no-obligation site visit on{' '}
              <a href={site.phoneHref}>{site.phone}</a> and we will give you a realistic timeline
              for your project, not an optimistic one, alongside an itemised quote. No pressure, and
              no obligation to proceed.
            </p>
          </Callout>

          <h2>Why an honest timeline beats an optimistic one</h2>
          <p>
            It is tempting to go with the builder who promises the shortest time. It is usually a
            mistake.
          </p>
          <p>
            An unrealistic programme does not make the work happen faster. It just means the job
            overruns its own promise, which is where stress, cut corners and disputes come from.
            Foundations still need to cure, glazing still has its lead time, and the weather does
            what it does regardless of what a quote said.
          </p>
          <p>
            A builder who gives you a slightly longer, honest timeline, and explains what each
            stage depends on, is far more likely to actually finish when they said than one who
            tells you what you want to hear. Judge a timeline by whether it is credible, not by
            whether it is short.
          </p>
          <Callout label="Common misconception">
            <p>
              &ldquo;The builder with the shortest timeline is the most efficient.&rdquo; Often the
              opposite. An unrealistically short programme is a warning sign, either the builder has
              underestimated the job, or they are telling you what wins the contract. A realistic
              timeline you can rely on is worth more than an optimistic one you cannot.
            </p>
          </Callout>
        </div>

        <div className="mt-14 border-t border-line pt-10">
          <p className="eyebrow">Useful next steps</p>
          <h2 className="mt-3 text-3xl">Keep reading</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/extensions"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              House extensions
            </Link>
            <Link
              href="/blog/house-extension-cost-guide"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              House extension cost guide
            </Link>
            <Link
              href="/blog/how-long-does-a-loft-conversion-take"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              How long a loft conversion takes
            </Link>
            <Link
              href="/loft-conversions"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              Loft conversions
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
        heading="House extension timeline questions, answered straight"
        intro="The timing questions homeowners ask before they speak to a builder."
      />

      <QuoteBand
        eyebrow="Planning an extension around a deadline?"
        heading="Get a realistic timeline for your home"
        text="Book a free, no-obligation site visit. We will look at your house, the ground and the season, then set out a programme you can actually plan around. No pressure, and no obligation to proceed."
      />
    </>
  )
}

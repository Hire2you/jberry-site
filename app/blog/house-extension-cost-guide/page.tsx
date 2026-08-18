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

const post = staticBlogPosts.find((p) => p.slug === 'house-extension-cost-guide')!

const faqs = [
  {
    q: 'How much does a house extension cost per square metre?',
    a: 'As a broad guide, single-storey extensions are commonly quoted at a few thousand pounds per square metre of finished floor area, with double storey usually working out at less per square metre because the foundations and roof are shared between two floors. The exact figure depends on specification, ground conditions and access, so treat any per-square-metre number as a starting point, not a quote.',
  },
  {
    q: 'Why are extension quotes so different?',
    a: 'Usually because they are quoting different jobs. A cheaper quote may have designed a smaller structural opening, assumed the existing foundations will cope, left out rooflights, drainage or landscaping, or excluded VAT. An itemised quote lets you see exactly what each price includes and why they differ; a single lump sum hides it.',
  },
  {
    q: 'Is a double storey extension better value than a single storey?',
    a: 'Per square metre, usually yes. One set of foundations and one roof serve two floors, so the second storey adds proportionally less than the first. If you are likely to want the upstairs space within a few years, building it at the same time is normally cheaper than returning for it later.',
  },
  {
    q: 'What costs do people forget when budgeting for an extension?',
    a: 'The most commonly missed items are structural steel and the groundwork beneath it, rooflights or a lantern, drainage diversions, making good the garden, planning and building control fees, the kitchen and flooring on a kitchen extension, and VAT. Any of these can turn an affordable-looking project into an over-budget one.',
  },
  {
    q: 'Does the ground affect how much an extension costs?',
    a: 'Significantly. Clay ground that moves near trees, soft or wet ground near water, made ground, old workings or a high water table can all mean deeper or more complex foundations, which adds to the groundwork before any walls go up. This is why a good builder wants to understand the ground before quoting.',
  },
  {
    q: 'Is VAT included in extension quotes?',
    a: 'Not always, and it is a common reason two prices look far apart. Most domestic extensions are standard-rated for VAT, so it is a real part of the total. Always check whether a quoted figure includes VAT before comparing it with another.',
  },
  {
    q: 'How can I reduce the cost of my extension?',
    a: 'Sensible savings include a simpler roof, spending on the glazing and layout while saving on upgradeable finishes, and keeping kitchens and bathrooms positioned for short drainage runs. Avoid false economies like shrinking the structural opening to save on steel, skimping on foundations or drainage, or leaving out rooflights on a deep extension.',
  },
  {
    q: 'How do I get an accurate price for my extension?',
    a: 'Have someone look at your actual house, ground and access, then give you an itemised written quote. An online cost calculator is useful for an early sense of scale, but only a site visit produces a figure you can plan around. We offer a free, no-obligation site visit and itemised quote.',
  },
]

export const metadata: Metadata = {
  title: { absolute: 'How Much Does a House Extension Cost? Complete Guide' },
  description: post.description,
  alternates: { canonical: `/blog/${post.slug}` },
  openGraph: {
    title: 'How Much Does a House Extension Cost? The Complete Guide',
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

export default function HouseExtensionCostGuidePage() {
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
            A house extension usually costs a few thousand pounds per square metre of finished
            space, so a modest single-storey room commonly runs to a five-figure sum and a large or
            high-specification project a good deal more. What actually moves that figure is rarely
            the size. It is the ground underneath, the structural work involved, the finish you
            choose and how honestly the quote has been put together, which is why two prices for
            what looks like the same extension can differ by tens of thousands of pounds.
          </p>
          <p>
            This guide explains what you are really paying for, which costs people forget to budget
            for, why quotes vary so wildly, and how to get an accurate figure for your own home. No
            jargon, and no sales pitch dressed up as advice, just what you actually need to know
            before you commit.
          </p>

          <h2>What does a house extension cost?</h2>
          <p>
            Cost is nearly always talked about &ldquo;per square metre&rdquo;, and that is a useful
            shorthand as long as you know its limits.
          </p>
          <p>
            As a broad guide, single-storey extensions tend to be quoted at a few thousand pounds
            per square metre of finished floor area, with the exact figure depending heavily on
            specification and location. A double storey does not cost double: because one set of
            foundations and one roof serve two floors, the cost per square metre usually drops,
            which we will come back to.
          </p>
          <p>
            The reason &ldquo;per square metre&rdquo; only gets you so far is that two extensions of
            identical size can carry very different price tags. A simple square room on firm, level
            ground with a modest kitchen is one job. The same floor area on a sloping plot, with a
            wide structural opening into the house, a roof lantern and a high-end kitchen, is
            another entirely. The floor area is the same; the work is not.
          </p>
          <Callout label="Worth knowing">
            <p>
              Treat any per-square-metre figure, including the one above, as a starting point for a
              conversation, not a quote. It is genuinely useful for a rough sense of scale early on,
              and genuinely misleading if you rely on it to budget a specific project. The only
              figure you can plan around is one based on your actual house.
            </p>
          </Callout>

          <h2>What actually drives the price</h2>
          <p>Five things move an extension&rsquo;s cost far more than its size does.</p>
          <p>
            <strong>Specification.</strong> The single biggest lever you control. Standard windows
            or slim aluminium sliders, a basic kitchen or a designed one, laminate or engineered
            flooring, a flat roof or a lantern. The gap between a modest and a high-end finish on
            the same shell can be enormous.
          </p>
          <p>
            <strong>Structural work.</strong> Opening up the back of a house to create one bright,
            open room means removing load-bearing walls, and that load has to be carried on a steel
            beam. The wider the opening you want, the bigger and heavier the steel, and the more
            groundwork it needs beneath it. This is one of the largest hidden variables in any
            quote.
          </p>
          <p>
            <strong>The ground.</strong> Covered in its own section below, because it deserves it.
            In short, what your foundations have to do varies enormously from plot to plot, and it
            is priced accordingly.
          </p>
          <p>
            <strong>Access and logistics.</strong> A builder who can get a digger and materials
            straight to the back of the house works very differently from one carrying everything
            through the hall by hand. Restricted access, on a terrace especially, adds real time and
            therefore real cost.
          </p>
          <p>
            <strong>Finish and fit-out.</strong> The kitchen, the bathroom if there is one, the
            flooring, the decorating, the landscaping to put the garden back. These are easy to
            underestimate because they come at the end, when the budget is already stretched.
          </p>

          <h2>Single storey, double storey or loft: which gives the most for your money</h2>
          <p>
            If your aim is the most usable space for the least money, it is worth knowing how the
            options compare, because the answer surprises people.
          </p>
          <p>
            A double storey extension is almost always the best value per square metre. You dig one
            set of foundations and build one roof, then get two floors of space beneath and within
            them. Adding the upstairs is proportionally cheap once the downstairs is being built
            anyway.
          </p>
          <p>
            A{' '}
            <Link href="/loft-conversions">loft conversion</Link> is often the cheapest way to add
            a bedroom specifically, because you are not building foundations at all. You are working
            within a roof that already exists. For a fuller loft cost breakdown, see our{' '}
            <Link href="/cost-guides/loft-conversion-cost">loft conversion cost guide</Link>.
          </p>
          <p>
            A single-storey extension costs the most per square metre of the three, because that one
            set of foundations and that one roof serve only one floor. It is still the right answer
            when what you need is ground-floor living space, but it is the least efficient use of
            the money.
          </p>
          <Callout label="Common misconception">
            <p>
              &ldquo;A double storey extension will cost me twice as much as a single storey.&rdquo;
              It rarely does. The expensive parts, the groundwork and the roof, are largely shared
              between the two floors, so the second storey adds far less than the first. If you
              think you will want the upstairs space within a few years, building it now is usually
              cheaper than coming back for it later.
            </p>
          </Callout>

          <h2>The costs people forget to budget for</h2>
          <p>
            These are the items that turn an affordable-looking project into an over-budget one,
            because they are easy to leave out of an early sum.
          </p>
          <p>
            <strong>Structural steel and the groundwork under it.</strong> As above, a wide opening
            needs a substantial beam, and the beam needs foundations that can carry a concentrated
            load. On older houses this often means deeper work than expected.
          </p>
          <p>
            <strong>Rooflights or a lantern.</strong> Extend across the back of a house and the
            middle of the original room goes dark, because the windows are now several metres
            further away. A lantern or a run of rooflights fixes it, and it is the single most
            commonly forgotten line in a budget.
          </p>
          <p>
            <strong>Drainage.</strong> If your extension covers a drain or a manhole, it has to be
            diverted or built over properly, which is real work. Where the ground drains poorly, or
            the plot is prone to flooding, drainage can grow into a significant cost.
          </p>
          <p>
            <strong>Making good the garden.</strong> The builders leave; the churned-up garden and
            the scaffold marks remain. Landscaping to put it right is a genuine cost that rarely
            appears in a headline figure.
          </p>
          <p>
            <strong>Fees.</strong>{' '}
            <a
              href="https://www.planningportal.co.uk/permission/home-improvement/planning-permission"
              target="_blank"
              rel="noopener noreferrer"
            >
              Planning application fees
            </a>{' '}
            where they apply, building control fees, and structural calculations for the steel.
            Individually modest, collectively worth budgeting for.
          </p>
          <p>
            <strong>VAT.</strong> Most home extensions are standard-rated, so on a domestic project
            VAT is a real part of the total, not an afterthought. Check whether a quote includes it
            or not, because that alone can explain a big gap between two prices. See{' '}
            <a
              href="https://www.gov.uk/vat-builders"
              target="_blank"
              rel="noopener noreferrer"
            >
              GOV.UK guidance on VAT for construction
            </a>
            .
          </p>

          <h2>How the ground under your house changes the price</h2>
          <p>
            This is the part homeowners never see coming, and it is where local knowledge earns its
            money.
          </p>
          <p>
            Much of the country sits on clay, which swells when it is wet and shrinks when it is
            dry, and moves most near large trees. On a leafy plot, that often means foundations have
            to go considerably deeper than people expect, purely to reach stable ground. Deeper
            foundations mean more excavation, more concrete and more cost, before a single wall goes
            up.
          </p>
          <p>
            Other ground brings its own issues: soft or wet ground near a river, made ground on a
            site that was once something else, old workings under parts of some areas, a high water
            table that complicates both foundations and drainage. None of it stops you extending.
            All of it changes the price of the groundwork, which is why a good builder wants to
            understand the ground before quoting rather than after.
          </p>
          <Callout label="Worth knowing">
            <p>
              If a quote has been given without anyone really looking at your ground, treat its
              groundwork figure with caution. The foundations are the one part of the job you cannot
              see when it is finished and the one part it is most expensive to get wrong. On a
              tricky plot, a proper look at the ground before pricing is protection, not an upsell.
            </p>
          </Callout>

          <h2>Why two quotes for the same extension differ so much</h2>
          <p>
            Almost everyone who gathers three quotes is baffled by the spread, and there is usually
            an honest explanation. It is rarely that one builder is simply greedy and another is a
            bargain. It is that they are quoting different jobs.
          </p>
          <p>
            The cheaper quote has often, quietly, done one or more of these things. It has kept a
            stub of wall or planned a supporting post in the middle of your new open-plan room, so
            the steel can be smaller and cheaper. It has assumed the existing foundations will cope
            rather than allowing to strengthen them. It has left out the rooflights, the drainage
            diversion, the making good, or the VAT. Or it has simply priced a lower specification
            without spelling that out.
          </p>
          <p>
            None of that is necessarily dishonest, but it makes a like-for-like comparison
            impossible unless the quotes are itemised. An itemised quote shows you what the steel,
            the groundwork, the glazing and the finish each cost, so you can see exactly where two
            prices differ and why. A single lump sum hides all of it.
          </p>
          <Callout label="Common misconception">
            <p>
              &ldquo;The cheapest quote saves me money.&rdquo; Sometimes. But if the cheapest quote
              has left out the underpinning your ground needs, or designed a post into the middle of
              your kitchen to shrink the steel, the saving is either an illusion you pay for later
              or a compromise you look at every day. Compare what is in the quotes, not just the
              totals at the bottom.
            </p>
          </Callout>

          <h2>What is usually not in the headline price</h2>
          <p>
            When a builder quotes &ldquo;the extension&rdquo;, it is worth knowing what that figure
            typically does and does not cover, because assumptions differ.
          </p>
          <p>
            <strong>Commonly included:</strong> the structure, the roof, the windows and external
            doors, first-fix and second-fix electrics and plumbing, plastering, and basic
            decoration.
          </p>
          <p>
            <strong>Commonly separate,</strong> and easy to assume are included when they are not:
            the kitchen units and appliances, the flooring, tiling, the final decoration to a high
            standard, and any landscaping. On a kitchen extension especially, the kitchen itself can
            be a large cost sitting outside the building quote.
          </p>
          <p>
            The lesson is simple. Before you compare two prices, or set your own budget, get clear
            on exactly what each figure includes. It is the single most common cause of a project
            running over.
          </p>

          <h2>How to get an accurate figure for your extension</h2>
          <p>
            Everything above gets you a sense of scale. The only way to get a figure you can
            actually plan around is to have someone look at your specific house, your ground and
            what you want to build.
          </p>
          <p>
            This is where we come in, gently. We{' '}
            <Link href="/extensions">design and build extensions</Link>, and the first step is
            always a free, no-obligation site visit. We look at the house, the plot and the access,
            talk through what you want the space to do, and then give you a clear, itemised written
            quote, so you can see what the steel, the groundwork, the glazing and the finish each
            cost rather than staring at a single lump sum. Most of our work comes through
            recommendation, which only happens if the finished job matches the quote.
          </p>
          <p>
            If you would like a rough sense of scale before you speak to anyone, our online cost
            calculator gives an early estimate from a few details about your project. It will not
            replace a site visit, but it is a sensible place to start.
          </p>
          <Callout label="Next step">
            <p>
              Weighing up an extension? Try the cost calculator for an early estimate, or book a
              free, no-obligation site visit on{' '}
              <a href={site.phoneHref}>{site.phone}</a> for a real, itemised figure for your home.
              No pressure, and no obligation to proceed.
            </p>
          </Callout>

          <h2>How to bring the cost down without cutting corners</h2>
          <p>
            If the sums are tight, there are sensible ways to reduce the cost that do not store up
            problems for later. And there are false economies worth avoiding.
          </p>
          <p>
            <strong>Sensible savings.</strong> Choose a simpler roof over a complex one. Spend on
            the glazing and the layout, which you use every day, and save on finishes you can
            upgrade later. Keep the kitchen and bathroom in sensible positions so the drainage runs
            stay short. Do a slightly smaller, better-finished extension rather than a larger,
            cheaper-feeling one.
          </p>
          <p>
            <strong>False economies.</strong> Do not shrink the structural opening just to save on
            steel if it leaves you with a post in the middle of the room. Do not skimp on
            foundations or drainage, the parts you cannot see and cannot easily fix. Do not leave
            out the rooflights on a deep extension and end up with a bigger but darker room. And do
            not choose a quote purely because it is the lowest without checking what it leaves out.
          </p>
          <p>
            The best saving of all is getting the design right first time, so nothing is ripped out
            and redone. That is worth more than any single spec decision.
          </p>
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
              href="/loft-conversions"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              Loft conversions
            </Link>
            <Link
              href="/blog/how-long-does-a-house-extension-take"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              How long a house extension takes
            </Link>
            <Link
              href="/blog/how-long-does-a-loft-conversion-take"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              How long a loft conversion takes
            </Link>
            <Link
              href="/cost-guides/loft-conversion-cost"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              Loft conversion cost guide
            </Link>
            <Link
              href="/loft-conversions/essex"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              Loft conversions in Essex
            </Link>
            <Link
              href="/extensions/essex/chelmsford"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              Extensions in Chelmsford
            </Link>
            <Link
              href="/extensions/essex/chigwell"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              Extensions in Chigwell
            </Link>
            <Link
              href="/extensions/essex/ongar"
              className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
            >
              Extensions in Ongar
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
        heading="House extension cost questions, answered straight"
        intro="The money questions homeowners ask before they speak to a builder."
      />

      <QuoteBand
        eyebrow="Weighing up an extension?"
        heading="Get a real, itemised figure for your home"
        text="Book a free, no-obligation site visit. We will look at your house, your ground and what you want to build, then give you a clear itemised quote. No pressure, and no obligation to proceed."
      />
    </>
  )
}

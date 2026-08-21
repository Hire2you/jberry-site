import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';
import type { SanityProject } from '@/lib/projects';
import { toCarouselSlides } from '@/lib/projects';
import TrustBar from '@/components/TrustBar';
import ProjectCarousel from '@/components/ProjectCarousel';
import FaqSection from '@/components/FaqSection';
import LeadForm from '@/components/LeadForm';
import QuotationCard from '@/components/QuotationCard';
import Reveal from '@/components/Reveal';
import GoldPattern from '@/components/GoldPattern';
import SectionIndex from '@/components/SectionIndex';
import { sanityFetch } from '@/sanity/live';
import { PROJECTS_BY_TYPE_QUERY } from '@/sanity/queries';

export type CountyHubData = {
  serviceSlug: string;
  county: string;
  countySlug: string;
  hero: {
    image: { src: string; alt: string };
    eyebrow: string;
    headline: string;
    sub: string;
  };
  intro: string[];
  introImage: { src: string; alt: string };
  areas: {
    title: string;
    intro: string;
    clusters: {
      name: string;
      towns: { name: string; slug: string | null; href?: string }[];
    }[];
  };
  roofs: {
    title: string;
    intro: string;
    closing: string;
    types: {
      roofStock: string;
      conversion: string;
      text: string;
      image: string;
      imageAlt: string;
    }[];
  };
  planning: {
    title: string;
    intro: string;
    permitted: { title: string; points: string[] };
    always: { title: string; points: string[] };
    blogLink?: { href: string; label: string };
  };
  involves: {
    title: string;
    intro: string;
    steps: { step: string; title: string; text: string }[];
  };
  whyUs: {
    title: string;
    intro: string;
    reasons: { title: string; text: string }[];
    sidewaysLink: { href: string; label: string };
  };
  cost: {
    title: string;
    intro: string;
    ladder: { name: string; note: string }[];
    closing: string;
    costLink: { href: string; label: string };
    included: string[];
  };
  faqs: { q: string; a: string }[];
  relatedLinks: { href: string; label: string }[];
  overviewLinkLabel?: string;
  faqIntro?: string;
  cta: {
    eyebrow: string;
    title: string;
    text: string;
  };
};

export default async function CountyHubLanding({ data }: { data: CountyHubData }) {
  const { serviceSlug, county, hero } = data;
  const projectType = serviceSlug === 'extensions' ? 'extension' : 'loft-conversion';
  const { data: projectData } = await sanityFetch({
    query: PROJECTS_BY_TYPE_QUERY,
    params: { projectType },
  });
  const carouselProjects = toCarouselSlides((projectData || []) as SanityProject[]);

  return (
    <>
      {/* Hero + carousel share one continuous band background */}
      <div className="bg-band">
        <section className="relative overflow-hidden">
          <div className="relative w-full">
            <Image src={hero.image.src} alt={hero.image.alt} fill priority fetchPriority="high" quality={70} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-band from-[10%] via-black/75 via-[50%] to-black/45" />
            <div className="absolute inset-x-0 top-0 bottom-20 hidden bg-gradient-to-l from-black/55 via-transparent to-transparent md:bottom-24 lg:block" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-band md:h-24" aria-hidden="true" />
            <div className="relative z-[2]">
              <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-12 pt-[4.5rem] md:pt-24 lg:min-h-[600px] lg:grid-cols-[1fr,400px] lg:gap-14 lg:pb-16">
                <div>
                  <p className="eyebrow !text-[#EBCF8E] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] md:[text-shadow:none]">{hero.eyebrow}</p>
                  <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] text-white md:text-6xl md:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                    {hero.headline}
                  </h1>
                  <p className="mt-4 max-w-xl text-white/85">{hero.sub}</p>
                  <div className="mt-7">
                    <a href={site.phoneHref} className="inline-block border border-white/80 bg-charcoalDeep/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:border-gold hover:text-gold">
                      Call {site.phone}
                    </a>
                  </div>
                </div>
                <div id="quote" className="scroll-mt-28 border border-gold bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] md:p-8">
                  <p className="eyebrow">Your detailed quotation</p>
                  <p className="mt-2 font-display text-2xl leading-snug">Priced line by line, before you commit</p>
                  <div className="mt-5">
                    <LeadForm compact service={serviceSlug} location={data.countySlug} />
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-stone">
                    Free site visit, no obligation · Same working day reply
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProjectCarousel projects={carouselProjects} />
      </div>

      <TrustBar />

      {/* Answer-led intro — no H2 */}
      <section className="relative">
        <SectionIndex label="01 · Intro" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Loft conversions in {county}</p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {data.intro.map((para) => (
                <p key={para.slice(0, 40)} className="text-stone leading-relaxed">{para}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a href="#quote" className="bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">
                Book a free site visit
              </a>
              <a href={site.phoneHref} className="text-sm font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep">
                Or call {site.phone}
              </a>
            </div>
          </Reveal>
        </div>
        <div className="relative aspect-[21/9] w-full md:aspect-[3/1]">
          <Image src={data.introImage.src} alt={data.introImage.alt} fill sizes="100vw" className="object-cover" />
        </div>
      </section>

      {/* Areas we cover */}
      <section className="relative bg-ivory">
        <GoldPattern id={`lattice-areas-${data.countySlug}`} />
        <SectionIndex label="02 · Areas" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Where we build</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.areas.title}</h2>
            <p className="mt-4 max-w-3xl text-stone leading-relaxed">{data.areas.intro}</p>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {data.areas.clusters.map((cluster, i) => (
              <Reveal key={cluster.name} delay={i * 80}>
                <p className="eyebrow">{cluster.name}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {cluster.towns.map((town) => {
                    const href = town.href || (town.slug ? `/${serviceSlug}/${town.slug}` : null);
                    return href ? (
                      <Link
                        key={town.name}
                        href={href}
                        className="border border-line bg-white px-4 py-2 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                      >
                        {town.name}
                      </Link>
                    ) : (
                      <span
                        key={town.name}
                        className="border border-line/60 px-4 py-2 text-sm text-stone"
                      >
                        {town.name}
                      </span>
                    );
                  })}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-10 text-sm text-stone">
              Prefer the full service overview?{' '}
              <Link href={`/${serviceSlug}`} className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep">
                {data.overviewLinkLabel || 'Loft conversions across Hertfordshire and Essex'}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Roof stock → loft types */}
      <section className="relative">
        <SectionIndex label="03 · Roofs" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Matched to your roof</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.roofs.title}</h2>
            <p className="mt-4 max-w-2xl font-display italic text-lg text-stone">{data.roofs.intro}</p>
          </Reveal>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {data.roofs.types.map((t, i) => (
              <Reveal key={t.conversion} delay={i * 100}>
                <article className="group">
                  <div className="img-zoom relative aspect-[16/10]">
                    <Image src={t.image} alt={t.imageAlt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
                    <span className="absolute left-0 top-4 bg-charcoal px-3 py-1.5 text-xs font-semibold uppercase tracking-eyebrow text-gold">
                      {t.conversion}
                    </span>
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-eyebrow text-goldDeep">{t.roofStock}</p>
                  <h3 className="mt-2 text-2xl">{t.conversion}</h3>
                  <div className="mt-3 h-px w-10 bg-gold" />
                  <p className="mt-3 text-sm leading-relaxed text-stone">{t.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-14 text-center">
              <p className="max-w-2xl mx-auto text-stone leading-relaxed">{data.roofs.closing}</p>
              <p className="mt-4 font-display italic text-lg text-stone">We look at your roof honestly.</p>
              <a href="#quote" className="mt-5 inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">
                Book a free site visit
              </a>
              <p className="mt-6 text-sm text-stone">
                See all conversion types on our{' '}
                <Link href={`/${serviceSlug}`} className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep">
                  loft conversions page
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Planning */}
      <section className="relative bg-ivory">
        <GoldPattern id={`lattice-planning-${data.countySlug}`} />
        <SectionIndex label="04 · Planning" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Planning & regulations</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.planning.title}</h2>
            <p className="mt-4 max-w-2xl text-stone leading-relaxed">{data.planning.intro}</p>
          </Reveal>
          <div className="mt-12 grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal delay={80}>
              <h3 className="text-2xl">{data.planning.permitted.title}</h3>
              <div className="mt-3 h-px w-10 bg-gold" />
              <ul className="mt-6 space-y-4">
                {data.planning.permitted.points.map((p) => (
                  <li key={p.slice(0, 48)} className="text-sm leading-relaxed text-stone">{p}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={160}>
              <h3 className="text-2xl">{data.planning.always.title}</h3>
              <div className="mt-3 h-px w-10 bg-gold" />
              <ul className="mt-6 space-y-4">
                {data.planning.always.points.map((p) => (
                  <li key={p.slice(0, 48)} className="text-sm leading-relaxed text-stone">{p}</li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div className="mt-12 flex flex-wrap items-center gap-6">
              {data.planning.blogLink && (
                <Link
                  href={data.planning.blogLink.href}
                  className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
                >
                  {data.planning.blogLink.label}
                </Link>
              )}
              <a href="#quote" className="bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">
                We handle this as part of the job
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* What a loft involves */}
      <section className="relative overflow-x-clip">
        <SectionIndex label="05 · Process" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.involves.title}</h2>
            <p className="mt-4 max-w-3xl text-stone leading-relaxed">{data.involves.intro}</p>
          </Reveal>
          <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {data.involves.steps.map((s, i) => (
              <Reveal key={s.step} delay={i * 80}>
                <div className="relative pt-16 md:pt-20">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 select-none font-display text-[80px] leading-none text-gold/20 md:text-[100px]"
                  >
                    {s.step}
                  </span>
                  <h3 className="relative font-display text-xl">{s.title}</h3>
                  <div className="mt-3 h-px w-10 bg-gold" />
                  <p className="mt-3 text-sm leading-relaxed text-stone">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-14 text-center">
            <a href="#quote" className="inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">
              Start with a site visit
            </a>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="relative border-y border-line bg-white">
        <SectionIndex label="06 · Why us" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Why homeowners choose us</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.whyUs.title}</h2>
            <p className="mt-4 max-w-2xl font-display italic text-lg text-stone">{data.whyUs.intro}</p>
          </Reveal>
          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            {data.whyUs.reasons.map((r, i) => (
              <Reveal key={r.title} delay={i * 80}>
                <h3 className="text-2xl">{r.title}</h3>
                <div className="mt-3 h-px w-10 bg-gold" />
                <p className="mt-3 text-sm leading-relaxed text-stone">{r.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-12 text-sm text-stone">
              <Link
                href={data.whyUs.sidewaysLink.href}
                className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
              >
                {data.whyUs.sidewaysLink.label}
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Cost */}
      <section className="relative">
        <SectionIndex label="07 · Cost" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
            <Reveal>
              <p className="eyebrow">Cost, in the open</p>
              <h2 className="mt-3 text-4xl md:text-5xl">{data.cost.title}</h2>
              <p className="mt-6 text-stone leading-relaxed">{data.cost.intro}</p>
              <div className="mt-10 space-y-0">
                {data.cost.ladder.map((rung, i) => (
                  <div
                    key={rung.name}
                    className={`flex items-baseline justify-between gap-4 border-line py-4 ${i === 0 ? 'border-t' : ''} border-b`}
                  >
                    <span className="font-display text-2xl md:text-3xl">{rung.name}</span>
                    <span className="text-sm text-stone">{rung.note}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8 text-stone leading-relaxed">{data.cost.closing}</p>
              <p className="mt-6">
                <Link
                  href={data.cost.costLink.href}
                  className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
                >
                  {data.cost.costLink.label}
                </Link>
              </p>
              <div className="mt-8">
                <a href="#quote" className="bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">
                  Get your itemised quote
                </a>
              </div>
            </Reveal>
            <QuotationCard included={data.cost.included} />
          </div>
        </div>
      </section>

      <FaqSection
        faqs={data.faqs}
        label="08 · Questions"
        heading={`Loft conversion questions in ${county}, answered straight`}
        intro={data.faqIntro || `The questions every ${county} homeowner asks at the first site visit.`}
      />

      {/* Related links */}
      <section className="relative">
        <SectionIndex label="09 · Next steps" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Useful next steps</p>
            <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">Keep reading</h2>
            <div className="mt-8 flex flex-wrap gap-3">
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
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-charcoalDeep text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{data.cta.eyebrow}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">{data.cta.title}</h2>
            <p className="mt-5 text-white/70">{data.cta.text}</p>
            <p className="mt-6 font-display text-2xl text-gold">
              <a href={site.phoneHref}>{site.phone}</a>
            </p>
          </Reveal>
          <Reveal delay={120}>
            <LeadForm dark service={serviceSlug} location={data.countySlug} />
          </Reveal>
        </div>
      </section>
    </>
  );
}

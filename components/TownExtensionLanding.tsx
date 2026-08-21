import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';
import type { SanityProject } from '@/lib/projects';
import { toCarouselSlides } from '@/lib/projects';
import type { Testimonial } from '@/lib/testimonials';
import TrustBar from '@/components/TrustBar';
import ProjectCarousel from '@/components/ProjectCarousel';
import FaqSection from '@/components/FaqSection';
import LeadForm from '@/components/LeadForm';
import TestimonialShowcase from '@/components/TestimonialShowcase';
import Reveal from '@/components/Reveal';
import GoldPattern from '@/components/GoldPattern';
import SectionIndex from '@/components/SectionIndex';
import { sanityFetch } from '@/sanity/live';
import { PROJECTS_BY_TYPE_QUERY, TESTIMONIALS_BY_CATEGORY_QUERY } from '@/sanity/queries';

export type TownExtensionLandingData = {
  serviceSlug: string;
  town: string;
  county: string;
  countySlug: string;
  townSlug: string;
  hero: {
    image: { src: string; alt: string; caption?: string };
    eyebrow: string;
    headline: string;
  };
  intro: {
    paragraphs: string[];
    cta: { title: string; text: string; secondaryCta: string };
  };
  whyUs?: {
    title: string;
    text: string;
  };
  homes?: {
    title: string;
    intro: string;
    body: string;
    closing: string;
    image: { src: string; alt: string };
  };
  extensionTypes?: {
    title: string;
    intro?: string;
    items?: string[];
    closing?: string;
    image: { src: string; alt: string };
  };
  flood?: { title: string; paragraphs: string[] };
  ground?: { title: string; paragraphs: string[] };
  planning?: { title: string; paragraphs: string[]; items?: string[]; closingParagraphs?: string[] };
  place?: { title: string; paragraphs: string[] };
  cost: {
    title: string;
    paragraphs: string[];
    cta: { title: string; text: string; secondaryCta: string };
  };
  buildProcess?: {
    title: string;
    text: string;
    steps?: { step: string; title: string; text: string }[];
  };
  faqs: { q: string; a: string }[];
  relatedLinks: { href: string; label: string }[];
  cta: { eyebrow: string; title: string; text: string };
};

export default async function TownExtensionLanding({ data }: { data: TownExtensionLandingData }) {
  const { serviceSlug, town, county, hero } = data;
  const isLoft = serviceSlug === 'loft-conversions';
  const projectType = isLoft ? 'loft-conversion' : 'extension';
  const servicePhrase = isLoft ? 'Loft conversions' : 'House extensions';
  const serviceNoun = isLoft ? 'loft conversion' : 'house extension';

  const [{ data: projectData }, { data: testimonialData }] = await Promise.all([
    sanityFetch({
      query: PROJECTS_BY_TYPE_QUERY,
      params: { projectType },
    }),
    sanityFetch({
      query: TESTIMONIALS_BY_CATEGORY_QUERY,
      params: { category: projectType },
    }),
  ]);

  const carouselProjects = toCarouselSlides((projectData || []) as SanityProject[]);
  const testimonials = (testimonialData || []) as Testimonial[];
  const hasTestimonials = testimonials.length > 0;
  let section = 1;
  const nextLabel = (name: string) => `${String(section++).padStart(2, '0')} · ${name}`;

  return (
    <>
      {/* Hero + carousel */}
      <div className="bg-band">
        <section className="relative overflow-hidden">
          <div className="relative w-full">
            <Image
              src={hero.image.src}
              alt={hero.image.alt}
              fill
              priority
              fetchPriority="high"
              quality={70}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-band from-[10%] via-black/75 via-[50%] to-black/45" />
            <div className="absolute inset-x-0 top-0 bottom-20 hidden bg-gradient-to-l from-black/55 via-transparent to-transparent md:bottom-24 lg:block" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-band md:h-24" aria-hidden="true" />
            <div className="relative z-[2]">
              <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-12 pt-[4.5rem] md:pt-24 lg:min-h-[600px] lg:grid-cols-[1fr,400px] lg:gap-14 lg:pb-16">
                <div>
                  <p className="eyebrow !text-[#EBCF8E] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] md:[text-shadow:none]">
                    {hero.eyebrow}
                  </p>
                  <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] text-white md:text-6xl md:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                    {hero.headline}
                  </h1>
                  <p className="mt-4 max-w-xl text-white/85">{data.intro.paragraphs[0]}</p>
                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <a
                      href={site.phoneHref}
                      className="inline-block border border-white/80 bg-charcoalDeep/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:border-gold hover:text-gold"
                    >
                      Call {site.phone}
                    </a>
                    <a
                      href="#quote"
                      className="text-sm font-semibold text-white underline decoration-gold underline-offset-4 hover:text-gold"
                    >
                      Request a callback
                    </a>
                  </div>
                </div>
                <div
                  id="quote"
                  className="scroll-mt-28 border border-gold bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] md:p-8"
                >
                  <p className="eyebrow">Your detailed quotation</p>
                  <p className="mt-2 font-display text-2xl leading-snug">Priced line by line, before you commit</p>
                  <div className="mt-5">
                    <LeadForm compact service={serviceSlug} location={data.townSlug} />
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

      {/* Intro + inline CTA */}
      <section className="relative">
        <SectionIndex label={nextLabel('Intro')} />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">{servicePhrase} in {town}</p>
            {data.intro.paragraphs.slice(1).map((para) => (
              <p key={para.slice(0, 48)} className="mt-6 max-w-3xl text-stone leading-relaxed">
                {para}
              </p>
            ))}
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-12 border border-gold bg-ivory p-8 md:p-10">
              <h2 className="font-display text-3xl md:text-4xl">{data.intro.cta.title}</h2>
              <p className="mt-4 max-w-2xl text-stone leading-relaxed">{data.intro.cta.text}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href={site.phoneHref}
                  className="bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
                >
                  Call {site.phone}
                </a>
                <a
                  href="#quote"
                  className="text-sm font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
                >
                  {data.intro.cta.secondaryCta}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
        <figure className="relative aspect-[21/9] w-full md:aspect-[3/1]">
          <Image src={hero.image.src} alt={hero.image.alt} fill sizes="100vw" className="object-cover" />
          {hero.image.caption && (
            <figcaption className="absolute bottom-0 left-0 right-0 bg-charcoal/80 px-4 py-3 text-sm text-white/90">
              {hero.image.caption}
            </figcaption>
          )}
        </figure>
      </section>

      {/* Why us */}
      {data.whyUs && (
        <section className="relative bg-ivory">
          <GoldPattern id={`lattice-why-${data.townSlug}`} />
          <SectionIndex label={nextLabel('Why us')} />
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
            <Reveal>
              <p className="eyebrow">Why homeowners choose us</p>
              <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.whyUs.title}</h2>
              <p className="mt-6 max-w-3xl text-stone leading-relaxed">{data.whyUs.text}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Homes (Chelmsford-style) */}
      {data.homes && (
        <section className="relative bg-ivory">
          <GoldPattern id={`lattice-homes-${data.townSlug}`} />
          <SectionIndex label={nextLabel('Homes')} />
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <Reveal>
                <p className="eyebrow">Matched to your home</p>
                <h2 className="mt-3 max-w-xl text-4xl md:text-5xl">{data.homes.title}</h2>
                <p className="mt-4 text-stone leading-relaxed">{data.homes.intro}</p>
                <p className="mt-6 text-stone leading-relaxed">{data.homes.body}</p>
                <p className="mt-6 font-display italic text-lg text-stone">{data.homes.closing}</p>
                <a
                  href="#quote"
                  className="mt-8 inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
                >
                  Book a free site visit
                </a>
              </Reveal>
              <Reveal delay={120}>
                <div className="img-zoom relative aspect-[4/5]">
                  <Image
                    src={data.homes.image.src}
                    alt={data.homes.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* Extension types (Chigwell-style) */}
      {data.extensionTypes && (
        <section className="relative">
          <SectionIndex label={nextLabel('Types')} />
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
              <Reveal>
                <p className="eyebrow">Matched to your home</p>
                <h2 className="mt-3 max-w-xl text-4xl md:text-5xl">{data.extensionTypes.title}</h2>
                {data.extensionTypes.intro && (
                  <p className="mt-4 text-stone leading-relaxed">{data.extensionTypes.intro}</p>
                )}
                {data.extensionTypes.items && data.extensionTypes.items.length > 0 && (
                  <ul className="mt-8 space-y-4">
                    {data.extensionTypes.items.map((item) => (
                      <li key={item.slice(0, 48)} className="flex items-start gap-3 text-stone leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {data.extensionTypes.closing && (
                  <p className="mt-6 text-stone leading-relaxed">{data.extensionTypes.closing}</p>
                )}
                <a
                  href="#quote"
                  className="mt-8 inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
                >
                  Book a free site visit
                </a>
              </Reveal>
              <Reveal delay={120}>
                <div className="img-zoom relative aspect-[4/5]">
                  <Image
                    src={data.extensionTypes.image.src}
                    alt={data.extensionTypes.image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {/* Flood risk (Chelmsford) */}
      {data.flood && (
        <section className="relative">
          <SectionIndex label={nextLabel('Flood & ground')} />
          <div className="mx-auto max-w-6xl px-4 py-20">
            <Reveal>
              <p className="eyebrow">Local conditions</p>
              <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.flood.title}</h2>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {data.flood.paragraphs.map((para, i) => (
                <Reveal key={para.slice(0, 40)} delay={i * 80}>
                  <p className="text-stone leading-relaxed">{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Planning */}
      {data.planning && (
        <section className="relative bg-ivory">
          <GoldPattern id={`lattice-planning-${data.townSlug}`} />
          <SectionIndex label={nextLabel('Planning')} />
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
            <Reveal>
              <p className="eyebrow">Planning & regulations</p>
              <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.planning.title}</h2>
            </Reveal>
            <div className="mt-10 max-w-3xl space-y-6">
            {data.planning.paragraphs.map((para, i) => (
              <Reveal key={para.slice(0, 48)} delay={i * 60}>
                <p className="text-stone leading-relaxed">{para}</p>
              </Reveal>
            ))}
            {data.planning.items && data.planning.items.length > 0 && (
              <ul className="space-y-4">
                {data.planning.items.map((item) => (
                  <li key={item.slice(0, 48)} className="flex items-start gap-3 text-stone leading-relaxed">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {data.planning.closingParagraphs?.map((para, i) => (
              <Reveal key={para.slice(0, 48)} delay={(data.planning.paragraphs.length + i) * 60}>
                <p className="text-stone leading-relaxed">{para}</p>
              </Reveal>
            ))}
            </div>
            <Reveal delay={200}>
              <div className="mt-10">
                <a
                  href="#quote"
                  className="inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
                >
                  We handle this as part of the job
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Ground (Chigwell) */}
      {data.ground && (
        <section className="relative">
          <SectionIndex label={nextLabel('Ground')} />
          <div className="mx-auto max-w-6xl px-4 py-20">
            <Reveal>
              <p className="eyebrow">Local conditions</p>
              <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.ground.title}</h2>
            </Reveal>
            <div className="mt-10 max-w-3xl space-y-6">
              {data.ground.paragraphs.map((para, i) => (
                <Reveal key={para.slice(0, 40)} delay={i * 80}>
                  <p className="text-stone leading-relaxed">{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cost */}
      <section className="relative">
        <SectionIndex label={nextLabel('Cost')} />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Cost, in the open</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.cost.title}</h2>
            <div className="mt-8 max-w-3xl space-y-6">
              {data.cost.paragraphs.map((para) => (
                <p key={para.slice(0, 48)} className="text-stone leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-12 border border-gold bg-ivory p-8 md:p-10">
              <h3 className="font-display text-3xl md:text-4xl">{data.cost.cta.title}</h3>
              <p className="mt-4 max-w-2xl text-stone leading-relaxed">{data.cost.cta.text}</p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href={site.phoneHref}
                  className="bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
                >
                  Call {site.phone}
                </a>
                <a
                  href="#quote"
                  className="text-sm font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
                >
                  {data.cost.cta.secondaryCta}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Build process */}
      {data.buildProcess && (
        <section className="relative border-y border-line bg-white">
          <SectionIndex label={nextLabel('Process')} />
          <div className="mx-auto max-w-6xl px-4 py-20">
            <Reveal>
              <p className="eyebrow">How it works</p>
              <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.buildProcess.title}</h2>
              <p className="mt-6 max-w-3xl text-stone leading-relaxed">{data.buildProcess.text}</p>
            </Reveal>
            {data.buildProcess.steps && data.buildProcess.steps.length > 0 && (
              <div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {data.buildProcess.steps.map((s, i) => (
                  <Reveal key={s.step} delay={i * 60}>
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
            )}
            <div className="mt-10">
              <a
                href="#quote"
                className="inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
              >
                Start with a site visit
              </a>
            </div>
          </div>
        </section>
      )}

      {data.place && (
        <section className="relative">
          <SectionIndex label={nextLabel('The place')} />
          <div className="mx-auto max-w-6xl px-4 py-20">
            <Reveal>
              <p className="eyebrow">Why stay</p>
              <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.place.title}</h2>
            </Reveal>
            <div className="mt-10 max-w-3xl space-y-6">
              {data.place.paragraphs.map((para, i) => (
                <Reveal key={para.slice(0, 40)} delay={i * 80}>
                  <p className="text-stone leading-relaxed">{para}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials — only when real reviews are available */}
      {hasTestimonials && (
        <section className="relative">
          <SectionIndex label={nextLabel('Reviews')} />
          <div className="mx-auto max-w-6xl px-4 py-20">
            <Reveal>
              <p className="eyebrow">What homeowners say</p>
              <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">Trusted by homeowners across {county}</h2>
              <div className="mt-10">
                <TestimonialShowcase testimonials={testimonials} />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      <FaqSection
        faqs={data.faqs}
        label={nextLabel('Questions')}
        heading={`${serviceNoun.charAt(0).toUpperCase()}${serviceNoun.slice(1)} questions in ${town}, answered straight`}
        intro={`The questions every ${town} homeowner asks at the first site visit.`}
      />

      {/* Related links */}
      <section className="relative">
        <SectionIndex label={nextLabel('Next steps')} />
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
            <p className="mt-8 text-sm text-stone">
              Back to{' '}
              <Link
                href={data.countySlug === 'london' ? `/${serviceSlug}/london` : `/${serviceSlug}`}
                className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
              >
                {data.countySlug === 'london'
                  ? `${servicePhrase.toLowerCase()} in London`
                  : `${servicePhrase.toLowerCase()} across Hertfordshire and Essex`}
              </Link>
            </p>
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
            <LeadForm dark service={serviceSlug} location={data.townSlug} />
          </Reveal>
        </div>
      </section>
    </>
  );
}

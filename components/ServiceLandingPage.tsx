import Image from 'next/image';
import Link from 'next/link';
import projects from '@/data/projects.json';
import images from '@/data/images.json';
import { site } from '@/lib/site';
import TrustBar from '@/components/TrustBar';
import TrustStrip from '@/components/TrustStrip';
import ReviewsBadges from '@/components/ReviewsBadges';
import BeforeAfterGallery, { type BeforeAfterPair } from '@/components/BeforeAfterGallery';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import ProjectCarousel from '@/components/ProjectCarousel';
import ProjectCard from '@/components/ProjectCard';
import TestimonialShowcase from '@/components/TestimonialShowcase';
import ProcessSection from '@/components/ProcessSection';
import FaqSection from '@/components/FaqSection';
import LeadForm from '@/components/LeadForm';
import QuotationCard from '@/components/QuotationCard';
import CompareCard from '@/components/CompareCard';
import Reveal from '@/components/Reveal';
import GoldPattern from '@/components/GoldPattern';
import SectionIndex from '@/components/SectionIndex';
import { ArrowRight, HardHat, ShieldCheck, Users } from 'lucide-react';
import type { Testimonial } from '@/lib/testimonials';
import type { CarouselSlide } from '@/lib/projects';
import { locationPageHref, type LocationPage } from '@/lib/locations';
import { normalizeLocationSlug } from '@/lib/location-page';

export type ServiceLandingData = {
  heroImage: { src: string; alt: string };
  heroEyebrow: string;
  heroHeadline: string;
  heroSub: string;
  introTitle: string;
  intro: string[];
  compare: {
    title: string;
    moveLabel: string;
    moveItems: string[];
    moveTotal: string;
    stayLabel: string;
    stayItems: string[];
    stayTotal: string;
    cta: string;
  };
  typesTitle: string;
  typesIntro: string;
  types: { name: string; priceBand: string; text: string; image: string; imageAlt: string }[];
  costTitle: string;
  costRange: string;
  costRangeNote: string;
  costText: string;
  included: string[];
  costLink: { href: string; label: string } | null;
  directorEyebrow?: string;
  directorImage?: { src: string; alt: string };
  directorImageAspect?: string;
  directorHeadline: string;
  directorBody: string;
  processSteps: { step: string; title: string; text: string }[];
  finalCtaBody: string;
  faqs: { q: string; a: string }[];
  areasHeadline?: string;
  areasBody?: string;
  paymentHeading?: string;
  paymentBody?: string;
  scarcityLine?: string;
  guaranteeLine?: string;
};

export default function ServiceLandingPage({
  serviceSlug,
  serviceName,
  shortName,
  landing,
  testimonials,
  carouselProjects,
  locationPages,
}: {
  serviceSlug: string;
  serviceName: string;
  shortName: string;
  landing: ServiceLandingData;
  testimonials: Testimonial[];
  carouselProjects: CarouselSlide[];
  locationPages: LocationPage[];
}) {
  const isLoft = serviceSlug === 'loft-conversions';
  const serviceProjects = projects.filter((p) => p.service === serviceSlug);
  const loftBeforeAfterPairs: BeforeAfterPair[] = isLoft
    ? [
        {
          id: 'roof-and-dormer',
          title: 'Roof re-cover and rear dormer',
          before: {
            src: '/images/loft-before-after-1-before.webp',
            alt: 'Roof before the loft conversion, freshly re-slated with scaffolding up and the dormer frame under construction',
          },
          after: {
            src: '/images/loft-before-after-1-after.webp',
            alt: 'Finished rear dormer loft conversion with slate cladding, uPVC windows and a Juliet balcony',
          },
        },
      ]
    : [];
  // Loft: avoid repeating type-tile images in a thin "recent projects" grid.
  // Sanity carousel already surfaces genuine loft jobs; trust/reviews carry the rest.
  const showStaticProjects = !isLoft && serviceProjects.length > 0;
  const lower = shortName.toLowerCase();
  const [costLow, costHigh] = landing.costRange.split('–').map((s) => s.trim());
  const areasHeadline =
    landing.areasHeadline ||
    `${serviceName.toLowerCase().replace(/^./, (c) => c.toUpperCase())} across ${site.areaServed.join(' and ')}`;
  const areasBody =
    landing.areasBody ||
    `Based in ${site.base}, close enough for a site visit within days, not weeks. We also have dedicated ${lower} pages for the areas and towns we work in most:`;

  return (
    <>
      {/* Hero + carousel share one continuous band background */}
      <div className="bg-band">
        <section className="relative overflow-hidden">
          <div className="relative w-full">
            <Image
              src={landing.heroImage.src}
              alt={landing.heroImage.alt}
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
                    {landing.heroEyebrow}
                  </p>
                  <h1 className="mt-5 max-w-2xl text-5xl leading-[1.05] text-white md:text-6xl md:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                    {landing.heroHeadline}
                  </h1>
                  <p className="mt-6 max-w-xl text-white/85">{landing.heroSub}</p>
                  <div className="mt-9 flex flex-wrap gap-3">
                    <a
                      href="#quote"
                      className="inline-block bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-charcoalDeep transition-colors hover:bg-white"
                    >
                      Get my free quote
                    </a>
                    <a
                      href={site.phoneHref}
                      className="inline-block border border-white/80 bg-charcoalDeep/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:border-gold hover:text-gold"
                    >
                      Call {site.phone}
                    </a>
                  </div>
                  {landing.guaranteeLine && (
                    <p className="mt-6 max-w-xl text-sm text-white/75">{landing.guaranteeLine}</p>
                  )}
                  {isLoft && (
                    <div className="mt-7">
                      <ReviewsBadges condensed />
                    </div>
                  )}
                </div>
                <div
                  id="quote"
                  className="scroll-mt-28 min-h-[22rem] border border-gold bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.35)] md:min-h-[24rem] md:p-8"
                >
                  <p className="eyebrow">Your detailed quotation</p>
                  <p className="mt-2 font-display text-2xl leading-snug">Priced line by line, before you commit</p>
                  <div className="mt-5">
                    <LeadForm compact service={serviceSlug} />
                  </div>
                  <ul className="mt-5 space-y-2.5 border-t border-line pt-5">
                    <li className="flex items-start gap-2.5 text-sm leading-snug text-ink">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
                      <span>
                        <span className="font-semibold">{site.director} replies the same working day</span>
                        <span className="text-stone"> · Free site visit</span>
                      </span>
                    </li>
                    {isLoft && (
                      <>
                        <li className="flex items-start gap-2.5 text-sm leading-snug text-ink">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
                          <span className="font-semibold">Over 100 conversions completed</span>
                        </li>
                        <li className="flex items-start gap-2.5 text-sm leading-snug text-ink">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-gold" aria-hidden="true" />
                          <span className="font-semibold">Fully insured · 10-year guarantee</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ProjectCarousel projects={carouselProjects} />
      </div>

      {isLoft ? (
        <TrustStrip
          items={[
            { label: 'Over 100 loft conversions completed' },
            { label: 'Fully insured · 10-year guarantee' },
            { label: '10% deposit, then stages as work completes' },
          ]}
        />
      ) : (
        <TrustBar />
      )}

      {/* Intro */}
      <section className="relative">
        <SectionIndex label={`01 · Why a ${lower}`} />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">{serviceName}</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{landing.introTitle}</h2>
          </Reveal>
          <Reveal delay={80}>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {landing.intro.map((para) => (
                <p key={para.slice(0, 32)} className="text-stone leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="mt-14">
              <CompareCard compare={landing.compare} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Types of build */}
      <section className="relative bg-ivory">
        <GoldPattern id={`lattice-types-${serviceSlug}`} />
        <SectionIndex label="02 · Types" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Types of build</p>
            <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">{landing.typesTitle}</h2>
            <p className="mt-4 max-w-2xl font-display italic text-lg text-stone">{landing.typesIntro}</p>
          </Reveal>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {landing.types.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <article className="group">
                  <div className="img-zoom relative aspect-[16/10]">
                    <Image
                      src={t.image}
                      alt={t.imageAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover"
                      loading="lazy"
                    />
                    <span className="absolute left-0 top-4 bg-charcoal px-3 py-1.5 text-xs font-semibold uppercase tracking-eyebrow text-gold">
                      {t.priceBand}
                    </span>
                  </div>
                  <h3 className="mt-5 text-2xl">{t.name}</h3>
                  <div className="mt-3 h-px w-10 bg-gold" />
                  <p className="mt-3 text-sm leading-relaxed text-stone">{t.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-14 text-center">
              <p className="font-display italic text-lg text-stone">Not sure which one your home needs?</p>
              <a
                href="#quote"
                className="mt-5 inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
              >
                Ask {site.director} at a free site visit
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cost & what's included */}
      <section className="relative overflow-x-clip">
        <SectionIndex label="03 · Cost" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <p className="eyebrow">Cost, in the open</p>
              <h2 className="mt-3 text-4xl md:text-5xl">{landing.costTitle}</h2>
              <p className="mt-8 font-display text-[2.15rem] leading-none tracking-tight sm:text-[2.6rem] md:text-6xl">
                {costLow}
                <span aria-hidden="true" className="mx-1.5 text-gold sm:mx-2 md:mx-3">
                  –
                </span>
                {costHigh}
              </p>
              <p className="mt-3 text-sm text-stone">{landing.costRangeNote}</p>
              <p className="mt-6 text-stone leading-relaxed">{landing.costText}</p>
              {landing.costLink && (
                <p className="mt-6">
                  <Link
                    href={landing.costLink.href}
                    className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
                  >
                    {landing.costLink.label}
                  </Link>
                </p>
              )}
              {landing.paymentHeading && landing.paymentBody && (
                <div className="mt-10 border-l-2 border-gold pl-5">
                  <h3 className="font-display text-2xl">{landing.paymentHeading}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone">{landing.paymentBody}</p>
                </div>
              )}
              {isLoft && (
                <div className="mt-8">
                  <TrustStrip
                    condensed
                    items={[
                      { label: 'Over 100 loft conversions completed' },
                      { label: 'Fully insured · 10-year guarantee' },
                      { label: '10% deposit, then stages as work completes' },
                    ]}
                  />
                </div>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#quote"
                  className="bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
                >
                  Get your itemised quote
                </a>
              </div>
              {landing.guaranteeLine && (
                <p className="mt-4 text-sm text-stone">{landing.guaranteeLine}</p>
              )}
            </Reveal>
            <QuotationCard included={landing.included} />
          </div>
        </div>
      </section>

      {/* Projects — extensions keep static grid; loft relies on carousel + before/after shell */}
      {showStaticProjects && (
        <section className="relative bg-ivory">
          <GoldPattern id={`lattice-projects-${serviceSlug}`} />
          <SectionIndex label="04 · Projects" />
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
            <Reveal>
              <p className="eyebrow">Recent {lower}s</p>
              <h2 className="mt-3 text-4xl md:text-5xl">Built by Jason and his team</h2>
            </Reveal>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {serviceProjects.map((p, i) => (
                <Reveal key={p.slug} delay={i * 100}>
                  <ProjectCard {...p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {isLoft && loftBeforeAfterPairs.length === 1 && (
        <section className="relative bg-ivory">
          <GoldPattern id={`lattice-before-after-${serviceSlug}`} />
          <SectionIndex label="04 · Projects" />
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
              <Reveal>
                <p className="eyebrow">Recent loft conversions</p>
                <h2 className="mt-3 text-4xl md:text-5xl">Built by Jason and his team</h2>
                <p className="mt-5 text-stone leading-relaxed">
                  Genuine J.Berry loft work, before and after. Drag the slider to compare. More added
                  as each job is photographed.
                </p>
                <div className="mt-8">
                  <a
                    href="#quote"
                    className="inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
                  >
                    Get your itemised quote
                  </a>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <BeforeAfterSlider
                  before={loftBeforeAfterPairs[0].before}
                  after={loftBeforeAfterPairs[0].after}
                  className="border border-line shadow-[0_16px_48px_rgba(26,23,20,0.08)]"
                />
                {(loftBeforeAfterPairs[0].title || loftBeforeAfterPairs[0].location) && (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-eyebrow text-stone">
                    {loftBeforeAfterPairs[0].title}
                    {loftBeforeAfterPairs[0].location && (
                      <span className="font-normal normal-case tracking-normal">
                        {' '}
                        · {loftBeforeAfterPairs[0].location}
                      </span>
                    )}
                  </p>
                )}
              </Reveal>
            </div>
          </div>
        </section>
      )}

      {isLoft && loftBeforeAfterPairs.length !== 1 && (
        <section className="relative bg-ivory">
          <GoldPattern id={`lattice-before-after-${serviceSlug}`} />
          <SectionIndex label="04 · Projects" />
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
            <Reveal>
              <p className="eyebrow">Recent loft conversions</p>
              <h2 className="mt-3 text-4xl md:text-5xl">Built by Jason and his team</h2>
              <p className="mt-4 max-w-2xl text-stone leading-relaxed">
                Genuine J.Berry loft work, drag the slider to compare. More added as each job is
                photographed.
              </p>
            </Reveal>
            <div className="mt-10">
              <BeforeAfterGallery pairs={loftBeforeAfterPairs} />
            </div>
          </div>
        </section>
      )}

      {/* Director */}
      <section className="relative overflow-x-clip bg-ivory">
        <GoldPattern id={`lattice-director-${serviceSlug}`} />
        <SectionIndex label={isLoft ? '05 · The team' : '05 · The director'} />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-14 lg:grid-cols-[2fr,3fr] lg:items-center lg:gap-16">
            <Reveal>
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-3 hidden border border-gold/30 sm:block lg:-inset-4"
                />
                <div className={`img-zoom relative ${landing.directorImageAspect ?? 'aspect-[3/4]'}`}>
                  <Image
                    src={landing.directorImage?.src ?? images.director.src}
                    alt={landing.directorImage?.alt ?? images.director.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                {isLoft && (
                  <div className="absolute -bottom-5 -right-3 bg-charcoal px-5 py-4 text-white shadow-[0_16px_40px_rgba(26,23,20,0.25)] sm:-right-6">
                    <p className="font-display text-3xl leading-none text-gold">100+</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-eyebrow text-white/80">
                      Loft conversions
                      <br />
                      completed
                    </p>
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="eyebrow">{landing.directorEyebrow ?? 'The person you deal with'}</p>
              <h2 className="mt-3 text-4xl md:text-5xl">{landing.directorHeadline}</h2>
              <p className="mt-5 text-stone leading-relaxed">{landing.directorBody}</p>
              {landing.scarcityLine && (
                <p className="mt-5 text-stone leading-relaxed">{landing.scarcityLine}</p>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6">
                <div className="flex items-center gap-2.5">
                  <HardHat className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-sm text-ink">
                    <span className="font-semibold">15–20</span> projects a year
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Users className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.75} aria-hidden="true" />
                  <span className="text-sm text-ink">
                    <span className="font-semibold">Same team</span> on every job
                  </span>
                </div>
                {landing.guaranteeLine && (
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.75} aria-hidden="true" />
                    <span className="text-sm text-ink">
                      <span className="font-semibold">10-year</span> guarantee
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#quote"
                  className="group inline-flex items-center gap-2 bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
                >
                  Get your quote from {site.director}
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </a>
              </div>
              {landing.guaranteeLine && (
                <p className="mt-4 text-sm text-stone">{landing.guaranteeLine}</p>
              )}
            </Reveal>
          </div>
        </div>
      </section>

      <ProcessSection label="06 · Process" steps={landing.processSteps} />

      {/* Testimonials */}
      <section className="relative overflow-x-clip border-y border-line bg-white">
        <SectionIndex label="07 · Stories" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow">Tell your story</p>
              <h2 className="mt-3 text-4xl md:text-5xl">In our clients&rsquo; words</h2>
              <p className="mx-auto mt-4 max-w-xl text-stone leading-relaxed">
                Real clients, with their towns where we have them. More reviews added as they come in.
              </p>
            </div>
            <div className="mt-8 flex justify-center">
              <ReviewsBadges />
            </div>
            <div className="mt-10">
              <TestimonialShowcase testimonials={testimonials} />
            </div>
          </Reveal>
        </div>
      </section>

      <FaqSection
        faqs={landing.faqs}
        label="08 · Questions"
        heading={`${shortName} questions, answered straight`}
        intro={`The questions every ${lower} client asks ${site.director} at the first site visit.`}
      />

      {/* Areas */}
      <section className="relative">
        <SectionIndex label="09 · Areas" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Where we build</p>
            <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">{areasHeadline}</h2>
            <p className="mt-4 max-w-2xl text-stone leading-relaxed">{areasBody}</p>
            <p className="mt-4 max-w-2xl text-sm text-stone">
              Dedicated {lower} pages for the towns we work in most:
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {serviceSlug === 'loft-conversions' && (
                <Link
                  href="/loft-conversions/essex"
                  className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                >
                  {shortName}s in Essex
                </Link>
              )}
              {serviceSlug === 'extensions' && (
                <>
                  <Link
                    href="/extensions/essex/chelmsford"
                    className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                  >
                    {shortName}s in Chelmsford
                  </Link>
                  <Link
                    href="/extensions/essex/chigwell"
                    className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                  >
                    {shortName}s in Chigwell
                  </Link>
                  <Link
                    href="/extensions/essex/ongar"
                    className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                  >
                    {shortName}s in Ongar
                  </Link>
                  <Link
                    href="/extensions/essex/loughton"
                    className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                  >
                    {shortName}s in Loughton
                  </Link>
                  <Link
                    href="/extensions/essex/brentwood"
                    className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                  >
                    {shortName}s in Brentwood
                  </Link>
                  <Link
                    href="/extensions/essex/epping"
                    className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                  >
                    {shortName}s in Epping
                  </Link>
                </>
              )}
              {locationPages
                .filter((l) => {
                  // Static town landings already linked above — avoid duplicate buttons
                  const slug = normalizeLocationSlug(l.slug)
                  return !['chelmsford', 'chigwell', 'ongar', 'loughton', 'brentwood', 'epping'].includes(slug)
                })
                .map((l) => (
                <Link
                  key={l._id}
                  href={locationPageHref(l, serviceSlug)}
                  className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                >
                  {shortName}s in {l.town}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quote — the #quote anchor lives on the hero form card above */}
      <section className="bg-charcoalDeep text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Start your {lower}</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Get your detailed quotation</h2>
            <p className="mt-5 text-white/70">{landing.finalCtaBody}</p>
            {landing.guaranteeLine && (
              <p className="mt-4 text-sm text-white/60">{landing.guaranteeLine}</p>
            )}
            <p className="mt-6 font-display text-2xl text-gold">
              <a href={site.phoneHref}>{site.phone}</a>
            </p>
          </Reveal>
          <Reveal delay={120}>
            <LeadForm dark service={serviceSlug} />
          </Reveal>
        </div>
      </section>
    </>
  );
}

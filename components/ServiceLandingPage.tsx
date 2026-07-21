import Image from 'next/image';
import Link from 'next/link';
import projects from '@/data/projects.json';
import locations from '@/data/locations.json';
import images from '@/data/images.json';
import { site } from '@/lib/site';
import TrustBar from '@/components/TrustBar';
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
  faqs: { q: string; a: string }[];
};

export default function ServiceLandingPage({
  serviceSlug,
  serviceName,
  shortName,
  landing,
}: {
  serviceSlug: string;
  serviceName: string;
  shortName: string;
  landing: ServiceLandingData;
}) {
  const serviceProjects = projects.filter((p) => p.service === serviceSlug);
  const lower = shortName.toLowerCase();
  const [costLow, costHigh] = landing.costRange.split('–').map((s) => s.trim());

  return (
    <>
      {/* Hero + carousel share one continuous band background */}
      <div className="bg-band">
        <section className="relative overflow-hidden">
          <div className="relative w-full">
            <Image src={landing.heroImage.src} alt={landing.heroImage.alt} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-band from-[10%] via-black/75 via-[50%] to-black/45" />
            {/* Extra darkening behind the form card — stops above the band floor so the join stays even */}
            <div className="absolute inset-x-0 top-0 bottom-20 hidden bg-gradient-to-l from-black/55 via-transparent to-transparent md:bottom-24 lg:block" />
            {/* Solid band floor guarantees a uniform edge into the carousel */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-band md:h-24" aria-hidden="true" />
            <div className="relative z-[2]">
              <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pb-12 pt-[4.5rem] md:pt-24 lg:min-h-[600px] lg:grid-cols-[1fr,400px] lg:gap-14 lg:pb-16">
              <div>
                <p className="eyebrow !text-[#EBCF8E] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] md:[text-shadow:none]">{landing.heroEyebrow}</p>
                <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] text-white md:text-6xl md:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                  {landing.heroHeadline}
                </h1>
                <p className="mt-4 max-w-xl text-white/85">{landing.heroSub}</p>
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
                  <LeadForm compact service={serviceSlug} />
                </div>
                <p className="mt-4 text-xs leading-relaxed text-stone">
                  {site.director} replies the same working day · Free site visit, no obligation
                </p>
              </div>
            </div>
          </div>
        </div>
        </section>

        <ProjectCarousel service={serviceSlug} />
      </div>

      <TrustBar />

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
                <p key={para.slice(0, 32)} className="text-stone leading-relaxed">{para}</p>
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
                    <Image src={t.image} alt={t.imageAlt} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" />
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
              <a href="#quote" className="mt-5 inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">
                Ask {site.director} at a free site visit
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Cost & what's included */}
      <section className="relative">
        <SectionIndex label="03 · Cost" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <Reveal>
              <p className="eyebrow">Cost, in the open</p>
              <h2 className="mt-3 text-4xl md:text-5xl">{landing.costTitle}</h2>
              <p className="mt-8 font-display text-[2.6rem] leading-none tracking-tight md:text-6xl">
                {costLow}
                <span aria-hidden="true" className="mx-2 text-gold md:mx-3">–</span>
                {costHigh}
              </p>
              <p className="mt-3 text-sm text-stone">{landing.costRangeNote}</p>
              <p className="mt-6 text-stone leading-relaxed">{landing.costText}</p>
              {landing.costLink && (
                <p className="mt-6">
                  <Link href={landing.costLink.href} className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep">
                    {landing.costLink.label}
                  </Link>
                </p>
              )}
              <div className="mt-8 flex gap-4">
                <a href="#quote" className="bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">
                  Get your itemised quote
                </a>
              </div>
            </Reveal>
            <QuotationCard included={landing.included} />
          </div>
        </div>
      </section>

      {/* Projects */}
      {serviceProjects.length > 0 && (
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
                <Reveal key={p.slug} delay={i * 100}><ProjectCard {...p} /></Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Director */}
      <section className="relative overflow-x-clip border-y border-line">
        <SectionIndex label="05 · The director" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-10 lg:grid-cols-[2fr,3fr] lg:items-center lg:gap-16">
            <Reveal>
              <div className="img-zoom relative aspect-[3/4]">
                <Image src={images.director.src} alt={images.director.alt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="eyebrow">The person you deal with</p>
              <h2 className="mt-3 text-4xl md:text-5xl">Your {lower}, run by the director. Not handed to a foreman.</h2>
              <p className="mt-5 text-stone leading-relaxed">
                {site.director} personally surveys every {lower}, prepares every quotation and runs every build
                through to handover. When you call, you speak to the person who priced your job and is
                standing on your scaffold, not a call centre or a project manager you've never met.
              </p>
              <div className="mt-8 flex gap-4">
                <a href="#quote" className="bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">
                  Get your quote from {site.director}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ProcessSection label="06 · Process" />

      {/* Testimonials */}
      <section className="relative border-y border-line bg-white">
        <SectionIndex label="07 · Stories" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow">Tell your story</p>
              <h2 className="mt-3 text-4xl md:text-5xl">In our clients&rsquo; words</h2>
            </div>
            <div className="mt-10">
              <TestimonialShowcase />
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
            <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">{serviceName.toLowerCase().replace(/^./, (c) => c.toUpperCase())} across London, Kent and Essex</h2>
            <p className="mt-4 max-w-2xl text-stone leading-relaxed">
              Based in {site.base}, close enough for a site visit within days, not weeks.
              We also have dedicated {lower} pages for the areas and towns we work in most:
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
              {locations.map((l) => (
                <Link
                  key={l.slug}
                  href={`/${serviceSlug}/${l.slug}`}
                  className="border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                >
                  {shortName}s in {l.name}
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
            <p className="mt-5 text-white/70">
              Tell us about your {lower} and {site.director} will call you back,
              usually the same working day. Covering London, Kent and Essex.
            </p>
            <p className="mt-6 font-display text-2xl text-gold"><a href={site.phoneHref}>{site.phone}</a></p>
          </Reveal>
          <Reveal delay={120}><LeadForm dark service={serviceSlug} /></Reveal>
        </div>
      </section>
    </>
  );
}

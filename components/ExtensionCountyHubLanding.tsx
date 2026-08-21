import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';
import type { SanityProject } from '@/lib/projects';
import { toCarouselSlides } from '@/lib/projects';
import TrustBar from '@/components/TrustBar';
import ProjectCarousel from '@/components/ProjectCarousel';
import FaqSection from '@/components/FaqSection';
import LeadForm from '@/components/LeadForm';
import Reveal from '@/components/Reveal';
import GoldPattern from '@/components/GoldPattern';
import SectionIndex from '@/components/SectionIndex';
import { sanityFetch } from '@/sanity/live';
import { PROJECTS_BY_TYPE_QUERY } from '@/sanity/queries';

export type ExtensionCountyHubData = {
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
  introImage: { src: string; alt: string; caption?: string };
  sideReturn: {
    title: string;
    paragraphs: string[];
    image: { src: string; alt: string };
  };
  types: {
    title: string;
    intro: string;
    closing: string;
    items: { name: string; text: string; image: string; imageAlt: string }[];
  };
  tightSite: {
    title: string;
    intro: string;
    closing: string;
    items: { title: string; text: string }[];
  };
  project: { title: string; text: string };
  planning: { title: string; intro: string; paragraphs: string[] };
  whyUs: {
    title: string;
    paragraphs: string[];
    sidewaysLink: { href: string; label: string };
  };
  areas: {
    title: string;
    intro: string;
    closing: string;
    towns: { name: string; slug: string | null }[];
  };
  cost: {
    title: string;
    paragraphs: string[];
    costLink: { href: string; label: string };
  };
  faqs: { q: string; a: string }[];
  relatedLinks: { href: string; label: string }[];
  cta: { eyebrow: string; title: string; text: string };
};

export default async function ExtensionCountyHubLanding({ data }: { data: ExtensionCountyHubData }) {
  const { serviceSlug, county, countySlug, hero } = data;
  const { data: projectData } = await sanityFetch({
    query: PROJECTS_BY_TYPE_QUERY,
    params: { projectType: 'extension' },
  });
  const carouselProjects = toCarouselSlides((projectData || []) as SanityProject[]);

  return (
    <>
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
                    <LeadForm compact service={serviceSlug} location={countySlug} />
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

      <section className="relative">
        <SectionIndex label="01 · Intro" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">House extensions in {county}</p>
            <div className="mt-8 max-w-3xl space-y-6">
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
        <figure className="relative aspect-[21/9] w-full md:aspect-[3/1]">
          <Image src={data.introImage.src} alt={data.introImage.alt} fill sizes="100vw" className="object-cover" />
          {data.introImage.caption && (
            <figcaption className="absolute bottom-0 left-0 right-0 bg-charcoal/80 px-4 py-3 text-sm text-white/90">
              {data.introImage.caption}
            </figcaption>
          )}
        </figure>
      </section>

      <section className="relative bg-ivory">
        <GoldPattern id={`lattice-side-${countySlug}`} />
        <SectionIndex label="02 · Side return" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
            <Reveal>
              <p className="eyebrow">London's most useful extension</p>
              <h2 className="mt-3 max-w-xl text-4xl md:text-5xl">{data.sideReturn.title}</h2>
              <div className="mt-8 space-y-6">
                {data.sideReturn.paragraphs.map((para) => (
                  <p key={para.slice(0, 48)} className="text-stone leading-relaxed">{para}</p>
                ))}
              </div>
              <a href="#quote" className="mt-8 inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">
                Book a free site visit
              </a>
            </Reveal>
            <Reveal delay={120}>
              <div className="img-zoom relative aspect-[4/5]">
                <Image
                  src={data.sideReturn.image.src}
                  alt={data.sideReturn.image.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative">
        <SectionIndex label="03 · Types" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Matched to your house</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.types.title}</h2>
            <p className="mt-4 max-w-2xl font-display italic text-lg text-stone">{data.types.intro}</p>
          </Reveal>
          <div className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-3">
            {data.types.items.map((t, i) => (
              <Reveal key={t.name} delay={i * 100}>
                <article>
                  <div className="img-zoom relative aspect-[16/10]">
                    <Image src={t.image} alt={t.imageAlt} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <h3 className="mt-5 text-2xl">{t.name}</h3>
                  <div className="mt-3 h-px w-10 bg-gold" />
                  <p className="mt-3 text-sm leading-relaxed text-stone">{t.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-14 max-w-3xl text-stone leading-relaxed">{data.types.closing}</p>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-ivory">
        <GoldPattern id={`lattice-site-${countySlug}`} />
        <SectionIndex label="04 · Site" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">How London jobs actually run</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.tightSite.title}</h2>
            <p className="mt-4 max-w-3xl text-stone leading-relaxed">{data.tightSite.intro}</p>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {data.tightSite.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <h3 className="text-2xl">{item.title}</h3>
                <div className="mt-3 h-px w-10 bg-gold" />
                <p className="mt-3 text-sm leading-relaxed text-stone">{item.text}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mt-12 max-w-3xl font-display italic text-lg text-stone">{data.tightSite.closing}</p>
          </Reveal>
        </div>
      </section>

      <section className="relative">
        <SectionIndex label="05 · Project" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Work we have built</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.project.title}</h2>
            <p className="mt-8 max-w-3xl text-stone leading-relaxed">{data.project.text}</p>
          </Reveal>
        </div>
      </section>

      <section className="relative bg-ivory">
        <GoldPattern id={`lattice-planning-${countySlug}`} />
        <SectionIndex label="06 · Planning" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Planning & regulations</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.planning.title}</h2>
            <p className="mt-4 max-w-3xl text-stone leading-relaxed">{data.planning.intro}</p>
          </Reveal>
          <div className="mt-10 max-w-3xl space-y-6">
            {data.planning.paragraphs.map((para, i) => (
              <Reveal key={para.slice(0, 48)} delay={i * 60}>
                <p className="text-stone leading-relaxed">{para}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div className="mt-10">
              <a href="#quote" className="inline-block bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">
                We handle this as part of the job
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative border-y border-line bg-white">
        <SectionIndex label="07 · Why us" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Why homeowners choose us</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.whyUs.title}</h2>
          </Reveal>
          <div className="mt-10 max-w-3xl space-y-6">
            {data.whyUs.paragraphs.map((para, i) => (
              <Reveal key={para.slice(0, 48)} delay={i * 80}>
                <p className="text-stone leading-relaxed">{para}</p>
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

      <section className="relative bg-ivory">
        <GoldPattern id={`lattice-areas-${countySlug}`} />
        <SectionIndex label="08 · Areas" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Where we build</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.areas.title}</h2>
            <p className="mt-4 max-w-3xl text-stone leading-relaxed">{data.areas.intro}</p>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-2">
            {data.areas.towns.map((town) =>
              town.slug ? (
                <Link
                  key={town.name}
                  href={`/${serviceSlug}/${countySlug}/${town.slug}`}
                  className="border border-line bg-white px-4 py-2 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep"
                >
                  {town.name}
                </Link>
              ) : (
                <span key={town.name} className="border border-line/60 px-4 py-2 text-sm text-stone">
                  {town.name}
                </span>
              ),
            )}
          </div>
          <Reveal delay={200}>
            <p className="mt-10 max-w-3xl text-stone leading-relaxed">{data.areas.closing}</p>
            <p className="mt-6 text-sm text-stone">
              Prefer the full service overview?{' '}
              <Link href={`/${serviceSlug}`} className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep">
                House extensions across Hertfordshire, Essex and London
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative">
        <SectionIndex label="09 · Cost" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">Cost, in the open</p>
            <h2 className="mt-3 max-w-3xl text-4xl md:text-5xl">{data.cost.title}</h2>
            <div className="mt-8 max-w-3xl space-y-6">
              {data.cost.paragraphs.map((para) => (
                <p key={para.slice(0, 48)} className="text-stone leading-relaxed">{para}</p>
              ))}
            </div>
            <p className="mt-8">
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
        </div>
      </section>

      <FaqSection
        faqs={data.faqs}
        label="10 · Questions"
        heading={`House extension questions in ${county}, answered straight`}
        intro={`The questions every ${county} homeowner asks at the first site visit.`}
      />

      <section className="relative">
        <SectionIndex label="11 · Next steps" />
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
            <LeadForm dark service={serviceSlug} location={countySlug} />
          </Reveal>
        </div>
      </section>
    </>
  );
}

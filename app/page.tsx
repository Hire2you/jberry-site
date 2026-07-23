import Image from 'next/image';
import Link from 'next/link';
import projects from '@/data/projects.json';
import images from '@/data/images.json';
import faqs from '@/data/faqs.json';
import { localBusinessSchema, faqSchema, JsonLd } from '@/lib/schema';
import { site } from '@/lib/site';
import type { Testimonial } from '@/lib/testimonials';
import type { SanityProject } from '@/lib/projects';
import { toCarouselSlides } from '@/lib/projects';
import Hero from '@/components/Hero';
import ProjectCarousel from '@/components/ProjectCarousel';
import TrustBar from '@/components/TrustBar';
import ProjectCard from '@/components/ProjectCard';
import TestimonialShowcase from '@/components/TestimonialShowcase';
import ProcessSection from '@/components/ProcessSection';
import LeadForm from '@/components/LeadForm';
import Reveal from '@/components/Reveal';
import GoldPattern from '@/components/GoldPattern';
import Captioned from '@/components/Captioned';
import SectionIndex from '@/components/SectionIndex';
import AreasSection from '@/components/AreasSection';
import FaqSection from '@/components/FaqSection';
import { sanityFetch } from '@/sanity/live';
import { FEATURED_PROJECTS_QUERY, FEATURED_TESTIMONIALS_QUERY } from '@/sanity/queries';

export default async function Home() {
  const [{ data: testimonialData }, { data: projectData }] = await Promise.all([
    sanityFetch({ query: FEATURED_TESTIMONIALS_QUERY }),
    sanityFetch({ query: FEATURED_PROJECTS_QUERY }),
  ]);
  const testimonials = (testimonialData || []) as Testimonial[];
  const carouselProjects = toCarouselSlides((projectData || []) as SanityProject[]);
  const services = [
    { href: '/extensions/bishops-stortford', img: images.serviceExtensions, title: 'Extensions', text: 'Single and double-storey extensions, quoted in detail and finished on schedule.' },
    { href: '/loft-conversions/bishops-stortford', img: images.serviceLofts, title: 'Loft conversions', text: 'Dormer, hip-to-gable and Velux conversions built around your roofline.' },
  ];
  const directorStats = [
    { big: '20+ years', small: 'building' },
    { big: 'Director-led', small: 'always' },
    { big: 'Fixed-price', small: 'quotations' },
  ];

  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={faqSchema(faqs)} />
      <Hero />
      <ProjectCarousel projects={carouselProjects} />
      <TrustBar />

      <section className="relative">
        <SectionIndex label="01 · What we build" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">What we build</p>
            <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">Two things, done properly</h2>
            <p className="mt-4 font-display italic text-lg text-stone">Extensions and loft conversions across London, Kent and Essex, nothing else.</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <Link href={s.href} className="group block">
                  <Captioned caption={s.img.caption}>
                    <div className="img-zoom relative aspect-[16/10]">
                      <Image src={s.img.src} alt={s.img.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                      <div className="absolute inset-0 bg-charcoalDeep/25 transition-opacity group-hover:bg-charcoalDeep/10" />
                      <div className="absolute bottom-0 left-0 p-6">
                        <h3 className="text-2xl text-white">{s.title}</h3>
                      </div>
                    </div>
                  </Captioned>
                  <p className="mt-3 text-sm text-stone">{s.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-ivory">
        <GoldPattern id="lattice-projects" />
        <SectionIndex label="02 · Projects" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Recent projects</p>
              <h2 className="mt-3 text-4xl md:text-5xl">Built by Jason and his team</h2>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}><ProjectCard {...p} /></Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-x-clip">
        <SectionIndex label="03 · The director" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="lg:flex lg:items-center">
            <Reveal className="lg:w-1/2 lg:shrink-0">
              <div className="lg:-ml-24">
                <Captioned caption={images.director.caption}>
                  <div className="img-zoom relative aspect-[3/4]">
                    <Image src={images.director.src} alt={images.director.alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                    {/* REPLACE with a photo of Jason — this section doesn't work without him */}
                  </div>
                </Captioned>
              </div>
            </Reveal>
            <Reveal delay={120} className="mt-10 lg:mt-0 lg:w-1/2">
              <div className="relative z-10 bg-white lg:-ml-16 lg:border lg:border-gold lg:p-10">
                <p className="eyebrow">The person you deal with</p>
                <h2 className="mt-3 text-4xl md:text-5xl">One director. One detailed quote. One person answerable.</h2>
                <p className="mt-5 text-stone">
                  Every J.Berry project is personally overseen by {site.director}, from the first site visit to handover.
                  You get a comprehensive, itemised quotation before work starts, and the price we quote is the price you pay.
                </p>
                <div className="mt-8 flex flex-wrap items-stretch gap-x-6 gap-y-4">
                  {directorStats.map((stat, i) => (
                    <div key={stat.big} className="flex items-stretch gap-x-6">
                      {i > 0 && <div className="w-px self-stretch bg-gold" />}
                      <div>
                        <p className="font-display text-xl">{stat.big}</p>
                        <p className="mt-1 text-xs uppercase tracking-eyebrow text-stone">{stat.small}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex gap-4">
                  <a href="#quote" className="bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep">Get your quote</a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <ProcessSection />

      <section className="relative border-y border-line bg-white">
        <SectionIndex label="05 · Stories" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <div className="text-center">
              <p className="eyebrow">Tell your story</p>
              <h2 className="mt-3 text-4xl md:text-5xl">In our clients&rsquo; words</h2>
            </div>
            <div className="mt-10">
              <TestimonialShowcase testimonials={testimonials} />
            </div>
          </Reveal>
        </div>
      </section>

      <AreasSection />

      <FaqSection />

      <section id="quote" className="bg-charcoalDeep text-white">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">Start your project</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Get your detailed quotation</h2>
            <p className="mt-5 text-white/70">
              Tell us about your extension or loft conversion and {site.director} will call you back,
              usually the same working day. Covering London, Kent and Essex.
            </p>
            <p className="mt-6 font-display text-2xl text-gold"><a href={site.phoneHref}>{site.phone}</a></p>
          </Reveal>
          <Reveal delay={120}><LeadForm dark /></Reveal>
        </div>
      </section>
    </>
  );
}

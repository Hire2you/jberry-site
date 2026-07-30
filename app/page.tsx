import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  description:
    'Director-led extensions and loft conversions across London, Kent and Essex. Itemised fixed-price quotations, 10% deposit then stages, backed by a 10-year guarantee.',
};

export default async function Home() {
  const [{ data: testimonialData }, { data: projectData }] = await Promise.all([
    sanityFetch({ query: FEATURED_TESTIMONIALS_QUERY }),
    sanityFetch({ query: FEATURED_PROJECTS_QUERY }),
  ]);
  const testimonials = (testimonialData || []) as Testimonial[];
  const carouselProjects = toCarouselSlides((projectData || []) as SanityProject[]);
  const services = [
    { href: '/extensions', img: images.serviceExtensions, title: 'Extensions', text: 'Single and double-storey extensions, quoted in detail and finished on schedule.' },
    { href: '/loft-conversions', img: images.serviceLofts, title: 'Loft conversions', text: 'Dormer, hip-to-gable and Velux conversions built around your roofline.' },
  ];
  const directorStats = [
    { big: '20+ years', small: 'hands-on' },
    { big: '15–20', small: 'projects a year' },
    { big: '10-year', small: 'guarantee' },
  ];
  const trustBarItems = [
    { big: 'Itemised quotations', small: 'Every line priced before you commit' },
    { big: '10% deposit, then stages', small: 'You never pay ahead of the work' },
    { big: 'Jason on site', small: "Not a project manager you've never met" },
    { big: '10-year guarantee', small: 'On every completed build' },
  ];
  const homepageProcessSteps = [
    {
      step: '01',
      title: 'Site visit',
      text: "Jason measures up, looks at what's structurally possible, and tells you if what you want doesn't work. It's free, and no one chases you afterwards.",
    },
    {
      step: '02',
      title: 'Detailed quotation',
      text: 'Labour and materials priced line by line. A fixed price, not an estimate, and detailed enough to hand to another builder and compare properly.',
    },
    {
      step: '03',
      title: 'The build',
      text: 'Agreed start date, agreed finish date, Jason running it day to day. Most clients stay living in the house throughout.',
    },
    {
      step: '04',
      title: 'Handover',
      text: 'Snagged and signed off together, then backed by a 10-year guarantee. The figure we quoted is the figure you pay.',
    },
  ];
  const homepageProjects = projects;

  return (
    <>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={faqSchema(faqs)} />
      <Hero />
      <ProjectCarousel projects={carouselProjects} />
      <TrustBar items={trustBarItems} />

      <section className="relative">
        <SectionIndex label="01 · What we build" />
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">What we build</p>
            <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">Extensions and loft conversions. That&rsquo;s the whole list.</h2>
            <p className="mt-4 font-display italic text-lg text-stone">Two builds done properly across London, Kent and Essex, rather than everything done adequately.</p>
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
            {homepageProjects.map((p, i) => (
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
                <h2 className="mt-3 text-4xl md:text-5xl">The person who prices your job is the person who builds it</h2>
                <p className="mt-5 text-stone">
                  Jason Berry has been building for over 20 years and runs 15 to 20 projects a year, few enough that he&rsquo;s on every one himself.
                  He surveys your home, writes the quotation, and is on site while it&rsquo;s built. There&rsquo;s no estimator you meet once and a foreman you meet after.
                  If something needs sorting in week six, you&rsquo;re talking to the person who priced it in week one.
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

      <ProcessSection steps={homepageProcessSteps} />

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
              Tell us about your extension or loft conversion and Jason Berry calls you back,
              usually the same working day. A name, a number and a postcode is all we need to start.
            </p>
            <p className="mt-6 font-display text-2xl text-gold"><a href={site.phoneHref}>{site.phone}</a></p>
          </Reveal>
          <Reveal delay={120}><LeadForm dark /></Reveal>
        </div>
      </section>
    </>
  );
}

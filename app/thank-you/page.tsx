import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import images from '@/data/images.json';
import projects from '@/data/projects.json';
import { site } from '@/lib/site';
import FormConversion from '@/components/FormConversion';
import ProjectCard from '@/components/ProjectCard';
import Reveal from '@/components/Reveal';
import GoldPattern from '@/components/GoldPattern';
import TrustBar from '@/components/TrustBar';

// Conversion page — point the Google Ads URL-based conversion here (the MVS fix).
export const metadata: Metadata = {
  title: { absolute: `Thank you — ${site.director} will call you shortly` },
  robots: { index: false, follow: false },
};

const nextSteps = [
  {
    step: '01',
    title: 'Jason calls you',
    text: `Usually the same working day, from ${site.phone}. If he\u2019s on the scaffold he\u2019ll ring back as soon as he\u2019s down.`,
  },
  {
    step: '02',
    title: 'Free site visit',
    text: 'He measures up, looks at what\u2019s structurally possible, and tells you honestly if what you want doesn\u2019t work. No obligation afterwards.',
  },
  {
    step: '03',
    title: 'Itemised quotation',
    text: 'Labour and materials priced line by line, detailed enough to hand to another builder and compare properly.',
  },
];

const trustItems = [
  { big: 'Same working day', small: `${site.director} calls you back` },
  { big: 'Free site visit', small: 'No obligation' },
  { big: 'Itemised quotation', small: 'Labour and materials priced' },
  { big: 'Director-led', small: 'Not a call centre' },
];

const reading = [
  {
    href: '/blog/house-extension-cost-guide',
    eyebrow: 'Cost guide',
    title: 'What a house extension actually costs',
    text: 'Real 2026 figures for single and double-storey extensions, and what pushes a price up.',
  },
  {
    href: '/cost-guides/loft-conversion-cost',
    eyebrow: 'Cost guide',
    title: 'Loft conversion costs, broken down',
    text: 'Velux, dormer and hip-to-gable conversions priced, with the extras most quotes leave out.',
  },
  {
    href: '/blog/how-long-does-a-house-extension-take',
    eyebrow: 'Timelines',
    title: 'How long an extension takes',
    text: 'Week by week, from foundations to handover, and where delays usually creep in.',
  },
];

export default function ThankYou() {
  return (
    <>
      <FormConversion />

      <section className="relative overflow-hidden bg-band">
        <div className="relative flex min-h-[62svh] w-full flex-col justify-end md:min-h-[min(calc(70vh-40px),480px)]">
          <Image
            src={images.hero.src}
            alt={images.hero.alt}
            fill
            priority
            fetchPriority="high"
            quality={70}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-band from-[10%] via-black/75 via-[50%] to-black/45" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-16 bg-band md:h-20" aria-hidden="true" />
          <div className="relative z-[2]">
            <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-[4.5rem] md:pt-24">
              <div className="flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 shrink-0 items-center justify-center border border-gold/70 text-gold"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
                    <path d="M4 12.5 9.5 18 20 6.5" strokeLinecap="square" />
                  </svg>
                </span>
                <p className="eyebrow !text-[#EBCF8E] [text-shadow:0_1px_8px_rgba(0,0,0,0.7)] md:[text-shadow:none]">
                  Enquiry received
                </p>
              </div>
              <h1 className="mt-5 max-w-2xl text-5xl leading-[1.05] text-white md:text-6xl md:[text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
                Thank you. {site.director} will call you shortly.
              </h1>
              <p className="mt-4 max-w-xl text-white/85">
                Your details have gone straight to {site.director}, the director who prices the job and runs the build.
                Not a call centre, and not a lead sold on to three other builders.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <a
                  href={site.phoneHref}
                  className="bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-charcoalDeep transition-colors hover:bg-white"
                >
                  Call {site.phone}
                </a>
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/80 bg-charcoalDeep/30 px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:border-gold hover:text-gold"
                >
                  Message on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustBar items={trustItems} />

      <section className="relative overflow-x-clip border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">What happens next</p>
            <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">Three steps, and you have a price you can compare</h2>
            <p className="mt-4 font-display italic text-lg text-stone">
              The same process on every project, run by the same person.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
            {nextSteps.map((s, i) => (
              <Reveal key={s.step} delay={i * 100}>
                <div className="relative pt-20 md:pt-28">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 top-0 select-none font-display text-[120px] leading-none text-gold/20 md:text-[170px]"
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

          <Reveal delay={120}>
            <div className="mt-16 border-l-2 border-gold pl-5 md:mt-20">
              <p className="max-w-2xl font-display italic text-lg text-ink md:text-xl">
                &ldquo;You&rsquo;ll be speaking to me, not an estimator. If I can&rsquo;t build what you want properly, I&rsquo;ll tell you on the first visit.&rdquo;
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-eyebrow text-stone">
                {site.director}, Director
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative border-b border-line bg-ivory">
        <GoldPattern id="lattice-thankyou" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-20">
          <Reveal>
            <p className="eyebrow">While you wait</p>
            <h2 className="mt-3 text-4xl md:text-5xl">Recently finished</h2>
            <p className="mt-4 max-w-xl font-display italic text-lg text-stone">
              A few of the builds Jason and his team have completed across Hertfordshire and Essex.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <ProjectCard {...p} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/extensions"
                className="bg-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-white transition-colors hover:bg-goldDeep"
              >
                House extensions
              </Link>
              <Link
                href="/loft-conversions"
                className="border border-charcoal px-6 py-3.5 text-xs font-semibold uppercase tracking-eyebrow text-ink transition-colors hover:border-goldDeep hover:text-goldDeep"
              >
                Loft conversions
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-charcoalDeep text-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <p className="eyebrow">Worth a read before he calls</p>
              <h2 className="mt-3 text-4xl md:text-5xl">Know your numbers</h2>
              <p className="mt-5 max-w-lg text-white/70">
                So you can ask the right questions on the site visit, and spot a quotation that&rsquo;s been
                priced too thin to be real.
              </p>
              <p className="mt-8 font-display text-3xl text-gold md:text-4xl">
                <a href={site.phoneHref} className="transition-colors hover:text-white">{site.phone}</a>
              </p>
              <p className="mt-3 text-sm text-white/50">
                Something urgent or changed your mind about the scope? Call or email{' '}
                <a
                  href={`mailto:${site.email}`}
                  className="text-white/80 underline decoration-gold/50 underline-offset-4 hover:text-gold"
                >
                  {site.email}
                </a>
                .
              </p>
            </Reveal>

            <Reveal delay={120}>
              <ul className="divide-y divide-white/10 border-y border-white/10">
                {reading.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="group flex flex-col gap-1 py-6 transition-colors">
                      <span className="text-xs font-semibold uppercase tracking-eyebrow text-gold">{r.eyebrow}</span>
                      <span className="font-display text-xl text-white transition-colors group-hover:text-gold">
                        {r.title}
                      </span>
                      <span className="mt-1 text-sm leading-relaxed text-white/60">{r.text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

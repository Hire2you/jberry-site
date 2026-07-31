import type { Metadata } from 'next';
import areas from '@/data/areas.json';
import { site } from '@/lib/site';
import { JsonLd } from '@/lib/schema';
import LeadForm from '@/components/LeadForm';
import Reveal from '@/components/Reveal';
import GoldPattern from '@/components/GoldPattern';
import TrustBar from '@/components/TrustBar';
import AreaMap from '@/components/AreaMap';

const title = `Talk to ${site.director} | ${site.name}`;
const description = `Call, WhatsApp or request a detailed quote from ${site.director}. Director-led house extensions and loft conversions across London, Kent and Essex.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/contact' },
  openGraph: {
    title,
    description,
    url: `${site.domain}/contact`,
    type: 'website',
  },
};

function contactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${site.name}`,
    url: `${site.domain}/contact`,
    mainEntity: {
      '@type': 'HomeAndConstructionBusiness',
      name: site.name,
      telephone: site.phone,
      email: site.email,
      areaServed: site.areaServed.map((a) => ({ '@type': 'AdministrativeArea', name: a })),
    },
  };
}

const nextSteps = [
  {
    title: 'You get in touch',
    body: `Call, WhatsApp or send the form. ${site.director} replies personally, usually the same working day.`,
  },
  {
    title: 'Site visit',
    body: 'He measures up and tells you what\u2019s possible for your home and budget, or what isn\u2019t. Free, and no commitment.',
  },
  {
    title: 'Itemised quotation',
    body: 'Every line of labour and materials priced, so you can compare properly. 10% deposit to start, the rest in stages as the work progresses.',
  },
];

const trustItems = [
  { big: 'Same working day', small: `${site.director} calls you back` },
  { big: 'Free site visit', small: 'No obligation' },
  { big: 'Itemised quotation', small: 'Labour and materials priced' },
  { big: 'Director-led', small: 'Not a call centre' },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema()} />

      <section id="quote" className="relative border-b border-line bg-ivory">
        <GoldPattern id="lattice-contact" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 lg:items-start">
            <Reveal>
              <p className="eyebrow">{site.name}</p>
              <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] md:text-6xl">Talk to {site.director}</h1>
              <p className="mt-4 max-w-xl font-display italic text-lg text-stone">
                House extensions and loft conversions. One director, from your first call to handover.
              </p>

              <p className="mt-10 font-display text-4xl md:text-5xl">
                <a href={site.phoneHref} className="text-ink transition-colors hover:text-goldDeep">{site.phone}</a>
              </p>
              <p className="mt-3 text-sm text-stone">
                Call or WhatsApp. If he&rsquo;s on the scaffold, he&rsquo;ll ring you back the same working day.
              </p>

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
                >
                  Message on WhatsApp
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
                >
                  {site.email}
                </a>
              </div>

              <div className="mt-10 border-l-2 border-gold pl-5">
                <p className="font-display italic text-lg text-ink">
                  &ldquo;Send the form and I&rsquo;ll call you back myself, usually the same working day.&rdquo;
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-eyebrow text-stone">{site.director}, Director</p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="border border-gold bg-white p-6 md:p-8">
                <p className="eyebrow">Request a detailed quote</p>
                <p className="mt-2 mb-6 text-sm text-stone">
                  Name, number and postcode. Jason calls you back, usually the same day.
                </p>
                <LeadForm showService />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <TrustBar items={trustItems} />

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Reveal>
            <p className="eyebrow">What happens next</p>
            <p className="mt-3 max-w-xl font-display italic text-lg text-stone">
              From first contact to a quotation you can actually compare.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {nextSteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-eyebrow text-goldDeep">0{i + 1}</p>
                  <p className="mt-2 font-display text-xl">{step.title}</p>
                  <div className="mt-3 h-px w-10 bg-gold" />
                  <p className="mt-3 text-sm leading-relaxed text-stone">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-charcoalDeep text-white">
        <div className="mx-auto max-w-6xl px-4 pt-16 md:pt-20">
          <Reveal>
            <p className="eyebrow">Where we work</p>
            <h2 className="mt-3 text-4xl md:text-5xl">London, Kent and Essex</h2>
            <p className="mt-5 max-w-xl text-white/70">
              Based in {site.base}, {site.director} and his team build across the South East,
              close enough for a site visit within days, not weeks.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {areas.regions.map((r, i) => (
              <Reveal key={r.name} delay={i * 80}>
                <div>
                  <div className="flex items-baseline gap-4">
                    <h3 className="font-display text-2xl">{r.name}</h3>
                    <span className="text-xs uppercase tracking-eyebrow text-gold">{r.blurb}</span>
                  </div>
                  <div className="mt-2 h-px w-10 bg-gold" />
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{r.towns.join(' · ')}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120}>
          <div className="mx-auto mt-12 max-w-7xl px-2 pb-4 md:px-4 md:pb-6">
            <div className="relative border-y border-white/10 bg-white/[0.02] px-2 py-6 md:border md:p-8">
              <AreaMap />
            </div>
          </div>
        </Reveal>

        <div className="mx-auto max-w-6xl px-4 pb-16 md:pb-20">
          <Reveal>
            <p className="mt-6 text-sm text-white/50">
              Outside these areas? Call {site.director} on{' '}
              <a href={site.phoneHref} className="text-white/80 underline decoration-gold/50 underline-offset-4 hover:text-gold">
                {site.phone}
              </a>
              {', '}it&rsquo;s worth a conversation.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}

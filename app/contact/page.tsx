import type { Metadata } from 'next';
import { site } from '@/lib/site';
import { JsonLd } from '@/lib/schema';
import LeadForm from '@/components/LeadForm';
import Reveal from '@/components/Reveal';
import GoldPattern from '@/components/GoldPattern';

export const metadata: Metadata = {
  title: 'Contact us — Speak to Jason Berry',
  description: `Call ${site.phone}, WhatsApp or send the form and ${site.director} will call you back, usually the same working day. Extensions and loft conversions across London, Kent and Essex.`,
  alternates: { canonical: '/contact' },
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

const contactFaqs = [
  { q: 'How quickly will you get back to me?', a: `Usually the same working day. ${site.director} handles enquiries personally, so you'll speak to the director, not a call centre.` },
  { q: 'What happens after I get in touch?', a: 'A short phone conversation about the project, then a site visit at a time that suits you. Both cost nothing and commit you to nothing.' },
  { q: 'How long until I have a quotation?', a: 'After the site visit you\u2019ll receive a detailed, itemised quotation, every line of labour and materials priced, so you can compare it properly against others.' },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactPageSchema()} />

      <section className="relative border-b border-line bg-ivory">
        <GoldPattern id="lattice-contact" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 md:py-20">
          <Reveal>
            <p className="eyebrow">Contact us</p>
            <h1 className="mt-3 max-w-2xl text-5xl leading-[1.05] md:text-6xl">Talk to {site.director}</h1>
            <p className="mt-4 max-w-xl font-display italic text-lg text-stone">
              One director, one point of contact, from your first call to handover.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="quote" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow">The quickest way</p>
            <p className="mt-4 font-display text-4xl md:text-5xl">
              <a href={site.phoneHref} className="text-ink transition-colors hover:text-goldDeep">{site.phone}</a>
            </p>
            <p className="mt-3 text-sm text-stone">Call or WhatsApp, if Jason&rsquo;s on the scaffold, he&rsquo;ll ring you back.</p>

            <div className="mt-10 space-y-8">
              <div>
                <p className="eyebrow">Email</p>
                <p className="mt-2">
                  <a href={`mailto:${site.email}`} className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep">{site.email}</a>
                </p>
              </div>
              <div>
                <p className="eyebrow">WhatsApp</p>
                <p className="mt-2">
                  <a
                    href={`https://wa.me/${site.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
                  >
                    Message us on WhatsApp
                  </a>
                </p>
              </div>
              <div>
                <p className="eyebrow">Based in</p>
                <p className="mt-2 text-sm text-stone">{site.base}</p>
              </div>
              <div>
                <p className="eyebrow">Areas covered</p>
                <p className="mt-2 text-sm text-stone">{site.areaServed.join(' · ')}</p>
              </div>
            </div>

            <div className="mt-10 border-l-2 border-gold pl-5">
              <p className="font-display italic text-lg text-ink">
                &ldquo;Send the form and I&rsquo;ll call you back, usually the same working day.&rdquo;
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-eyebrow text-stone">{site.director}, Director</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border border-line bg-white p-6 md:p-8">
              <p className="eyebrow">Request your detailed quote</p>
              <p className="mt-2 mb-6 text-sm text-stone">A name, a number and a postcode is all we need to start.</p>
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative border-t border-line bg-ivory">
        <GoldPattern id="lattice-contact-faq" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16">
          <Reveal>
            <p className="eyebrow">What to expect</p>
          </Reveal>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {contactFaqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 100}>
                <div>
                  <p className="font-display text-xl">{f.q}</p>
                  <div className="mt-3 h-px w-10 bg-gold" />
                  <p className="mt-3 text-sm leading-relaxed text-stone">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

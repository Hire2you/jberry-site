import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import services from '@/data/services.json';
import locations from '@/data/locations.json';
import testimonials from '@/data/testimonials.json';
import { serviceSchema, faqSchema, JsonLd } from '@/lib/schema';
import { site } from '@/lib/site';
import TrustBar from '@/components/TrustBar';
import TestimonialCard from '@/components/TestimonialCard';
import LeadForm from '@/components/LeadForm';
import Link from 'next/link';

// SSG: every service × location page rendered to static HTML at build time.
export function generateStaticParams() {
  return services.flatMap((s) => locations.map((l) => ({ service: s.slug, location: l.slug })));
}
export const dynamicParams = false;

type Props = { params: Promise<{ service: string; location: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { service, location } = await params;
  const s = services.find((x) => x.slug === service);
  const l = locations.find((x) => x.slug === location);
  if (!s || !l) return {};
  return {
    title: `${s.shortName}s in ${l.name}, from £${(s.priceFrom / 1000).toFixed(0)}k`,
    description: `${s.shortName}s in ${l.name} by ${site.name}. Director-led, detailed quotes, finished on schedule. Based ${site.base}.`,
    alternates: { canonical: `/${s.slug}/${l.slug}` },
  };
}

export default async function Page({ params }: Props) {
  const { service, location } = await params;
  const s = services.find((x) => x.slug === service);
  const l = locations.find((x) => x.slug === location);
  if (!s || !l) notFound();

  const faqs = [
    { q: `How much does a ${s.shortName.toLowerCase()} cost in ${l.name}?`, a: `Most ${s.shortName.toLowerCase()}s we build around ${l.name} come in between £${s.priceFrom.toLocaleString()} and £${s.priceTo.toLocaleString()}, depending on size and specification. Every quote is itemised in detail before work starts.` },
    { q: 'How long does it take?', a: `Typically ${s.buildWeeks} weeks on site, agreed as a schedule before we start.` },
    { q: 'Who runs the project?', a: `${site.director} personally oversees every project, he's the person you'll deal with from quote to completion.` },
  ];

  return (
    <>
      <JsonLd data={serviceSchema(s.name, l.name, s.priceFrom)} />
      <JsonLd data={faqSchema(faqs)} />

      <section className="bg-pine text-limestone">
        <div className="mx-auto max-w-6xl px-4 py-16 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <p className="text-brass text-sm font-semibold uppercase tracking-widest">{l.name}, {l.county}</p>
            <h1 className="mt-2 text-4xl leading-tight">{s.headline}</h1>
            <p className="mt-4 text-limestone/85">{s.intro}</p>
            <p className="mt-4 text-limestone/85">{l.localDetail}</p>
            <div className="mt-6 flex gap-3">
              <a href={site.phoneHref} className="rounded bg-brass px-5 py-3 font-semibold text-pineDark">Call {site.phone}</a>
            </div>
          </div>
          <LeadForm service={s.slug} location={l.slug} />
        </div>
      </section>

      <TrustBar />

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl">Recent work nearby</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => <TestimonialCard key={t.name} {...t} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl">Common questions</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {faqs.map((f) => (
            <div key={f.q} className="rounded-lg border border-pine/15 bg-white p-5">
              <p className="font-semibold">{f.q}</p>
              <p className="mt-2 text-sm text-stone">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-stone">
          Also covering:{' '}
          {l.nearby.map((n, i) => {
            const nl = locations.find((x) => x.slug === n);
            return nl ? <span key={n}>{i > 0 && ' · '}<Link className="underline hover:text-brass" href={`/${s.slug}/${nl.slug}`}>{nl.name}</Link></span> : null;
          })}
        </p>
      </section>
    </>
  );
}

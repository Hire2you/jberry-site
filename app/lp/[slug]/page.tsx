import { notFound } from 'next/navigation';
import services from '@/data/services.json';
import { site } from '@/lib/site';
import LeadForm from '@/components/LeadForm';
import TrustBar from '@/components/TrustBar';

// Google Ads landing pages: same components, noindexed, no nav distractions,
// so you can iterate copy freely without touching the SEO pages.
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;
export const metadata = { robots: { index: false, follow: false } };

export default async function AdsLanding({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = services.find((x) => x.slug === slug);
  if (!s) notFound();
  return (
    <>
      <section className="bg-pine text-limestone">
        <div className="mx-auto max-w-6xl px-4 py-16 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl leading-tight">{s.headline}</h1>
            <p className="mt-4 text-limestone/85">Guide price £{s.priceFrom.toLocaleString()}–£{s.priceTo.toLocaleString()} · {s.buildWeeks} weeks on site · overseen by {site.director}</p>
            <a href={site.phoneHref} className="mt-6 inline-block rounded bg-brass px-5 py-3 font-semibold text-pineDark">Call {site.phone}</a>
          </div>
          <LeadForm service={s.slug} />
        </div>
      </section>
      <TrustBar />
    </>
  );
}

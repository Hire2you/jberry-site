import { notFound } from 'next/navigation';
import services from '@/data/services.json';
import { site } from '@/lib/site';
import LeadForm from '@/components/LeadForm';
import TrustBar from '@/components/TrustBar';
import { CAMPAIGN_LOCATIONS } from '@/lib/campaign-landing';

// Generic Google Ads landing pages (service only): thin layout, noindexed.
// Campaign pages with location live at /lp/[location]/[service].
const CAMPAIGN_LOCATION_SLUGS = new Set(CAMPAIGN_LOCATIONS.map((l) => l.slug));

export function generateStaticParams() {
  return services.map((s) => ({ location: s.slug }));
}

export const dynamicParams = false;
export const metadata = { robots: { index: false, follow: false } };

export default async function AdsLanding({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params;
  if (CAMPAIGN_LOCATION_SLUGS.has(location)) notFound();
  const s = services.find((x) => x.slug === location);
  if (!s) notFound();
  return (
    <>
      <section className="bg-pine text-limestone">
        <div className="mx-auto max-w-6xl px-4 py-16 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl leading-tight">{s.headline}</h1>
            <p className="mt-4 text-limestone/85">
              Guide price £{s.priceFrom.toLocaleString()}–£{s.priceTo.toLocaleString()} · {s.buildWeeks} weeks on
              site · overseen by {site.director}
            </p>
            <a
              href={site.phoneHref}
              className="mt-6 inline-block rounded bg-brass px-5 py-3 font-semibold text-pineDark"
            >
              Call {site.phone}
            </a>
          </div>
          <LeadForm service={s.slug} />
        </div>
      </section>
      <TrustBar />
    </>
  );
}

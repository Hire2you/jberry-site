'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { site } from '@/lib/site';

const LOCATION_LABELS: Record<string, string> = {
  london: 'London',
  kent: 'Kent',
  essex: 'Essex',
};

function campaignLocationLabel(pathname: string): string | null {
  if (!pathname.startsWith('/lp/')) return null;
  const parts = pathname.split('/').filter(Boolean);
  // /lp/{location}/{service}
  if (parts.length >= 3 && parts[0] === 'lp') {
    return LOCATION_LABELS[parts[1]] ?? parts[1];
  }
  return null;
}

export default function Footer() {
  const pathname = usePathname();
  const isCampaignLp = pathname.startsWith('/lp/') && pathname.split('/').filter(Boolean).length >= 3;
  const campaignLocation = campaignLocationLabel(pathname);

  if (isCampaignLp) {
    return (
      <footer className="bg-charcoalDeep pb-20 text-white/70 md:pb-0">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 text-sm md:grid-cols-2">
          <div>
            <Image
              src="/images/logo-white.webp"
              alt="J.Berry Extensions & Conversions"
              width={1024}
              height={563}
              className="h-14 w-auto mix-blend-screen"
            />
            <p className="mt-4 leading-relaxed">
              Director-led building across {campaignLocation ?? 'your area'}. Itemised quotations, 10% deposit
              then stages, 10-year guarantee.
            </p>
          </div>
          <div>
            <p className="eyebrow">Talk to {site.director}</p>
            <p className="mt-3">
              <a href={site.phoneHref} className="text-white hover:text-gold">{site.phone}</a>
            </p>
            <p className="mt-1">
              <a href={`mailto:${site.email}`} className="hover:text-gold">{site.email}</a>
            </p>
            <p className="mt-4 text-xs text-white/50">Based {site.base}</p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs">
          © {new Date().getFullYear()} {site.name}
        </div>
      </footer>
    );
  }

  const footerLinks = [
    { href: '/extensions', label: 'House extensions' },
    { href: '/loft-conversions', label: 'Loft conversions' },
    { href: '/cost-guides/loft-conversion-cost', label: 'Loft conversion cost guide' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact us' },
  ];

  return (
    <footer className="bg-charcoalDeep pb-20 text-white/70 md:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 text-sm md:grid-cols-4">
        <div>
          <Image
            src="/images/logo-white.webp"
            alt="J.Berry Extensions & Conversions"
            width={1024}
            height={563}
            className="h-16 w-auto mix-blend-screen"
          />
          <p className="mt-4">
            Elegance in construction &amp; design. Director-led extensions and loft conversions from {site.base}.
          </p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-3 space-y-2">
            {footerLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Areas covered</p>
          <p className="mt-3 leading-relaxed">{site.areaServed.join(' · ')}</p>
        </div>
        <div>
          <p className="eyebrow">Talk to {site.director}</p>
          <p className="mt-3">
            <a href={site.phoneHref} className="text-white hover:text-gold">{site.phone}</a>
          </p>
          <p className="mt-1">
            <a href={`mailto:${site.email}`} className="hover:text-gold">{site.email}</a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs">
        © {new Date().getFullYear()} {site.name}
      </div>
    </footer>
  );
}

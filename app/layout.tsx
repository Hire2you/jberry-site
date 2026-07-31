import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import { draftMode } from 'next/headers';
import { VisualEditing } from 'next-sanity/visual-editing';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppWidget from '@/components/WhatsAppWidget';
import StickyCallBar from '@/components/StickyCallBar';
import DisableDraftMode from '@/components/DisableDraftMode';
import { site } from '@/lib/site';
import { SanityLive } from '@/sanity/live';

const display = Fraunces({ subsets: ['latin'], style: ['normal', 'italic'], variable: '--font-display', axes: ['SOFT', 'WONK', 'opsz'] });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });

const defaultTitle = `${site.name} | Extensions & Loft Conversions, London, Kent & Essex`;
const defaultDescription =
  'Director-led extensions and loft conversions across London, Kent and Essex. Itemised fixed-price quotations, 10% deposit then stages, backed by a 10-year guarantee.';

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: defaultDescription,
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: site.domain,
    siteName: site.name,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: '/images/hero-rear-extension.webp',
        width: 2400,
        height: 1600,
        alt: 'Full-width rear extension with anthracite bifold doors',
      },
    ],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html lang="en-GB" className={`${display.variable} ${body.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppWidget />
        <StickyCallBar />
        <SanityLive />
        {isDraftMode && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  );
}

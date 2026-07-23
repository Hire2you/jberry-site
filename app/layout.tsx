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

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: { default: `${site.name} | Extensions & Loft Conversions, London, Kent & Essex`, template: `%s | ${site.name}` },
  description: `Director-led extensions and loft conversions across London, Kent and Essex. Detailed quotations, the price we quote is the price you pay.`,
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

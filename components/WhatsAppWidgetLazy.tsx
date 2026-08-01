'use client';

import dynamic from 'next/dynamic';

/** Client-only load so the WhatsApp widget never blocks first paint / LCP. */
const WhatsAppWidget = dynamic(() => import('@/components/WhatsAppWidget'), { ssr: false });

export default function WhatsAppWidgetLazy() {
  return <WhatsAppWidget />;
}

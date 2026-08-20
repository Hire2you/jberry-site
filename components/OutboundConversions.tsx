'use client';
import { useEffect } from 'react';
import { trackConversion } from '@/lib/conversions';

/** Delegated listener so every tel: and wa.me link on the site is tracked,
 *  wherever it is rendered, without touching each component. */
export default function OutboundConversions() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as HTMLElement | null)?.closest?.('a');
      const href = link?.getAttribute('href');
      if (!href) return;
      if (href.startsWith('tel:')) trackConversion('phone');
      else if (href.includes('wa.me') || href.includes('api.whatsapp.com'))
        trackConversion('whatsapp');
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}

'use client';
import { useEffect } from 'react';
import { trackConversion } from '@/lib/conversions';

/** Fires the lead-form conversion on the thank-you page, but only for visitors the
 *  form actually redirected (?lead=), and only once per submission so a refresh or
 *  a shared link can't inflate the count. */
export default function FormConversion() {
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('lead');
    if (!id) return;
    const key = `gads-lead-${id}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
    trackConversion('form');
  }, []);

  return null;
}

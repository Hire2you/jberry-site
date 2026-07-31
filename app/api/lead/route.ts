import { NextResponse } from 'next/server';
import { leadEmailHtml, leadEmailSubject, leadEmailText } from '@/lib/leadEmail';

// form → email you + log to Supabase. Same pattern as SMCT Hub, kept minimal.
export async function POST(req: Request) {
  const lead = await req.json();
  if (!lead?.name || !lead?.phone) return NextResponse.json({ ok: false }, { status: 400 });

  // 1. Email notification (Resend — swap for Brevo SMTP if you prefer)
  try {
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.LEAD_FROM_EMAIL!,
        to: process.env.LEAD_TO_EMAIL!,
        subject: leadEmailSubject(lead),
        text: leadEmailText(lead),
        html: leadEmailHtml(lead),
      });
    }
  } catch (e) { console.error('email failed', e); }

  // 2. Supabase log (leads table: name, phone, postcode, message, service, location, page, created_at)
  try {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/jberry_leads`, {
        method: 'POST',
        headers: {
          apikey: process.env.SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });
    }
  } catch (e) { console.error('supabase failed', e); }

  return NextResponse.json({ ok: true });
}

import FormConversion from '@/components/FormConversion';

// Conversion page — point the Google Ads URL-based conversion here (the MVS fix).
export const metadata = { title: 'Thanks, we\'ll call you shortly', robots: { index: false } };

export default function ThankYou() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center">
      <FormConversion />
      <h1 className="text-3xl">Got it, Jason will call you shortly.</h1>
      <p className="mt-4 text-stone">Usually the same working day. If it's urgent, call us now.</p>
    </section>
  );
}

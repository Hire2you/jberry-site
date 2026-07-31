import type { Metadata } from 'next';
import services from '@/data/services.json';
import { faqSchema, JsonLd } from '@/lib/schema';
import LeadForm from '@/components/LeadForm';

export const metadata: Metadata = {
  title: 'Loft Conversion Cost in London, Kent & Essex (2026 Guide)',
  description: 'What a loft conversion really costs in London, Kent and Essex in 2026, dormer, hip-to-gable and mansard prices, what drives cost, and how to budget.',
  alternates: { canonical: '/cost-guides/loft-conversion-cost' },
};

// PRIORITY PAGE — cost-guide content was the #1 content play in the strategy.
// The table below is scaffold: replace figures with Jason's real numbers.
export default function LoftCostGuide() {
  const s = services.find((x) => x.slug === 'loft-conversions')!;
  const rows = [
    ['Velux / rooflight', '£45,000–£55,000', 'No structural roof change'],
    ['Dormer', '£55,000–£70,000', 'Most common, adds headroom and floor area'],
    ['Hip-to-gable', '£60,000–£80,000', 'Typical for 1930s semis'],
    ['Mansard', '£75,000–£95,000', 'Maximum space, usually needs planning'],
  ];
  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <JsonLd data={faqSchema([{ q: 'How much is a loft conversion in London, Kent or Essex?', a: `Most loft conversions cost £${s.priceFrom.toLocaleString()}–£${s.priceTo.toLocaleString()} depending on type and specification.` }])} />
      <h1 className="text-4xl leading-tight">What does a loft conversion cost in London, Kent &amp; Essex in 2026?</h1>
      <p className="mt-4 text-stone">REPLACE: intro paragraph in Jason's voice, honest, specific, no fluff.</p>
      <table className="mt-8 w-full text-sm border-collapse">
        <thead><tr className="text-left border-b border-pine/30"><th className="py-2">Type</th><th>Guide price</th><th>Notes</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-b border-pine/10"><td className="py-2 font-semibold">{r[0]}</td><td>{r[1]}</td><td className="text-stone">{r[2]}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="mt-10"><LeadForm service="loft-conversions" /></div>
    </article>
  );
}

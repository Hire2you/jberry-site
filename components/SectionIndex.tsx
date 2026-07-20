// Faint vertical gutter marker, e.g. "01 — What we build". Parent section needs `relative`.
export default function SectionIndex({ label }: { label: string }) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-4 top-20 hidden select-none text-[11px] uppercase tracking-eyebrow text-stone/40 [writing-mode:vertical-rl] lg:block"
    >
      {label}
    </span>
  );
}

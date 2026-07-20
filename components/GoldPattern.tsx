// Subtle gold lattice for ivory sections. Parent needs `relative`; content needs `relative z-10`.
export default function GoldPattern({ id = 'gold-lattice' }: { id?: string }) {
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]">
      <defs>
        <pattern id={id} width="56" height="96" patternUnits="userSpaceOnUse">
          <path d="M0 0 L56 96 M56 0 L0 96" stroke="#C9A961" strokeWidth="0.75" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

import areas from '@/data/areas.json';
import { VIEW, regionPaths, contextPath, markerPoints } from '@/lib/areaMapPaths';

// Map of the South East built from real ONS boundary data (see scripts/generate-area-map.mjs).
// Coverage regions (Hertfordshire, Essex) are highlighted; surrounding counties sit faintly behind.
export default function AreaMap() {
  const { regions, hq } = areas;
  const hqPt = markerPoints.hq;
  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      role="img"
      aria-label={`Map showing areas covered: ${regions.map((r) => r.name).join(', ')}. Based in ${hq.name}`}
      className="h-auto w-full"
    >
      <defs>
        <pattern id="map-lattice" width="56" height="96" patternUnits="userSpaceOnUse">
          <path d="M0 0 L56 96 M56 0 L0 96" stroke="#C9A961" strokeWidth="0.75" fill="none" opacity="0.12" />
        </pattern>
      </defs>

      {/* Surrounding counties, faint, for context */}
      <path d={contextPath} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

      {/* Coverage regions: Hertfordshire and Essex */}
      {[regionPaths.herts, regionPaths.essex].map((d, i) => (
        <g key={i}>
          <path d={d} fill="rgba(255,255,255,0.05)" />
          <path d={d} fill="url(#map-lattice)" stroke="#C9A961" strokeWidth="1.1" strokeOpacity="0.55" strokeLinejoin="round" />
        </g>
      ))}

      {/* Estuary label */}
      <text x="478" y="256" fontSize="10" fontStyle="italic" fill="rgba(255,255,255,0.35)" textAnchor="middle">
        Thames Estuary
      </text>

      {/* Coverage lines from HQ to each region */}
      {regions.map((r) => {
        const pt = markerPoints[r.name as keyof typeof markerPoints];
        return (
          <line
            key={r.name}
            x1={hqPt.x}
            y1={hqPt.y}
            x2={pt.x}
            y2={pt.y}
            stroke="#C9A961"
            strokeWidth="0.75"
            strokeDasharray="1 5"
            opacity="0.4"
          />
        );
      })}

      {/* Region markers */}
      {regions.map((r) => {
        const pt = markerPoints[r.name as keyof typeof markerPoints];
        return (
          <g key={r.name}>
            <circle cx={pt.x} cy={pt.y} r="9" fill="none" stroke="#C9A961" strokeWidth="1" opacity="0.5" />
            <circle cx={pt.x} cy={pt.y} r="3.5" fill="#C9A961" />
            <text
              x={pt.x}
              y={pt.y + 28}
              fontSize="11"
              letterSpacing="2.5"
              fill="rgba(255,255,255,0.75)"
              textAnchor="middle"
            >
              {r.name.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* HQ marker — Sawbridgeworth */}
      <g>
        <circle cx={hqPt.x} cy={hqPt.y} r="70" fill="#C9A961" opacity="0.05" />
        <circle cx={hqPt.x} cy={hqPt.y} fill="none" stroke="#C9A961" strokeWidth="1.5">
          <animate attributeName="r" values="8;24" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="2.6s" repeatCount="indefinite" />
        </circle>
        <circle cx={hqPt.x} cy={hqPt.y} r="10" fill="none" stroke="#C9A961" strokeWidth="1" opacity="0.6" />
        <circle cx={hqPt.x} cy={hqPt.y} r="4.5" fill="#C9A961" />
        <text x={hqPt.x - 22} y={hqPt.y - 2} fontSize="11" letterSpacing="2.5" fill="#FFFFFF" textAnchor="end">
          {hq.name.toUpperCase()}
        </text>
        <text x={hqPt.x - 22} y={hqPt.y + 14} fontSize="10" letterSpacing="1.5" fill="#C9A961" textAnchor="end">
          {hq.label}
        </text>
      </g>

      {/* Compass */}
      <g opacity="0.5">
        <text x="560" y="38" fontSize="12" letterSpacing="2" fill="rgba(255,255,255,0.7)" textAnchor="middle">N</text>
        <path d="M560,46 L560,70 M560,46 L555,54 M560,46 L565,54" stroke="#C9A961" strokeWidth="1" fill="none" />
      </g>
    </svg>
  );
}

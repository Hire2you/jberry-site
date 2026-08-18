'use client';

import { useState } from 'react';
import Link from 'next/link';

const PREVIEW_COUNT = 10;

export default function TownLinkList({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const needsToggle = links.length > PREVIEW_COUNT;

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-3">
        {links.map((link, i) => {
          const collapsedAway = needsToggle && !expanded && i >= PREVIEW_COUNT;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`border border-line px-5 py-3 text-sm text-ink transition-colors hover:border-gold hover:text-goldDeep ${
                collapsedAway ? 'hidden' : ''
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      {needsToggle && (
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className="mt-6 text-sm font-semibold text-ink underline decoration-gold underline-offset-4 hover:text-goldDeep"
        >
          {expanded ? 'Hide' : 'View all'}
        </button>
      )}
    </>
  );
}

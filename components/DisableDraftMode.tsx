'use client'

import {useIsPresentationTool} from 'next-sanity/hooks'

export default function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool()

  // Studio controls draft mode inside Presentation — hide the exit control there
  if (isPresentationTool) return null

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-[100] border border-line bg-white px-4 py-2 text-xs font-semibold uppercase tracking-eyebrow text-ink shadow-sm transition-colors hover:border-gold hover:text-goldDeep"
    >
      Disable draft mode
    </a>
  )
}

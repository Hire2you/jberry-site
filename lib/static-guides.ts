import type { StaticGuideData } from '@/components/StaticBlogGuide'
import article4 from '@/data/blog/article-4-directions-explained.json'
import regsVsPlanning from '@/data/blog/building-regulations-vs-planning-permission.json'
import greenBelt from '@/data/blog/can-you-extend-in-the-green-belt.json'
import conservation from '@/data/blog/extending-in-a-conservation-area.json'
import flood from '@/data/blog/flood-risk-and-home-building-projects.json'
import mistakes from '@/data/blog/house-extension-mistakes.json'
import ldc from '@/data/blog/lawful-development-certificates.json'
import openPlan from '@/data/blog/open-plan-living-steel-beams.json'
import partyWall from '@/data/blog/party-wall-act-explained.json'
import planningHub from '@/data/blog/planning-permission-and-building-regulations.json'

export const staticGuides: StaticGuideData[] = [
  planningHub,
  article4,
  conservation,
  greenBelt,
  partyWall,
  regsVsPlanning,
  ldc,
  flood,
  mistakes,
  openPlan,
] as StaticGuideData[]

export function getStaticGuide(slug: string) {
  return staticGuides.find((post) => post.slug === slug)
}

import type {Metadata} from 'next'
import {
  generateLocationMetadata,
  generateLocationStaticParams,
  LocationLandingPage,
} from '@/lib/location-landing'

type Props = {params: Promise<{location: string}>}

export async function generateStaticParams() {
  return generateLocationStaticParams('loft-conversions')
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {location} = await params
  return generateLocationMetadata('loft-conversions', location)
}

export default async function LoftLocationPage({params}: Props) {
  const {location} = await params
  return <LocationLandingPage serviceSlug="loft-conversions" location={location} />
}

import type { Metadata } from 'next';
import PageHero from '@/components/pages/PageHero';
import { Rentals, Services, WaterBand } from '@/components/home/Sections';

export const metadata: Metadata = { title: 'What We Do' };

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="What we do" title={<>Design only, or <em>end to end.</em></>} lede="Design consultation, design and development, AMC, corporate and event plant rental, workshops and CSR drives." />
      <Services withHead={false} />
      <Rentals />
      <WaterBand />
    </>
  );
}

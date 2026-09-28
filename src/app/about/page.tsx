import type { Metadata } from 'next';
import PageHero from '@/components/pages/PageHero';
import { Crew, Impact, LoopBand } from '@/components/home/Sections';

export const metadata: Metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About us" title={<>We are <em>Star Gardens &amp; Development.</em></>} lede="A landscape design and development studio. Our story, leadership and values will come from Abhi sir; this page holds the layout." />
      <LoopBand />
      <Crew />
      <Impact />
    </>
  );
}

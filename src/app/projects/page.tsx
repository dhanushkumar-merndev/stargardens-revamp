import type { Metadata } from 'next';
import PageHero from '@/components/pages/PageHero';
import { Projects, Sectors, Story } from '@/components/home/Sections';

export const metadata: Metadata = { title: 'Projects' };

export default function ProjectsPage() {
  return (
    <>
      <PageHero eyebrow="Projects" title={<>Gardens we have <em>grown.</em></>} lede="Residential, corporate and hospitality work. Real project photos and case studies go here as Star Gardens shares them." />
      <Sectors />
      <Projects />
      <Story />
    </>
  );
}

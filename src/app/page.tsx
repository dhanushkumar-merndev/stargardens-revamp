import Hero from '@/components/home/Hero';
import { Contact, Crew, Field, Impact, LoopBand, Projects, Rentals, Sectors, Services, Story, WaterBand } from '@/components/home/Sections';

export default function Home() {
  return (
    <>
      <Hero />
      <LoopBand />
      <Story />
      <Sectors />
      <Services />
      <Projects />
      <WaterBand />
      <Rentals />
      <Crew />
      <Impact />
      <Field />
      <Contact />
    </>
  );
}

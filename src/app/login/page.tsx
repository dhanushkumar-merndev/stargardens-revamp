import type { Metadata } from 'next';
import PageHero from '@/components/pages/PageHero';

export const metadata: Metadata = { title: 'Team login' };

export default function LoginPage() {
  return <PageHero eyebrow="Team login" title={<>CRM is coming <em>in a later phase.</em></>} lede="This route is reserved for the Star Gardens team CRM. It will be built into this same Next.js app." />;
}

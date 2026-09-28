import type { Metadata } from 'next';
import PageHero from '@/components/pages/PageHero';
import { Contact } from '@/components/home/Sections';
import EnquiryForm from '@/components/pages/EnquiryForm';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title={<>Tell us about <em>your site.</em></>} lede="Share a few details and the team will get back to you. Enquiries will reach Abhi sir and the team, and later the CRM." />
      <Contact />
      <section className="sec light seam">
        <div className="wrap two-col" style={{ alignItems: 'start' }}>
          <div>
            <p className="eyebrow">Enquiry form</p>
            <h2 className="h2">Start with <em>the basics.</em></h2>
            <p className="lede">Projects start from ₹3 lakh. We reply within one working day.</p>
          </div>
          <EnquiryForm />
        </div>
      </section>
    </>
  );
}

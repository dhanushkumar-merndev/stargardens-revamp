import type { Metadata } from 'next';
import PageHero from '@/components/pages/PageHero';
import { Field } from '@/components/home/Sections';
import { POSTS } from '@/lib/content';

export const metadata: Metadata = { title: 'Blog' };

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Blog" title={<>Notes from <em>the field.</em></>} lede="Garden care, design ideas, rainwater harvesting, workshops and CSR stories. Posts are placeholders until the first articles are written." />
      <Field title={false} />
      <section className="sec light seam" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <ul className="post-list">
            {POSTS.map(p => (
              <li key={p.id}>
                <small>{p.tag}</small>
                <b>{p.title}</b>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

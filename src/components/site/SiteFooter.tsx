import Link from 'next/link';
import { StarGardensMark } from './icons';
import ReplayIntro from './ReplayIntro';

export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div className="foot-brand">
          <span className="foot-logo">
            <StarGardensMark />
            Star Gardens
          </span>
          <p>Star Gardens &amp; Development. A landscape design and development studio for homes, campuses, resorts and farmland.</p>
        </div>
        <div>
          <h4>Menu</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/projects">Projects</Link></li>
            <li><Link href="/services">What We Do</Link></li>
            <li><Link href="/blog">Blog</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            <li>Design consultation</li>
            <li>Design &amp; development</li>
            <li>AMC</li>
            <li>Corporate &amp; event rental</li>
            <li>Workshops</li>
            <li>CSR drives</li>
          </ul>
        </div>
        <div>
          <h4>Visit</h4>
          <ul>
            <li>Office address goes here</li>
            <li>Mon–Sat, office hours</li>
            <li><Link href="/login" className="later">Team login · CRM, later</Link></li>
          </ul>
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>© 2026 Star Gardens &amp; Development</span>
        <span>Wood theme concept · pictures are generated placeholders</span>
        <ReplayIntro />
      </div>
    </footer>
  );
}

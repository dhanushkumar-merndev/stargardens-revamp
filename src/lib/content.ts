/* Site copy and placeholder media. Every image under /images is a generated placeholder;
   swap in Star Gardens' real photos with the same file names. */

export const NAV = [
  { label: 'Home', href: '/', ariaLabel: 'Home', rotation: -8, hoverStyles: { bgColor: '#5E7C3A', textColor: '#FBF3E4' } },
  { label: 'Projects', href: '/projects', ariaLabel: 'Projects', rotation: 8, hoverStyles: { bgColor: '#9A6233', textColor: '#FBF3E4' } },
  { label: 'What We Do', href: '/services', ariaLabel: 'What We Do', rotation: 8, hoverStyles: { bgColor: '#C99A45', textColor: '#23160D' } },
  { label: 'Blog', href: '/blog', ariaLabel: 'Blog', rotation: -8, hoverStyles: { bgColor: '#3A2719', textColor: '#FBF3E4' } },
  { label: 'About', href: '/about', ariaLabel: 'About', rotation: 8, hoverStyles: { bgColor: '#A4C174', textColor: '#1E140D' } },
  { label: 'Contact', href: '/contact', ariaLabel: 'Contact', rotation: -8, hoverStyles: { bgColor: '#8E4A2E', textColor: '#FBF3E4' } }
];

export const SERVICES = [
  {
    no: '01', wood: 'teak', name: 'Design Consultation',
    body: 'Only need the plan? We visit the site, study sun, soil and drainage, then hand over concept boards, 2D and 3D drawings, a plant palette and a cost estimate.',
    chips: ['Site visit', '2D + 3D plans', 'Plant palette', 'Cost estimate'], cta: 'Book a consultation', href: '/contact'
  },
  {
    no: '02', wood: 'walnut', name: 'Design & Development',
    body: 'One team designs, builds and hands over the whole landscape: architecture, hardscape, softscape, irrigation, lighting and rainwater harvesting.',
    chips: ['Architecture', 'Hardscape', 'Softscape', 'Rainwater harvesting'], cta: 'Plan a project', href: '/contact'
  },
  {
    no: '03', wood: 'oak', name: 'AMC · Annual Maintenance',
    body: 'We designed it, we built it, and we keep it thriving. Our own crew visits on a fixed schedule for pruning, feeding, pest care, lawn care and replacements.',
    chips: ['Scheduled visits', 'Pruning & feeding', 'Pest care', 'Replacements'], cta: 'Get an AMC quote', href: '/contact'
  },
  {
    no: '04', wood: 'cedar', name: 'Corporate Plant Rental',
    body: 'Plants, planters and care on a 2–3 year plan with AMC built in. We swap plants when they tire, so the office always looks fresh.',
    chips: ['2–3 year plans', 'Planters included', 'AMC included', 'Free swaps'], cta: 'Get a rental quote', href: '/contact'
  },
  {
    no: '05', wood: 'walnut', name: 'Event Plant Rental',
    body: 'Green décor for 1–2 day events: weddings, launches, conferences and festivals. We deliver, style the space and collect everything afterwards.',
    chips: ['1–2 days', 'Delivery & styling', 'Pickup included'], cta: 'Check your date', href: '/contact'
  },
  {
    no: '06', wood: 'teak', name: 'Workshops',
    body: 'Hands-on sessions on home gardening, composting and rainwater harvesting, led by our horticulture team.',
    chips: ['Gardening', 'Composting', 'Rainwater harvesting'], cta: 'See upcoming dates', href: '/contact'
  },
  {
    no: '07', wood: 'oak', name: 'CSR Activities',
    body: 'Cost-free Sunday drives with companies and communities. So far we have planted 1,500 trees with ABB.',
    chips: ['Cost-free', 'Sundays', 'Tree drives'], cta: 'Partner with us', href: '/contact'
  }
];

export const SECTORS = [
  { image: '/images/sec-villa.jpg', label: 'Villas & Homes', link: '/projects' },
  { image: '/images/sec-apart.jpg', label: 'Apartments & Builders', link: '/projects' },
  { image: '/images/sec-office.jpg', label: 'Offices & Co-working', link: '/projects' },
  { image: '/images/sec-resort.jpg', label: 'Resorts & Stays', link: '/projects' },
  { image: '/images/sec-farm.jpg', label: 'Managed Farmland', link: '/projects' }
];

export const PROJECTS = [
  { image: '/images/proj-court.jpg', text: 'Villa courtyard', sector: 'Residential' },
  { image: '/images/proj-office.jpg', text: 'Office courtyard', sector: 'Corporate' },
  { image: '/images/proj-pool.jpg', text: 'Resort poolside', sector: 'Hospitality' },
  { image: '/images/proj-roof.jpg', text: 'Rooftop terrace', sector: 'Residential' },
  { image: '/images/proj-zen.jpg', text: 'Zen garden', sector: 'Corporate' },
  { image: '/images/proj-vert.jpg', text: 'Vertical garden', sector: 'Corporate' },
  { image: '/images/proj-water.jpg', text: 'Water feature', sector: 'Residential' },
  { image: '/images/proj-lawn.jpg', text: 'Farmstay lawn', sector: 'Hospitality' }
];

export const RENTALS = [
  { image: '/images/rent-lobby.jpg', alt: 'Office lobby', title: 'Office lobby', note: 'Corporate rental · 2–3 years' },
  { image: '/images/rent-wedding.jpg', alt: 'Wedding arch', title: 'Wedding arch', note: 'Event rental · 1 day' },
  { image: '/images/rent-stage.jpg', alt: 'Conference stage', title: 'Conference stage', note: 'Event rental · 2 days' },
  { image: '/images/rent-desk.jpg', alt: 'Reception desk', title: 'Reception desk', note: 'Corporate rental · 3 years' },
  { image: '/images/rent-launch.jpg', alt: 'Product launch', title: 'Product launch', note: 'Event rental · 1 day' },
  { image: '/images/rent-cowork.jpg', alt: 'Co-working floor', title: 'Co-working floor', note: 'Corporate rental · 2 years' }
];

export const CREW = [
  { initials: 'HG', role: 'Head Gardener', skills: 'Planting · Pruning · Lawn care' },
  { initials: 'IL', role: 'Irrigation Lead', skills: 'Drip lines · Sprinklers · Rainwater' },
  { initials: 'HM', role: 'Hardscape Mason', skills: 'Stone · Paving · Water features' },
  { initials: 'PH', role: 'Plant Health', skills: 'Soil · Feeding · Pest care' },
  { initials: 'AS', role: 'AMC Supervisor', skills: 'Schedules · Site checks · Reports' }
];

export const SPIRAL = [
  '/images/csr-0.jpg', '/images/csr-t0.jpg', '/images/csr-1.jpg', '/images/proj-lawn.jpg',
  '/images/csr-2.jpg', '/images/csr-t1.jpg', '/images/csr-3.jpg', '/images/leaf-b.jpg',
  '/images/csr-4.jpg', '/images/csr-t2.jpg', '/images/sec-farm.jpg', '/images/leaf-a.jpg'
];

export const POSTS = [
  { id: 'p1', img: '/images/proj-roof.jpg', url: '/blog', height: 620, tag: 'Garden care', title: 'Monsoon-proofing your lawn' },
  { id: 'p2', img: '/images/leaf-a.jpg', url: '/blog', height: 480, tag: 'Design ideas', title: 'Why native plants need less water' },
  { id: 'p3', img: '/images/csr-2.jpg', url: '/blog', height: 560, tag: 'CSR stories', title: 'Inside a 1,500-tree Sunday' },
  { id: 'p4', img: '/images/proj-water.jpg', url: '/blog', height: 420, tag: 'Rainwater', title: 'Rainwater harvesting for villas' },
  { id: 'p5', img: '/images/proj-zen.jpg', url: '/blog', height: 600, tag: 'Hardscape', title: 'Choosing timber for your deck' },
  { id: 'p6', img: '/images/rent-desk.jpg', url: '/blog', height: 500, tag: 'Corporate', title: 'Office plants that survive the AC' },
  { id: 'p7', img: '/images/leaf-b.jpg', url: '/blog', height: 640, tag: 'Care', title: 'What an AMC visit covers' },
  { id: 'p8', img: '/images/sec-resort.jpg', url: '/blog', height: 460, tag: 'Hospitality', title: 'Planning a resort arrival court' },
  { id: 'p9', img: '/images/csr-0.jpg', url: '/blog', height: 520, tag: 'Workshops', title: 'Recap: composting basics' }
];

export const WHEEL = [
  { name: 'Design Consultation', desc: 'A site visit, a concept and full drawings you can build from, with a plant palette and cost estimate.', good: 'Villas, builders, architects' },
  { name: 'Design & Development', desc: 'One team designs, builds and hands over the whole landscape: hardscape, softscape, irrigation and lighting.', good: 'Villas, apartments, offices, resorts' },
  { name: 'Annual Maintenance', desc: 'Scheduled visits by our own crew for pruning, feeding, pest care and replacements.', good: 'Any garden we built, or one you already have' },
  { name: 'Corporate Rental', desc: 'Plants, planters and care on a 2–3 year plan, with swaps whenever plants tire.', good: 'Offices, co-working, hotels' },
  { name: 'Event Rental', desc: 'Green décor for 1–2 days. We deliver, style the space and collect afterwards.', good: 'Weddings, launches, conferences' },
  { name: 'Workshops', desc: 'Hands-on sessions on gardening, composting and rainwater harvesting.', good: 'Residents, schools, teams' },
  { name: 'CSR Drives', desc: 'Cost-free Sunday tree drives. We bring the saplings, the tools and the know-how.', good: 'Companies, schools, residents' },
  { name: 'Rainwater Harvesting', desc: 'Recharge pits, tanks and drainage designed into your landscape.', good: 'Villas, campuses, farmland' }
];

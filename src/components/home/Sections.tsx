'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, CalendarCheck, Droplet, Layers, Leaf, Shovel, Sparkles, Sprout, TreePine, Flower2 } from 'lucide-react';
import LogoLoop from '@/components/reactbits/LogoLoop/LogoLoop';
import PixelSwap from '@/components/reactbits/PixelSwap/PixelSwap';
import AccordionGallery from '@/components/reactbits/AccordionGallery/AccordionGallery';
import ScrollStack, { ScrollStackItem } from '@/components/reactbits/ScrollStack/ScrollStack';
import CircularGallery from '@/components/reactbits/CircularGallery/CircularGallery';
import DepthCarousel from '@/components/reactbits/DepthCarousel/DepthCarousel';
import Stack from '@/components/reactbits/Stack/Stack';
import InfiniteSpiral from '@/components/reactbits/InfiniteSpiral/InfiniteSpiral';
import RippleDistortion from '@/components/reactbits/RippleDistortion/RippleDistortion';
import Masonry from '@/components/reactbits/Masonry/Masonry';
import OptionWheel from '@/components/reactbits/OptionWheel/OptionWheel';
import SocialButton, { type ShareItem } from '@/components/kokonut/social-button';
import { InstagramIcon, LinkedinIcon, WhatsappIcon, YoutubeIcon } from '@/components/site/icons';
import { CREW, POSTS, PROJECTS, RENTALS, SECTORS, SERVICES, SPIRAL, WHEEL } from '@/lib/content';
import { Mail } from 'lucide-react';

export function Tag({ lib = 'React Bits', name }: { lib?: string; name: string }) {
  return (
    <span className="ctag">
      <i />
      {lib} · <b>{name}</b>
    </span>
  );
}

export const SOCIALS: ShareItem[] = [
  { icon: WhatsappIcon, label: 'WhatsApp', href: '/contact' },
  { icon: InstagramIcon, label: 'Instagram', href: '/blog' },
  { icon: LinkedinIcon, label: 'LinkedIn', href: '/about' },
  { icon: YoutubeIcon, label: 'YouTube', href: '/blog' },
  { icon: Mail, label: 'Email', href: '/contact' }
];

/* ---------- Logo Loop: services marquee (swap in client logos later) ---------- */
const LOOP = [
  { icon: Leaf, t: 'Design Consultation' },
  { icon: Shovel, t: 'Design & Development' },
  { icon: CalendarCheck, t: 'Annual Maintenance' },
  { icon: Flower2, t: 'Corporate Rental' },
  { icon: Sparkles, t: 'Event Rental' },
  { icon: BookOpen, t: 'Workshops' },
  { icon: TreePine, t: 'CSR Drives' },
  { icon: Droplet, t: 'Rainwater Harvesting' },
  { icon: Layers, t: 'Hardscape' },
  { icon: Sprout, t: 'Softscape' }
];
export function LoopBand() {
  return (
    <section className="loop-band" aria-label="What we do">
      <LogoLoop
        logos={LOOP.map(({ icon: Icon, t }) => ({
          node: (
            <span className="loop-item">
              <Icon strokeWidth={1.6} />
              {t}
            </span>
          ),
          title: t
        }))}
        speed={70}
        direction="left"
        logoHeight={34}
        gap={60}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#140D08"
        ariaLabel="Star Gardens services"
      />
      <Tag name="Logo Loop" />
    </section>
  );
}

/* ---------- Pixel Swap: before / after ---------- */
export function Story() {
  const [after, setAfter] = useState(false);
  return (
    <section className="sec light">
      <div className="wrap two-col">
        <div>
          <p className="eyebrow">From bare ground</p>
          <h2 className="h2">
            Every garden starts as <em>raw earth.</em>
          </h2>
          <p className="lede">
            Hover over the picture, or tap it, to see one plot before and after our crew. We build the stone and timber layer and plant the living one, so you deal with one team from first sketch to first bloom.
          </p>
          <div className="scape">
            <div className="panel-soft">
              <h3>Hardscape</h3>
              <p>Paving · Decks · Pergolas · Water features · Lighting · Rainwater harvesting</p>
            </div>
            <div className="panel-soft">
              <h3>Softscape</h3>
              <p>Lawns · Trees · Shrubs · Vertical gardens · Drip irrigation · Seasonal colour</p>
            </div>
          </div>
        </div>
        <div>
          <div className="ps-frame">
            <span className={`ps-badge${after ? ' after' : ''}`}>{after ? 'After' : 'Before'}</span>
            <PixelSwap
              firstContent={<img src="/images/before.jpg" alt="The plot before landscaping: bare soil and rubble" />}
              secondContent={<img src="/images/after.jpg" alt="The same plot after landscaping: lawn, trees, path and pergola" />}
              pixelSize={60}
              pattern="random"
              duration={1400}
              trigger="hover"
              aspectRatio="3 / 2"
              onActiveChange={setAfter}
            />
          </div>
          <p className="ps-cap">
            <span>Sample villa plot</span>
            <span>Hover or tap to swap</span>
          </p>
        </div>
      </div>
      <Tag name="Pixel Swap" />
    </section>
  );
}

/* ---------- Accordion Gallery: sectors ---------- */
export function Sectors() {
  const [h, setH] = useState(540);
  useEffect(() => {
    const f = () => setH(window.innerWidth < 720 ? 420 : 540);
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  return (
    <section className="sec dark seam">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">Who we work with</p>
          <h2 className="h2">
            Three sectors. <em>One standard of care.</em>
          </h2>
          <p className="lede">Residential, corporate and hospitality. Point at a panel, or tap it, to open it.</p>
        </div>
        <div style={{ marginTop: 44 }}>
          <AccordionGallery
            items={SECTORS}
            defaultIndex={0}
            accentColor="#E2BD72"
            overlayColor="#140D08"
            textColor="#F7EEDD"
            height={h}
            gap={10}
            radius={24}
            expandRatio={0.5}
            tilt={8}
            grayscale
          />
        </div>
      </div>
      <Tag name="Accordion Gallery" />
    </section>
  );
}

/* ---------- Scroll Stack: services ---------- */
export function Services({ withHead = true }: { withHead?: boolean }) {
  return (
    <section className="sec light seam" style={{ paddingBottom: 0 }}>
      <div className="wrap">
        {withHead && (
          <div className="sec-head">
            <p className="eyebrow">What we do</p>
            <h2 className="h2">
              Design only, or <em>end to end.</em>
            </h2>
            <p className="lede">Seven ways to work with us. Keep scrolling and they stack up like timber samples.</p>
          </div>
        )}
        <div className="sg-stack">
          <ScrollStack useWindowScroll itemDistance={110} itemScale={0.03} itemStackDistance={26} stackPosition="18%" scaleEndPosition="10%" baseScale={0.86}>
            {SERVICES.map(s => (
              <ScrollStackItem key={s.no} itemClassName={`wood-${s.wood}`}>
                <div>
                  <div className="ss-top">
                    <span>No. {s.no}</span>
                    <span className="ss-wood">{s.wood[0].toUpperCase() + s.wood.slice(1)}</span>
                  </div>
                  <h3>{s.name}</h3>
                  <p>{s.body}</p>
                  <ul className="ss-chips">
                    {s.chips.map(c => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                  <Link className="ss-link" href={s.href}>
                    {s.cta} →
                  </Link>
                </div>
                <span className="ss-num" aria-hidden="true">
                  {s.no}
                </span>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </div>
      <Tag name="Scroll Stack" />
    </section>
  );
}

/* ---------- Circular Gallery: projects ---------- */
export function Projects() {
  const [font, setFont] = useState<string | null>(null);
  useEffect(() => {
    const fam = getComputedStyle(document.documentElement).getPropertyValue('--font-fraunces').trim() || 'Georgia, serif';
    const f = `500 30px ${fam}`;
    let done = false;
    const go = () => {
      if (!done) {
        done = true;
        setFont(f);
      }
    };
    document.fonts.load(f).then(go, go);
    const t = window.setTimeout(go, 1500);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <section className="sec dark seam">
      <div className="wrap sec-head">
        <p className="eyebrow">Recent work</p>
        <h2 className="h2">
          Gardens we have <em>grown.</em>
        </h2>
        <p className="lede">Drag sideways to explore. On the live site each project opens its own story page.</p>
      </div>
      <div className="cg-wrap">
        {font && <CircularGallery items={PROJECTS.map(p => ({ image: p.image, text: p.text }))} bend={2.4} textColor="#EAD9BC" borderRadius={0.06} font={font} scrollSpeed={2} scrollEase={0.05} />}
      </div>
      <p className="cg-hint">Drag, swipe or scroll sideways</p>
      <Tag name="Circular Gallery" />
    </section>
  );
}

/* ---------- Ripple Distortion: water-wise band ---------- */
export function WaterBand() {
  return (
    <section className="water" aria-label="Water-wise design">
      <div className="water-media">
        <RippleDistortion src="/images/proj-water.jpg" brushSize={160} strength={0.16} swirl={1} rings={4} spread={5} fade={3} spacing={14} tint="#C99A45" tintAmount={0.12} grayscale={false} trigger="hover" quality="low" />
      </div>
      <div className="water-copy">
        <div className="wrap">
          <p className="eyebrow">Water-wise by design</p>
          <h2 className="h2" style={{ maxWidth: '16ch' }}>
            Every drop <em>stays in the garden.</em>
          </h2>
          <p className="lede" style={{ color: 'rgba(247,238,221,.85)' }}>
            Rainwater harvesting pits, drip irrigation and planting that suits the local climate. Move across the water to see it ripple.
          </p>
        </div>
      </div>
      <Tag name="Ripple Distortion" />
    </section>
  );
}

/* ---------- Depth Carousel: rentals ---------- */
export function Rentals() {
  const [i, setI] = useState(0);
  return (
    <section className="sec light seam">
      <div className="wrap two-col">
        <div>
          <p className="eyebrow">Plants on rent</p>
          <h2 className="h2">
            Green for a day, <em>or for years.</em>
          </h2>
          <p className="lede">Rent the look without buying the plants. We handle delivery, styling and care.</p>
          <div className="plans">
            <article className="panel-soft">
              <h3>Corporate rental</h3>
              <p className="plan-term">2–3 years</p>
              <p>Plants, planters and AMC in one monthly fee, with swaps included.</p>
            </article>
            <article className="panel-soft">
              <h3>Event rental</h3>
              <p className="plan-term">1–2 days</p>
              <p>Weddings, launches and conferences. Delivered, styled and collected.</p>
            </article>
          </div>
          <Link className="btn btn-dark" href="/contact">
            Get a rental quote
          </Link>
        </div>
        <div>
          <div className="dc-wrap">
            <DepthCarousel
              items={RENTALS.map(r => ({ image: r.image, alt: r.alt }))}
              cardWidth={280}
              cardHeight={360}
              radius={22}
              tint="#140D08"
              depth={200}
              spread={80}
              tilt={20}
              visibleCards={4}
              blur={5}
              autoplay
              autoplayDelay={3400}
              onChange={idx => setI(idx)}
            />
          </div>
          <p className="dc-caption">
            <b>{RENTALS[i].title}</b>
            {RENTALS[i].note}
          </p>
        </div>
      </div>
      <Tag name="Depth Carousel" />
    </section>
  );
}

/* ---------- Stack: crew name tags ---------- */
export function Crew() {
  return (
    <section className="sec dark seam">
      <div className="wrap two-col">
        <div>
          <p className="eyebrow">Our crew</p>
          <h2 className="h2">
            The hands behind <em>every garden.</em>
          </h2>
          <p className="lede">Our own trained team plants, prunes and looks after every site we build. Drag a card away, or tap it, to meet the next person.</p>
          <p className="crew-note">Real crew photos will replace these wooden name tags.</p>
        </div>
        <div className="stack-box">
          <Stack
            randomRotation
            sensitivity={140}
            sendToBackOnClick
            cards={CREW.map((c, k) => (
              <div key={c.initials} className={`tag-card${k % 2 ? ' teak' : ''}`}>
                <span className="tag-hole" />
                <div className="tag-rings">{c.initials}</div>
                <div className="tag-role">{c.role}</div>
                <p className="tag-skills">{c.skills}</p>
                <div className="tag-foot">Star Gardens crew</div>
              </div>
            ))}
          />
        </div>
      </div>
      <Tag name="Stack" />
    </section>
  );
}

/* ---------- Infinite Spiral: CSR impact ---------- */
export function Impact() {
  return (
    <section className="sec moss seam">
      <div className="wrap two-col">
        <div>
          <p className="eyebrow">CSR · Cost-free</p>
          <p className="impact-num">1,500</p>
          <p className="impact-sub">trees planted with ABB Ltd</p>
          <p className="lede">On Sundays our crew runs cost-free planting drives with companies, schools and neighbourhoods. You bring the people. We bring the saplings, the tools and the know-how.</p>
          <Link className="btn btn-brass" href="/contact">
            Partner with us on CSR
          </Link>
        </div>
        <div className="spiral-box">
          <InfiniteSpiral items={SPIRAL} speed={0.5} radius={170} cardWidth={118} cardHeight={118} verticalSpacing={58} cardsPerTurn={7} centerScale={1.25} edgeFade={0.3} edgeBlur={5} cardRadius={14} pauseOnHover animationMode="all" />
        </div>
      </div>
      <Tag name="Infinite Spiral" />
    </section>
  );
}

/* ---------- Masonry: blog ---------- */
export function Field({ title = true }: { title?: boolean }) {
  return (
    <section className="sec light seam">
      <div className="wrap">
        {title && (
          <div className="field-head">
            <div className="sec-head">
              <p className="eyebrow">From the field · Blog</p>
              <h2 className="h2">
                Notes, photos and <em>seasonal tips.</em>
              </h2>
            </div>
            <div>
              <span className="sb-tag">Kokonut UI · Social Button</span>
              <SocialButton label="Follow us" items={SOCIALS.slice(1, 5)} />
            </div>
          </div>
        )}
        <div className="masonry-box">
          <Masonry items={POSTS} ease="power3.out" duration={0.6} stagger={0.05} animateFrom="bottom" scaleOnHover hoverScale={0.96} blurToFocus colorShiftOnHover={false} />
        </div>
      </div>
      <Tag name="Masonry" />
    </section>
  );
}

/* ---------- Option Wheel + Social Button: start a project ---------- */
export function Contact() {
  const [sel, setSel] = useState(1);
  const [size, setSize] = useState(3.4);
  useEffect(() => {
    const f = () => setSize(window.innerWidth < 600 ? 2.1 : window.innerWidth < 1100 ? 2.8 : 3.4);
    f();
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  const s = WHEEL[sel];
  return (
    <section className="sec dark seam">
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow">Start a project</p>
          <h2 className="h2">
            What can we <em>grow</em> for you?
          </h2>
          <p className="lede">Scroll, drag or tap the list to choose a service.</p>
          <div className="ow-box">
            <OptionWheel items={WHEEL.map(w => w.name)} defaultSelected={1} onChange={idx => setSel(idx)} textColor="#8F7A5E" activeColor="#FBF3E4" side="left" fontSize={size} spacing={1.35} curve={1} tilt={6} blur={2} fade={0.22} minOpacity={0.06} inset={6} />
          </div>
        </div>
        <aside className="ow-panel" aria-live="polite">
          <p className="ow-kicker">You picked</p>
          <h3>{s.name}</h3>
          <p>{s.desc}</p>
          <p style={{ fontSize: 14.5 }}>
            <b style={{ color: 'var(--ink)' }}>Good for:</b> {s.good}
          </p>
          <Link className="btn btn-dark" href="/contact">
            Get a quote for {s.name}
          </Link>
          <div className="contact-lines">
            <span>
              <b>Call or WhatsApp</b> +91 00000 00000
            </span>
            <span>
              <b>Email</b> hello@yourdomain.com
            </span>
            <span>
              <b>Talk to</b> Abhi sir and the team
            </span>
          </div>
          <div>
            <span className="sb-tag">Kokonut UI · Social Button</span>
            <SocialButton label="Connect" items={SOCIALS} />
          </div>
        </aside>
      </div>
      <Tag name="Option Wheel" />
    </section>
  );
}

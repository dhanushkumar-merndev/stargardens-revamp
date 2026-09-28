'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Tier } from '@/components/garden/GardenScene';

const GardenScene = dynamic(() => import('@/components/garden/GardenScene'), { ssr: false });

function detectTier(): Tier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const coarse = matchMedia('(pointer: coarse)').matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
  return coarse || small || weak ? 'low' : 'high';
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);
  const [cfg, setCfg] = useState<{ tier: Tier; treeX: number } | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!hasWebGL()) return;
    const wide = window.innerWidth / window.innerHeight > 1.05;
    setCfg({ tier: detectTier(), treeX: wide ? 2.6 : 0 });
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    const onScroll = () => {
      const h = el.offsetHeight || 1;
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <section className="hero" ref={heroRef} aria-labelledby="heroTitle">
      <div className="hero-canvas" aria-hidden="true">
        {cfg && <GardenScene tier={cfg.tier} treeX={cfg.treeX} scrollRef={scrollRef} active={active} />}
      </div>
      <div className="hero-scrim" />
      <div className="wrap hero-inner">
        <p className="eyebrow">Landscape design &amp; development studio</p>
        <h1 className="hero-title" id="heroTitle">
          We are <em>Star Gardens.</em>
        </h1>
        <p className="hero-lede">
          We design, build and care for outdoor spaces, from villa gardens and corporate campuses to resorts and managed farmland. Hardscape and softscape, end to end.
        </p>
        <div className="hero-cta">
          <Link className="btn btn-brass" href="/projects">
            Explore projects
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
          <Link className="btn btn-ghost" href="/contact">
            Start a project
          </Link>
        </div>
      </div>
      <div className="wrap hero-foot">
        <span className="hint">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="7" opacity=".6" />
            <circle cx="12" cy="12" r="10.5" opacity=".3" />
          </svg>
          Move through the tree, the leaves part around you
          <button className="regrow" type="button" onClick={() => window.dispatchEvent(new Event('sg:regrow'))}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Grow again
          </button>
        </span>
        <ul className="hero-stats">
          <li><b>1,500</b>trees planted with ABB</li>
          <li><b>3</b>sectors</li>
          <li><b>7</b>services</li>
        </ul>
      </div>
      <span className="ctag">
        <i />
        Three.js · <b>3D particle tree</b>
      </span>
    </section>
  );
}

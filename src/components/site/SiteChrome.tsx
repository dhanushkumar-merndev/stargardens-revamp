'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BubbleMenu from '@/components/reactbits/BubbleMenu/BubbleMenu';
import DynamicText from '@/components/kokonut/dynamic-text';
import { StarGardensMark } from './icons';
import { NAV } from '@/lib/content';

declare global {
  interface Window {
    __sgRevealed?: boolean;
  }
}

function reveal() {
  const root = document.documentElement;
  root.classList.remove('sg-lock');
  window.setTimeout(() => root.classList.remove('sg-pre'), 300);
  window.__sgRevealed = true;
  window.dispatchEvent(new Event('sg:reveal'));
}

/** Greeting intro built on Kokonut UI's Dynamic Text. Plays once per browser session, or on "Replay intro". */
function Intro() {
  const [phase, setPhase] = useState<'idle' | 'run' | 'lift' | 'gone'>('idle');
  const [run, setRun] = useState(0);

  useEffect(() => {
    const seen = (() => {
      try {
        return sessionStorage.getItem('sg-intro') === '1';
      } catch {
        return false;
      }
    })();
    if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('gone');
      reveal();
      return;
    }
    document.documentElement.classList.add('sg-lock', 'sg-pre');
    setPhase('run');
    const failsafe = window.setTimeout(() => setPhase(p => (p === 'run' ? 'lift' : p)), 6000);
    return () => window.clearTimeout(failsafe);
  }, []);

  useEffect(() => {
    const replay = () => {
      window.scrollTo({ top: 0 });
      document.documentElement.classList.add('sg-lock', 'sg-pre');
      setRun(r => r + 1);
      setPhase('run');
    };
    window.addEventListener('sg:replay-intro', replay);
    return () => window.removeEventListener('sg:replay-intro', replay);
  }, []);

  useEffect(() => {
    if (phase !== 'lift') return;
    try {
      sessionStorage.setItem('sg-intro', '1');
    } catch {}
    reveal();
    window.dispatchEvent(new Event('sg:regrow'));
    const t = window.setTimeout(() => setPhase('gone'), 1050);
    return () => window.clearTimeout(t);
  }, [phase]);

  const done = useCallback(() => {
    window.setTimeout(() => setPhase(p => (p === 'run' ? 'lift' : p)), 450);
  }, []);

  if (phase === 'gone') return null;
  return (
    <div className={`intro${phase === 'lift' ? ' is-done' : ''}`} role="status" aria-label="Welcome to Star Gardens">
      <div className="intro-center">
        {phase !== 'idle' && <DynamicText key={run} onComplete={done} />}
        <p className="intro-sub">Star Gardens · Landscape design &amp; development</p>
        <div className="intro-bar" key={`bar-${run}`}>
          <span />
        </div>
      </div>
      <button className="intro-skip" type="button" onClick={() => setPhase('lift')}>
        Skip intro
      </button>
      <span className="ctag">
        <i />
        Kokonut UI · <b>Dynamic Text</b>
      </span>
    </div>
  );
}

/** React Bits Bubble Menu (burger on every screen) over a bar that is transparent at the top and white + blurred once scrolled. */
function Header() {
  const router = useRouter();

  useEffect(() => {
    const root = document.documentElement;
    const onScroll = () => root.classList.toggle('sg-scrolled', window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('.bubble-menu-items a.pill-link') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') || '/';
      if (!href.startsWith('/')) return;
      e.preventDefault();
      (document.querySelector('.bubble-menu .toggle-bubble') as HTMLButtonElement | null)?.click();
      router.push(href);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [router]);

  return (
    <>
      <div className="sg-bar" aria-hidden="true" />
      <BubbleMenu
        logo={
          <a className="sg-logo" href="/" aria-label="Star Gardens home" onClick={e => { e.preventDefault(); router.push('/'); }}>
            <StarGardensMark />
            <span>Star Gardens</span>
          </a>
        }
        items={NAV}
        menuAriaLabel="Toggle menu"
        menuBg="#F6EBD8"
        menuContentColor="#2A1C12"
        useFixedPosition
        animationEase="back.out(1.5)"
        animationDuration={0.5}
        staggerDelay={0.12}
        onMenuClick={open => document.documentElement.classList.toggle('sg-menu-open', open)}
      />
      <span className="ctag sg-header-tag">
        <i />
        React Bits · <b>Bubble Menu</b>
      </span>
    </>
  );
}

function TagToggle() {
  const [on, setOn] = useState(true);
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem('sg-tags');
    } catch {}
    const value = stored !== 'off';
    setOn(value);
    document.documentElement.classList.toggle('no-tags', !value);
  }, []);
  const flip = () => {
    const next = !on;
    setOn(next);
    document.documentElement.classList.toggle('no-tags', !next);
    try {
      localStorage.setItem('sg-tags', next ? 'on' : 'off');
    } catch {}
  };
  return (
    <button className="tag-toggle" type="button" aria-pressed={on} onClick={flip}>
      <i />
      {on ? 'Labels on' : 'Labels off'}
    </button>
  );
}

export default function SiteChrome() {
  return (
    <>
      <Intro />
      <Header />
      <TagToggle />
    </>
  );
}

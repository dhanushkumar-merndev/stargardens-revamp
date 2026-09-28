import type { SVGProps } from 'react';

/* Brand marks drawn as simple strokes (lucide-react no longer ships brand icons). */
type P = SVGProps<SVGSVGElement>;
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const InstagramIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect width="20" height="20" x="2" y="2" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <path d="M17.5 6.5h.01" />
  </svg>
);
export const LinkedinIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
export const YoutubeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);
export const WhatsappIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

/** Star Gardens placeholder mark: five leaves arranged as a star. Swap for the real logo from the brand kit. */
export const StarGardensMark = (p: P) => (
  <svg viewBox="0 0 32 32" aria-hidden="true" {...p}>
    <g fill="currentColor">
      {[0, 72, 144, 216, 288].map(r => (
        <path key={r} d="M16 2.6C19 6 19 10.4 16 13.6 13 10.4 13 6 16 2.6Z" transform={`rotate(${r} 16 16)`} />
      ))}
      <circle cx="16" cy="16" r="1.9" />
    </g>
  </svg>
);

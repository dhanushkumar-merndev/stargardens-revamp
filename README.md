# Star Gardens · website

Next.js 16 site for **Star Gardens & Development**, a landscape design and development studio.
Wood-theme design with a 3D particle-tree garden hero, built on React Bits and Kokonut UI components.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## What is where

| Path | What it is |
| --- | --- |
| `src/app/` | App Router pages: home, projects, services, blog, about, contact, login (CRM placeholder) |
| `src/components/garden/` | Three.js / React Three Fiber hero: particle tree that grows from seeds, wooden deck, wind grass, fireflies, bloom |
| `src/components/home/` | Home sections, one per component (see below) |
| `src/components/site/` | Intro greeting, Bubble Menu header with the transparent → white-blur bar, footer |
| `src/components/reactbits/` | React Bits components, copied from the original source (TypeScript + CSS variants) |
| `src/components/kokonut/` | Kokonut UI Dynamic Text and Social Button, lightly adapted for the wood theme |
| `src/lib/content.ts` | All copy: services, sectors, projects, rentals, crew, blog posts |
| `public/images/` | **Generated placeholder pictures.** Replace with real photos using the same file names |
| `public/textures/` | Procedural wood grain tiles (walnut, oak, teak, cedar) used across the theme |

## Components used

| Section | Component |
| --- | --- |
| Intro greeting (Tamil, Kannada, Hindi, Telugu, Malayalam, English) | Kokonut UI · Dynamic Text |
| Header (burger on every screen) | React Bits · Bubble Menu |
| Hero | Three.js particle tree (custom) |
| Services marquee | React Bits · Logo Loop |
| Before / after plot | React Bits · Pixel Swap |
| Sectors | React Bits · Accordion Gallery |
| Services | React Bits · Scroll Stack |
| Projects | React Bits · Circular Gallery |
| Water-wise band | React Bits · Ripple Distortion |
| Plant rental | React Bits · Depth Carousel |
| Crew | React Bits · Stack |
| CSR impact | React Bits · Infinite Spiral |
| Blog | React Bits · Masonry |
| Start a project | React Bits · Option Wheel + Kokonut UI · Social Button |

The floating **Labels** button toggles the component name tags on every section (handy for review; remove before launch).

## Still needed from Star Gardens

Logo files and Canva fonts, real project/crew/event photos, contact numbers and address, the About story, workshop schedule, and client logos. The CRM login lives at `/login` and will be built into this same app later.

Third-party licences: see `THIRD_PARTY_NOTICES.md`.

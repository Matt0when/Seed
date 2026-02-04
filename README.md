# Seed Frontend Engineering Take-Home

Implementation of two consecutive chapters from the Figma design: the **Clouds/Sky transition** ("Your Health. Our Shared World.") and the **Globe/Human-Planet Axis** section.

## Getting Started

```bash
npm install
npm run dev
```

Open [https://seed.mattowens566.workers.dev/](https://seed.mattowens566.workers.dev/) to view the live app.

---

## Technical Decisions

**Animation & Scroll**
- **GSAP + ScrollTrigger** powers all scroll-linked animations with `scrub` for smooth bidirectional control
- Vertical scroll drives horizontal content progression (down = forward, up = backward)
- Pin-based scrolling locks the clouds chapter in place over 200vh of scroll distance
- `clip-path` animation for the pill mask effect (GPU-accelerated, no repaints)

**Architecture**
- **CSS Modules** for component-scoped styling, matching the existing project patterns
- **Dynamic imports** with `ssr: false` to avoid GSAP hydration mismatches in Next.js
- Semantic HTML with proper heading hierarchy and ARIA labels for accessibility

**Assets**
- Video backgrounds (`clouds.mp4`, `globe.mp4`) served statically from `public/`
- SeedSans font family (provided in starter)

---

## Design Latitude

- Defined CSS custom properties for colors, spacing, and typography based on Figma specs where `@seed-health/tokens` lacked exact matches
- Simplified timeline navigation to focus on the two implemented chapters
- Added gradient overlay on video backgrounds to ensure text legibility

---

## What I'd Improve With More Time

- **Canvas frame sequence** for the cloud video (smoother scrubbing than video `currentTime`)
- **Lenis smooth scroll** for a more polished scroll feel
- **Responsive breakpoints** (current implementation targets 1440px desktop)
- **Unit tests** for scroll progress calculations and component rendering
- **Keyboard navigation** for timeline chapter selection
- **Performance** - lazy-load videos, compress assets, add loading states

---

## Project Structure

```
pages/
  index.tsx        # Homepage
  _app.tsx         # App wrapper, imports globals.css
  _document.tsx    # Preloads SeedSans fonts
components/
  WhatsNextTransition/   # Clouds + Globe chapters
  HorizontalScroll.tsx   # Scroll-driven container
  TimelineNav.tsx        # Chapter navigation
styles/
  globals.css      # Global styles + font faces
public/
  fonts/           # SeedSans woff2 files
  clouds.mp4       # Clouds background video
  globe.mp4        # Globe background video
```

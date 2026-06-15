# Stannect — Connected Workspace (front-end)

An interactive landing/workspace page for Stannect: a rotating bronze
"connection globe", parallax hero, and frosted KPI / dashboard / integration
cards that **chain back to a central Stannect hub** — reinforcing the brand
idea of *staying connected*. Includes an **Add card** button to grow the
workspace (User KPI, Dashboard, JobTread integration, blank).

Built with **Next.js (App Router) + TypeScript + Tailwind**. Front-end only —
cards use representative sample data; wire them to real APIs (GHL, JobTread)
later.

## Run it

```bash
cd stannect-dashboard
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

## Brand

Colors, type, and tone follow `Stannect_Branding.MD`:

- Warm bronze (`--brand`) on soft warm neutrals (light) or deep warm charcoal
  (dark). No neon, no pure black/white. The reference network-globe image
  inspired the *structure*, not the cyan color.
- Headings: Poppins (brand-approved fallback for Brandmark Sans 10).
  Body: Exo 2. Both via `next/font`.
- Chain-link motif (the Stannect logo) is used for the hub icon and the
  animated connectors between cards.
- Light/dark toggle, persisted to `localStorage`, driven by the `data-theme`
  attribute and CSS variables. Defaults to dark.

## Structure

| Path | Role |
|---|---|
| `app/layout.tsx` | Fonts, metadata, pre-paint theme init |
| `app/globals.css` | Brand CSS variables (light + dark), card surfaces |
| `components/Hero.tsx` | Parallax hero wrapping the globe + headline |
| `components/NetworkGlobe.tsx` | Canvas wireframe connection globe |
| `components/ConnectedGrid.tsx` | Cards + chain connectors + state |
| `components/KpiCard.tsx` | Frosted, tilt-on-hover card + sparkline |
| `components/AddCardMenu.tsx` | "Add card" popover |
| `lib/cards.ts` | Card model, defaults, add-templates |
| `lib/useParallax.ts` | Pointer-driven parallax hook |

## Notes / next steps

- **Real data:** replace the sample metrics in `lib/cards.ts` and feed cards
  from your KPI/JobTread/GHL sources.
- **Brandmark Sans 10:** if you obtain the licensed web font, add an
  `@font-face` and point `--font-heading` at it (Poppins is the fallback).
- **Persistence:** added/removed cards are in-memory only; persist to your
  backend or `localStorage` when ready.
- Motion respects `prefers-reduced-motion`.

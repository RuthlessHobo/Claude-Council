# Stannect Command Center — Project Handoff

> Drop this whole `stannect-dashboard/` folder into the target repo. This file gives a
> fresh Claude Code session full context to continue the work without re-explaining.

## What this is

An interactive, **Stannect-branded KPI command center** front-end. Two deliverables live here:

1. **`stannect-preview.html`** — a single, self-contained static file (no build, no server).
   Double-click to open in any browser. **This is the primary thing to iterate on** — every
   feature below is implemented here in vanilla HTML/CSS/JS + canvas.
2. **Next.js app** (`app/`, `components/`, `lib/`, configs) — a React/Tailwind scaffold of the
   same concept (earlier milestone). The static file is ahead of it feature-wise; the Next app
   is the path for wiring real data/routing later.

## The concept

A 3D **"connection globe"** (Stannect = "staying connected") rendered in the brand's warm
bronze, with **dashboard cards orbiting around it** on a tilted ring. Drag to orbit; click a
card → a chain shoots from the globe to the card, then it zooms into that dashboard's KPIs.
A **World ⇄ Grid** toggle switches between this "gamified" view and a clean grid ("logistics")
view. Both open the same dashboards.

## Brand (see `docs/Stannect_Branding.md`)

- Warm bronze (`--brand`) on warm-charcoal (dark) / soft off-white (light). **No neon, no pure
  black/white.** Premium, calm, earthy.
- Headings: Poppins (fallback for Brandmark Sans 10). Body: Exo 2.
- Light/dark toggle persists via `localStorage` + `data-theme` on `<html>`.
- The reference network-globe image inspired the *structure*, not the color.

## Features implemented (in `stannect-preview.html`)

- **Living globe**: ~820 fibonacci-sphere nodes, nearest-neighbour links, size-varied + glowing
  pulsing "hub" nodes, an atmosphere halo, and **traveling light pulses** flowing along
  connections. Pointer/drag rotate it; theme-reactive color.
- **Orbiting cards** on a tilted ring (around the globe, not over it); depth drives
  scale/blur/brightness/z-index; gentle float.
- **Click-to-enter**: chain shoots from globe → card (staggered link draw-in) → bronze bloom →
  globe warp → dashboard arrives with a blur-in.
- **World ⇄ Grid toggle** (header), persisted.
- **Dashboards fully editable** (modal): name, **owner** (every dashboard has one), and
  **integration** (GoHighLevel / JobTread / JobNimbus / Salesforce / Airtable / Make / Zapier /
  Manual). Set-as-**primary** (★) → natural bronze ring + inline tag (no badge pill).
- **KPIs fully editable** (modal, modeled on GHL widget config): name, source integration +
  data object, value **format** (number/%/currency/duration/text), and **visualization**
  (KPI value / line / bar / progress / table), plus value + delta. Each tile shows its source.
- **"Connect a metric"** quick-add from a catalog of 30+ KPIs (from the research below), plus
  **"Build custom KPI."**
- **"Ask Stannect" AI box** inside each dashboard — currently a **mock** (canned answers) to
  demo the natural-language-query feature.
- Logo mark = bronze sphere + STANNECT wordmark.

## Data model (static file, in the `<script>`)

- `INTEGRATIONS`, `FORMATS`, `DISPLAYS` — option lists.
- `CAT` — KPI catalog keyed by id (label, sample value, delta, spark series, source).
- `dashboards` — array of `{ id, name, owner, integration, accent, kpis: [kpiObj] }`.
- `kpiObj` — `{ id, catKey?, label, value, delta, up, good, display, fmt, source, data[], rows[] }`.
- All values are **sample/mock data** — no real backend yet.

## KPI research (the source of truth for metrics)

A full KPI framework for construction/roofing/exterior contractors on GHL was defined:
30 KPIs across Lead Flow & Speed, Appointments, Sales Conversion, Pipeline Health, Rehash/
Follow-up ROI, Marketing & Cost, Client Experience, and System Health. Executive view shows
~10–12. Data architecture: **Make.com → central Airtable (now) / Supabase-Postgres (later) →
dashboard**, one record per contact/opportunity/activity, KPI rollup tables, per-subaccount
filtering, surfaced in GHL via a Custom Menu Link. (Full export was provided by the user; ask
them to re-share `stannect_kpi_reporting_chat_export.md` if you need the verbatim list.)

## The "Ask Stannect" AI feature — how to build it for real

Natural-language → database query:
1. User asks in plain English.
2. **Claude turns it into a structured query** via **tool use** with strict schemas
   (e.g. `query_kpis(metric, group_by, date_range, filters)`, `list_contacts(filter)`) +
   structured outputs — NOT free-text SQL.
3. **Your backend executes** that query against Airtable/Postgres (enforces per-client
   `Subaccount ID` filter — model never touches the DB).
4. Feed rows back to Claude → plain-English answer + numbers.
- Model: default `claude-opus-4-8`; `claude-haiku-4-5` for cheap/high-volume. Call via the
  official Anthropic SDK **server-side only** (Next.js route / Supabase Edge Function).

## How to run

```bash
# Static (recommended for iteration)
open stannect-preview.html        # just open it in a browser

# Next.js app
cd stannect-dashboard && npm install && npm run dev   # http://localhost:3000
```

## Suggested next steps

- Tune ring spacing / globe size if cards overlap the globe face.
- Build the real AI backend route (NL-query) + a GHL/JobTread data adapter.
- Persist dashboards/KPIs (localStorage or backend) so edits survive reload.
- Port the static file's features into the Next.js app for routing + real data.

## File map

| Path | Role |
|---|---|
| `stannect-preview.html` | **Primary** — full self-contained static app |
| `docs/Stannect_Branding.md` | Brand reference (colors, type, tone, logo) |
| `app/`, `components/`, `lib/` | Next.js (App Router) scaffold of the same concept |
| `README.md` | Run instructions |
| `HANDOFF.md` | This file |

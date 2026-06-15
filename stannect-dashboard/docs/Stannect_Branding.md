# Stannect — Brand Reference

> Brand reference for AI coding tools working on the Stannect KPI dashboard and related
> front-end builds. The dashboard is **always Stannect-branded** — client branding stays
> inside their GHL subaccount.

**Identity:** Premium, calm, artisanal-not-corporate. Earthy warm neutrals, geometric,
understated. Never harsh primaries, neon, or pure black/white.

**Tagline:** *"Where Your Business Meets Automation."*

---

## Color Palette — Light Mode (canonical)

These five are the brand-defined values. Do not substitute.

| Token | Hex | Use |
|---|---|---|
| `background` | `#edeee7` | Soft warm off-white. Primary background. |
| `foreground` / `brand` | `#a2825d` | Warm bronze. Primary brand color — logo, headings, key accents. |
| `accent-1` | `#bdbca8` | Muted sage/taupe. |
| `accent-2` | `#b4a98f` | Warm beige. |
| `accent-3` | `#ab9576` | Mid-tone bronze. |

## Color Palette — Dark Mode (suggested)

Brand spec calls for **"deep warm charcoal + bronze accents"**.

| Token | Hex |
|---|---|
| `bg` | `#1d1a16` |
| `surface` | `#28241f` |
| `border` | `#3a352e` |
| `brand` | `#b89567` |
| `text` | `#e8e6df` |
| `text-muted` | `#a9a395` |

---

## Typography

- **Headings:** Brandmark Sans 10 (no web source) → fallback **Poppins** / Montserrat.
- **Body:** Exo 2 (Google Fonts).

## Logo

Chain-link icon + "STANNECT" wordmark (geometric, all-caps sans). In this app the mark is
rendered as a **bronze sphere** (the connection globe) since it lives inside Stannect.

- Full logo: `https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/TQJOdU4270StImOTr6lM/media/64260d24-9ea1-4c9f-bc5c-80878076faa5.png`
- Icon: `https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/TQJOdU4270StImOTr6lM/media/659b4756b7db420666499e2f.png`

## CSS Variables (drop-in)

```css
:root {
  --bg: #edeee7; --brand: #a2825d;
  --accent-1: #bdbca8; --accent-2: #b4a98f; --accent-3: #ab9576;
  --surface: #f5f5f0; --border: #d8d6cb; --text: #2e2a24; --text-muted: #6b6458;
}
[data-theme="dark"] {
  --bg: #1d1a16; --surface: #28241f; --border: #3a352e; --brand: #b89567;
  --accent-1: #6f6d5e; --accent-2: #7d7461; --accent-3: #8a7559;
  --text: #e8e6df; --text-muted: #a9a395;
}
```

## Visual Tone Rules

- ✅ Warm earth tones, soft contrast, generous whitespace, premium-calm feel.
- ✅ Bronze for headings, primary actions, key data accents; sage/beige/mid-bronze for series.
- ❌ No harsh primaries, neon, saturated colors. No pure black/white. No over-designed look.

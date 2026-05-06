# REDESIGN-SPEC.md — Arkansans for Pension Integrity (API) Website Overhaul

> **Read CLAUDE.md first.** This spec assumes you know the brand, color palette, logo files, and content guidelines defined there. This document is the structural and visual blueprint for the May 2026 redesign.

## Design Philosophy

The site should feel like a published investigative report — the kind of document a legislator would pick up from their desk and read cover to cover. Not a blog. Not a protest site. Not a think tank. A public record, presented with the gravity it deserves.

Design language: **Public Record Elegance.** The visual weight of investigative journalism crossed with the warmth of a civic institution that actually gives a damn about the people it serves.

Every design decision filters through one question: does a 62-year-old retired teacher in Fort Smith trust this page enough to click "Take Action"?

---

## Color Tokens

Map these into CSS custom properties. Replace ALL existing `--art-*` tokens.

```css
:root {
  /* Primary */
  --api-navy: #1A3057;
  --api-cream: #F8F5F0;
  --api-charcoal: #1C1917;

  /* Accent */
  --api-gold: #CBA648;
  --api-red: #B91C1C;
  --api-forest: #224D36;
  --api-slate: #5F7391;
  --api-gray: #777773;

  /* Semantic — Light Mode */
  --bg-primary: var(--api-cream);
  --bg-secondary: #FFFFFF;
  --bg-hero: var(--api-navy);
  --bg-footer: var(--api-navy);
  --text-primary: var(--api-charcoal);
  --text-secondary: var(--api-gray);
  --text-on-dark: var(--api-cream);
  --text-heading: var(--api-navy);
  --accent: var(--api-gold);
  --accent-cta: var(--api-red);
  --link-color: var(--api-navy);
  --link-hover: var(--api-slate);
  --border-default: #E2E2E2;
  --border-accent: var(--api-gold);
}

[data-theme="dark"] {
  --bg-primary: var(--api-charcoal);
  --bg-secondary: #242220;
  --bg-hero: var(--api-charcoal);
  --bg-footer: #0E0D0C;
  --text-primary: var(--api-cream);
  --text-secondary: #A8A5A0;
  --text-on-dark: var(--api-cream);
  --text-heading: var(--api-cream);
  --accent: var(--api-gold);
  --accent-cta: var(--api-red);
  --link-color: var(--api-gold);
  --link-hover: #D4B968;
  --border-default: #3A3835;
  --border-accent: var(--api-gold);
}
```

---

## Typography Scale

Keep existing font families. Tighten the hierarchy.

```css
/* Display — Cormorant Garamond */
h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2.75rem; font-weight: 600; line-height: 1.15; color: var(--text-heading); }
h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 2rem; font-weight: 600; line-height: 1.25; color: var(--text-heading); }

/* Subheadings — Inter */
h3 { font-family: 'Inter', sans-serif; font-size: 1.25rem; font-weight: 600; line-height: 1.4; color: var(--text-heading); }
h4 { font-family: 'Inter', sans-serif; font-size: 1.1rem; font-weight: 600; line-height: 1.4; color: var(--text-primary); }

/* Body — Source Serif 4 */
body, p, li { font-family: 'Source Serif 4', Georgia, serif; font-size: 1.125rem; line-height: 1.7; color: var(--text-primary); }

/* UI — Inter */
nav, button, .btn, .stat-label, .meta, .caption { font-family: 'Inter', sans-serif; }

/* Data — IBM Plex Mono */
.stat-number, .doc-id, code, .citation { font-family: 'IBM Plex Mono', monospace; }
```

---

## Logo Integration

### Files
- `assets/images/api-logo-mark.png` — navy stroke, for light backgrounds
- `assets/images/api-logo-mark-dark.png` — gold stroke, for dark backgrounds

### Nav logo
Render at 44px height in the nav bar. Use the same opacity-based crossfade pattern already in place for light/dark switching. Replace all references to `api-logo.svg` and `api-logo-dark.svg` with the new PNG marks.

```html
<a href="/" class="logo-link" aria-label="Arkansans for Pension Integrity home">
  <img src="/assets/images/api-logo-mark.png" alt="API logo" class="logo logo-light" width="44" height="44">
  <img src="/assets/images/api-logo-mark-dark.png" alt="API logo" class="logo logo-dark" width="44" height="44">
</a>
```

### Hero logo
On the homepage hero (navy background), render the dark-mode mark (gold stroke) at ~240px, centered above the headline.

### Footer logo
Render at 64px in the footer, dark-mode variant (gold stroke on navy background).

### Favicon
Generate a simplified favicon from the logo mark. The state outline at 32x32 in navy on transparent is sufficient. Update both `favicon.ico` and `favicon.svg`.

---

## Page Structure: Homepage (`index.md` / `landing.html`)

### Section 1: Hero (full viewport)

```
┌─────────────────────────────────────────────────────┐
│                  [navy background]                    │
│                                                       │
│              ┌─────────────────────┐                  │
│              │   LOGO MARK (240px) │                  │
│              │  (gold stroke ver)  │                  │
│              └─────────────────────┘                  │
│                                                       │
│     Up to $100M in pension fund exposure.             │
│     Zero independent analyses.                        │
│          (Cormorant Garamond, cream, 2.75rem)         │
│                                                       │
│       Your money. Zero analysis.                      │
│            (Inter medium, gold, 1rem)                 │
│                                                       │
│    [ See the evidence ]  [ Take action ]              │
│    (gold fill, navy text) (cream outline)             │
│                                                       │
│     Based on 1,227 public records obtained            │
│     through the Arkansas Freedom of Information Act   │
│            (Inter, cream, 0.8rem, 50% opacity)        │
│                                                       │
└─────────────────────────────────────────────────────┘
```

CSS: `min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-hero); text-align: center; padding: 2rem;`

The hero MUST be `100vh` and centered. No scroll indicators, no extra chrome. The visitor sees the mark, the finding, and the buttons. That's it.

### Section 2: Key Stats (below the fold)

```
┌─────────────────────────────────────────────────────┐
│                 [cream background]                    │
│                                                       │
│   $100M              3                  0             │
│   (IBM Plex Mono   (IBM Plex Mono    (IBM Plex Mono  │
│    4rem, navy)      4rem, navy)       4rem, red)      │
│                                                       │
│   Authorized        Major credit     Independent      │
│   pension fund      agency           credit analyses   │
│   exposure          downgrades       found in 1,200+  │
│                     since 2024       FOIA documents    │
│   (Source Serif,    (Source Serif,   (Source Serif,    │
│    1rem, charcoal)   1rem, charcoal)  1rem, charcoal) │
│                                                       │
└─────────────────────────────────────────────────────┘
```

Three columns on desktop, stacked on mobile. Each stat is a large monospace number with a descriptive line below. No cards, no boxes, no borders. Just typography. The zero gets `--api-red` because it IS the finding.

### Section 3: Audience Pathways

NOT a card grid. Full-width horizontal bands. Each band is a full-width row with:
- Left: audience identity in Cormorant Garamond ("I'm an Arkansas educator")
- Center: one-sentence hook in Source Serif
- Right: arrow link in gold

```
┌─────────────────────────────────────────────────────┐
│ [cream bg]                                            │
│                                                       │
│  I'm an Arkansas educator                             │
│  How ATRS pension decisions affect your retirement  → │
│                                                       │
├─────────────────────────────────────────────────────┤
│ [white bg]                                            │
│                                                       │
│  I'm a state employee                                 │
│  What's happening with APERS investments            → │
│                                                       │
├─────────────────────────────────────────────────────┤
│ [cream bg]                                            │
│                                                       │
│  I want to get involved                               │
│  Sign the petition, contact legislators, volunteer  → │
│                                                       │
└─────────────────────────────────────────────────────┘
```

Alternating `--bg-primary` / `--bg-secondary` backgrounds. Generous vertical padding (3rem). Gold left border on hover. Each row is a single `<a>` element for full-row clickability.

### Section 4: Detailed Pathway Cards

Four cards for the secondary audiences: Teachers & Educators, Public Employees, Legislators & Staff, Journalists & Media. These ARE cards, but minimal: a thin gold top border, the audience name in Inter semibold, a two-line description in Source Serif, and a styled link. Two-column grid on desktop, stacked on mobile. Cream background cards on white section background.

### Section 5: About Block

Two short paragraphs from the current "What we're about" section. Cormorant Garamond H2 ("What we're about"), Source Serif body. Full-width max-width container (48rem). "Learn more about us" link in navy with gold underline on hover.

### Footer

See Footer section below.

---

## Navigation (`_includes/nav.html`)

### Desktop (>768px)

```
┌─────────────────────────────────────────────────────┐
│ [logo 44px]  The Issue  Evidence  Documents           │
│              Key Figures  Take Action  About    [☀/🌙]│
└─────────────────────────────────────────────────────┘
```

NO dropdowns. All links visible. Flat, single-row. Inter 0.9rem, weight 500. Active page indicated by gold underline (2px, offset 4px below text).

Sticky on scroll. Light mode: `--bg-secondary` background with subtle box-shadow on scroll. Dark mode: `--bg-secondary` (dark) with same shadow.

The "Investigation" and "Get Involved" dropdown groupings are REMOVED. Every page gets a direct top-level link. If the link count feels heavy, drop "Documents" and "Key Figures" from the main nav (they're accessible from the Evidence page and footer).

### Mobile (<768px)

Hamburger icon (three lines, Inter). Opens full-screen overlay: navy background, centered link list in cream Cormorant Garamond at 1.5rem. Close button top-right. Theme toggle at bottom of overlay.

---

## Footer (`_includes/footer.html`)

```
┌─────────────────────────────────────────────────────┐
│ [navy background, full width]                         │
│                                                       │
│  [logo 64px]        Evidence           info@          │
│  Arkansans for      Documents          arpensions.org │
│  Pension Integrity  The Issue                         │
│                     Take Action        A campaign of  │
│  Your money.        About              Little Rock    │
│  Zero analysis.     Methodology        Peace for      │
│  (gold, italic)     Glossary           Palestine      │
│                                                       │
│  ─────────────────── [gold hr] ──────────────────── │
│                                                       │
│  © 2026 Arkansans for Pension Integrity               │
│                  (cream, 0.8rem)                       │
└─────────────────────────────────────────────────────┘
```

Three columns. Left: branding. Center: site links. Right: contact + affiliation. Gold `<hr>` before copyright. All text cream on navy. Links get gold on hover.

---

## Audience Pages

Each audience page (`educators.md`, `public-employees.md`, `legislators.md`, `press.md`) gets a colored hero band at the top. Same height (~30vh), not full viewport.

| Page | Accent Color | Hero Text Color |
|------|-------------|-----------------|
| Educators | `--api-forest` (#224D36) | Cream |
| Public Employees | `--api-slate` (#5F7391) | Cream |
| Legislators | `--api-navy` (#1A3057) | Cream |
| Press | `--api-charcoal` (#1C1917) | Cream |

Hero structure: accent-colored background, page title in Cormorant Garamond cream, one-line subtitle in cream at 80% opacity. Below the hero, the page content renders on cream background in the standard content container (max-width 48rem, centered).

Add a CSS class system for this: `.hero-band`, `.hero-band--forest`, `.hero-band--slate`, `.hero-band--navy`, `.hero-band--charcoal`.

---

## Evidence Page (`evidence.md` / `evidence.html`)

The evidence page is the centerpiece of the site. Structure it as a dossier:

### Hero band
Navy background, "The evidence" in Cormorant Garamond cream, subtitle: "What 1,227 public records reveal about Arkansas pension fund investments."

### Agency sections
Each agency (ATRS, APERS, ASHERS, ASPRS, LOPFI) gets its own section:
- Agency name in Cormorant Garamond H2
- Document count badge in IBM Plex Mono (gold background, navy text, pill-shaped)
- Key finding in Source Serif italic with gold left border (3px)
- Expandable document list (collapsed by default, `<details>/<summary>` elements styled to match brand)

### Timeline
Keep the existing timeline component but restyle:
- Vertical line in navy (2px)
- Event dots: gold circles (8px) for standard events, red circles for concerning findings
- Event text in Inter, dates in IBM Plex Mono
- Left-right alternating layout on desktop, all-left on mobile

---

## Key Figures Page (`key-figures.md`)

Profile cards for key officials. Each card:
- Name in Inter semibold
- Title/role in Inter regular, gray
- Relevance summary in Source Serif (2-3 sentences)
- No photos (privacy-respecting, FOIA-based)
- Thin gold top border
- Cream card on white background

Two-column grid on desktop, stacked mobile.

---

## Take Action Page (`take-action.md`)

Three tiers of engagement, presented as large full-width sections:

**5 Minutes:** Sign the petition, share on social media.
**30 Minutes:** Contact your legislator (template provided), attend a meeting.
**Ongoing:** Volunteer, join the mailing list, follow the investigation.

Each tier gets a large Cormorant Garamond heading with the time commitment, then the specific actions as styled list items with gold bullet markers. CTAs are red buttons (`--api-red` background, white text).

---

## Component Patterns

### Buttons
```css
.btn-primary {
  background: var(--api-red);
  color: white;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: #9B1818; }

.btn-secondary {
  background: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-accent);
  /* same font/padding as primary */
}
.btn-secondary:hover { background: var(--api-gold); color: var(--api-navy); }

.btn-hero-primary {
  background: var(--api-gold);
  color: var(--api-navy);
  font-weight: 700;
  padding: 1rem 2rem;
  font-size: 1rem;
}

.btn-hero-secondary {
  background: transparent;
  color: var(--api-cream);
  border: 2px solid var(--api-cream);
  padding: 1rem 2rem;
  font-size: 1rem;
}
```

### Pull Quotes / Callouts
```css
.callout {
  border-left: 3px solid var(--api-gold);
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  background: rgba(203, 166, 72, 0.06);
  font-style: italic;
}
.callout cite {
  display: block;
  margin-top: 0.5rem;
  font-style: normal;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
}
```

### Stat Blocks
```css
.stat {
  text-align: center;
  padding: 2rem 1rem;
}
.stat-number {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--api-navy);
  line-height: 1;
  margin-bottom: 0.5rem;
}
.stat-number--danger { color: var(--api-red); }
.stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.4;
}
```

### Document Count Badge
```css
.doc-badge {
  display: inline-block;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.8rem;
  background: var(--api-gold);
  color: var(--api-navy);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-weight: 600;
}
```

---

## Responsive Breakpoints

```css
/* Mobile first */
/* Tablet: 768px */
/* Desktop: 1024px */
/* Wide: 1280px */

.container {
  max-width: 48rem;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.container--wide {
  max-width: 72rem;
}
```

---

## Animations & Transitions

Respect `prefers-reduced-motion` for ALL transitions. When motion is allowed:

- Nav scroll shadow: `box-shadow` transition 0.2s
- Link underlines: `background-size` transition 0.2s (animated underline via background-image trick)
- Button hover: `background` transition 0.2s
- Theme toggle: `opacity` transition 0.3s on logo crossfade
- Hero on load: fade in content with 0.4s delay (CSS only, no JS)
- Pathway rows on hover: gold left border slides in, 0.15s

NO parallax. NO scroll-triggered animations. NO JavaScript animation libraries. CSS transitions only. The content is serious. Motion should be functional, not decorative.

---

## Dark Mode

The theme toggle stays. Preserve the existing `data-theme="dark"` attribute pattern and localStorage persistence. The dark mode token overrides are defined in the Color Tokens section above.

Key differences in dark mode:
- Hero background: charcoal instead of navy (differentiates from nav)
- Logo switches to gold-stroke variant via opacity crossfade
- Gold accent stays gold (good contrast on both)
- Red stays red (already accessible on dark)
- Body text becomes cream on charcoal
- Cards become `--bg-secondary` (dark) on `--bg-primary` (dark)

---

## Files to Modify

### Must create or replace:
- `assets/css/main.css` — full rewrite of color tokens, may keep layout utilities
- `assets/css/elegant.css` — full rewrite or merge into main.css
- `_includes/nav.html` — new flat nav structure
- `_includes/footer.html` — new three-column footer
- `_includes/hero.html` — new full-viewport hero
- `_includes/stats-bar.html` — new typographic stats section
- `_includes/pathway-cards.html` — new full-width band design
- `_layouts/landing.html` — updated to use new includes
- `index.md` — front matter updates if needed
- `assets/images/og-default.png` — regenerate with new mark
- `assets/images/favicon.ico` — regenerate from mark
- `assets/images/favicon.svg` — regenerate from mark

### Must update (token rename + color values):
- All `.css` files: `--art-*` → `--api-*`
- All `.js` files: any `art-theme` localStorage keys → `api-theme`
- `_includes/head.html` — anti-FOUC inline styles, font links
- `_layouts/default.html` — if it references old tokens
- `_layouts/page.html` — audience hero band classes
- `_layouts/evidence.html` — dossier styling

### Do not modify:
- Content text in `.md` files (words are correct, only front matter if needed)
- `_config.yml` (already correct)
- `assets/documents/` (FOIA archive)
- `_data/` (data files)
- `robots.txt`, `llms.txt`, `sitemap` generation

---

## Acceptance Criteria

The redesign is complete when:

1. The homepage loads with a full-viewport navy hero, centered logo mark, headline, tagline, and two CTAs
2. All pages use the new `--api-*` color tokens with zero `--art-*` references remaining
3. The nav is flat (no dropdowns) on desktop with the new logo mark and gold active-page indicator
4. The footer is three-column on navy with gold accents
5. Dark mode works: charcoal backgrounds, cream text, gold accents, logo variant swap
6. Audience pages each have a distinct colored hero band
7. All text remains Source Serif 4 body, Cormorant Garamond display, Inter UI, IBM Plex Mono data
8. The site passes WCAG AA contrast checks on all color combinations
9. Mobile responsive: stacked layouts, hamburger nav, readable type sizes
10. No JavaScript animation libraries, no parallax, `prefers-reduced-motion` respected
11. Lighthouse performance score stays above 90
12. All existing internal links still work (no URL changes)

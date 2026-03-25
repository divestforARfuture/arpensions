---
sitemap: false
---

D4ARF Campaign Website — Claude Code Instructions

You are redesigning the Divest for AR Future (D4ARF) campaign website. The site is Jekyll + GitHub Pages, deployed at https://divestforarfuture.github.io.

## What This Is

D4ARF is a grassroots Arkansas campaign investigating Israel Bonds investments by state pension funds. The campaign has processed more than 1,200 government documents (1,222 total, 1,039 active after deduplication) through 8 FOIA requests to 4 state agencies, building a verified fact registry. The site is the public face of this investigation.

This is NOT a protest site. It's an evidence-driven, fiduciary accountability campaign — think investigative journalism meets civic engagement. ProPublica's rigor crossed with a well-run ballot initiative's energy.

## Audiences (Priority Order)

1. Arkansas educators (ATRS pension holders, ~140,000 members)
2. Arkansas public employees (APERS pension holders)
3. Journalists covering state government/pensions
4. Arkansas state legislators and staff
5. Allied organizations and coalition partners
6. General public / concerned taxpayers

## Voice & Tone

* Authoritative but accessible — not academic, not activist-shouty
* Evidence-first — every claim sourced, nothing speculative
* Measured — the facts are damning enough without hyperbole
* Arkansas-centered — this is about Arkansas pensions and Arkansas law, not foreign policy
* Empowering — visitors should feel they can do something concrete

What the site is NOT: a protest site, a boycott campaign, partisan, or anti-Israel. It's pro-fiduciary-process.

## Brand Identity

```css
--d4arf-red: #B91C1C;         /* Primary — action, urgency, Arkansas */
--d4arf-green: #166534;        /* Secondary — trust, growth */
--d4arf-accent: #0C7489;       /* Teal — links, borders, section markers */
--d4arf-accent-light: #E0F2F7; /* Teal highlight backgrounds */
--d4arf-black: #1b2127;        /* Text (warm near-black) */
--d4arf-white: #f8f7f5;        /* Background (warm off-white) */
--d4arf-gray: #556068;         /* Secondary text */
--d4arf-gray-light: #f0efec;   /* Section backgrounds (warm) */
--d4arf-border: #dee3e6;       /* Borders */
--d4arf-red-light: #FEE2E2;    /* CTA backgrounds */
--d4arf-green-light: #DCFCE7;  /* Success states */

/* Semantic tokens */
--color-text-primary: var(--d4arf-black);
--color-text-secondary: var(--d4arf-gray);
--color-bg-page: var(--d4arf-white);
--color-bg-panel: var(--d4arf-gray-light);
--color-bg-surface: #ffffff;
--color-link: var(--d4arf-accent);
--color-cta: var(--d4arf-red);
```

Fonts: Cormorant Garamond (editorial serif, headings and display text, weights 300/500 via `--font-elegant`) + Inter (body text and UI via `--font-body`) + IBM Plex Mono (data via `--font-mono`) via Google Fonts. The elegant redesign layer (`assets/css/elegant.css`) applies Cormorant Garamond sitewide for headings, hero, stats, pull quotes, and navigation title. Logo: assets/images/d4arf-logo.png (40x40 nav, 48x48 footer).

Design system: Teal (`--d4arf-accent`) is the primary accent color for borders, section markers, timeline dots, table headers, pull quotes, and interactive states. Red is reserved for semantic urgency: the "0" stat, `.btn-primary` (action/conversion), skip link, and mobile CTA bar. This restraint gives red genuine meaning when it appears.

Spacing tokens: `--space-xs` (0.25rem) through `--space-4xl` (6rem). Use these instead of ad-hoc values.

## Technical Constraints (Non-Negotiable)

1. Jekyll + GitHub Pages only. No custom plugins beyond what github-pages gem supports. No server-side logic. No Node.js build step.
2. Pico CSS is the base layer (CDN). Custom overrides in assets/css/main.css. Elegant redesign layer in assets/css/elegant.css (loaded after main.css, overrides by cascade).
3. No tracking. No Google Analytics, no Facebook Pixel, no third-party cookies. Deliberate privacy choice.
4. Content Security Policy is set in _includes/head.html. Update if adding new CDN sources.
5. WCAG AA accessibility. Semantic HTML, screen reader friendly, proper contrast. The current codebase has good a11y foundations — don't regress.
6. No external JS dependencies beyond what's already loaded. Keep it fast and minimal.

## CSS Architecture

Two CSS files:

* `assets/css/main.css` (~70KB) — Foundation layer. Pico CSS overrides, design tokens, dark mode tokens, all original component styles. Do not edit unless consolidating.
* `assets/css/elegant.css` (~18KB) — Redesign layer. Cormorant Garamond typography, theme-inverted hero, typographic stats bar, pure-text pathways, teal-dash section headings, refined header/footer, inner page component overrides. Loaded after main.css; overrides by cascade order.

Key CSS components:

* `.elegant-heading` — Cormorant weight 300 with teal dash above (centered variant: `.elegant-heading--center`)
* `.hero-ghost` — ghost watermark element, theme-adaptive opacity
* `.btn-primary-hero` / `.btn-secondary-hero` — hero-specific buttons with Cormorant font
* `.pathway-link` — pure text navigation links with thin rules
* `.role-link` — 2×2 text grid role cards
* `.stat` / `.stat-rule` / `.stat--zero` — typographic stat display
* All legacy components from main.css (`.evidence-card`, `.pull-quote`, `.issue-agency-table`, etc.) are restyled via elegant.css overrides

## Design Direction

The aesthetic: restrained elegance. LaTeX-inspired thin serifs (Cormorant Garamond weight 300), maximum whitespace, typography as the primary design element. The site should feel like a museum exhibition — the evidence is on display, and the design gets out of the way.

Key principles:

* Earn instant credibility — a journalist landing here should think "these people are serious" within 3 seconds
* Feel designed, not templated — the Cormorant/teal system is distinctive without being flashy
* Theme inversion — light mode gets dark hero, dark mode gets cream hero. Ghost watermark adapts.
* Drive action — every page makes it easy and compelling to do the next thing
* Handle complexity gracefully — dense evidence made scannable without dumbing it down
* Work flawlessly on mobile — many educators will see this on phones during lunch
* Load fast — minimal dependencies, no bloat, performant CSS

Teal is the dominant accent. Red appears only for urgency/action.

## Current Architecture

```
14+ pages, 4 layouts, 9+ includes
├── index.md              (default layout — hero, stats, pathways, about)
├── the-issue.md          (page layout — core explainer)
├── evidence.md           (page layout — key findings, timeline, legal standards)
├── take-action.md        (page layout — 5 action items)
├── educators.md          (landing layout — ATRS-specific with letter template)
├── public-employees.md   (landing layout — APERS-specific with letter template)
├── legislators.md        (landing layout — policy brief)
├── press.md              (page layout — press kit)
├── about.md              (page layout — mission, approach, FAQ)
├── documents.md          (page layout — FOIA document archive)
├── network.md            (network layout — D3 relationship graph)
└── news.md               (page layout — campaign milestones timeline)
```

## Key Facts for Content (Use These Numbers)

* Up to $100 million in authorized pension fund exposure (ATRS $50M deployed December 2025 + APERS up to $50M authorized, at least one purchase confirmed November 2025)
* $55 million in State Treasury holdings (separate entity, governed by Act 411)
* ~$155 million total authorized Arkansas exposure across all three agencies
* 1,222 public records analyzed across two FOIA rounds
* 8 FOIA requests across 2 rounds to 4 agencies (Treasury, ATRS, APERS, Auditor)
* 0 independent credit analyses found in the entire document corpus
* 3 major credit agencies downgraded Israel's rating
* The campaign's rhetorical core: Arkansas's own Act 710 says investments must use financial merit standards — the same standard should apply to purchases, not just divestment decisions

**Important:** Headlines and hooks use the $100M pension number (maps to the Pension Investment Transparency Act's legislative target). The $155M total appears in body text where the three-entity breakdown is explicit. Do not call the full $155M "pension fund exposure" — $55M of that is Treasury.

## Git Workflow

* Create a branch for each coherent design change
* Push and create a PR to main — an automated Claude Code review will run on the PR
* Do not commit directly to main (except for housekeeping like this CLAUDE.md setup)
* Write clear, descriptive commit messages and PR descriptions

## What "Done" Looks Like

Each PR should be a coherent, reviewable improvement:

* CSS changes that transform the visual feel
* A single page redesign
* A functional addition (copy buttons, print styles)
* A content update

Don't rewrite everything in one PR. Small, reviewable chunks.

## Website Current State (Post Elegant Redesign)

* **CSS architecture:** Two-layer system — main.css (foundation) + elegant.css (redesign overrides)
* **Homepage:** Cormorant Garamond hero with ghost watermark, theme-inverted (dark on light, cream on dark), typographic stats bar, pure-text pathway links, 2×2 role CTA grid, teal-dash section headings
* **Header:** Cormorant logo text, teal outline CTA button, weight-500 nav links
* **Footer:** Cormorant italic tagline, teal dashes on column headings
* **Inner pages:** Cormorant headings (h1–h3), teal table headers, teal pull quote borders with Cormorant italic, teal timeline dots, teal accent on all component borders
* **Color system:** Teal dominant accent; red reserved for urgency (zero stat, primary CTA, skip link, mobile CTA)

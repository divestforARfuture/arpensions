---
sitemap: false
---

D4ARF Campaign Website — Claude Code Instructions

You are working on the Divest for AR Future (D4ARF) campaign website. The site is Jekyll + GitHub Pages, deployed at https://divestforarfuture.github.io (custom domain: divestforarfuture.org).

## What This Is

D4ARF is a grassroots Arkansas campaign investigating Israel Bonds investments by state pension funds. The campaign has processed more than 1,200 government documents (1,222 total, 1,039 active after deduplication) through FOIA requests to 4 state agencies, building a verified fact registry. The site is the public face of this investigation.

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

**Content restrictions:** Never use the word "artifacts" or "AI" in any site content. Use "source materials," "documents," or "findings" instead. Do not reference the January 2025 ARPPP webinar in any public-facing content.

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
6. No external JS dependencies beyond what's already loaded (except network page — see below).

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
16+ pages, 4 layouts, 9+ includes
├── index.md              (default layout — hero, stats, pathways, about)
├── the-issue.md          (page layout — core explainer)
├── evidence.md           (page layout — findings 1-6 + 3a-3i, timeline, legal standards)
├── take-action.md        (page layout — 5 action items)
├── educators.md          (landing layout — ATRS-specific with letter template)
├── public-employees.md   (landing layout — APERS-specific with letter template)
├── legislators.md        (landing layout — policy brief + Transparency Act)
├── press.md              (page layout — press kit)
├── about.md              (page layout — mission, approach, FAQ)
├── documents.md          (page layout — FOIA document archive)
├── network.md            (network layout — Cytoscape.js relationship graph)
├── news.md               (page layout — campaign milestones timeline)
├── methodology.md        (page layout — research methodology)
└── llms.txt              (machine-readable site summary)
```

### Layouts

* `default.html` — Standard page wrapper (head, nav, content, footer)
* `page.html` — Extends default, adds page title/description
* `landing.html` — For audience-specific pages (educators, public-employees, legislators)
* `network.html` — Full-width layout for the interactive graph (escapes Pico container)

### Network page dependencies (network layout only)

The network page uses Cytoscape.js (not D3) with dagre and fcose layout plugins, plus Fuse.js for fuzzy search. All loaded via CDN with SRI hashes. Network-specific CSS in `assets/css/network.css`. Graph data in `assets/js/network-graph.json` (80 nodes, 176 links as of March 2026). Features: entity type filters, node search, pathfinding between entities, four guided narrative tours, dark mode support.

## Evidence Page Structure (as of PR #82, March 2026)

The evidence page is the most content-dense page on the site. Current section structure:

1. No independent credit analysis
2. Internal memo recommended against new purchases
3. Sales representatives met with agencies before authorizations
   - 3a. How Israel Bonds reached the APERS board
   - 3b. Board voted before staff had a contact
   - 3c. Two pension funds, two approaches — neither with independent analysis
   - 3d. Agencies were watching each other
   - 3e. The Auditor arranged a two-day pitch tour in his own office
   - 3f. ATRS deployed the full $50 million by December 2025
   - 3g. 37 pages of analysis for other investments, zero pages for Israel Bonds
   - 3h. ATRS leadership present at APERS authorization
   - 3i. Former Treasurer chaired the subcommittee that authorized Israel Bonds
4. Board Chair raised process concerns
5. Public statements confirmed political motivations
6. First-ever direct foreign sovereign debt

Plus: exposure bar chart (Chart.js), decision window timeline (ApexCharts), chronological timeline, legal standards section, action CTAs.

## Key Facts for Content (Use These Numbers)

* Up to $100 million in authorized pension fund exposure (ATRS $50M deployed December 2025 + APERS up to $50M authorized, at least one purchase confirmed November 2025)
* $55 million in State Treasury holdings (separate entity, governed by Act 411)
* ~$155 million total authorized Arkansas exposure across all three agencies
* 1,222 public records analyzed across two FOIA rounds
* 8 FOIA requests across 2 rounds to 4 agencies (Treasury, ATRS, APERS, Auditor)
* 0 independent credit analyses found in the entire document corpus
* 3 major credit agencies (Fitch, Moody's, S&P) downgraded Israel's rating — do not reduce to two
* The campaign's rhetorical core: Arkansas's own Act 710 says investments must use financial merit standards — the same standard should apply to purchases, not just divestment decisions
* APERS total fund: $11.58B (Q1 FY2025), 43,571 active members
* ATRS: $23.7B assets (crossed $24B), ~84% funded ratio, 9.8% FY2025 return
* Network graph: 80 entities, 176 relationships

**Important:** Headlines and hooks use the $100M pension number (maps to the Pension Investment Transparency Act's legislative target). The $155M total appears in body text where the three-entity breakdown is explicit. Do not call the full $155M "pension fund exposure" — $55M of that is Treasury.

**Key factual guardrails:**
- Act 411 (2023) applies ONLY to the Treasurer of State's investment evaluations — NOT pension boards, NOT divestment. Do not conflate with Act 710.
- Amy Fecher is APERS Executive Director (not "Jason Fecher"). Danny Knight is ATRS Chairman, not APERS.
- Rod Graves is ATRS Deputy Director (not APERS).
- Both ATRS and APERS 2025 authorizations were first-ever DIRECT purchases. Do not single out one.
- Brady cited Oklahoma, Louisiana, Texas, Mississippi as peer states — NOT Georgia.

## Git Workflow

* Create a branch for each coherent design change
* Push and create a PR to main — an automated Claude Code review will run on the PR
* Do not commit directly to main (except for housekeeping like this CLAUDE.md)
* Write clear, descriptive commit messages and PR descriptions

## What "Done" Looks Like

Each PR should be a coherent, reviewable improvement:

* CSS changes that transform the visual feel
* A single page redesign
* A functional addition (copy buttons, print styles)
* A content update

Don't rewrite everything in one PR. Small, reviewable chunks.

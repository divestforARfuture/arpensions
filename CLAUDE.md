---
sitemap: false
---

D4ARF Campaign Website — Claude Code Instructions

You are redesigning the Divest for AR Future (D4ARF) campaign website. The site is Jekyll + GitHub Pages, deployed at https://divestforarfuture.github.io.

## What This Is

D4ARF is a grassroots Arkansas campaign investigating Israel Bonds investments by state pension funds. The campaign has processed nearly 1,100 government documents (1,098 total, 909 unique after deduplication) through 8 FOIA requests to 4 state agencies, building a verified fact registry with ~105,000 entries. The site is the public face of this investigation.

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

Fonts: Lora (editorial serif, headings only) + Inter (body text and UI) + IBM Plex Mono (data) via Google Fonts. Logo: assets/images/d4arf-logo.png (40x40 nav, 48x48 footer).

Spacing tokens: `--space-xs` (0.25rem) through `--space-4xl` (6rem). Use these instead of ad-hoc values.

## Technical Constraints (Non-Negotiable)

1. Jekyll + GitHub Pages only. No custom plugins beyond what github-pages gem supports. No server-side logic. No Node.js build step.
2. Pico CSS is the base layer (CDN). Custom overrides in assets/css/main.css. Can build on top of it or consider replacing if it fights the design.
3. No tracking. No Google Analytics, no Facebook Pixel, no third-party cookies. Deliberate privacy choice.
4. Content Security Policy is set in _includes/head.html. Update if adding new CDN sources.
5. WCAG AA accessibility. Semantic HTML, screen reader friendly, proper contrast. The current codebase has good a11y foundations — don't regress.
6. No external JS dependencies beyond what's already loaded. Keep it fast and minimal.

## CSS Component Library

Key CSS components in `assets/css/main.css`:

* `.evidence-card` — teal-bordered finding card with citation footer
* `.pull-quote` — red-bordered quote with decorative open-quote mark
* `.section-label` — teal uppercase wayfinding label
* `.issue-agency-table` — red-header responsive data table (card-stacks on mobile)
* `.issue-demands` — numbered demand cards with red circles
* `.issue-symmetry` — gray panel for argumentative sections
* `.issue-red-flags` — red left accent bar on bold-lead paragraphs
* `.meeting-grid` — side-by-side info cards
* `.letter-template` — styled letter with copy button (`.letter-template--compact` variant)
* `.action-step` — numbered action card with effort-tier labels
* `.action-nav` — pill-style jump navigation for action steps
* `.action-tier-label` — effort tier badges (`--quick`, `--medium`, `--ongoing`)
* `.timeline-wrapper` + `.timeline` — vertical timeline with year headers and highlight dots
* `.evidence-timeline` — simpler vertical timeline (evidence page)
* `.press-quotes` — pull-quote collection for press kit
* `.press-resources` — compact reference/download card
* `.callout` — bordered highlight box

## Design Direction

The aesthetic direction: editorial/investigative journalism meets civic engagement.

Key principles:

* Earn instant credibility — a journalist landing here should think "these people are serious" within 3 seconds
* Feel designed, not templated — distinctive enough that it doesn't look like every other Jekyll site
* Drive action — every page makes it easy and compelling to do the next thing
* Handle complexity gracefully — dense evidence made scannable without dumbing it down
* Work flawlessly on mobile — many educators will see this on phones during lunch
* Load fast — minimal dependencies, no bloat, performant CSS

Red is the dominant accent (D4ARF brand + Arkansas's color), with restrained green for trust/success signals.

## Current Architecture

```
11 pages, 4 layouts, 9 includes
├── index.md              (default layout — hero, stats, pathways, about)
├── the-issue.md          (page layout — core explainer)
├── evidence.md           (page layout — key findings, timeline, legal standards)
├── take-action.md        (page layout — 5 action items)
├── educators.md          (landing layout — ATRS-specific with letter template)
├── public-employees.md   (landing layout — APERS-specific with letter template)
├── legislators.md        (landing layout — policy brief)
├── press.md              (page layout — press kit)
├── about.md              (page layout — mission, approach, FAQ)
└── news.md               (page layout — campaign milestones timeline)
```

## Key Facts for Content (Use These Numbers)

* $155 million total Arkansas exposure to Israel Bonds across 3 agencies
* 1,098 public records analyzed across two FOIA rounds
* 8 FOIA requests across 2 rounds to 4 agencies (Treasury, ATRS, APERS, Auditor)
* 0 independent credit analyses found in the entire document corpus
* 3 major credit agencies downgraded Israel's rating
* The campaign's rhetorical core: Arkansas's own Act 710 says investments must use financial merit standards — the same standard should apply to purchases, not just divestment decisions

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

## Website Current State (Post Redesign PRs)

* **CSS foundation:** spacing tokens, Inter body text, Lora headings, color token consistency, dark mode support
* **Homepage:** refined hero with $155M anchor stat, elevated stats bar with provenance annotation
* **Evidence page:** section labels, evidence cards, sub-finding grouping
* **Legislators page:** policy brief treatment with elevated provisions
* **Audience pages:** refined letter templates, action steps, meeting info
* **The-issue page:** component classes applied, section labels, symmetry pull quote
* **Take-action page:** meeting grid, jump navigation, Transparency Act reference
* **Press page:** vertical timeline, pull-quote components, download section

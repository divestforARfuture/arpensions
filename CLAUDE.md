# Arkansans for Retirement Transparency (ART) — Campaign Website

> **Live site:** [arpensions.org](https://arpensions.org)

This is the public-facing campaign website for Arkansans for Retirement Transparency, a grassroots Arkansas initiative investigating state pension fund investments in non-marketable foreign sovereign debt.

## Quick Reference

| Item | Value |
|------|-------|
| Domain | arpensions.org |
| Stack | Jekyll + GitHub Pages + Pico CSS v2 |
| Email | info@arpensions.org |
| Organization | Arkansans for Retirement Transparency (ART) |
| Tagline | Your Retirement. Your Right to Know. |

## Site Structure

```
/                    # Home (hero + stats + pathway cards)
/the-issue/          # Core fiduciary argument
/evidence/           # FOIA findings + timeline
/network/            # D3 force graph of relationships
/documents/          # FOIA document archive
/educators/          # ATRS-specific content
/public-employees/   # APERS-specific content
/legislators/        # Transparency Act + 2027 session
/press/              # Press kit + media resources
/take-action/        # CTAs by time commitment
/about/              # FAQ + campaign info
/news/               # Updates + coverage
/methodology/        # Research methodology
/glossary/           # Investment profile + terminology
```

## Brand System

**Colors:**
- Primary red: `#B91C1C` (accent, CTAs)
- Teal: `#0C7489` (links, secondary accent)
- Near-black: `#1b2127` (text)
- Warm off-white: `#f8f7f5` (backgrounds)
- Gray: `#556068` (secondary text)

**Typography:**
- Display: Lora Bold
- Body: Inter
- Data/mono: IBM Plex Mono

**Logo:** "ART" wordmark — Cormorant Garamond Medium (500) glyph outlines with red underline bar. Extracted via fonttools from CormorantGaramond-Medium.ttf (SIL OFL). Two variants: `art-logo.svg` (light, #1b2127) and `art-logo-dark.svg` (dark, #f8f7f5). ViewBox: 0 0 1994 747.

**CSS custom properties:** All use `--art-*` prefix (e.g. `--art-red`, `--art-accent`). Renamed from `--d4arf-*` in PR #4.

## Development

**Local build:**
```bash
bundle install
bundle exec jekyll serve
```

**Key files:**
- `_config.yml` — site configuration
- `_includes/` — nav, footer, head, components
- `_layouts/` — default, page, post, landing
- `assets/css/main.css` — core styles (~71KB, `--art-*` tokens)
- `assets/css/elegant.css` — design layer (~33KB)
- `assets/js/` — nav, theme toggle, animations

## Content Guidelines

1. **Fiduciary-first framing** — financial merit and legal standards, not political arguments
2. **Source everything** — every factual claim must trace to a FOIA document
3. **Issuer-neutral language** — all campaign-voice content uses financial terminology ("non-marketable foreign sovereign debt," "non-tradable sovereign bonds," "the bonds under investigation") rather than naming the bond issuer. Official quotes stay verbatim with "From the public record:" prefix. The glossary page (`/glossary/`) explains the approach and provides the financial profile. See `REFRAME-INSTRUCTIONS.md` for the complete terminology table.
4. **No BDS self-identification** — this is a transparency and accountability campaign
5. **Current data only** — keep stats updated (ATRS: $23.7B, ~84% funded; APERS: $11.82B, ~84% funded)
6. **Corpus state** — 1,227 total documents from 5 agencies (1,044 active after dedup); 11 FOIA requests across 3 rounds to 7 state entities; LOPFI response pending

## Accessibility

- WCAG AA compliance target
- Skip links, semantic HTML, ARIA labels
- Dark mode support with opacity-based logo crossfade
- Keyboard navigation
- Focus indicators
- `prefers-reduced-motion` respected for all transitions
- `aria-hidden` managed dynamically on inactive logo variants

## Campaign Affiliation

Arkansans for Retirement Transparency operates as a campaign of Little Rock Peace for Palestine, a member organization of Citizens First Congress.

---

## Audit Log — March 27, 2026

### PR #2: Critical structural fixes

**CRITICAL-1 — Nav HTML/CSS mismatch:** `nav.html` had been restructured with CSS classes that had zero definitions. Reverted to reference site structure with ART brand changes only.

**CRITICAL-2 — Dark mode broken:** Theme toggle button missing `id` attribute + localStorage key mismatch (`art-theme` vs `d4arf-theme`). Both fixed.

**MEDIUM — robots.txt:** Restored OAI-SearchBot and PerplexityBot allow rules.

**LOW:** Removed unused d4arf-logo PNG files.

### PR #3: Logo replacement

Replaced hand-drawn geometric SVG with Cormorant Garamond Medium (500) glyph outlines extracted via fonttools. Red underline bar height set to 55 units (renders ~2px at nav size). Trailing newlines added to all files.

### PR #4: Theme polish + CSS rename

**Logo crossfade:** Changed from `display:none/block` to `opacity:0/1` with absolute positioning. Eliminates layout shift during toggle and between-page logo flash.

**Anti-FOUC inline style:** Expanded to cover logo stacking, pointer-events, and explicit opacity values.

**CSS rename:** Full `--d4arf-*` → `--art-*` custom property rename across all 5 CSS files.

**JS improvements:** `prefers-reduced-motion` guard skips `theme-transition` class entirely. `updateLogoAria()` manages `aria-hidden` on inactive logo. Uses `removeAttribute` (not `"false"`).

**Print URL:** `divestforarfuture.github.io` → `arpensions.org`.

### PR #5: Final comment cleanup

Renamed "D4ARF" → "ART" in source code comments: `charts.js` line 2, `network.css` line 3, `network.js` line 2.

### Known remaining items

- `og-default.png` still shows D4ARF branding — needs design work
- `favicon.ico` still shows D4ARF branding — needs design work

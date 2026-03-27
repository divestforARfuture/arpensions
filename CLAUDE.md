# Arkansans for Retirement Transparency (ART) — Campaign Website

> **Live site:** [arpensions.org](https://arpensions.org)

This is the public-facing campaign website for Arkansans for Retirement Transparency, a grassroots Arkansas initiative investigating Israel Bonds investments by state pension funds.

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

**Logo:** "ART" wordmark with red underline on the A

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
- `assets/css/main.css` — core styles
- `assets/css/elegant.css` — design layer
- `assets/js/` — nav, theme toggle, animations

## Content Guidelines

1. **Fiduciary-first framing** — financial merit and legal standards, not political arguments
2. **Source everything** — every factual claim must trace to a FOIA document
3. **Issuer-neutral for legislation** — "Pension Investment Transparency Act"
4. **No BDS self-identification** — this is a transparency and accountability campaign
5. **Current data only** — keep stats updated (ATRS: $23.7B, ~84% funded; APERS: $11.82B, ~84% funded)

## Accessibility

- WCAG AA compliance target
- Skip links, semantic HTML, ARIA labels
- Dark mode support
- Keyboard navigation
- Focus indicators

## Campaign Affiliation

Arkansans for Retirement Transparency operates as a campaign of Little Rock Peace for Palestine, a member organization of Citizens First Congress.

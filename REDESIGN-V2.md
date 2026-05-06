# REDESIGN ITERATION 2 — Claude Code Prompt

Read `CLAUDE.md` and `REDESIGN-SPEC.md` before starting. This prompt supersedes any conflicting instructions in those files.

## Context

The first redesign PR landed on `main` but only touched the homepage layout (`landing.html`). Every other page (about, take-action, educators, public-employees, legislators, press, evidence, documents, key-figures, glossary, methodology, news) is still running the old ART-era design with dropdown nav, old SVG logos, old footer, old brand name, and stale content. This iteration completes the redesign across the entire site and fixes critical content errors.

The campaign has rebranded. The focus is now exclusively on passing the **Pension Investment Transparency Act (PITA)** in the 2027 Arkansas legislative session. The campaign does NOT pressure pension boards to divest, pause, or change their investment decisions. The campaign does NOT identify as part of the BDS movement. The campaign has NO public affiliation with Little Rock Peace for Palestine or any other organization. Every trace of board-pressure language, divestment framing, and organizational affiliation must be removed.

## Assets available in the repo

These files are already in `assets/images/`:
- `api-logo-mark.png` — Arkansas state outline with semi-transparent Capitol photo inside, navy stroke. For light backgrounds.
- `api-logo-mark-dark.png` — Same mark, gold stroke. For dark backgrounds.
- `capitol-hero.jpg` — Full Arkansas State Capitol photo (2560x1027). For hero background.

These files are LEGACY and should no longer be referenced anywhere:
- `api-logo.svg` — old "API" lettermark SVG
- `api-logo-dark.svg` — old dark-mode lettermark SVG
- `art-logo.svg` — ancient ART-era logo (should not exist, but search for references)
- `art-logo-dark.svg` — ancient ART-era dark logo

## Commit sequence

### Commit 1: Extend redesign to all layouts + logo swap

Apply the flat nav, three-column navy footer, and `--api-*` color tokens to ALL layouts: `_layouts/page.html`, `_layouts/evidence.html`, `_layouts/post.html`, and any other layout file. Every page on the site must use the same nav and footer as the homepage.

**Nav logo swap:** In `_includes/nav.html`, replace all `api-logo.svg` / `api-logo-dark.svg` / `art-logo.svg` / `art-logo-dark.svg` references with:
```html
<img src="/assets/images/api-logo-mark.png" alt="Arkansans for Pension Integrity" class="logo logo-light" width="44" height="44">
<img src="/assets/images/api-logo-mark-dark.png" alt="Arkansans for Pension Integrity" class="logo logo-dark" width="44" height="44">
```
The marks are square (1:1 aspect ratio). Render at 44x44 in nav.

**Hero logo swap:** In `_includes/hero.html`, use the dark-mode mark (gold stroke) at 200x200 centered above the headline:
```html
<img src="/assets/images/api-logo-mark-dark.png" alt="Arkansans for Pension Integrity" width="200" height="200">
```

**Footer logo swap:** In `_includes/footer.html`, use the dark-mode mark at 64x64:
```html
<img src="/assets/images/api-logo-mark-dark.png" alt="Arkansans for Pension Integrity" width="64" height="64">
```

**Footer: Remove ALL organizational affiliation.** Delete "A campaign of Little Rock Peace for Palestine, a member of Citizens First Congress" from the footer entirely. The footer should say "Arkansans for Pension Integrity" with the tagline, nav links, and contact email. No parent organization. No coalition membership. No affiliation line.

**Footer copyright:** Must read "© 2026 Arkansans for Pension Integrity"

### Commit 2: Capitol hero background

Set `assets/images/capitol-hero.jpg` as the hero section background:

```css
.hero {
  background-image: url('/assets/images/capitol-hero.jpg');
  background-size: cover;
  background-position: center 30%;
  position: relative;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--api-navy);
  opacity: 0.78;
  z-index: 1;
}
.hero > * {
  position: relative;
  z-index: 2;
}
```

The hero should show the Capitol building ghosted through a navy overlay. The logo mark, headline ("Up to $100M in pension fund exposure. Zero independent analyses."), tagline ("They're messing with your money."), and CTA buttons sit on top of the overlay. The effect should feel like standing in front of the Capitol with the campaign message in your face.

### Commit 3: Brand name find-and-replace across all content

Search ALL `.md` files and ALL `_includes/*.html` files:

| Find | Replace with |
|------|-------------|
| Arkansans for Retirement Transparency | Arkansans for Pension Integrity |
| (ART) | (API) |
| ART is a grassroots | API is a grassroots |
| ART operates | API operates |
| Your Retirement. Your Right to Know. | They're messing with your money. |

Also search for any remaining references to `art-logo`, `art-theme`, `--art-` in HTML/JS files that weren't caught in the first PR.

Update `_config.yml` description field to: "Arkansas pension funds authorized up to $100 million in non-tradable foreign sovereign debt without independent analysis. We're pushing for pension transparency legislation in 2027."

### Commit 4: Remove ALL board pressure language — pivot to PITA

This is the most important content change. The campaign does NOT ask pension boards to pause, divest, or change their investment decisions. The campaign asks the legislature to pass the Pension Investment Transparency Act.

**`take-action.md` — full rewrite of trustee section:**

Remove the entire "Write to pension trustees" section including all template emails to ATRS and APERS trustees. Remove any language asking people to "pause execution," "halt purchases," or pressure boards in any way.

Replace with a section focused entirely on contacting legislators about PITA. The template letter should go to state legislators, not trustees:

```
Dear [Representative/Senator],

As an Arkansan whose retirement is managed by a state pension fund, I'm writing to ask you to support the Pension Investment Transparency Act in the 2027 legislative session. This legislation would require independent credit analysis before pension funds commit to non-tradable sovereign debt, ensuring investment decisions are based on financial merit.

Our pension funds authorized up to $100 million in non-tradable foreign sovereign bonds without producing a single independent credit analysis. The Pension Investment Transparency Act would close this gap by requiring the same documented due diligence for sovereign debt that already applies to other investment classes.

This is not a partisan issue. Sound fiduciary standards protect every Arkansan whose retirement depends on these funds.

Sincerely,
[Your name, city]
```

**`about.md` — rewrite "What we're asking for" section:**

Remove demand #1 ("Pause new purchases"). Replace the four demands with:

1. **Pension transparency legislation** — Support the Pension Investment Transparency Act for the 2027 session, requiring independent credit analysis, consultant independence, liquidity risk disclosure, and documented financial rationale before pension boards commit members' retirement funds to non-tradable sovereign debt.
2. **Transparency** — Publish the financial analysis that justifies these investments, comparing risk, return, and liquidity against comparable alternatives.
3. **Process review** — Document and explain how recent authorizations complied with Arkansas's pecuniary-only standard and the established manager-driven investment process.

Remove any "pause" language from the FAQ answers. The "Are you calling for a boycott?" FAQ answer should be updated to: "No. We are not asking pension boards to buy or sell any specific investment. We are asking the Arkansas legislature to require independent credit analysis before pension funds commit to non-tradable sovereign debt. The Pension Investment Transparency Act would establish the same documented due diligence standard for sovereign debt that already applies to other investment classes."

**Search all `.md` files** for "pause," "halt," "divest," "divestment," "boycott" in campaign-voice text and remove or reframe toward legislation.

### Commit 5: Remove all organizational affiliation

Search all `.md` files and `_includes/*.html` for:
- "Little Rock Peace for Palestine"
- "LRPP"
- "Citizens First Congress"
- "community organizations in central Arkansas"
- Any reference to a parent organization or coalition membership

Remove all of these. The about page contact section should end with: "Arkansans for Pension Integrity (API) is a grassroots Arkansas campaign for pension transparency and fiduciary accountability."

No parent org. No coalition. No affiliation.

### Commit 6: LOPFI and corpus state update

In `the-issue.md`, `about.md`, and any other page referencing LOPFI:

Change "LOPFI response still pending" or "LOPFI response pending" to:

"LOPFI confirmed no responsive records and no current holdings of the bonds under investigation (April 9, 2026). LOPFI manages its own investments independently with approximately $3.15 billion under management."

The five-agency summary across the site should now read:
- **ATRS:** Produced records across 3 FOIA rounds. Authorized $50M, fully deployed December 2025.
- **APERS:** Produced records across 3 FOIA rounds. Authorized $25–50M, purchase confirmed November 2025.
- **ASHERS:** 5 documents produced (Round 3). Bond issuer's sales leadership pitched ASHERS; ASHERS declined to invest.
- **ASPRS:** No responsive records. Assets commingled with APERS for investment purposes under Act 1242 of 2009.
- **LOPFI:** No responsive records, no current holdings (April 9, 2026). LOPFI manages investments independently; no documentation of contact with the bond issuer.

Update corpus count language: "All five agencies have responded. Total corpus: 1,227 documents across five agencies, three FOIA rounds."

Remove "LOPFI response pending" from everywhere.

### Commit 7: Fix Act 411/Act 498 statute error

On `educators.md`, the paragraph citing "The Protecting Arkansas Investments Act (Act 411 of 2023)" and claiming pension boards "are not yet covered by an equivalent procedural standard" is **factually wrong**.

**Act 498 of 2023** (HB1253, the State Government Employee Retirement Protection Act, Ark. Code §§ 24-2-801–806) DOES cover pension boards with the pecuniary-factors standard. It defines "pecuniary factor" at § 24-2-802(4)(A) and requires pension board investment evaluations to be based "only on pecuniary factors" at § 24-2-804(a). It reaches ATRS, APERS, ASHERS, ASPRS, and LOPFI through the categorical definition at § 24-2-802(3).

**Act 411 of 2023** (HB1307, §§ 25-1-1001–1007) is a DIFFERENT law that applies ONLY to the State Treasurer. It addresses ESG factors in Treasury investments. It does NOT apply to pension boards.

Fix: Replace the Act 411 citation with Act 498. Remove the claim that pension boards lack a procedural standard — they have one under Act 498. The Pension Investment Transparency Act (PITA) would add PROCEDURAL SPECIFICITY onto Act 498's existing standard (requiring independent credit analysis, consultant independence, etc.).

Check `public-employees.md` and `legislators.md` for the same error.

### Commit 8: Issuer-neutral language audit

Search all `.md` files for these terms in campaign-voice text (NOT inside "From the public record:" quoted blocks):
- "Israel Bonds"
- "Israeli Jubilee"
- "Israel's"
- "Israeli"
- "State of Israel"
- "Israel" (when used as the bond issuer in campaign voice)

Replace with issuer-neutral alternatives per the content guidelines:
- "non-marketable foreign sovereign debt"
- "non-tradable sovereign bonds"
- "the bonds under investigation"
- "the issuing country" (for credit rating context)
- "the bond issuer" or "the issuer's broker-dealer" (for DCI context)

**Keep verbatim quotes from public records intact.** These must be prefixed with "From the public record:" where not already prefixed. Direct quotes from FOIA documents, board minutes, official statements, and correspondence retain the original language including "Israel Bonds" — because those are factual references to what was said, not campaign voice.

Template letters on the take-action page must NOT name the issuer. Use "non-tradable sovereign bonds" or "non-tradable foreign sovereign debt" instead.

### Commit 9: Final audit pass

After all changes:
1. Grep the entire repo for "Retirement Transparency" — zero results expected
2. Grep for "Little Rock Peace" — zero results expected  
3. Grep for "art-logo" — zero results in HTML/includes expected
4. Grep for "LOPFI.*pending" — zero results expected
5. Grep for "pause.*purchase" or "halt.*purchase" in campaign voice — zero results expected
6. Grep for "Act 411" in educator/employee pages — should only appear in correct Treasury context, never claiming it covers pension boards
7. Verify every page has the flat nav with PNG logo marks
8. Verify every page footer says "Arkansans for Pension Integrity" with no affiliation line

Fix anything that fails these checks. Commit as cleanup.

## Acceptance criteria

The redesign is complete when:

1. Every page on the site uses the new flat nav with the PNG logo marks at 44x44
2. Every page footer says "Arkansans for Pension Integrity" with NO organizational affiliation
3. The homepage hero shows the Capitol building through a navy overlay with the logo mark, headline, tagline, and CTAs on top
4. Zero references to "Arkansans for Retirement Transparency" or "(ART)" anywhere on the site
5. Zero references to "Little Rock Peace for Palestine," "LRPP," or "Citizens First Congress" anywhere
6. Zero board-pressure language ("pause purchases," "halt investments," "write to trustees to stop")
7. Take-action page focuses entirely on contacting legislators about PITA
8. LOPFI status reads "no responsive records, no current holdings" everywhere
9. Act 498 is correctly cited as the pension board pecuniary-factors statute; Act 411 correctly limited to Treasury
10. Issuer-neutral language in all campaign-voice text; verbatim quotes preserved with proper prefix
11. Dark mode works: charcoal backgrounds, cream text, gold accents, dark-mode logo variant
12. WCAG AA contrast passes on all color combinations
13. Mobile responsive: stacked layouts, hamburger nav, readable type sizes
14. No broken internal links

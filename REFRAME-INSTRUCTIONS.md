# REFRAME-INSTRUCTIONS.md
# Issuer-Neutral Language Reframe for arpensions.org
# Mission Briefing for Claude Code Desktop

> **This file is the complete, self-contained instruction set for rewriting arpensions.org to remove all campaign-voice references to the specific bond issuer.** Claude Code should read this file in its entirety before beginning any work. Every decision has been made. Execute precisely.

---

## Executive Summary

The arpensions.org website (repo: `divestforARfuture/arpensions`) currently contains ~400+ mentions of "Israel Bonds," "Israeli," "Israel," "DCI," and "Development Corporation for Israel" across 25 files. The site is being reframed to use issuer-neutral financial terminology in all campaign-voice content.

**The core principle:** The campaign describes financial characteristics. The FOIA documents reveal the issuer. Official quotes stay verbatim because they ARE the evidence of political motivation. The campaign never says the issuer's name — the documents do.

**arpensions.org is a prototype that has not been publicly launched.** There is no existing audience, no cached content, no SEO equity to preserve. Build it right from the start.

---

## The 7 Locked Decisions

These decisions are final. Do not deviate.

| # | Decision | Answer |
|---|----------|--------|
| 1 | Document titles on /documents/ | **Neutralize everything.** ART starts clean. Even document descriptions use neutral language. The PDFs themselves say what they say when someone clicks through. |
| 2 | Historical news entries | **Retroactively update all entries to neutral language.** No public history exists. Write it right from day one. |
| 3 | Official quotes (Sanders, Walther, Brady, etc.) | **Keep ALL verbatim** with explicit "From the public record:" framing prefix. The officials' own words are the evidence. The campaign's surrounding text goes neutral. |
| 4 | Network graph entity names | **Neutralize node labels.** "Israel Bonds / DCI" → "Bond Issuer / Broker-Dealer." Entity names in graph data that come from FOIA documents get neutralized in the visualization layer. |
| 5 | FAQ "What are Israel Bonds?" | **Becomes "What investment are we investigating?"** — answer directs to the glossary page. |
| 6 | Press page timing | **Reframe simultaneously with everything else.** ART has no journalist relationships built around current language. The press page becomes a journalist bridge with a "Background: The specific instrument" section near the bottom. |
| 7 | Letter templates | **Neutral language + link to glossary.** Templates include: "For the specific instrument identified in our FOIA investigation and the full financial profile, see arpensions.org/glossary." No parenthetical naming. |

---

## Terminology Replacement Table

Use these replacements consistently across all files. When multiple options are listed, choose based on context and sentence flow — avoid repeating the same phrase in consecutive sentences.

| Context | REMOVE | REPLACE WITH |
|---------|--------|-------------|
| General reference | "Israel Bonds" | "non-marketable foreign sovereign debt" / "non-tradable sovereign bonds" / "the bonds under investigation" / "these bonds" |
| First mention on a page | "Israel Bonds" | "non-marketable foreign sovereign debt — bonds issued by a foreign government that cannot be sold on any secondary market" |
| Instrument description | "Israel Bonds are direct loans to the Israeli government" | "These are direct loans to a foreign government — bonds that cannot be sold on any secondary market before maturity" |
| Issuer organization | "Development Corporation for Israel (DCI)" | "the bond issuer" / "the issuer's broker-dealer (FINRA CRD# 11148)" / "the for-profit broker-dealer registered with FINRA" |
| Issuer representatives | "Israel Bonds representatives" / "Israel Bonds executives" | "bond issuer's sales representatives" / "the issuer's national sales leadership" |
| Specific product name | "Israel Bonds" as product | "these non-tradable sovereign bonds" / "the bonds" |
| In FOIA document quotes | Keep verbatim — attribute with "From the public record:" | No change to quote text. Add framing prefix. |
| Official political quotes | "Arkansas stands with Israel" etc. | Keep verbatim — these ARE the evidence. Prefix with "From the public record:" |
| Chart/graph labels | "Israel Bonds exposure" | "Non-tradable sovereign debt exposure" / "Authorized sovereign bond exposure" |
| Page titles & HTML meta | titles containing "Israel Bonds" | Replace with neutral financial terminology |
| Letter templates | "Israel Bonds" | "non-tradable sovereign bonds" + glossary link |
| Timeline entries | "Israel Bonds" in campaign-authored timeline text | Neutral language; keep verbatim in attributed quotes |
| FAQ answers | "Israel Bonds" | "the bonds under investigation" / "these non-tradable sovereign bonds" / direct to glossary |
| Network graph nodes | "Israel Bonds / DCI" | "Bond Issuer / Broker-Dealer" |
| Sankey diagram nodes | "Israel Bonds / DCI" | "Bond Issuer / Broker-Dealer" |
| Structured data (JSON-LD) | "Israel Bonds" in schema.org markup | Neutral terminology; keep FINRA CRD# for specificity |
| aria-labels | "Israel Bonds" in accessibility text | Neutral financial terminology |

### Terminology hierarchy (formal → casual):
1. **Most formal (legislators, press):** "non-marketable sovereign securities issued by a foreign state"
2. **Standard (evidence, the-issue):** "non-marketable foreign sovereign debt" or "non-tradable sovereign bonds"
3. **Accessible (educators, public-employees):** "bonds issued by a foreign government that cannot be sold on any market" or "non-tradable government bonds"
4. **Shorthand (after first mention on a page):** "the bonds" / "these bonds" / "the investment"

### What NEVER changes:
- Verbatim quotes from officials (Sanders, Walther, Brady, Milligan, Berman, etc.) — these stay exact
- Verbatim quotes from FOIA documents — these stay exact
- Arkansas statute citations and legal language
- Dollar amounts, dates, agency names (ATRS, APERS, Treasury, Auditor)
- People's names and titles
- FINRA CRD# 11148 (this is a neutral identifier)
- The phrase "Pension Investment Transparency Act" (already issuer-neutral)

---

## Factual Guardrails

These are non-negotiable accuracy requirements. Violating any of these undermines campaign credibility.

- **Act 411 (2023)** applies ONLY to the Treasurer of State's investment evaluations. NOT pension boards. NOT divestment. Act 710 covers divestment. Do not conflate.
- **APERS's $25–50M** authorization was its **first-ever** direct purchase of this instrument, not a resumption.
- **ATRS's $50M** authorization was also its **first-ever direct** purchase — the 2017 $390K was indirect via commingled fund.
- **Three** credit agencies downgraded the issuing country (Fitch, Moody's, S&P) — never reduce to two.
- **Amy Fecher** is APERS Executive Director (not "Jason Fecher"). **Danny Knight** is ATRS Chairman, not APERS.
- The pension fund commitment is up to **$100M** (APERS + ATRS combined); the **$55M** Treasury exposure is a separate entity. Do not conflate.
- **~$155M total authorized exposure** across all three agencies — use this number only when the three-entity breakdown is explicit.
- Do NOT cite the "F" grade or attribute it to the Reason Foundation.
- Do NOT use the words "artifacts" or "AI" in any site content.
- Do NOT reference the January 2025 ARPPP webinar in any content.
- LRPP holds the CFC delegate slots, not D4ARF/ART.
- **Updated counts (post-ASHERS ingestion):**
  - Total documents: **1,227** (not 1,222)
  - Active after dedup: **1,044** (not 1,039)
  - Agencies with FOIA responses: **5** (ATRS, APERS, Treasury, Auditor, ASHERS)
  - Total retirement systems contacted: **6** (add ASPRS null result, LOPFI pending)
  - FOIA rounds: **3** (not 2)
  - FOIA requests filed: **11** (not 8)
  - Use "more than 1,200" for general audiences; "1,227" for technical/evidence pages

---

## PR Sequence

Execute these in order. Each PR should be a single coherent commit or small set of commits on a feature branch. Run `bundle exec jekyll build` after every set of changes to verify the site builds. Run `grep -ri "israel bond" .` (case-insensitive) after each PR to verify removal progress.

### PR 0 — Data Updates Only (NO reframing)
**Branch:** `update/ashers-ingestion-march2026`
**Purpose:** Update document counts, agency counts, add ASHERS/ASPRS/LOPFI information, add March 28 news entry. Ship immediately. No language reframing.

**Files to update:**
- `_includes/hero.html` — "four state agencies" → "five state agencies"; "1,222" → "1,227" if it appears
- `_includes/stats-bar.html` — "1,222 public records" → "1,227 public records"
- `index.md` — front matter description: "four" → "five"; body: "four Arkansas state agencies" → "five"
- `about.md` — "two completed rounds to four Arkansas state agencies" → update to mention three rounds, five agencies, ASHERS response, ASPRS null result
- `documents.md` — "1,222 documents" → "1,227"; "four Arkansas state agencies" → "five"; add Round 3 section
- `evidence.md` — front matter title: "1,222" → "1,227"; front matter description: "four" → "five"; body: update counts
- `methodology.md` — "8 FOIA requests across 2 rounds to 4 agencies" → "11 requests across 3 rounds to 7 state entities"; "1,222 documents" → "1,227"; add Round 3 line
- `press.md` — update key statistics table: "1,222" → "1,227"; "4" agencies → "5"
- `news.md` — add March 28 entry at top of 2026 section
- `llms.txt` — "four state agencies" → "five"
- `CLAUDE.md` — update corpus state numbers

**News entry to add (March 28):**
```
**March 28** — ASHERS (Arkansas State Highway Employees' Retirement System) delivered FOIA Round 3 response — 5 documents including email correspondence revealing that the bond issuer's national sales leadership was introduced to ASHERS staff through the same April 2025 pitch tour, but ASHERS declined to invest. ASPRS (Arkansas State Police Retirement System) confirmed no responsive documents — assets commingled with APERS under Act 1242 of 2009. LOPFI response still pending. Investigation corpus now covers 5 state agencies with 1,227 total documents (1,044 active after deduplication).
```

**Verification:** `grep -c "four.*agenc" *.md _includes/*.html` should return 0 after this PR.

---

### PR 1 — Foundation: Glossary Page + Terminology Data
**Branch:** `reframe/foundation`
**Purpose:** Create the SEO bridge page and terminology data file before touching any existing content.

**Create new file: `glossary.md`**
```markdown
---
layout: page
title: "Glossary — The Investment Under Investigation"
description: "What specific investment are we investigating? Financial profile, regulatory status, and terminology used on this site."
permalink: /glossary/
---

## What investment are we investigating?

Our FOIA investigation examines a specific class of **non-marketable foreign sovereign debt** purchased by Arkansas state agencies. These are direct loans to a foreign government, sold exclusively through a for-profit broker-dealer registered with FINRA (CRD# 11148).

The public records we obtained — more than 1,200 documents from five state agencies — identify the specific instrument. We use financial terminology throughout this site because this is a financial question, not a political one. The documents speak for themselves.

## Financial profile

This instrument has characteristics that distinguish it from standard fixed-income investments available to pension funds:

**No secondary market.** These bonds cannot be sold or traded before maturity. A pension fund that purchases them is locked in — unable to exit the position if conditions change, if better opportunities arise, or if the fund needs liquidity. This is stated in the bond prospectus itself.

**Declining credit quality.** All three major rating agencies — Moody's, S&P, and Fitch — have downgraded the issuing country's sovereign credit rating since 2024, citing economic instability and heightened security risks. As of early 2026, the Moody's rating stands at Baa1 — one notch above the threshold where many institutional investment policies would prohibit new purchases.

**Sold by a broker-dealer with regulatory accommodations.** The bonds are sold exclusively by a for-profit New York corporation (FINRA CRD# 11148). In 2000, FINRA's predecessor granted this broker-dealer special accommodations regarding customer suitability requirements, acknowledging that its customer base is defined by affinity rather than financial criteria. The broker-dealer has three enforcement events on its FINRA record.

**Not available on any exchange.** Unlike U.S. Treasury securities, corporate bonds, or sovereign debt from most other countries, these bonds are not listed on any exchange and cannot be purchased through standard institutional trading platforms.

## Why we use financial terminology

We describe the investment by its financial characteristics — non-marketable, non-tradable, foreign sovereign debt — because the fiduciary questions are financial questions. Was an independent credit analysis performed? Were internal staff recommendations followed? Does the investment meet the prudent-investor standard? None of these questions require naming the issuer.

When officials named the issuer in their own public statements — and framed the investment in political rather than financial terms — those statements appear as verbatim quotes throughout our evidence, attributed to the public record. The contrast between the campaign's financial language and the officials' political language is the point.

## Terminology used on this site

| Term on this site | Meaning |
|-------------------|---------|
| Non-marketable foreign sovereign debt | Bonds issued by a foreign government that cannot be traded on any secondary market |
| Non-tradable sovereign bonds | Same as above, in more accessible language |
| The bond issuer | The foreign government that issues the debt |
| The broker-dealer (FINRA CRD# 11148) | The for-profit corporation that sells the bonds exclusively |
| The issuer's sales representatives | Employees of the broker-dealer who marketed the bonds to Arkansas agencies |
| Pension Investment Transparency Act | Proposed issuer-neutral Arkansas legislation requiring independent analysis before pension boards commit to non-tradable sovereign debt |

## Verify for yourself

The FOIA documents on our [documents archive](/documents/) identify the specific instrument in the agencies' own words. Our [evidence page](/evidence/) presents what those documents show. The [interactive network graph](/network/) maps the relationships discovered across the public record.

For the specific instrument name and issuer identification, [browse the source documents directly](/documents/).
```

**Create new file: `_data/terminology.yml`** (optional but useful for Jekyll includes)
```yaml
# Issuer-neutral terminology for consistent site-wide usage
instrument_formal: "non-marketable foreign sovereign debt"
instrument_accessible: "non-tradable sovereign bonds"
instrument_short: "the bonds"
issuer_formal: "a foreign government"
issuer_short: "the issuing country"
broker_dealer: "the bond issuer's broker-dealer (FINRA CRD# 11148)"
broker_dealer_short: "the broker-dealer"
reps_formal: "the bond issuer's sales representatives"
reps_short: "the issuer's representatives"
finra_crd: "11148"
```

**Update nav to include glossary:** Add glossary link to `_includes/nav.html` under "About" or as a standalone item.

**Update footer:** Add glossary link to `_includes/footer.html` under "Learn" section.

---

### PR 2 — Infrastructure Pages
**Branch:** `reframe/infrastructure`
**Files:** `about.md`, `methodology.md`, `llms.txt`, `CLAUDE.md`, `README.md`

These are low-traffic, low-risk pages. Establish the neutral voice here first.

**about.md changes:**
- "What we're asking for" demands 1-2: remove issuer name, use "non-tradable sovereign bonds" + glossary link
- FAQ: "What are Israel Bonds?" → "What investment are we investigating?" with answer directing to glossary
- All other FAQ answers: neutralize campaign-voice references
- Keep official quotes verbatim with "From the public record:" prefix

**methodology.md changes:**
- "Israel Bonds purchases" → "sovereign bond purchases" or "the bond purchases under investigation"
- Minimal changes — this page is mostly about process, not the instrument.

**llms.txt changes:**
- Summary line: neutralize
- Key facts bullets: neutralize
- Add glossary URL to pages list

**CLAUDE.md changes:**
- Update site description to reflect neutral framing
- Update document counts
- Add note about issuer-neutral language policy

---

### PR 3 — Sitewide Includes
**Branch:** `reframe/includes`
**Files:** `_includes/hero.html`, `_includes/stats-bar.html`, `_includes/evidence-timeline.html`, `_includes/jsonld.html`

**hero.html:**
- `"these Israel Bonds investments"` → `"these investments in non-tradable sovereign debt"`

**stats-bar.html:**
- `"Israel's sovereign rating"` → `"the issuing country's sovereign rating"`

**evidence-timeline.html:**
- Neutralize all 9 instances of "Israel Bonds" in timeline entry text
- Keep: proper nouns like "Dennis Milligan" and agency names
- Example: "State Board of Finance approves $10 million additional Israel Bonds purchase" → "State Board of Finance approves $10 million additional purchase of non-tradable sovereign bonds"

**jsonld.html:**
- Organization `description`: neutralize
- `knowsAbout` array: replace "Israel Bonds" with "non-marketable sovereign debt", "pension fiduciary duty"
- FAQ schema: rewrite Q&A text to match updated about.md FAQ
- Report schema on evidence page: neutralize title and about array

---

### PR 4 — Core Argument: the-issue.md
**Branch:** `reframe/the-issue`

This is the most argumentatively dense page (~55 mentions, 16KB). Full rewrite required.

**Key structural changes:**
- "What are Israel Bonds?" section → "What is this investment?" — restructure around the three financial characteristics (non-tradable, downgraded, sold by accommodated broker-dealer) without naming issuer
- Exposure table: column headers and text neutralized
- "How did it happen?" sankey section: description text neutralized
- "The fiduciary problem" section: all campaign-voice instances neutralized; official quotes stay verbatim with "From the public record:" prefix
- "The symmetry argument": mostly clean already
- "What we're asking for" demands: neutralize
- DCI/FINRA description: restructure around CRD# 11148 without naming the organization
- Pull quotes: keep verbatim, add "From the public record:" framing

**The front matter:**
```yaml
title: "The Issue — Up to $100M in Pension Fund Exposure Authorized Without Independent Analysis"
description: "Up to $100 million in Arkansas pension fund exposure authorized for non-tradable foreign sovereign debt despite credit downgrades, internal advice against new purchases, and no independent analysis."
```

---

### PR 5 — Evidence Page
**Branch:** `reframe/evidence`

The densest page (~80 mentions, 34KB). Every finding section needs surgical editing.

**Principle for this page:** Every sentence either (a) uses neutral financial language in the campaign's own voice, or (b) quotes a document/official verbatim with attribution. No campaign-voice sentence should contain the issuer name.

**Front matter:**
```yaml
title: "Evidence — Key Findings from 1,227 Arkansas Public Records"
description: "Key findings from more than 1,200 public records obtained through three rounds of FOIA requests to five Arkansas state agencies"
```

**Section-by-section:**
- Finding 1 "No independent credit analysis": replace ~3 instances
- Finding 2 "Internal memo": replace ~2 instances
- Finding 3 + sub-findings 3a-3i: heaviest section — ~40 instances. Every "Israel Bonds" in campaign voice → neutral. Official quotes stay.
- Finding 4 "Board Chair dissent": ~2 instances
- Finding 5 "Public statements": quotes stay verbatim with prefix; surrounding text goes neutral
- Finding 6 "First-ever direct foreign sovereign debt": ~3 instances
- Exposure chart section: labels and noscript text
- Decision window section: mostly clean (JS handles labels)
- Timeline section: same treatment as evidence-timeline.html
- Legal standards section: mostly clean
- CTA section at bottom: ~2 instances

**Chart labels in evidence.md HTML:**
- `aria-label` on exposure chart: neutralize
- noscript bar chart labels: neutralize
- `bar-chart-note` paragraph: neutralize where campaign-voice

---

### PR 6 — Audience Pages
**Branch:** `reframe/audience-pages`
**Files:** `educators.md`, `public-employees.md`

~40 mentions each. Letter templates and public comment scripts need complete rewriting.

**Pattern for both pages:**
- Page title: `"ATRS & Israel Bonds — What Teachers Should Know"` → `"Your ATRS Pension — What You Should Know About Non-Tradable Sovereign Debt"`
- "What's happening with YOUR pension" section: neutralize all campaign-voice instances
- "Why it matters" bullet points: neutralize
- Fund statistics sections: mostly clean
- Letter templates: full rewrite to neutral language + glossary link
- Public comment scripts: full rewrite to neutral language
- Callout boxes: neutralize

**Letter template pattern:**
Replace every instance of the issuer name with "non-tradable sovereign bonds" or "non-marketable foreign government bonds." Add this line near the end of each template:
```
For the specific instrument identified in our FOIA investigation and 
the full financial profile, see arpensions.org/glossary.
```

---

### PR 7 — Advocacy Pages
**Branch:** `reframe/advocacy`
**Files:** `legislators.md`, `take-action.md`

**legislators.md (~45 mentions):**
- Front matter: neutralize
- Executive summary: neutralize
- Key facts table: neutralize the ~8 rows that reference the issuer
- Fiduciary concern section: neutralize campaign voice; keep official quotes with prefix
- "Israel Bonds: the financial profile" callout → "The financial profile of these bonds" — describe characteristics without naming
- Pension Investment Transparency Act provisions: already mostly neutral, but explanatory text references the issuer
- Committee pathway: "Israel Bonds sales executives" → "bond sales executives"
- National context / other states section if present: neutralize campaign-voice summaries

**take-action.md (~15 mentions):**
- Letter templates: same treatment as PR 6
- "Contact legislators" section: neutralize
- Meeting info: already clean

---

### PR 8 — Documents Page
**Branch:** `reframe/documents`
**File:** `documents.md`

- "About these documents" intro: neutralize wrapper text
- Document titles and descriptions in the `<ul class="document-list">`: **Neutralize.** Examples:
  - "Israel Bonds marketing materials sent to Auditor's .gov email" → "Bond issuer marketing materials sent to Auditor's .gov email"
  - "Israel Bonds 'Private & Exclusive' briefing invitation" → "Bond issuer's 'Private & Exclusive' briefing invitation"
  - "Israel Bonds purchase confirmation" → "Sovereign bond purchase confirmation"
- Round 2 content descriptions: neutralize ("Israel Bonds cash flow projections" → "sovereign bond cash flow projections"; "Israel Bonds coordination" → "bond purchase coordination")
- `key-finding` callout: update counts

---

### PR 9 — Network & JS
**Branch:** `reframe/network-js`
**Files:** `network.md`, `assets/js/influence-sankey.js`, `assets/js/network-graph.json` (if entity labels are changed)

**network.md:**
- Hero description: update "four" → "five" agencies if still outdated
- Tour button descriptions: neutralize ("Israel Bonds reps" → "bond issuer's representatives")

**influence-sankey.js:**
- Node label: `'Israel Bonds / DCI'` → `'Bond Issuer / Broker-Dealer'`
- Link descriptions: neutralize all ~5 instances
- aria-label on SVG: neutralize
- Comment header: update

**network-graph.json (141KB):**
- This is the big one. Entity nodes that say "Israel Bonds" or "Development Corporation for Israel" need neutral labels.
- Approach: Load the JSON, find nodes with these labels, replace with neutral equivalents.
- Node observations (the text shown in the detail panel) that quote FOIA documents can stay verbatim if attributed.
- Edge labels describing relationships should be neutralized in campaign voice.

---

### PR 10 — Press Page + News
**Branch:** `reframe/press-news`
**Files:** `press.md`, `news.md`

**press.md (~35 mentions):**
- Campaign summary: neutralize
- Key statistics table: neutralize
- Timeline: neutralize campaign-voice entries; keep official quotes verbatim with prefix
- Key quotes section: ALL stay verbatim — add "From the public record:" prefix to each
- Fiduciary question section: neutralize campaign voice
- Background resources: keep external link titles as-is (they're other outlets' words)
- National context / other states: neutralize campaign-voice summaries
- **Add a "Background: The specific instrument" section** near the bottom for journalist discoverability. This section can name the instrument explicitly because it's the journalist-facing bridge, framed as: "The FOIA documents obtained by this campaign identify the instrument as [name], issued through [organization]. For the full financial profile, see our [glossary](/glossary/)."

**news.md:**
- Retroactively update ALL entries to neutral language (Decision #2)
- Every "Israel Bonds" in campaign-authored text → neutral
- Keep external article titles as-is when linking (e.g., the Arkansas Times and Spotlight PA article titles)

---

### PR 11 — Home Page (Final)
**Branch:** `reframe/home`
**File:** `index.md`

- Front matter description: neutralize
- Body text: should already be mostly clean after includes were updated in PR 3
- Verify everything renders correctly with `bundle exec jekyll build`

---

## Verification Checklist

After ALL PRs are merged, run these verification commands:

```bash
# Should return 0 results (excluding glossary.md, REFRAME-INSTRUCTIONS.md, 
# and the press page's journalist bridge section)
grep -rni "israel bond" --include="*.md" --include="*.html" --include="*.js" . \
  | grep -v "glossary.md" \
  | grep -v "REFRAME" \
  | grep -v "CLAUDE.md" \
  | grep -v "From the public record"

# Check for orphaned references
grep -rni "israeli" --include="*.md" --include="*.html" . \
  | grep -v "glossary.md" \
  | grep -v "From the public record"

grep -rni "DCI" --include="*.md" --include="*.html" --include="*.js" . \
  | grep -v "glossary.md"

grep -rni "Development Corporation" --include="*.md" --include="*.html" . \
  | grep -v "glossary.md"

# Verify build succeeds
bundle exec jekyll build

# Verify no broken internal links
bundle exec jekyll build 2>&1 | grep -i "error\|warning"
```

---

## Handling Official Quotes

Every verbatim quote from an official or document gets this treatment:

**Before (current site):**
```markdown
<div class="pull-quote" markdown="1">

"Arkansas puts its money where its mouth is and is investing millions in Israeli bonds!"

<span class="pull-quote-attribution">— Governor Sarah Huckabee Sanders, public statement (August 2025)</span>

</div>
```

**After (reframed):**
```markdown
<div class="pull-quote" markdown="1">

**From the public record:**

"Arkansas puts its money where its mouth is and is investing millions in Israeli bonds!"

<span class="pull-quote-attribution">— Governor Sarah Huckabee Sanders, public statement (August 2025)</span>

</div>
```

The quote text is NEVER changed. The "From the public record:" prefix is always added in bold before the quote. This creates a visual and rhetorical separation between the campaign's neutral voice and the officials' own political language.

For inline quotes (not in pull-quote blocks), use attribution like: *As documented in public records, [Official Name] stated: "[exact quote]"*

---

## Style Notes

- **Don't over-explain the neutral framing.** Don't say "we choose not to name the issuer because..." on every page. The glossary page explains the approach once. The rest of the site just uses neutral language naturally.
- **Vary the neutral terminology.** Don't use "non-marketable foreign sovereign debt" in every sentence. Alternate with "non-tradable sovereign bonds," "these bonds," "the investment," "the bonds under investigation." Read each paragraph aloud — if it sounds robotic or repetitive, vary the phrasing.
- **First mention on each page should be the most descriptive.** Use the full phrase "non-marketable foreign sovereign debt — bonds that cannot be sold on any secondary market" the first time on each page. After that, shorter forms are fine.
- **The FINRA CRD# is your friend.** When you need specificity without naming, "FINRA CRD# 11148" is a neutral, verifiable identifier. It invites the reader to look it up themselves.
- **Keep the emotional power.** The reframe should make the site MORE compelling, not less. "Your pension fund bought $50 million in bonds that can't be sold on any market, without a single page of independent analysis" is MORE powerful than naming the issuer — because it forces the reader to engage with the financial substance.
- **Don't sanitize the evidence.** The officials' own political statements are the strongest evidence. Keep them prominent. The contrast between the campaign's neutral financial language and the officials' "Arkansas stands with Israel" language IS the argument.

---

## Skills to Load

Before beginning work, read these skill files:
- `/mnt/skills/user/jekyll-site/SKILL.md` — Jekyll build patterns and site architecture
- `/mnt/skills/user/d4arf-brand-guidelines/SKILL.md` — Brand colors, typography, design tokens (use `--art-*` prefix, not `--d4arf-*`)

---

## What Success Looks Like

When this reframe is complete:
1. A reader can navigate the entire site and understand exactly what the campaign is about WITHOUT the site ever naming the issuer in its own voice
2. Every official quote remains verbatim and devastating — the officials name the issuer, not the campaign
3. The glossary page connects the dots for anyone who wants specificity
4. `grep -rni "israel" . | grep -v glossary | grep -v "From the public record" | grep -v CLAUDE` returns only results from the press page's journalist bridge section
5. The site builds cleanly with `bundle exec jekyll build`
6. The fiduciary argument is STRONGER because it's purely financial — no political trigger words for opponents to latch onto

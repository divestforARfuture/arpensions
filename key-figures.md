---
layout: page
title: "Key Figures — Who Drove These Investments"
description: "Profiles of the officials, organizations, and bond representatives documented across 1,200+ FOIA records from Arkansas state agencies."
permalink: /key-figures/
breadcrumb: Key Figures
---

This page profiles the key individuals and organizations whose actions shaped Arkansas's non-tradable sovereign bond investments. Every fact below is drawn from public records obtained through FOIA requests to Arkansas state agencies. Names link to related profiles on this page; for the underlying documents, see the [evidence page](/evidence/) and [document archive](/documents/).

---

## The Central Figures

These two individuals appear most frequently across the entire 1,200+ document corpus. Their influence reached the two pension boards under investigation — ATRS and APERS — through a chain that began at the State Treasury, where the Arkansas position originated.

{% assign central = site.data.key-figures | where: "relevance", "central" %}
{% for figure in central %}
<div class="figure-card figure-card--central" id="{{ figure.id }}" markdown="1">

### {{ figure.name }}

<p class="figure-subtitle">{{ figure.title }}{% if figure.agency %} · {{ figure.agency }}{% endif %}</p>

<p class="figure-summary">{{ figure.summary }}</p>

<ul class="figure-facts">
{% for fact in figure.key_facts %}<li>{{ fact }}</li>
{% endfor %}
</ul>

<div class="figure-connections">
<strong>Connections:</strong>
<ul class="connections-list">
{% for conn in figure.connections %}<li><a href="#{{ conn.target }}">{{ conn.label }}</a> — {{ conn.relationship }}</li>
{% endfor %}
</ul>
</div>

</div>
{% endfor %}

---

## The Bond Issuer's Representatives

The sales representatives who met with every agency head during the April 2025 pitch tour and were cc'd on purchase communications.

{% assign reps = site.data.key-figures | where: "type", "bonds_representative" %}
{% for figure in reps %}
<div class="figure-card" id="{{ figure.id }}" markdown="1">

### {{ figure.name }}

<p class="figure-subtitle">{{ figure.title }}{% if figure.agency %} · {{ figure.agency }}{% endif %}</p>

<p class="figure-summary">{{ figure.summary }}</p>

<ul class="figure-facts">
{% for fact in figure.key_facts %}<li>{{ fact }}</li>
{% endfor %}
</ul>

<div class="figure-connections">
<strong>Connections:</strong>
<ul class="connections-list">
{% for conn in figure.connections %}<li><a href="#{{ conn.target }}">{{ conn.label }}</a> — {{ conn.relationship }}</li>
{% endfor %}
</ul>
</div>

</div>
{% endfor %}

---

## Agency Decision-Makers

The people inside the agencies who received, approved, or resisted these investments.

{% assign decision_makers = "" | split: "" %}
{% for fig in site.data.key-figures %}{% if fig.relevance == "key" and fig.type == "official" %}{% assign decision_makers = decision_makers | push: fig %}{% endif %}{% endfor %}
{% for figure in decision_makers %}
<div class="figure-card" id="{{ figure.id }}" markdown="1">

### {{ figure.name }}

<p class="figure-subtitle">{{ figure.title }}{% if figure.agency %} · {{ figure.agency }}{% endif %}</p>

<p class="figure-summary">{{ figure.summary }}</p>

<ul class="figure-facts">
{% for fact in figure.key_facts %}<li>{{ fact }}</li>
{% endfor %}
</ul>

<div class="figure-connections">
<strong>Connections:</strong>
<ul class="connections-list">
{% for conn in figure.connections %}<li><a href="#{{ conn.target }}">{{ conn.label }}</a> — {{ conn.relationship }}</li>
{% endfor %}
</ul>
</div>

</div>
{% endfor %}

---

## Supporting Roles

People who played significant documented roles in the process.

{% assign supporting = site.data.key-figures | where: "relevance", "supporting" %}
{% for figure in supporting %}
<div class="figure-card" id="{{ figure.id }}" markdown="1">

### {{ figure.name }}

<p class="figure-subtitle">{{ figure.title }}{% if figure.agency %} · {{ figure.agency }}{% endif %}</p>

<p class="figure-summary">{{ figure.summary }}</p>

<ul class="figure-facts">
{% for fact in figure.key_facts %}<li>{{ fact }}</li>
{% endfor %}
</ul>

<div class="figure-connections">
<strong>Connections:</strong>
<ul class="connections-list">
{% for conn in figure.connections %}<li><a href="#{{ conn.target }}">{{ conn.label }}</a> — {{ conn.relationship }}</li>
{% endfor %}
</ul>
</div>

</div>
{% endfor %}

---

## Organizations

Institutional actors documented across the FOIA record.

{% assign orgs = site.data.key-figures | where: "type", "organization" %}
{% for figure in orgs %}
<div class="figure-card figure-card--org" id="{{ figure.id }}" markdown="1">

### {{ figure.name }}

<p class="figure-subtitle">{{ figure.title }}</p>

<p class="figure-summary">{{ figure.summary }}</p>

<ul class="figure-facts">
{% for fact in figure.key_facts %}<li>{{ fact }}</li>
{% endfor %}
</ul>

<div class="figure-connections">
<strong>Connections:</strong>
<ul class="connections-list">
{% for conn in figure.connections %}<li><a href="#{{ conn.target }}">{{ conn.label }}</a> — {{ conn.relationship }}</li>
{% endfor %}
</ul>
</div>

</div>
{% endfor %}

---

## How They Connect — Four Key Patterns
{: .patterns-heading }

The profiles above describe individual roles. The patterns below describe how those roles produced up to $100 million in pension fund authorizations — with no independent credit analysis anywhere in the record — and how the Arkansas position originated at the State Treasury years earlier.

<div class="pattern-section" markdown="1">

### The Milligan Chain

**How one official drove sovereign bond purchases from the State Treasury into two pension boards.**

Dennis Milligan initiated the sovereign bond program as State Treasurer circa 2017. When he moved to the Auditor's office — a position with no investment authority over pension funds — he continued promoting the bonds through a chain of intermediaries. His Chief Deputy Jason Brady introduced the bonds at the APERS board (where Brady also sits as a member) and sent the initial request to ATRS Executive Director Mark White. Milligan personally arranged the April 2025 pitch tour that brought bond issuer representatives to all three agency heads within days. The April 11, 2025 scheduling blitz — 18 minutes to set meetings across three agencies — illustrates the coordination.

Milligan sits on both the ATRS and APERS boards, meaning he had a vote on the very purchases he orchestrated. His dual board membership and the Auditor's office coordination created a single point of influence across Arkansas's entire sovereign bond exposure.

</div>

<div class="pattern-section" markdown="1">

### Seller as Analyst

**The bond issuer's representatives provided the only "analysis."**

Across 1,200+ FOIA documents from Arkansas state agencies, there is zero independent credit analysis of the bonds under investigation. The only document resembling internal analysis — a two-page Treasury memo (TREAS-SEP25-0006, October 2024) — was created years after tens of millions had already been invested.

ATRS's investment consultant Aon conducted full due diligence for other investments brought before the board. For the sovereign bonds, Mark White knew Aon would not formally recommend them: "I know they will not be making a formal recommendation." The board proceeded anyway. At the same APERS meetings where sovereign bonds were authorized, Callan provided 37 pages of analysis for other investments. The sovereign bonds received no comparable review.

The result: the issuer's own sales representatives — whose job is to sell bonds — provided the only materials the boards reviewed before committing $100 million in pension funds.

</div>

<div class="pattern-section" markdown="1">

### The SFOF Pipeline

**How success was promoted for interstate replication.**

The State Financial Officers Foundation connected the Arkansas purchases to a broader network. Milligan served as SFOF National Chair circa 2019–2020. After Arkansas pension boards voted to authorize sovereign bond purchases, the Auditor's office communications director Stacy Peterson distributed the results through SFOF channels with the message: "Feel free to pass along to any member states."

The sequence: Milligan as SFOF National Chair builds relationships → the Auditor's office arranges pension board votes → Peterson distributes vote results through SFOF → other states receive a template for replication. SFOF conferences included "Corporate Partner Spotlight Meetings," and the bond issuer's representatives maintained an ongoing presence in the network.

</div>

<div class="pattern-section" markdown="1">

### The Authorization Gap

**What's missing from the fiduciary record.**

For up to $100 million in pension fund authorizations ($50M ATRS + $25–50M APERS), the FOIA record contains:

- **Zero** independent credit analysis
- **Zero** risk assessments
- **Zero** yield comparisons against benchmark alternatives
- **Zero** consultant recommendations

The State Treasury's parallel position ($55M including the May 2025 purchase of $20M in new bonds) shows the same absence of investment committee deliberation in the FOIA record.

Both the ATRS and APERS 2025 authorizations were first-ever direct purchases of these bonds. Steve Pulley, Senior Investment Officer at Treasury, authored an internal memo recommending against new purchases, citing credit downgrades by all three major rating agencies (including Moody's downgrade on September 27). The Treasury then made a $20 million new purchase, and neither pension board produced its own independent credit analysis before authorizing further purchases. Danny Knight, ATRS Board Chair, cast the sole dissenting vote, warning the board was "going outside of the scope of the way we usually do things."

The gap is not just what was absent — it's what was present for every other investment. The same boards that authorized sovereign bonds without independent analysis routinely received dozens of pages of consultant review for comparable commitments.

</div>

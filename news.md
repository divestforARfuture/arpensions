---
layout: page
title: "News & Updates — Arkansas Pension Transparency Campaign"
description: "Campaign updates and analysis from Divest for AR Future."
permalink: /news/
---

## Campaign updates

Follow our investigation and campaign progress. We publish updates as new FOIA responses arrive and as the campaign develops toward the 2027 legislative session.

**Want updates by email?** Contact us at [divestforarfuture@proton.me](mailto:divestforarfuture@proton.me?subject=Subscribe%20to%20updates) to join our update list.

---

<ul class="post-list">
{% for post in site.posts %}
  <li>
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %-d, %Y" }}</time>
    {% if post.excerpt %}
    <p>{{ post.excerpt | strip_html | truncatewords: 40 }}</p>
    {% endif %}
  </li>
{% endfor %}
</ul>

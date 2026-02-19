---
layout: page
title: "News & Updates"
description: "Campaign updates and analysis from Divest for AR Future."
permalink: /news/
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

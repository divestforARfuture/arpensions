/* ==========================================================================
   Influence Flow Sankey — D3.js Sankey diagram showing the conduit chain
   from Dennis Milligan and bond issuer's sales representatives through intermediaries to
   the three agency authorizations and interstate replication.
   Loaded only on the-issue page via `d3sankey: true` front matter.
   ========================================================================== */

(function () {
  'use strict';

  if (typeof d3 === 'undefined' || typeof d3.sankey === 'undefined') return;

  var container = document.getElementById('influence-sankey');
  if (!container) return;

  // --- Respect prefers-reduced-motion ---
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Theme-aware colors ---
  function getColors() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      // Node categories
      origin:    dark ? '#EF4444' : '#B91C1C',
      seller:    dark ? '#F59E0B' : '#B45309',
      conduit:   dark ? '#9CA3AF' : '#6B7280',
      agency:    dark ? '#34D399' : '#0C7489',
      external:  dark ? '#818CF8' : '#4F46E5',
      // UI
      text:      dark ? '#E5E7EB' : '#374151',
      textMuted: dark ? '#9CA3AF' : '#6B7280',
      linkBase:  dark ? 0.2 : 0.15,
      linkHover: dark ? 0.45 : 0.35,
      bg:        dark ? '#121218' : '#F8F7F5'
    };
  }

  // --- Sankey data ---
  // Nodes are ordered roughly left-to-right by role in the influence chain.
  // Link values represent relative influence weight (not dollar amounts).
  var graphData = {
    nodes: [
      { id: 'milligan',       label: 'Dennis Milligan',         category: 'origin' },
      { id: 'bonds-reps',     label: 'Bond Issuer / Broker-Dealer', category: 'seller' },
      { id: 'auditor-office', label: 'Auditor\u2019s Office',   category: 'conduit' },
      { id: 'brady',          label: 'Jason Brady',              category: 'conduit' },
      { id: 'sfof',           label: 'SFOF',                     category: 'conduit' },
      { id: 'sales-tour',     label: 'April 2025 Tour',         category: 'conduit' },
      { id: 'treasury',       label: 'Treasury $55M',            category: 'agency' },
      { id: 'apers',          label: 'APERS $25\u201350M',      category: 'agency' },
      { id: 'atrs',           label: 'ATRS $50M',                category: 'agency' },
      { id: 'other-states',   label: 'Other States',             category: 'external' }
    ],
    links: [
      // Milligan as nexus
      { source: 'milligan',       target: 'auditor-office', value: 5, desc: 'Became Auditor of State' },
      { source: 'milligan',       target: 'sfof',           value: 3, desc: 'Served as SFOF National Chair' },
      { source: 'milligan',       target: 'treasury',       value: 4, desc: 'Initiated sovereign bond purchases as Treasurer (2017)' },

      // Auditor's office channels
      { source: 'auditor-office', target: 'brady',          value: 4, desc: 'Appointed Brady to APERS board' },
      { source: 'auditor-office', target: 'sales-tour',     value: 5, desc: 'Arranged April 2025 meetings' },

      // Bond issuer reps
      { source: 'bonds-reps',     target: 'sales-tour',     value: 5, desc: 'Sales presentations to all agencies' },
      { source: 'bonds-reps',     target: 'treasury',       value: 2, desc: 'Ongoing bond sales relationship' },

      // April 2025 tour → authorizations
      { source: 'sales-tour',     target: 'treasury',       value: 3, desc: '$20M purchased immediately (May 2025)' },
      { source: 'sales-tour',     target: 'apers',          value: 3, desc: 'Subcommittee authorized May 2025' },
      { source: 'sales-tour',     target: 'atrs',           value: 3, desc: 'Board authorized June 2025' },

      // Brady → boards
      { source: 'brady',          target: 'apers',          value: 4, desc: 'Introduced the investment, cited Treasury holdings' },
      { source: 'brady',          target: 'atrs',           value: 3, desc: 'Initiated request as board trustee' },

      // SFOF → interstate
      { source: 'sfof',           target: 'other-states',   value: 3, desc: 'Interstate replication pipeline (TX, AZ, ID, NC)' }
    ]
  };

  // --- Build node index ---
  var nodeMap = {};
  graphData.nodes.forEach(function (n, i) { nodeMap[n.id] = i; });

  var sankeyNodes = graphData.nodes.map(function (n) {
    return { name: n.label, category: n.category, id: n.id };
  });

  var sankeyLinks = graphData.links.map(function (l) {
    return {
      source: nodeMap[l.source],
      target: nodeMap[l.target],
      value: l.value,
      desc: l.desc
    };
  });

  // --- Dimensions ---
  var margin = { top: 16, right: 20, bottom: 16, left: 20 };

  function getWidth() {
    var w = container.clientWidth || 700;
    return Math.min(w, 780);
  }

  var height = 420;

  // --- Sync legend dot colors with current theme ---
  function syncLegendColors(c) {
    var catColors = {
      origin: c.origin, seller: c.seller, conduit: c.conduit,
      agency: c.agency, external: c.external
    };
    document.querySelectorAll('.sankey-legend-dot[data-category]').forEach(function (dot) {
      var cat = dot.getAttribute('data-category');
      if (catColors[cat]) dot.style.background = catColors[cat];
    });
  }

  // --- Render ---
  function render() {
    var c = getColors();
    var width = getWidth();
    var innerW = width - margin.left - margin.right;
    var innerH = height - margin.top - margin.bottom;

    // Clear previous
    d3.select(container).selectAll('*').remove();

    var svg = d3.select(container)
      .append('svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('width', '100%')
      .attr('height', height)
      .attr('role', 'img')
      .attr('aria-label', 'Sankey diagram showing the influence flow: Dennis Milligan and the bond issuer\'s sales representatives channel influence through the Auditor\u2019s office, Jason Brady, SFOF, and the April 2025 sales tour to reach Treasury ($55M), APERS ($25\u201350M), ATRS ($50M), and interstate replication.')
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    // Configure sankey layout
    var sankey = d3.sankey()
      .nodeId(function (d) { return d.index; })
      .nodeWidth(18)
      .nodePadding(14)
      .nodeSort(null)
      .extent([[0, 0], [innerW, innerH]]);

    var graph = sankey({
      nodes: sankeyNodes.map(function (d) { return Object.assign({}, d); }),
      links: sankeyLinks.map(function (d) { return Object.assign({}, d); })
    });

    // Category → color
    function nodeColor(cat) {
      switch (cat) {
        case 'origin':   return c.origin;
        case 'seller':   return c.seller;
        case 'conduit':  return c.conduit;
        case 'agency':   return c.agency;
        case 'external': return c.external;
        default:         return c.conduit;
      }
    }

    // --- Links ---
    var linkGroup = svg.append('g')
      .attr('class', 'sankey-links')
      .attr('fill', 'none');

    var linkPaths = linkGroup.selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('d', d3.sankeyLinkHorizontal())
      .attr('stroke', function (d) { return nodeColor(d.source.category); })
      .attr('stroke-opacity', c.linkBase)
      .attr('stroke-width', function (d) { return Math.max(2, d.width); })
      .style('mix-blend-mode', 'normal');

    // --- Tooltip ---
    var tooltip = d3.select(container)
      .append('div')
      .attr('class', 'sankey-tooltip')
      .attr('role', 'tooltip')
      .style('display', 'none');

    linkPaths
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('stroke-opacity', c.linkHover);
        var tc = getColors();

        // Build tooltip via DOM (safe against future dynamic data)
        var tipNode = tooltip.node();
        tipNode.innerHTML = '';
        var strong = document.createElement('strong');
        strong.textContent = d.source.name + ' \u2192 ' + d.target.name;
        var br = document.createElement('br');
        var span = document.createElement('span');
        span.style.color = tc.textMuted;
        span.textContent = d.desc;
        tipNode.appendChild(strong);
        tipNode.appendChild(br);
        tipNode.appendChild(span);

        tooltip.style('display', 'block');
      })
      .on('mousemove', function (event) {
        var rect = container.getBoundingClientRect();
        var x = event.clientX - rect.left + 12;
        var y = event.clientY - rect.top - 10;
        // Clamp
        var tipW = tooltip.node().offsetWidth;
        if (x + tipW > rect.width) x = x - tipW - 24;
        if (y < 0) y = 10;
        tooltip.style('left', x + 'px').style('top', y + 'px');
      })
      .on('mouseleave', function () {
        d3.select(this).attr('stroke-opacity', c.linkBase);
        tooltip.style('display', 'none');
      });

    // --- Nodes ---
    var nodeGroup = svg.append('g')
      .attr('class', 'sankey-nodes');

    var nodes = nodeGroup.selectAll('g')
      .data(graph.nodes)
      .join('g');

    nodes.append('rect')
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return Math.max(4, d.y1 - d.y0); })
      .attr('fill', function (d) { return nodeColor(d.category); })
      .attr('rx', 2)
      .attr('ry', 2);

    // Node labels
    nodes.append('text')
      .attr('x', function (d) { return d.x0 < innerW / 2 ? d.x1 + 8 : d.x0 - 8; })
      .attr('y', function (d) { return (d.y0 + d.y1) / 2; })
      .attr('dy', '0.35em')
      .attr('text-anchor', function (d) { return d.x0 < innerW / 2 ? 'start' : 'end'; })
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('font-size', '11px')
      .attr('font-weight', '500')
      .attr('fill', c.text)
      .text(function (d) { return d.name; });

    // Entrance animation
    if (!reducedMotion) {
      linkPaths
        .attr('stroke-dasharray', function () {
          return this.getTotalLength() + ' ' + this.getTotalLength();
        })
        .attr('stroke-dashoffset', function () { return this.getTotalLength(); })
        .transition()
        .duration(1200)
        .ease(d3.easeCubicOut)
        .attr('stroke-dashoffset', 0);

      nodeGroup.selectAll('rect')
        .attr('opacity', 0)
        .transition()
        .duration(600)
        .ease(d3.easeCubicOut)
        .attr('opacity', 1);

      nodeGroup.selectAll('text')
        .attr('opacity', 0)
        .transition()
        .delay(400)
        .duration(600)
        .ease(d3.easeCubicOut)
        .attr('opacity', 1);
    }

    // Sync legend colors after render
    syncLegendColors(c);
  }

  // --- Init ---
  render();

  // Rebuild on theme change
  var themeObs = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'data-theme') render();
    });
  });
  themeObs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Rebuild on resize (debounced)
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 250);
  });

})();

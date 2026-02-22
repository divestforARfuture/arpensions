/* ==========================================================================
   D4ARF Network Visualization — Force-directed graph using D3.js v7
   ========================================================================== */

(function () {
  'use strict';

  // --- Color palette for entity types ---
  var TYPE_COLORS = {
    agency: '#B91C1C',
    official: '#2563EB',
    bonds_representative: '#D97706',
    organization: '#7C3AED',
    investigation_finding: '#059669',
    key_document: '#64748B',
    legislation: '#DC2626',
    legal_standard: '#991B1B',
    strategic_framework: '#0D9488',
    foia_request: '#6366F1',
    foia_strategy: '#8B5CF6',
    evidence_assessment: '#475569'
  };

  var TYPE_LABELS = {
    agency: 'Agency',
    official: 'Official',
    bonds_representative: 'Bonds Rep',
    organization: 'Organization',
    investigation_finding: 'Finding',
    key_document: 'Key Document',
    legislation: 'Legislation',
    legal_standard: 'Legal Standard',
    strategic_framework: 'Strategy',
    foia_request: 'FOIA Request',
    foia_strategy: 'FOIA Strategy',
    evidence_assessment: 'Assessment'
  };

  // --- Node sizing by type ---
  function nodeRadius(d) {
    var base = {
      agency: 16,
      official: 10,
      bonds_representative: 11,
      organization: 14,
      investigation_finding: 9,
      key_document: 8,
      legislation: 12,
      legal_standard: 11,
      strategic_framework: 10,
      foia_request: 8,
      foia_strategy: 7,
      evidence_assessment: 7
    };
    var r = base[d.type] || 8;
    // Scale up slightly for nodes with many connections
    var connCount = (d._linkCount || 0);
    return r + Math.min(connCount * 0.5, 6);
  }

  // --- Guided tour definitions ---
  var TOURS = {
    'milligan-chain': {
      title: 'The Milligan Chain',
      steps: [
        {
          nodes: ['Dennis Milligan'],
          text: 'Dennis Milligan served as State Treasurer (~2015-2019) where he initiated the Israel Bonds program. He later became Auditor of State — an office with no investment authority.'
        },
        {
          nodes: ['Dennis Milligan', 'Arkansas State Treasury', 'Auditor of State'],
          text: 'Despite holding no investment authority as Auditor, Milligan used his office to coordinate Israel Bonds advocacy across multiple agencies.'
        },
        {
          nodes: ['Dennis Milligan', 'Jason Brady', 'APERS', 'ATRS'],
          text: 'Jason Brady — Milligan\'s direct report at the Auditor\'s office — served on the APERS board and initiated the Israel Bonds request at ATRS. He was the operational conduit across both pension systems.'
        },
        {
          nodes: ['Dennis Milligan', 'Jason Brady', 'April 2025 Israel Bonds Tour', 'Lawrence Berman', 'Bradley Young'],
          text: 'In April 2025, the Auditor\'s office organized a 2-day tour of Arkansas state government for Israel Bonds sales reps. Within weeks, both APERS and ATRS authorized up to $50 million each.'
        },
        {
          nodes: ['Dennis Milligan', 'Stacy Peterson', 'SFOF', 'SFOF Conduit Role'],
          text: 'After the votes, Milligan\'s communications director distributed success stories through SFOF to encourage other states to replicate. The full advocacy lifecycle — from meetings to votes to interstate promotion — operated from the Auditor\'s office.'
        }
      ]
    },
    'seller-as-analyst': {
      title: 'Seller as Analyst',
      steps: [
        {
          nodes: ['Seller as Analyst Problem', 'No Independent Credit Analysis'],
          text: 'Across 909 FOIA documents from 4 agencies, zero independent credit analyses of Israel Bonds exist. The only "analysis" came from the entity selling the bonds.'
        },
        {
          nodes: ['Lawrence Berman', 'Bradley Young', 'Stuart Garawitz', 'Israel Bonds / DCI'],
          text: 'Israel Bonds representatives provided all investment materials: rate sheets, economic briefings, marketing emails, and "exclusive" presentations. These same people are responsible for selling $10+ billion in bonds.'
        },
        {
          nodes: ['Aon Hewitt Investment Consulting', 'ATRS No Independent Analysis', 'ATRS'],
          text: 'ATRS\'s own consultant Aon provided comprehensive due diligence for other investments like KKR. For Israel Bonds: nothing. The Executive Director admitted in advance that Aon "will not be making a formal recommendation."'
        },
        {
          nodes: ['Seller as Analyst Problem', 'Arkansas State Treasury', 'APERS', 'ATRS'],
          text: 'The pattern repeated across all three investing entities. In every case, the bond seller\'s materials were the only investment rationale available when decisions were made.'
        }
      ]
    },
    'sfof-pipeline': {
      title: 'The SFOF Pipeline',
      steps: [
        {
          nodes: ['SFOF', 'Derek A. Kreifels'],
          text: 'The State Financial Officers Foundation (SFOF) is a networking organization connecting state treasurers and financial officers nationally. Derek Kreifels serves as Executive Director.'
        },
        {
          nodes: ['SFOF', 'Dennis Milligan', 'Israel Bonds / DCI'],
          text: 'Milligan served as SFOF National Chair (~2019-2020). SFOF forwarded Israel Bonds events — including a "Celebration with Prime Minister Netanyahu" — to state officials. The organization functioned as a marketing channel.'
        },
        {
          nodes: ['SFOF Conduit Role', 'Inter-State Israel Bonds Coordination', 'Glenn Hegar'],
          text: 'The SFOF network connected Arkansas officials with treasurers from Texas, Arizona, Idaho, North Carolina, and others. Texas Comptroller Hegar used nearly identical political framing for his $140M in Israel Bonds purchases.'
        },
        {
          nodes: ['Stacy Peterson', 'SFOF Conduit Role', 'Adam Schwend'],
          text: 'After APERS and ATRS voted, Milligan\'s communications director emailed SFOF: "Feel free to pass along to any member states you think might be interested. The Auditor has very good contact." The interstate replication pipeline is documented.'
        }
      ]
    },
    'authorization-gap': {
      title: 'The Authorization Gap',
      steps: [
        {
          nodes: ['Authorization Gap', 'Absence of Normal Fiduciary Processes'],
          text: 'For a combined potential allocation of $155 million, standard fiduciary processes are completely absent: no independent credit analysis, no risk assessment, no yield comparison, no consultant review.'
        },
        {
          nodes: ['Authorization Gap', 'Arkansas State Treasury', 'Board of Finance'],
          text: 'Treasury: Purchases authorized by "executive team" with no documented Board of Finance deliberation. The only internal analysis is a 2-page document created years after tens of millions were invested.'
        },
        {
          nodes: ['Authorization Gap', 'ATRS', 'ATRS Resolution 2025-22', 'Danny Knight'],
          text: 'ATRS: The Board adopted Resolution 2025-22 for $50M based on the Executive Director\'s personal opinion, not a formal consultant recommendation. Board Chair Danny Knight signed the resolution.'
        },
        {
          nodes: ['Symmetry Argument', 'Act 710', 'Act 644', 'Arkansas Prudent Investor Standard'],
          text: 'Arkansas Act 710 requires "financial merit" for divestment. The same standard should apply to purchases. The complete absence of financial merit analysis for Israel Bonds purchases violates the spirit of Arkansas\'s own laws.'
        }
      ]
    }
  };

  // --- State ---
  var state = {
    data: null,
    simulation: null,
    svg: null,
    g: null,
    zoom: null,
    selectedNode: null,
    activeFilters: new Set(),
    activeTour: null,
    tourStep: 0,
    nodeElements: null,
    linkElements: null,
    labelElements: null,
    labelBgElements: null
  };

  // --- Init ---
  function init() {
    var dataUrl = document.querySelector('script[src*="network.js"]')
      .getAttribute('src')
      .replace('network.js', 'network-graph.json');

    d3.json(dataUrl).then(function (data) {
      state.data = data;
      preprocess(data);
      buildFilters(data);
      buildLegend(data);
      buildGraph(data);
      bindSearch(data);
      bindTours();
      document.getElementById('graph-loading').classList.add('hidden');
    }).catch(function (err) {
      console.error('Failed to load network data:', err);
      document.getElementById('graph-loading').innerHTML =
        '<p>Failed to load data. Please refresh.</p>';
    });
  }

  // --- Preprocess: attach link counts to nodes ---
  function preprocess(data) {
    var counts = {};
    data.links.forEach(function (l) {
      counts[l.source] = (counts[l.source] || 0) + 1;
      counts[l.target] = (counts[l.target] || 0) + 1;
    });
    data.nodes.forEach(function (n) {
      n._linkCount = counts[n.id] || 0;
    });
  }

  // --- Build type filter buttons ---
  function buildFilters(data) {
    var container = document.getElementById('type-filters');
    var counts = {};
    data.nodes.forEach(function (n) {
      counts[n.type] = (counts[n.type] || 0) + 1;
    });

    // Add "All" button
    var allBtn = document.createElement('button');
    allBtn.className = 'type-filter active';
    allBtn.setAttribute('data-type', 'all');
    allBtn.innerHTML =
      '<span class="type-filter-dot" style="background:#fff;border:1.5px solid #999"></span>' +
      '<span class="type-filter-label">All entities</span>' +
      '<span class="type-filter-count">' + data.nodes.length + '</span>';
    allBtn.addEventListener('click', function () {
      state.activeFilters.clear();
      updateFilterUI();
      applyFilters();
    });
    container.appendChild(allBtn);

    data.entityTypes.forEach(function (type) {
      var btn = document.createElement('button');
      btn.className = 'type-filter';
      btn.setAttribute('data-type', type);
      var color = TYPE_COLORS[type] || '#999';
      btn.innerHTML =
        '<span class="type-filter-dot" style="background:' + color + '"></span>' +
        '<span class="type-filter-label">' + (TYPE_LABELS[type] || type) + '</span>' +
        '<span class="type-filter-count">' + (counts[type] || 0) + '</span>';
      btn.addEventListener('click', function () {
        if (state.activeFilters.has(type)) {
          state.activeFilters.delete(type);
        } else {
          state.activeFilters.add(type);
        }
        updateFilterUI();
        applyFilters();
      });
      container.appendChild(btn);
    });
  }

  function updateFilterUI() {
    var btns = document.querySelectorAll('.type-filter');
    btns.forEach(function (btn) {
      var type = btn.getAttribute('data-type');
      if (type === 'all') {
        btn.classList.toggle('active', state.activeFilters.size === 0);
      } else {
        btn.classList.toggle('active', state.activeFilters.has(type));
      }
    });
  }

  function applyFilters() {
    if (!state.nodeElements) return;
    var hasFilter = state.activeFilters.size > 0;

    state.nodeElements.classed('dimmed', function (d) {
      return hasFilter && !state.activeFilters.has(d.type);
    });

    state.labelElements.classed('dimmed', function (d) {
      return hasFilter && !state.activeFilters.has(d.type);
    });

    if (state.labelBgElements) {
      state.labelBgElements.style('opacity', function (d) {
        return hasFilter && !state.activeFilters.has(d.type) ? 0.08 : 1;
      });
    }

    state.linkElements.classed('dimmed', function (d) {
      if (!hasFilter) return false;
      return !state.activeFilters.has(d.source.type) && !state.activeFilters.has(d.target.type);
    });
  }

  // --- Build legend ---
  function buildLegend(data) {
    var container = document.getElementById('legend');
    data.entityTypes.forEach(function (type) {
      var item = document.createElement('div');
      item.className = 'legend-item';
      var color = TYPE_COLORS[type] || '#999';
      item.innerHTML =
        '<span class="legend-dot" style="background:' + color + '"></span>' +
        '<span>' + (TYPE_LABELS[type] || type) + '</span>';
      container.appendChild(item);
    });
  }

  // --- Build D3 force graph ---
  function buildGraph(data) {
    var container = document.getElementById('network-graph');
    var width = container.clientWidth;
    var height = container.clientHeight;

    var svg = d3.select('#network-graph')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    var g = svg.append('g');

    state.svg = svg;
    state.g = g;

    // --- Zoom ---
    state.zoom = d3.zoom()
      .scaleExtent([0.2, 5])
      .on('zoom', function (event) {
        g.attr('transform', event.transform);
      });

    svg.call(state.zoom);

    // Center initially
    var initialTransform = d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8);
    svg.call(state.zoom.transform, initialTransform);

    // --- Simulation ---
    state.simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id(function (d) { return d.id; }).distance(100).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-200).distanceMax(500))
      .force('center', d3.forceCenter(0, 0))
      .force('collision', d3.forceCollide().radius(function (d) { return nodeRadius(d) + 4; }))
      .force('x', d3.forceX(0).strength(0.04))
      .force('y', d3.forceY(0).strength(0.04));

    // --- Links ---
    state.linkElements = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .join('line')
      .attr('class', 'link-line');

    // --- Nodes ---
    state.nodeElements = g.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .join('circle')
      .attr('class', 'node-circle')
      .attr('r', function (d) { return nodeRadius(d); })
      .attr('fill', function (d) { return TYPE_COLORS[d.type] || '#999'; })
      .on('click', function (event, d) {
        event.stopPropagation();
        selectNode(d);
      })
      .on('mouseenter', function (event, d) {
        if (!state.activeTour) highlightNeighborhood(d);
      })
      .on('mouseleave', function () {
        if (!state.activeTour) clearHighlight();
      })
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    // --- Labels (only for nodes with high connectivity or key types) ---
    var labelNodes = data.nodes.filter(function (d) {
      return d._linkCount >= 3 || d.type === 'agency' || d.type === 'legislation';
    });

    // Label background rects
    state.labelBgElements = g.append('g')
      .attr('class', 'label-bgs')
      .selectAll('rect')
      .data(labelNodes)
      .join('rect')
      .attr('class', 'node-label-bg');

    state.labelElements = g.append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(labelNodes)
      .join('text')
      .attr('class', 'node-label')
      .text(function (d) {
        var name = d.label;
        return name.length > 28 ? name.substring(0, 26) + '...' : name;
      })
      .each(function (d) {
        d._labelWidth = this.getComputedTextLength();
      });

    // --- Tick ---
    state.simulation.on('tick', function () {
      state.linkElements
        .attr('x1', function (d) { return d.source.x; })
        .attr('y1', function (d) { return d.source.y; })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) { return d.target.y; });

      state.nodeElements
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; });

      state.labelElements
        .attr('x', function (d) { return d.x; })
        .attr('y', function (d) { return d.y + nodeRadius(d) + 14; });

      state.labelBgElements
        .attr('x', function (d) { return d.x - (d._labelWidth || 30) / 2 - 4; })
        .attr('y', function (d) { return d.y + nodeRadius(d) + 5; })
        .attr('width', function (d) { return (d._labelWidth || 30) + 8; })
        .attr('height', 16);
    });

    // --- Click on background to deselect ---
    svg.on('click', function () {
      deselectNode();
    });

    // --- Zoom controls ---
    document.getElementById('zoom-in').addEventListener('click', function () {
      svg.transition().duration(300).call(state.zoom.scaleBy, 1.4);
    });
    document.getElementById('zoom-out').addEventListener('click', function () {
      svg.transition().duration(300).call(state.zoom.scaleBy, 0.7);
    });
    document.getElementById('zoom-reset').addEventListener('click', function () {
      svg.transition().duration(500).call(
        state.zoom.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(0.8)
      );
    });

    // Dismiss hint on interaction
    svg.on('mousedown.hint', function () {
      document.getElementById('graph-hint').classList.add('hidden');
      svg.on('mousedown.hint', null);
    });

    // Resize
    window.addEventListener('resize', function () {
      var w = container.clientWidth;
      var h = container.clientHeight;
      svg.attr('width', w).attr('height', h);
    });
  }

  // --- Drag handlers ---
  function dragStarted(event, d) {
    if (!event.active) state.simulation.alphaTarget(0.1).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragEnded(event, d) {
    if (!event.active) state.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // --- Highlight neighborhood on hover ---
  function highlightNeighborhood(node) {
    var connectedIds = new Set([node.id]);
    state.data.links.forEach(function (l) {
      var s = typeof l.source === 'object' ? l.source.id : l.source;
      var t = typeof l.target === 'object' ? l.target.id : l.target;
      if (s === node.id) connectedIds.add(t);
      if (t === node.id) connectedIds.add(s);
    });

    state.nodeElements.classed('dimmed', function (d) {
      return !connectedIds.has(d.id);
    });

    state.labelElements.classed('dimmed', function (d) {
      return !connectedIds.has(d.id);
    });

    state.linkElements
      .classed('dimmed', function (d) {
        var s = typeof d.source === 'object' ? d.source.id : d.source;
        var t = typeof d.target === 'object' ? d.target.id : d.target;
        return !(s === node.id || t === node.id);
      })
      .classed('highlighted', function (d) {
        var s = typeof d.source === 'object' ? d.source.id : d.source;
        var t = typeof d.target === 'object' ? d.target.id : d.target;
        return s === node.id || t === node.id;
      });
  }

  function clearHighlight() {
    if (state.activeTour) return; // Don't clear during tour
    state.nodeElements.classed('dimmed', false);
    state.labelElements.classed('dimmed', false);
    state.linkElements.classed('dimmed', false).classed('highlighted', false);
    applyFilters(); // Re-apply active filters
  }

  // --- Select node ---
  function selectNode(node) {
    state.selectedNode = node;

    state.nodeElements.classed('selected', function (d) { return d.id === node.id; });

    // Show detail panel
    document.getElementById('detail-empty').style.display = 'none';
    var content = document.getElementById('detail-content');
    content.style.display = 'block';

    var color = TYPE_COLORS[node.type] || '#999';
    var badge = document.getElementById('detail-type');
    badge.textContent = TYPE_LABELS[node.type] || node.type;
    badge.style.backgroundColor = color;

    document.getElementById('detail-name').textContent = node.label;

    // Observations
    var obsList = document.getElementById('detail-observations');
    obsList.innerHTML = '';
    var observations = node.observations || [];
    var showCount = Math.min(observations.length, 8);
    for (var i = 0; i < showCount; i++) {
      var li = document.createElement('li');
      li.textContent = observations[i];
      obsList.appendChild(li);
    }
    if (observations.length > showCount) {
      var more = document.createElement('li');
      more.style.color = '#999';
      more.style.fontStyle = 'italic';
      more.textContent = '+ ' + (node.observationCount - showCount) + ' more facts in the full record';
      obsList.appendChild(more);
    }

    // Connections
    var connList = document.getElementById('detail-connections');
    connList.innerHTML = '';
    state.data.links.forEach(function (l) {
      var s = typeof l.source === 'object' ? l.source.id : l.source;
      var t = typeof l.target === 'object' ? l.target.id : l.target;
      if (s === node.id || t === node.id) {
        var other = s === node.id ? t : s;
        var direction = s === node.id ? '\u2192' : '\u2190';
        var li = document.createElement('li');
        var btn = document.createElement('button');
        btn.className = 'detail-connection-link';
        btn.textContent = other;
        btn.addEventListener('click', function () {
          var targetNode = state.data.nodes.find(function (n) { return n.id === other; });
          if (targetNode) {
            selectNode(targetNode);
            panToNode(targetNode);
          }
        });
        li.appendChild(document.createTextNode(direction + ' '));
        li.appendChild(btn);
        var typeSpan = document.createElement('span');
        typeSpan.className = 'detail-connection-type';
        typeSpan.textContent = l.type.replace(/_/g, ' ');
        li.appendChild(typeSpan);
        connList.appendChild(li);
      }
    });

    // Close button
    document.getElementById('detail-close').onclick = function () {
      deselectNode();
    };
  }

  function deselectNode() {
    state.selectedNode = null;
    state.nodeElements.classed('selected', false);
    document.getElementById('detail-empty').style.display = '';
    document.getElementById('detail-content').style.display = 'none';
  }

  function panToNode(node) {
    if (!state.svg || !state.zoom) return;
    var container = document.getElementById('network-graph');
    var width = container.clientWidth;
    var height = container.clientHeight;
    var scale = 1.2;
    var transform = d3.zoomIdentity
      .translate(width / 2 - node.x * scale, height / 2 - node.y * scale)
      .scale(scale);
    state.svg.transition().duration(600).call(state.zoom.transform, transform);
  }

  // --- Search ---
  function bindSearch(data) {
    var input = document.getElementById('node-search');
    var resultsEl = document.getElementById('search-results');

    input.addEventListener('input', function () {
      var query = input.value.toLowerCase().trim();
      resultsEl.innerHTML = '';

      if (query.length < 2) {
        resultsEl.classList.remove('open');
        return;
      }

      var matches = data.nodes.filter(function (n) {
        return n.label.toLowerCase().indexOf(query) !== -1;
      }).slice(0, 8);

      if (matches.length === 0) {
        resultsEl.classList.remove('open');
        return;
      }

      matches.forEach(function (n) {
        var btn = document.createElement('button');
        btn.className = 'search-result-item';
        btn.setAttribute('role', 'option');
        var color = TYPE_COLORS[n.type] || '#999';
        btn.innerHTML =
          '<span class="search-result-dot" style="background:' + color + '"></span>' +
          '<span>' + escapeHtml(n.label) + '</span>';
        btn.addEventListener('click', function () {
          selectNode(n);
          panToNode(n);
          highlightNeighborhood(n);
          resultsEl.classList.remove('open');
          input.value = n.label;
        });
        resultsEl.appendChild(btn);
      });

      resultsEl.classList.add('open');
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-wrapper')) {
        resultsEl.classList.remove('open');
      }
    });
  }

  // --- Tours ---
  function bindTours() {
    var tourBtns = document.querySelectorAll('.tour-btn');
    tourBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tourId = btn.getAttribute('data-tour');
        if (state.activeTour === tourId) {
          exitTour();
        } else {
          startTour(tourId);
        }
      });
    });
  }

  function startTour(tourId) {
    var tour = TOURS[tourId];
    if (!tour) return;

    state.activeTour = tourId;
    state.tourStep = 0;

    // Update button states
    document.querySelectorAll('.tour-btn').forEach(function (btn) {
      btn.classList.toggle('tour-active', btn.getAttribute('data-tour') === tourId);
    });

    showTourStep();
    createTourNarration();
  }

  function showTourStep() {
    var tour = TOURS[state.activeTour];
    if (!tour || state.tourStep >= tour.steps.length) {
      exitTour();
      return;
    }

    var step = tour.steps[state.tourStep];
    var highlightIds = new Set(step.nodes);

    // Find connected links between highlighted nodes
    var highlightLinkSet = new Set();
    state.data.links.forEach(function (l) {
      var s = typeof l.source === 'object' ? l.source.id : l.source;
      var t = typeof l.target === 'object' ? l.target.id : l.target;
      if (highlightIds.has(s) && highlightIds.has(t)) {
        highlightLinkSet.add(l);
      }
    });

    // Dim everything, then highlight tour nodes
    state.nodeElements
      .classed('dimmed', function (d) { return !highlightIds.has(d.id); })
      .classed('tour-highlight', function (d) { return highlightIds.has(d.id); });

    state.labelElements.classed('dimmed', function (d) {
      return !highlightIds.has(d.id);
    });

    state.linkElements
      .classed('dimmed', function (d) { return !highlightLinkSet.has(d); })
      .classed('tour-highlight', function (d) { return highlightLinkSet.has(d); })
      .classed('highlighted', false);

    // Pan to center of highlighted nodes
    var tourNodes = state.data.nodes.filter(function (n) { return highlightIds.has(n.id); });
    if (tourNodes.length > 0) {
      var cx = d3.mean(tourNodes, function (n) { return n.x; });
      var cy = d3.mean(tourNodes, function (n) { return n.y; });
      var container = document.getElementById('network-graph');
      var width = container.clientWidth;
      var height = container.clientHeight;
      var scale = 1.0;
      var transform = d3.zoomIdentity
        .translate(width / 2 - cx * scale, height / 2 - cy * scale)
        .scale(scale);
      state.svg.transition().duration(600).call(state.zoom.transform, transform);
    }

    updateTourNarration();
  }

  function createTourNarration() {
    // Remove existing
    var existing = document.querySelector('.tour-narration');
    if (existing) existing.remove();

    var narration = document.createElement('div');
    narration.className = 'tour-narration visible';
    narration.innerHTML =
      '<p class="tour-narration-step" id="tour-step-label"></p>' +
      '<p class="tour-narration-text" id="tour-step-text"></p>' +
      '<div class="tour-nav">' +
        '<button class="tour-nav-btn tour-exit" id="tour-exit-btn">Exit tour</button>' +
        '<div>' +
          '<button class="tour-nav-btn tour-prev" id="tour-prev-btn">Previous</button> ' +
          '<button class="tour-nav-btn tour-next" id="tour-next-btn">Next</button>' +
        '</div>' +
      '</div>';

    document.querySelector('.network-graph-area').appendChild(narration);

    document.getElementById('tour-exit-btn').addEventListener('click', exitTour);
    document.getElementById('tour-prev-btn').addEventListener('click', function () {
      if (state.tourStep > 0) {
        state.tourStep--;
        showTourStep();
      }
    });
    document.getElementById('tour-next-btn').addEventListener('click', function () {
      state.tourStep++;
      showTourStep();
    });
  }

  function updateTourNarration() {
    var tour = TOURS[state.activeTour];
    if (!tour) return;

    var stepLabel = document.getElementById('tour-step-label');
    var stepText = document.getElementById('tour-step-text');
    var prevBtn = document.getElementById('tour-prev-btn');
    var nextBtn = document.getElementById('tour-next-btn');

    if (!stepLabel) return;

    stepLabel.textContent = tour.title + ' \u2014 Step ' + (state.tourStep + 1) + ' of ' + tour.steps.length;
    stepText.textContent = tour.steps[state.tourStep].text;

    prevBtn.disabled = state.tourStep === 0;
    prevBtn.style.opacity = state.tourStep === 0 ? '0.4' : '1';

    if (state.tourStep >= tour.steps.length - 1) {
      nextBtn.textContent = 'Finish';
    } else {
      nextBtn.textContent = 'Next';
    }
  }

  function exitTour() {
    state.activeTour = null;
    state.tourStep = 0;

    document.querySelectorAll('.tour-btn').forEach(function (btn) {
      btn.classList.remove('tour-active');
    });

    var narration = document.querySelector('.tour-narration');
    if (narration) narration.remove();

    // Clear tour highlighting
    state.nodeElements.classed('dimmed', false).classed('tour-highlight', false);
    state.labelElements.classed('dimmed', false);
    state.linkElements.classed('dimmed', false).classed('tour-highlight', false).classed('highlighted', false);

    applyFilters(); // Re-apply filters if any
  }

  // --- Utility ---
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Boot ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

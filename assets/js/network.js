/* ==========================================================================
   D4ARF Network Visualization — Cytoscape.js investigative graph
   Phase 1: Core Cytoscape migration
   Phase 2: Path-finding UI + URL hash state
   ========================================================================== */

(function () {
  'use strict';

  // --- Entity type configuration ---
  var TYPE_CONFIG = {
    agency:                { label: 'Agency',         color: '#B91C1C', darkColor: '#EF4444',  shape: 'diamond' },
    official:              { label: 'Official',        color: '#1E3A5F', darkColor: '#4A90D9',  shape: 'ellipse' },
    bonds_representative:  { label: 'Bonds Rep',       color: '#B45309', darkColor: '#F59E0B',  shape: 'triangle' },
    organization:          { label: 'Organization',    color: '#B45309', darkColor: '#F59E0B',  shape: 'round-rectangle' },
    investigation_finding: { label: 'Finding',         color: '#6B7280', darkColor: '#9CA3AF',  shape: 'rectangle' },
    key_document:          { label: 'Key Document',    color: '#6B7280', darkColor: '#9CA3AF',  shape: 'round-pentagon' },
    legislation:           { label: 'Legislation',     color: '#B91C1C', darkColor: '#EF4444',  shape: 'star' },
    legal_standard:        { label: 'Legal Standard',  color: '#B91C1C', darkColor: '#EF4444',  shape: 'hexagon' },
    strategic_framework:   { label: 'Strategy',        color: '#6B7280', darkColor: '#9CA3AF',  shape: 'vee' },
    foia_request:          { label: 'FOIA Request',    color: '#6B7280', darkColor: '#9CA3AF',  shape: 'tag' },
    foia_strategy:         { label: 'FOIA Strategy',   color: '#6B7280', darkColor: '#9CA3AF',  shape: 'round-hexagon' },
    evidence_assessment:   { label: 'Assessment',      color: '#6B7280', darkColor: '#9CA3AF',  shape: 'cut-rectangle' }
  };

  function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function getTypeColor(type) {
    var cfg = TYPE_CONFIG[type];
    if (!cfg) return '#999';
    return isDarkMode() ? cfg.darkColor : cfg.color;
  }

  // --- Guided tour definitions ---
  var TOURS = {
    'milligan-chain': {
      title: 'The Milligan Chain',
      steps: [
        { nodes: ['Dennis Milligan'], text: 'Dennis Milligan served as State Treasurer (~2015\u20132019) where he initiated the Israel Bonds program. He later became Auditor of State \u2014 an office with no investment authority.' },
        { nodes: ['Dennis Milligan', 'Arkansas State Treasury', 'Auditor of State'], text: 'Despite holding no investment authority as Auditor, Milligan used his office to coordinate Israel Bonds advocacy across multiple agencies.' },
        { nodes: ['Dennis Milligan', 'Jason Brady', 'APERS', 'ATRS'], text: 'Jason Brady \u2014 Milligan\u2019s direct report at the Auditor\u2019s office \u2014 served on the APERS board and initiated the Israel Bonds request at ATRS. He was the operational conduit across both pension systems.' },
        { nodes: ['Dennis Milligan', 'Jason Brady', 'April 2025 Israel Bonds Tour', 'Lawrence Berman', 'Bradley Young'], text: 'In April 2025, the Auditor\u2019s office organized a 2-day tour of Arkansas state government for Israel Bonds sales reps. Within weeks, both APERS and ATRS authorized up to $50 million each.' },
        { nodes: ['Dennis Milligan', 'Stacy Peterson', 'SFOF', 'SFOF Conduit Role'], text: 'After the votes, Milligan\u2019s communications director distributed success stories through SFOF to encourage other states to replicate. The full advocacy lifecycle \u2014 from meetings to votes to interstate promotion \u2014 operated from the Auditor\u2019s office.' }
      ]
    },
    'seller-as-analyst': {
      title: 'Seller as Analyst',
      steps: [
        { nodes: ['Seller as Analyst Problem', 'No Independent Credit Analysis'], text: 'Across 909 FOIA documents from 4 agencies, zero independent credit analyses of Israel Bonds exist. The only "analysis" came from the entity selling the bonds.' },
        { nodes: ['Lawrence Berman', 'Bradley Young', 'Stuart Garawitz', 'Israel Bonds / DCI'], text: 'Israel Bonds representatives provided all investment materials: rate sheets, economic briefings, marketing emails, and "exclusive" presentations. These same people are responsible for selling $10+ billion in bonds.' },
        { nodes: ['Aon Hewitt Investment Consulting', 'ATRS No Independent Analysis', 'ATRS'], text: 'ATRS\u2019s own consultant Aon provided comprehensive due diligence for other investments like KKR. For Israel Bonds: nothing. The Executive Director admitted in advance that Aon "will not be making a formal recommendation."' },
        { nodes: ['Seller as Analyst Problem', 'Arkansas State Treasury', 'APERS', 'ATRS'], text: 'The pattern repeated across all three investing entities. In every case, the bond seller\u2019s materials were the only investment rationale available when decisions were made.' }
      ]
    },
    'sfof-pipeline': {
      title: 'The SFOF Pipeline',
      steps: [
        { nodes: ['SFOF', 'Derek A. Kreifels'], text: 'The State Financial Officers Foundation (SFOF) is a networking organization connecting state treasurers and financial officers nationally. Derek Kreifels serves as Executive Director.' },
        { nodes: ['SFOF', 'Dennis Milligan', 'Israel Bonds / DCI'], text: 'Milligan served as SFOF National Chair (~2019\u20132020). SFOF forwarded Israel Bonds events \u2014 including a "Celebration with Prime Minister Netanyahu" \u2014 to state officials. The organization functioned as a marketing channel.' },
        { nodes: ['SFOF Conduit Role', 'Inter-State Israel Bonds Coordination', 'Glenn Hegar'], text: 'The SFOF network connected Arkansas officials with treasurers from Texas, Arizona, Idaho, North Carolina, and others. Texas Comptroller Hegar used nearly identical political framing for his $140M in Israel Bonds purchases.' },
        { nodes: ['Stacy Peterson', 'SFOF Conduit Role', 'Adam Schwend'], text: 'After APERS and ATRS voted, Milligan\u2019s communications director emailed SFOF: "Feel free to pass along to any member states you think might be interested. The Auditor has very good contact." The interstate replication pipeline is documented.' }
      ]
    },
    'authorization-gap': {
      title: 'The Authorization Gap',
      steps: [
        { nodes: ['Authorization Gap', 'Absence of Normal Fiduciary Processes'], text: 'For a combined potential allocation of $155 million, standard fiduciary processes are completely absent: no independent credit analysis, no risk assessment, no yield comparison, no consultant review.' },
        { nodes: ['Authorization Gap', 'Arkansas State Treasury', 'Board of Finance'], text: 'Treasury: Purchases authorized by "executive team" with no documented Board of Finance deliberation. The only internal analysis is a 2-page document created years after tens of millions were invested.' },
        { nodes: ['Authorization Gap', 'ATRS', 'ATRS Resolution 2025-22', 'Danny Knight'], text: 'ATRS: The Board adopted Resolution 2025-22 for $50M based on the Executive Director\u2019s personal opinion, not a formal consultant recommendation. Board Chair Danny Knight signed the resolution.' },
        { nodes: ['Symmetry Argument', 'Act 710', 'Act 644', 'Arkansas Prudent Investor Standard'], text: 'Arkansas Act 710 requires "financial merit" for divestment. The same standard should apply to purchases. The complete absence of financial merit analysis for Israel Bonds purchases violates the spirit of Arkansas\u2019s own laws.' }
      ]
    }
  };

  // --- State ---
  var state = {
    cy: null,
    rawData: null,
    fuse: null,
    activeFilters: new Set(),
    activeTour: null,
    tourStep: 0,
    tourTriggerEl: null,
    selectedNodeId: null,
    currentLayout: 'fcose',
    // Phase 2 state
    pathSource: null,
    pathTarget: null,
    pathResult: null,
    hashUpdateTimer: null,
    restoringHash: false
  };

  // --- Utility ---
  function debounce(fn, delay) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    };
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // --- Transform D3 data to Cytoscape elements ---
  function transformData(data) {
    var linkCounts = {};
    data.links.forEach(function (l) {
      linkCounts[l.source] = (linkCounts[l.source] || 0) + 1;
      linkCounts[l.target] = (linkCounts[l.target] || 0) + 1;
    });

    var nodes = data.nodes.map(function (n) {
      var cfg = TYPE_CONFIG[n.type] || {};
      return {
        group: 'nodes',
        data: {
          id: n.id, label: n.label, type: n.type,
          observations: n.observations || [],
          observationCount: n.observationCount || (n.observations ? n.observations.length : 0),
          connections: linkCounts[n.id] || 0,
          color: cfg.color || '#999', darkColor: cfg.darkColor || '#999',
          shape: cfg.shape || 'ellipse'
        }
      };
    });

    var edges = data.links.map(function (l, i) {
      return {
        group: 'edges',
        data: {
          id: 'e' + i, source: l.source, target: l.target,
          type: l.type || '',
          label: l.label || (l.type ? l.type.replace(/_/g, ' ') : '')
        }
      };
    });

    return nodes.concat(edges);
  }

  // --- Build Cytoscape stylesheet ---
  function buildStylesheet() {
    var dark = isDarkMode();
    var nodeFontColor = dark ? '#E5E7EB' : '#374151';
    var edgeColor = dark ? 'rgba(107, 114, 128, 0.35)' : 'rgba(0, 0, 0, 0.08)';
    var nodeStroke = dark ? '#1A1A24' : '#ffffff';

    return [
      { selector: 'node', style: {
        'label': 'data(label)',
        'background-color': function (ele) { return dark ? ele.data('darkColor') : ele.data('color'); },
        'shape': 'data(shape)',
        'width': 'mapData(connections, 0, 30, 18, 56)',
        'height': 'mapData(connections, 0, 30, 18, 56)',
        'font-family': 'Inter, system-ui, sans-serif',
        'font-size': '10px', 'font-weight': 600, 'color': nodeFontColor,
        'text-valign': 'bottom', 'text-halign': 'center', 'text-margin-y': 6,
        'text-max-width': '100px', 'text-wrap': 'ellipsis',
        'border-width': 2, 'border-color': nodeStroke,
        'overlay-padding': 4, 'overlay-opacity': 0, 'z-index': 10,
        'min-zoomed-font-size': 8,
        'text-background-color': dark ? 'rgba(22, 22, 30, 0.85)' : 'rgba(248, 247, 245, 0.85)',
        'text-background-opacity': 1, 'text-background-padding': '2px',
        'text-background-shape': 'roundrectangle'
      }},
      { selector: 'node[connections < 3]', style: { 'font-size': '0px', 'text-opacity': 0 }},
      { selector: 'edge', style: {
        'width': 1, 'line-color': edgeColor, 'curve-style': 'bezier',
        'opacity': 0.7, 'target-arrow-shape': 'none'
      }},
      { selector: 'node:selected', style: {
        'border-color': '#0C7489', 'border-width': 3,
        'overlay-opacity': 0.08, 'overlay-color': '#0C7489',
        'font-size': '11px', 'text-opacity': 1, 'z-index': 100
      }},
      { selector: '.highlighted', style: { 'opacity': 1, 'z-index': 50 }},
      { selector: 'node.highlighted', style: { 'border-color': '#0C7489', 'border-width': 3, 'font-size': '11px', 'text-opacity': 1 }},
      { selector: 'edge.highlighted', style: { 'line-color': '#0C7489', 'width': 2.5, 'opacity': 0.8, 'z-index': 50 }},
      { selector: '.tour-highlighted', style: { 'opacity': 1, 'z-index': 60 }},
      { selector: 'node.tour-highlighted', style: { 'border-color': '#0C7489', 'border-width': 3, 'font-size': '11px', 'text-opacity': 1 }},
      { selector: 'edge.tour-highlighted', style: { 'line-color': '#0C7489', 'width': 2.5, 'opacity': 0.7 }},
      // Path-finding highlight (Phase 2)
      { selector: '.path-highlighted', style: { 'opacity': 1, 'z-index': 70 }},
      { selector: 'node.path-highlighted', style: { 'border-color': '#0C7489', 'border-width': 3, 'font-size': '11px', 'text-opacity': 1 }},
      { selector: 'edge.path-highlighted', style: { 'line-color': '#0C7489', 'width': 3, 'opacity': 0.9, 'z-index': 70 }},
      { selector: '.path-endpoint', style: {
        'border-color': '#0C7489', 'border-width': 4,
        'overlay-opacity': 0.12, 'overlay-color': '#0C7489',
        'font-size': '12px', 'text-opacity': 1, 'z-index': 80
      }},
      { selector: '.faded', style: { 'opacity': 0.08 }},
      { selector: '.dimmed', style: { 'opacity': 0.1 }},
      { selector: '.neighbor', style: { 'opacity': 1, 'font-size': '10px', 'text-opacity': 1, 'z-index': 40 }},
      { selector: 'edge.neighbor', style: { 'line-color': 'rgba(12, 116, 137, 0.4)', 'width': 2, 'opacity': 0.7 }}
    ];
  }

  // --- Init ---
  function init() {
    var scriptEl = document.querySelector('script[data-graph-url]');
    var dataUrl = scriptEl
      ? scriptEl.getAttribute('data-graph-url')
      : '/assets/js/network-graph.json';

    fetch(dataUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        state.rawData = data;
        var elements = transformData(data);
        buildFilters(data);
        buildLegend(data);
        initCytoscape(elements);
        initFuseSearch(data);
        initPathfinding(data);
        bindTours();
        bindZoomControls();
        bindLayoutToggle();
        buildAccessibleTable(data);
        document.getElementById('graph-loading').classList.add('hidden');
        restoreHashState();
      })
      .catch(function (err) {
        console.error('Failed to load network data:', err);
        document.getElementById('graph-loading').innerHTML =
          '<p>Failed to load data. Please refresh.</p>';
      });
  }

  // --- Initialize Cytoscape ---
  function initCytoscape(elements) {
    if (typeof cytoscapeFcose !== 'undefined') {
      cytoscape.use(cytoscapeFcose);
    }
    if (typeof cytoscapeDagre !== 'undefined') {
      cytoscape.use(cytoscapeDagre);
    }

    state.cy = cytoscape({
      container: document.getElementById('network-graph'),
      elements: elements,
      style: buildStylesheet(),
      layout: {
        name: 'fcose', animate: false, quality: 'default', randomize: true,
        nodeDimensionsIncludeLabels: false,
        idealEdgeLength: function () { return 120; },
        nodeRepulsion: function () { return 8000; },
        edgeElasticity: function () { return 0.45; },
        gravity: 0.3, gravityRange: 1.5, numIter: 2500, padding: 50
      },
      minZoom: 0.15, maxZoom: 4, wheelSensitivity: 0.3,
      boxSelectionEnabled: false, selectionType: 'single',
      touchTapThreshold: 8, desktopTapThreshold: 4
    });

    var cy = state.cy;

    cy.on('tap', 'node', function (evt) {
      selectNode(evt.target);
    });

    cy.on('tap', function (evt) {
      if (evt.target === cy) {
        deselectNode();
        if (!state.activeTour && !state.pathResult) clearHighlight();
      }
    });

    cy.on('mouseover', 'node', function (evt) {
      if (!state.activeTour && !state.pathResult) {
        highlightNeighborhood(evt.target);
      }
    });

    cy.on('mouseout', 'node', function () {
      if (!state.activeTour && !state.selectedNodeId && !state.pathResult) {
        clearHighlight();
        applyFilters();
      }
    });

    // Keyboard: / for search, Escape to exit
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && !e.target.matches('input, textarea, select')) {
        e.preventDefault();
        document.getElementById('node-search').focus();
        return;
      }
      if (e.key === 'Escape') {
        if (state.activeTour) {
          exitTour();
        } else if (state.pathResult) {
          clearPath();
        } else {
          deselectNode();
          clearHighlight();
          applyFilters();
        }
        return;
      }
    });

    // Dismiss hint on interaction
    cy.one('tapstart pan zoom', function () {
      var hint = document.getElementById('graph-hint');
      if (hint) hint.classList.add('hidden');
    });
  }

  // --- Highlight neighborhood ---
  function highlightNeighborhood(node) {
    var cy = state.cy;
    var neighborhood = node.closedNeighborhood();

    cy.elements().removeClass('highlighted neighbor faded');
    cy.elements().not(neighborhood).addClass('faded');
    neighborhood.addClass('highlighted');
    neighborhood.edges().addClass('neighbor');
    node.connectedEdges().addClass('neighbor');
    neighborhood.nodes().addClass('neighbor');
  }

  function clearHighlight() {
    if (!state.cy) return;
    state.cy.elements().removeClass('highlighted neighbor faded tour-highlighted path-highlighted path-endpoint');
  }

  // --- Select node ---
  function selectNode(node) {
    var cy = state.cy;
    state.selectedNodeId = node.id();

    cy.nodes().unselect();
    node.select();
    if (!state.pathResult) highlightNeighborhood(node);

    document.getElementById('detail-empty').style.display = 'none';
    var content = document.getElementById('detail-content');
    content.style.display = 'block';

    var data = node.data();
    var color = getTypeColor(data.type);
    var badge = document.getElementById('detail-type');
    badge.textContent = (TYPE_CONFIG[data.type] || {}).label || data.type;
    badge.style.backgroundColor = color;

    document.getElementById('detail-name').textContent = data.label;

    var connCountEl = document.getElementById('detail-conn-count');
    if (connCountEl) {
      connCountEl.textContent = node.connectedEdges().length + ' connections';
    }

    var statusEl = document.getElementById('detail-status');
    if (statusEl) {
      statusEl.textContent = data.label + ' selected, ' + node.connectedEdges().length + ' connections. Details panel opened.';
    }

    // Observations
    var obsList = document.getElementById('detail-observations');
    obsList.innerHTML = '';
    var observations = data.observations || [];
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
      more.textContent = '+ ' + (observations.length - showCount) + ' more facts in the full record';
      obsList.appendChild(more);
    }

    // Connections
    var connList = document.getElementById('detail-connections');
    connList.innerHTML = '';
    node.connectedEdges().forEach(function (edge) {
      var otherNode = edge.source().id() === node.id() ? edge.target() : edge.source();
      var direction = edge.source().id() === node.id() ? '\u2192' : '\u2190';
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.className = 'detail-connection-link';
      btn.textContent = otherNode.data('label');
      btn.addEventListener('click', function () {
        selectNode(otherNode);
        cy.animate({
          center: { eles: otherNode },
          zoom: Math.max(cy.zoom(), 1.2)
        }, { duration: 500 });
      });
      li.appendChild(document.createTextNode(direction + ' '));
      li.appendChild(btn);
      var typeSpan = document.createElement('span');
      typeSpan.className = 'detail-connection-type';
      typeSpan.textContent = (edge.data('type') || '').replace(/_/g, ' ');
      li.appendChild(typeSpan);
      connList.appendChild(li);
    });

    document.getElementById('detail-close').onclick = function () {
      deselectNode();
      clearHighlight();
      applyFilters();
      if (state.pathResult) reapplyPathHighlight();
    };

    saveHashState();
  }

  function deselectNode() {
    state.selectedNodeId = null;
    if (state.cy) state.cy.nodes().unselect();
    document.getElementById('detail-empty').style.display = '';
    document.getElementById('detail-content').style.display = 'none';
    saveHashState();
  }

  // --- Build type filter buttons ---
  function buildFilters(data) {
    var container = document.getElementById('type-filters');
    var counts = {};
    data.nodes.forEach(function (n) {
      counts[n.type] = (counts[n.type] || 0) + 1;
    });

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
      var cfg = TYPE_CONFIG[type] || {};
      var btn = document.createElement('button');
      btn.className = 'type-filter';
      btn.setAttribute('data-type', type);
      btn.innerHTML =
        '<span class="type-filter-dot" style="background:' + getTypeColor(type) + '"></span>' +
        '<span class="type-filter-label">' + (cfg.label || type) + '</span>' +
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
    document.querySelectorAll('.type-filter').forEach(function (btn) {
      var type = btn.getAttribute('data-type');
      if (type === 'all') {
        btn.classList.toggle('active', state.activeFilters.size === 0);
      } else {
        btn.classList.toggle('active', state.activeFilters.has(type));
      }
    });
  }

  function applyFilters() {
    if (!state.cy) return;
    var cy = state.cy;
    var hasFilter = state.activeFilters.size > 0;

    cy.batch(function () {
      cy.elements().removeClass('dimmed');
      if (hasFilter) {
        cy.nodes().forEach(function (node) {
          if (!state.activeFilters.has(node.data('type'))) node.addClass('dimmed');
        });
        cy.edges().forEach(function (edge) {
          var srcType = edge.source().data('type');
          var tgtType = edge.target().data('type');
          if (!state.activeFilters.has(srcType) && !state.activeFilters.has(tgtType)) {
            edge.addClass('dimmed');
          }
        });
      }
    });
  }

  // --- Build legend ---
  function buildLegend(data) {
    var container = document.getElementById('legend');
    data.entityTypes.forEach(function (type) {
      var cfg = TYPE_CONFIG[type] || {};
      var item = document.createElement('div');
      item.className = 'legend-item';
      item.setAttribute('data-type', type);
      item.innerHTML =
        '<span class="legend-dot" style="background:' + getTypeColor(type) + '"></span>' +
        '<span>' + (cfg.label || type) + '</span>';
      container.appendChild(item);
    });
  }

  // --- Fuse.js fuzzy search ---
  function initFuseSearch(data) {
    var searchData = data.nodes.map(function (n) {
      return {
        id: n.id, label: n.label, type: n.type,
        typeLabel: (TYPE_CONFIG[n.type] || {}).label || n.type
      };
    });

    state.fuse = new Fuse(searchData, {
      keys: ['label', 'typeLabel'],
      threshold: 0.35,
      distance: 200,
      minMatchCharLength: 2
    });

    var input = document.getElementById('node-search');
    var resultsEl = document.getElementById('search-results');
    var activeIndex = -1;

    input.addEventListener('input', function () {
      var query = input.value.trim();
      resultsEl.innerHTML = '';
      activeIndex = -1;
      input.removeAttribute('aria-activedescendant');

      if (query.length < 2) {
        resultsEl.classList.remove('open');
        input.setAttribute('aria-expanded', 'false');
        return;
      }

      var results = state.fuse.search(query).slice(0, 8);

      if (results.length === 0) {
        resultsEl.classList.remove('open');
        input.setAttribute('aria-expanded', 'false');
        return;
      }

      results.forEach(function (r, idx) {
        var item = r.item;
        var btn = document.createElement('button');
        btn.className = 'search-result-item';
        btn.id = 'search-result-' + idx;
        btn.setAttribute('role', 'option');
        btn.setAttribute('aria-selected', 'false');
        btn.innerHTML =
          '<span class="search-result-dot" style="background:' + getTypeColor(item.type) + '"></span>' +
          '<span>' + escapeHtml(item.label) + '</span>' +
          '<span class="search-result-type">' + escapeHtml(item.typeLabel) + '</span>';
        btn.addEventListener('click', function () {
          navigateToNode(item.id);
          resultsEl.classList.remove('open');
          input.setAttribute('aria-expanded', 'false');
          input.removeAttribute('aria-activedescendant');
          input.value = item.label;
        });
        resultsEl.appendChild(btn);
      });

      resultsEl.classList.add('open');
      input.setAttribute('aria-expanded', 'true');
    });

    // Keyboard navigation within search results
    input.addEventListener('keydown', function (e) {
      var items = resultsEl.querySelectorAll('.search-result-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        updateActiveResult(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        updateActiveResult(items);
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        items[activeIndex].click();
      }
    });

    function updateActiveResult(items) {
      items.forEach(function (it, i) {
        it.classList.toggle('active', i === activeIndex);
        it.setAttribute('aria-selected', i === activeIndex ? 'true' : 'false');
      });
      input.setAttribute('aria-activedescendant',
        activeIndex >= 0 ? 'search-result-' + activeIndex : '');
    }

    // Close on click outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-wrapper')) {
        resultsEl.classList.remove('open');
        input.setAttribute('aria-expanded', 'false');
        input.removeAttribute('aria-activedescendant');
      }
    });
  }

  function navigateToNode(nodeId) {
    var cy = state.cy;
    var node = cy.getElementById(nodeId);
    if (node.empty()) return;

    selectNode(node);
    cy.animate({
      center: { eles: node },
      zoom: Math.max(cy.zoom(), 1.2)
    }, { duration: 500 });
  }

  // =========================================================================
  // PATH-FINDING UI (Phase 2)
  // =========================================================================

  function initPathfinding(data) {
    var sourceSelect = document.getElementById('path-source');
    var targetSelect = document.getElementById('path-target');
    var findBtn = document.getElementById('path-find-btn');
    var clearBtn = document.getElementById('path-clear-btn');

    if (!sourceSelect || !targetSelect) return;

    // Populate dropdowns sorted alphabetically
    var sortedNodes = data.nodes.slice().sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });

    sortedNodes.forEach(function (n) {
      var optA = document.createElement('option');
      optA.value = n.id;
      optA.textContent = n.label;
      sourceSelect.appendChild(optA);

      var optB = document.createElement('option');
      optB.value = n.id;
      optB.textContent = n.label;
      targetSelect.appendChild(optB);
    });

    findBtn.addEventListener('click', findPath);
    clearBtn.addEventListener('click', clearPath);

    var swapBtn = document.getElementById('path-swap-btn');
    if (swapBtn) {
      swapBtn.addEventListener('click', function () {
        var tmp = sourceSelect.value;
        sourceSelect.value = targetSelect.value;
        targetSelect.value = tmp;
      });
    }
  }

  function findPath() {
    var cy = state.cy;
    var sourceId = document.getElementById('path-source').value;
    var targetId = document.getElementById('path-target').value;
    var resultEl = document.getElementById('path-result');
    var clearBtn = document.getElementById('path-clear-btn');

    if (!sourceId || !targetId) {
      resultEl.innerHTML = '<p class="path-error">Select both a source and target entity.</p>';
      resultEl.style.display = 'block';
      return;
    }

    if (sourceId === targetId) {
      resultEl.innerHTML = '<p class="path-error">Source and target must be different entities.</p>';
      resultEl.style.display = 'block';
      return;
    }

    var sourceNode = cy.getElementById(sourceId);
    var targetNode = cy.getElementById(targetId);

    if (sourceNode.empty() || targetNode.empty()) {
      resultEl.innerHTML = '<p class="path-error">Entity not found in graph.</p>';
      resultEl.style.display = 'block';
      return;
    }

    if (state.activeTour) exitTour();

    try {
      var dijkstra = cy.elements().dijkstra({ root: sourceNode, directed: false });
      var dist = dijkstra.distanceTo(targetNode);

      if (dist === Infinity) {
        resultEl.innerHTML = '<p class="path-error">No path exists between these entities.</p>';
        resultEl.style.display = 'block';
        state.pathResult = null;
        clearHighlight();
        applyFilters();
        saveHashState();
        return;
      }

      var path = dijkstra.pathTo(targetNode);
      state.pathSource = sourceId;
      state.pathTarget = targetId;
      state.pathResult = path;

      // Highlight path
      cy.batch(function () {
        cy.elements().removeClass('highlighted neighbor faded tour-highlighted path-highlighted path-endpoint');
        cy.elements().not(path).addClass('faded');
        path.addClass('path-highlighted');
        sourceNode.addClass('path-endpoint');
        targetNode.addClass('path-endpoint');
      });

      cy.animate({ fit: { eles: path, padding: 80 } }, { duration: 600 });

      // Build path narration
      var pathNodes = path.nodes();
      var pathEdges = path.edges();
      var hops = pathEdges.length;

      var html = '<p class="path-summary">' + hops + ' hop' + (hops !== 1 ? 's' : '') + '</p>';
      html += '<ol class="path-steps">';

      for (var i = 0; i < pathNodes.length; i++) {
        var pn = pathNodes[i];
        html += '<li class="path-step">';
        html += '<button class="path-step-node" data-node-id="' + escapeHtml(pn.id()) + '">';
        html += '<span class="path-step-dot" style="background:' + getTypeColor(pn.data('type')) + '"></span>';
        html += escapeHtml(pn.data('label'));
        html += '</button>';
        if (i < pathEdges.length) {
          var edgeLabel = (pathEdges[i].data('type') || '').replace(/_/g, ' ');
          html += '<span class="path-step-edge">\u2192 ' + escapeHtml(edgeLabel) + '</span>';
        }
        html += '</li>';
      }
      html += '</ol>';

      resultEl.innerHTML = html;
      resultEl.style.display = 'block';
      clearBtn.style.display = '';

      // Bind click handlers on path step nodes
      resultEl.querySelectorAll('.path-step-node').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var nodeId = btn.getAttribute('data-node-id');
          var node = cy.getElementById(nodeId);
          if (node.nonempty()) {
            selectNode(node);
            cy.animate({
              center: { eles: node },
              zoom: Math.max(cy.zoom(), 1.5)
            }, { duration: 400 });
          }
        });
      });

      // Screen reader announcement
      var statusEl = document.getElementById('detail-status');
      if (statusEl) {
        statusEl.textContent = 'Path found: ' + hops + ' hops from ' +
          sourceNode.data('label') + ' to ' + targetNode.data('label') + '.';
      }

    } catch (e) {
      resultEl.innerHTML = '<p class="path-error">No path exists between these entities.</p>';
      resultEl.style.display = 'block';
      state.pathResult = null;
    }

    saveHashState();
  }

  function reapplyPathHighlight() {
    if (!state.pathResult || !state.cy) return;
    var cy = state.cy;
    var path = state.pathResult;
    var sourceNode = cy.getElementById(state.pathSource);
    var targetNode = cy.getElementById(state.pathTarget);

    cy.batch(function () {
      cy.elements().removeClass('highlighted neighbor faded tour-highlighted path-highlighted path-endpoint');
      cy.elements().not(path).addClass('faded');
      path.addClass('path-highlighted');
      if (sourceNode.nonempty()) sourceNode.addClass('path-endpoint');
      if (targetNode.nonempty()) targetNode.addClass('path-endpoint');
    });
  }

  function clearPath() {
    state.pathSource = null;
    state.pathTarget = null;
    state.pathResult = null;

    var sourceSelect = document.getElementById('path-source');
    var targetSelect = document.getElementById('path-target');
    var resultEl = document.getElementById('path-result');
    var clearBtn = document.getElementById('path-clear-btn');

    if (sourceSelect) sourceSelect.value = '';
    if (targetSelect) targetSelect.value = '';
    if (resultEl) { resultEl.innerHTML = ''; resultEl.style.display = 'none'; }
    if (clearBtn) clearBtn.style.display = 'none';

    clearHighlight();
    applyFilters();
    saveHashState();
  }

  // =========================================================================
  // URL HASH STATE (Phase 2)
  //
  // Encodes view state into URL hash for shareable links.
  // saveHashState() is debounced at 300ms via setTimeout to avoid
  // thrashing history.replaceState on rapid state changes.
  //
  // restoringHash flag prevents save/restore loops during init:
  // restoreHashState() calls findPath() which calls saveHashState(),
  // but saves are suppressed until the 1000ms restoration window closes.
  // =========================================================================

  function saveHashState() {
    if (state.restoringHash) return;
    clearTimeout(state.hashUpdateTimer);
    state.hashUpdateTimer = setTimeout(function () {
      var params = new URLSearchParams();

      if (state.selectedNodeId) params.set('n', state.selectedNodeId);
      if (state.currentLayout !== 'fcose') params.set('l', state.currentLayout);
      if (state.activeTour) {
        params.set('t', state.activeTour);
        params.set('s', String(state.tourStep));
      }
      if (state.pathSource && state.pathTarget && state.pathResult) {
        params.set('from', state.pathSource);
        params.set('to', state.pathTarget);
      }

      var hash = params.toString();
      history.replaceState(null, '', window.location.pathname + (hash ? '#' + hash : ''));
    }, 300);
  }

  function restoreHashState() {
    var hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;

    state.restoringHash = true;
    var params = new URLSearchParams(hash);

    // Restore layout first — affects node positions for subsequent operations
    var layout = params.get('l');
    if (layout === 'dagre' && state.currentLayout !== 'dagre') {
      var layoutBtn = document.getElementById('layout-toggle');
      if (layoutBtn) layoutBtn.click();
    }

    // Restore path (before tour — tour would clear it).
    // 100ms delay: let layout animation start before running Dijkstra
    var pathFrom = params.get('from');
    var pathTo = params.get('to');
    if (pathFrom && pathTo) {
      var sourceSelect = document.getElementById('path-source');
      var targetSelect = document.getElementById('path-target');
      if (sourceSelect && targetSelect) {
        sourceSelect.value = pathFrom;
        targetSelect.value = pathTo;
        setTimeout(function () { findPath(); }, 100);
      }
    }

    // Restore tour
    var tourId = params.get('t');
    var tourStep = parseInt(params.get('s'), 10);
    if (tourId && TOURS[tourId]) {
      state.activeTour = tourId;
      state.tourStep = isNaN(tourStep) ? 0 : Math.min(tourStep, TOURS[tourId].steps.length - 1);
      state.tourTriggerEl = document.querySelector('.tour-btn[data-tour="' + tourId + '"]');
      document.querySelectorAll('.tour-btn').forEach(function (btn) {
        btn.classList.toggle('tour-active', btn.getAttribute('data-tour') === tourId);
      });
      showTourStep();
      createTourNarration();
    }

    // Restore selected node last.
    // 200ms if no path; 600ms if path (wait for Dijkstra + fit animation)
    var nodeId = params.get('n');
    if (nodeId && !tourId) {
      setTimeout(function () {
        var node = state.cy.getElementById(nodeId);
        if (node.nonempty()) {
          selectNode(node);
          state.cy.animate({ center: { eles: node }, zoom: 1.2 }, { duration: 400 });
        }
      }, pathFrom ? 600 : 200);
    }

    // Release save-suppression after all restoration completes
    setTimeout(function () { state.restoringHash = false; }, 1000);
  }

  // Back/forward nav: reload for clean state (avoids complex state diffing)
  window.addEventListener('popstate', function () {
    window.location.reload();
  });

  // =========================================================================
  // ZOOM CONTROLS
  // =========================================================================

  function bindZoomControls() {
    var cy = state.cy;

    document.getElementById('zoom-in').addEventListener('click', function () {
      cy.animate({ zoom: cy.zoom() * 1.4, center: { eles: cy.elements() } }, { duration: 300 });
    });

    document.getElementById('zoom-out').addEventListener('click', function () {
      cy.animate({ zoom: cy.zoom() * 0.7, center: { eles: cy.elements() } }, { duration: 300 });
    });

    document.getElementById('zoom-reset').addEventListener('click', function () {
      cy.animate({ fit: { eles: cy.elements(), padding: 50 } }, { duration: 500 });
    });
  }

  // =========================================================================
  // LAYOUT TOGGLE
  // =========================================================================

  function bindLayoutToggle() {
    var btn = document.getElementById('layout-toggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var cy = state.cy;
      if (state.currentLayout === 'fcose') {
        state.currentLayout = 'dagre';
        btn.setAttribute('aria-label', 'Switch to force-directed layout');
        btn.title = 'Switch to force-directed layout';
        btn.querySelector('.layout-label').textContent = 'Hierarchical';
        cy.layout({
          name: 'dagre', rankDir: 'TB', nodeSep: 30, rankSep: 60,
          edgeSep: 10, animate: true, animationDuration: 600, padding: 50
        }).run();
      } else {
        state.currentLayout = 'fcose';
        btn.setAttribute('aria-label', 'Switch to hierarchical layout');
        btn.title = 'Switch to hierarchical layout';
        btn.querySelector('.layout-label').textContent = 'Force';
        cy.layout({
          name: 'fcose', animate: true, animationDuration: 600,
          quality: 'default', randomize: false, nodeDimensionsIncludeLabels: false,
          idealEdgeLength: function () { return 120; },
          nodeRepulsion: function () { return 8000; },
          edgeElasticity: function () { return 0.45; },
          gravity: 0.3, gravityRange: 1.5, numIter: 2500, padding: 50
        }).run();
      }
      saveHashState();
    });
  }

  // =========================================================================
  // GUIDED TOURS
  // =========================================================================

  function bindTours() {
    document.querySelectorAll('.tour-btn').forEach(function (btn) {
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
    if (state.pathResult) clearPath();
    state.activeTour = tourId;
    state.tourStep = 0;
    state.tourTriggerEl = document.querySelector('.tour-btn[data-tour="' + tourId + '"]');

    document.querySelectorAll('.tour-btn').forEach(function (btn) {
      btn.classList.toggle('tour-active', btn.getAttribute('data-tour') === tourId);
    });

    showTourStep();
    createTourNarration();
    saveHashState();
  }

  function showTourStep() {
    var tour = TOURS[state.activeTour];
    if (!tour || state.tourStep >= tour.steps.length) {
      exitTour();
      return;
    }

    var cy = state.cy;
    var step = tour.steps[state.tourStep];
    var highlightNodeIds = step.nodes;

    // Find Cytoscape nodes matching step node IDs
    var tourNodes = cy.collection();
    highlightNodeIds.forEach(function (nid) {
      var found = cy.getElementById(nid);
      if (found.nonempty()) {
        tourNodes = tourNodes.union(found);
      }
    });

    // Find edges between tour nodes
    var tourEdges = cy.collection();
    tourNodes.forEach(function (n1) {
      tourNodes.forEach(function (n2) {
        if (n1.id() !== n2.id()) {
          var connecting = n1.edgesWith(n2);
          tourEdges = tourEdges.union(connecting);
        }
      });
    });

    var tourEles = tourNodes.union(tourEdges);

    // Dijkstra paths between tour nodes for better connectivity.
    // Compute once per source node (N-1 calls instead of N*(N-1)/2).
    if (tourNodes.length >= 2) {
      for (var i = 0; i < tourNodes.length - 1; i++) {
        var dijkstra = cy.elements().dijkstra({
          root: tourNodes[i],
          directed: false
        });
        for (var j = i + 1; j < tourNodes.length; j++) {
          try {
            var path = dijkstra.pathTo(tourNodes[j]);
            if (path && path.length > 0) {
              tourEles = tourEles.union(path);
            }
          } catch (e) {
            // Path not found, that's fine
          }
        }
      }
    }

    // Apply classes
    cy.batch(function () {
      cy.elements().removeClass('tour-highlighted faded highlighted neighbor path-highlighted path-endpoint');
      cy.elements().not(tourEles).addClass('faded');
      tourEles.addClass('tour-highlighted');
    });

    // Fit view to tour elements
    if (tourNodes.nonempty()) {
      cy.animate({
        fit: { eles: tourEles, padding: 80 }
      }, { duration: 600 });
    }

    updateTourNarration();
    saveHashState();
  }

  function createTourNarration() {
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
      if (state.tourStep > 0) { state.tourStep--; showTourStep(); }
    });
    document.getElementById('tour-next-btn').addEventListener('click', function () {
      state.tourStep++;
      showTourStep();
    });

    trapFocus(narration);
    updateTourNarration();
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
    nextBtn.textContent = state.tourStep >= tour.steps.length - 1 ? 'Finish' : 'Next';
  }

  function trapFocus(container) {
    var focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    container._focusTrap = function (e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
      if (e.key === 'Escape') exitTour();
    };
    container.addEventListener('keydown', container._focusTrap);
    first.focus();
  }

  function releaseFocus(container) {
    if (container && container._focusTrap) {
      container.removeEventListener('keydown', container._focusTrap);
    }
  }

  function exitTour() {
    var triggerEl = state.tourTriggerEl;
    state.activeTour = null;
    state.tourStep = 0;
    state.tourTriggerEl = null;

    document.querySelectorAll('.tour-btn').forEach(function (btn) {
      btn.classList.remove('tour-active');
    });

    var narration = document.querySelector('.tour-narration');
    if (narration) {
      releaseFocus(narration);
      narration.remove();
    }

    if (state.cy) {
      state.cy.elements().removeClass('faded highlighted tour-highlighted neighbor');
    }
    applyFilters();

    if (triggerEl) triggerEl.focus();
    saveHashState();
  }

  // --- Build accessible data table for screen readers ---
  function buildAccessibleTable(data) {
    var container = document.getElementById('sr-data-table');
    if (!container) return;

    var table = document.createElement('table');
    table.setAttribute('role', 'table');
    table.setAttribute('aria-label', 'Investigation network entities and connections');

    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    ['Entity', 'Type', 'Connections', 'Key Facts'].forEach(function (h) {
      var th = document.createElement('th');
      th.setAttribute('scope', 'col');
      th.textContent = h;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    var linkCounts = {};
    data.links.forEach(function (l) {
      linkCounts[l.source] = (linkCounts[l.source] || 0) + 1;
      linkCounts[l.target] = (linkCounts[l.target] || 0) + 1;
    });

    data.nodes.forEach(function (n) {
      var row = document.createElement('tr');
      var tdName = document.createElement('td');
      tdName.textContent = n.label;
      var tdType = document.createElement('td');
      tdType.textContent = (TYPE_CONFIG[n.type] || {}).label || n.type;
      var tdConn = document.createElement('td');
      tdConn.textContent = linkCounts[n.id] || 0;
      var tdFacts = document.createElement('td');
      tdFacts.textContent = (n.observations || []).slice(0, 2).join('; ');
      row.appendChild(tdName);
      row.appendChild(tdType);
      row.appendChild(tdConn);
      row.appendChild(tdFacts);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }

  // --- Theme change handler ---
  function applyTheme() {
    if (!state.cy) return;
    state.cy.style(buildStylesheet());

    document.querySelectorAll('.type-filter[data-type]').forEach(function (btn) {
      var type = btn.getAttribute('data-type');
      if (type === 'all') return;
      var dot = btn.querySelector('.type-filter-dot');
      if (dot) dot.style.background = getTypeColor(type);
    });
    document.querySelectorAll('.legend-item[data-type]').forEach(function (item) {
      var type = item.getAttribute('data-type');
      var dot = item.querySelector('.legend-dot');
      if (dot) dot.style.background = getTypeColor(type);
    });
    if (state.selectedNodeId) {
      var node = state.cy.getElementById(state.selectedNodeId);
      if (node.nonempty()) {
        var badge = document.getElementById('detail-type');
        if (badge) badge.style.backgroundColor = getTypeColor(node.data('type'));
      }
    }
  }

  document.addEventListener('themechange', applyTheme);

  var themeObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'data-theme') applyTheme();
    });
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // --- Boot ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

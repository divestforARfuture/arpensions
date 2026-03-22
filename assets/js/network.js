/* ==========================================================================
   D4ARF Network Visualization — Cytoscape.js investigative graph
   Phase 1: Core Cytoscape migration
   Phase 2: Path-finding UI + URL hash state
   ========================================================================== */

(function () {
  'use strict';

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

  function isDarkMode() { return document.documentElement.getAttribute('data-theme') === 'dark'; }
  function getTypeColor(type) { var cfg = TYPE_CONFIG[type]; if (!cfg) return '#999'; return isDarkMode() ? cfg.darkColor : cfg.color; }

  var TOURS = {
    'milligan-chain': { title: 'The Milligan Chain', steps: [
      { nodes: ['Dennis Milligan'], text: 'Dennis Milligan served as State Treasurer (~2015\u20132019) where he initiated the Israel Bonds program. He later became Auditor of State \u2014 an office with no investment authority.' },
      { nodes: ['Dennis Milligan', 'Arkansas State Treasury', 'Auditor of State'], text: 'Despite holding no investment authority as Auditor, Milligan used his office to coordinate Israel Bonds advocacy across multiple agencies.' },
      { nodes: ['Dennis Milligan', 'Jason Brady', 'APERS', 'ATRS'], text: 'Jason Brady \u2014 Milligan\u2019s direct report at the Auditor\u2019s office \u2014 served on the APERS board and initiated the Israel Bonds request at ATRS. He was the operational conduit across both pension systems.' },
      { nodes: ['Dennis Milligan', 'Jason Brady', 'April 2025 Israel Bonds Tour', 'Lawrence Berman', 'Bradley Young'], text: 'In April 2025, the Auditor\u2019s office organized a 2-day tour of Arkansas state government for Israel Bonds sales reps. Within weeks, both APERS and ATRS authorized up to $50 million each.' },
      { nodes: ['Dennis Milligan', 'Stacy Peterson', 'SFOF', 'SFOF Conduit Role'], text: 'After the votes, Milligan\u2019s communications director distributed success stories through SFOF to encourage other states to replicate. The full advocacy lifecycle \u2014 from meetings to votes to interstate promotion \u2014 operated from the Auditor\u2019s office.' }
    ]},
    'seller-as-analyst': { title: 'Seller as Analyst', steps: [
      { nodes: ['Seller as Analyst Problem', 'No Independent Credit Analysis'], text: 'Across 909 FOIA documents from 4 agencies, zero independent credit analyses of Israel Bonds exist. The only "analysis" came from the entity selling the bonds.' },
      { nodes: ['Lawrence Berman', 'Bradley Young', 'Stuart Garawitz', 'Israel Bonds / DCI'], text: 'Israel Bonds representatives provided all investment materials: rate sheets, economic briefings, marketing emails, and "exclusive" presentations. These same people are responsible for selling $10+ billion in bonds.' },
      { nodes: ['Aon Hewitt Investment Consulting', 'ATRS No Independent Analysis', 'ATRS'], text: 'ATRS\u2019s own consultant Aon provided comprehensive due diligence for other investments like KKR. For Israel Bonds: nothing. The Executive Director admitted in advance that Aon "will not be making a formal recommendation."' },
      { nodes: ['Seller as Analyst Problem', 'Arkansas State Treasury', 'APERS', 'ATRS'], text: 'The pattern repeated across all three investing entities. In every case, the bond seller\u2019s materials were the only investment rationale available when decisions were made.' }
    ]},
    'sfof-pipeline': { title: 'The SFOF Pipeline', steps: [
      { nodes: ['SFOF', 'Derek A. Kreifels'], text: 'The State Financial Officers Foundation (SFOF) is a networking organization connecting state treasurers and financial officers nationally. Derek Kreifels serves as Executive Director.' },
      { nodes: ['SFOF', 'Dennis Milligan', 'Israel Bonds / DCI'], text: 'Milligan served as SFOF National Chair (~2019\u20132020). SFOF forwarded Israel Bonds events \u2014 including a "Celebration with Prime Minister Netanyahu" \u2014 to state officials. The organization functioned as a marketing channel.' },
      { nodes: ['SFOF Conduit Role', 'Inter-State Israel Bonds Coordination', 'Glenn Hegar'], text: 'The SFOF network connected Arkansas officials with treasurers from Texas, Arizona, Idaho, North Carolina, and others. Texas Comptroller Hegar used nearly identical political framing for his $140M in Israel Bonds purchases.' },
      { nodes: ['Stacy Peterson', 'SFOF Conduit Role', 'Adam Schwend'], text: 'After APERS and ATRS voted, Milligan\u2019s communications director emailed SFOF: "Feel free to pass along to any member states you think might be interested. The Auditor has very good contact." The interstate replication pipeline is documented.' }
    ]},
    'authorization-gap': { title: 'The Authorization Gap', steps: [
      { nodes: ['Authorization Gap', 'Absence of Normal Fiduciary Processes'], text: 'For a combined potential allocation of $155 million, standard fiduciary processes are completely absent: no independent credit analysis, no risk assessment, no yield comparison, no consultant review.' },
      { nodes: ['Authorization Gap', 'Arkansas State Treasury', 'Board of Finance'], text: 'Treasury: Purchases authorized by "executive team" with no documented Board of Finance deliberation. The only internal analysis is a 2-page document created years after tens of millions were invested.' },
      { nodes: ['Authorization Gap', 'ATRS', 'ATRS Resolution 2025-22', 'Danny Knight'], text: 'ATRS: The Board adopted Resolution 2025-22 for $50M based on the Executive Director\u2019s personal opinion, not a formal consultant recommendation. Board Chair Danny Knight signed the resolution.' },
      { nodes: ['Symmetry Argument', 'Act 710', 'Act 644', 'Arkansas Prudent Investor Standard'], text: 'Arkansas Act 710 requires "financial merit" for divestment. The same standard should apply to purchases. The complete absence of financial merit analysis for Israel Bonds purchases violates the spirit of Arkansas\u2019s own laws.' }
    ]}
  };

  var state = { cy: null, rawData: null, fuse: null, activeFilters: new Set(), activeTour: null, tourStep: 0, tourTriggerEl: null, selectedNodeId: null, currentLayout: 'fcose', pathSource: null, pathTarget: null, pathResult: null, hashUpdateTimer: null, restoringHash: false };

  function debounce(fn, delay) { var timer; return function () { clearTimeout(timer); timer = setTimeout(fn, delay); }; }
  function escapeHtml(str) { var div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

  function transformData(data) {
    var lc = {};
    data.links.forEach(function (l) { lc[l.source] = (lc[l.source] || 0) + 1; lc[l.target] = (lc[l.target] || 0) + 1; });
    var nodes = data.nodes.map(function (n) { var cfg = TYPE_CONFIG[n.type] || {}; return { group: 'nodes', data: { id: n.id, label: n.label, type: n.type, observations: n.observations || [], observationCount: n.observationCount || (n.observations ? n.observations.length : 0), connections: lc[n.id] || 0, color: cfg.color || '#999', darkColor: cfg.darkColor || '#999', shape: cfg.shape || 'ellipse' } }; });
    var edges = data.links.map(function (l, i) { return { group: 'edges', data: { id: 'e' + i, source: l.source, target: l.target, type: l.type || '', label: l.label || (l.type ? l.type.replace(/_/g, ' ') : '') } }; });
    return nodes.concat(edges);
  }

  function buildStylesheet() {
    var dark = isDarkMode(); var nfc = dark ? '#E5E7EB' : '#374151'; var ec = dark ? 'rgba(107,114,128,0.35)' : 'rgba(0,0,0,0.08)'; var ns = dark ? '#1A1A24' : '#ffffff';
    return [
      { selector: 'node', style: { 'label': 'data(label)', 'background-color': function(e){return dark?e.data('darkColor'):e.data('color');}, 'shape': 'data(shape)', 'width': 'mapData(connections,0,30,18,56)', 'height': 'mapData(connections,0,30,18,56)', 'font-family': 'Inter,system-ui,sans-serif', 'font-size': '10px', 'font-weight': 600, 'color': nfc, 'text-valign': 'bottom', 'text-halign': 'center', 'text-margin-y': 6, 'text-max-width': '100px', 'text-wrap': 'ellipsis', 'border-width': 2, 'border-color': ns, 'overlay-padding': 4, 'overlay-opacity': 0, 'z-index': 10, 'min-zoomed-font-size': 8, 'text-background-color': dark ? 'rgba(22,22,30,0.85)' : 'rgba(248,247,245,0.85)', 'text-background-opacity': 1, 'text-background-padding': '2px', 'text-background-shape': 'roundrectangle' }},
      { selector: 'node[connections < 3]', style: { 'font-size': '0px', 'text-opacity': 0 }},
      { selector: 'edge', style: { 'width': 1, 'line-color': ec, 'curve-style': 'bezier', 'opacity': 0.7, 'target-arrow-shape': 'none' }},
      { selector: 'node:selected', style: { 'border-color': '#0C7489', 'border-width': 3, 'overlay-opacity': 0.08, 'overlay-color': '#0C7489', 'font-size': '11px', 'text-opacity': 1, 'z-index': 100 }},
      { selector: '.highlighted', style: { 'opacity': 1, 'z-index': 50 }},
      { selector: 'node.highlighted', style: { 'border-color': '#0C7489', 'border-width': 3, 'font-size': '11px', 'text-opacity': 1 }},
      { selector: 'edge.highlighted', style: { 'line-color': '#0C7489', 'width': 2.5, 'opacity': 0.8, 'z-index': 50 }},
      { selector: '.tour-highlighted', style: { 'opacity': 1, 'z-index': 60 }},
      { selector: 'node.tour-highlighted', style: { 'border-color': '#0C7489', 'border-width': 3, 'font-size': '11px', 'text-opacity': 1 }},
      { selector: 'edge.tour-highlighted', style: { 'line-color': '#0C7489', 'width': 2.5, 'opacity': 0.7 }},
      { selector: '.path-highlighted', style: { 'opacity': 1, 'z-index': 70 }},
      { selector: 'node.path-highlighted', style: { 'border-color': '#0C7489', 'border-width': 3, 'font-size': '11px', 'text-opacity': 1 }},
      { selector: 'edge.path-highlighted', style: { 'line-color': '#0C7489', 'width': 3, 'opacity': 0.9, 'z-index': 70 }},
      { selector: '.path-endpoint', style: { 'border-color': '#0C7489', 'border-width': 4, 'overlay-opacity': 0.12, 'overlay-color': '#0C7489', 'font-size': '12px', 'text-opacity': 1, 'z-index': 80 }},
      { selector: '.faded', style: { 'opacity': 0.08 }},
      { selector: '.dimmed', style: { 'opacity': 0.1 }},
      { selector: '.neighbor', style: { 'opacity': 1, 'font-size': '10px', 'text-opacity': 1, 'z-index': 40 }},
      { selector: 'edge.neighbor', style: { 'line-color': 'rgba(12,116,137,0.4)', 'width': 2, 'opacity': 0.7 }}
    ];
  }

  function init() {
    var scriptEl = document.querySelector('script[data-graph-url]');
    var dataUrl = scriptEl ? scriptEl.getAttribute('data-graph-url') : '/assets/js/network-graph.json';
    fetch(dataUrl).then(function(r){return r.json();}).then(function(data) {
      state.rawData = data; var elements = transformData(data);
      buildFilters(data); buildLegend(data); initCytoscape(elements); initFuseSearch(data); initPathfinding(data); bindTours(); bindZoomControls(); bindLayoutToggle(); buildAccessibleTable(data);
      document.getElementById('graph-loading').classList.add('hidden');
      restoreHashState();
    }).catch(function(err) { console.error('Failed to load network data:', err); document.getElementById('graph-loading').innerHTML = '<p>Failed to load data. Please refresh.</p>'; });
  }

  function initCytoscape(elements) {
    if (typeof cytoscapeFcose !== 'undefined') cytoscape.use(cytoscapeFcose);
    if (typeof cytoscapeDagre !== 'undefined') cytoscape.use(cytoscapeDagre);
    state.cy = cytoscape({ container: document.getElementById('network-graph'), elements: elements, style: buildStylesheet(),
      layout: { name: 'fcose', animate: false, quality: 'default', randomize: true, nodeDimensionsIncludeLabels: false, idealEdgeLength: function(){return 120;}, nodeRepulsion: function(){return 8000;}, edgeElasticity: function(){return 0.45;}, gravity: 0.3, gravityRange: 1.5, numIter: 2500, padding: 50 },
      minZoom: 0.15, maxZoom: 4, wheelSensitivity: 0.3, boxSelectionEnabled: false, selectionType: 'single', touchTapThreshold: 8, desktopTapThreshold: 4 });
    var cy = state.cy;
    cy.on('tap', 'node', function(evt){selectNode(evt.target);});
    cy.on('tap', function(evt){if(evt.target===cy){deselectNode();if(!state.activeTour&&!state.pathResult)clearHighlight();}});
    cy.on('mouseover', 'node', function(evt){if(!state.activeTour&&!state.pathResult)highlightNeighborhood(evt.target);});
    cy.on('mouseout', 'node', function(){if(!state.activeTour&&!state.selectedNodeId&&!state.pathResult){clearHighlight();applyFilters();}});
    document.addEventListener('keydown', function(e){
      if(e.key==='/'&&!e.target.matches('input,textarea,select')){e.preventDefault();document.getElementById('node-search').focus();return;}
      if(e.key==='Escape'){if(state.activeTour)exitTour();else if(state.pathResult)clearPath();else{deselectNode();clearHighlight();applyFilters();}return;}
    });
    cy.one('tapstart pan zoom', function(){var h=document.getElementById('graph-hint');if(h)h.classList.add('hidden');});
  }

  function highlightNeighborhood(node) { var cy=state.cy,nb=node.closedNeighborhood(); cy.elements().removeClass('highlighted neighbor faded'); cy.elements().not(nb).addClass('faded'); nb.addClass('highlighted'); nb.edges().addClass('neighbor'); node.connectedEdges().addClass('neighbor'); nb.nodes().addClass('neighbor'); }
  function clearHighlight() { if(!state.cy)return; state.cy.elements().removeClass('highlighted neighbor faded tour-highlighted path-highlighted path-endpoint'); }

  function selectNode(node) {
    var cy=state.cy; state.selectedNodeId=node.id(); cy.nodes().unselect(); node.select();
    if(!state.pathResult) highlightNeighborhood(node);
    document.getElementById('detail-empty').style.display='none';
    var content=document.getElementById('detail-content'); content.style.display='block';
    var data=node.data(), color=getTypeColor(data.type);
    var badge=document.getElementById('detail-type'); badge.textContent=(TYPE_CONFIG[data.type]||{}).label||data.type; badge.style.backgroundColor=color;
    document.getElementById('detail-name').textContent=data.label;
    var cc=document.getElementById('detail-conn-count'); if(cc) cc.textContent=node.connectedEdges().length+' connections';
    var st=document.getElementById('detail-status'); if(st) st.textContent=data.label+' selected, '+node.connectedEdges().length+' connections. Details panel opened.';
    var obsList=document.getElementById('detail-observations'); obsList.innerHTML='';
    var obs=data.observations||[], sc=Math.min(obs.length,8);
    for(var i=0;i<sc;i++){var li=document.createElement('li');li.textContent=obs[i];obsList.appendChild(li);}
    if(obs.length>sc){var m=document.createElement('li');m.style.color='#999';m.style.fontStyle='italic';m.textContent='+ '+(obs.length-sc)+' more facts in the full record';obsList.appendChild(m);}
    var connList=document.getElementById('detail-connections'); connList.innerHTML='';
    node.connectedEdges().forEach(function(edge){var other=edge.source().id()===node.id()?edge.target():edge.source(); var dir=edge.source().id()===node.id()?'\u2192':'\u2190'; var li=document.createElement('li'); var btn=document.createElement('button'); btn.className='detail-connection-link'; btn.textContent=other.data('label'); btn.addEventListener('click',function(){selectNode(other);cy.animate({center:{eles:other},zoom:Math.max(cy.zoom(),1.2)},{duration:500});}); li.appendChild(document.createTextNode(dir+' ')); li.appendChild(btn); var ts=document.createElement('span'); ts.className='detail-connection-type'; ts.textContent=(edge.data('type')||'').replace(/_/g,' '); li.appendChild(ts); connList.appendChild(li);});
    document.getElementById('detail-close').onclick=function(){deselectNode();clearHighlight();applyFilters();if(state.pathResult)reapplyPathHighlight();};
    saveHashState();
  }
  function deselectNode(){state.selectedNodeId=null;if(state.cy)state.cy.nodes().unselect();document.getElementById('detail-empty').style.display='';document.getElementById('detail-content').style.display='none';saveHashState();}

  function buildFilters(data) {
    var container=document.getElementById('type-filters'), counts={};
    data.nodes.forEach(function(n){counts[n.type]=(counts[n.type]||0)+1;});
    var allBtn=document.createElement('button'); allBtn.className='type-filter active'; allBtn.setAttribute('data-type','all');
    allBtn.innerHTML='<span class="type-filter-dot" style="background:#fff;border:1.5px solid #999"></span><span class="type-filter-label">All entities</span><span class="type-filter-count">'+data.nodes.length+'</span>';
    allBtn.addEventListener('click',function(){state.activeFilters.clear();updateFilterUI();applyFilters();}); container.appendChild(allBtn);
    data.entityTypes.forEach(function(type){var cfg=TYPE_CONFIG[type]||{}; var btn=document.createElement('button'); btn.className='type-filter'; btn.setAttribute('data-type',type);
      btn.innerHTML='<span class="type-filter-dot" style="background:'+getTypeColor(type)+'"></span><span class="type-filter-label">'+(cfg.label||type)+'</span><span class="type-filter-count">'+(counts[type]||0)+'</span>';
      btn.addEventListener('click',function(){if(state.activeFilters.has(type))state.activeFilters.delete(type);else state.activeFilters.add(type);updateFilterUI();applyFilters();}); container.appendChild(btn);});
  }
  function updateFilterUI(){document.querySelectorAll('.type-filter').forEach(function(btn){var t=btn.getAttribute('data-type');btn.classList.toggle('active',t==='all'?state.activeFilters.size===0:state.activeFilters.has(t));});}
  function applyFilters(){if(!state.cy)return;var cy=state.cy,hf=state.activeFilters.size>0;cy.batch(function(){cy.elements().removeClass('dimmed');if(hf){cy.nodes().forEach(function(n){if(!state.activeFilters.has(n.data('type')))n.addClass('dimmed');});cy.edges().forEach(function(e){if(!state.activeFilters.has(e.source().data('type'))&&!state.activeFilters.has(e.target().data('type')))e.addClass('dimmed');});}});}

  function buildLegend(data){var c=document.getElementById('legend');data.entityTypes.forEach(function(type){var cfg=TYPE_CONFIG[type]||{};var item=document.createElement('div');item.className='legend-item';item.setAttribute('data-type',type);item.innerHTML='<span class="legend-dot" style="background:'+getTypeColor(type)+'"></span><span>'+(cfg.label||type)+'</span>';c.appendChild(item);});}

  function initFuseSearch(data){
    var sd=data.nodes.map(function(n){return{id:n.id,label:n.label,type:n.type,typeLabel:(TYPE_CONFIG[n.type]||{}).label||n.type};});
    state.fuse=new Fuse(sd,{keys:['label','typeLabel'],threshold:0.35,distance:200,minMatchCharLength:2});
    var input=document.getElementById('node-search'),rEl=document.getElementById('search-results'),ai=-1;
    input.addEventListener('input',function(){var q=input.value.trim();rEl.innerHTML='';ai=-1;input.removeAttribute('aria-activedescendant');
      if(q.length<2){rEl.classList.remove('open');input.setAttribute('aria-expanded','false');return;}
      var res=state.fuse.search(q).slice(0,8);if(!res.length){rEl.classList.remove('open');input.setAttribute('aria-expanded','false');return;}
      res.forEach(function(r,idx){var it=r.item,btn=document.createElement('button');btn.className='search-result-item';btn.id='search-result-'+idx;btn.setAttribute('role','option');btn.setAttribute('aria-selected','false');
        btn.innerHTML='<span class="search-result-dot" style="background:'+getTypeColor(it.type)+'"></span><span>'+escapeHtml(it.label)+'</span><span class="search-result-type">'+escapeHtml(it.typeLabel)+'</span>';
        btn.addEventListener('click',function(){navigateToNode(it.id);rEl.classList.remove('open');input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');input.value=it.label;});rEl.appendChild(btn);});
      rEl.classList.add('open');input.setAttribute('aria-expanded','true');});
    input.addEventListener('keydown',function(e){var items=rEl.querySelectorAll('.search-result-item');if(!items.length)return;
      if(e.key==='ArrowDown'){e.preventDefault();ai=Math.min(ai+1,items.length-1);ua(items);}else if(e.key==='ArrowUp'){e.preventDefault();ai=Math.max(ai-1,0);ua(items);}else if(e.key==='Enter'&&ai>=0){e.preventDefault();items[ai].click();}});
    function ua(items){items.forEach(function(it,i){it.classList.toggle('active',i===ai);it.setAttribute('aria-selected',i===ai?'true':'false');});input.setAttribute('aria-activedescendant',ai>=0?'search-result-'+ai:'');}
    document.addEventListener('click',function(e){if(!e.target.closest('.search-wrapper')){rEl.classList.remove('open');input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');}});
  }
  function navigateToNode(nodeId){var cy=state.cy,node=cy.getElementById(nodeId);if(node.empty())return;selectNode(node);cy.animate({center:{eles:node},zoom:Math.max(cy.zoom(),1.2)},{duration:500});}

  /* === PATH-FINDING (Phase 2) === */
  function initPathfinding(data){
    var ss=document.getElementById('path-source'),ts=document.getElementById('path-target'),fb=document.getElementById('path-find-btn'),cb=document.getElementById('path-clear-btn');
    if(!ss||!ts)return;
    var sorted=data.nodes.slice().sort(function(a,b){return a.label.localeCompare(b.label);});
    sorted.forEach(function(n){var cfg=TYPE_CONFIG[n.type]||{};
      var oA=document.createElement('option');oA.value=n.id;oA.textContent=n.label;ss.appendChild(oA);
      var oB=document.createElement('option');oB.value=n.id;oB.textContent=n.label;ts.appendChild(oB);});
    fb.addEventListener('click',findPath); cb.addEventListener('click',clearPath);
    var sw=document.getElementById('path-swap-btn'); if(sw) sw.addEventListener('click',function(){var t=ss.value;ss.value=ts.value;ts.value=t;});
  }

  function findPath(){
    var cy=state.cy,sid=document.getElementById('path-source').value,tid=document.getElementById('path-target').value,rEl=document.getElementById('path-result'),cb=document.getElementById('path-clear-btn');
    if(!sid||!tid){rEl.innerHTML='<p class="path-error">Select both a source and target entity.</p>';rEl.style.display='block';return;}
    if(sid===tid){rEl.innerHTML='<p class="path-error">Source and target must be different entities.</p>';rEl.style.display='block';return;}
    var sn=cy.getElementById(sid),tn=cy.getElementById(tid);
    if(sn.empty()||tn.empty()){rEl.innerHTML='<p class="path-error">Entity not found in graph.</p>';rEl.style.display='block';return;}
    if(state.activeTour) exitTour();
    try{
      var dj=cy.elements().dijkstra({root:sn,directed:false}),dist=dj.distanceTo(tn);
      if(dist===Infinity){rEl.innerHTML='<p class="path-error">No path exists between these entities.</p>';rEl.style.display='block';state.pathResult=null;clearHighlight();applyFilters();saveHashState();return;}
      var path=dj.pathTo(tn); state.pathSource=sid; state.pathTarget=tid; state.pathResult=path;
      cy.batch(function(){cy.elements().removeClass('highlighted neighbor faded tour-highlighted path-highlighted path-endpoint');cy.elements().not(path).addClass('faded');path.addClass('path-highlighted');sn.addClass('path-endpoint');tn.addClass('path-endpoint');});
      cy.animate({fit:{eles:path,padding:80}},{duration:600});
      var pn=path.nodes(),pe=path.edges(),hops=pe.length;
      var html='<p class="path-summary">'+hops+' hop'+(hops!==1?'s':'')+'</p><ol class="path-steps">';
      for(var i=0;i<pn.length;i++){html+='<li class="path-step"><button class="path-step-node" data-node-id="'+escapeHtml(pn[i].id())+'"><span class="path-step-dot" style="background:'+getTypeColor(pn[i].data('type'))+'"></span>'+escapeHtml(pn[i].data('label'))+'</button>';if(i<pe.length){html+='<span class="path-step-edge">\u2192 '+escapeHtml((pe[i].data('type')||'').replace(/_/g,' '))+'</span>';}html+='</li>';}
      html+='</ol>'; rEl.innerHTML=html; rEl.style.display='block'; cb.style.display='';
      rEl.querySelectorAll('.path-step-node').forEach(function(btn){btn.addEventListener('click',function(){var n=cy.getElementById(btn.getAttribute('data-node-id'));if(n.nonempty()){selectNode(n);cy.animate({center:{eles:n},zoom:Math.max(cy.zoom(),1.5)},{duration:400});}});});
      var st=document.getElementById('detail-status');if(st)st.textContent='Path found: '+hops+' hops from '+sn.data('label')+' to '+tn.data('label')+'.';
    }catch(e){rEl.innerHTML='<p class="path-error">No path exists between these entities.</p>';rEl.style.display='block';state.pathResult=null;}
    saveHashState();
  }
  function reapplyPathHighlight(){if(!state.pathResult||!state.cy)return;var cy=state.cy,p=state.pathResult,sn=cy.getElementById(state.pathSource),tn=cy.getElementById(state.pathTarget);cy.batch(function(){cy.elements().removeClass('highlighted neighbor faded tour-highlighted path-highlighted path-endpoint');cy.elements().not(p).addClass('faded');p.addClass('path-highlighted');if(sn.nonempty())sn.addClass('path-endpoint');if(tn.nonempty())tn.addClass('path-endpoint');});}
  function clearPath(){state.pathSource=null;state.pathTarget=null;state.pathResult=null;var ss=document.getElementById('path-source'),ts=document.getElementById('path-target'),rEl=document.getElementById('path-result'),cb=document.getElementById('path-clear-btn');if(ss)ss.value='';if(ts)ts.value='';if(rEl){rEl.innerHTML='';rEl.style.display='none';}if(cb)cb.style.display='none';clearHighlight();applyFilters();saveHashState();}

  /* === URL HASH STATE (Phase 2) === */
  function saveHashState(){if(state.restoringHash)return;clearTimeout(state.hashUpdateTimer);state.hashUpdateTimer=setTimeout(function(){var p=new URLSearchParams();if(state.selectedNodeId)p.set('n',state.selectedNodeId);if(state.currentLayout!=='fcose')p.set('l',state.currentLayout);if(state.activeTour){p.set('t',state.activeTour);p.set('s',String(state.tourStep));}if(state.pathSource&&state.pathTarget&&state.pathResult){p.set('from',state.pathSource);p.set('to',state.pathTarget);}var h=p.toString();history.replaceState(null,'',window.location.pathname+(h?'#'+h:''));},300);}
  function restoreHashState(){var h=window.location.hash.replace(/^#/,'');if(!h)return;state.restoringHash=true;var p=new URLSearchParams(h);
    var layout=p.get('l');if(layout==='dagre'&&state.currentLayout!=='dagre'){var lb=document.getElementById('layout-toggle');if(lb)lb.click();}
    var pf=p.get('from'),pt=p.get('to');if(pf&&pt){var ss=document.getElementById('path-source'),ts=document.getElementById('path-target');if(ss&&ts){ss.value=pf;ts.value=pt;setTimeout(function(){findPath();},100);}}
    var ti=p.get('t'),tst=parseInt(p.get('s'),10);if(ti&&TOURS[ti]){state.activeTour=ti;state.tourStep=isNaN(tst)?0:Math.min(tst,TOURS[ti].steps.length-1);state.tourTriggerEl=document.querySelector('.tour-btn[data-tour="'+ti+'"]');document.querySelectorAll('.tour-btn').forEach(function(b){b.classList.toggle('tour-active',b.getAttribute('data-tour')===ti);});showTourStep();createTourNarration();}
    var ni=p.get('n');if(ni&&!ti){setTimeout(function(){var n=state.cy.getElementById(ni);if(n.nonempty()){selectNode(n);state.cy.animate({center:{eles:n},zoom:1.2},{duration:400});}},pf?600:200);}
    setTimeout(function(){state.restoringHash=false;},1000);}
  window.addEventListener('popstate',function(){window.location.reload();});

  function bindZoomControls(){var cy=state.cy;document.getElementById('zoom-in').addEventListener('click',function(){cy.animate({zoom:cy.zoom()*1.4,center:{eles:cy.elements()}},{duration:300});});document.getElementById('zoom-out').addEventListener('click',function(){cy.animate({zoom:cy.zoom()*0.7,center:{eles:cy.elements()}},{duration:300});});document.getElementById('zoom-reset').addEventListener('click',function(){cy.animate({fit:{eles:cy.elements(),padding:50}},{duration:500});});}

  function bindLayoutToggle(){var btn=document.getElementById('layout-toggle');if(!btn)return;btn.addEventListener('click',function(){var cy=state.cy;if(state.currentLayout==='fcose'){state.currentLayout='dagre';btn.setAttribute('aria-label','Switch to force-directed layout');btn.title='Switch to force-directed layout';btn.querySelector('.layout-label').textContent='Hierarchical';cy.layout({name:'dagre',rankDir:'TB',nodeSep:30,rankSep:60,edgeSep:10,animate:true,animationDuration:600,padding:50}).run();}else{state.currentLayout='fcose';btn.setAttribute('aria-label','Switch to hierarchical layout');btn.title='Switch to hierarchical layout';btn.querySelector('.layout-label').textContent='Force';cy.layout({name:'fcose',animate:true,animationDuration:600,quality:'default',randomize:false,nodeDimensionsIncludeLabels:false,idealEdgeLength:function(){return 120;},nodeRepulsion:function(){return 8000;},edgeElasticity:function(){return 0.45;},gravity:0.3,gravityRange:1.5,numIter:2500,padding:50}).run();}saveHashState();});}

  function bindTours(){document.querySelectorAll('.tour-btn').forEach(function(btn){btn.addEventListener('click',function(){var id=btn.getAttribute('data-tour');if(state.activeTour===id)exitTour();else startTour(id);});});}
  function startTour(id){var tour=TOURS[id];if(!tour)return;if(state.pathResult)clearPath();state.activeTour=id;state.tourStep=0;state.tourTriggerEl=document.querySelector('.tour-btn[data-tour="'+id+'"]');document.querySelectorAll('.tour-btn').forEach(function(b){b.classList.toggle('tour-active',b.getAttribute('data-tour')===id);});showTourStep();createTourNarration();saveHashState();}
  function showTourStep(){var tour=TOURS[state.activeTour];if(!tour||state.tourStep>=tour.steps.length){exitTour();return;}var cy=state.cy,step=tour.steps[state.tourStep],tn=cy.collection();step.nodes.forEach(function(nid){var f=cy.getElementById(nid);if(f.nonempty())tn=tn.union(f);});var te=cy.collection();tn.forEach(function(n1){tn.forEach(function(n2){if(n1.id()!==n2.id())te=te.union(n1.edgesWith(n2));});});var tEles=tn.union(te);if(tn.length>=2){for(var i=0;i<tn.length-1;i++){var dj=cy.elements().dijkstra({root:tn[i],directed:false});for(var j=i+1;j<tn.length;j++){try{var p=dj.pathTo(tn[j]);if(p&&p.length>0)tEles=tEles.union(p);}catch(e){}}}}cy.batch(function(){cy.elements().removeClass('tour-highlighted faded highlighted neighbor path-highlighted path-endpoint');cy.elements().not(tEles).addClass('faded');tEles.addClass('tour-highlighted');});if(tn.nonempty())cy.animate({fit:{eles:tEles,padding:80}},{duration:600});updateTourNarration();saveHashState();}
  function createTourNarration(){var ex=document.querySelector('.tour-narration');if(ex)ex.remove();var n=document.createElement('div');n.className='tour-narration visible';n.innerHTML='<p class="tour-narration-step" id="tour-step-label"></p><p class="tour-narration-text" id="tour-step-text"></p><div class="tour-nav"><button class="tour-nav-btn tour-exit" id="tour-exit-btn">Exit tour</button><div><button class="tour-nav-btn tour-prev" id="tour-prev-btn">Previous</button> <button class="tour-nav-btn tour-next" id="tour-next-btn">Next</button></div></div>';document.querySelector('.network-graph-area').appendChild(n);document.getElementById('tour-exit-btn').addEventListener('click',exitTour);document.getElementById('tour-prev-btn').addEventListener('click',function(){if(state.tourStep>0){state.tourStep--;showTourStep();}});document.getElementById('tour-next-btn').addEventListener('click',function(){state.tourStep++;showTourStep();});trapFocus(n);updateTourNarration();}
  function updateTourNarration(){var tour=TOURS[state.activeTour];if(!tour)return;var sl=document.getElementById('tour-step-label'),st=document.getElementById('tour-step-text'),pb=document.getElementById('tour-prev-btn'),nb=document.getElementById('tour-next-btn');if(!sl)return;sl.textContent=tour.title+' \u2014 Step '+(state.tourStep+1)+' of '+tour.steps.length;st.textContent=tour.steps[state.tourStep].text;pb.disabled=state.tourStep===0;pb.style.opacity=state.tourStep===0?'0.4':'1';nb.textContent=state.tourStep>=tour.steps.length-1?'Finish':'Next';}
  function trapFocus(c){var f=c.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])');if(!f.length)return;var fi=f[0],la=f[f.length-1];c._focusTrap=function(e){if(e.key==='Tab'){if(e.shiftKey&&document.activeElement===fi){e.preventDefault();la.focus();}else if(!e.shiftKey&&document.activeElement===la){e.preventDefault();fi.focus();}}if(e.key==='Escape')exitTour();};c.addEventListener('keydown',c._focusTrap);fi.focus();}
  function releaseFocus(c){if(c&&c._focusTrap)c.removeEventListener('keydown',c._focusTrap);}
  function exitTour(){var tr=state.tourTriggerEl;state.activeTour=null;state.tourStep=0;state.tourTriggerEl=null;document.querySelectorAll('.tour-btn').forEach(function(b){b.classList.remove('tour-active');});var n=document.querySelector('.tour-narration');if(n){releaseFocus(n);n.remove();}if(state.cy)state.cy.elements().removeClass('faded highlighted tour-highlighted neighbor');applyFilters();if(tr)tr.focus();saveHashState();}

  function buildAccessibleTable(data){var c=document.getElementById('sr-data-table');if(!c)return;var t=document.createElement('table');t.setAttribute('role','table');t.setAttribute('aria-label','Investigation network entities and connections');var th=document.createElement('thead'),hr=document.createElement('tr');['Entity','Type','Connections','Key Facts'].forEach(function(h){var th2=document.createElement('th');th2.setAttribute('scope','col');th2.textContent=h;hr.appendChild(th2);});th.appendChild(hr);t.appendChild(th);var tb=document.createElement('tbody'),lc={};data.links.forEach(function(l){lc[l.source]=(lc[l.source]||0)+1;lc[l.target]=(lc[l.target]||0)+1;});data.nodes.forEach(function(n){var r=document.createElement('tr'),tn=document.createElement('td');tn.textContent=n.label;var tt=document.createElement('td');tt.textContent=(TYPE_CONFIG[n.type]||{}).label||n.type;var tc=document.createElement('td');tc.textContent=lc[n.id]||0;var tf=document.createElement('td');tf.textContent=(n.observations||[]).slice(0,2).join('; ');r.appendChild(tn);r.appendChild(tt);r.appendChild(tc);r.appendChild(tf);tb.appendChild(r);});t.appendChild(tb);c.appendChild(t);}

  function applyTheme(){if(!state.cy)return;state.cy.style(buildStylesheet());document.querySelectorAll('.type-filter[data-type]').forEach(function(b){var t=b.getAttribute('data-type');if(t==='all')return;var d=b.querySelector('.type-filter-dot');if(d)d.style.background=getTypeColor(t);});document.querySelectorAll('.legend-item[data-type]').forEach(function(i){var d=i.querySelector('.legend-dot');if(d)d.style.background=getTypeColor(i.getAttribute('data-type'));});if(state.selectedNodeId){var n=state.cy.getElementById(state.selectedNodeId);if(n.nonempty()){var b=document.getElementById('detail-type');if(b)b.style.backgroundColor=getTypeColor(n.data('type'));}}}
  document.addEventListener('themechange',applyTheme);
  var to=new MutationObserver(function(m){m.forEach(function(mu){if(mu.attributeName==='data-theme')applyTheme();});});to.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

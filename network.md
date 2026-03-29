---
layout: network
title: "Investigation Network — Who, What, and How They Connect"
description: "Interactive visualization of 80 entities and 176 relationships discovered across more than 1,200 FOIA documents from five Arkansas state agencies."
permalink: /network/
---

<section class="network-hero">
  <div class="container">
    <div class="network-hero-content">
      <p class="network-eyebrow">Interactive Investigation Map</p>
      <h1>Follow the connections</h1>
      <p class="network-hero-sub">This graph maps <strong>80 entities</strong> and <strong>176 relationships</strong> (graph data predates ASHERS Round 3 — update pending) extracted from more than 1,200 public records obtained through FOIA requests to five Arkansas state agencies. Click any node to inspect it. Use the filters to focus on what matters.</p>
    </div>
  </div>
</section>

<section class="network-app" aria-label="Network visualization">
  <div class="network-layout">

    <aside class="network-sidebar" aria-label="Filters and guided tours">
      <div class="sidebar-section">
        <h2 class="sidebar-heading">Entity Types</h2>
        <div id="type-filters" class="type-filters" role="group" aria-label="Filter by entity type"></div>
      </div>

      <div class="sidebar-section">
        <h2 class="sidebar-heading">Search</h2>
        <div class="search-wrapper">
          <input type="search" id="node-search" class="node-search" placeholder="Search entities... (press /)" aria-label="Search entities by name" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list">
          <div id="search-results" class="search-results" role="listbox" aria-label="Search results"></div>
        </div>
      </div>

      <div class="sidebar-section">
        <h2 class="sidebar-heading">Find Path</h2>
        <div class="pathfinding-form" role="group" aria-label="Find shortest path between two entities">
          <div class="pathfinding-selects">
            <label for="path-source" class="pathfinding-label">From</label>
            <select id="path-source" class="pathfinding-select">
              <option value="">Select source...</option>
            </select>
            <button id="path-swap-btn" class="pathfinding-swap" aria-label="Swap source and target" title="Swap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 3 7 21"/><polyline points="3 7 7 3 11 7"/><polyline points="17 21 17 3"/><polyline points="13 17 17 21 21 17"/></svg>
            </button>
            <label for="path-target" class="pathfinding-label">To</label>
            <select id="path-target" class="pathfinding-select">
              <option value="">Select target...</option>
            </select>
          </div>
          <div class="pathfinding-actions">
            <button id="path-find-btn" class="pathfinding-btn pathfinding-btn--find">Find path</button>
            <button id="path-clear-btn" class="pathfinding-btn pathfinding-btn--clear" style="display:none;">Clear</button>
          </div>
          <div id="path-result" class="path-result" style="display:none;" aria-live="polite"></div>
        </div>
      </div>

      <div class="sidebar-section">
        <h2 class="sidebar-heading">Guided Tours</h2>
        <ul class="tour-list">
          <li><button class="tour-btn" data-tour="milligan-chain">
            <span class="tour-btn-title">The Milligan Chain</span>
            <span class="tour-btn-desc">How one official drove sovereign bond purchases across three agencies</span>
          </button></li>
          <li><button class="tour-btn" data-tour="seller-as-analyst">
            <span class="tour-btn-title">Seller as Analyst</span>
            <span class="tour-btn-desc">The bond issuer's reps provided the only "analysis"</span>
          </button></li>
          <li><button class="tour-btn" data-tour="sfof-pipeline">
            <span class="tour-btn-title">The SFOF Pipeline</span>
            <span class="tour-btn-desc">How advocacy spread through a national network</span>
          </button></li>
          <li><button class="tour-btn" data-tour="authorization-gap">
            <span class="tour-btn-title">The Authorization Gap</span>
            <span class="tour-btn-desc">What's missing from the fiduciary record</span>
          </button></li>
        </ul>
      </div>

      <div class="sidebar-section sidebar-legend">
        <h2 class="sidebar-heading">Legend</h2>
        <div id="legend" class="legend-list"></div>
      </div>
    </aside>

    <div class="network-graph-area">
      <div class="graph-controls">
        <button id="zoom-in" class="graph-control-btn" aria-label="Zoom in" title="Zoom in">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button id="zoom-out" class="graph-control-btn" aria-label="Zoom out" title="Zoom out">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button id="zoom-reset" class="graph-control-btn" aria-label="Reset view" title="Reset view">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        </button>
        <div class="graph-control-divider"></div>
        <button id="layout-toggle" class="graph-control-btn graph-control-btn--wide" aria-label="Switch to hierarchical layout" title="Switch to hierarchical layout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/></svg>
          <span class="layout-label">Force</span>
        </button>
      </div>
      <div id="network-graph" class="network-graph" role="img" aria-label="Network graph of FOIA investigation entities and their relationships. An accessible data table is available below.">
        <div class="graph-loading" id="graph-loading"><p>Loading investigation network...</p></div>
      </div>
      <div class="graph-hint" id="graph-hint"><p>Click a node to inspect it. Scroll to zoom. Drag to pan. Press / to search.</p></div>
    </div>

    <aside class="network-detail" id="detail-panel" aria-label="Entity details">
      <div id="detail-status" class="sr-only" aria-live="polite" aria-atomic="true"></div>
      <div class="detail-empty" id="detail-empty">
        <div class="detail-empty-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <p class="detail-empty-text">Select a node to see details</p>
        <p class="detail-empty-hint">Or try a guided tour from the sidebar</p>
      </div>
      <div class="detail-content" id="detail-content" style="display:none;">
        <button class="detail-close" id="detail-close" aria-label="Close detail panel">&times;</button>
        <div class="detail-header">
          <span class="detail-type-badge" id="detail-type"></span>
          <h2 class="detail-name" id="detail-name"></h2>
          <p class="detail-conn-count" id="detail-conn-count"></p>
        </div>
        <div class="detail-body">
          <div class="detail-section">
            <h3 class="detail-section-heading">Key Facts</h3>
            <ul class="detail-observations" id="detail-observations"></ul>
          </div>
          <div class="detail-section">
            <h3 class="detail-section-heading">Connections</h3>
            <ul class="detail-connections" id="detail-connections"></ul>
          </div>
        </div>
      </div>
    </aside>

  </div>

  <div id="sr-data-table" class="sr-only" aria-label="Accessible table of all network entities and their connections"></div>
</section>



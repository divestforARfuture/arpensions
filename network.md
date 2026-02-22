---
layout: network
title: "Investigation Network — Who, What, and How They Connect"
description: "Interactive visualization of 80 entities and 167 relationships discovered across more than 1,000 FOIA documents from four Arkansas state agencies."
permalink: /network/
---

<section class="network-hero">
  <div class="container">
    <div class="network-hero-content">
      <p class="network-eyebrow">Interactive Investigation Map</p>
      <h1>Follow the connections</h1>
      <p class="network-hero-sub">This graph maps <strong>80 entities</strong> and <strong>167 relationships</strong> extracted from more than 1,000 public records obtained through FOIA requests to four Arkansas state agencies. Click any node to inspect it. Use the filters to focus on what matters.</p>
    </div>
  </div>
</section>

<section class="network-app" aria-label="Network visualization">
  <div class="network-layout">

    <!-- Sidebar: filters + guided tours -->
    <aside class="network-sidebar" aria-label="Filters and guided tours">
      <div class="sidebar-section">
        <h2 class="sidebar-heading">Entity Types</h2>
        <div id="type-filters" class="type-filters" role="group" aria-label="Filter by entity type">
          <!-- Populated by JS -->
        </div>
      </div>

      <div class="sidebar-section">
        <h2 class="sidebar-heading">Search</h2>
        <div class="search-wrapper">
          <input type="search" id="node-search" class="node-search" placeholder="Search entities..." aria-label="Search entities by name">
          <input type="search" id="node-search" class="node-search" aria-expanded="false" aria-controls="search-results" aria-autocomplete="list">
        </div>
      </div>

      <div class="sidebar-section">
        <h2 class="sidebar-heading">Guided Tours</h2>
        <div class="tour-list" role="list">
          <li role="listitem">
          <button class="tour-btn">
            <span class="tour-btn-title">The Milligan Chain</span>
            <span class="tour-btn-desc">How one official drove Israel Bonds across three agencies</span>
          </button>
          <button class="tour-btn" data-tour="seller-as-analyst" role="listitem">
            <span class="tour-btn-title">Seller as Analyst</span>
            <span class="tour-btn-desc">Israel Bonds reps provided the only "analysis"</span>
          </button>
          <button class="tour-btn" data-tour="sfof-pipeline" role="listitem">
            <span class="tour-btn-title">The SFOF Pipeline</span>
            <span class="tour-btn-desc">How advocacy spread through a national network</span>
          </button>
          <button class="tour-btn" data-tour="authorization-gap" role="listitem">
            <span class="tour-btn-title">The Authorization Gap</span>
            <span class="tour-btn-desc">What's missing from the fiduciary record</span>
          </button>
        </div>
      </div>

      <div class="sidebar-section sidebar-legend">
        <h2 class="sidebar-heading">Legend</h2>
        <div id="legend" class="legend-list">
          <!-- Populated by JS -->
        </div>
      </div>
    </aside>

    <!-- Graph area -->
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
      </div>
      <div id="network-graph" class="network-graph" role="img" aria-label="Force-directed network graph of FOIA investigation entities and their relationships">
        <div class="graph-loading" id="graph-loading">
          <p>Loading investigation network...</p>
        </div>
      </div>
      <div class="graph-hint" id="graph-hint">
        <p>Click a node to inspect it. Drag to reposition. Scroll to zoom.</p>
      </div>
    </div>

    <!-- Detail panel -->
    <aside class="network-detail" id="detail-panel" aria-label="Entity details" aria-live="polite">
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
</section>

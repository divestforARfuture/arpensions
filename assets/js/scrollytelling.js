// Scrollytelling narrative overview for the evidence page
(function () {
  'use strict';

  // Bail if scrollama isn't loaded or no scrolly section exists
  if (typeof scrollama === 'undefined') return;
  var section = document.querySelector('.scrolly');
  if (!section) return;

  var vizContainer = document.getElementById('scrolly-viz');
  var steps = section.querySelectorAll('.scrolly__step');
  var scroller = scrollama();

  // Data for each step's visualization state
  var vizData = [
    { stat: '$100M',    subtitle: 'pension funds committed to sovereign bonds',    colorClass: 'viz-stat--accent' },
    { stat: '0 pages',  subtitle: 'of independent credit analysis',               colorClass: 'viz-stat--danger' },
    { stat: '49 days',  subtitle: 'from sales pitch to $155 million authorized',   colorClass: 'viz-stat--accent' },
    { stat: '37 vs 0',  subtitle: 'pages of analysis — other investments vs. these bonds', colorClass: 'viz-stat--danger' },
    { stat: '1 dissent', subtitle: 'lone "no" vote on the ATRS board',            colorClass: 'viz-stat--accent' }
  ];

  function buildDots(activeIndex) {
    var html = '<ul class="viz-dots" aria-hidden="true">';
    for (var i = 0; i < vizData.length; i++) {
      html += '<li' + (i === activeIndex ? ' class="is-current"' : '') + '></li>';
    }
    html += '</ul>';
    return html;
  }

  function initVisualization() {
    if (!vizContainer) return;

    // Create one state layer per step
    for (var i = 0; i < vizData.length; i++) {
      var d = vizData[i];
      var layer = document.createElement('div');
      layer.className = 'scrolly__viz-state' + (i === 0 ? ' is-visible' : '');
      layer.setAttribute('data-viz-index', i);
      layer.innerHTML =
        '<div class="viz-stat ' + d.colorClass + '">' + d.stat + '</div>' +
        '<div class="viz-subtitle">' + d.subtitle + '</div>' +
        buildDots(i);
      vizContainer.appendChild(layer);
    }
  }

  function updateVisualization(stepIndex) {
    var layers = vizContainer.querySelectorAll('.scrolly__viz-state');
    for (var i = 0; i < layers.length; i++) {
      if (i === stepIndex) {
        layers[i].classList.add('is-visible');
      } else {
        layers[i].classList.remove('is-visible');
      }
    }
  }

  function handleStepEnter(response) {
    // Remove active class from all steps
    for (var i = 0; i < steps.length; i++) {
      steps[i].classList.remove('is-active');
    }
    // Add active class to current step
    response.element.classList.add('is-active');
    // Update the visualization
    updateVisualization(response.index);
  }

  function adjustBreakout() {
    // On mobile (<=768px) the scrolly stacks vertically — no breakout needed
    if (window.innerWidth <= 768) {
      section.style.width = '';
      section.style.marginLeft = '';
      return;
    }
    // Reset inline styles before measuring so getBoundingClientRect()
    // returns the natural, un-adjusted offset (not 0 from a previous call)
    section.style.width = '';
    section.style.marginLeft = '';
    var rect = section.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    section.style.width = vw + 'px';
    section.style.marginLeft = -rect.left + 'px';
  }

  function init() {
    initVisualization();

    // Show first step as active on load
    if (steps.length > 0) {
      steps[0].classList.add('is-active');
    }

    scroller
      .setup({
        step: '.scrolly__step',
        offset: 0.5,
        debug: false
      })
      .onStepEnter(handleStepEnter);

    // Handle window resize — throttled with rAF to prevent layout thrashing
    var resizePending = false;
    window.addEventListener('resize', function () {
      if (!resizePending) {
        resizePending = true;
        requestAnimationFrame(function () {
          scroller.resize();
          adjustBreakout();
          resizePending = false;
        });
      }
    });

    // Break scrolly out of the evidence-content sidebar column to full viewport width.
    // The section is nested inside .evidence-page > .evidence-content (flex child after
    // the TOC sidebar), so pure CSS calc(-50vw + 50%) would be off-center. JS measures
    // the exact offset and sets inline styles. No-JS fallback: section stays at its
    // natural width inside the prose column — still readable, just not full-width.
    adjustBreakout();

    // Enable CSS dimming of inactive steps now that JS is ready
    section.classList.add('scrolly--initialized');
  }

  init();
})();

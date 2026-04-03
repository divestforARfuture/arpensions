// Scrollytelling narrative overview for the evidence page
(function () {
  'use strict';

  // Bail if scrollama isn't loaded or no scrolly section exists
  if (typeof scrollama === 'undefined') return;
  var section = document.querySelector('.scrolly');
  if (!section) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var graphic = section.querySelector('.scrolly__graphic');
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

    // Handle window resize
    window.addEventListener('resize', scroller.resize);
  }

  init();
})();

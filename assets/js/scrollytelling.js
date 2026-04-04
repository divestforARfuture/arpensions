// Scrollytelling narrative overview for the evidence page
(function () {
  'use strict';

  // Bail if scrollama isn't loaded or no scrolly section exists
  if (typeof scrollama === 'undefined') return;
  var section = document.querySelector('.scrolly');
  if (!section) return;

  var steps = section.querySelectorAll('.scrolly__step');
  var scroller = scrollama();
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Data for each step's visualization state
  var vizData = [
    { stat: '$100M',    subtitle: 'pension funds committed to sovereign bonds',    colorClass: 'viz-stat--accent' },
    { stat: '0 pages',  subtitle: 'of independent credit analysis',               colorClass: 'viz-stat--danger' },
    { stat: '49 days',  subtitle: 'from sales pitch to $155 million authorized',   colorClass: 'viz-stat--accent' },
    { stat: '37 vs 0',  subtitle: 'pages of analysis \u2014 other investments vs. these bonds', colorClass: 'viz-stat--danger' },
    { stat: '1 dissent', subtitle: 'lone \u201cno\u201d vote on the ATRS board',            colorClass: 'viz-stat--accent' }
  ];

  var currentStep = 0;
  var statEl = document.getElementById('scrolly-stat');
  var subEl = document.getElementById('scrolly-subtitle');
  var counterEl = document.getElementById('scrolly-counter');
  var isTransitioning = false;

  function updateVisualization(stepIndex) {
    if (stepIndex === currentStep && stepIndex !== 0) return;
    if (stepIndex < 0 || stepIndex >= vizData.length) return;

    var d = vizData[stepIndex];

    // Update counter immediately
    if (counterEl) {
      counterEl.textContent = (stepIndex + 1) + ' of ' + vizData.length;
    }

    if (typeof d3 !== 'undefined' && !prefersReducedMotion && !isTransitioning) {
      isTransitioning = true;

      // Cancel any running transitions
      d3.select(statEl).interrupt();
      d3.select(subEl).interrupt();

      // Staggered crossfade with D3
      d3.select(statEl)
        .transition().duration(200)
        .style('opacity', 0)
        .on('end', function () {
          statEl.textContent = d.stat;
          statEl.className = 'viz-stat ' + d.colorClass;
          d3.select(statEl)
            .transition().duration(300)
            .style('opacity', 1)
            .on('end', function () {
              isTransitioning = false;
            });
        });

      d3.select(subEl)
        .transition().duration(200).delay(100)
        .style('opacity', 0)
        .on('end', function () {
          subEl.textContent = d.subtitle;
          d3.select(subEl)
            .transition().duration(300)
            .style('opacity', 1);
        });
    } else {
      // Immediate swap (no D3 or reduced-motion or mid-transition)
      statEl.textContent = d.stat;
      statEl.className = 'viz-stat ' + d.colorClass;
      subEl.textContent = d.subtitle;
      statEl.style.opacity = '1';
      subEl.style.opacity = '1';
      isTransitioning = false;
    }

    currentStep = stepIndex;
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
    // The viz container already has the first state in the HTML (no-JS fallback).
    // Just ensure the first step is active on load.
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

    // Enable CSS dimming of inactive steps now that JS is ready
    section.classList.add('scrolly--initialized');
  }

  init();
})();

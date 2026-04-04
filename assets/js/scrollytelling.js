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

  var currentStep = -1;
  var statEl = document.getElementById('scrolly-stat');
  var subEl = document.getElementById('scrolly-subtitle');
  // Generation counter — prevents stale setTimeout callbacks from
  // overwriting content when the user scrolls fast between steps
  var transitionId = 0;

  function updateVisualization(stepIndex) {
    if (stepIndex === currentStep) return;
    if (stepIndex < 0 || stepIndex >= vizData.length) return;

    var d = vizData[stepIndex];
    currentStep = stepIndex;
    transitionId++;
    var myId = transitionId;

    if (!prefersReducedMotion) {
      // Fade out stat
      statEl.style.transition = 'opacity 0.2s ease';
      statEl.style.opacity = '0';

      // Fade out subtitle (100ms delay)
      setTimeout(function () {
        subEl.style.transition = 'opacity 0.2s ease';
        subEl.style.opacity = '0';
      }, 100);

      // After fade out completes, swap text and fade in
      setTimeout(function () {
        if (myId !== transitionId) return; // stale — newer step took over
        statEl.textContent = d.stat;
        statEl.className = 'viz-stat ' + d.colorClass;
        void statEl.offsetWidth; // force reflow before fading in
        statEl.style.transition = 'opacity 0.3s ease';
        statEl.style.opacity = '1';
      }, 220);

      setTimeout(function () {
        if (myId !== transitionId) return; // stale
        subEl.textContent = d.subtitle;
        void subEl.offsetWidth;
        subEl.style.transition = 'opacity 0.3s ease';
        subEl.style.opacity = '1';
      }, 320);
    } else {
      // Immediate swap (reduced motion)
      statEl.textContent = d.stat;
      statEl.className = 'viz-stat ' + d.colorClass;
      subEl.textContent = d.subtitle;
      statEl.style.opacity = '1';
      subEl.style.opacity = '1';
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

/* ==========================================================================
   Evidence Enhancements — Unit chart for subfinding 3g
   Vanilla JS (no D3 dependency). Loaded on the evidence page.
   ========================================================================== */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Unit Chart (37 vs 0) ---

  function appendSquares(container, count, className) {
    for (var i = 0; i < count; i++) {
      var div = document.createElement('div');
      div.className = 'unit ' + className;
      div.setAttribute('aria-hidden', 'true');
      if (prefersReducedMotion && className === 'unit--filled') {
        div.classList.add('is-visible');
      }
      container.appendChild(div);
    }
  }

  function initUnitChart() {
    var filledGrid = document.getElementById('unit-chart-filled');
    var emptyGrid = document.getElementById('unit-chart-empty');
    if (!filledGrid || !emptyGrid) return;

    var TOTAL = 37;
    var STAGGER_MS = 15;

    // Create squares
    appendSquares(filledGrid, TOTAL, 'unit--filled');
    appendSquares(emptyGrid, TOTAL, 'unit--empty');

    // If reduced motion, we're done — all squares already visible
    if (prefersReducedMotion) return;

    // Stagger animation on intersection
    // The chart is inside a <details> element, so we need to observe
    // the chart itself and also listen for the details toggle
    var chartContainer = filledGrid.closest('.unit-chart');
    if (!chartContainer) return;

    var hasAnimated = false;

    function animateSquares() {
      if (hasAnimated) return;
      hasAnimated = true;

      var squares = filledGrid.querySelectorAll('.unit--filled');
      for (var i = 0; i < squares.length; i++) {
        (function (sq, delay) {
          setTimeout(function () {
            sq.classList.add('is-visible');
          }, delay);
        })(squares[i], i * STAGGER_MS);
      }
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0) {
            animateSquares();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      // Observe the chart
      observer.observe(chartContainer);

      // Also handle <details> toggle — the chart might already be in
      // view when the details element is opened
      var detailsEl = chartContainer.closest('details');
      if (detailsEl) {
        detailsEl.addEventListener('toggle', function () {
          if (detailsEl.open && !hasAnimated) {
            // Re-check visibility after the details content renders
            setTimeout(function () {
              var rect = chartContainer.getBoundingClientRect();
              if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateSquares();
                observer.unobserve(chartContainer);
              }
            }, 50);
          }
        });
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUnitChart);
  } else {
    initUnitChart();
  }
})();

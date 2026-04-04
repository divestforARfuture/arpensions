/* ==========================================================================
   D3 Evidence Enhancements — Unit chart for subfinding 3g
   Loaded only on pages with d3: true
   ========================================================================== */

(function () {
  'use strict';

  if (typeof d3 === 'undefined') return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Unit Chart (37 vs 0) ---

  function initUnitChart() {
    var filledGrid = document.getElementById('unit-chart-filled');
    var emptyGrid = document.getElementById('unit-chart-empty');
    if (!filledGrid || !emptyGrid) return;

    var TOTAL = 37;
    var STAGGER_MS = 15;

    // Create filled squares using D3 data join
    d3.select(filledGrid)
      .selectAll('.unit')
      .data(d3.range(TOTAL))
      .enter()
      .append('div')
      .attr('class', 'unit unit--filled' + (prefersReducedMotion ? ' is-visible' : ''))
      .attr('aria-hidden', 'true');

    // Create empty squares
    d3.select(emptyGrid)
      .selectAll('.unit')
      .data(d3.range(TOTAL))
      .enter()
      .append('div')
      .attr('class', 'unit unit--empty')
      .attr('aria-hidden', 'true');

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

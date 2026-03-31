/* ==========================================================================
   ART Charts — Chart.js visualizations for evidence and audience pages
   Loaded conditionally on pages with front matter `charts: true`
   ========================================================================== */

(function () {
  'use strict';

  if (typeof Chart === 'undefined') return;

  // --- Theme-aware color palette ---
  function getColors() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      red:        dark ? '#e74c3c' : '#B91C1C',
      blue:       dark ? '#5dade2' : '#1a5276',
      amber:      dark ? '#F59E0B' : '#B45309',
      grayFill:   dark ? '#242424' : '#e2e2e2',
      text:       dark ? '#b0aba5' : '#474747',
      textMuted:  dark ? '#8a8480' : '#6e6e6e',
      tooltipBg:  dark ? '#2a2a2a' : '#ffffff',
      gridLine:   dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
    };
  }

  // --- Respect prefers-reduced-motion ---
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Store chart instances for theme-change rebuild
  var instances = {};

  // =========================================================================
  // EXPOSURE BAR CHART (evidence page)
  // =========================================================================

  function initExposureChart() {
    var canvas = document.getElementById('exposure-chart');
    if (!canvas) return;

    var c = getColors();
    var ctx = canvas.getContext('2d');

    if (instances.exposure) instances.exposure.destroy();

    instances.exposure = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [
          'Arkansas Treasury',
          'ATRS (Teachers)',
          'APERS (Public Employees)'
        ],
        datasets: [{
          data: [55, 50, 50],
          backgroundColor: [c.red, c.blue, c.amber],
          borderWidth: 0,
          borderRadius: 2,
          barPercentage: 0.6,
          categoryPercentage: 0.8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: reducedMotion ? 0 : 1200,
          easing: 'easeOutQuart'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: c.tooltipBg,
            titleColor: c.text,
            bodyColor: c.textMuted,
            borderColor: c.gridLine,
            borderWidth: 1,
            padding: 12,
            cornerRadius: 2,
            titleFont: {
              family: 'Inter, system-ui, sans-serif',
              size: 13,
              weight: '600'
            },
            bodyFont: {
              family: 'IBM Plex Mono, monospace',
              size: 11
            },
            callbacks: {
              label: function (context) {
                var details = [
                  '$55M current holdings (~0.5% of $11B portfolio)',
                  'Up to $50M authorized (~0.2% of $23.7B portfolio)',
                  '$25\u201350M authorized (~0.2\u20130.4% of $11.8B portfolio)'
                ];
                return details[context.dataIndex] || '';
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 60,
            ticks: {
              callback: function (value) { return '$' + value + 'M'; },
              color: c.textMuted,
              font: { family: 'IBM Plex Mono, monospace', size: 11 }
            },
            grid: { color: c.gridLine },
            border: { display: false }
          },
          y: {
            ticks: {
              color: c.text,
              font: {
                family: 'Inter, system-ui, sans-serif',
                size: 12,
                weight: '500'
              }
            },
            grid: { display: false }
          }
        }
      }
    });
  }

  // =========================================================================
  // FUNDED RATIO GAUGE (half-doughnut for audience pages)
  // =========================================================================

  function initFundedGauge(canvasId, ratio, label) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var c = getColors();
    var ctx = canvas.getContext('2d');

    if (instances[canvasId]) instances[canvasId].destroy();

    // Plugin: draw percentage + label text in the center of the half-doughnut
    var centerTextPlugin = {
      id: 'gaugeCenter_' + canvasId,
      afterDraw: function (chart) {
        var w = chart.width;
        var h = chart.height;
        var cx = chart.ctx;
        var colors = getColors();

        cx.save();

        // Big percentage number
        var pctSize = Math.max(28, Math.round(w * 0.13));
        cx.font = '600 ' + pctSize + 'px Inter, system-ui, sans-serif';
        cx.fillStyle = colors.text;
        cx.textAlign = 'center';
        cx.textBaseline = 'bottom';
        cx.fillText(ratio + '%', w / 2, h * 0.82);

        // Label below
        var labelSize = Math.max(10, Math.round(w * 0.045));
        cx.font = '500 ' + labelSize + 'px "IBM Plex Mono", monospace';
        cx.fillStyle = colors.textMuted;
        cx.textBaseline = 'top';
        cx.fillText(label || 'Funded ratio', w / 2, h * 0.82 + 4);

        cx.restore();
      }
    };

    instances[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Funded', 'Unfunded gap'],
        datasets: [{
          data: [ratio, 100 - ratio],
          backgroundColor: [c.blue, c.grayFill],
          borderWidth: 0,
          circumference: 180,
          rotation: 270
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        cutout: '72%',
        animation: {
          duration: reducedMotion ? 0 : 1000,
          easing: 'easeOutCubic'
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: c.tooltipBg,
            titleColor: c.text,
            bodyColor: c.textMuted,
            borderColor: c.gridLine,
            borderWidth: 1,
            padding: 10,
            cornerRadius: 2,
            bodyFont: { family: 'IBM Plex Mono, monospace', size: 11 },
            callbacks: {
              label: function (context) {
                if (context.dataIndex === 0) {
                  return ratio + '% funded \u2014 assets on hand per dollar owed';
                }
                return (100 - ratio) + '% unfunded liability gap';
              }
            }
          }
        }
      },
      plugins: [centerTextPlugin]
    });
  }

  // =========================================================================
  // INIT + THEME OBSERVER
  // =========================================================================

  // --- Scroll-triggered exposure chart ---
  var exposureChartReady = false;

  function initExposureOnScroll() {
    var canvas = document.getElementById('exposure-chart');
    if (!canvas || exposureChartReady) return;

    if ('IntersectionObserver' in window) {
      var chartObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            exposureChartReady = true;
            initExposureChart();
            chartObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      chartObserver.observe(canvas);
    } else {
      // Fallback: no IntersectionObserver
      exposureChartReady = true;
      initExposureChart();
    }
  }

  function initAll() {
    initExposureOnScroll();
    initFundedGauge('atrs-funded-gauge', 84, 'ATRS funded ratio');
    initFundedGauge('apers-funded-gauge', 84, 'APERS funded ratio');
  }

  // Rebuild all charts on theme change (colors update)
  var themeObs = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'data-theme') {
        // On theme change, rebuild directly (already visible)
        if (exposureChartReady) initExposureChart();
        initFundedGauge('atrs-funded-gauge', 84, 'ATRS funded ratio');
        initFundedGauge('apers-funded-gauge', 84, 'APERS funded ratio');
      }
    });
  });
  themeObs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

})();

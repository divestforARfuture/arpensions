/* ==========================================================================
   ART Charts — Chart.js visualizations for evidence and audience pages
   Loaded conditionally on pages with front matter `charts: true`
   ========================================================================== */

(function () {
  'use strict';

  // Wait for Chart.js to be available
  if (typeof Chart === 'undefined') return;

  // --- Design tokens (matches main.css) ---
  var COLORS = {
    red: '#B91C1C',
    redLight: '#FEE2E2',
    green: '#166534',
    greenLight: '#DCFCE7',
    accent: '#0C7489',
    accentLight: '#E0F2F7',
    gray: '#556068',
    grayLight: '#f0efec',
    border: '#dee3e6',
    black: '#1b2127',
    white: '#f8f7f5'
  };

  var DARK_COLORS = {
    red: '#EF4444',
    redLight: 'rgba(239, 68, 68, 0.12)',
    green: '#22C55E',
    greenLight: 'rgba(34, 197, 94, 0.12)',
    accent: '#5ec4d4',
    accentLight: '#1a2f35',
    gray: '#9CA3AF',
    grayLight: '#1E1E28',
    border: '#2D2D3A',
    black: '#E5E7EB',
    white: '#121218'
  };

  function getColors() {
    var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? DARK_COLORS : COLORS;
  }

  // --- Font settings ---
  Chart.defaults.font.family = "'Inter', system-ui, -apple-system, sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.color = COLORS.gray;

  // --- Chart instances (for theme updates) ---
  var chartInstances = [];

  // --- Theme change listener ---
  document.addEventListener('themechange', function () {
    chartInstances.forEach(function (chart) {
      if (chart.updateColors) chart.updateColors();
    });
  });

  // ==========================================================================
  // EXPOSURE BAR CHART — Agency-level Israel Bonds exposure
  // ==========================================================================
  function initExposureChart() {
    var canvas = document.getElementById('exposure-chart');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var colors = getColors();

    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['State Treasury', 'ATRS', 'APERS'],
        datasets: [{
          label: 'Exposure ($ millions)',
          data: [55, 50, 50],
          backgroundColor: [colors.red, colors.accent, colors.green],
          borderColor: [colors.red, colors.accent, colors.green],
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.65
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.black,
            titleFont: { family: "'Inter', sans-serif", weight: '600' },
            bodyFont: { family: "'IBM Plex Mono', monospace" },
            padding: 12,
            cornerRadius: 4,
            callbacks: {
              label: function (context) {
                return '$' + context.parsed.x + 'M';
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 60,
            grid: { color: colors.border, lineWidth: 0.5 },
            ticks: {
              callback: function (value) { return '$' + value + 'M'; },
              font: { family: "'IBM Plex Mono', monospace", size: 12 },
              color: colors.gray
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { family: "'Inter', sans-serif", size: 13, weight: '600' },
              color: colors.black
            }
          }
        }
      }
    });

    chart.updateColors = function () {
      var c = getColors();
      chart.data.datasets[0].backgroundColor = [c.red, c.accent, c.green];
      chart.data.datasets[0].borderColor = [c.red, c.accent, c.green];
      chart.options.scales.x.grid.color = c.border;
      chart.options.scales.x.ticks.color = c.gray;
      chart.options.scales.y.ticks.color = c.black;
      chart.options.plugins.tooltip.backgroundColor = c.black;
      chart.update('none');
    };

    chartInstances.push(chart);
  }

  // ==========================================================================
  // YIELD COMPARISON CHART — Israel Bonds vs alternatives
  // ==========================================================================
  function initYieldChart() {
    var canvas = document.getElementById('yield-chart');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var colors = getColors();

    var chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Israel Bonds (Jubilee)', 'US Treasury 10yr', 'AA Corp Bond', 'Muni Bond (AA)'],
        datasets: [{
          label: 'Approximate Yield (%)',
          data: [4.41, 4.25, 4.60, 3.80],
          backgroundColor: [colors.red, colors.accent, colors.green, colors.gray],
          borderColor: [colors.red, colors.accent, colors.green, colors.gray],
          borderWidth: 1,
          borderRadius: 4,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: colors.black,
            titleFont: { family: "'Inter', sans-serif", weight: '600' },
            bodyFont: { family: "'IBM Plex Mono', monospace" },
            padding: 12,
            cornerRadius: 4,
            callbacks: {
              label: function (context) {
                return context.parsed.y.toFixed(2) + '%';
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 6,
            grid: { color: colors.border, lineWidth: 0.5 },
            ticks: {
              callback: function (value) { return value + '%'; },
              font: { family: "'IBM Plex Mono', monospace", size: 12 },
              color: colors.gray
            }
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { family: "'Inter', sans-serif", size: 11 },
              color: colors.black,
              maxRotation: 0
            }
          }
        }
      }
    });

    chart.updateColors = function () {
      var c = getColors();
      chart.data.datasets[0].backgroundColor = [c.red, c.accent, c.green, c.gray];
      chart.data.datasets[0].borderColor = [c.red, c.accent, c.green, c.gray];
      chart.options.scales.y.grid.color = c.border;
      chart.options.scales.y.ticks.color = c.gray;
      chart.options.scales.x.ticks.color = c.black;
      chart.options.plugins.tooltip.backgroundColor = c.black;
      chart.update('none');
    };

    chartInstances.push(chart);
  }

  // --- Initialize on DOM ready ---
  function init() {
    initExposureChart();
    initYieldChart();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

/* ==========================================================================
   Decision Window Chart — ApexCharts rangeBar showing the compressed
   authorization timeline across three Arkansas state agencies.
   Loaded only on evidence page via `apexcharts: true` front matter.
   ========================================================================== */

(function () {
  'use strict';

  if (typeof ApexCharts === 'undefined') return;

  var chartEl = document.getElementById('decision-window-chart');
  if (!chartEl) return;

  // --- Respect prefers-reduced-motion ---
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Theme-aware colors ---
  function getColors() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      // Decision window bars (solid)
      red:       dark ? '#e74c3c' : '#B91C1C',
      amber:     dark ? '#F59E0B' : '#B45309',
      teal:      dark ? '#5dade2' : '#1a5276',
      // Execution gap bars (lighter)
      redLight:   dark ? 'rgba(231, 76, 60, 0.35)' : 'rgba(185, 28, 28, 0.25)',
      amberLight: dark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(180, 83, 9, 0.25)',
      tealLight:  dark ? 'rgba(93, 173, 226, 0.35)' : 'rgba(26, 82, 118, 0.25)',
      // UI
      text:      dark ? '#b0aba5' : '#474747',
      textMuted: dark ? '#8a8480' : '#6e6e6e',
      gridLine:  dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
      tooltipBg: dark ? '#2a2a2a' : '#ffffff',
      annotLine: dark ? '#e74c3c' : '#B91C1C',
      annotBg:   dark ? '#2a2a2a' : '#FFF7ED',
      bg:        dark ? '#1b1b1b' : '#ffffff'
    };
  }

  // --- Date helpers ---
  function d(str) { return new Date(str).getTime(); }

  var instance = null;

  function buildChart() {
    var c = getColors();

    if (instance) instance.destroy();

    var options = {
      chart: {
        type: 'rangeBar',
        height: 260,
        fontFamily: 'Inter, system-ui, sans-serif',
        background: 'transparent',
        toolbar: { show: false },
        animations: {
          enabled: !reducedMotion,
          speed: 600,
          easing: 'easeinout'
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '55%',
          rangeBarGroupRows: true,
          borderRadius: 2
        }
      },
      colors: [
        c.red, c.amber, c.teal,
        c.redLight, c.amberLight, c.tealLight
      ],
      fill: { type: 'solid', opacity: 1 },
      series: [
        // Decision window (solid)
        {
          name: 'Treasury \u2014 Sales tour \u2192 Purchase',
          data: [{ x: 'Treasury', y: [d('2025-04-15'), d('2025-05-15')] }]
        },
        {
          name: 'APERS \u2014 Sales tour \u2192 Board vote',
          data: [{ x: 'APERS', y: [d('2025-04-15'), d('2025-06-11')] }]
        },
        {
          name: 'ATRS \u2014 Sales tour \u2192 Board vote',
          data: [{ x: 'ATRS', y: [d('2025-04-15'), d('2025-06-02')] }]
        },
        // Execution gap (lighter)
        {
          name: 'Treasury \u2014 Purchased immediately',
          data: [{ x: 'Treasury', y: [d('2025-05-15'), d('2025-05-17')] }]
        },
        {
          name: 'APERS \u2014 Board vote \u2192 First purchase',
          data: [{ x: 'APERS', y: [d('2025-06-11'), d('2025-11-01')] }]
        },
        {
          name: 'ATRS \u2014 Board vote \u2192 Guidelines formalized',
          data: [{ x: 'ATRS', y: [d('2025-06-02'), d('2025-09-25')] }]
        }
      ],
      legend: {
        show: false
      },
      xaxis: {
        type: 'datetime',
        min: d('2024-11-01'),
        max: d('2025-12-01'),
        labels: {
          format: 'MMM yyyy',
          style: {
            colors: c.textMuted,
            fontSize: '10px',
            fontFamily: 'IBM Plex Mono, monospace'
          }
        },
        axisBorder: { show: false },
        axisTicks: { color: c.gridLine }
      },
      yaxis: {
        labels: {
          style: {
            colors: c.text,
            fontSize: '12px',
            fontWeight: 500
          }
        }
      },
      grid: {
        borderColor: c.gridLine,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
        padding: { left: 8, right: 16 }
      },
      tooltip: {
        custom: function (opts) {
          var seriesName = opts.w.globals.seriesNames[opts.seriesIndex];
          var y1 = opts.y1;
          var y2 = opts.y2;
          var fmt = function (ts) {
            var dt = new Date(ts);
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                          'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months[dt.getMonth()] + ' ' + dt.getDate() + ', ' + dt.getFullYear();
          };
          var days = Math.round((y2 - y1) / (1000 * 60 * 60 * 24));
          var durationLabel = days <= 2 ? 'Immediate' : days + ' days';
          var tc = getColors();
          return '<div style="padding:10px 14px;font-family:Inter,system-ui,sans-serif;font-size:12px;' +
            'background:' + tc.tooltipBg + ';color:' + tc.text + ';' +
            'border:1px solid ' + tc.gridLine + ';border-radius:2px;">' +
            '<strong>' + seriesName + '</strong><br>' +
            '<span style="font-family:IBM Plex Mono,monospace;font-size:11px;color:' + tc.textMuted + '">' +
            fmt(y1) + ' \u2192 ' + fmt(y2) + ' (' + durationLabel + ')' +
            '</span></div>';
        }
      },
      annotations: {
        xaxis: [
          {
            x: d('2024-12-15'),
            strokeDashArray: 5,
            borderColor: c.annotLine,
            opacity: 0.7,
            label: {
              text: 'Internal memo: hold',
              orientation: 'horizontal',
              borderColor: c.annotLine,
              borderWidth: 1,
              borderRadius: 2,
              style: {
                color: c.text,
                background: c.annotBg,
                fontSize: '10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 500,
                padding: { left: 6, right: 6, top: 3, bottom: 3 }
              },
              offsetY: -10
            }
          },
          {
            x: d('2025-04-15'),
            strokeDashArray: 3,
            borderColor: c.teal,
            opacity: 0.5,
            label: {
              text: 'April sales tour',
              orientation: 'horizontal',
              borderColor: c.teal,
              borderWidth: 1,
              borderRadius: 2,
              style: {
                color: c.text,
                background: c.annotBg,
                fontSize: '10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 500,
                padding: { left: 6, right: 6, top: 3, bottom: 3 }
              },
              offsetY: -10
            }
          }
        ],
        points: [
          {
            x: d('2025-06-02'),
            y: 'ATRS',
            marker: {
              size: 5,
              fillColor: '#FFFFFF',
              strokeColor: c.red,
              strokeWidth: 2,
              shape: 'circle'
            },
            label: {
              text: 'Knight: lone \"no\" vote',
              borderColor: c.red,
              borderWidth: 1,
              borderRadius: 2,
              style: {
                color: c.text,
                background: c.annotBg,
                fontSize: '10px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 500,
                padding: { left: 6, right: 6, top: 3, bottom: 3 }
              },
              offsetY: -12
            }
          }
        ]
      }
    };

    instance = new ApexCharts(chartEl, options);
    instance.render();
  }

  // --- Legend (custom, below chart) ---
  var legendEl = document.getElementById('decision-window-legend');
  if (legendEl) {
    legendEl.innerHTML =
      '<span class="dw-legend-item">' +
        '<span class="dw-legend-swatch dw-legend-swatch--solid"></span>' +
        'Sales tour \u2192 Authorization' +
      '</span>' +
      '<span class="dw-legend-item">' +
        '<span class="dw-legend-swatch dw-legend-swatch--light"></span>' +
        'Authorization \u2192 First action' +
      '</span>' +
      '<span class="dw-legend-item">' +
        '<span class="dw-legend-swatch dw-legend-swatch--annot"></span>' +
        'Annotation' +
      '</span>';
  }

  // Rebuild on theme change
  var themeObs = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      if (m.attributeName === 'data-theme') buildChart();
    });
  });
  themeObs.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildChart);
  } else {
    buildChart();
  }

})();

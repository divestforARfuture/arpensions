/* ==========================================================================
   Scroll Animations — AOS init + animated counters on intersection
   Loaded on all pages via default layout
   ========================================================================== */

(function () {
  'use strict';

  // --- Respect prefers-reduced-motion (reactive to OS setting changes) ---
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersReducedMotion = motionQuery.matches;

  // --- AOS initialization ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 600,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: prefersReducedMotion
    });

    // Refresh AOS after theme change (layout may shift)
    var themeObs = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === 'data-theme') AOS.refresh();
      });
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  }

  // --- Animated counters (vanilla, no CDN dependency) ---
  //
  // Usage:  <span data-countup="100" data-countup-prefix="$" data-countup-suffix="M">$100M</span>
  //
  // The element's textContent is the static fallback (shown if JS fails or
  // reduced-motion is active). When the element scrolls into view, the
  // number counts up from 0 to the target value with an ease-out curve.
  //
  // Attributes:
  //   data-countup          Target number (required)
  //   data-countup-prefix   Text before the number (default: "")
  //   data-countup-suffix   Text after the number (default: "")
  //   data-countup-duration Duration in seconds (default: 2)

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-countup'));
    var prefix = el.getAttribute('data-countup-prefix') || '';
    var suffix = el.getAttribute('data-countup-suffix') || '';
    var durationAttr = el.getAttribute('data-countup-duration');
    var duration = (durationAttr !== null) ? parseFloat(durationAttr) : 2;
    var rawTarget = el.getAttribute('data-countup');
    var decimals = (rawTarget.indexOf('.') !== -1)
      ? rawTarget.split('.')[1].length
      : 0;

    if (isNaN(target)) return;

    // If reduced motion, just show the final value immediately
    if (prefersReducedMotion) {
      if (decimals === 0) {
        el.textContent = prefix + Math.round(target).toLocaleString() + suffix;
      } else {
        el.textContent = prefix + target.toFixed(decimals) + suffix;
      }
      return;
    }

    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      var current = target * easeOutCubic(progress);

      if (decimals === 0) {
        el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
      } else {
        el.textContent = prefix + current.toFixed(decimals) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.classList.add('counted');
      }
    }

    requestAnimationFrame(step);
  }

  // Use IntersectionObserver to trigger counters when visible
  var counterEls = document.querySelectorAll('[data-countup]');

  if (counterEls.length > 0 && 'IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    counterEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // --- React to OS reduced-motion changes after page load ---
  motionQuery.addEventListener('change', function (e) {
    prefersReducedMotion = e.matches;
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
        disable: e.matches
      });
    }
  });

})();

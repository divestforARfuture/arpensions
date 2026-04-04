/* ==========================================================================
   Timeline Drawing Thread — SVG line overlay that traces down the timeline
   as the reader scrolls. Accent dots appear at highlighted events.
   Loaded only on pages with timeline_thread: true
   ========================================================================== */

(function () {
  'use strict';

  var wrapper = document.querySelector('.timeline-wrapper');
  if (!wrapper) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function init() {
    // Create SVG overlay
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'timeline-thread');
    svg.setAttribute('aria-hidden', 'true');

    var wrapperHeight = wrapper.scrollHeight;
    svg.setAttribute('viewBox', '0 0 2 ' + wrapperHeight);
    svg.setAttribute('preserveAspectRatio', 'none');

    // Main drawing line
    var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '1');
    line.setAttribute('y1', '0');
    line.setAttribute('x2', '1');
    line.setAttribute('y2', String(wrapperHeight));
    line.setAttribute('stroke-linecap', 'round');

    var totalLength = wrapperHeight;
    if (!prefersReducedMotion) {
      line.style.strokeDasharray = totalLength;
      line.style.strokeDashoffset = totalLength;
    }

    svg.appendChild(line);

    // Find highlight events and place dots
    var highlights = wrapper.querySelectorAll('.timeline-event--highlight');
    var dots = [];

    for (var i = 0; i < highlights.length; i++) {
      var eventEl = highlights[i];
      var eventTop = eventEl.offsetTop;

      // Walk up offset parents within wrapper to get correct position
      var parent = eventEl.offsetParent;
      while (parent && parent !== wrapper) {
        eventTop += parent.offsetTop;
        parent = parent.offsetParent;
      }

      var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('cx', '1');
      dot.setAttribute('cy', String(eventTop));
      dot.setAttribute('r', '3');
      dot.setAttribute('class', 'thread-dot' + (prefersReducedMotion ? ' is-reached' : ''));
      svg.appendChild(dot);
      dots.push({ el: dot, y: eventTop });
    }

    wrapper.appendChild(svg);

    // If reduced motion, show everything immediately and bail
    if (prefersReducedMotion) return;

    // Scroll-driven animation using scroll event + rAF throttle
    var ticking = false;

    function updateThread() {
      var wrapperRect = wrapper.getBoundingClientRect();
      var viewportHeight = window.innerHeight;

      // Calculate how far through the timeline we've scrolled
      var scrollProgress = (viewportHeight - wrapperRect.top) / (wrapperRect.height + viewportHeight);
      scrollProgress = Math.max(0, Math.min(1, scrollProgress));

      // Map scroll progress to line reveal
      var revealLength = totalLength * scrollProgress;
      var offset = totalLength - revealLength;
      line.style.strokeDashoffset = offset;

      // Reveal dots when the line reaches them
      var lineY = revealLength;
      for (var i = 0; i < dots.length; i++) {
        if (lineY >= dots[i].y) {
          dots[i].el.classList.add('is-reached');
        } else {
          dots[i].el.classList.remove('is-reached');
        }
      }
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateThread();
          ticking = false;
        });
        ticking = true;
      }
    }

    // Use IntersectionObserver to add/remove scroll listener
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll(); // initial draw
          } else {
            window.removeEventListener('scroll', onScroll);
          }
        });
      }, { rootMargin: '200px' });

      observer.observe(wrapper);
    }

    // Handle resize — recalculate heights
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        wrapperHeight = wrapper.scrollHeight;
        totalLength = wrapperHeight;
        svg.setAttribute('viewBox', '0 0 2 ' + wrapperHeight);
        line.setAttribute('y2', String(wrapperHeight));
        line.style.strokeDasharray = totalLength;

        // Recalculate dot positions
        for (var i = 0; i < highlights.length; i++) {
          var eventEl = highlights[i];
          var eventTop = eventEl.offsetTop;
          var parent = eventEl.offsetParent;
          while (parent && parent !== wrapper) {
            eventTop += parent.offsetTop;
            parent = parent.offsetParent;
          }
          dots[i].y = eventTop;
          dots[i].el.setAttribute('cy', String(eventTop));
        }
      }, 200);
    });
  }

  // Defer to window.load so web fonts have reflowed
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();

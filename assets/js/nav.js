// Mobile nav toggle with Escape key and click-outside-to-close
(function() {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  var nav = document.querySelector('.site-nav');

  if (!toggle || !menu || !nav) return;

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('nav-open');
  }

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('nav-open');
    // Move focus to first menu link for keyboard users
    var firstLink = menu.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  // Toggle button click
  toggle.addEventListener('click', function() {
    if (isOpen()) {
      closeMenu();
      toggle.focus();
    } else {
      openMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen()) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close on click outside nav
  document.addEventListener('click', function(e) {
    if (isOpen() && !nav.contains(e.target)) {
      closeMenu();
    }
  });

  // Close when a nav link is clicked (navigating away)
  menu.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      closeMenu();
    }
  });
})();

// Nav dropdown enhancements — close-on-outside-click, close-on-escape, one-open-at-a-time
(function() {
  var dropdowns = document.querySelectorAll('.nav-dropdown');
  if (!dropdowns.length) return;

  // Only one dropdown open at a time
  dropdowns.forEach(function(details) {
    details.addEventListener('toggle', function() {
      if (details.open) {
        dropdowns.forEach(function(other) {
          if (other !== details) other.open = false;
        });
      }
    });
  });

  // Close dropdowns on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      dropdowns.forEach(function(d) {
        if (d.open) {
          d.open = false;
          d.querySelector('summary').focus();
        }
      });
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown')) {
      dropdowns.forEach(function(d) { d.open = false; });
    }
  });
})();

// Active nav highlighting — reinforce server-side aria-current with client-side path matching
(function() {
  var path = window.location.pathname.replace(/\/+$/, '') || '/';
  var links = document.querySelectorAll('.nav-links a');

  links.forEach(function(link) {
    var href = (link.getAttribute('href') || '').replace(/\/+$/, '') || '/';
    if (path === href || (href !== '/' && path.indexOf(href) === 0)) {
      link.setAttribute('aria-current', 'page');
      // Mark parent dropdown summary as active
      var dropdown = link.closest('.nav-dropdown');
      if (dropdown) {
        var summary = dropdown.querySelector('summary');
        if (summary) summary.setAttribute('aria-current', 'true');
        dropdown.setAttribute('data-has-active', 'true');
      }
    } else {
      link.removeAttribute('aria-current');
    }
  });
})();

// Scroll-triggered stat counter animation
(function() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var stats = document.querySelectorAll('[data-count]');
  if (!stats.length) return;

  var animated = false;

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var start = performance.now();

    // Special handling for zero — delay then pulse
    if (target === 0) {
      el.textContent = '0';
      setTimeout(function() {
        el.classList.add('stat-number--revealed');
      }, duration + 300);
      return;
    }

    function step(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for natural deceleration
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(target * eased);
      el.textContent = prefix + current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    el.textContent = prefix + '0' + suffix;
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach(animateCount);
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  var bar = document.querySelector('.stats-bar');
  if (bar) observer.observe(bar);
})();

// External links — add target="_blank" and rel="noopener noreferrer" to off-site links
// Uses relList.add() to avoid clobbering existing rel values (WCAG 2.4.4)
(function() {
  var host = window.location.hostname;
  var links = document.querySelectorAll('a[href^="http"]');

  links.forEach(function(link) {
    if (link.hostname !== host) {
      link.setAttribute('target', '_blank');
      link.relList.add('noopener', 'noreferrer');

      // Add visually-hidden cue for screen readers (WCAG AA)
      if (!link.querySelector('.sr-only')) {
        var hint = document.createElement('span');
        hint.className = 'sr-only';
        hint.textContent = ' (opens in new tab)';
        link.appendChild(hint);
      }
    }
  });
})();

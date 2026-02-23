// Mobile nav toggle with Escape key and click-outside-to-close
(function() {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  var nav = document.querySelector('.site-nav');

  if (!toggle || !menu) return;

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

// Active nav highlighting — reinforce server-side aria-current with client-side path matching
(function() {
  var path = window.location.pathname.replace(/\/+$/, '') || '/';
  var links = document.querySelectorAll('.nav-links a');

  links.forEach(function(link) {
    var href = (link.getAttribute('href') || '').replace(/\/+$/, '') || '/';
    if (path === href) {
      link.setAttribute('aria-current', 'page');
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
(function() {
  var host = window.location.hostname;
  var links = document.querySelectorAll('a[href^="http"]');

  links.forEach(function(link) {
    if (link.hostname !== host) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
})();

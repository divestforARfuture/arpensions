// Mobile nav toggle with Escape key and click-outside-to-close
(function() {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('nav-menu');
  var nav = document.querySelector('.site-nav');

  if (!toggle || !menu || !nav) return;

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('nav-open');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('nav-open');
    // Lock background scroll while the full-screen overlay is open
    document.body.style.overflow = 'hidden';
    var firstItem = menu.querySelector('a');
    if (firstItem) firstItem.focus();
  }

  function isOpen() {
    return toggle.getAttribute('aria-expanded') === 'true';
  }

  toggle.addEventListener('click', function() {
    if (isOpen()) {
      closeMenu();
      toggle.focus();
    } else {
      openMenu();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpen()) {
      closeMenu();
      toggle.focus();
    }
  });

  // Close when a nav link is clicked (navigating away)
  menu.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      closeMenu();
    }
  });
})();

// Scroll-triggered nav shadow — adds .is-scrolled when the page has scrolled
(function() {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;

  function update() {
    if (window.scrollY > 4) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
})();

// Active nav highlighting — reinforce server-side aria-current with client-side path matching
(function() {
  var path = window.location.pathname.replace(/\/+$/, '') || '/';
  var links = document.querySelectorAll('.nav-links a');

  links.forEach(function(link) {
    var href = (link.getAttribute('href') || '').replace(/\/+$/, '') || '/';
    if (path === href || (href !== '/' && path.indexOf(href) === 0)) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
})();

// Scroll-triggered stat counter animation
(function() {
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

      if (!link.querySelector('.sr-only')) {
        var hint = document.createElement('span');
        hint.className = 'sr-only';
        hint.textContent = ' (opens in new tab)';
        link.appendChild(hint);
      }
    }
  });
})();

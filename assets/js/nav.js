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

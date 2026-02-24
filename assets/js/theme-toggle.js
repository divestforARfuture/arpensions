// Dark mode / Light mode toggle for D4ARF
(function () {
  'use strict';

  var STORAGE_KEY = 'd4arf-theme';

  function getTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateLogos(theme);
    updateToggleButton(theme);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  function updateLogos(theme) {
    var logos = document.querySelectorAll('.theme-logo');
    logos.forEach(function (img) {
      var src = theme === 'dark' ? img.getAttribute('data-dark-src') : img.getAttribute('data-light-src');
      if (src) img.setAttribute('src', src);
    });
  }

  function updateToggleButton(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var isDark = theme === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    var sunIcon = btn.querySelector('.icon-sun');
    var moonIcon = btn.querySelector('.icon-moon');
    if (sunIcon) sunIcon.style.display = isDark ? 'block' : 'none';
    if (moonIcon) moonIcon.style.display = isDark ? 'none' : 'block';
  }

  // Public toggle function
  window.toggleTheme = function () {
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';

    // Add transition class for smooth switch
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      document.documentElement.classList.add('theme-transition');
      setTimeout(function () {
        document.documentElement.classList.remove('theme-transition');
      }, 350);
    }

    setTheme(next);
  };

  // Init on DOMContentLoaded: wire up button and set logos
  function onReady() {
    var theme = getTheme();
    // Theme attribute already set by inline FOUC script, but ensure consistency
    document.documentElement.setAttribute('data-theme', theme);
    updateLogos(theme);
    updateToggleButton(theme);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', window.toggleTheme);
    }

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();

// Dark mode / Light mode toggle
(function () {
  'use strict';

  var STORAGE_KEY = 'api-theme';
  var LEGACY_KEY = 'art-theme';

  // One-time silent migration: copy any legacy 'art-theme' value to the new
  // 'api-theme' key so returning visitors keep their saved theme. The
  // anti-FOUC inline script reads both keys for first paint; this just
  // promotes the value so future paints read it from the new key directly.
  if (!localStorage.getItem(STORAGE_KEY)) {
    var legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy === 'dark' || legacy === 'light') {
      localStorage.setItem(STORAGE_KEY, legacy);
    }
  }

  function getTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncBrowserTheme(theme) {
    var root = document.documentElement;
    root.style.colorScheme = theme;
    root.style.backgroundColor = theme === 'dark' ? '#1C1917' : '#F8F5F0';
    root.style.color = theme === 'dark' ? '#F8F5F0' : '#1C1917';
    var meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) {
      meta.setAttribute('content', theme);
    }
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    syncBrowserTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleButton(theme);
    updateLogoAria(theme);
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  function updateToggleButton(theme) {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var isDark = theme === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function updateLogoAria(theme) {
    var isDark = theme === 'dark';
    var lights = document.querySelectorAll('.logo-light');
    var darks = document.querySelectorAll('.logo-dark');
    for (var i = 0; i < lights.length; i++) {
      if (isDark) lights[i].setAttribute('aria-hidden', 'true');
      else lights[i].removeAttribute('aria-hidden');
    }
    for (var j = 0; j < darks.length; j++) {
      if (isDark) darks[j].removeAttribute('aria-hidden');
      else darks[j].setAttribute('aria-hidden', 'true');
    }
  }

  function toggleTheme() {
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
  }

  // Init on DOMContentLoaded: wire up button
  function onReady() {
    var theme = getTheme();
    // Theme attribute already set by inline FOUC script, but ensure consistency
    document.documentElement.setAttribute('data-theme', theme);
    syncBrowserTheme(theme);
    updateToggleButton(theme);
    updateLogoAria(theme);

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', toggleTheme);
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

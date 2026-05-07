(function() {
  'use strict';
  var btn = document.createElement('button');
  btn.setAttribute('type', 'button');
  btn.className = 'scroll-to-top';
  btn.setAttribute('aria-label', 'Scroll to top');
  btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>';
  btn.style.display = 'none';
  document.body.appendChild(btn);

  function smoothScrollTop() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    var target = document.getElementById('main-content') || document.body;
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  btn.addEventListener('click', smoothScrollTop);

  // Footer "Back to top" link — promote the hash anchor to smooth scroll.
  var footerLink = document.querySelector('.footer-back-to-top');
  if (footerLink) {
    footerLink.addEventListener('click', function(e) {
      e.preventDefault();
      smoothScrollTop();
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        btn.style.display = window.scrollY > window.innerHeight ? '' : 'none';
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

(function() {
  'use strict';

  // Only show on long content pages
  var article = document.querySelector('.page-content, .landing-content, .evidence-page, .issue-page');
  if (!article) return;

  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', 'Reading progress');
  bar.setAttribute('aria-valuemin', '0');
  bar.setAttribute('aria-valuemax', '100');
  document.body.appendChild(bar);

  var ticking = false;

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
    bar.setAttribute('aria-valuenow', Math.round(progress));
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });

  updateProgress();
})();

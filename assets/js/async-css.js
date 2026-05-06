// Async CSS loader — externalized from inline `onload="this.media='all'"`
// to keep script-src CSP free of 'unsafe-inline'. Picks up any <link> tagged
// with data-async-css and switches it from media="print" to media="all" once
// the stylesheet finishes downloading, so non-critical CSS doesn't block paint.
(function () {
  'use strict';
  var links = document.querySelectorAll('link[data-async-css]');
  for (var i = 0; i < links.length; i++) {
    (function (link) {
      function activate() { link.media = 'all'; }
      if (link.sheet) {
        activate();
      } else {
        link.addEventListener('load', activate);
      }
    })(links[i]);
  }
})();

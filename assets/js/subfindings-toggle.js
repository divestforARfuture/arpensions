/* Sub-findings toggle-all: expand/collapse all <details class="subfinding"> */
(function () {
  'use strict';

  var btn = document.querySelector('.subfindings-toggle-all');
  if (!btn) return;

  var details = document.querySelectorAll('details.subfinding');
  if (!details.length) return;

  function allOpen() {
    for (var i = 0; i < details.length; i++) {
      if (!details[i].open) return false;
    }
    return true;
  }

  function updateLabel() {
    var open = allOpen();
    btn.textContent = open ? 'Collapse all sub-findings' : 'Show all sub-findings';
    btn.setAttribute('aria-expanded', open);
  }

  btn.addEventListener('click', function () {
    var shouldOpen = !allOpen();
    details.forEach(function (d) { d.open = shouldOpen; });
    updateLabel();
  });

  /* Update label when individual details are toggled */
  details.forEach(function (d) {
    d.addEventListener('toggle', updateLabel);
  });
})();

/* Auto-open a subfinding if its id is the URL hash on page load */
(function () {
  var hash = window.location.hash.slice(1);
  if (!hash) return;
  var target = document.getElementById(hash);
  if (target && target.classList.contains('subfinding')) {
    target.open = true;
  }
})();

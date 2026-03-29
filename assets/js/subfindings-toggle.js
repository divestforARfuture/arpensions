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
    btn.textContent = allOpen() ? 'Collapse all sub-findings' : 'Show all sub-findings';
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

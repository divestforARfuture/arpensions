// Wrap page-content tables in a scrollable div for responsive overflow
// without breaking ARIA table semantics (display:block on <table> breaks it)
(function () {
  'use strict';
  function wrapTables() {
    var tables = document.querySelectorAll('.page-content table');
    tables.forEach(function (table) {
      if (table.parentNode.classList.contains('table-scroll-wrapper')) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'table-scroll-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wrapTables);
  } else {
    wrapTables();
  }
})();

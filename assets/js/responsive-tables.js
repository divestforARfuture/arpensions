(function() {
  'use strict';
  var tables = document.querySelectorAll('.issue-agency-table table');
  tables.forEach(function(table) {
    var headers = Array.from(table.querySelectorAll('thead th')).map(function(th) {
      return th.textContent.trim();
    });
    table.querySelectorAll('tbody tr').forEach(function(row) {
      row.querySelectorAll('td').forEach(function(td, i) {
        if (headers[i]) td.setAttribute('data-label', headers[i]);
      });
    });
  });
})();

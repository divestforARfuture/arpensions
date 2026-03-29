/* Evidence page — sticky TOC with IntersectionObserver
   Tracks which heading is in view and highlights the corresponding TOC link.
   Mobile: toggle dropdown open/close. */
(function () {
  'use strict';

  var sidebar = document.querySelector('.evidence-toc-sidebar');
  if (!sidebar) return;

  var toggle = sidebar.querySelector('.evidence-toc-toggle');
  var list = sidebar.querySelector('.evidence-toc-list');
  var currentLabel = sidebar.querySelector('.evidence-toc-current');
  var links = sidebar.querySelectorAll('.evidence-toc-link');
  var activeClass = 'evidence-toc-link--active';

  /* ---- Collect heading elements referenced by TOC links ---- */
  var headingMap = [];
  links.forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    var el = document.getElementById(id);
    if (el) headingMap.push({ id: id, el: el, link: a });
  });

  /* ---- IntersectionObserver: mark the topmost visible heading ---- */
  var currentId = '';

  function setActive(id) {
    if (id === currentId) return;
    currentId = id;
    links.forEach(function (a) {
      a.classList.toggle(activeClass, a.getAttribute('href') === '#' + id);
    });
    /* Update mobile collapsed label */
    var active = sidebar.querySelector('.' + activeClass);
    if (active && currentLabel) {
      currentLabel.textContent = active.textContent;
    }
  }

  if ('IntersectionObserver' in window && headingMap.length) {
    /* rootMargin: trigger when heading crosses a line 20% from the top */
    var observer = new IntersectionObserver(
      function (entries) {
        /* Find the topmost heading that is intersecting */
        var visible = [];
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible.push(entry);
          }
        });
        if (visible.length) {
          /* Pick the one closest to the top */
          visible.sort(function (a, b) {
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });
          setActive(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -75% 0px', threshold: 0 }
    );

    headingMap.forEach(function (item) {
      observer.observe(item.el);
    });
  }

  /* ---- Mobile dropdown toggle ---- */
  if (toggle && list) {
    toggle.addEventListener('click', function () {
      var expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      list.classList.toggle('evidence-toc-list--open', !expanded);
    });

    /* Close dropdown when a link is tapped */
    links.forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        list.classList.remove('evidence-toc-list--open');
      });
    });
  }

  /* ---- Set initial active from hash or first heading ---- */
  var hash = window.location.hash.slice(1);
  if (hash && document.getElementById(hash)) {
    setActive(hash);
  } else if (headingMap.length) {
    setActive(headingMap[0].id);
  }
})();

// Copy-to-clipboard for letter templates
(function() {
  var buttons = document.querySelectorAll('.copy-letter-btn');
  if (!buttons.length) return;

  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var template = btn.closest('.letter-template');
      if (!template) return;

      // Clone and strip non-content elements
      var clone = template.cloneNode(true);
      var cloneBtn = clone.querySelector('.copy-letter-btn');
      if (cloneBtn) cloneBtn.remove();
      var heading = clone.querySelector('.letter-heading');
      if (heading) heading.remove();

      var text = clone.textContent.trim()
        .replace(/\n{3,}/g, '\n\n'); // Collapse excessive newlines

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
          showCopied(btn);
        }).catch(function() {
          fallbackCopy(text, btn);
        });
      } else {
        fallbackCopy(text, btn);
      }
    });
  });

  function showCopied(btn) {
    btn.textContent = 'Copied!';
    btn.classList.add('copy-letter-btn--copied');
    setTimeout(function() {
      btn.textContent = 'Copy';
      btn.classList.remove('copy-letter-btn--copied');
    }, 2000);
  }

  function fallbackCopy(text, btn) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showCopied(btn);
    } catch (e) {
      btn.textContent = 'Error';
      setTimeout(function() { btn.textContent = 'Copy'; }, 2000);
    }
    document.body.removeChild(textarea);
  }
})();

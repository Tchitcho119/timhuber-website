(function () {
  'use strict';

  var toggle  = document.querySelector('.nav-toggle');
  var overlay = document.getElementById('nav-mobile');
  if (!toggle || !overlay) return;

  toggle.addEventListener('click', function () {
    var expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    toggle.setAttribute('aria-label', expanded ? 'Menü öffnen' : 'Menü schließen');
    overlay.classList.toggle('is-open', !expanded);
  });
}());

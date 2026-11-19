/* ==========================================================================
   Brike Place — ícones SVG inline (sem dependências externas)
   Uso no HTML:  <i data-icon="search"></i>
   Uso no JS:    Brike.icon('heart')
   ========================================================================== */
(function () {
  'use strict';

  var PATHS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    recycle: '<path d="M21 12a9 9 0 0 0-15.5-6.2L3 8.5"/><path d="M3 3v5.5h5.5"/><path d="M3 12a9 9 0 0 0 15.5 6.2l2.5-2.7"/><path d="M21 21v-5.5h-5.5"/>',
    tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><path d="M7 7h.01"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="m5 12 5 5L20 7"/>',
    camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    handshake: '<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2"/><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2l-3.8-3.8a2.1 2.1 0 0 0-3 0l-.7.7a1.4 1.4 0 0 1-2 0 1.4 1.4 0 0 1 0-2l2.7-2.7a4.2 4.2 0 0 1 3-1.2H16"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1.4 1.4 0 0 0 2-2"/><path d="M3 4h8"/>',
    box: '<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5"/><path d="M12 13v8"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>'
  };

  function icon(name, cls) {
    var inner = PATHS[name] || '';
    return '<svg class="bp-icon' + (cls ? ' ' + cls : '') + '" data-name="' + name + '" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  // Troca <i data-icon="x"></i> pelo SVG correspondente
  function hydrate(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
      var cls = el.getAttribute('data-icon-class') || '';
      var tmp = document.createElement('span');
      tmp.innerHTML = icon(el.getAttribute('data-icon'), cls);
      el.replaceWith(tmp.firstChild);
    });
  }

  window.Brike = window.Brike || {};
  window.Brike.icon = icon;
  window.Brike.hydrateIcons = hydrate;
})();

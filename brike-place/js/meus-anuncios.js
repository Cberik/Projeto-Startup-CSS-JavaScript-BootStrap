/* ==========================================================================
   Brike Place — Meus anúncios
   ========================================================================== */
(function () {
  'use strict';
  var B = window.Brike;

  var grid = document.getElementById('myGrid');
  var empty = document.getElementById('myEmpty');
  var statCount = document.getElementById('statCount');
  var statValue = document.getElementById('statValue');
  var confirmEl = document.getElementById('confirmDelete');
  var confirmName = document.getElementById('confirmName');
  var confirmBtn = document.getElementById('confirmBtn');
  var pendingId = null;

  function render() {
    var mine = B.allAds().filter(function (p) { return p.meu; });
    var real = mine.filter(function (p) { return p.usuario; });

    grid.innerHTML = mine.map(function (p) { return '<div class="col">' + B.cardHTML(p, { owner: true }) + '</div>'; }).join('');
    statCount.textContent = mine.length;
    statValue.textContent = B.fmtPrice(mine.reduce(function (s, p) { return s + (Number(p.preco) || 0); }, 0));
    empty.classList.toggle('d-none', real.length > 0);
  }

  document.addEventListener('click', function (e) {
    var del = e.target.closest('[data-del]');
    if (!del) return;
    pendingId = del.getAttribute('data-del');
    var p = B.findAd(pendingId);
    confirmName.textContent = p ? p.titulo : 'este anúncio';
    bootstrap.Modal.getOrCreateInstance(confirmEl).show();
  });

  confirmBtn.addEventListener('click', function () {
    if (pendingId) { B.deleteUserAd(pendingId); pendingId = null; }
    bootstrap.Modal.getOrCreateInstance(confirmEl).hide();
    render();
    B.toast('Anúncio excluído');
  });

  document.addEventListener('DOMContentLoaded', function () {
    render();
    if (new URLSearchParams(window.location.search).get('novo') === '1') {
      B.toast('Seu desapego foi publicado com sucesso!');
      history.replaceState(null, '', 'meus-anuncios.html');
    }
  });
})();

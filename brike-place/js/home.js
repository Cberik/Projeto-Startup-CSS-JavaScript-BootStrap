/* ==========================================================================
   Brike Place — página inicial: vitrine com busca, categorias e ordenação
   ========================================================================== */
(function () {
  'use strict';
  var B = window.Brike;

  var state = { cat: 'todos', q: '', sort: 'recentes' };

  var grid = document.getElementById('productGrid');
  var chips = document.getElementById('categoryChips');
  var sortSel = document.getElementById('sortSelect');
  var count = document.getElementById('resultCount');
  var empty = document.getElementById('emptyState');
  var emptyMsg = document.getElementById('emptyMsg');
  var clearBtn = document.getElementById('clearFilters');
  var navInput = document.querySelector('#navSearch input');

  function matches(p) {
    if (state.cat === 'favoritos') { if (!B.favs.has(p.id)) return false; }
    else if (state.cat !== 'todos' && p.categoria !== state.cat) return false;
    if (state.q) {
      var hay = B.norm([p.titulo, p.descricao, p.detalhe, p.local, B.categoria(p.categoria).label].join(' '));
      var ok = B.norm(state.q).split(/\s+/).every(function (t) { return hay.indexOf(t) > -1; });
      if (!ok) return false;
    }
    return true;
  }

  function sorted(list) {
    var l = list.slice();
    if (state.sort === 'menor') l.sort(function (a, b) { return a.preco - b.preco; });
    else if (state.sort === 'maior') l.sort(function (a, b) { return b.preco - a.preco; });
    else l.sort(function (a, b) { return b.ts - a.ts; });
    return l;
  }

  function renderChips(all) {
    var favN = all.filter(function (p) { return B.favs.has(p.id); }).length;
    var used = {};
    all.forEach(function (p) { used[p.categoria] = (used[p.categoria] || 0) + 1; });

    var items = [{ id: 'todos', label: 'Todos', n: all.length }];
    B.CATEGORIAS.forEach(function (c) { if (used[c.id]) items.push({ id: c.id, label: c.curto, n: used[c.id] }); });
    items.push({ id: 'favoritos', label: 'Favoritos', n: favN, icon: 'heart' });

    chips.innerHTML = items.map(function (c) {
      var active = state.cat === c.id;
      return '<button type="button" class="bp-chip' + (active ? ' is-active' : '') + '" data-cat="' + c.id + '" aria-pressed="' + active + '">' +
        (c.icon ? B.icon(c.icon) : '') + B.esc(c.label) + '<span class="bp-chip__n">' + c.n + '</span></button>';
    }).join('');
  }

  function render() {
    var all = B.allAds();
    renderChips(all);
    var list = sorted(all.filter(matches));

    grid.innerHTML = list.map(function (p) { return '<div class="col">' + B.cardHTML(p) + '</div>'; }).join('');
    count.textContent = list.length + (list.length === 1 ? ' desapego encontrado' : ' desapegos encontrados');

    var none = list.length === 0;
    empty.classList.toggle('d-none', !none);
    grid.classList.toggle('d-none', none);
    if (none) {
      emptyMsg.textContent = state.cat === 'favoritos' && !state.q
        ? 'Toque no coração dos produtos que você curtir para guardá-los aqui.'
        : 'Tente outro termo ou limpe os filtros para ver todos os desapegos.';
    }
  }

  // eventos
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (!b) return;
    state.cat = b.getAttribute('data-cat');
    render();
  });
  sortSel.addEventListener('change', function () { state.sort = sortSel.value; render(); });
  document.addEventListener('brike:search', function (e) { state.q = e.detail || ''; render(); });
  document.addEventListener('brike:favchange', function () { if (state.cat === 'favoritos') render(); else renderChips(B.allAds()); });
  clearBtn.addEventListener('click', function () {
    state.cat = 'todos'; state.q = ''; state.sort = 'recentes';
    sortSel.value = 'recentes'; if (navInput) navInput.value = '';
    render();
  });

  // atalhos de categoria no hero / outros links (data-goto-cat)
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-goto-cat]');
    if (!g) return;
    state.cat = g.getAttribute('data-goto-cat');
    render();
  });

  // busca vinda de outra página (?busca=termo)
  var params = new URLSearchParams(window.location.search);
  var inicial = (params.get('busca') || '').trim();
  if (inicial) { state.q = inicial; if (navInput) navInput.value = inicial; }

  document.addEventListener('DOMContentLoaded', render);
})();

/* ==========================================================================
   Brike Place — núcleo compartilhado entre todas as páginas
   (dados de exemplo, armazenamento local, formatação, cards, modal, toast)
   Requer: Bootstrap 5 (bundle) e js/icons.js
   ========================================================================== */
(function () {
  'use strict';

  var B = (window.Brike = window.Brike || {});
  var DAY = 86400000;
  var KEY_ADS = 'brike_anuncios';   // mesma chave usada no projeto original
  var KEY_FAV = 'brike_favoritos';

  /* ------------------------------------------------------------------
     1. DADOS BASE
     ------------------------------------------------------------------ */
  B.CATEGORIAS = [
    { id: 'eletronicos', label: 'Eletrônicos e Celulares', curto: 'Eletrônicos' },
    { id: 'moveis',      label: 'Móveis e Decoração',      curto: 'Móveis' },
    { id: 'roupas',      label: 'Moda e Acessórios',       curto: 'Moda' },
    { id: 'esportes',    label: 'Esportes e Lazer',        curto: 'Esportes' },
    { id: 'veiculos',    label: 'Veículos e Peças',        curto: 'Veículos' },
    { id: 'outros',      label: 'Outros',                  curto: 'Outros' }
  ];

  B.CONDICOES = [
    { id: 'novo',          label: 'Novo',                              curto: 'Novo',              tone: 'green' },
    { id: 'seminovo',      label: 'Seminovo (pouquíssimo uso)',        curto: 'Seminovo',          tone: 'teal' },
    { id: 'usado-bom',     label: 'Usado — bom estado',                curto: 'Usado · bom estado', tone: 'navy' },
    { id: 'usado-marcas',  label: 'Usado — com marcas de uso',         curto: 'Usado · marcas de uso', tone: 'amber' },
    { id: 'defeito',       label: 'Com defeito / retirada de peças',   curto: 'Com defeito',       tone: 'red' }
  ];

  // Anúncios de demonstração (os mesmos produtos do projeto original)
  var SEEDS = [
    { id: 's1', titulo: 'Fone de Ouvido Bluetooth', preco: 150, categoria: 'eletronicos', condicao: 'seminovo',
      detalhe: '6 meses de uso', fotos: ['img/produtos/fone.jpg'], local: 'Asa Sul, Brasília - DF', dias: 1, meu: true,
      descricao: 'Fone bluetooth true wireless com estojo de carregamento. Bateria em ótimo estado e sem riscos aparentes. Acompanha o cabo de carga.' },
    { id: 's2', titulo: 'Tênis Esportivo Vermelho', preco: 180, categoria: 'roupas', condicao: 'usado-bom',
      detalhe: 'Ótimo estado', fotos: ['img/produtos/tenis.jpg'], local: 'Centro, Formosa - GO', dias: 2, meu: true,
      descricao: 'Tênis esportivo vermelho, ótimo para corrida e academia. Sola praticamente sem desgaste, limpo e higienizado.' },
    { id: 's3', titulo: 'Relógio Masculino Cronógrafo', preco: 125, categoria: 'roupas', condicao: 'usado-marcas',
      detalhe: 'Marcas de uso leves', fotos: ['img/produtos/relogio.jpg'], local: 'Taguatinga, Brasília - DF', dias: 3,
      descricao: 'Relógio analógico com pulseira de couro azul e mostrador cronógrafo. Funcionando perfeitamente, com pequenas marcas de uso na caixa.' },
    { id: 's4', titulo: 'Câmera Canon EOS + Lente 50mm', preco: 620, categoria: 'eletronicos', condicao: 'usado-bom',
      detalhe: 'Kit completo', fotos: ['img/produtos/camera-canon.jpg', 'img/produtos/camera-canon-flash.webp'],
      local: 'Plano Piloto, Brasília - DF', dias: 4,
      descricao: 'Câmera DSLR Canon EOS com lente 50mm. Na segunda foto, o kit com flash e rebatedor. Ideal para quem quer começar na fotografia.' },
    { id: 's5', titulo: 'PlayStation 5 + Controle', preco: 2150, categoria: 'eletronicos', condicao: 'usado-bom',
      detalhe: 'Ótimo estado', fotos: ['img/produtos/playstation.jpg'], local: 'Setor Leste, Formosa - GO', dias: 5, negociavel: true,
      descricao: 'Console em ótimo estado de conservação, acompanha controle DualSense e cabos originais. Aceito propostas.' },
    { id: 's6', titulo: 'Marruá Agrale', preco: 235000, categoria: 'veiculos', condicao: 'usado-bom',
      detalhe: 'Item de colecionador', fotos: ['img/produtos/marrua.png'], local: 'Formosa - GO', dias: 6, negociavel: true,
      descricao: 'Utilitário militar Agrale Marruá, peça para colecionadores e entusiastas de veículos off-road. Documentação e histórico sob consulta.' },
    { id: 's7', titulo: 'Patinete Elétrico', preco: 1230, categoria: 'esportes', condicao: 'seminovo',
      detalhe: '2 meses de uso', fotos: ['img/produtos/patinete.jpg'], local: 'Águas Claras, Brasília - DF', dias: 7,
      descricao: 'Patinete elétrico dobrável, usado por apenas dois meses. Bateria com ótima autonomia e freios revisados.' },
    { id: 's8', titulo: 'MacBook Apple', preco: 6580, categoria: 'eletronicos', condicao: 'novo',
      detalhe: 'Lacrado', fotos: ['img/produtos/macbook.jpg'], local: 'Asa Norte, Brasília - DF', dias: 8,
      descricao: 'MacBook novo, nunca usado, na caixa. Acompanha carregador e documentação.' }
  ];
  var NOW = Date.now();
  SEEDS.forEach(function (s) { s.exemplo = true; s.ts = NOW - s.dias * DAY; s.anunciante = 'Anúncio de exemplo'; });

  /* ------------------------------------------------------------------
     2. UTILITÁRIOS
     ------------------------------------------------------------------ */
  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  B.fmtPrice = function (n) { return brl.format(Number(n) || 0); };

  B.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  B.norm = function (s) {   // minúsculas e sem acentos, para a busca
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  };

  B.timeAgo = function (ts) {
    var diff = Date.now() - ts;
    var h = Math.floor(diff / 3600000);
    if (diff < 3600000) return 'agora há pouco';
    if (h < 24) return 'há ' + h + ' h';
    var d = Math.floor(diff / DAY);
    if (d <= 30) return 'há ' + d + (d === 1 ? ' dia' : ' dias');
    return new Date(ts).toLocaleDateString('pt-BR');
  };

  B.categoria = function (id) { return B.CATEGORIAS.filter(function (c) { return c.id === id; })[0] || B.CATEGORIAS[5]; };
  B.condicao = function (id) { return B.CONDICOES.filter(function (c) { return c.id === id; })[0] || B.CONDICOES[2]; };

  function safeParse(key, fallback) {
    try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
    catch (e) { return fallback; }
  }

  /* ------------------------------------------------------------------
     3. ANÚNCIOS DO USUÁRIO (localStorage)
     ------------------------------------------------------------------ */
  B.getUserAds = function () {
    var raw = safeParse(KEY_ADS, []);
    if (!Array.isArray(raw)) raw = [];
    return raw.map(function (a) {
      var an = a.anunciante || {};
      var ts = a.criadoEm ? Date.parse(a.criadoEm) : Number(a.id) || Date.now();
      return {
        id: String(a.id), titulo: a.titulo, preco: a.valor, categoria: a.categoria, condicao: a.conservacao,
        detalhe: '', descricao: a.descricao, fotos: a.fotos || [], negociavel: !!a.negociavel,
        local: [an.bairro, an.cidade].filter(Boolean).join(', '), anunciante: an.nome, telefone: an.telefone,
        ts: ts, usuario: true, meu: true
      };
    }).sort(function (a, b) { return b.ts - a.ts; });
  };

  B.saveUserAd = function (ad) {   // devolve true/false (false = sem espaço no navegador)
    var list = safeParse(KEY_ADS, []);
    if (!Array.isArray(list)) list = [];
    list.push(ad);
    try { localStorage.setItem(KEY_ADS, JSON.stringify(list)); return true; }
    catch (e) { return false; }
  };

  B.deleteUserAd = function (id) {
    var list = safeParse(KEY_ADS, []);
    list = list.filter(function (a) { return String(a.id) !== String(id); });
    try { localStorage.setItem(KEY_ADS, JSON.stringify(list)); } catch (e) { /* ignora */ }
  };

  B.allAds = function () { return B.getUserAds().concat(SEEDS); };
  B.findAd = function (id) { return B.allAds().filter(function (a) { return a.id === String(id); })[0]; };

  /* ------------------------------------------------------------------
     4. FAVORITOS
     ------------------------------------------------------------------ */
  B.favs = {
    list: function () { var l = safeParse(KEY_FAV, []); return Array.isArray(l) ? l : []; },
    has: function (id) { return B.favs.list().indexOf(String(id)) > -1; },
    toggle: function (id) {
      id = String(id);
      var l = B.favs.list(), i = l.indexOf(id);
      if (i > -1) l.splice(i, 1); else l.push(id);
      try { localStorage.setItem(KEY_FAV, JSON.stringify(l)); } catch (e) { /* ignora */ }
      return i === -1;
    }
  };

  function syncFavButtons(id) {
    var on = B.favs.has(id);
    document.querySelectorAll('[data-fav="' + id + '"]').forEach(function (btn) {
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  /* ------------------------------------------------------------------
     5. TOAST
     ------------------------------------------------------------------ */
  B.toast = function (msg, tone) {
    var box = document.getElementById('bpToasts');
    if (!box) {
      box = document.createElement('div');
      box.id = 'bpToasts';
      box.className = 'toast-container position-fixed bottom-0 end-0 p-3';
      box.style.zIndex = 1200;
      document.body.appendChild(box);
    }
    var el = document.createElement('div');
    el.className = 'toast bp-toast bp-toast--' + (tone || 'success');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = '<div class="d-flex align-items-center gap-2 p-3">' +
      B.icon(tone === 'error' ? 'info' : 'check', 'bp-icon--lg flex-shrink-0') +
      '<div class="flex-grow-1">' + B.esc(msg) + '</div>' +
      '<button type="button" class="btn-close btn-close-white ms-2" data-bs-dismiss="toast" aria-label="Fechar"></button></div>';
    box.appendChild(el);
    var t = new bootstrap.Toast(el, { delay: 3800 });
    el.addEventListener('hidden.bs.toast', function () { el.remove(); });
    t.show();
  };

  /* ------------------------------------------------------------------
     6. CARD DE PRODUTO
     ------------------------------------------------------------------ */
  B.badgeHTML = function (p) {
    var c = B.condicao(p.condicao);
    return '<span class="bp-badge bp-badge--' + c.tone + '">' + B.esc(c.curto) + '</span>';
  };

  // opts.owner = true → mostra ações de "meus anúncios"
  B.cardHTML = function (p, opts) {
    opts = opts || {};
    var fav = B.favs.has(p.id);
    var foto = p.fotos && p.fotos[0] ? p.fotos[0] : '';
    var extra = p.detalhe ? '<p class="bp-card__detail">' + B.esc(p.detalhe) + '</p>' : '';
    var footer = '';
    if (opts.owner) {
      footer = '<div class="bp-card__footer">' +
        (p.usuario
          ? '<button type="button" class="btn btn-sm btn-outline-danger" data-del="' + B.esc(p.id) + '">' + B.icon('trash') + ' Excluir</button>'
          : '<span class="bp-tag">Exemplo</span>') +
        '<button type="button" class="btn btn-sm btn-outline-brand ms-auto" data-open="' + B.esc(p.id) + '">' + B.icon('eye') + ' Ver anúncio</button></div>';
    }
    return '<article class="bp-card" data-card="' + B.esc(p.id) + '">' +
      '<div class="bp-card__media">' +
        (foto ? '<img src="' + B.esc(foto) + '" alt="' + B.esc(p.titulo) + '" loading="lazy">' : '<span class="bp-card__noimg">' + B.icon('image', 'bp-icon--xl') + '</span>') +
        B.badgeHTML(p) +
        (opts.preview ? '' : '<button type="button" class="bp-fav' + (fav ? ' is-active' : '') + '" data-fav="' + B.esc(p.id) + '" aria-pressed="' + fav + '" aria-label="Favoritar ' + B.esc(p.titulo) + '">' + B.icon('heart') + '</button>') +
      '</div>' +
      '<div class="bp-card__body">' +
        '<h3 class="bp-card__title">' + (opts.preview ? B.esc(p.titulo) : '<button type="button" class="stretched-link" data-open="' + B.esc(p.id) + '">' + B.esc(p.titulo) + '</button>') + '</h3>' +
        '<p class="bp-card__price">' + B.fmtPrice(p.preco) + (p.negociavel ? '<small>aceita propostas</small>' : '') + '</p>' +
        extra +
        '<p class="bp-card__meta">' + B.icon('pin') + '<span>' + B.esc(p.local || 'Local não informado') + '</span></p>' +
        '<p class="bp-card__meta">' + B.icon('clock') + '<span>' + B.timeAgo(p.ts) + '</span></p>' +
      '</div>' + footer +
    '</article>';
  };

  /* ------------------------------------------------------------------
     7. MODAL DE DETALHES
     ------------------------------------------------------------------ */
  function ensureModal() {
    var m = document.getElementById('bpProductModal');
    if (m) return m;
    m = document.createElement('div');
    m.className = 'modal fade bp-modal';
    m.id = 'bpProductModal';
    m.tabIndex = -1;
    m.setAttribute('aria-labelledby', 'bpProductTitle');
    m.setAttribute('aria-hidden', 'true');
    m.innerHTML = '<div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"><div class="modal-content"></div></div>';
    document.body.appendChild(m);
    return m;
  }

  function waLink(p) {
    var d = String(p.telefone || '').replace(/\D/g, '');
    if (d.length < 10) return null;
    var msg = 'Olá! Vi seu anúncio "' + p.titulo + '" no Brike Place e tenho interesse.';
    return 'https://wa.me/55' + d + '?text=' + encodeURIComponent(msg);
  }

  B.openProduct = function (id) {
    var p = B.findAd(id);
    if (!p) return;
    var modal = ensureModal();
    var fotos = p.fotos && p.fotos.length ? p.fotos : [];
    var gallery;
    if (!fotos.length) {
      gallery = '<div class="bp-gallery"><span class="bp-card__noimg">' + B.icon('image', 'bp-icon--xl') + '</span></div>';
    } else if (fotos.length === 1) {
      gallery = '<div class="bp-gallery"><img src="' + B.esc(fotos[0]) + '" alt="' + B.esc(p.titulo) + '"></div>';
    } else {
      gallery = '<div id="bpCarousel" class="carousel slide bp-gallery" data-bs-ride="false">' +
        '<div class="carousel-indicators">' + fotos.map(function (_, i) {
          return '<button type="button" data-bs-target="#bpCarousel" data-bs-slide-to="' + i + '"' + (i === 0 ? ' class="active" aria-current="true"' : '') + ' aria-label="Foto ' + (i + 1) + '"></button>';
        }).join('') + '</div>' +
        '<div class="carousel-inner h-100">' + fotos.map(function (f, i) {
          return '<div class="carousel-item h-100' + (i === 0 ? ' active' : '') + '"><img src="' + B.esc(f) + '" alt="' + B.esc(p.titulo) + ' — foto ' + (i + 1) + '"></div>';
        }).join('') + '</div>' +
        '<button class="carousel-control-prev" type="button" data-bs-target="#bpCarousel" data-bs-slide="prev" aria-label="Foto anterior"><span class="carousel-control-prev-icon"></span></button>' +
        '<button class="carousel-control-next" type="button" data-bs-target="#bpCarousel" data-bs-slide="next" aria-label="Próxima foto"><span class="carousel-control-next-icon"></span></button></div>';
    }

    var wa = waLink(p);
    var contact = wa
      ? '<a class="btn btn-brand btn-lg flex-grow-1" href="' + B.esc(wa) + '" target="_blank" rel="noopener">' + B.icon('chat') + ' Chamar no WhatsApp</a>'
      : '<span class="bp-nocontact">' + B.icon('info') + ' Anúncio de exemplo — sem contato</span>';
    var fav = B.favs.has(p.id);

    modal.querySelector('.modal-content').innerHTML =
      '<div class="modal-header border-0 pb-0"><span class="bp-eyebrow">' + B.esc(B.categoria(p.categoria).label) + '</span>' +
      '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button></div>' +
      '<div class="modal-body"><div class="row g-4">' +
        '<div class="col-md-6">' + gallery + '</div>' +
        '<div class="col-md-6 d-flex flex-column">' +
          '<h2 class="bp-modal__title" id="bpProductTitle">' + B.esc(p.titulo) + '</h2>' +
          '<div class="d-flex flex-wrap align-items-center gap-2 mb-3">' + B.badgeHTML(p) +
            (p.detalhe ? '<span class="bp-tag">' + B.esc(p.detalhe) + '</span>' : '') +
            (p.negociavel ? '<span class="bp-tag bp-tag--green">Aceita propostas</span>' : '') + '</div>' +
          '<p class="bp-modal__price">' + B.fmtPrice(p.preco) + '</p>' +
          '<p class="bp-modal__desc">' + B.esc(p.descricao) + '</p>' +
          '<ul class="bp-facts list-unstyled">' +
            '<li>' + B.icon('pin') + '<span>' + B.esc(p.local || 'Local não informado') + '</span></li>' +
            '<li>' + B.icon('clock') + '<span>Publicado ' + B.timeAgo(p.ts) + '</span></li>' +
            '<li>' + B.icon('user') + '<span>' + B.esc(p.anunciante || 'Anunciante') + '</span></li>' +
          '</ul>' +
          '<div class="bp-safe mt-auto">' + B.icon('shield') + '<span>Combine a entrega em local público e confira o produto antes de pagar.</span></div>' +
        '</div></div></div>' +
      '<div class="modal-footer border-0 pt-0"><div class="d-flex gap-2 w-100">' + contact +
        '<button type="button" class="btn btn-lg btn-outline-brand bp-fav-lg' + (fav ? ' is-active' : '') + '" data-fav="' + B.esc(p.id) + '" aria-pressed="' + fav + '" aria-label="Favoritar">' + B.icon('heart') + '</button>' +
      '</div></div>';

    bootstrap.Modal.getOrCreateInstance(modal).show();
  };

  /* ------------------------------------------------------------------
     8. INICIALIZAÇÃO COMUM (todas as páginas)
     ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    B.hydrateIcons();

    // ano do rodapé
    document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

    // sombra no cabeçalho ao rolar
    var header = document.querySelector('.bp-header');
    if (header) {
      var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    // busca do cabeçalho: na home filtra na hora; nas demais, redireciona para a home
    var form = document.getElementById('navSearch');
    if (form) {
      var input = form.querySelector('input');
      var isHome = document.body.dataset.page === 'home';
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = input.value.trim();
        if (isHome) {
          document.dispatchEvent(new CustomEvent('brike:search', { detail: q }));
          var feed = document.getElementById('desapegos');
          if (feed) feed.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = 'index.html' + (q ? '?busca=' + encodeURIComponent(q) : '') + '#desapegos';
        }
      });
      if (isHome) {
        input.addEventListener('input', function () {
          document.dispatchEvent(new CustomEvent('brike:search', { detail: input.value.trim() }));
        });
      }
    }

    // cliques globais: abrir produto e favoritar
    document.addEventListener('click', function (e) {
      var open = e.target.closest('[data-open]');
      if (open) { B.openProduct(open.getAttribute('data-open')); return; }
      var fav = e.target.closest('[data-fav]');
      if (fav) {
        e.preventDefault();
        var id = fav.getAttribute('data-fav');
        var on = B.favs.toggle(id);
        syncFavButtons(id);
        document.dispatchEvent(new CustomEvent('brike:favchange', { detail: { id: id, on: on } }));
        B.toast(on ? 'Adicionado aos favoritos' : 'Removido dos favoritos');
      }
    });
  });
})();

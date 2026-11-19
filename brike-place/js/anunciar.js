/* ==========================================================================
   Brike Place — Anunciar desapego
   Validação (Bootstrap), máscara de telefone, prévia de fotos (comprimidas)
   e pré-visualização do cartão em tempo real.
   ========================================================================== */
(function () {
  'use strict';
  var B = window.Brike;
  var MAX_FOTOS = 5;

  var form = document.getElementById('adForm');
  var fotos = [];                                   // data URLs já comprimidas
  var drop = document.getElementById('dropzone');
  var fileInput = document.getElementById('item-fotos');
  var thumbs = document.getElementById('thumbs');
  var fotosError = document.getElementById('fotosError');
  var phone = document.getElementById('anunciante-telefone');
  var desc = document.getElementById('item-descricao');
  var descCount = document.getElementById('descCount');
  var preview = document.getElementById('previewCard');
  var submitBtn = document.getElementById('submitBtn');

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- selects (categoria / estado) a partir dos dados base ---------- */
  $('item-categoria').insertAdjacentHTML('beforeend', B.CATEGORIAS.map(function (c) {
    return '<option value="' + c.id + '">' + B.esc(c.label) + '</option>';
  }).join(''));
  $('item-conservacao').insertAdjacentHTML('beforeend', B.CONDICOES.map(function (c) {
    return '<option value="' + c.id + '">' + B.esc(c.label) + '</option>';
  }).join(''));

  /* ---------- máscara de telefone: (61) 91234-5678 ---------- */
  function maskPhone(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  phone.addEventListener('input', function () { phone.value = maskPhone(phone.value); });

  /* ---------- contador da descrição ---------- */
  function updateCount() { descCount.textContent = desc.value.length + '/' + desc.maxLength; }
  desc.addEventListener('input', updateCount);
  updateCount();

  /* ---------- fotos ---------- */
  function compress(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function () {
        var img = new Image();
        img.onerror = reject;
        img.onload = function () {
          var scale = Math.min(1, 900 / Math.max(img.width, img.height));
          var c = document.createElement('canvas');
          c.width = Math.round(img.width * scale);
          c.height = Math.round(img.height * scale);
          var ctx = c.getContext('2d');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL('image/jpeg', 0.78));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function renderThumbs() {
    thumbs.innerHTML = fotos.map(function (src, i) {
      return '<div class="bp-thumb">' +
        '<img src="' + src + '" alt="Foto ' + (i + 1) + ' do produto">' +
        (i === 0 ? '<span class="bp-thumb__main">Capa</span>' : '') +
        '<button type="button" class="bp-thumb__remove" data-remove="' + i + '" aria-label="Remover foto ' + (i + 1) + '">' + B.icon('x') + '</button></div>';
    }).join('');
    drop.classList.toggle('d-none', fotos.length >= MAX_FOTOS);
    $('fotosHint').textContent = fotos.length + ' de ' + MAX_FOTOS + ' fotos';
    if (fotos.length) { fotosError.classList.add('d-none'); drop.classList.remove('is-invalid'); }
    updatePreview();
  }

  function addFiles(fileList) {
    var files = Array.prototype.slice.call(fileList).filter(function (f) { return /^image\//.test(f.type); });
    var room = MAX_FOTOS - fotos.length;
    if (files.length > room) B.toast('Você pode enviar no máximo ' + MAX_FOTOS + ' fotos por desapego.', 'error');
    return Promise.all(files.slice(0, room).map(function (f) { return compress(f).catch(function () { return null; }); }))
      .then(function (res) {
        res.forEach(function (r) { if (r) fotos.push(r); });
        renderThumbs();
      });
  }

  fileInput.addEventListener('change', function () { addFiles(fileInput.files).then(function () { fileInput.value = ''; }); });
  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-drag'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-drag'); });
  });
  drop.addEventListener('drop', function (e) { addFiles(e.dataTransfer.files); });
  thumbs.addEventListener('click', function (e) {
    var b = e.target.closest('[data-remove]');
    if (!b) return;
    fotos.splice(Number(b.getAttribute('data-remove')), 1);
    renderThumbs();
  });

  /* ---------- pré-visualização do cartão ---------- */
  function updatePreview() {
    var bairro = $('item-bairro').value.trim(), cidade = $('item-cidade').value.trim();
    var p = {
      id: 'preview', titulo: $('item-titulo').value.trim() || 'Título do seu anúncio',
      preco: parseFloat($('item-valor').value) || 0, categoria: $('item-categoria').value || 'outros',
      condicao: $('item-conservacao').value || 'usado-bom', negociavel: $('item-negociavel').checked,
      fotos: fotos.slice(0, 1), local: [bairro, cidade].filter(Boolean).join(', '), ts: Date.now(), detalhe: ''
    };
    preview.innerHTML = B.cardHTML(p, { preview: true });
  }
  form.addEventListener('input', updatePreview);
  form.addEventListener('change', updatePreview);

  /* ---------- envio ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    e.stopPropagation();

    var okFotos = fotos.length > 0;
    fotosError.classList.toggle('d-none', okFotos);
    drop.classList.toggle('is-invalid', !okFotos);

    form.classList.add('was-validated');
    if (!form.checkValidity() || !okFotos) {
      var firstBad = form.querySelector(':invalid');
      (firstBad || drop).scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (firstBad) firstBad.focus({ preventScroll: true });
      return;
    }

    var now = new Date();
    var anuncio = {
      id: Date.now(),
      titulo: $('item-titulo').value.trim(),
      categoria: $('item-categoria').value,
      conservacao: $('item-conservacao').value,
      valor: parseFloat($('item-valor').value),
      negociavel: $('item-negociavel').checked,
      descricao: desc.value.trim(),
      fotos: fotos.slice(),
      anunciante: {
        nome: $('anunciante-nome').value.trim(),
        telefone: phone.value,
        cidade: $('item-cidade').value.trim(),
        bairro: $('item-bairro').value.trim()
      },
      dataCriacao: now.toLocaleDateString('pt-BR'),
      criadoEm: now.toISOString()
    };

    submitBtn.disabled = true;
    if (B.saveUserAd(anuncio)) {
      window.location.href = 'meus-anuncios.html?novo=1';
    } else {
      submitBtn.disabled = false;
      B.toast('Não foi possível salvar: o armazenamento do navegador está cheio. Remova fotos ou exclua anúncios antigos.', 'error');
    }
  });

  document.addEventListener('DOMContentLoaded', updatePreview);
})();

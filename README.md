# Brike Place — front-end

Projeto estático: **HTML + CSS + JavaScript + Bootstrap 5** (via CDN). Sem build, sem framework.

## Como abrir
Dê dois cliques em `index.html` (precisa de internet para carregar Bootstrap e as fontes do Google).
Opcional, com servidor local: `python -m http.server 8080` e acesse http://localhost:8080

## Estrutura
- `index.html` — home: hero, vitrine com busca/categorias/ordenação/favoritos, resumo "como funciona"
- `como-funciona.html` — passo a passo e dicas de negociação
- `meus-anuncios.html` — anúncios publicados (com exclusão)
- `anunciar.html` — formulário com validação, prévia de fotos e do cartão
- `css/style.css` — paleta (variáveis `--bp-*` no topo) e componentes
- `js/icons.js` ícones SVG · `js/app.js` dados/helpers/modal · `js/home.js`, `meus-anuncios.js`, `anunciar.js`
- `img/` — logo e fotos dos produtos

## Dados
Os anúncios publicados ficam no `localStorage` do navegador (chave `brike_anuncios`).
Os 8 produtos de exemplo estão em `js/app.js` (array `SEEDS`).

## Trocar cores
Edite as variáveis no início de `css/style.css` (`--bp-navy`, `--bp-teal`, `--bp-green`, `--bp-amber`...).

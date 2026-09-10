# Mentoria Thales Ramos — Landing Page

Página de vendas da mentoria ao vivo de Forex do
[@thalesramostrader](https://www.instagram.com/thalesramostrader/).

Site estático (HTML + CSS + JS puro, sem build e sem dependências).

---

## Estrutura

```
index.html          Página inteira (todas as seções)
css/style.css       Estilos (tokens de cor no topo, em :root)
js/script.js        Link de checkout, FAQ, animações de scroll
assets/img/         Imagens usadas pelo site
assets/video/       Vídeo de fundo do hero (hoje inativo — ver abaixo)
```

## Rodar localmente

O projeto vive em `xampp/htdocs`. Com o Apache do XAMPP ligado:

```
http://localhost/thales_trader/
```

> Um servidor estático simples (ex.: `python -m http.server`) serve o site,
> mas **não** reproduz o vídeo de fundo corretamente, porque não suporta
> HTTP Range request. Use o Apache para testar o vídeo.

---

## Pendências de conteúdo

Tudo que ainda precisa de informação real está marcado no HTML com
`[EXEMPLO]` ou `[EDITAR]`:

- [ ] **Link de pagamento** — trocar `CHECKOUT_URL` no topo de `js/script.js`.
      Uma linha só: todos os botões de compra (`.btn-checkout`) apontam
      para essa constante.
- [ ] **Preço da mentoria** — `[EDITAR VALOR]` na seção de oferta
- [ ] **Formato da turma** — os 4 cards de "Como funciona"
- [ ] **Depoimentos reais** — 3 cards de exemplo na prova social
- [ ] **FAQ** — respostas sobre pagamento e garantia
- [ ] **Data de início da turma** — ainda não existe na página

## Trocar o fundo do hero (foto ↔ vídeo)

Hoje o hero usa a **foto**. Em `index.html`, dentro de `.hero__bg`:

```html
<!-- foto (atual) -->
<img class="hero__bg-media" src="assets/img/hero-bg.jpg" alt="">

<!-- vídeo -->
<video class="hero__bg-media" autoplay muted loop playsinline
       poster="assets/img/hero-bg.jpg">
  <source src="assets/video/hero-bg.mp4" type="video/mp4">
  <source src="assets/video/hero-bg.webm" type="video/webm">
</video>
```

O vídeo já está cortado a partir dos 3s do original e montado em loop
"boomerang" (ida e volta), então repete sem corte visível. O `.mp4` é
H.264 e o `.webm` é VP9 — os dois formatos existem para cobrir todos os
navegadores.

## Assets originais

Os arquivos brutos (`wallpaper video forex.mp4`, `wallpaper forex.png`,
`foto perfil thales.jpg`) **não estão no repositório** — veja o
`.gitignore`. Guarde uma cópia deles fora daqui.

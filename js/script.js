// ---------------------------------------------------------------
// Funil de conversão: só existe UM link externo de verdade na página
// — o botão de WhatsApp no final (id="whatsapp-final"). Todos os
// outros CTAs ("btn-checkout") são âncoras que rolam até ele.
//
// Quando o link de pagamento existir, é só trocar o destino aqui
// embaixo (WHATSAPP_URL, ou apontar direto pro checkout) e todos os
// botões da página seguem o novo destino de uma vez.
// ---------------------------------------------------------------
const WHATSAPP_NUMBER = '5554991395159';
const WHATSAPP_MESSAGE = 'Olá! Quero saber mais sobre a mentoria ao vivo com o Thales.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const whatsappBtn = document.getElementById('whatsapp-final');
if (whatsappBtn) {
  whatsappBtn.setAttribute('href', WHATSAPP_URL);
}

document.querySelectorAll('.btn-checkout').forEach(btn => {
  btn.setAttribute('href', '#whatsapp-final');
});

// Ao clicar em qualquer CTA secundário, a página rola até o botão de
// WhatsApp — esse destaque breve deixa claro que é ali que a ação
// acontece, já que o clique não abre nada na hora.
if (whatsappBtn) {
  document.querySelectorAll('.btn-checkout').forEach(btn => {
    btn.addEventListener('click', () => {
      whatsappBtn.classList.remove('is-highlighted');
      void whatsappBtn.offsetWidth; // reinicia a animação se clicar de novo
      whatsappBtn.classList.add('is-highlighted');
      setTimeout(() => whatsappBtn.classList.remove('is-highlighted'), 1600);
    });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal-on-scroll for sections/cards
const revealTargets = document.querySelectorAll(
  '.card, .section__head, .split__media, .split__copy, .cta__box, ' +
  '.pain, .step, .offer, .faq__item, .promises__col, .founder-note, ' +
  '.proof-carousel-wrap, .statement__text'
);
revealTargets.forEach(el => el.setAttribute('data-reveal', ''));

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealTargets.forEach(el => io.observe(el));

// Carrossel de prova social — rola sozinho para o lado, em loop
// contínuo. Pausa quando o visitante passa o mouse, toca ou arrasta,
// e volta a rolar sozinho pouco depois de soltar.
const proofCarousel = document.getElementById('proofCarousel');
if (proofCarousel) {
  const prevBtn = document.querySelector('.proof-nav--prev');
  const nextBtn = document.querySelector('.proof-nav--next');
  const originalCards = [...proofCarousel.children];

  // duplica o conjunto de cards uma vez: ao "fechar a volta" no fim da
  // cópia original, o que vem a seguir é visualmente idêntico ao início
  // — dá pra saltar de volta sem ninguém perceber o corte.
  originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('img').forEach(img => img.removeAttribute('loading'));
    proofCarousel.appendChild(clone);
  });

  const scrollByCard = (direction) => {
    const card = proofCarousel.querySelector('.proof-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(proofCarousel).columnGap) || 0;
    proofCarousel.scrollBy({ left: (card.offsetWidth + gap) * direction, behavior: 'smooth' });
  };
  if (prevBtn) prevBtn.addEventListener('click', () => scrollByCard(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollByCard(1));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    let setWidth = 0;
    const measure = () => { setWidth = proofCarousel.children[originalCards.length].offsetLeft; };
    measure();
    window.addEventListener('load', measure);
    window.addEventListener('resize', measure);

    // scrollLeft é sempre lido como inteiro arredondado pelo navegador —
    // somar uma fração (menos de 1px) direto nele nunca acumula, porque
    // cada leitura de volta já veio arredondada pra baixo. Por isso a
    // posição "de verdade" mora em virtualLeft (um número normal em JS,
    // com toda a precisão) e só escrevemos no DOM a partir dele.
    let virtualLeft = proofCarousel.scrollLeft;

    // corrige o loop também quando o próprio visitante arrasta além do fim
    proofCarousel.addEventListener('scroll', () => {
      if (setWidth > 0 && proofCarousel.scrollLeft >= setWidth) {
        proofCarousel.scrollLeft -= setWidth;
      }
      if (paused) virtualLeft = proofCarousel.scrollLeft;
    });

    let paused = false;
    let resumeTimer = null;
    const pause = () => { paused = true; };
    const scheduleResume = (delay = 1400) => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        virtualLeft = proofCarousel.scrollLeft; // retoma de onde o visitante deixou
        paused = false;
      }, delay);
    };
    ['mouseenter', 'touchstart', 'pointerdown'].forEach(evt =>
      proofCarousel.addEventListener(evt, pause, { passive: true }));
    ['mouseleave', 'touchend', 'pointerup'].forEach(evt =>
      proofCarousel.addEventListener(evt, () => scheduleResume(), { passive: true }));

    // só roda enquanto a seção está visível na tela — sem gastar ciclo à toa
    let inView = false;
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
    }, { threshold: 0.01 }).observe(proofCarousel);

    const SPEED = 32; // px por segundo
    let lastTs = null;
    function tick(ts) {
      if (lastTs == null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      if (!paused && inView && setWidth > 0) {
        virtualLeft += (SPEED * dt) / 1000;
        if (virtualLeft >= setWidth) virtualLeft -= setWidth;
        proofCarousel.scrollLeft = virtualLeft;
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
}

// FAQ accordion
document.querySelectorAll('.faq__item').forEach(item => {
  const question = item.querySelector('.faq__question');
  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq__item.is-open').forEach(open => {
      open.classList.remove('is-open');
      open.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('is-open');
      question.setAttribute('aria-expanded', 'true');
    }
  });
});

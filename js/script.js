// ---------------------------------------------------------------
// CTAs: todo botão de ação abre a MESMA conversa no WhatsApp.
// Mude o número ou a mensagem aqui, num lugar só.
// ---------------------------------------------------------------
const WHATSAPP_NUMBER = '5554991395159';
const WHATSAPP_MESSAGE = 'Oi, Thales! Vi a página da mentoria e quero saber mais sobre a próxima turma.';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

const WHATSAPP_ICON =
  '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">' +
  '<path fill="currentColor" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.83L2 22l5.36-1.35c1.38.75 2.96 1.18 4.68 1.18h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.05 2h-.01zm5.8 14.02c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.61-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.83 2 .9 2.15.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.76 1.26 1.64 2.04 1.13 1 2.08 1.32 2.37 1.47.29.15.46.13.63-.08.17-.21.72-.84.91-1.13.19-.29.38-.24.64-.14.26.1 1.65.78 1.94.92.29.14.48.22.55.34.07.12.07.69-.17 1.37z"/></svg>';

document.querySelectorAll('.btn-checkout, .btn-whatsapp').forEach(btn => {
  btn.setAttribute('href', WHATSAPP_URL);
  btn.setAttribute('target', '_blank');
  btn.setAttribute('rel', 'noopener');
  if (!btn.querySelector('svg')) btn.insertAdjacentHTML('afterbegin', WHATSAPP_ICON);
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal-on-scroll for sections/cards
const revealTargets = document.querySelectorAll(
  '.card, .section__head, .split__media, .split__copy, .cta__box, ' +
  '.pain, .turma-facts, .offer, .faq__item, .promises__col, .founder-note, ' +
  '.proof-carousel-wrap, .statement__text, .section__cta'
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

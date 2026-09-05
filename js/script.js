// ---------------------------------------------------------------
// CHECKOUT_URL: troque aqui pelo link real do gateway de pagamento
// (Hotmart, Kiwify, etc.) assim que estiver definido. Todos os
// botões com a classe "btn-checkout" apontam para este valor.
// ---------------------------------------------------------------
const CHECKOUT_URL = '#';

document.querySelectorAll('.btn-checkout').forEach(btn => {
  btn.setAttribute('href', CHECKOUT_URL);
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal-on-scroll for sections/cards
const revealTargets = document.querySelectorAll(
  '.card, .section__head, .split__media, .split__copy, .cta__box, ' +
  '.pain, .step, .testimonial, .offer, .faq__item'
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

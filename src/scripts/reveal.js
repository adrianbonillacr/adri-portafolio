/**
 * Aparición suave de secciones al hacer scroll.
 * Los elementos marcados con [data-reveal] entran con un desplazamiento
 * y fundido sutiles. Con `prefers-reduced-motion` todo es visible de
 * inmediato (el CSS ya lo garantiza; aquí evitamos trabajo innecesario).
 */

const items = document.querySelectorAll('[data-reveal]');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduced || !('IntersectionObserver' in window)) {
  items.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    // se mide contra la pantalla: el recorte del contenedor de scroll ya
    // entra en el cálculo, así no dependemos de encontrarlo
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  items.forEach((el) => observer.observe(el));
}

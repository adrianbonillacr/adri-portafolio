/**
 * Cursor personalizado con estela.
 * Solo se activa con puntero fino (mouse) y sin `prefers-reduced-motion`,
 * de modo que dispositivos táctiles y usuarios con movilidad reducida
 * conservan el cursor y el comportamiento nativos.
 *
 * La estela nace del punto suavizado (no del mouse crudo) y se dibuja
 * como una curva continua con desvanecimiento y afinado progresivos.
 * Sus parámetros viven como tokens en `tokens.css` (--cursor-*).
 */

const rootStyles = getComputedStyle(document.documentElement);

function token(name, fallback) {
  const value = parseFloat(rootStyles.getPropertyValue(name));
  return Number.isFinite(value) ? value : fallback;
}

const DOT_EASE = token('--cursor-ease', 0.1); // suavizado del punto (0–1): menor = más suave
const TRAIL_LIFE = token('--cursor-trail-life', 900); // vida de cada punto de la estela, en ms
const TRAIL_ALPHA = token('--cursor-trail-alpha', 0.22); // opacidad máxima del trazo
const TRAIL_WIDTH = token('--cursor-trail-width', 2.4); // grosor máximo del trazo, en px

const finePointer = window.matchMedia('(pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (finePointer.matches && !reducedMotion.matches) {
  initCursor();
}

function initCursor() {
  document.documentElement.classList.add('has-custom-cursor');

  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-canvas';
  canvas.setAttribute('aria-hidden', 'true');

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');

  document.body.append(canvas, dot);

  const ctx = canvas.getContext('2d');
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  /** @type {{x: number, y: number, t: number}[]} */
  let points = [];
  let mouseX = -100;
  let mouseY = -100;
  let dotX = -100;
  let dotY = -100;
  let dotSeen = false;
  let rafId = null;

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!dotSeen) {
      // primer movimiento: colocar el punto sin arrastre desde fuera
      dotX = mouseX;
      dotY = mouseY;
      dotSeen = true;
      dot.classList.add('is-visible');
    }

    wake();
  });

  document.addEventListener('mouseleave', () => {
    dot.classList.remove('is-visible');
    dotSeen = false;
  });

  // el punto crece sobre elementos interactivos
  const INTERACTIVE = 'a, button, [data-cursor-hover]';
  document.addEventListener('mouseover', (e) => {
    if (e.target instanceof Element && e.target.closest(INTERACTIVE)) {
      dot.classList.add('is-active');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target instanceof Element && e.target.closest(INTERACTIVE)) {
      dot.classList.remove('is-active');
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      points = [];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
      wake();
    }
  });

  function wake() {
    if (rafId === null) rafId = requestAnimationFrame(frame);
  }

  function frame(now) {
    rafId = null;

    // — punto principal con arrastre suave —
    dotX += (mouseX - dotX) * DOT_EASE;
    dotY += (mouseY - dotY) * DOT_EASE;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

    // — la estela sigue al punto suavizado: trazo fluido, sin quiebres —
    if (dotSeen) {
      const last = points[points.length - 1];
      if (!last || Math.hypot(dotX - last.x, dotY - last.y) > 1.5) {
        points.push({ x: dotX, y: dotY, t: now });
      }
    }

    points = points.filter((p) => now - p.t < TRAIL_LIFE);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (points.length > 2) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // curva por puntos medios: cada tramo pasa suavemente por el punto
      for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];
        const age = (now - curr.t) / TRAIL_LIFE; // 0 = reciente, 1 = por desvanecerse
        const strength = (1 - age) ** 1.4; // desvanecimiento con caída suave

        ctx.strokeStyle = `rgba(244, 243, 240, ${(strength * TRAIL_ALPHA).toFixed(3)})`;
        ctx.lineWidth = Math.max(0.3, strength * TRAIL_WIDTH) * dpr;
        ctx.beginPath();
        ctx.moveTo(((prev.x + curr.x) / 2) * dpr, ((prev.y + curr.y) / 2) * dpr);
        ctx.quadraticCurveTo(
          curr.x * dpr,
          curr.y * dpr,
          ((curr.x + next.x) / 2) * dpr,
          ((curr.y + next.y) / 2) * dpr
        );
        ctx.stroke();
      }
    }

    const dotResting = Math.hypot(mouseX - dotX, mouseY - dotY) < 0.3;
    if (points.length > 0 || !dotResting) {
      rafId = requestAnimationFrame(frame);
    }
  }
}

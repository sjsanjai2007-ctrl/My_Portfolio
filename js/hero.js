/* ================================================================
   HERO.JS — Canvas mesh background + mouse spotlight
   GPU-accelerated interactive background for Cluster 1.
   ================================================================ */

export function initHero() {
  initMeshBackground();
  initMouseSpotlight();
}

/* ── Canvas Mesh Background ──
   Subtle dot grid that deforms gently on mouse move.
   ──────────────────────────────────────────────── */
function initMeshBackground() {
  const canvas = document.querySelector('.hero-mesh');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let mouseX = -1000, mouseY = -1000;
  let animationId;
  const dots = [];
  const DOT_SPACING = 40;
  const DOT_RADIUS = 1;
  const INFLUENCE_RADIUS = 150;
  const MAX_DISPLACEMENT = 8;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
    generateDots();
  }

  function generateDots() {
    dots.length = 0;
    const cols = Math.ceil(width / DOT_SPACING) + 1;
    const rows = Math.ceil(height / DOT_SPACING) + 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        dots.push({
          baseX: col * DOT_SPACING,
          baseY: row * DOT_SPACING,
          x: col * DOT_SPACING,
          y: row * DOT_SPACING,
        });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const accentRGB = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-accent-rgb').trim() || '0, 217, 255';

    for (const dot of dots) {
      // Calculate displacement based on mouse distance
      const dx = mouseX - dot.baseX;
      const dy = mouseY - dot.baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < INFLUENCE_RADIUS && !prefersReducedMotion) {
        const force = (1 - dist / INFLUENCE_RADIUS) * MAX_DISPLACEMENT;
        const angle = Math.atan2(dy, dx);
        // Push dots away from mouse
        dot.x += (dot.baseX - Math.cos(angle) * force - dot.x) * 0.15;
        dot.y += (dot.baseY - Math.sin(angle) * force - dot.y) * 0.15;
      } else {
        // Spring back
        dot.x += (dot.baseX - dot.x) * 0.1;
        dot.y += (dot.baseY - dot.y) * 0.1;
      }

      // Opacity based on distance from mouse
      const opacity = dist < INFLUENCE_RADIUS
        ? 0.08 + (1 - dist / INFLUENCE_RADIUS) * 0.2
        : 0.06;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentRGB}, ${opacity})`;
      ctx.fill();
    }

    animationId = requestAnimationFrame(draw);
  }

  // Throttled mouse tracking
  let lastMouseUpdate = 0;
  function handleMouseMove(e) {
    const now = performance.now();
    if (now - lastMouseUpdate < 16) return; // ~60fps cap
    lastMouseUpdate = now;

    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function handleMouseLeave() {
    mouseX = -1000;
    mouseY = -1000;
  }

  // Initialize
  resize();
  draw();

  window.addEventListener('resize', resize, { passive: true });
  canvas.parentElement.addEventListener('mousemove', handleMouseMove, { passive: true });
  canvas.parentElement.addEventListener('mouseleave', handleMouseLeave, { passive: true });

  // Cleanup on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      draw();
    }
  });
}

/* ── Mouse Spotlight ──
   CSS custom property-based radial gradient following cursor.
   ──────────────────────────────────────────────── */
function initMouseSpotlight() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  hero.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      hero.style.setProperty('--mouse-x', x + '%');
      hero.style.setProperty('--mouse-y', y + '%');
      ticking = false;
    });
  }, { passive: true });
}

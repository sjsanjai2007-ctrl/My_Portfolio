/* ================================================================
   MAGNETIC.JS — Magnetic button hover effect
   Buttons subtly pull toward the cursor on hover.
   ================================================================ */

export function initMagnetic() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const buttons = document.querySelectorAll('.btn-magnetic');
  const MAX_DISPLACEMENT = 8; // px

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) / (rect.width / 2) * MAX_DISPLACEMENT;
      const deltaY = (e.clientY - centerY) / (rect.height / 2) * MAX_DISPLACEMENT;

      btn.style.setProperty('--magnetic-x', deltaX.toFixed(1));
      btn.style.setProperty('--magnetic-y', deltaY.toFixed(1));
    }, { passive: true });

    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--magnetic-x', '0');
      btn.style.setProperty('--magnetic-y', '0');
    }, { passive: true });
  });
}

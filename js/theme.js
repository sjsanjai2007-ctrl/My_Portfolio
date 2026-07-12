/* ================================================================
   THEME.JS — Dark/light mode toggle with persistence
   ================================================================ */

export function initTheme() {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;

  const body = document.body;

  // Restore saved preference (default: dark)
  const saved = localStorage.getItem('sj-theme') || 'dark-mode';
  body.classList.remove('dark-mode', 'light-mode');
  body.classList.add(saved);
  updateIcon();

  toggle.addEventListener('click', () => {
    const isLight = body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode', !isLight);
    localStorage.setItem('sj-theme', isLight ? 'light-mode' : 'dark-mode');
    updateIcon();
  });

  function updateIcon() {
    const isLight = body.classList.contains('light-mode');
    const icon = toggle.querySelector('.slider-knob i');
    if (icon) {
      icon.className = isLight ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    toggle.setAttribute('aria-checked', String(isLight));
  }
}

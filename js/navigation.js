/* ================================================================
   NAVIGATION.JS — Scroll spy, mobile menu, scroll progress,
   back-to-top, header background on scroll.
   All using IntersectionObserver (no scroll listeners where possible).
   ================================================================ */

export function initNavigation() {
  initScrollSpy();
  initMobileMenu();
  initScrollProgress();
  initBackToTop();
  initHeaderScroll();
}

/* ── Scroll Spy — IntersectionObserver based ── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const target = document.querySelector(`.nav a[href="#${entry.target.id}"]`);
        if (target) target.classList.add('active');
      }
    });
  }, {
    rootMargin: '-35% 0px -55% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('.nav');
  const backdrop = document.querySelector('.nav-backdrop');
  if (!toggle || !nav) return;

  function openMenu() {
    nav.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('scroll-locked');
    if (backdrop) backdrop.classList.add('active');

    // Change icon to X
    const icon = toggle.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-xmark';
  }

  function closeMenu() {
    nav.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('scroll-locked');
    if (backdrop) backdrop.classList.remove('active');

    // Change icon back to bars
    const icon = toggle.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-bars';
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('active');
    isOpen ? closeMenu() : openMenu();
  });

  // Close on nav link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on backdrop click
  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ── Scroll Progress Bar ── */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = progress.toFixed(1) + '%';
      ticking = false;
    });
  }, { passive: true });
}

/* ── Back to Top ── */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  const hero = document.getElementById('hero');
  if (!btn || !hero) return;

  const observer = new IntersectionObserver(([entry]) => {
    btn.classList.toggle('visible', !entry.isIntersecting);
  }, { threshold: 0 });

  observer.observe(hero);

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Header Background on Scroll ── */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  // Use IntersectionObserver on a sentinel element
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:1px;pointer-events:none;';
  document.body.prepend(sentinel);

  const observer = new IntersectionObserver(([entry]) => {
    header.classList.toggle('scrolled', !entry.isIntersecting);
  }, { threshold: 0 });

  observer.observe(sentinel);
}

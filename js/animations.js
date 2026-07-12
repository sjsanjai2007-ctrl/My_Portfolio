/* ================================================================
   ANIMATIONS.JS — Scroll reveal system + counter animation
   Custom IntersectionObserver-based, replaces AOS library.
   ================================================================ */

export function initAnimations() {
  initScrollReveal();
  initCounters();
  initTimelineProgress();
  initSkillsFilter();
}

/* ── Scroll Reveal ──
   Elements with .reveal class animate in when visible.
   ──────────────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show everything immediately
    reveals.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ── Animated Counters ──
   Numbers count up when they enter viewport.
   ──────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      const duration = 1500; // ms
      const startTime = performance.now();

      function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        el.textContent = current + '+';

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
      observer.unobserve(el); // Only animate once
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ── Timeline Progress ──
   Fills the timeline line as user scrolls through it.
   ──────────────────────────────────────────────── */
function initTimelineProgress() {
  const timeline = document.querySelector('.timeline');
  const timelineLine = document.querySelector('.timeline-line');
  if (!timeline || !timelineLine) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    timelineLine.style.setProperty('--timeline-progress', '100%');
    return;
  }

  let ticking = false;

  function updateProgress() {
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate how far through the timeline the viewport center is
    const timelineTop = rect.top;
    const timelineHeight = rect.height;
    const viewportCenter = windowHeight * 0.6;

    const progress = Math.max(0, Math.min(1,
      (viewportCenter - timelineTop) / timelineHeight
    ));

    timelineLine.style.setProperty('--timeline-progress', (progress * 100).toFixed(1) + '%');
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      ticking = false;
    });
  }, { passive: true });

  updateProgress(); // Initial call
}

/* ── Skills Tab Filter ──
   Filters skill items by category.
   ──────────────────────────────────────────────── */
function initSkillsFilter() {
  const tabs = document.querySelectorAll('.skills-tab');
  const items = document.querySelectorAll('.skill-item');
  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter items
      items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          item.offsetHeight; // Trigger reflow
          item.style.animation = '';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

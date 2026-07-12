/* ================================================================
   TYPING.JS — Cinematic role typing animation
   Cycles through roles with type/delete effect.
   ================================================================ */

export function initTyping() {
  const el = document.querySelector('.typing-text');
  if (!el) return;

  const roles = [
    'Creative Developer',
    'Frontend Developer',
    'UI/UX Designer',
    'Video Editor'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeoutId = null;

  const TYPE_SPEED = 90;
  const DELETE_SPEED = 45;
  const PAUSE_AFTER_TYPE = 2000;
  const PAUSE_AFTER_DELETE = 400;

  function tick() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
      // Typing
      charIndex++;
      el.textContent = currentRole.slice(0, charIndex);

      if (charIndex === currentRole.length) {
        // Finished typing — update aria-label for screen readers
        el.setAttribute('aria-label', currentRole);
        isDeleting = true;
        timeoutId = setTimeout(tick, PAUSE_AFTER_TYPE);
        return;
      }

      timeoutId = setTimeout(tick, TYPE_SPEED);
    } else {
      // Deleting
      charIndex--;
      el.textContent = currentRole.slice(0, charIndex);

      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeoutId = setTimeout(tick, PAUSE_AFTER_DELETE);
        return;
      }

      timeoutId = setTimeout(tick, DELETE_SPEED);
    }
  }

  // Start animation
  tick();

  // Cleanup on page hide to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(timeoutId);
    } else {
      tick();
    }
  });
}

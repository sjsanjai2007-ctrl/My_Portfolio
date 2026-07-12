/* ================================================================
   MODAL.JS — Project case study modals with focus trap
   ================================================================ */

export function initModals() {
  const triggers = document.querySelectorAll('[data-modal]');
  const overlays = document.querySelectorAll('.modal-overlay');
  let lastFocused = null;

  const FOCUSABLE = 'button:not([disabled]), a[href], input, textarea, [tabindex]:not([tabindex="-1"])';

  // Open modal
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    lastFocused = document.activeElement;
    modal.classList.add('active');
    modal.removeAttribute('hidden');
    document.body.classList.add('scroll-locked');

    // Focus first focusable element
    const focusables = modal.querySelectorAll(FOCUSABLE);
    if (focusables.length) focusables[0].focus();

    // Set up focus trap
    modal._trapHandler = (e) => {
      if (e.key !== 'Tab') return;
      const nodes = [...modal.querySelectorAll(FOCUSABLE)];
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    modal.addEventListener('keydown', modal._trapHandler);
  }

  // Close modal
  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('hidden', '');
    document.body.classList.remove('scroll-locked');

    if (modal._trapHandler) {
      modal.removeEventListener('keydown', modal._trapHandler);
    }

    if (lastFocused) lastFocused.focus();
  }

  // Attach to trigger buttons
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.dataset.modal;
      openModal(modalId);
    });
  });

  // Close buttons inside modals
  overlays.forEach(overlay => {
    // Close button
    const closeBtn = overlay.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(overlay.id));
    }

    // Click backdrop to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  // ESC key closes any open modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach(overlay => {
        if (overlay.classList.contains('active')) {
          closeModal(overlay.id);
        }
      });
    }
  });

  // Expose globally for inline onclick fallbacks
  window.openModal = openModal;
  window.closeModal = closeModal;
}

/* ================================================================
   CONTACT.JS — Form validation + EmailJS + honeypot + rate limit
   ================================================================ */

export function initContact() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let lastSendTime = 0;
  const RATE_LIMIT_MS = 30000; // 30 seconds

  // ── Validation rules ──
  const rules = {
    from_name: {
      validate: (v) => v.trim().length >= 2,
      message: 'Name must be at least 2 characters.',
      errorId: 'name-error',
    },
    from_email: {
      validate: (v) => EMAIL_RE.test(v.trim()),
      message: 'Please enter a valid email address.',
      errorId: 'email-error',
    },
    message: {
      validate: (v) => v.trim().length >= 10,
      message: 'Message must be at least 10 characters.',
      errorId: 'message-error',
    },
  };

  // ── Validate a single field ──
  function validateField(fieldId) {
    const rule = rules[fieldId];
    if (!rule) return true;

    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(rule.errorId);
    const isValid = rule.validate(input.value);

    input.classList.toggle('invalid', !isValid);
    if (errorEl) errorEl.textContent = isValid ? '' : rule.message;

    return isValid;
  }

  // ── Blur validation ──
  Object.keys(rules).forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
      input.addEventListener('blur', () => validateField(fieldId));
      // Clear error on input
      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          validateField(fieldId);
        }
      });
    }
  });

  // ── Form submission ──
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check
    const honeypot = form.elements['website'];
    if (honeypot && honeypot.value) return;

    // Rate limit
    if (Date.now() - lastSendTime < RATE_LIMIT_MS) {
      showToast('Please wait 30 seconds before sending again.', false);
      return;
    }

    // Validate all fields
    const allValid = Object.keys(rules).map(validateField).every(Boolean);
    if (!allValid) return;

    // UI: loading state
    const submitBtn = document.getElementById('submit-btn');
    const btnLabel = document.getElementById('btn-label');
    const originalText = btnLabel.textContent;

    btnLabel.textContent = 'Sending…';
    submitBtn.disabled = true;

    try {
      // Load EmailJS dynamically if not loaded
      if (typeof emailjs === 'undefined') {
        showToast('Email service not loaded. Please try again.', false);
        return;
      }

      await emailjs.sendForm('service_c2osszc', 'template_pfga95d', form);
      showToast("Message sent! I'll reply soon.", true);
      form.reset();
      lastSendTime = Date.now();
    } catch (err) {
      console.error('EmailJS error:', err);
      showToast('Failed to send. Please email me directly.', false);
    } finally {
      submitBtn.disabled = false;
      btnLabel.textContent = originalText;
    }
  });
}

/* ── Toast helper ── */
function showToast(message, isSuccess = true) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.className = 'toast ' + (isSuccess ? 'success' : 'error') + ' show';

  const icon = toast.querySelector('i');
  if (icon) {
    icon.className = isSuccess
      ? 'fa-solid fa-circle-check'
      : 'fa-solid fa-circle-xmark';
  }

  // Auto-dismiss
  clearTimeout(toast._dismissTimer);
  toast._dismissTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Expose showToast globally
window.showToast = showToast;

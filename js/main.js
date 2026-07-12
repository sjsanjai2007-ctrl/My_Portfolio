/* ================================================================
   MAIN.JS — Entry point / module orchestrator
   Imports and initializes all feature modules.
   ================================================================ */

import { initHero } from './hero.js';
import { initTyping } from './typing.js';
import { initMagnetic } from './magnetic.js';
import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';
import { initModals } from './modal.js';
import { initContact } from './contact.js';

/* ── Initialize on DOM ready ── */
document.addEventListener('DOMContentLoaded', () => {
  // Critical path — immediate
  initTheme();
  initNavigation();

  // Hero — high priority
  initHero();
  initTyping();
  initMagnetic();

  // Content — can defer slightly
  initAnimations();
  initModals();

  // Non-critical — lazy init
  requestIdleCallback(() => {
    initContact();
  }, { timeout: 2000 });
});

/* ── requestIdleCallback polyfill ── */
window.requestIdleCallback = window.requestIdleCallback || function(cb, opts) {
  const start = Date.now();
  return setTimeout(() => {
    cb({
      didTimeout: false,
      timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
    });
  }, opts?.timeout || 1);
};

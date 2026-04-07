/**
 * File: main.js
 * Purpose: Global boot (dir/lang sanity, optional partials later)
 * Note: No header/footer logic here yet.
 */

import { isRTL, store } from './utils.js';
import { initCarousel } from './carousel.js';

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     Language & Direction Setup
     ========================================== */

  const storedLang = store.get('lang', 'ar');
  const storedDir = storedLang === 'ar' ? 'rtl' : 'ltr';

  document.documentElement.setAttribute('lang', storedLang);
  document.documentElement.setAttribute('dir', storedDir);


  /* ==========================================
     Generic Toggle System
     ========================================== */

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-toggle-class]');
    if (!t) return;

    const sel = t.getAttribute('data-target');
    const cls = t.getAttribute('data-toggle-class');

    if (sel && cls) {
      document.querySelector(sel)?.classList.toggle(cls);
    }
  });


  /* ==========================================
     Header Search Toggle
     ========================================== */

  document.querySelectorAll(".js-search-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".ASHeaderSearch")
        .forEach(s => s.classList.remove("is-active"));

      const searchWrap = btn.closest(".ASHeaderSearch");
      searchWrap?.classList.toggle("is-active");
    });
  });

  document.addEventListener("click", e => {
    if (!e.target.closest(".ASHeaderSearch")) {
      document.querySelectorAll(".ASHeaderSearch")
        .forEach(s => s.classList.remove("is-active"));
    }
  });


  /* ==========================================
     Smart Carousel Auto Init (SAFE MODE)
     ========================================== */

  const content = document.getElementById('ASContent');

  if (content) {

    const observer = new MutationObserver(() => {
      initCarousel(content);
    });

    observer.observe(content, {
      childList: true,
      subtree: true
    });

  }


  /* ==========================================
     Debug Flag
     ========================================== */

  window.__AS_IS_RTL__ = isRTL();

});
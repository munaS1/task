/**
 * File: components/notifications.js
 * Purpose:
 * - AS Popover Notifications (dropdown-style toggle)
 * - AS Toast Progress Animation (auto percentage sync)
 */

(function () {
    const POPOVER = '[data-as="popover"]';
    const TRIGGER = '[data-as="po-trigger"]';
    const PANEL   = '[data-as="po-panel"]';
  
    const closeAll = (except = null) => {
      document.querySelectorAll(POPOVER).forEach(po => {
        if (po !== except) po.classList.remove('is-open');
      });
    };
  
    document.addEventListener('click', e => {
      const trigger = e.target.closest(TRIGGER);
      const popover = e.target.closest(POPOVER);
  
      // Toggle open / close
      if (trigger && popover) {
        e.preventDefault();
        const isOpen = popover.classList.contains('is-open');
        closeAll();
        popover.classList.toggle('is-open', !isOpen);
        return;
      }
  
      // Click outside closes all
      if (!e.target.closest(POPOVER)) closeAll();
    });
  
    // Close all on scroll or resize
    ['scroll', 'resize'].forEach(evt => {
      window.addEventListener(evt, () => closeAll());
    });
  
    /* ================ TOAST PROGRESS ANIMATION ============== */
    document.addEventListener('DOMContentLoaded', () => {
        const toastProgressBars = document.querySelectorAll('.ASToastProgressBar');
      
        toastProgressBars.forEach(bar => {
          const toast = bar.closest('.ASToast');
          const progressText = toast.querySelector('.ASToastContent p');
          if (!progressText) return;
      
          let progress = 0;
          const duration = 3000; 
          const interval = 30;
          const steps = duration / interval;
      
          const timer = setInterval(() => {
            progress += 100 / steps;
            if (progress >= 100) {
              progress = 100;
              clearInterval(timer);
            }
            progressText.textContent = `${Math.round(progress)}% complete`;
          }, interval);
        });
      });
      
  })();
  
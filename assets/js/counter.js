/**
 * File: counter.js
 * Purpose: Initialize counters after counter.html is dynamically loaded
 */

function initCounters() {
    const pad2 = (n) => String(n).padStart(2, "0");
  
    // ===== Countdown (compact)
    document.querySelectorAll("[data-countdown]").forEach((el) => {
      let d = +el.dataset.days || 0,
          h = +el.dataset.hours || 0,
          m = +el.dataset.minutes || 0,
          s = +el.dataset.seconds || 0;
      const $d = el.querySelector("[data-days]");
      const $h = el.querySelector("[data-hours]");
      const $m = el.querySelector("[data-minutes]");
  
      const tick = () => {
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) { d = h = m = s = 0; }
        if ($d) $d.textContent = pad2(d);
        if ($h) $h.textContent = pad2(h);
        if ($m) $m.textContent = pad2(m);
      };
      tick();
      setInterval(tick, 1000);
    });

    debugger;

  
    // ===== Countdown (extended)
    document.querySelectorAll("[data-countdown-extended]").forEach((el) => {
      let d = +el.dataset.days || 0,
          h = +el.dataset.hours || 0,
          m = +el.dataset.minutes || 0,
          s = +el.dataset.seconds || 0;
      const render = () =>
        (el.textContent = `${pad2(d)} Days ${pad2(h)} Hours ${pad2(m)} Minutes ${pad2(s)} Seconds`);
      const tick = () => {
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        if (d < 0) { d = h = m = s = 0; }
        render();
      };
      render();
      setInterval(tick, 1000);
    });

    debugger;
  
    // ===== Number Counters (int)
    document.querySelectorAll("[data-countup]").forEach((el) => {
      const target = +el.dataset.target,
            step = +el.dataset.step || 1,
            interval = +el.dataset.interval || 40;
      let current = 0;
      const t = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(t); }
        el.textContent = current.toLocaleString();
      }, interval);
    });

    debugger;

  
    // ===== Number Counters (float)
    document.querySelectorAll("[data-countup-float]").forEach((el) => {
      const target = parseFloat(el.dataset.target),
            step = parseFloat(el.dataset.step) || 0.01,
            interval = +el.dataset.interval || 50;
      let current = 0;
      const t = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(t); }
        el.textContent = current.toFixed(4);
      }, interval);
    });
  }
  
  // Re-run when counter page is loaded dynamically
  document.addEventListener("ASViewLoaded", (e) => {
    if (e.detail?.view?.includes("counter.html")) {
      initCounters();
    }
  });
  
  // Run immediately if opened directly
  if (document.querySelector("[data-countup]")) initCounters();
  
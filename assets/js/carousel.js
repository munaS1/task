/* ==========================================
   AS Carousel Controller
   File: carousel.js
   ========================================== */

export function initCarousel(scope = document) {

  scope.querySelectorAll('[data-as="carousel"]').forEach((carousel) => {

    const track = carousel.querySelector('.ASCarouselTrack');
    const items = Array.from(carousel.querySelectorAll('.ASCarouselItem'));
    const nextBtn = carousel.querySelector('.ASCarouselNav--next');
    const prevBtn = carousel.querySelector('.ASCarouselNav--prev');
    const dots = Array.from(
      carousel.querySelectorAll('.ASCarouselThumb, .ASCarouselDot')
    );

    if (!track || items.length === 0) return;

    const isFade = carousel.classList.contains('ASCarousel--fade');
    const isMulti = carousel.classList.contains('ASCarousel--multi');
    const rtl = document.documentElement.dir === 'rtl';
    const total = items.length;

    let index = items.findIndex((item) => item.classList.contains('is-active'));
    if (index < 0) index = 0;

    function updateDots() {
      if (!dots.length) return;

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function updateItems() {
      items.forEach((item, i) => {
        item.classList.toggle('is-active', i === index);
      });
    }

    function update() {

      if (isFade) {
        updateItems();
        updateDots();
        return;
      }

      let slidePercent = 100;

      if (isMulti) {
        slidePercent = 33.333;
      }

      const direction = rtl ? 1 : -1;
      track.style.transform = `translateX(${direction * index * slidePercent}%)`;

      updateItems();
      updateDots();
    }

    function next() {
      index = (index + 1) % total;
      update();
    }

    function prev() {
      index = (index - 1 + total) % total;
      update();
    }

    nextBtn?.addEventListener('click', next);
    prevBtn?.addEventListener('click', prev);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        index = i;
        update();
      });
    });

    /* ===== Optional Auto Play ===== */

    const auto = carousel.dataset.auto;
    if (auto) {
      let interval = setInterval(next, Number(auto));

      carousel.addEventListener('mouseenter', () => {
        clearInterval(interval);
      });

      carousel.addEventListener('mouseleave', () => {
        interval = setInterval(next, Number(auto));
      });
    }

    /* ===== Touch Swipe Support ===== */

    let startX = 0;

    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;

      if (Math.abs(diff) > 50) {
        if (rtl) {
          diff > 0 ? next() : prev();
        } else {
          diff > 0 ? prev() : next();
        }
      }
    });

    update();

  });
}
/* ==========================================
   AS Expanding Showcase
   File: carousel.js
   ========================================== */

export function initExpandingShowcase(scope = document) {
  scope.querySelectorAll('[data-as="expanding-showcase"]').forEach((showcase) => {
    const panels = Array.from(showcase.querySelectorAll('.ASExpandingPanel'));

    if (!panels.length) return;

    function setActive(panel) {
      panels.forEach((item) => {
        item.classList.toggle('is-active', item === panel);
      });
    }

    panels.forEach((panel, index) => {
      panel.addEventListener('mouseenter', () => {
        setActive(panel);
      });

      panel.addEventListener('focus', () => {
        setActive(panel);
      });

      panel.addEventListener('click', () => {
        setActive(panel);
      });

      panel.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setActive(panel);
        }

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          const nextPanel = panels[(index + 1) % panels.length];
          nextPanel.focus();
          setActive(nextPanel);
        }

        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          const prevPanel = panels[(index - 1 + panels.length) % panels.length];
          prevPanel.focus();
          setActive(prevPanel);
        }
      });
    });
  });
}
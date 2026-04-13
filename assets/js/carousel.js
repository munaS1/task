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

    function clearActive() {
      panels.forEach((item) => {
        item.classList.remove('is-active');
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

    showcase.addEventListener('mouseleave', () => {
      clearActive();
    });
  });
}
/* ==========================================
   AS Layered Depth Carousel
   File: carousel.js
   ========================================== */

export function initDepthCarousel(scope = document) {
  scope.querySelectorAll('[data-as="depth-carousel"]').forEach((carousel) => {
    const cards = Array.from(carousel.querySelectorAll('.ASDepthCard'));
    const dots = Array.from(carousel.querySelectorAll('.ASDepthDot'));
    const prevBtn = carousel.querySelector('.ASDepthArrow--prev');
    const nextBtn = carousel.querySelector('.ASDepthArrow--next');

    if (cards.length < 3) return;

    let index = cards.findIndex((card) => card.classList.contains('is-active'));
    if (index < 0) index = 1;

    let isAnimating = false;

    function update() {
      const total = cards.length;
      const prevIndex = (index - 1 + total) % total;
      const nextIndex = (index + 1) % total;

      cards.forEach((card, i) => {
        card.classList.remove(
          'is-prev',
          'is-active',
          'is-next',
          'is-hidden-left',
          'is-hidden-right'
        );

        if (i === index) {
          card.classList.add('is-active');
        } else if (i === prevIndex) {
          card.classList.add('is-prev');
        } else if (i === nextIndex) {
          card.classList.add('is-next');
        } else {
          const isBeforeActive = i < index;
          card.classList.add(isBeforeActive ? 'is-hidden-left' : 'is-hidden-right');
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function goTo(newIndex) {
      if (isAnimating) return;

      isAnimating = true;
      index = (newIndex + cards.length) % cards.length;
      update();

      window.setTimeout(() => {
        isAnimating = false;
      }, 500);
    }

    function goNext() {
      goTo(index + 1);
    }

    function goPrev() {
      goTo(index - 1);
    }

    prevBtn?.addEventListener('click', goPrev);
    nextBtn?.addEventListener('click', goNext);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
      });
    });

    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    });

    update();
  });
}
export function initCoverflowCarousel(scope = document) {
  scope.querySelectorAll('[data-as="coverflow-carousel"]').forEach((carousel) => {
    const cards = Array.from(carousel.querySelectorAll('.ASCoverflowCard'));
    const dots = Array.from(carousel.querySelectorAll('.ASCoverflowDot'));
    const prevBtn = carousel.querySelector('.ASCoverflowArrow--prev');
    const nextBtn = carousel.querySelector('.ASCoverflowArrow--next');

    if (!cards.length) return;

    let index = cards.findIndex((card) => card.classList.contains('is-active'));
    if (index < 0) index = 0;

    let isAnimating = false;

    function getRelativePosition(cardIndex, activeIndex, total) {
      let diff = cardIndex - activeIndex;

      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;

      return diff;
    }

    function update() {
      cards.forEach((card, i) => {
        const pos = getRelativePosition(i, index, cards.length);

        card.classList.remove(
          'is-active',
          'is-left-1',
          'is-right-1',
          'is-left-2',
          'is-right-2',
          'is-hidden'
        );

        if (pos === 0) {
          card.classList.add('is-active');
        } else if (pos === -1) {
          card.classList.add('is-left-1');
        } else if (pos === 1) {
          card.classList.add('is-right-1');
        } else if (pos === -2) {
          card.classList.add('is-left-2');
        } else if (pos === 2) {
          card.classList.add('is-right-2');
        } else {
          card.classList.add('is-hidden');
        }
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('is-active', i === index);
        dot.setAttribute('aria-current', i === index ? 'true' : 'false');
      });
    }

    function goTo(newIndex) {
      if (isAnimating) return;

      isAnimating = true;
      index = (newIndex + cards.length) % cards.length;
      update();

      window.setTimeout(() => {
        isAnimating = false;
      }, 550);
    }

    function goNext() {
      goTo(index + 1);
    }

    function goPrev() {
      goTo(index - 1);
    }

    prevBtn?.addEventListener('click', goPrev);
    nextBtn?.addEventListener('click', goNext);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goTo(i);
      });
    });

    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    });

    update();
  });
}
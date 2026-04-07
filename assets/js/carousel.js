/* ==========================================
   AS Carousel Controller
   File: carousel.js
   ========================================== */

export function initCarousel(scope = document) {

  scope.querySelectorAll('[data-as="carousel"]').forEach(carousel => {

    const track = carousel.querySelector('.ASCarouselTrack');
    const items = carousel.querySelectorAll('.ASCarouselItem');
    const nextBtn = carousel.querySelector('.ASCarouselNav--next');
    const prevBtn = carousel.querySelector('.ASCarouselNav--prev');

    if (!track || items.length === 0) return;

    let index = 0;

    const isFade = carousel.classList.contains('ASCarousel--fade');
    const isMulti = carousel.classList.contains('ASCarousel--multi');

    const rtl = document.documentElement.dir === 'rtl';
    const total = items.length;

    function update() {

      if (isFade) {
        items.forEach(item => item.classList.remove('is-active'));
        items[index].classList.add('is-active');
        return;
      }

      let slidePercent = 100;

      if (isMulti) {
        slidePercent = 33.333;
      }

      const direction = rtl ? 1 : -1;
      track.style.transform =
        `translateX(${direction * index * slidePercent}%)`;
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

    track.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', e => {
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

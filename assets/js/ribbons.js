/**
 * File: ribbons.js
 * Purpose: AS Ribbons interactions
 * Notes:
 * - Safe with dynamically injected partials
 * - Avoids duplicate binding
 * - Keeps cards visible even if JS timing changes
 */

const SELECTORS = {
  card: '.ASRibbonCard',
  ribbon: '.ASRibbon, .ASRibbonBar, .ASRibbonSide, .ASRibbonSoft'
};

/**
 * Initialize all ribbon cards
 */
export function initRibbons(root = document) {
  document.documentElement.classList.add('has-ribbons-js');

  const cards = Array.from(root.querySelectorAll(SELECTORS.card));
  if (!cards.length) return;

  cards.forEach((card, index) => {
    if (card.dataset.asRibbonReady === 'true') return;

    prepareCard(card, index);
    bindPointerStates(card);
    bindKeyboardStates(card);
    bindParallaxEffect(card);

    card.dataset.asRibbonReady = 'true';
  });

  initRibbonReveal(cards, root);
}

/**
 * Prepare card defaults
 */
function prepareCard(card, index) {
  if (!card.hasAttribute('tabindex')) {
    card.setAttribute('tabindex', '0');
  }

  card.dataset.ribbonIndex = String(index);

  const ribbons = card.querySelectorAll(SELECTORS.ribbon);
  if (ribbons.length) {
    ribbons.forEach((ribbon, ribbonIndex) => {
      ribbon.style.setProperty('--ASRibbonDelay', `${index * 60 + ribbonIndex * 90}ms`);
    });
  }
}

/**
 * Pointer interactions
 */
function bindPointerStates(card) {
  card.addEventListener('mouseenter', () => {
    card.classList.add('is-hovered');
  });

  card.addEventListener('mouseleave', () => {
    resetCardState(card);
    resetTilt(card);
  });

  card.addEventListener('mousedown', () => {
    card.classList.add('is-pressed');
  });

  card.addEventListener('mouseup', () => {
    card.classList.remove('is-pressed');
  });
}

/**
 * Keyboard interactions
 */
function bindKeyboardStates(card) {
  card.addEventListener('focus', () => {
    card.classList.add('is-focused');
  });

  card.addEventListener('blur', () => {
    card.classList.remove('is-focused');
    card.classList.remove('is-pressed');
    resetTilt(card);
  });

  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      card.classList.add('is-pressed');
    }
  });

  card.addEventListener('keyup', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      card.classList.remove('is-pressed');
      pulseRibbon(card);
    }
  });
}

/**
 * Mouse move depth / parallax
 */
function bindParallaxEffect(card) {
  let frameId = null;

  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    const rotateY = mapRange(offsetX, 0, rect.width, -4, 4);
    const rotateX = mapRange(offsetY, 0, rect.height, 4, -4);

    if (frameId) cancelAnimationFrame(frameId);

    frameId = requestAnimationFrame(() => {
      card.style.setProperty('--ASRibbonRotateX', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--ASRibbonRotateY', `${rotateY.toFixed(2)}deg`);
      card.classList.add('is-tilted');
    });
  });

  card.addEventListener('mouseleave', () => {
    if (frameId) cancelAnimationFrame(frameId);
  });
}

/**
 * Reveal cards and ribbons when entering viewport
 */
function initRibbonReveal(cards, root = document) {
  const observerRoot = resolveObserverRoot(root);

  if (!('IntersectionObserver' in window)) {
    cards.forEach((card) => card.classList.add('is-revealed'));
    return;
  }

  cards.forEach((card) => {
    if (card.dataset.asRibbonObserved === 'true') return;
    card.dataset.asRibbonObserved = 'true';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const card = entry.target;

        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          card.classList.add('is-revealed');
          observer.unobserve(card);
        }
      });
    },
    {
      root: observerRoot,
      threshold: 0.12,
      rootMargin: '0px 0px -24px 0px'
    }
  );

  cards.forEach((card) => {
    if (!card.classList.contains('is-revealed')) {
      observer.observe(card);
    }
  });

  // Fallback safety: reveal after short delay if observer timing is late
  window.setTimeout(() => {
    cards.forEach((card) => card.classList.add('is-revealed'));
  }, 220);
}

/**
 * Ribbon pulse interaction
 */
function pulseRibbon(card) {
  const ribbons = card.querySelectorAll(SELECTORS.ribbon);
  if (!ribbons.length) return;

  ribbons.forEach((ribbon) => {
    ribbon.classList.remove('is-pulsing');
    void ribbon.offsetWidth;
    ribbon.classList.add('is-pulsing');
  });
}

/**
 * Reset visual states
 */
function resetCardState(card) {
  card.classList.remove('is-hovered');
  card.classList.remove('is-pressed');
}

/**
 * Reset tilt transform
 */
function resetTilt(card) {
  card.style.removeProperty('--ASRibbonRotateX');
  card.style.removeProperty('--ASRibbonRotateY');
  card.classList.remove('is-tilted');
}

/**
 * Resolve scrollable root for intersection observer
 */
function resolveObserverRoot(root) {
  if (root instanceof Element) {
    const contentRoot = root.closest('.ASContent');
    if (contentRoot) return contentRoot;
  }

  const pageContent = document.querySelector('.ASContent');
  return pageContent || null;
}

/**
 * Utility
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMin;
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
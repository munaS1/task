/**
 * File: pagination.js
 * Purpose: AS Pagination interactions
 * Notes:
 * - Keeps demo paginations interactive
 * - Updates active page, prev/next states, and minimal counters
 */

function initPaginationGroup(group) {
  const total = Number(group.dataset.total || 1);
  let current = Number(group.dataset.current || 1);

  const pageButtons = Array.from(group.querySelectorAll('[data-page]'));
  const prevButton = group.querySelector('[data-page-action="prev"]');
  const nextButton = group.querySelector('[data-page-action="next"]');

  function clamp(value) {
    return Math.max(1, Math.min(total, value));
  }

  function update() {
    current = clamp(current);
    group.dataset.current = String(current);

    pageButtons.forEach((button) => {
      const page = Number(button.dataset.page);
      const isActive = page === current;

      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    if (prevButton) {
      const isDisabled = current <= 1;
      prevButton.disabled = isDisabled;
      prevButton.classList.toggle('is-disabled', isDisabled);
    }

    if (nextButton) {
      const isDisabled = current >= total;
      nextButton.disabled = isDisabled;
      nextButton.classList.toggle('is-disabled', isDisabled);
    }
  }

  pageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      current = Number(button.dataset.page);
      update();
    });
  });

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      current -= 1;
      update();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      current += 1;
      update();
    });
  }

  update();
}

function initMinimalPagination(block) {
  const total = Number(block.dataset.total || 1);
  let current = Number(block.dataset.current || 1);

  const prevButton = block.querySelector('[data-page-action="prev"]');
  const nextButton = block.querySelector('[data-page-action="next"]');
  const currentText = block.querySelector('[data-page-current]');
  const totalText = block.querySelector('[data-page-total]');

  function clamp(value) {
    return Math.max(1, Math.min(total, value));
  }

  function update() {
    current = clamp(current);
    block.dataset.current = String(current);

    if (currentText) currentText.textContent = String(current);
    if (totalText) totalText.textContent = String(total);

    if (prevButton) prevButton.disabled = current <= 1;
    if (nextButton) nextButton.disabled = current >= total;
  }

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      current -= 1;
      update();
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      current += 1;
      update();
    });
  }

  update();
}

export function initPagination() {
  const groups = document.querySelectorAll('[data-as-pagination].ASPagination');
  const minimalBlocks = document.querySelectorAll('.ASPaginationMinimal[data-as-pagination]');

  groups.forEach(initPaginationGroup);
  minimalBlocks.forEach(initMinimalPagination);
}

document.addEventListener('DOMContentLoaded', initPagination);
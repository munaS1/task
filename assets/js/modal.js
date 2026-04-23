/**
 * File: modal.js
 * Purpose: AS Modal interactions
 * Works with dynamic loaded pages
 */

(() => {
  const EFFECT_CLASSES = [
    'ASModalEffect--scale',
    'ASModalEffect--slideRight',
    'ASModalEffect--slideBottom',
    'ASModalEffect--newspaper',
    'ASModalEffect--fall',
    'ASModalEffect--flipHorizontal',
    'ASModalEffect--flipVertical',
    'ASModalEffect--superScale',
    'ASModalEffect--sign',
    'ASModalEffect--rotateBottom',
    'ASModalEffect--rotateLeft'
  ];

  function clearEffects(modal) {
    modal.classList.remove(...EFFECT_CLASSES);
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.ASModalTrigger');

    if (!btn) return;

    const target = btn.getAttribute('data-bs-target');
    const effect = btn.getAttribute('data-effect');

    const modal = document.querySelector(target);

    if (!modal) return;

    clearEffects(modal);

    if (effect) {
      modal.classList.add(effect);
    }

    const bsModal = bootstrap.Modal.getOrCreateInstance(modal);
    bsModal.show();
  });

  document.addEventListener('hidden.bs.modal', function (e) {
    if (!e.target.classList.contains('ASModal')) return;
    clearEffects(e.target);
  });
})();
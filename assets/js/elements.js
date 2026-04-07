/**
 * File: elements.js
 * Purpose: Forms interactions for AS Forms Collection
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggle();
  initTextareaCounter();
  initFieldState();
});


/* =====================================
   Password Toggle
===================================== */
function initPasswordToggle() {
  const toggles = document.querySelectorAll('.ASFieldAction');

  if (!toggles.length) return;

  toggles.forEach((btn) => {
    const field = btn.closest('.ASFieldControl');
    if (!field) return;

    const input = field.querySelector('input');
    if (!input) return;

    btn.addEventListener('click', () => {
      const isHidden = input.type === 'password';

      input.type = isHidden ? 'text' : 'password';

      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isHidden
          ? 'fa-regular fa-eye-slash'
          : 'fa-regular fa-eye';
      }
    });
  });
}


/* =====================================
   Textarea Counter
===================================== */
function initTextareaCounter() {
  const areas = document.querySelectorAll('.ASTextarea');

  if (!areas.length) return;

  areas.forEach((area) => {
    const field = area.closest('.ASField');
    if (!field) return;

    const counter = field.querySelector('.ASFieldMeta span');
    if (!counter) return;

    const limit = Number(area.getAttribute('maxlength')) || 200;
    area.setAttribute('maxlength', limit);

    updateCounter(area, counter, limit);

    area.addEventListener('input', () => {
      updateCounter(area, counter, limit);
    });
  });
}

function updateCounter(area, counter, limit) {
  const length = area.value.length;
  counter.textContent = `${length} / ${limit} characters`;

  counter.classList.remove('is-warning', 'is-danger');

  if (length >= limit) {
    counter.classList.add('is-danger');
  } else if (length >= limit * 0.8) {
    counter.classList.add('is-warning');
  }
}


/* =====================================
   Field State (focus + value)
===================================== */
function initFieldState() {
  const controls = document.querySelectorAll(
    '.ASInput, .ASTextarea, .ASSelect'
  );

  if (!controls.length) return;

  controls.forEach((el) => {
    const field = el.closest('.ASField');
    if (!field) return;

    // focus
    el.addEventListener('focus', () => {
      field.classList.add('is-focused');
    });

    // blur
    el.addEventListener('blur', () => {
      field.classList.remove('is-focused');

      if (el.value.trim() !== '') {
        field.classList.add('has-value');
      } else {
        field.classList.remove('has-value');
      }
    });

    // initial state
    if (el.value.trim() !== '') {
      field.classList.add('has-value');
    }
  });
}
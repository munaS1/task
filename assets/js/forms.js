/**
 * File: forms.js
 * Purpose: Minimal shared validation hooks (used later per page)
 */
export function attachRequiredValidation(form) {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      const invalid = [...form.querySelectorAll('[required]')].filter(i => !i.value?.trim());
      invalid.forEach(i => i.classList.add('isInvalid'));
      if (invalid.length) e.preventDefault();
    });
  }
  
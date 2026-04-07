/**
 * File: utils.js
 * Purpose: Small shared helpers (RTL, qs, debounce, store)
 */
export const isRTL = () => document.documentElement.dir === 'rtl';
export const qs = (s, r = document) => r.querySelector(s);
export const qsa = (s, r = document) => [...r.querySelectorAll(s)];

export const debounce = (fn, ms = 200) => {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

export const store = {
  get: (k, f = null) => {
    try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : f; } catch { return f; }
  },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

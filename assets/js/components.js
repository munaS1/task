/**
 * File: components.js
 * Purpose: Sidebar interactions + dynamic view loader for UI catalog
 */
import { qs, qsa } from './utils.js';

export function initAccordion(){
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-accordion]');
    if (!btn) return;
    const key = btn.getAttribute('data-accordion');
    const panel = qs(`[data-panel="${key}"]`);
    if (!panel) return;
    panel.classList.toggle('isOpen');
    // rotate carat visually (optional)
    btn.querySelector('.ASCarat')?.classList.toggle('isOpen');
  });
}

export function initViewLoader(defaultView = ''){
  const initial = getHashView() || defaultView;
  if (initial) loadView(initial);

  document.addEventListener('click', async (e) => {
    const link = e.target.closest('.js-view');
    if (!link) return;
    e.preventDefault();
    setActive(link);
    const view = link.dataset.view;
    await loadView(view);
    setHashView(view);

    // auto-close sidebar on mobile after navigation
    if (window.matchMedia('(max-width: 992px)').matches) {
      document.body.classList.remove('isActive');
    }
  });

  window.addEventListener('hashchange', () => {
    const view = getHashView();
    if (view) loadView(view);
  });
}

async function loadView(url){
  const host = qs('#ASContent');
  if (!host) return;
  host.setAttribute('aria-busy','true');

  try {
    const res = await fetch(url, { cache:'no-cache' });
    const html = res.ok
      ? await res.text()
      : `<section class="ASSection"><div class="ASContainer">Failed to load: ${url}</div></section>`;

    host.innerHTML = html;

    requestAnimationFrame(() => {
      document.dispatchEvent(
        new CustomEvent("ASViewLoaded", { detail: { view: url } })
      );
    });

  } catch (e) {
    host.innerHTML = `<section class="ASSection"><div class="ASContainer">Error loading: ${url}</div></section>`;
  } finally {
    host.setAttribute('aria-busy','false');
  }
}

function setActive(link){
  qsa('.ASNavLink').forEach(a => a.classList.remove('active'));
  link.classList.add('active');
}

function getHashView(){
  const m = location.hash.match(/view=([^&]+)/);
  return m ? decodeURIComponent(m[1]) : '';
}

function setHashView(view){
  const h = `#view=${encodeURIComponent(view)}`;
  if (location.hash !== h) history.pushState(null,'',h);
}


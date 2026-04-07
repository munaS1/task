/**
 * File: components/dropdowns.js
 * Purpose: Accessible dropdown toggling + submenu control (standalone)
 */

(function () {
    const DROPDOWN = '[data-as="dropdown"]';
    const TRIGGER   = '[data-as="dd-trigger"]';
    const MENU      = '[data-as="dd-menu"]';
    const ITEM      = '[data-as="dd-item"]';
    const SUBTRIGGER= '[data-as="dd-subtrigger"]';
  
    const closeAll = (except=null) => {
      document.querySelectorAll(DROPDOWN).forEach(dd=>{
        if(dd!==except){ dd.classList.remove('is-open'); dd.querySelectorAll(SUBTRIGGER).forEach(st=>st.setAttribute('aria-expanded','false')); }
      });
    };
  
    const focusNext = (items, idx, dir) => {
      let i = idx;
      do { i = (i + dir + items.length) % items.length; } while(items[i]?.getAttribute('aria-disabled')==='true');
      items[i]?.focus();
    };
  
    document.addEventListener('click', (e)=>{
      const t = e.target.closest(TRIGGER);
      const dd = e.target.closest(DROPDOWN);
  
      // open/close
      if(t && dd){
        e.preventDefault();
        const isOpen = dd.classList.contains('is-open');
        closeAll();
        dd.classList.toggle('is-open', !isOpen);
        if(!isOpen){
          // focus first item
          const first = dd.querySelector(`${MENU} ${ITEM}:not([aria-disabled="true"])`);
          first && first.focus();
        }
        return;
      }
  
      // submenu open on click
      const subTrig = e.target.closest(SUBTRIGGER);
      if(subTrig){
        const expanded = subTrig.getAttribute('aria-expanded')==='true';
        subTrig.setAttribute('aria-expanded', expanded?'false':'true');
        return;
      }
  
      // click outside
      if(!e.target.closest(DROPDOWN)){ closeAll(); }
    });
  
    // Keyboard support
    document.addEventListener('keydown', (e)=>{
      const dd = e.target.closest(DROPDOWN);
      if(!dd) return;
  
      const items = Array.from(dd.querySelectorAll(`${MENU} ${ITEM}`));
      const idx = items.indexOf(e.target);
  
      switch(e.key){
        case 'Escape': closeAll(); dd.querySelector(TRIGGER)?.focus(); break;
        case 'ArrowDown': e.preventDefault(); focusNext(items, idx, +1); break;
        case 'ArrowUp':   e.preventDefault(); focusNext(items, idx, -1); break;
        case 'ArrowRight': {
          const subT = e.target.matches(SUBTRIGGER) ? e.target : null;
          if(subT){ subT.setAttribute('aria-expanded','true'); const first = subT.nextElementSibling?.querySelector(ITEM); first?.focus(); }
          break;
        }
        case 'ArrowLeft': {
          const sub = e.target.closest('.ASDDSubMenu');
          if(sub){
            const parentTrig = sub.previousElementSibling;
            parentTrig?.focus();
            parentTrig?.setAttribute('aria-expanded','false');
          }
          break;
        }
        case 'Enter':
        case ' ':
          if(e.target.matches(SUBTRIGGER)){ e.preventDefault(); const st=e.target; const open=st.getAttribute('aria-expanded')==='true'; st.setAttribute('aria-expanded', open?'false':'true'); }
          break;
      }
    });
  
    // Hover open for submenu (desktop nicety)
    document.addEventListener('pointerenter', (e)=>{
      const st = e.target.closest(SUBTRIGGER);
      if(st && matchMedia('(hover:hover)').matches){
        st.setAttribute('aria-expanded','true');
      }
    }, true);
    document.addEventListener('pointerleave', (e)=>{
      const st = e.target.closest(SUBTRIGGER);
      if(st && matchMedia('(hover:hover)').matches){
        // close after short delay to allow moving into submenu
        setTimeout(()=>{ if(!st.matches(':hover') && !st.nextElementSibling?.matches(':hover')) st.setAttribute('aria-expanded','false'); }, 120);
      }
    }, true);
  })();
  
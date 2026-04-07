/**
 * File: cards.js
 * Purpose: small interactions used on cards showcase
 */
(function(){
    'use strict';
  
    // Flip cards: on touch/click toggle .is-flipped (CSS handles hover on desktop)
    function initFlipCards(){
      document.querySelectorAll('.ASFlip[data-clickable="true"]').forEach(flip=>{
        flip.addEventListener('click', ()=> flip.classList.toggle('is-flipped'));
      });
    }
  
    // Demo: fake search submit
    function initCardSearch(){
      const form = document.querySelector('#ASCardSearchForm');
      if(!form) return;
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const q = form.querySelector('input')?.value?.trim();
        console.log('[Cards] Search:', q);
      });
    }
  
    // Init
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', onReady);
    }else{ onReady(); }
  
    function onReady(){
      initFlipCards();
      initCardSearch();
      console.log(' AS Cards ready');
    }
  })();
  
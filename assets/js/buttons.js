// Toggle multiple (checkbox-like)
document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.ASCheck');
    if(!btn) return;
    btn.classList.toggle('is-active');
  });
  
  // Single-select (radio-like)
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.ASRadio');
    if(!btn) return;
    const group = btn.closest('[data-radio]');
    if(!group) return;
    group.querySelectorAll('.ASRadio').forEach(b=>b.classList.remove('is-active'));
    btn.classList.add('is-active');
  });
  
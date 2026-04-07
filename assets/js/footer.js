/**
 File: footer.js
 Purpose: Footer component small interactions 

*/

document.addEventListener('DOMContentLoaded', () => {
  // Simple hover animation for social icons
  const socialLinks = document.querySelectorAll('.ASFooterSocial a');
  socialLinks.forEach(link => {
    link.addEventListener('mouseenter', () => link.classList.add('is-hovered'));
    link.addEventListener('mouseleave', () => link.classList.remove('is-hovered'));
  });
});

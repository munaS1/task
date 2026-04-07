/**
 * File: thumbnails.js
 * Purpose: Thumbnail interactions (selection state)
 */

document.addEventListener('click', function (e) {

  const thumb = e.target.closest('.ASThumbnail');
  if (!thumb) return;

  const row = thumb.closest('.ASThumbnailsRow');
  if (!row) return;

  // Single select mode
  row.querySelectorAll('.ASThumbnail').forEach(item => {
    item.classList.remove('is-active');
  });

  thumb.classList.add('is-active');

});
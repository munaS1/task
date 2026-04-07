/* =====================================
   AS Navigation System – FULL INTERACTION
   ===================================== */

document.addEventListener("click", function (e) {

  /* =====================================
     1️⃣  TAB SYSTEM (KEEP AS IS)
  ===================================== */

  const tabBtn = e.target.closest(".ASNavTab");

  if (tabBtn) {
    const navBlock = tabBtn.closest(".ASNavBlock");
    if (!navBlock) return;

    const targetSelector = tabBtn.dataset.target;
    if (!targetSelector) return;

    // Remove active from buttons
    navBlock.querySelectorAll(".ASNavTab")
      .forEach(btn => btn.classList.remove("is-active"));

    tabBtn.classList.add("is-active");

    // Hide all panes
    navBlock.querySelectorAll(".ASTabPane")
      .forEach(pane => pane.classList.remove("is-active"));

    const targetPane = navBlock.querySelector(targetSelector);
    if (targetPane) {
      targetPane.classList.add("is-active");
    }

    return; // Important: stop here so it doesn't trigger normal nav
  }


  /* =====================================
     2️⃣  NORMAL NAVIGATION (ALL TYPES)
  ===================================== */

  const navLink = e.target.closest(".ASNavLink");
  const navIcon = e.target.closest(".ASNavIcon");
  const navCircle = e.target.closest(".ASNavCircle");

  const clickedItem = navLink || navIcon || navCircle;

  if (!clickedItem) return;

  // Ignore disabled
  if (clickedItem.classList.contains("is-disabled")) return;

  const navBlock = clickedItem.closest(".ASNav");
  if (!navBlock) return;

  // Remove active only inside same nav
  navBlock.querySelectorAll(".is-active")
    .forEach(el => el.classList.remove("is-active"));

  clickedItem.classList.add("is-active");

});

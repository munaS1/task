function getPopoverCoords(triggerRect, popoverRect, placement = "top", gap = 14) {
  let top = 0;
  let left = 0;

  switch (placement) {
    case "bottom":
      top = triggerRect.bottom + gap + window.scrollY;
      left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2) + window.scrollX;
      break;

    case "left":
      top = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2) + window.scrollY;
      left = triggerRect.left - popoverRect.width - gap + window.scrollX;
      break;

    case "right":
      top = triggerRect.top + (triggerRect.height / 2) - (popoverRect.height / 2) + window.scrollY;
      left = triggerRect.right + gap + window.scrollX;
      break;

    case "top":
    default:
      top = triggerRect.top - popoverRect.height - gap + window.scrollY;
      left = triggerRect.left + (triggerRect.width / 2) - (popoverRect.width / 2) + window.scrollX;
      break;
  }

  return { top, left };
}

function clampPopover(left, top, popoverRect, padding = 12) {
  const minLeft = window.scrollX + padding;
  const maxLeft = window.scrollX + window.innerWidth - popoverRect.width - padding;
  const minTop = window.scrollY + padding;
  const maxTop = window.scrollY + window.innerHeight - popoverRect.height - padding;

  return {
    left: Math.max(minLeft, Math.min(left, maxLeft)),
    top: Math.max(minTop, Math.min(top, maxTop))
  };
}

export function initPopovers(scope = document) {
  const triggers = scope.querySelectorAll('[data-as="popover"]');
  let activePopover = null;
  let activeTrigger = null;

  const closeActivePopover = () => {
    if (activePopover) {
      activePopover.remove();
      activePopover = null;
      activeTrigger = null;
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (activeTrigger === trigger) {
        closeActivePopover();
        return;
      }

      closeActivePopover();

      const title = trigger.dataset.title || "Popover title";
      const content = trigger.dataset.content || "";
      const placement = trigger.dataset.placement || "top";
      const variant = trigger.dataset.variant || "default";

      const popover = document.createElement("div");
      popover.className = `ASPopover ASPopover--${placement}${variant !== "default" ? ` ASPopover--${variant}` : ""}`;
      popover.innerHTML = `
        <div class="ASPopoverHeader">${title}</div>
        <div class="ASPopoverBody">${content}</div>
      `;

      document.body.appendChild(popover);

      const triggerRect = trigger.getBoundingClientRect();
      const popoverRect = popover.getBoundingClientRect();

      const coords = getPopoverCoords(triggerRect, popoverRect, placement);
      const safeCoords = clampPopover(coords.left, coords.top, popoverRect);

      popover.style.left = `${safeCoords.left}px`;
      popover.style.top = `${safeCoords.top}px`;

      requestAnimationFrame(() => {
        popover.classList.add("isVisible");
      });

      activePopover = popover;
      activeTrigger = trigger;
    });
  });

  document.addEventListener("click", (event) => {
    if (!activePopover) return;
    if (activePopover.contains(event.target)) return;
    if (activeTrigger && activeTrigger.contains(event.target)) return;
    closeActivePopover();
  });
}
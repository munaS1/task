function getTooltipCoords(triggerRect, tooltipRect, placement = "top", gap = 12) {
  let top = 0;
  let left = 0;

  switch (placement) {
    case "bottom":
      top = triggerRect.bottom + gap + window.scrollY;
      left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2) + window.scrollX;
      break;

    case "left":
      top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2) + window.scrollY;
      left = triggerRect.left - tooltipRect.width - gap + window.scrollX;
      break;

    case "right":
      top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2) + window.scrollY;
      left = triggerRect.right + gap + window.scrollX;
      break;

    case "top":
    default:
      top = triggerRect.top - tooltipRect.height - gap + window.scrollY;
      left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2) + window.scrollX;
      break;
  }

  return { top, left };
}

function clampToViewport(left, top, tooltipRect, padding = 10) {
  const minLeft = window.scrollX + padding;
  const maxLeft = window.scrollX + window.innerWidth - tooltipRect.width - padding;
  const minTop = window.scrollY + padding;
  const maxTop = window.scrollY + window.innerHeight - tooltipRect.height - padding;

  return {
    left: Math.max(minLeft, Math.min(left, maxLeft)),
    top: Math.max(minTop, Math.min(top, maxTop))
  };
}

export function initTooltips(scope = document) {
  const triggers = scope.querySelectorAll('[data-as="tooltip"]');

  triggers.forEach((trigger) => {
    let tooltipEl = null;
    let showTimer = null;

    const showTooltip = () => {
      const title = trigger.dataset.title;
      const variant = trigger.dataset.variant || "neutral";
      const placement = trigger.dataset.placement || "top";

      if (!title) return;

      tooltipEl = document.createElement("div");
      tooltipEl.className = `ASTooltip ASTooltip--${placement} ASTooltip--${variant}`;
      tooltipEl.textContent = title;

      document.body.appendChild(tooltipEl);

      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltipEl.getBoundingClientRect();

      const coords = getTooltipCoords(triggerRect, tooltipRect, placement);
      const safeCoords = clampToViewport(coords.left, coords.top, tooltipRect);

      tooltipEl.style.left = `${safeCoords.left}px`;
      tooltipEl.style.top = `${safeCoords.top}px`;

      requestAnimationFrame(() => {
        if (tooltipEl) tooltipEl.classList.add("isVisible");
      });
    };

    const hideTooltip = () => {
      clearTimeout(showTimer);
      if (!tooltipEl) return;
      tooltipEl.remove();
      tooltipEl = null;
    };

    trigger.addEventListener("mouseenter", () => {
      showTimer = setTimeout(showTooltip, 80);
    });

    trigger.addEventListener("mouseleave", hideTooltip);
    trigger.addEventListener("focus", showTooltip);
    trigger.addEventListener("blur", hideTooltip);
  });
}
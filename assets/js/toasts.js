/**
 * File: toasts.js
 * Purpose: AS Toast interactions
 * Notes:
 * - Fixed dynamic partial-load initialization
 * - Added stronger live interactions
 * - Rebind-safe
 */

(function () {
  const SELECTORS = {
    close: "[data-toast-close]",
    zone: "[data-toast-zone]",
    launch: "[data-toast-launch]",
    stack: "#ASToastStack",
    showPrimary: "#ASShowPrimaryToast",
    showSuccess: "#ASShowSuccessToast",
    showWarning: "#ASShowWarningToast",
    clearAll: "#ASClearToastStack"
  };

  function hideToast(toast) {
    if (!toast) return;
    toast.classList.add("is-hiding");

    window.setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 260);
  }

  function bindClose(scope = document) {
    scope.querySelectorAll(SELECTORS.close).forEach((button) => {
      if (button.dataset.toastBound === "true") return;
      button.dataset.toastBound = "true";

      button.addEventListener("click", () => {
        const toast = button.closest(".ASToast");
        hideToast(toast);
      });
    });
  }

  function createToastHTML(type, title, body) {
    const typeClassMap = {
      primary: "ASToast--solid ASToast--solid-primary",
      success: "ASToast--success",
      warning: "ASToast--alert",
      error: "ASToast--error",
      info: "ASToast--info"
    };

    const iconMap = {
      primary: "AS",
      success: "✓",
      warning: "!",
      error: "×",
      info: "i"
    };

    const isSolid = type === "primary";

    return `
      <div class="ASToast ${typeClassMap[type] || "ASToast--info"}" role="status" aria-live="polite">
        ${isSolid ? "" : '<div class="ASToastAccent"></div>'}
        <div class="ASToastInner">
          ${
            isSolid
              ? `
                <div class="ASToastContent">
                  <strong class="ASToastTitle">${title}</strong>
                  <div class="ASToastBody">${body}</div>
                </div>
              `
              : `
                <div class="ASToastIcon">${iconMap[type] || "i"}</div>
                <div class="ASToastContent">
                  <strong class="ASToastTitle">${title}</strong>
                  <div class="ASToastBody">${body}</div>
                </div>
              `
          }
          <button class="ASToastClose ${isSolid ? "ASToastClose--light" : ""}" type="button" data-toast-close aria-label="Close">×</button>
        </div>
      </div>
    `;
  }

  function pushToastToZone(zoneName) {
    const zone = document.querySelector(`${SELECTORS.zone}[data-toast-zone="${zoneName}"]`);
    if (!zone) return;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = createToastHTML(
      "primary",
      "إشعار حي",
      `تم عرض Toast جديد في موضع: ${zoneName}`
    );

    const toast = wrapper.firstElementChild;
    zone.prepend(toast);
    bindClose(toast);

    window.setTimeout(() => hideToast(toast), 3500);
  }

  function pushToastToStack(type, title, body) {
    const stack = document.querySelector(SELECTORS.stack);
    if (!stack) return;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = createToastHTML(type, title, body);

    const toast = wrapper.firstElementChild;
    stack.prepend(toast);
    bindClose(toast);

    while (stack.children.length > 5) {
      stack.removeChild(stack.lastElementChild);
    }

    window.setTimeout(() => hideToast(toast), 4200);
  }

  function initPlacementButtons(scope = document) {
    scope.querySelectorAll(SELECTORS.launch).forEach((button) => {
      if (button.dataset.toastBound === "true") return;
      button.dataset.toastBound = "true";

      button.addEventListener("click", () => {
        const zoneName = button.getAttribute("data-toast-launch");
        pushToastToZone(zoneName);
      });
    });
  }

  function initLiveStackButtons(scope = document) {
    const primaryBtn = scope.querySelector(SELECTORS.showPrimary);
    const successBtn = scope.querySelector(SELECTORS.showSuccess);
    const warningBtn = scope.querySelector(SELECTORS.showWarning);
    const clearBtn = scope.querySelector(SELECTORS.clearAll);
    const stack = scope.querySelector(SELECTORS.stack);

    if (primaryBtn && primaryBtn.dataset.toastBound !== "true") {
      primaryBtn.dataset.toastBound = "true";
      primaryBtn.addEventListener("click", () => {
        pushToastToStack("primary", "تحديث من النظام", "تم نشر المكون الجديد ضمن الكتالوج.");
      });
    }

    if (successBtn && successBtn.dataset.toastBound !== "true") {
      successBtn.dataset.toastBound = "true";
      successBtn.addEventListener("click", () => {
        pushToastToStack("success", "تم الإنجاز", "تم حفظ الإعدادات وربطها بالواجهة بنجاح.");
      });
    }

    if (warningBtn && warningBtn.dataset.toastBound !== "true") {
      warningBtn.dataset.toastBound = "true";
      warningBtn.addEventListener("click", () => {
        pushToastToStack("warning", "تنبيه مؤقت", "يوجد عنصر يحتاج مراجعة قبل الاعتماد النهائي.");
      });
    }

    if (clearBtn && stack && clearBtn.dataset.toastBound !== "true") {
      clearBtn.dataset.toastBound = "true";
      clearBtn.addEventListener("click", () => {
        Array.from(stack.children).forEach((toast, index) => {
          window.setTimeout(() => hideToast(toast), index * 70);
        });
      });
    }
  }

  function initASToasts(scope = document) {
    bindClose(scope);
    initPlacementButtons(scope);
    initLiveStackButtons(scope);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initASToasts(document));
  } else {
    initASToasts(document);
  }

  window.initASToasts = initASToasts;
})();
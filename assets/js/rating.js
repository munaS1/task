/**
 * File: rating.js
 * Purpose: Premium rating interactions (icon rating + half steps + NPS)
 */

function getColorVar(colorKey) {
  const map = {
    primary: "var(--ASColor-primary)",
    secondary: "var(--ASColor-secondary)",
    tertiary: "var(--ASColor-tertiary)",
    quaternary: "var(--ASColor-quaternary)",
    success: "var(--ASColor-success)",
    error: "var(--ASColor-error)",
    info: "var(--ASColor-info)",
    alert: "var(--ASColor-alert)",
  };
  return map[colorKey] || map.primary;
}

function getDir() {
  return document.documentElement.getAttribute("dir") || "rtl";
}

function iconToken(type) {
  if (type === "star") return "★";
  if (type === "heart") return "♥";
  if (type === "thumb") return "👍";
  if (type === "circle") return "●";
  return "★";
}

function iconHTML(type) {
  if (type === "star") return `<i class="fa-solid fa-star" aria-hidden="true"></i>`;
  if (type === "heart") return `<i class="fa-solid fa-heart" aria-hidden="true"></i>`;
  if (type === "thumb") return `<i class="fa-solid fa-thumbs-up" aria-hidden="true"></i>`;
  if (type === "circle") return `<i class="fa-solid fa-circle" aria-hidden="true"></i>`;
  return `<i class="fa-solid fa-star" aria-hidden="true"></i>`;
}

function emojiFor(i) {
  const list = ["😡", "😕", "😐", "🙂", "😍"];
  return list[i - 1] || "🙂";
}

function sentimentLabel(val) {
  const map = {
    1: "Angry",
    2: "Not happy",
    3: "Neutral",
    4: "Happy",
    5: "Love it",
  };
  return map[Math.round(val)] || "Happy";
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function roundToStep(v, step) {
  const inv = 1 / step;
  return Math.round(v * inv) / inv;
}

function buildRating(root) {
  const max = Number(root.dataset.max || 5);
  const step = Number(root.dataset.step || 1);
  const icon = (root.dataset.icon || "star").toLowerCase();
  const color = (root.dataset.color || "primary").toLowerCase();
  const isReadOnly = root.dataset.readonly === "true";

  let value = Number(root.dataset.value || 0);
  value = clamp(roundToStep(value, step), 0, max);

  root.style.setProperty("--as-rate-color", getColorVar(color));
  root.setAttribute("role", "radiogroup");
  root.tabIndex = isReadOnly ? -1 : 0;
  root.innerHTML = "";

  for (let i = 1; i <= max; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ASRatingItem";
    btn.dataset.value = String(i);
    btn.disabled = isReadOnly;

    // content
    if (icon === "emoji") {
      btn.innerHTML = `<span aria-hidden="true">${emojiFor(i)}</span>`;
    } else {
      btn.innerHTML = iconHTML(icon);
    }

    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-label", `Rate ${i} of ${max}`);
    root.appendChild(btn);

    // hover preview
    btn.addEventListener("mouseenter", () => {
      if (isReadOnly) return;
      applyPreview(root, icon, i, step);
    });

    btn.addEventListener("mouseleave", () => {
      if (isReadOnly) return;
      applyValue(root, icon, value, step);
    });

    // click select (supports half step by click position)
    btn.addEventListener("click", (e) => {
      if (isReadOnly) return;

      let next = i;

      if (step === 0.5 && icon !== "emoji") {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left;
        const isLeftHalf = x <= r.width / 2;
        // RTL: reverse halves
        const dir = getDir();
        const half = dir === "rtl" ? (!isLeftHalf) : isLeftHalf;
        next = half ? (i - 0.5) : i;
      }

      value = clamp(roundToStep(next, step), 0, max);
      root.dataset.value = String(value);

      applyValue(root, icon, value, step);
      syncKPI(root, value);

      // sentiment text
      if (icon === "emoji") syncSentiment(root, value);
    });
  }

  // keyboard on container (left/right, home/end)
  root.addEventListener("keydown", (e) => {
    if (isReadOnly) return;

    const k = e.key;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(k)) return;

    e.preventDefault();

    const dir = getDir();
    const incKey = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const decKey = dir === "rtl" ? "ArrowRight" : "ArrowLeft";

    let next = value;

    if (k === "Home") next = step; // smallest
    else if (k === "End") next = max;
    else if (k === incKey) next = value + step;
    else if (k === decKey) next = value - step;

    value = clamp(roundToStep(next, step), 0, max);
    root.dataset.value = String(value);

    applyValue(root, icon, value, step);
    syncKPI(root, value);
    if (icon === "emoji") syncSentiment(root, value);
  });

  applyValue(root, icon, value, step);
  syncKPI(root, value);
  if (icon === "emoji") syncSentiment(root, value);
}

function applyPreview(root, icon, hoverValue, step) {
  // preview in whole steps (nice + simple)
  applyValue(root, icon, hoverValue, step);
  root.querySelectorAll(".ASRatingItem").forEach((b) => b.classList.add("is-hover"));
}

function applyValue(root, icon, value, step) {
  const items = [...root.querySelectorAll(".ASRatingItem")];

  items.forEach((btn, idx) => {
    const i = idx + 1;
    btn.classList.remove("is-hover", "is-on", "is-off", "is-half");

    // aria checked for closest step
    btn.setAttribute("aria-checked", i === Math.ceil(value) ? "true" : "false");

    if (i <= Math.floor(value)) {
      btn.classList.add("is-on");
    } else if (step === 0.5 && i === Math.ceil(value) && value % 1 !== 0 && icon !== "emoji") {
      btn.classList.add("is-half");
      btn.setAttribute("data-icon", iconToken(icon));
    } else {
      btn.classList.add("is-off");
    }
  });
}

function syncKPI(root, value) {
  const card = root.closest(".ASCard") || root.parentElement;
  if (!card) return;

  // update KPI in that card (can be multiple; update first visible)
  const el = card.querySelector('[data-as="rating-kpi"]');
  if (el) el.textContent = String(value);
}

function syncSentiment(root, value) {
  const card = root.closest(".ASCard") || root.parentElement;
  if (!card) return;

  const face = card.querySelector('[data-as="sentiment-face"]');
  const label = card.querySelector('[data-as="sentiment-label"]');
  const v = Math.round(value);

  if (face) face.textContent = emojiFor(v);
  if (label) label.textContent = sentimentLabel(v);
}

/* ------------------------------- */
/* NPS 0–10                         */
/* ------------------------------- */
function npsCategory(score) {
  if (score <= 6) return "Detractor";
  if (score <= 8) return "Passive";
  return "Promoter";
}

function buildNPS(root) {
  const value = Number(root.dataset.value || 0);
  root.innerHTML = "";

  for (let i = 0; i <= 10; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ASNPSPill";
    btn.textContent = String(i);
    btn.dataset.value = String(i);
    btn.classList.toggle("is-active", i === value);

    btn.addEventListener("click", () => {
      root.dataset.value = String(i);
      root.querySelectorAll(".ASNPSPill").forEach((b) => b.classList.toggle("is-active", b.dataset.value === String(i)));

      const card = root.closest(".ASCard");
      if (!card) return;

      const kpi = card.querySelector('[data-as="nps-kpi"]');
      const label = card.querySelector('[data-as="nps-label"]');

      if (kpi) kpi.textContent = String(i);
      if (label) label.textContent = npsCategory(i);
    });

    root.appendChild(btn);
  }

  // initial label
  const card = root.closest(".ASCard");
  if (card) {
    const label = card.querySelector('[data-as="nps-label"]');
    if (label) label.textContent = npsCategory(value);
  }
}

/* ------------------------------- */
/* Quick chips (set rating)         */
/* ------------------------------- */
function initQuickChips() {
  document.querySelectorAll("[data-set-rating]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".ASCard");
      if (!card) return;

      const rating = card.querySelector('[data-as="rating"]');
      if (!rating) return;

      const v = Number(btn.getAttribute("data-set-rating") || 0);
      rating.dataset.value = String(v);

      // active chip state
      card.querySelectorAll("[data-set-rating]").forEach((b) => b.classList.toggle("is-active", b === btn));

      buildRating(rating);
    });
  });
}

function initRatings() {
  document.querySelectorAll('[data-as="rating"]').forEach(buildRating);
  document.querySelectorAll('[data-as="nps"]').forEach(buildNPS);
  initQuickChips();
}

document.addEventListener("DOMContentLoaded", initRatings);
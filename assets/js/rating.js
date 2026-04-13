/**
 * File: rating.js
 * Purpose: Premium rating interactions (icon rating + half steps + NPS + gamified states + motion)
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
  if (type === "shield") return "⬢";
  return "★";
}

function iconHTML(type) {
  if (type === "star") return `<i class="fa-solid fa-star" aria-hidden="true"></i>`;
  if (type === "heart") return `<i class="fa-solid fa-heart" aria-hidden="true"></i>`;
  if (type === "thumb") return `<i class="fa-solid fa-thumbs-up" aria-hidden="true"></i>`;
  if (type === "circle") return `<i class="fa-solid fa-circle" aria-hidden="true"></i>`;
  if (type === "shield") return `<i class="fa-solid fa-shield-halved" aria-hidden="true"></i>`;
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

function showRateNote(card, text) {
  if (!card) return;

  let note = card.querySelector(".ASRateNote");
  if (!note) {
    note = document.createElement("div");
    note.className = "ASRateNote";
    card.querySelector(".ASCardBody")?.appendChild(note);
  }

  note.textContent = text;
  note.classList.add("is-visible");

  clearTimeout(note._hideTimer);
  note._hideTimer = setTimeout(() => {
    note.classList.remove("is-visible");
  }, 1800);
}

function addBurstEffect(root) {
  const active = root.querySelectorAll(".ASRatingItem.is-on");
  active.forEach((item) => {
    item.classList.remove("is-burst");
    void item.offsetWidth;
    item.classList.add("is-burst");

    setTimeout(() => {
      item.classList.remove("is-burst");
    }, 600);
  });
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

    if (icon === "emoji") {
      btn.innerHTML = `<span aria-hidden="true">${emojiFor(i)}</span>`;
    } else {
      btn.innerHTML = iconHTML(icon);
    }

    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-label", `Rate ${i} of ${max}`);
    root.appendChild(btn);

    btn.addEventListener("mouseenter", () => {
      if (isReadOnly) return;
      applyPreview(root, icon, i, step);
    });

    btn.addEventListener("mouseleave", () => {
      if (isReadOnly) return;
      applyValue(root, icon, value, step);
    });

    btn.addEventListener("click", (e) => {
      if (isReadOnly) return;

      let next = i;

      if (step === 0.5 && icon !== "emoji") {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left;
        const isLeftHalf = x <= r.width / 2;

        const dir = getDir();
        const half = dir === "rtl" ? !isLeftHalf : isLeftHalf;
        next = half ? i - 0.5 : i;
      }

      value = clamp(roundToStep(next, step), 0, max);
      root.dataset.value = String(value);

      applyValue(root, icon, value, step);
      syncKPI(root, value);

      if (icon === "emoji") syncSentiment(root, value);
      syncGamified(root, value);
      addBurstEffect(root);

      const card = root.closest(".ASCard");
      if (card) {
        const feedbackMap = {
          1: "We appreciate your honesty.",
          2: "Thank you — your opinion matters.",
          3: "Thanks for helping us improve.",
          4: "Great! We are glad you were satisfied.",
          5: "Wonderful! Thank you for your excellent feedback.",
        };

        showRateNote(card, feedbackMap[Math.round(value)] || "Thank you for your feedback.");
      }
    });
  }

  root.addEventListener("keydown", (e) => {
    if (isReadOnly) return;

    const k = e.key;
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(k)) return;

    e.preventDefault();

    const dir = getDir();
    const incKey = dir === "rtl" ? "ArrowLeft" : "ArrowRight";
    const decKey = dir === "rtl" ? "ArrowRight" : "ArrowLeft";

    let next = value;

    if (k === "Home") next = step;
    else if (k === "End") next = max;
    else if (k === incKey) next = value + step;
    else if (k === decKey) next = value - step;

    value = clamp(roundToStep(next, step), 0, max);
    root.dataset.value = String(value);

    applyValue(root, icon, value, step);
    syncKPI(root, value);

    if (icon === "emoji") syncSentiment(root, value);
    syncGamified(root, value);
  });

  applyValue(root, icon, value, step);
  syncKPI(root, value);

  if (icon === "emoji") syncSentiment(root, value);
  syncGamified(root, value);
}

function applyPreview(root, icon, hoverValue, step) {
  applyValue(root, icon, hoverValue, step);
  root.querySelectorAll(".ASRatingItem").forEach((b) => b.classList.add("is-hover"));
}

function applyValue(root, icon, value, step) {
  const items = [...root.querySelectorAll(".ASRatingItem")];

  items.forEach((btn, idx) => {
    const i = idx + 1;
    btn.classList.remove("is-hover", "is-on", "is-off", "is-half");

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
/* NPS 0–10                        */
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
      root.querySelectorAll(".ASNPSPill").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.value === String(i));
      });

      const card = root.closest(".ASCard");
      if (!card) return;

      const kpi = card.querySelector('[data-as="nps-kpi"]');
      const label = card.querySelector('[data-as="nps-label"]');

      if (kpi) kpi.textContent = String(i);
      if (label) label.textContent = npsCategory(i);
    });

    root.appendChild(btn);
  }

  const card = root.closest(".ASCard");
  if (card) {
    const label = card.querySelector('[data-as="nps-label"]');
    if (label) label.textContent = npsCategory(value);
  }
}

/* ------------------------------- */
/* Quick chips                     */
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

      card.querySelectorAll("[data-set-rating]").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
      });

      buildRating(rating);
    });
  });
}

/* ------------------------------- */
/* Gamified states                 */
/* ------------------------------- */
function syncGamified(root, value) {
  const card = root.closest(".ASCard");
  if (!card) return;

  if (root.dataset.gameLevel === "true") {
    const fill = card.querySelector('[data-as="level-fill"]');
    const badge = card.querySelector('[data-as="level-badge"]');
    const text = card.querySelector('[data-as="level-text"]');

    const pct = Math.round((value / 5) * 100);
    const level = Math.max(1, Math.ceil(value / 1.5));

    if (fill) fill.style.width = `${pct}%`;
    if (badge) badge.textContent = `Level ${level}`;
    if (text) text.textContent = `${pct} XP to next level`;
  }

  if (root.dataset.gameBadge === "true") {
    const badgeBox = card.querySelector('[data-as="badge-unlock"]');
    if (badgeBox) {
      badgeBox.classList.toggle("is-unlocked", value >= 4);
    }
  }

  if (root.dataset.gameStreak === "true") {
    const count = card.querySelector('[data-as="streak-count"]');
    const flames = card.querySelectorAll(".ASStreakFlame");
    const active = Math.round(value);

    if (count) count.textContent = `${active} Days`;

    flames.forEach((item, idx) => {
      item.classList.toggle("is-active", idx < active);
    });
  }

  if (root.dataset.gameReaction === "true") {
    const fill = card.querySelector('[data-as="reaction-fill"]');
    const label = card.querySelector('[data-as="reaction-label"]');
    const pct = Math.round((value / 5) * 100);

    const reactionMap = {
      1: "Very Bad",
      2: "Bad",
      3: "Okay",
      4: "Very Good",
      5: "Excellent",
    };

    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = reactionMap[Math.round(value)] || "Okay";
  }

  if (root.dataset.gameTrust === "true") {
    const fill = card.querySelector('[data-as="trust-fill"]');
    const label = card.querySelector('[data-as="trust-label"]');
    const sub = card.querySelector('[data-as="trust-sub"]');
    const pct = Math.round((value / 5) * 100);

    const trustLabels = {
      1: "Low trust",
      2: "Needs review",
      3: "Acceptable",
      4: "Trusted",
      5: "Highly trusted",
    };

    const trustSubs = {
      1: "Low confidence",
      2: "Service should improve",
      3: "Moderate confidence",
      4: "Strong confidence",
      5: "Excellent confidence",
    };

    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = trustLabels[Math.round(value)] || "Trusted";
    if (sub) sub.textContent = trustSubs[Math.round(value)] || "Strong confidence";
  }

  if (root.dataset.gameJourney === "true") {
    const fill = card.querySelector('[data-as="journey-fill"]');
    const badge = card.querySelector('[data-as="journey-stage"]');
    const steps = card.querySelectorAll(".ASJourneyStep");
    const active = Math.round(value);
    const pct = Math.round((value / 5) * 100);

    const stageMap = {
      1: "Requested",
      2: "Reviewed",
      3: "Processed",
      4: "Completed",
      5: "Optimized",
    };

    if (fill) fill.style.width = `${pct}%`;
    if (badge) badge.textContent = stageMap[active] || "Completed";

    steps.forEach((step, idx) => {
      step.classList.toggle("is-active", idx < active);
    });
  }

  if (root.dataset.gameCelebrate === "true") {
    const label = card.querySelector('[data-as="celebrate-label"]');
    const emoji = card.querySelector('[data-as="celebrate-emoji"]');
    const text = card.querySelector('[data-as="celebrate-text"]');

    const celebrateLabels = {
      1: "Poor",
      2: "Fair",
      3: "Good",
      4: "Very Good",
      5: "Wonderful",
    };

    const celebrateEmoji = {
      1: "💭",
      2: "🌤️",
      3: "✨",
      4: "🎊",
      5: "🎉",
    };

    const celebrateText = {
      1: "Your feedback helps us identify service gaps.",
      2: "Thank you for helping improve the experience.",
      3: "We appreciate your balanced feedback.",
      4: "Your positive feedback means a lot.",
      5: "Your feedback helps reinforce excellent service quality.",
    };

    if (label) label.textContent = celebrateLabels[Math.round(value)] || "Wonderful";
    if (emoji) emoji.textContent = celebrateEmoji[Math.round(value)] || "🎉";
    if (text) text.textContent = celebrateText[Math.round(value)] || "Your feedback helps improve public services.";
  }

  if (root.dataset.gameMood === "true") {
    const fill = card.querySelector('[data-as="mood-fill"]');
    const label = card.querySelector('[data-as="mood-label"]');
    const pct = Math.round((value / 5) * 100);

    const moodMap = {
      1: "Upset",
      2: "Concerned",
      3: "Neutral",
      4: "Satisfied",
      5: "Delighted",
    };

    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = moodMap[Math.round(value)] || "Satisfied";
  }
}

function initRatings() {
  document.querySelectorAll('[data-as="rating"]').forEach(buildRating);
  document.querySelectorAll('[data-as="nps"]').forEach(buildNPS);
  initQuickChips();
}

document.addEventListener("DOMContentLoaded", initRatings);
/**
 * File: assets/js/maps/maps.js
 * Purpose: Boot maps after partial load into #ASContent
 * Note: Uses B approach (jQuery/plugins) but only for maps pages.
 */

const __ASMaps = {
  loaded: {
    jquery: false,
    leaflet: false,
    mapael: false,
    jvectormap: false,
  },
};

function cssVar(name, fallback = "#2b7fff") {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function loadCSS(href) {
  return new Promise((resolve) => {
    const exists = [...document.styleSheets].some((s) => s.href && s.href.includes(href));
    if (exists) return resolve();
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    document.head.appendChild(link);
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const exists = [...document.scripts].some((s) => s.src && s.src.includes(src));
    if (exists) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.body.appendChild(script);
  });
}

async function ensureJQuery() {
  if (__ASMaps.loaded.jquery) return;
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js");
  __ASMaps.loaded.jquery = true;
}

async function ensureLeaflet() {
  if (__ASMaps.loaded.leaflet) return;
  await loadCSS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
  await loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");
  __ASMaps.loaded.leaflet = true;
}

async function ensureMapael() {
  if (__ASMaps.loaded.mapael) return;
  await ensureJQuery();
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jquery-mapael@2.2.0/js/jquery.mapael.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jquery-mapael@2.2.0/js/maps/world_countries.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jquery-mapael@2.2.0/js/maps/usa_states.min.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jquery-mapael@2.2.0/js/maps/france_departments.min.js");
  __ASMaps.loaded.mapael = true;
}

async function ensureJVectorMap() {
  if (__ASMaps.loaded.jvectormap) return;
  await ensureJQuery();
  await loadCSS("https://cdn.jsdelivr.net/npm/jvectormap@2.0.5/jquery-jvectormap.css");
  await loadScript("https://cdn.jsdelivr.net/npm/jvectormap@2.0.5/jquery-jvectormap.min.js");

  // maps packs (matching your maps.html set)
  await loadScript("https://cdn.jsdelivr.net/npm/jvectormap-content@1.0.1/world-mill.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jvectormap-content@1.0.1/asia-mill.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jvectormap-content@1.0.1/au-mill.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jvectormap-content@1.0.1/ca-lcc.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jvectormap-content@1.0.1/de-mill.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jvectormap-content@1.0.1/europe-mill.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jvectormap-content@1.0.1/in-mill.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jvectormap-content@1.0.1/uk-mill-en.js");
  await loadScript("https://cdn.jsdelivr.net/npm/jvectormap-content@1.0.1/us-aea-en.js");

  __ASMaps.loaded.jvectormap = true;
}

/* ---------------------------
   INIT: Leaflet
---------------------------- */
function initLeaflet() {
  if (!window.L) return;

  const el1 = document.getElementById("ASLeaflet1");
  const el2 = document.getElementById("ASLeaflet2");
  const el3 = document.getElementById("ASLeaflet3");

  const tile = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attr = "&copy; OpenStreetMap contributors";

  if (el1 && !el1.__map) {
    const m = L.map(el1).setView([51.505, -0.09], 12);
    L.tileLayer(tile, { attribution: attr }).addTo(m);
    el1.__map = m;
  }

  if (el2 && !el2.__map) {
    const m = L.map(el2).setView([51.505, -0.09], 12);
    L.tileLayer(tile, { attribution: attr }).addTo(m);
    L.marker([51.5, -0.09]).addTo(m).bindPopup("<b>A pretty CSS3 popup</b><br/>Easily customizable.").openPopup();
    el2.__map = m;
  }

  if (el3 && !el3.__map) {
    const m = L.map(el3).setView([51.508, -0.11], 13);
    L.tileLayer(tile, { attribution: attr }).addTo(m);

    const circle = L.circle([51.508, -0.11], {
      radius: 500,
    }).addTo(m);

    circle.bindPopup("I am a circle.");
    el3.__map = m;
  }
}

/* ---------------------------
   INIT: Mapael (3 maps)
---------------------------- */
function initMapael() {
  if (!window.jQuery || !jQuery.fn.mapael) return;

  const fill = cssVar("--ASPrimary", "#2b7fff");
  const stroke = cssVar("--ASBorder", "#d9d9d9");
  const text = cssVar("--ASText", "#222");

  const $links = jQuery("#ASMapaelLinks");
  const $static = jQuery("#ASMapaelStatic");
  const $legend = jQuery("#ASMapaelLegend");

  if ($links.length && !$links.data("__inited")) {
    $links.data("__inited", true);
    $links.mapael({
      map: { name: "world_countries", defaultArea: { attrs: { fill: "#eef2f6", stroke } } },
      plots: {
        "paris": { latitude: 48.8566, longitude: 2.3522, text: { content: "Paris", attrs: { fill: text } } },
        "newyork": { latitude: 40.7128, longitude: -74.0060, text: { content: "New York", attrs: { fill: text } } },
        "tokyo": { latitude: 35.6762, longitude: 139.6503, text: { content: "Tokyo", attrs: { fill: text } } },
      },
      links: {
        "l1": { factor: 0.5, between: ["paris", "newyork"], attrs: { stroke: fill, "stroke-width": 2 } },
        "l2": { factor: 0.5, between: ["newyork", "tokyo"], attrs: { stroke: fill, "stroke-width": 2 } },
      },
    });
  }

  if ($static.length && !$static.data("__inited")) {
    $static.data("__inited", true);
    $static.mapael({
      map: { name: "usa_states", defaultArea: { attrs: { fill: "#eef2f6", stroke } } },
      areas: {
        "CA": { attrs: { fill } },
        "TX": { attrs: { fill: "#9fbfff" } },
      },
    });
  }

  if ($legend.length && !$legend.data("__inited")) {
    $legend.data("__inited", true);
    $legend.mapael({
      map: { name: "world_countries", defaultArea: { attrs: { fill: "#eef2f6", stroke } } },
      legend: {
        area: {
          title: "Areas",
          slices: [
            { max: 5, attrs: { fill: "#dbe7ff" }, label: "Low" },
            { min: 6, max: 15, attrs: { fill: "#9fbfff" }, label: "Medium" },
            { min: 16, attrs: { fill }, label: "High" },
          ],
        },
      },
      
      areas: {
        "SA": { value: 18 },
        "US": { value: 12 },
        "FR": { value: 6 },
      },
    });
  }
    // ----------------------------
  // City Data (Interactive)
  // ----------------------------
  const $cityData = jQuery("#ASMapaelCityData");
  if ($cityData.length && !$cityData.data("__inited")) {
    $cityData.data("__inited", true);

    // بيانات (تقدرين تغيرينها لاحقاً)
    const cityDB = {
  riyadh:   { name: "Riyadh",   ar: "الرياض",   pop: 7700000, growth: "+2.1%", note: "Capital region" },
  jeddah:   { name: "Jeddah",   ar: "جدة",      pop: 4500000, growth: "+1.6%", note: "Coastal hub" },
  makkah:   { name: "Makkah",   ar: "مكة",      pop: 2100000, growth: "+1.2%", note: "Holy city" },
  madinah:  { name: "Madinah",  ar: "المدينة",  pop: 1500000, growth: "+1.1%", note: "Holy city" },
  dammam:   { name: "Dammam",   ar: "الدمام",   pop: 1250000, growth: "+1.0%", note: "Eastern region" },
  khobar:   { name: "Khobar",   ar: "الخبر",    pop:  600000, growth: "+0.9%", note: "Eastern" },
  dhahran:  { name: "Dhahran",  ar: "الظهران",  pop:  200000, growth: "+0.8%", note: "Eastern" },
  taif:     { name: "Taif",     ar: "الطائف",   pop:  700000, growth: "+0.8%", note: "Makkah region" },
  tabuk:    { name: "Tabuk",    ar: "تبوك",     pop:  600000, growth: "+0.9%", note: "Northwest" },
  hail:     { name: "Hail",     ar: "حائل",     pop:  450000, growth: "+0.7%", note: "North" },
  abha:     { name: "Abha",     ar: "أبها",     pop:  400000, growth: "+0.9%", note: "Aseer region" },
  khamis:   { name: "Khamis",   ar: "خميس مشيط", pop: 600000, growth: "+0.9%", note: "Aseer region" },
  jizan:    { name: "Jizan",    ar: "جيزان",    pop:  350000, growth: "+0.8%", note: "South" },
  najran:   { name: "Najran",   ar: "نجران",    pop:  350000, growth: "+0.8%", note: "South" },
  buraydah: { name: "Buraydah", ar: "بريدة",    pop:  650000, growth: "+0.8%", note: "Qassim" },
  sakaka:   { name: "Sakaka",   ar: "سكاكا",    pop:  250000, growth: "+0.7%", note: "Al Jouf" },
  yanbu:    { name: "Yanbu",    ar: "ينبع",     pop:  300000, growth: "+0.7%", note: "Medina region" },
  jubail:   { name: "Jubail",   ar: "الجبيل",   pop:  450000, growth: "+0.9%", note: "Industrial city" },
  arar:     { name: "Arar",     ar: "عرعر",     pop:  200000, growth: "+0.6%", note: "Northern borders" },
  bafq:     { name: "Al Bahah", ar: "الباحة",   pop:  200000, growth: "+0.6%", note: "Southwest" },
};


    // Helper: format population
    const fmt = (n) => n.toLocaleString("en-US");

    // Helper: set info panel
    function setInfo(key) {
  const box = document.getElementById("ASMapaelInfo");
  if (!box) return;

  const body = box.querySelector(".ASMapInfoBody");
  if (!body) return;

  if (!key || !cityDB[key]) {
    body.innerHTML = `<span class="u-muted">اضغطي على أي مدينة داخل الخريطة عشان يطلع لك البيانات هنا.</span>`;
    return;
  }

  const c = cityDB[key];
  body.innerHTML = `
    <div><strong>المدينة:</strong> ${c.name}</div>
    <div><strong>التعداد السكاني:</strong> ${fmt(c.pop)}</div>
    <div><strong>معدل النمو:</strong> ${c.growth}</div>
    <div><strong>ملاحظة:</strong> ${c.note}</div>
  `;
}

    // Build plots for mapael
    // (إحداثيات تقريبية، تقدرين تبدلينها لو عندك بيانات دقيقة)
    const plots = {
  riyadh:   { latitude: 24.7136, longitude: 46.6753 },
  jeddah:   { latitude: 21.4858, longitude: 39.1925 },
  makkah:   { latitude: 21.3891, longitude: 39.8579 },
  madinah:  { latitude: 24.4686, longitude: 39.6142 },
  dammam:   { latitude: 26.4207, longitude: 50.0888 },
  khobar:   { latitude: 26.2172, longitude: 50.1971 },
  dhahran:  { latitude: 26.2361, longitude: 50.0393 },
  taif:     { latitude: 21.2854, longitude: 40.4168 },
  tabuk:    { latitude: 28.3838, longitude: 36.5662 },
  hail:     { latitude: 27.5114, longitude: 41.7208 },
  abha:     { latitude: 18.2164, longitude: 42.5053 },
  khamis:   { latitude: 18.3000, longitude: 42.7333 },
  jizan:    { latitude: 16.8892, longitude: 42.5511 },
  najran:   { latitude: 17.5650, longitude: 44.2289 },
  buraydah: { latitude: 26.3592, longitude: 43.9818 },
  sakaka:   { latitude: 29.9697, longitude: 40.2064 },
  yanbu:    { latitude: 24.0889, longitude: 38.0637 },
  jubail:   { latitude: 27.0000, longitude: 49.6600 },
  arar:     { latitude: 30.9753, longitude: 41.0381 },
  bafq:     { latitude: 20.0129, longitude: 41.4677 },
};

    // Attach tooltip + click events to each plot
    Object.keys(plots).forEach((k) => {
      const c = cityDB[k];
      plots[k] = {
        ...plots[k],
        size: 10,
        attrs: { fill, stroke: "#fff", "stroke-width": 2 },
        attrsHover: { transform: "s1.12" },
        tooltip: { content: `<strong>${c.name}</strong><br/>Population: ${fmt(c.pop)}` },
        eventHandlers: {
          click: function () {
            setInfo(k);
          },
        },
      };
    });

    // Init mapael world
    $cityData.mapael({
      map: {
        name: "world_countries",
        defaultArea: {
          attrs: { fill: "#eef2f6", stroke },
          attrsHover: { fill: "#e7eefc" },
        },
      },
      plots,
      legend: {
        plot: {
          title: "Cities",
          slices: [
            { size: 10, attrs: { fill }, label: "City" },
          ],
        },
      },
    });

   // Toolbar interactions (Search)
const input = document.getElementById("ASMapaelCitySearch");
const resetBtn = document.getElementById("ASMapaelResetBtn");

// Simple suggestions datalist (auto)
let dl = document.getElementById("ASMapaelCitiesList");
if (!dl && input) {
  dl = document.createElement("datalist");
  dl.id = "ASMapaelCitiesList";
  document.body.appendChild(dl);
  input.setAttribute("list", dl.id);

  // fill suggestions
  dl.innerHTML = Object.keys(cityDB)
    .map((k) => `<option value="${cityDB[k].name}"></option>`)
    .join("");
}

// helper: find key by typed name (EN + AR)
function findCityKeyByName(name) {
  const v = (name || "").trim().toLowerCase();
  if (!v) return "";

  const keys = Object.keys(cityDB);

  // exact EN
  let k = keys.find((x) => (cityDB[x].name || "").toLowerCase() === v);
  if (k) return k;

  // exact AR
  k = keys.find((x) => (cityDB[x].ar || "").toLowerCase() === v);
  if (k) return k;

  // partial EN
  k = keys.find((x) => (cityDB[x].name || "").toLowerCase().includes(v));
  if (k) return k;

  // partial AR
  k = keys.find((x) => (cityDB[x].ar || "").toLowerCase().includes(v));
  return k || "";
}

if (input) {
  // on Enter -> show
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const key = findCityKeyByName(input.value);
    setInfo(key);
  });

  // on change (when user picks from suggestions)
  input.addEventListener("change", () => {
    const key = findCityKeyByName(input.value);
    setInfo(key);
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    if (input) input.value = "";
    setInfo("");
  });
}

    // default
    setInfo("");
  }
}

/* ---------------------------
   INIT: jVectorMap (9 maps)
---------------------------- */
function initVector() {
  if (!window.jQuery || !jQuery.fn.vectorMap) return;

  const fill = cssVar("--ASPrimary", "#2b7fff");
  const bg = cssVar("--ASCard", "#fff");

  function map(el, mapName) {
    if (!el || el.__inited) return;
    el.__inited = true;

    jQuery(el).vectorMap({
      map: mapName,
      backgroundColor: "transparent",
      regionStyle: {
        initial: {
          fill: "#eef2f6",
          "fill-opacity": 1,
          stroke: "#d9d9d9",
          "stroke-width": 1,
          "stroke-opacity": 1,
        },
        hover: { "fill-opacity": 0.85 },
      },
      markerStyle: {
        initial: { fill, stroke: "#fff", "stroke-width": 2, r: 6 },
      },
    });
  }

  // World with markers
  const w = document.getElementById("ASVWorld");
  if (w && !w.__inited) {
    w.__inited = true;
    jQuery(w).vectorMap({
      map: "world_mill",
      backgroundColor: "transparent",
      regionStyle: {
        initial: { fill: "#eef2f6", stroke: "#d9d9d9" },
        hover: { "fill-opacity": 0.85 },
      },
      markers: [
        { latLng: [24.7136, 46.6753], name: "Riyadh" },
        { latLng: [51.5074, -0.1278], name: "London" },
        { latLng: [35.6762, 139.6503], name: "Tokyo" },
      ],
      markerStyle: { initial: { fill, stroke: "#fff", "stroke-width": 2, r: 6 } },
    });
  }

  map(document.getElementById("ASVAsia"), "asia_mill");
  map(document.getElementById("ASVAus"), "au_mill");
  map(document.getElementById("ASVCanada"), "ca_lcc");
  map(document.getElementById("ASVGermany"), "de_mill");
  map(document.getElementById("ASVEurope"), "europe_mill");
  map(document.getElementById("ASVIndia"), "in_mill");
  map(document.getElementById("ASVUK"), "uk_mill_en");
  map(document.getElementById("ASVUSA"), "us_aea_en");
}

/* ---------------------------
   BOOT (watch ASContent)
---------------------------- */
async function bootMapsIfNeeded() {
  const host = document.getElementById("ASContent");
  if (!host) return;

  const page = host.querySelector('[data-page="ASMaps"]');
  if (!page) return;

  const type = page.getAttribute("data-maps");

  if (type === "leaflet") {
    await ensureLeaflet();
    initLeaflet();
  }

  if (type === "mapael") {
    await ensureMapael();
    initMapael();
  }

  if (type === "vector") {
    await ensureJVectorMap();
    initVector();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const host = document.getElementById("ASContent");
  if (!host) return;

  const obs = new MutationObserver(() => bootMapsIfNeeded());
  obs.observe(host, { childList: true, subtree: true });

  // first load
  bootMapsIfNeeded();
});
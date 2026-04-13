/**
 * File: charts.js
 * Purpose: Initialize AS Charts collection
 * Notes:
 * - Requires Chart.js to be loaded before this file
 * - Safe initialization for dynamically loaded partial views
 */


/* =================================================
   Public Init
================================================= */

function initASCharts() {
  if (typeof Chart === "undefined") {
    console.warn("Chart.js is not loaded.");
    return;
  }

  const chartsRoot = document.querySelector(".ASChartsGrid");
  if (!chartsRoot) return;

  const root = getComputedStyle(document.documentElement);

  const ASColors = {
    primary: getToken(root, "--ASPrimary", "#007b69"),
    secondary: getToken(root, "--ASSecondary", "#a37956"),
    accent: getToken(root, "--ASAccent", "#ec7f21"),
    success: getToken(root, "--ASSuccess", "#22c55e"),
    error: getToken(root, "--ASDanger", "#ef4444"),
    info: getToken(root, "--ASInfo", "#06b6d4"),
    alert: getToken(root, "--ASWarning", "#f59e0b"),
    text: getToken(root, "--ASText", "#1f2937"),
    muted: getToken(root, "--ASTextMuted", "#6b7280"),
    border: getToken(root, "--ASBorder", "#e5e7eb"),
    surface: getToken(root, "--ASSurface", "#ffffff")
  };

  Chart.defaults.font.family = "Tajawal, Cairo, sans-serif";
  Chart.defaults.color = ASColors.muted;
  Chart.defaults.borderColor = ASColors.border;
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.boxWidth = 10;
  Chart.defaults.plugins.legend.labels.boxHeight = 10;
  Chart.defaults.plugins.legend.position = "top";

  const commonScales = {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: ASColors.muted
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: ASColors.border,
        drawBorder: false
      },
      ticks: {
        color: ASColors.muted
      }
    }
  };

  initPieChart(ASColors);
  initDonutChart(ASColors);
  initBarChart(ASColors, commonScales);
  initGroupedBarChart(ASColors, commonScales);
  initHorizontalBarChart(ASColors);
  initHorizontalCompareChart(ASColors);
  initLineChart(ASColors, commonScales);
  initMultiLineChart(ASColors, commonScales);
  initAnalysisChart(ASColors, commonScales);
  initMiniAreaChart(ASColors);
  initMiniBarChart(ASColors);
  initMiniDonutChart(ASColors);
}

window.initASCharts = initASCharts;


/* =================================================
   Helpers
================================================= */

function getToken(root, token, fallback) {
  const value = root.getPropertyValue(token).trim();
  return value || fallback;
}

function getCanvas(id) {
  return document.getElementById(id);
}

function createChart(id, config) {
  const canvas = getCanvas(id);
  if (!canvas) return null;

  const existing = Chart.getChart(canvas);
  if (existing) {
    existing.destroy();
  }

  return new Chart(canvas, config);
}


/* =================================================
   Pie Chart
================================================= */

function initPieChart(colors) {
  createChart("asPieChart", {
    type: "pie",
    data: {
      labels: [
        "Direct",
        "Social Media",
        "Email",
        "Search",
        "Referral",
        "Ads"
      ],
      datasets: [
        {
          data: [32, 21, 14, 12, 11, 10],
          backgroundColor: [
            colors.info,
            "#f4c20d",
            "#84cc16",
            "#ef4444",
            "#d946ef",
            "#1d4ed8"
          ],
          borderColor: colors.surface,
          borderWidth: 3,
          hoverOffset: 10
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          position: "right"
        }
      }
    }
  });
}


/* =================================================
   Donut Chart
================================================= */

function initDonutChart(colors) {
  createChart("asDonutChart", {
    type: "doughnut",
    data: {
      labels: [
        "Urban Services",
        "Infrastructure",
        "Public Health",
        "Other Services"
      ],
      datasets: [
        {
          data: [35, 22, 18, 25],
          backgroundColor: [
            colors.primary,
            colors.secondary,
            colors.accent,
            colors.info
          ],
          borderColor: colors.surface,
          borderWidth: 4,
          hoverOffset: 8
        }
      ]
    },
    options: {
      cutout: "62%",
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}


/* =================================================
   Vertical Bar Chart
================================================= */

function initBarChart(colors, commonScales) {
  createChart("asBarChart", {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Performance",
          data: [18, 24, 30, 26, 35, 41],
          backgroundColor: colors.primary,
          borderRadius: 10,
          maxBarThickness: 42
        }
      ]
    },
    options: {
      scales: commonScales
    }
  });
}


/* =================================================
   Grouped Bar Chart
================================================= */

function initGroupedBarChart(colors, commonScales) {
  createChart("asGroupedBarChart", {
    type: "bar",
    data: {
      labels: ["Q1", "Q2", "Q3", "Q4"],
      datasets: [
        {
          label: "2024",
          data: [42, 58, 71, 84],
          backgroundColor: colors.primary,
          borderRadius: 10,
          maxBarThickness: 34
        },
        {
          label: "2025",
          data: [47, 63, 69, 90],
          backgroundColor: colors.info,
          borderRadius: 10,
          maxBarThickness: 34
        }
      ]
    },
    options: {
      scales: commonScales
    }
  });
}


/* =================================================
   Horizontal Bar Chart
================================================= */

function initHorizontalBarChart(colors) {
  createChart("asHorizontalBarChart", {
    type: "bar",
    data: {
      labels: [
        "Inspection",
        "Licensing",
        "Cleaning",
        "Road Services",
        "Planning"
      ],
      datasets: [
        {
          label: "Requests",
          data: [92, 84, 73, 61, 48],
          backgroundColor: colors.secondary,
          borderRadius: 10,
          maxBarThickness: 26
        }
      ]
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: colors.border,
            drawBorder: false
          },
          ticks: {
            color: colors.muted
          }
        },
        y: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: colors.muted
          }
        }
      }
    }
  });
}


/* =================================================
   Horizontal Compare Chart
================================================= */

function initHorizontalCompareChart(colors) {
  createChart("asHorizontalCompareChart", {
    type: "bar",
    data: {
      labels: ["Dept A", "Dept B", "Dept C", "Dept D", "Dept E"],
      datasets: [
        {
          label: "Last Month",
          data: [58, 72, 91, 66, 43],
          backgroundColor: colors.info,
          borderRadius: 10,
          maxBarThickness: 18
        },
        {
          label: "This Month",
          data: [64, 78, 84, 74, 49],
          backgroundColor: "#312e81",
          borderRadius: 10,
          maxBarThickness: 18
        }
      ]
    },
    options: {
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: colors.border,
            drawBorder: false
          },
          ticks: {
            color: colors.muted
          }
        },
        y: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: colors.muted
          }
        }
      }
    }
  });
}


/* =================================================
   Line Chart
================================================= */

function initLineChart(colors, commonScales) {
  createChart("asLineChart", {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Growth",
          data: [12, 18, 14, 25, 22, 31, 36],
          borderColor: colors.primary,
          backgroundColor: hexToRgba(colors.primary, 0.12),
          tension: 0.35,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: colors.primary
        }
      ]
    },
    options: {
      scales: commonScales
    }
  });
}


/* =================================================
   Multi Line Chart
================================================= */

function initMultiLineChart(colors, commonScales) {
  createChart("asMultiLineChart", {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          label: "Operations",
          data: [16, 24, 22, 28, 33, 31, 39],
          borderColor: colors.primary,
          backgroundColor: hexToRgba(colors.primary, 0.08),
          tension: 0.35,
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: colors.primary
        },
        {
          label: "Services",
          data: [11, 18, 20, 24, 27, 35, 37],
          borderColor: colors.accent,
          backgroundColor: hexToRgba(colors.accent, 0.08),
          tension: 0.35,
          fill: false,
          pointRadius: 4,
          pointBackgroundColor: colors.accent
        }
      ]
    },
    options: {
      scales: commonScales
    }
  });
}


/* =================================================
   Analysis Chart
================================================= */

function initAnalysisChart(colors, commonScales) {
  createChart("asAnalysisChart", {
    type: "bar",
    data: {
      labels: [
        "Inspection",
        "Cleaning",
        "Roads",
        "Permits",
        "Land",
        "Parks"
      ],
      datasets: [
        {
          label: "Completed",
          data: [88, 76, 69, 91, 58, 73],
          backgroundColor: colors.primary,
          borderRadius: 10,
          maxBarThickness: 30
        },
        {
          label: "Pending",
          data: [22, 18, 25, 11, 29, 16],
          backgroundColor: colors.accent,
          borderRadius: 10,
          maxBarThickness: 30
        }
      ]
    },
    options: {
      scales: commonScales
    }
  });
}


/* =================================================
   Mini Area Chart
================================================= */

function initMiniAreaChart(colors) {
  createChart("asMiniAreaChart", {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          data: [12, 18, 15, 22, 19, 27, 24],
          borderColor: colors.primary,
          backgroundColor: hexToRgba(colors.primary, 0.18),
          fill: true,
          tension: 0.4,
          pointRadius: 0
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          grid: {
            display: false
          }
        }
      }
    }
  });
}


/* =================================================
   Mini Bar Chart
================================================= */

function initMiniBarChart(colors) {
  createChart("asMiniBarChart", {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          data: [8, 14, 10, 16, 13, 18],
          backgroundColor: colors.secondary,
          borderRadius: 8,
          maxBarThickness: 20
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          display: false,
          grid: {
            display: false
          }
        },
        y: {
          display: false,
          grid: {
            display: false
          }
        }
      }
    }
  });
}


/* =================================================
   Mini Donut Chart
================================================= */

function initMiniDonutChart(colors) {
  createChart("asMiniDonutChart", {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [
        {
          data: [72, 28],
          backgroundColor: [colors.primary, colors.border],
          borderColor: colors.surface,
          borderWidth: 3
        }
      ]
    },
    options: {
      cutout: "68%",
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}


/* =================================================
   Utility
================================================= */

function hexToRgba(hex, alpha) {
  if (!hex || typeof hex !== "string") {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  let value = hex.replace("#", "").trim();

  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (value.length !== 6) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const r = parseInt(value.substring(0, 2), 16);
  const g = parseInt(value.substring(2, 4), 16);
  const b = parseInt(value.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
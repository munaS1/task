/**
 * File: tables.js
 * Purpose: Minimal helpers for tables (sorting/paging later)
 */
export const readTableJson = async (url) => {
    const res = await fetch(url);
    return res.ok ? res.json() : [];
  };

  /* =====================================
   AS TABLE SEARCH
===================================== */

document.addEventListener("input", function (e) {
  if (!e.target.classList.contains("ASTableSearch")) return;

  const input = e.target;
  const table = document.getElementById("searchTable");
  if (!table) return;

  const rows = table.querySelectorAll("tbody tr");
  const value = input.value.toLowerCase();

  rows.forEach(row => {
    const text = row.innerText.toLowerCase();
    row.style.display = text.includes(value) ? "" : "none";
  });
});
/* =====================================
   AS EDITOR TABLE
===================================== */

const ASTABLE_STATUS_OPTIONS = ["Active", "Pending", "Inactive"];

function getStatusClass(value) {
  const v = (value || "").toLowerCase();

  if (v === "active") return "is-success";
  if (v === "pending") return "is-warning";
  return "is-error";
}

function makeStatusBadge(value) {
  const safeValue = value || "Inactive";
  return `<span class="ASTableStatus ${getStatusClass(safeValue)}">${safeValue}</span>`;
}

function setRowEditingState(row, isEditing) {
  row.classList.toggle("is-editing", isEditing);

  const editBtn = row.querySelector('[data-action="edit"]');
  const saveBtn = row.querySelector('[data-action="save"]');
  const cancelBtn = row.querySelector('[data-action="cancel"]');
  const deleteBtn = row.querySelector('[data-action="delete"]');

  if (editBtn) editBtn.hidden = isEditing;
  if (saveBtn) saveBtn.hidden = !isEditing;
  if (cancelBtn) cancelBtn.hidden = !isEditing;
  if (deleteBtn) deleteBtn.hidden = isEditing;
}

function backupRowValues(row) {
  row.dataset.originalName = row.querySelector('[data-col="name"]')?.textContent.trim() || "";
  row.dataset.originalDepartment = row.querySelector('[data-col="department"]')?.textContent.trim() || "";
  row.dataset.originalStatus = row.querySelector('[data-col="status"] .ASTableStatus')?.textContent.trim() || "Inactive";
}

function restoreRowValues(row) {
  const nameCell = row.querySelector('[data-col="name"]');
  const departmentCell = row.querySelector('[data-col="department"]');
  const statusCell = row.querySelector('[data-col="status"]');

  if (nameCell) nameCell.textContent = row.dataset.originalName || "";
  if (departmentCell) departmentCell.textContent = row.dataset.originalDepartment || "";
  if (statusCell) statusCell.innerHTML = makeStatusBadge(row.dataset.originalStatus || "Inactive");
}

function convertRowToInputs(row) {
  const nameCell = row.querySelector('[data-col="name"]');
  const departmentCell = row.querySelector('[data-col="department"]');
  const statusCell = row.querySelector('[data-col="status"]');

  const currentName = nameCell?.textContent.trim() || "";
  const currentDepartment = departmentCell?.textContent.trim() || "";
  const currentStatus = statusCell?.querySelector(".ASTableStatus")?.textContent.trim() || "Inactive";

  if (nameCell) {
    nameCell.innerHTML = `<input class="ASEditInput" type="text" value="${currentName}">`;
  }

  if (departmentCell) {
    departmentCell.innerHTML = `<input class="ASEditInput" type="text" value="${currentDepartment}">`;
  }

  if (statusCell) {
    statusCell.innerHTML = `
      <select class="ASEditSelect">
        ${ASTABLE_STATUS_OPTIONS.map(
          (option) => `<option value="${option}" ${option === currentStatus ? "selected" : ""}>${option}</option>`
        ).join("")}
      </select>
    `;
  }
}

function saveRowValues(row) {
  const nameCell = row.querySelector('[data-col="name"]');
  const departmentCell = row.querySelector('[data-col="department"]');
  const statusCell = row.querySelector('[data-col="status"]');

  const nameValue = nameCell?.querySelector("input")?.value.trim() || "";
  const departmentValue = departmentCell?.querySelector("input")?.value.trim() || "";
  const statusValue = statusCell?.querySelector("select")?.value || "Inactive";

  if (nameCell) nameCell.textContent = nameValue || "—";
  if (departmentCell) departmentCell.textContent = departmentValue || "—";
  if (statusCell) statusCell.innerHTML = makeStatusBadge(statusValue);
}

function startEditRow(row) {
  backupRowValues(row);
  convertRowToInputs(row);
  setRowEditingState(row, true);
}

function cancelEditRow(row) {
  restoreRowValues(row);
  setRowEditingState(row, false);
}

function saveEditRow(row) {
  saveRowValues(row);
  setRowEditingState(row, false);
}

function createNewEditableRow(nextId) {
  const row = document.createElement("tr");

  row.innerHTML = `
    <td data-col="id">${nextId}</td>
    <td data-col="name">New Employee</td>
    <td data-col="department">Department</td>
    <td data-col="status">${makeStatusBadge("Pending")}</td>
    <td class="ASTableActions">
      <div class="ASTableActionGroup">
        <button class="ASBtn ASBtnLight--primary" type="button" data-action="edit">Edit</button>
        <button class="ASBtn ASBtnLight--success" type="button" data-action="save" hidden>Save</button>
        <button class="ASBtn ASBtnLight--grey" type="button" data-action="cancel" hidden>Cancel</button>
        <button class="ASBtn ASBtnLight--Error" type="button" data-action="delete">Delete</button>
      </div>
    </td>
  `;

  return row;
}

function getNextTableId(table) {
  const ids = [...table.querySelectorAll('tbody tr [data-col="id"]')]
    .map((cell) => Number(cell.textContent.trim()))
    .filter((value) => Number.isFinite(value));

  return ids.length ? Math.max(...ids) + 1 : 1;
}

document.addEventListener("click", function (e) {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;

  const row = btn.closest("tr");
  if (!row) return;

  const action = btn.getAttribute("data-action");

  if (action === "edit") {
    startEditRow(row);
  }

  if (action === "cancel") {
    cancelEditRow(row);
  }

  if (action === "save") {
    saveEditRow(row);
  }

  if (action === "delete") {
    row.remove();
  }
});

document.addEventListener("click", function (e) {
  const addBtn = e.target.closest("[data-as-table-add]");
  if (!addBtn) return;

  const table = document.getElementById("ASEditTable");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  if (!tbody) return;

  const nextId = getNextTableId(table);
  const newRow = createNewEditableRow(nextId);

  tbody.appendChild(newRow);
  startEditRow(newRow);
});
/* =====================================
   AS EXTENSION TABLES
===================================== */

function getExtTable() {
  return document.getElementById("ASExtTable");
}

function getVisibleExtRows() {
  const table = getExtTable();
  if (!table) return [];

  return [...table.querySelectorAll(".ASExtRow")].filter((row) => row.style.display !== "none");
}

function updateExtBulkBar() {
  const table = getExtTable();
  const bulkBar = document.getElementById("ASExtBulkBar");
  const selectedCount = document.getElementById("ASExtSelectedCount");

  if (!table || !bulkBar || !selectedCount) return;

  const checked = table.querySelectorAll(".ASExtRowCheck:checked");
  selectedCount.textContent = checked.length;
  bulkBar.hidden = checked.length === 0;
}

function syncExtRowSelectedState() {
  const table = getExtTable();
  if (!table) return;

  const rows = table.querySelectorAll(".ASExtRow");
  rows.forEach((row) => {
    const check = row.querySelector(".ASExtRowCheck");
    row.classList.toggle("is-selected", !!check?.checked);
  });
}

function syncExtSelectAllState() {
  const selectAll = document.getElementById("ASExtSelectAll");
  if (!selectAll) return;

  const visibleRows = getVisibleExtRows();
  const visibleChecks = visibleRows
    .map((row) => row.querySelector(".ASExtRowCheck"))
    .filter(Boolean);

  if (!visibleChecks.length) {
    selectAll.checked = false;
    selectAll.indeterminate = false;
    return;
  }

  const checkedCount = visibleChecks.filter((check) => check.checked).length;

  selectAll.checked = checkedCount === visibleChecks.length;
  selectAll.indeterminate = checkedCount > 0 && checkedCount < visibleChecks.length;
}

function applyExtFilters() {
  const table = getExtTable();
  const searchInput = document.getElementById("ASExtTableSearch");
  const statusFilter = document.getElementById("ASExtStatusFilter");

  if (!table || !searchInput || !statusFilter) return;

  const rows = [...table.querySelectorAll(".ASExtRow")];
  const searchValue = searchInput.value.trim().toLowerCase();
  const statusValue = statusFilter.value.trim().toLowerCase();

  rows.forEach((row) => {
    const detailRow = row.nextElementSibling;
    const name = (row.dataset.name || "").toLowerCase();
    const department = (row.dataset.department || "").toLowerCase();
    const status = (row.dataset.status || "").toLowerCase();

    const matchesSearch =
      !searchValue ||
      name.includes(searchValue) ||
      department.includes(searchValue);

    const matchesStatus =
      !statusValue ||
      status === statusValue;

    const show = matchesSearch && matchesStatus;

    row.style.display = show ? "" : "none";

    if (detailRow?.classList.contains("ASExtDetailRow")) {
      detailRow.style.display = "none";
      detailRow.hidden = true;
    }

    const check = row.querySelector(".ASExtRowCheck");
    if (!show && check) check.checked = false;
  });

  syncExtRowSelectedState();
  updateExtBulkBar();
  syncExtSelectAllState();
}

function compareValues(a, b, type = "text") {
  if (type === "number") {
    return Number(a) - Number(b);
  }

  if (type === "date") {
    return new Date(a).getTime() - new Date(b).getTime();
  }

  return String(a).localeCompare(String(b));
}

function sortExtTableRows(key, direction = "asc") {
  const table = getExtTable();
  if (!table) return;

  const tbody = table.querySelector("tbody");
  if (!tbody) return;

  const rowPairs = [];
  const rows = [...tbody.querySelectorAll(".ASExtRow")];

  rows.forEach((row) => {
    const detailRow = row.nextElementSibling?.classList.contains("ASExtDetailRow")
      ? row.nextElementSibling
      : null;

    rowPairs.push({ row, detailRow });
  });

  const type =
    key === "id" ? "number" :
    key === "joined" ? "date" :
    "text";

  rowPairs.sort((first, second) => {
    const a = first.row.dataset[key] || "";
    const b = second.row.dataset[key] || "";
    const result = compareValues(a, b, type);
    return direction === "asc" ? result : -result;
  });

  rowPairs.forEach(({ row, detailRow }) => {
    tbody.appendChild(row);
    if (detailRow) tbody.appendChild(detailRow);
  });
}

function updateSortButtons(activeKey, direction) {
  const buttons = document.querySelectorAll(".ASSortButton");

  buttons.forEach((button) => {
    button.classList.remove("is-active");
    const icon = button.querySelector(".ASSortIcon");
    if (icon) icon.textContent = "↕";
  });

  const activeButton = document.querySelector(`.ASSortButton[data-sort="${activeKey}"]`);
  if (!activeButton) return;

  activeButton.classList.add("is-active");
  const activeIcon = activeButton.querySelector(".ASSortIcon");
  if (activeIcon) {
    activeIcon.textContent = direction === "asc" ? "↑" : "↓";
  }
}

const extSortState = {
  key: "",
  direction: "asc",
};

document.addEventListener("input", function (e) {
  if (e.target.id === "ASExtTableSearch") {
    applyExtFilters();
  }
});

document.addEventListener("change", function (e) {
  if (e.target.id === "ASExtStatusFilter") {
    applyExtFilters();
  }

  if (e.target.id === "ASExtSelectAll") {
    const visibleRows = getVisibleExtRows();
    visibleRows.forEach((row) => {
      const check = row.querySelector(".ASExtRowCheck");
      if (check) check.checked = e.target.checked;
    });

    syncExtRowSelectedState();
    updateExtBulkBar();
    syncExtSelectAllState();
  }

  if (e.target.classList.contains("ASExtRowCheck")) {
    syncExtRowSelectedState();
    updateExtBulkBar();
    syncExtSelectAllState();
  }
});

document.addEventListener("click", function (e) {
  const expandBtn = e.target.closest("[data-expand-row]");
  if (expandBtn) {
    const row = expandBtn.closest(".ASExtRow");
    const detailRow = row?.nextElementSibling;

    if (!row || !detailRow?.classList.contains("ASExtDetailRow")) return;

    const isHidden = detailRow.hidden;
    detailRow.hidden = !isHidden;
    detailRow.style.display = isHidden ? "table-row" : "none";
  }

  const sortBtn = e.target.closest(".ASSortButton");
  if (sortBtn) {
    const key = sortBtn.getAttribute("data-sort");
    if (!key) return;

    if (extSortState.key === key) {
      extSortState.direction = extSortState.direction === "asc" ? "desc" : "asc";
    } else {
      extSortState.key = key;
      extSortState.direction = "asc";
    }

    sortExtTableRows(extSortState.key, extSortState.direction);
    updateSortButtons(extSortState.key, extSortState.direction);
    applyExtFilters();
  }

  if (e.target.id === "ASExtMarkActive") {
    const table = getExtTable();
    if (!table) return;

    const checkedRows = [...table.querySelectorAll(".ASExtRowCheck:checked")]
      .map((check) => check.closest(".ASExtRow"))
      .filter(Boolean);

    checkedRows.forEach((row) => {
      row.dataset.status = "Active";
      const statusCell = row.children[4];
      if (statusCell) {
        statusCell.innerHTML = `<span class="ASTableStatus is-success">Active</span>`;
      }
    });

    applyExtFilters();
    updateExtBulkBar();
    syncExtSelectAllState();
  }

  if (e.target.id === "ASExtDeleteSelected") {
    const table = getExtTable();
    if (!table) return;

    const checkedRows = [...table.querySelectorAll(".ASExtRowCheck:checked")]
      .map((check) => check.closest(".ASExtRow"))
      .filter(Boolean);

    checkedRows.forEach((row) => {
      const detailRow = row.nextElementSibling?.classList.contains("ASExtDetailRow")
        ? row.nextElementSibling
        : null;

      if (detailRow) detailRow.remove();
      row.remove();
    });

    updateExtBulkBar();
    syncExtSelectAllState();
  }
});
  
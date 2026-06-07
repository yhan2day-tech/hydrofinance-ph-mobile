import {
  APP_NAME,
  APP_VERSION,
  COLLECTION_STATUSES,
  LEDGER_TYPES,
  PAID_CHOICES,
  PRODUCTION_FLAGS,
  buildWorkbookSheets,
  calculateSummary,
  createDefaultState,
  cycleCosting,
  deepClone,
  enrichAssets,
  enrichElectricity,
  enrichExpenses,
  enrichFinancing,
  enrichLabor,
  enrichPurchases,
  enrichSales,
  enrichUsages,
  formatMoney,
  formatNumber,
  inventorySummary,
  makeId,
  mergeState,
  readableMonth,
  salesByProduct,
  toCsv,
  toNumber,
  toSpreadsheetXml,
  uniquePeriods
} from "./core.js";
import { clearState, loadState, saveState } from "./storage.js";
import { WORKBOOK_COPY, WORKBOOK_SOURCE } from "./workbook-copy.js";

const navEl = document.querySelector("#nav");
const appEl = document.querySelector("#app");
const statusEl = document.querySelector("#status");
const installButton = document.querySelector("#installButton");

let state = createDefaultState();
let currentView = "dashboard";
let currentPeriod = "all";
let currentWorkbookSheet = WORKBOOK_COPY[0]?.name || "Dashboard";
let editing = null;
let deferredInstallPrompt = null;

const views = [
  { id: "dashboard", label: "Dashboard" },
  { id: "setup", label: "Setup & Assumptions" },
  { id: "sales", label: "Sales Register" },
  { id: "electricity", label: "Electricity" },
  { id: "tanks", label: "Tank & Top-up Log" },
  { id: "nutrient-purchases", label: "Nutrient Purchases" },
  { id: "nutrient-usage", label: "Nutrient Mixing Usage" },
  { id: "supply-purchases", label: "Seed & Supply Purchases" },
  { id: "supply-usage", label: "Seed & Supply Usage" },
  { id: "chemical-purchases", label: "Chemical Purchases" },
  { id: "chemical-usage", label: "Chemical Usage" },
  { id: "labor", label: "Labor" },
  { id: "assets", label: "Assets" },
  { id: "financing", label: "Financing & Equity" },
  { id: "expenses", label: "Other Expenses" },
  { id: "inventory-summary", label: "Inventory Summary", sheetName: "Inventory Summary" },
  { id: "income-statement", label: "Income Statement", sheetName: "Income Statement" },
  { id: "balance-sheet", label: "Balance Sheet", sheetName: "Balance Sheet" },
  { id: "cash-flow", label: "Cash Flow", sheetName: "Cash Flow" },
  { id: "pricing-margin", label: "Pricing & Margin", sheetName: "Pricing & Margin" },
  { id: "cycles", label: "Crop Cycle Costing" },
  { id: "model-checks", label: "Model Checks", sheetName: "Model Checks" },
  { id: "sources-guide", label: "Sources & Guide", sheetName: "Sources & Guide" },
  { id: "sync", label: "Sync & Export" }
];

const setupFields = [
  { name: "businessName", label: "Business name", type: "text", required: true },
  { name: "owner", label: "Owner", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "fiscalYear", label: "Fiscal year", type: "number", step: "1", required: true },
  { name: "currency", label: "Currency", type: "text", required: true },
  { name: "defaultSellingUnit", label: "Selling unit", type: "text" },
  { name: "defaultPricePack", label: "Default price/pack", type: "number", step: "0.01" },
  { name: "defaultLettucesPerPack", label: "Default heads/pack", type: "number", step: "0.01" },
  { name: "targetGrossMargin", label: "Target gross margin", type: "number", step: "0.01" },
  { name: "incomeTaxRate", label: "Income tax rate", type: "number", step: "0.01" },
  { name: "beginningCash", label: "Beginning cash", type: "number", step: "0.01" },
  { name: "defaultLaborRate", label: "Default labor rate/hour", type: "number", step: "0.01" },
  { name: "defaultElectricityRate", label: "Default electricity rate/kWh", type: "number", step: "0.01" }
];

const collectionDefs = {
  sales: {
    collection: "sales",
    title: "Sales Register",
    formTitle: "Sale",
    prefix: "sale",
    defaults: () => ({
      date: todayIso(),
      crop: "Lettuce",
      batch: "",
      packsSold: "",
      lettucesPerPack: state.assumptions.defaultLettucesPerPack,
      pricePack: state.assumptions.defaultPricePack,
      discountReturns: 0,
      collectionStatus: "Collected",
      remarks: ""
    }),
    fields: [
      { name: "date", label: "Date", type: "date", required: true },
      { name: "crop", label: "Crop/Product", type: "text", required: true },
      { name: "batch", label: "Batch/Cycle", type: "text" },
      { name: "packsSold", label: "Packs sold", type: "number", step: "0.0001", required: true },
      { name: "lettucesPerPack", label: "Lettuces/pack", type: "number", step: "0.01" },
      { name: "pricePack", label: "Price/pack", type: "number", step: "0.01", required: true },
      { name: "discountReturns", label: "Discount/returns", type: "number", step: "0.01" },
      { name: "collectionStatus", label: "Collection status", type: "select", options: COLLECTION_STATUSES },
      { name: "remarks", label: "Remarks", type: "textarea" }
    ],
    rows: () => enrichSales(state, currentPeriod),
    titleFor: (row) => `${row.crop || "Sale"} ${row.batch ? `- ${row.batch}` : ""}`,
    columns: [
      ["Date", (row) => row.date],
      ["Packs", (row) => formatNumber(row.packsSold, 4)],
      ["Price", (row) => money(row.pricePack)],
      ["Net sales", (row) => money(row.netSales)],
      ["Status", (row) => row.collectionStatus || ""]
    ]
  },
  purchases: {
    collection: "purchases",
    title: "Purchases",
    formTitle: "Purchase",
    prefix: "purchase",
    defaults: () => ({
      ledger: "nutrient",
      date: todayIso(),
      item: "",
      category: "",
      form: "",
      unit: "",
      qty: "",
      totalCost: "",
      supplier: "",
      paid: "Yes",
      remarks: ""
    }),
    fields: [
      { name: "ledger", label: "Ledger", type: "select", options: LEDGER_TYPES },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "item", label: "Item", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "form", label: "Form/Unit", type: "text" },
      { name: "unit", label: "Unit", type: "text" },
      { name: "qty", label: "Qty bought", type: "number", step: "0.0001", required: true },
      { name: "totalCost", label: "Total cost", type: "number", step: "0.01", required: true },
      { name: "supplier", label: "Supplier", type: "text" },
      { name: "paid", label: "Paid?", type: "select", options: PAID_CHOICES },
      { name: "remarks", label: "Remarks", type: "textarea" }
    ],
    rows: () => enrichPurchases(state, currentPeriod),
    titleFor: (row) => `${ledgerLabel(row.ledger)} - ${row.item || "Purchase"}`,
    columns: [
      ["Date", (row) => row.date],
      ["Qty", (row) => formatNumber(row.qty, 4)],
      ["Cost", (row) => money(row.totalCost)],
      ["Avg", (row) => money(row.costPerUnit)],
      ["Paid", (row) => row.paid || ""]
    ]
  },
  usages: {
    collection: "usages",
    title: "Usage",
    formTitle: "Usage",
    prefix: "usage",
    defaults: () => ({
      ledger: "nutrient",
      date: todayIso(),
      batch: "",
      tankRef: "",
      eventType: "",
      item: "",
      category: "",
      unitUsed: "",
      qtyUsed: "",
      purpose: "",
      remarks: ""
    }),
    fields: [
      { name: "ledger", label: "Ledger", type: "select", options: LEDGER_TYPES },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "batch", label: "Batch/Cycle", type: "text" },
      { name: "tankRef", label: "Tank/top-up ref", type: "text" },
      { name: "eventType", label: "Event type", type: "text" },
      { name: "item", label: "Item", type: "text", required: true },
      { name: "category", label: "Category", type: "text" },
      { name: "unitUsed", label: "Unit used", type: "text" },
      { name: "qtyUsed", label: "Qty used", type: "number", step: "0.0001", required: true },
      { name: "purpose", label: "Purpose/reason", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" }
    ],
    rows: () => enrichUsages(state, currentPeriod),
    titleFor: (row) => `${ledgerLabel(row.ledger)} - ${row.item || "Usage"}`,
    columns: [
      ["Date", (row) => row.date],
      ["Batch", (row) => row.batch || ""],
      ["Qty", (row) => formatNumber(row.qtyUsed, 4)],
      ["Avg cost", (row) => money(row.weightedAvgCostUnit)],
      ["Usage cost", (row) => money(row.usageCost)]
    ]
  },
  tanks: {
    collection: "tanks",
    title: "Tank & Top-up Log",
    formTitle: "Tank log",
    prefix: "tank",
    defaults: () => ({
      date: todayIso(),
      tankRef: "",
      batch: "",
      tankId: "",
      eventType: "Top-up",
      startingVolumeL: "",
      waterAddedL: "",
      waterDischargedL: 0,
      endingVolumeL: "",
      ec: "",
      ph: "",
      notes: ""
    }),
    fields: [
      { name: "date", label: "Date", type: "date", required: true },
      { name: "tankRef", label: "Tank/top-up ref", type: "text", required: true },
      { name: "batch", label: "Batch/Cycle", type: "text" },
      { name: "tankId", label: "Tank ID", type: "text" },
      { name: "eventType", label: "Event type", type: "text" },
      { name: "startingVolumeL", label: "Starting volume L", type: "number", step: "0.01" },
      { name: "waterAddedL", label: "Water added L", type: "number", step: "0.01" },
      { name: "waterDischargedL", label: "Water discharged L", type: "number", step: "0.01" },
      { name: "endingVolumeL", label: "Ending volume L", type: "number", step: "0.01" },
      { name: "ec", label: "EC", type: "number", step: "0.01" },
      { name: "ph", label: "pH", type: "number", step: "0.01" },
      { name: "notes", label: "Notes", type: "textarea" }
    ],
    rows: () => (state.tanks || []).filter((row) => periodMatches(row.date)),
    titleFor: (row) => row.tankRef || "Tank log",
    columns: [
      ["Date", (row) => row.date],
      ["Tank", (row) => row.tankId || ""],
      ["Added L", (row) => formatNumber(row.waterAddedL)],
      ["EC", (row) => row.ec || ""],
      ["pH", (row) => row.ph || ""]
    ]
  },
  labor: {
    collection: "labor",
    title: "Labor",
    formTitle: "Labor",
    prefix: "labor",
    defaults: () => ({
      date: todayIso(),
      workerRole: "Owner",
      task: "",
      hoursWorked: "",
      overrideRateHour: "",
      production: "Production",
      batch: "",
      remarks: ""
    }),
    fields: [
      { name: "date", label: "Date", type: "date", required: true },
      { name: "workerRole", label: "Worker/role", type: "text", required: true },
      { name: "task", label: "Task", type: "text" },
      { name: "hoursWorked", label: "Hours worked", type: "number", step: "0.01", required: true },
      { name: "overrideRateHour", label: "Override rate/hour", type: "number", step: "0.01" },
      { name: "production", label: "Production/overhead", type: "select", options: PRODUCTION_FLAGS },
      { name: "batch", label: "Batch/Cycle", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" }
    ],
    rows: () => enrichLabor(state, currentPeriod),
    titleFor: (row) => `${row.workerRole || "Labor"} - ${row.task || "Task"}`,
    columns: [
      ["Date", (row) => row.date],
      ["Hours", (row) => formatNumber(row.hoursWorked)],
      ["Rate", (row) => money(row.effectiveRateHour)],
      ["Cost", (row) => money(row.laborCost)],
      ["Type", (row) => row.production || ""]
    ]
  },
  electricity: {
    collection: "electricity",
    title: "Electricity",
    formTitle: "Device usage",
    prefix: "power",
    defaults: () => ({
      month: currentPeriod !== "all" ? currentPeriod : thisMonth(),
      device: "",
      ratedWatts: "",
      qty: 1,
      hoursDay: "",
      daysUsed: "",
      rateKwh: state.assumptions.defaultElectricityRate,
      production: "Production",
      batch: "",
      remarks: ""
    }),
    fields: [
      { name: "month", label: "Month", type: "month", required: true },
      { name: "device", label: "Device", type: "text", required: true },
      { name: "ratedWatts", label: "Rated watts", type: "number", step: "0.01" },
      { name: "qty", label: "Qty", type: "number", step: "1" },
      { name: "hoursDay", label: "Hours/day", type: "number", step: "0.01" },
      { name: "daysUsed", label: "Days used", type: "number", step: "0.01" },
      { name: "rateKwh", label: "Rate/kWh", type: "number", step: "0.01" },
      { name: "production", label: "Production/overhead", type: "select", options: PRODUCTION_FLAGS },
      { name: "batch", label: "Batch/Cycle", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" }
    ],
    rows: () => enrichElectricity(state, currentPeriod),
    titleFor: (row) => row.device || "Device",
    columns: [
      ["Month", (row) => row.month],
      ["kWh", (row) => formatNumber(row.estimatedKwh)],
      ["Cost", (row) => money(row.deviceCost)],
      ["Type", (row) => row.production || ""],
      ["Batch", (row) => row.batch || ""]
    ]
  },
  assets: {
    collection: "assets",
    title: "Fixed Assets",
    formTitle: "Fixed asset",
    prefix: "asset",
    defaults: () => ({
      acquisitionDate: todayIso(),
      category: "",
      description: "",
      qty: 1,
      totalCost: "",
      usefulLifeMonths: 60,
      salvageValue: 0,
      depStartMonth: thisMonth(),
      depEndMonth: "",
      status: "Active",
      remarks: ""
    }),
    fields: [
      { name: "acquisitionDate", label: "Acquisition date", type: "date", required: true },
      { name: "category", label: "Asset category", type: "text" },
      { name: "description", label: "Description", type: "text", required: true },
      { name: "qty", label: "Qty", type: "number", step: "1" },
      { name: "totalCost", label: "Total cost", type: "number", step: "0.01", required: true },
      { name: "usefulLifeMonths", label: "Useful life months", type: "number", step: "1" },
      { name: "salvageValue", label: "Salvage value", type: "number", step: "0.01" },
      { name: "depStartMonth", label: "Dep start month", type: "month" },
      { name: "depEndMonth", label: "Dep end month", type: "month" },
      { name: "status", label: "Status", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" }
    ],
    rows: () => enrichAssets(state, currentPeriod),
    titleFor: (row) => row.description || "Fixed asset",
    columns: [
      ["Date", (row) => row.acquisitionDate],
      ["Cost", (row) => money(row.totalCost)],
      ["Monthly dep", (row) => money(row.monthlyDepreciation)],
      ["NBV", (row) => money(row.netBookValue)],
      ["Status", (row) => row.status || ""]
    ]
  },
  expenses: {
    collection: "expenses",
    title: "Other Expenses",
    formTitle: "Expense",
    prefix: "expense",
    defaults: () => ({
      date: todayIso(),
      category: "",
      description: "",
      amount: "",
      production: "Overhead",
      paid: "Yes",
      receiptRef: "",
      batch: "",
      remarks: ""
    }),
    fields: [
      { name: "date", label: "Date", type: "date", required: true },
      { name: "category", label: "Expense category", type: "text" },
      { name: "description", label: "Description", type: "text", required: true },
      { name: "amount", label: "Amount", type: "number", step: "0.01", required: true },
      { name: "production", label: "Production/overhead", type: "select", options: PRODUCTION_FLAGS },
      { name: "paid", label: "Paid?", type: "select", options: PAID_CHOICES },
      { name: "receiptRef", label: "Receipt/ref", type: "text" },
      { name: "batch", label: "Batch/Cycle", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" }
    ],
    rows: () => enrichExpenses(state, currentPeriod),
    titleFor: (row) => row.description || row.category || "Expense",
    columns: [
      ["Date", (row) => row.date],
      ["Category", (row) => row.category || ""],
      ["Amount", (row) => money(row.amount)],
      ["Type", (row) => row.production || ""],
      ["Paid", (row) => row.paid || ""]
    ]
  },
  financing: {
    collection: "financing",
    title: "Financing & Equity",
    formTitle: "Financing",
    prefix: "finance",
    defaults: () => ({
      date: todayIso(),
      type: "Owner contribution",
      amount: "",
      counterparty: "",
      receiptRef: "",
      cashEffect: "",
      remarks: ""
    }),
    fields: [
      { name: "date", label: "Date", type: "date", required: true },
      { name: "type", label: "Type", type: "text", required: true },
      { name: "amount", label: "Amount", type: "number", step: "0.01", required: true },
      { name: "counterparty", label: "Counterparty/source", type: "text" },
      { name: "receiptRef", label: "Receipt/ref", type: "text" },
      { name: "cashEffect", label: "Cash effect", type: "number", step: "0.01" },
      { name: "remarks", label: "Remarks", type: "textarea" }
    ],
    rows: () => enrichFinancing(state, currentPeriod),
    titleFor: (row) => row.type || "Financing",
    columns: [
      ["Date", (row) => row.date],
      ["Amount", (row) => money(row.amount)],
      ["Source", (row) => row.counterparty || ""],
      ["Cash effect", (row) => money(row.cashEffect)],
      ["Ref", (row) => row.receiptRef || ""]
    ]
  },
  cycles: {
    collection: "cycles",
    title: "Crop Cycle Costing",
    formTitle: "Crop cycle",
    prefix: "cycle",
    defaults: () => ({
      batch: "",
      crop: "",
      startDate: todayIso(),
      harvestMonth: currentPeriod !== "all" ? currentPeriod : thisMonth(),
      expectedPacks: "",
      status: "Open",
      remarks: ""
    }),
    fields: [
      { name: "batch", label: "Batch/Cycle", type: "text", required: true },
      { name: "crop", label: "Crop/Product", type: "text" },
      { name: "startDate", label: "Start date", type: "date" },
      { name: "harvestMonth", label: "Harvest/sale month", type: "month" },
      { name: "expectedPacks", label: "Expected packs", type: "number", step: "0.01" },
      { name: "status", label: "Status", type: "text" },
      { name: "remarks", label: "Remarks", type: "textarea" }
    ],
    rows: () => cycleCosting(state, currentPeriod),
    titleFor: (row) => row.batch || "Crop cycle",
    columns: [
      ["Crop", (row) => row.crop || ""],
      ["Sales", (row) => money(row.netSales)],
      ["Full cost", (row) => money(row.fullCost)],
      ["Margin", (row) => percent(row.directGrossMargin)],
      ["Suggested", (row) => money(row.suggestedPriceTargetGm)]
    ]
  }
};

function sheetCollectionView(id, baseId, title, formTitle, fixedValues, titleFor) {
  const base = collectionDefs[baseId];
  return {
    ...base,
    viewId: id,
    collection: base.collection,
    title,
    formTitle,
    fixedValues,
    fields: base.fields.filter((field) => !(field.name in fixedValues)),
    defaults: () => ({ ...base.defaults(), ...fixedValues }),
    rows: () =>
      base.rows().filter((row) =>
        Object.entries(fixedValues).every(([key, value]) => String(row[key] || "") === String(value))
      ),
    titleFor: titleFor || base.titleFor
  };
}

const sheetCollectionDefs = {
  "nutrient-purchases": sheetCollectionView(
    "nutrient-purchases",
    "purchases",
    "Nutrient Purchases",
    "Nutrient Purchase",
    { ledger: "nutrient" },
    (row) => row.item || "Nutrient Purchase"
  ),
  "nutrient-usage": sheetCollectionView(
    "nutrient-usage",
    "usages",
    "Nutrient Mixing Usage",
    "Nutrient Usage",
    { ledger: "nutrient" },
    (row) => `${row.tankRef || row.batch || "Nutrient"} - ${row.item || "Usage"}`
  ),
  "supply-purchases": sheetCollectionView(
    "supply-purchases",
    "purchases",
    "Seed & Supply Purchases",
    "Seed/Supply Purchase",
    { ledger: "supply" },
    (row) => row.item || "Seed/Supply Purchase"
  ),
  "supply-usage": sheetCollectionView(
    "supply-usage",
    "usages",
    "Seed & Supply Usage",
    "Seed/Supply Usage",
    { ledger: "supply" },
    (row) => `${row.batch || "Batch"} - ${row.item || "Usage"}`
  ),
  "chemical-purchases": sheetCollectionView(
    "chemical-purchases",
    "purchases",
    "Chemical Purchases",
    "Chemical Purchase",
    { ledger: "chemical" },
    (row) => row.item || "Chemical Purchase"
  ),
  "chemical-usage": sheetCollectionView(
    "chemical-usage",
    "usages",
    "Chemical Usage",
    "Chemical Usage",
    { ledger: "chemical" },
    (row) => `${row.batch || "Batch"} - ${row.item || "Usage"}`
  )
};

const viewCollectionDefs = { ...collectionDefs, ...sheetCollectionDefs };

function collectionDefFor(viewId) {
  return viewCollectionDefs[viewId];
}

function viewFor(viewId) {
  return views.find((view) => view.id === viewId);
}

function todayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function thisMonth() {
  return todayIso().slice(0, 7);
}

function periodMatches(value) {
  if (currentPeriod === "all") return true;
  return String(value || "").startsWith(currentPeriod);
}

function ledgerLabel(value) {
  return LEDGER_TYPES.find((item) => item.value === value)?.label || value || "";
}

function money(value) {
  return formatMoney(value, state.assumptions.currency || "PHP");
}

function percent(value) {
  return `${formatNumber(toNumber(value) * 100, 2)}%`;
}

function escapeHtml(value) {
  return String(value === null || value === undefined ? "" : value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[char];
  });
}

function optionValue(option) {
  return typeof option === "string" ? option : option.value;
}

function optionLabel(option) {
  return typeof option === "string" ? option : option.label;
}

function fieldControl(field, value) {
  const id = `field-${field.name}`;
  const required = field.required ? " required" : "";
  const common = `id="${id}" name="${escapeHtml(field.name)}"${required}`;
  if (field.type === "select") {
    const options = (field.options || [])
      .map((option) => {
        const rawValue = optionValue(option);
        const selected = String(rawValue) === String(value) ? " selected" : "";
        return `<option value="${escapeHtml(rawValue)}"${selected}>${escapeHtml(optionLabel(option))}</option>`;
      })
      .join("");
    return `<select ${common}>${options}</select>`;
  }
  if (field.type === "textarea") {
    return `<textarea ${common} rows="3">${escapeHtml(value)}</textarea>`;
  }
  const step = field.step ? ` step="${escapeHtml(field.step)}"` : "";
  return `<input ${common} type="${field.type || "text"}"${step} value="${escapeHtml(value)}">`;
}

function renderForm(def, values) {
  const activeValues = { ...def.defaults(), ...values };
  const isEditing = Boolean(activeValues.id);
  const formId = def.viewId || def.collection;
  return `
    <section class="panel form-panel" id="${def.collection}-entry-panel">
      <div class="panel-heading">
        <h2>${isEditing ? "Edit" : "Add"} ${escapeHtml(def.formTitle)}</h2>
        ${isEditing ? `<button class="button ghost" type="button" data-action="cancel-edit">Cancel</button>` : ""}
      </div>
      <form id="${formId}-form" class="entry-form" data-form-kind="collection" data-collection="${def.collection}" data-view-def="${formId}">
        <input type="hidden" name="id" value="${escapeHtml(activeValues.id || "")}">
        <div class="form-grid">
          ${def.fields
            .map(
              (field) => `
                <label>
                  <span>${escapeHtml(field.label)}</span>
                  ${fieldControl(field, activeValues[field.name] ?? "")}
                </label>
              `
            )
            .join("")}
        </div>
        <div class="form-actions">
          <button class="button primary" type="submit">${isEditing ? "Save changes" : "Add record"}</button>
        </div>
      </form>
    </section>
  `;
}

function renderRows(def, rows) {
  if (!rows.length) {
    return `<section class="empty-state">No records for ${escapeHtml(readableMonth(currentPeriod))}.</section>`;
  }
  return `
    <section class="ledger-list" aria-label="${escapeHtml(def.title)} records">
      ${rows
        .map(
          (row) => `
            <article class="entry-card">
              <div class="entry-head">
                <strong>${escapeHtml(def.titleFor(row))}</strong>
                <span>${escapeHtml(row.month || row.date || row.harvestMonth || "")}</span>
              </div>
              <dl>
                ${def.columns
                  .map(
                    ([label, getter]) => `
                      <div>
                        <dt>${escapeHtml(label)}</dt>
                        <dd>${escapeHtml(getter(row))}</dd>
                      </div>
                    `
                  )
                  .join("")}
              </dl>
              ${
                row.id
                  ? `<div class="entry-actions">
                      <button class="button small" type="button" data-action="edit-entry" data-collection="${def.collection}" data-view-def="${def.viewId || def.collection}" data-id="${escapeHtml(row.id)}">Edit</button>
                      <button class="button small danger" type="button" data-action="delete-entry" data-collection="${def.collection}" data-view-def="${def.viewId || def.collection}" data-id="${escapeHtml(row.id)}">Delete</button>
                    </div>`
                  : ""
              }
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function renderMetric(label, value, tone = "") {
  return `
    <article class="metric ${tone}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `;
}

function displayCropName(crop) {
  return String(crop || "").trim().toLowerCase() === "sili" ? "Sili (Pepper)" : crop;
}

function renderVegetableSummary(title) {
  const products = salesByProduct(state, currentPeriod);
  if (!products.length) return "";

  return `
    <section class="vegetable-section" aria-label="${escapeHtml(title)}">
      <div class="vegetable-heading">
        <h2>${escapeHtml(title)}</h2>
        <span>${products.length} vegetable${products.length === 1 ? "" : "s"}</span>
      </div>
      <div class="vegetable-grid">
        ${products
          .map(
            (row) => `
              <article class="vegetable-card">
                <div class="vegetable-card-head">
                  <strong>${escapeHtml(displayCropName(row.crop))}</strong>
                  <span>${escapeHtml(row.batches.join(", ") || "No batch")}</span>
                </div>
                <dl>
                  <div><dt>Packs sold</dt><dd>${escapeHtml(formatNumber(row.packsSold, 4))}</dd></div>
                  <div><dt>Price/pack</dt><dd>${escapeHtml(money(row.averagePricePack))}</dd></div>
                  <div><dt>Net sales</dt><dd>${escapeHtml(money(row.netSales))}</dd></div>
                </dl>
              </article>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderPeriodBar() {
  const periods = uniquePeriods(state);
  const options = [
    `<option value="all"${currentPeriod === "all" ? " selected" : ""}>All months</option>`,
    ...periods.map(
      (period) =>
        `<option value="${escapeHtml(period)}"${currentPeriod === period ? " selected" : ""}>${escapeHtml(
          readableMonth(period)
        )}</option>`
    )
  ].join("");
  return `
    <section class="toolbar">
      <label>
        <span>Period</span>
        <select id="periodSelect" data-action="period">${options}</select>
      </label>
      <button class="button ghost" type="button" data-action="export-excel">Export Excel</button>
      <button class="button ghost" type="button" data-action="export-json">Backup</button>
    </section>
  `;
}

function renderDashboard() {
  const summary = calculateSummary(state, currentPeriod);
  const cycles = cycleCosting(state, currentPeriod).slice(0, 6);
  const inventory = inventorySummary(state).slice(0, 6);
  return `
    ${renderPeriodBar()}
    ${renderFlowPager()}
    <section class="dashboard-title">
      <h2>${escapeHtml(state.assumptions.businessName)}</h2>
      <p>${escapeHtml(readableMonth(currentPeriod))}</p>
    </section>
    <section class="metrics-grid">
      ${renderMetric("Net sales", money(summary.sales.netSales), "accent-green")}
      ${renderMetric("Packs sold", formatNumber(summary.sales.packsSold, 4), "accent-blue")}
      ${renderMetric("Gross margin", percent(summary.margin.grossMargin), "accent-amber")}
      ${renderMetric("Net income", money(summary.income.netIncome), summary.income.netIncome >= 0 ? "accent-green" : "accent-red")}
      ${renderMetric("Cash estimate", money(summary.cash.cashBalance), "accent-blue")}
      ${renderMetric("Suggested price", money(summary.margin.suggestedPrice), "accent-amber")}
    </section>
    ${renderVegetableSummary("Sales by Vegetable")}
    <section class="split-grid">
      <div class="panel">
        <div class="panel-heading"><h2>Cost Stack</h2></div>
        ${renderSimpleRows([
          ["Nutrients", money(summary.costs.nutrientCost)],
          ["Seeds/supplies", money(summary.costs.supplyCost)],
          ["Chemicals", money(summary.costs.chemicalCost)],
          ["Production labor", money(summary.costs.productionLabor)],
          ["Production power", money(summary.costs.productionPower)],
          ["Other production", money(summary.costs.productionExpenses)],
          ["Overhead and depreciation", money(summary.costs.overheadCost)]
        ])}
      </div>
      <div class="panel">
        <div class="panel-heading"><h2>Model Checks</h2></div>
        <ul class="check-list">
          ${summary.checks.map((check) => `<li>${escapeHtml(check)}</li>`).join("")}
        </ul>
      </div>
    </section>
    <section class="split-grid">
      <div class="panel">
        <div class="panel-heading"><h2>Crop Cycles</h2></div>
        ${renderSimpleRows(cycles.map((row) => [row.batch, `${money(row.fullCost)} | ${percent(row.directGrossMargin)}`]))}
      </div>
      <div class="panel">
        <div class="panel-heading"><h2>Inventory</h2></div>
        ${renderSimpleRows(inventory.map((row) => [row.item, `${formatNumber(row.endingQty, 4)} ${row.unit || ""} | ${money(row.endingValue)}`]))}
      </div>
    </section>
  `;
}

function renderSimpleRows(rows) {
  if (!rows.length) return `<p class="muted">No data yet.</p>`;
  return `
    <div class="simple-rows">
      ${rows.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("")}
    </div>
  `;
}

function renderSetup() {
  return `
    ${renderPeriodBar()}
    ${renderFlowPager()}
    <section class="panel form-panel">
      <div class="panel-heading"><h2>Setup & Assumptions</h2></div>
      <form id="setup-form" class="entry-form" data-form-kind="setup">
        <div class="form-grid">
          ${setupFields
            .map(
              (field) => `
                <label>
                  <span>${escapeHtml(field.label)}</span>
                  ${fieldControl(field, state.assumptions[field.name] ?? "")}
                </label>
              `
            )
            .join("")}
        </div>
        <div class="form-actions">
          <button class="button primary" type="submit">Save setup</button>
        </div>
      </form>
    </section>
  `;
}

function renderCollection(collection) {
  const def = collectionDefFor(collection);
  const rawEdit =
    editing && editing.collection === def.collection
      ? (state[def.collection] || []).find((row) => row.id === editing.id)
      : null;
  const rows = def.rows();
  const vegetableSummary =
    collection === "sales"
      ? renderVegetableSummary("Vegetables in Sales Register")
      : collection === "cycles"
        ? renderVegetableSummary("Vegetables Included in Sales")
        : "";
  return `
    ${renderPeriodBar()}
    ${renderFlowPager()}
    <section class="section-heading">
      <h1>${escapeHtml(def.title)}</h1>
      <span>${rows.length} record${rows.length === 1 ? "" : "s"}</span>
    </section>
    ${vegetableSummary}
    ${renderForm(def, rawEdit || {})}
    ${renderRows(def, rows)}
  `;
}

function renderSync() {
  const sheets = buildWorkbookSheets(state);
  const sheetOptions = Object.keys(sheets)
    .map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`)
    .join("");
  return `
    ${renderPeriodBar()}
    ${renderFlowPager()}
    <section class="section-heading">
      <h1>Sync & Export</h1>
      <span>Version ${escapeHtml(APP_VERSION)}</span>
    </section>
    <section class="action-grid">
      <button class="action-tile" type="button" data-action="export-excel">
        <strong>Excel workbook</strong>
        <span>.xls with workbook-style sheets</span>
      </button>
      <button class="action-tile" type="button" data-action="export-source-excel">
        <strong>Original copy</strong>
        <span>Source workbook snapshot from PC</span>
      </button>
      <button class="action-tile" type="button" data-action="export-json">
        <strong>JSON backup</strong>
        <span>Full app data backup</span>
      </button>
      <label class="action-tile file-tile">
        <strong>Import JSON</strong>
        <span>Restore a backup file</span>
        <input id="importJson" type="file" accept="application/json,.json" data-action="import-json">
      </label>
      <button class="action-tile danger-tile" type="button" data-action="reset-sample">
        <strong>Reset Excel copy</strong>
        <span>Restore copied workbook data</span>
      </button>
    </section>
    <section class="panel form-panel">
      <div class="panel-heading"><h2>CSV Sheet</h2></div>
      <div class="inline-form">
        <label>
          <span>Sheet</span>
          <select id="csvSheet">${sheetOptions}</select>
        </label>
        <button class="button primary" type="button" data-action="export-csv">Download CSV</button>
      </div>
    </section>
    <section class="panel">
      <div class="panel-heading"><h2>Device Status</h2></div>
      ${renderSimpleRows([
        ["Saved records", totalRecords()],
        ["Last update", state.updatedAt ? new Date(state.updatedAt).toLocaleString("en-PH") : "Not saved yet"],
        ["Excel copied from", WORKBOOK_SOURCE.fileName],
        ["Excel folder", WORKBOOK_SOURCE.folder],
        ["Offline storage", "IndexedDB/localStorage"],
        ["Install mode", matchMedia("(display-mode: standalone)").matches ? "Installed" : "Browser"]
      ])}
    </section>
  `;
}

function sourceWorkbookSheets() {
  return Object.fromEntries(WORKBOOK_COPY.map((sheet) => [sheet.name, sheet.rows]));
}

function workbookSheetByName(sheetName) {
  return WORKBOOK_COPY.find((item) => item.name === sheetName);
}

function flowPosition(viewId) {
  const index = views.findIndex((view) => view.id === viewId);
  return { index, total: views.length };
}

function renderFlowPager() {
  const { index, total } = flowPosition(currentView);
  const previous = views[index - 1];
  const next = views[index + 1];
  return `
    <section class="flow-pager" aria-label="Workbook flow">
      <button class="button ghost" type="button" data-action="flow-prev" ${previous ? "" : "disabled"}>${previous ? `Back: ${escapeHtml(previous.label)}` : "Back"}</button>
      <span>Sheet flow ${index + 1} of ${total}</span>
      <button class="button ghost" type="button" data-action="flow-next" ${next ? "" : "disabled"}>${next ? `Next: ${escapeHtml(next.label)}` : "Next"}</button>
    </section>
  `;
}

function renderWorkbookSheetReport(view) {
  const sheet = workbookSheetByName(view.sheetName);
  if (!sheet) return `<section class="empty-state">No copied sheet is available for ${escapeHtml(view.label)}.</section>`;
  const title = sheet.rows[0]?.find((value) => value) || view.label;
  const description = sheet.rows[1]?.find((value) => value) || "";
  return `
    ${renderFlowPager()}
    <section class="section-heading">
      <h1>${escapeHtml(view.label)}</h1>
      <span>${escapeHtml(WORKBOOK_SOURCE.fileName)}</span>
    </section>
    <section class="panel source-panel app-report">
      <div class="panel-heading">
        <h2>${escapeHtml(title)}</h2>
        <span>${sheet.maxRow} rows x ${sheet.maxColumn} columns</span>
      </div>
      ${description ? `<p class="report-description">${escapeHtml(description)}</p>` : ""}
      <div class="source-meta">
        <span>Workbook folder: ${escapeHtml(WORKBOOK_SOURCE.folder)}</span>
        <span>Copied from Excel last modified: ${escapeHtml(WORKBOOK_SOURCE.lastModified)}</span>
      </div>
      <div class="workbook-scroll">
        <table class="workbook-table">
          <tbody>
            ${sheet.rows
              .map(
                (row, rowIndex) => `
                  <tr>
                    <th scope="row">${rowIndex + 1}</th>
                    ${row
                      .map((cell) => {
                        const value = cell === null || cell === undefined ? "" : String(cell);
                        const formula = value.startsWith("=") ? " formula-cell" : "";
                        return `<td class="${formula}">${escapeHtml(value)}</td>`;
                      })
                      .join("")}
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderWorkbookCopy() {
  const sheet = workbookSheetByName(currentWorkbookSheet) || WORKBOOK_COPY[0];
  if (!sheet) return `<section class="empty-state">No workbook copy is available.</section>`;
  const options = WORKBOOK_COPY.map(
    (item) =>
      `<option value="${escapeHtml(item.name)}"${item.name === sheet.name ? " selected" : ""}>${escapeHtml(item.name)}</option>`
  ).join("");
  return `
    <section class="section-heading">
      <h1>Excel Workbook Copy</h1>
      <span>${escapeHtml(WORKBOOK_SOURCE.fileName)}</span>
    </section>
    <section class="toolbar">
      <label>
        <span>Sheet</span>
        <select data-action="workbook-sheet">${options}</select>
      </label>
      <button class="button ghost" type="button" data-action="export-source-excel">Export original copy</button>
    </section>
    <section class="panel source-panel">
      <div class="panel-heading">
        <h2>${escapeHtml(sheet.name)}</h2>
        <span>${sheet.maxRow} rows x ${sheet.maxColumn} columns</span>
      </div>
      <div class="source-meta">
        <span>Folder: ${escapeHtml(WORKBOOK_SOURCE.folder)}</span>
        <span>Last modified: ${escapeHtml(WORKBOOK_SOURCE.lastModified)}</span>
      </div>
      <div class="workbook-scroll">
        <table class="workbook-table">
          <tbody>
            ${sheet.rows
              .map(
                (row, rowIndex) => `
                  <tr>
                    <th scope="row">${rowIndex + 1}</th>
                    ${row
                      .map((cell) => {
                        const value = cell === null || cell === undefined ? "" : String(cell);
                        const formula = value.startsWith("=") ? " formula-cell" : "";
                        return `<td class="${formula}">${escapeHtml(value)}</td>`;
                      })
                      .join("")}
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function totalRecords() {
  return String(
    [
      "sales",
      "purchases",
      "usages",
      "tanks",
      "labor",
      "electricity",
      "assets",
      "expenses",
      "financing",
      "cycles"
    ].reduce((count, key) => count + (state[key] || []).length, 0)
  );
}

function renderNav() {
  navEl.innerHTML = views
    .map(
      (view) =>
        `<button type="button" class="${currentView === view.id ? "active" : ""}" data-action="switch-view" data-view="${view.id}">${escapeHtml(view.label)}</button>`
    )
    .join("");
}

function render() {
  const activeView = viewFor(currentView);
  renderNav();
  if (currentView === "dashboard") appEl.innerHTML = renderDashboard();
  else if (currentView === "setup") appEl.innerHTML = renderSetup();
  else if (currentView === "sync") appEl.innerHTML = renderSync();
  else if (activeView?.sheetName) appEl.innerHTML = renderWorkbookSheetReport(activeView);
  else appEl.innerHTML = renderCollection(currentView);
  renderStatus();
}

function renderStatus(message = "") {
  const updated = state.updatedAt ? new Date(state.updatedAt).toLocaleString("en-PH") : "not saved yet";
  statusEl.textContent = message || `${APP_NAME} ${APP_VERSION} | Last save: ${updated}`;
  installButton.hidden = matchMedia("(display-mode: standalone)").matches;
}

function readFields(form, fields) {
  const formData = new FormData(form);
  const data = {};
  for (const field of fields) {
    const raw = formData.get(field.name);
    data[field.name] = field.type === "number" ? (raw === "" || raw === null ? "" : toNumber(raw)) : raw ?? "";
  }
  return data;
}

async function persist(message) {
  state = await saveState(state);
  render();
  renderStatus(message);
}

document.addEventListener("submit", async (event) => {
  const form = event.target.closest("form[data-form-kind]");
  if (!form) return;
  event.preventDefault();
  const formIdentity = form.getAttribute("id");
  if (!formIdentity) return;

  if (form.dataset.formKind === "setup") {
    state.assumptions = { ...state.assumptions, ...readFields(form, setupFields) };
    await persist("Setup saved.");
    return;
  }

  const collection = form.dataset.collection;
  const def = collectionDefFor(form.dataset.viewDef || collection);
  const formData = new FormData(form);
  const entryId = String(formData.get("id") || "");
  const entry = {
    ...readFields(form, def.fields),
    ...(def.fixedValues || {}),
    id: entryId || makeId(def.prefix)
  };
  const records = [...(state[def.collection] || [])];
  const index = records.findIndex((row) => row.id === entry.id);
  if (index >= 0) records[index] = entry;
  else records.unshift(entry);
  state[def.collection] = records;
  editing = null;
  await persist(`${def.formTitle} saved.`);
});

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  if (action === "switch-view") {
    currentView = target.dataset.view;
    editing = null;
    render();
  }

  if (action === "flow-prev" || action === "flow-next") {
    const { index } = flowPosition(currentView);
    const offset = action === "flow-prev" ? -1 : 1;
    const targetView = views[index + offset];
    if (!targetView) return;
    currentView = targetView.id;
    editing = null;
    render();
  }

  if (action === "edit-entry") {
    const def = collectionDefFor(target.dataset.viewDef || target.dataset.collection);
    currentView = target.dataset.viewDef || target.dataset.collection;
    editing = { collection: def.collection, id: target.dataset.id };
    render();
    document.querySelector(".form-panel")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (action === "delete-entry") {
    const def = collectionDefFor(target.dataset.viewDef || target.dataset.collection);
    const collection = def.collection;
    if (!confirm(`Delete this ${def.formTitle.toLowerCase()} record?`)) return;
    state[collection] = (state[collection] || []).filter((row) => row.id !== target.dataset.id);
    editing = null;
    await persist(`${def.formTitle} deleted.`);
  }

  if (action === "cancel-edit") {
    editing = null;
    render();
  }

  if (action === "export-json") downloadJson();
  if (action === "export-excel") downloadExcel();
  if (action === "export-source-excel") downloadSourceExcel();
  if (action === "export-csv") downloadCsv();

  if (action === "reset-sample") {
    if (!confirm("Clear this phone data and return to the copied Excel workbook data?")) return;
    await clearState();
    state = createDefaultState();
    currentPeriod = "all";
    editing = null;
    await persist("Copied Excel data restored.");
  }

  if (action === "install-app") installApp();
});

document.addEventListener("change", async (event) => {
  const target = event.target;
  if (target.dataset.action === "period") {
    currentPeriod = target.value;
    render();
  }
  if (target.dataset.action === "workbook-sheet") {
    currentWorkbookSheet = target.value;
    render();
  }
  if (target.dataset.action === "import-json" && target.files?.[0]) {
    await importJson(target.files[0]);
    target.value = "";
  }
});

function filenameBase() {
  return `hydrofs-${todayIso()}`;
}

function safeFilename(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function downloadFile(filename, mimeType, content) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadJson() {
  downloadFile(`${filenameBase()}-backup.json`, "application/json;charset=utf-8", JSON.stringify(state, null, 2));
  renderStatus("JSON backup downloaded.");
}

function downloadExcel() {
  const sheets = buildWorkbookSheets(state);
  downloadFile(`${filenameBase()}-excel-export.xls`, "application/vnd.ms-excel;charset=utf-8", toSpreadsheetXml(sheets));
  renderStatus("Excel workbook downloaded.");
}

function downloadSourceExcel() {
  downloadFile(
    `${filenameBase()}-original-workbook-copy.xls`,
    "application/vnd.ms-excel;charset=utf-8",
    toSpreadsheetXml(sourceWorkbookSheets())
  );
  renderStatus("Original workbook copy downloaded.");
}

function downloadCsv() {
  const sheetName = document.querySelector("#csvSheet")?.value || "Sales Register";
  const sheets = buildWorkbookSheets(state);
  downloadFile(`${filenameBase()}-${safeFilename(sheetName)}.csv`, "text/csv;charset=utf-8", toCsv(sheets[sheetName]));
  renderStatus(`${sheetName} CSV downloaded.`);
}

async function importJson(file) {
  try {
    const parsed = JSON.parse(await file.text());
    state = mergeState(createDefaultState(), parsed);
    editing = null;
    await persist("JSON backup imported.");
  } catch (error) {
    alert(`Import failed: ${error.message}`);
  }
}

async function installApp() {
  if (!deferredInstallPrompt) {
    alert("Use your browser menu and choose Add to Home screen.");
    return;
  }
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", installApp);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}

state = await loadState(createDefaultState(), mergeState);
if (!state.updatedAt) state.updatedAt = "";
render();

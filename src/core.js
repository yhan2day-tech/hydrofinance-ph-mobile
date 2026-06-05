export const APP_NAME = "HydroFinance PH";
export const APP_VERSION = "1.0.0";

export const LEDGER_TYPES = [
  { value: "nutrient", label: "Nutrient" },
  { value: "supply", label: "Seed/Supply" },
  { value: "chemical", label: "Chemical" }
];

export const PRODUCTION_FLAGS = ["Production", "Overhead"];
export const COLLECTION_STATUSES = ["Collected", "Receivable", "Partial", "Owner use"];
export const PAID_CHOICES = ["Yes", "No"];

export const DEFAULT_STATE = {
  appVersion: APP_VERSION,
  updatedAt: "",
  assumptions: {
    fiscalYear: 2026,
    businessName: "Hydroponics Lettuce Business",
    owner: "Yhan",
    location: "Bohol, Philippines",
    currency: "PHP",
    defaultSellingUnit: "pack",
    targetGrossMargin: 0.5,
    incomeTaxRate: 0,
    beginningCash: 0,
    defaultPricePack: 35,
    defaultLaborRate: 75,
    defaultElectricityRate: 14,
    defaultLettucesPerPack: 3
  },
  sales: [
    {
      id: "sale-sample-lettuce",
      date: "2026-06-05",
      crop: "Lettuce",
      batch: "Batch 1",
      packsSold: 4861.9714,
      lettucesPerPack: 3,
      pricePack: 35,
      discountReturns: 0,
      collectionStatus: "Collected",
      remarks: "Seeded from owner model v3 workbook"
    },
    {
      id: "sale-sample-cucumber",
      date: "2026-06-05",
      crop: "Cucumber",
      batch: "Batch 1",
      packsSold: 95.7083,
      lettucesPerPack: 1,
      pricePack: 120,
      discountReturns: 0,
      collectionStatus: "Collected",
      remarks: "Seeded from owner model v3 workbook"
    },
    {
      id: "sale-sample-eggplant",
      date: "2026-06-05",
      crop: "Eggplant",
      batch: "Batch 1",
      packsSold: 6.95,
      lettucesPerPack: 1,
      pricePack: 100,
      discountReturns: 0,
      collectionStatus: "Collected",
      remarks: "Seeded from owner model v3 workbook"
    }
  ],
  purchases: [
    {
      id: "purchase-sample-masterblend",
      ledger: "nutrient",
      date: "2026-06-01",
      item: "Masterblend",
      category: "Nutrient",
      form: "kg",
      unit: "kg",
      qty: 5,
      totalCost: 1250,
      supplier: "",
      paid: "Yes",
      remarks: "Sample purchase"
    },
    {
      id: "purchase-sample-calnit",
      ledger: "nutrient",
      date: "2026-06-01",
      item: "Calcium Nitrate",
      category: "Nutrient",
      form: "kg",
      unit: "kg",
      qty: 5,
      totalCost: 1000,
      supplier: "",
      paid: "Yes",
      remarks: "Sample purchase"
    },
    {
      id: "purchase-sample-seeds",
      ledger: "supply",
      date: "2026-06-01",
      item: "Lettuce Seeds",
      category: "Seeds",
      form: "pack",
      unit: "pack",
      qty: 2,
      totalCost: 700,
      supplier: "",
      paid: "Yes",
      remarks: "Sample purchase"
    },
    {
      id: "purchase-sample-pest",
      ledger: "chemical",
      date: "2026-06-02",
      item: "Organic Pest Control",
      category: "Pest control",
      form: "liter",
      unit: "liter",
      qty: 1,
      totalCost: 450,
      supplier: "",
      paid: "Yes",
      remarks: "Sample purchase"
    }
  ],
  usages: [
    {
      id: "usage-sample-masterblend",
      ledger: "nutrient",
      date: "2026-06-05",
      batch: "Batch 1",
      tankRef: "TOP-001",
      eventType: "Mixing",
      item: "Masterblend",
      unitUsed: "kg",
      qtyUsed: 1.2,
      purpose: "Nutrient solution",
      remarks: "Sample usage"
    },
    {
      id: "usage-sample-calnit",
      ledger: "nutrient",
      date: "2026-06-05",
      batch: "Batch 1",
      tankRef: "TOP-001",
      eventType: "Mixing",
      item: "Calcium Nitrate",
      unitUsed: "kg",
      qtyUsed: 1.2,
      purpose: "Nutrient solution",
      remarks: "Sample usage"
    },
    {
      id: "usage-sample-seeds",
      ledger: "supply",
      date: "2026-06-01",
      batch: "Batch 1",
      tankRef: "",
      eventType: "Planting",
      item: "Lettuce Seeds",
      unitUsed: "pack",
      qtyUsed: 0.8,
      purpose: "Seedling",
      remarks: "Sample usage"
    },
    {
      id: "usage-sample-pest",
      ledger: "chemical",
      date: "2026-06-10",
      batch: "Batch 1",
      tankRef: "",
      eventType: "Spray",
      item: "Organic Pest Control",
      unitUsed: "liter",
      qtyUsed: 0.2,
      purpose: "Pest prevention",
      remarks: "Sample usage"
    }
  ],
  tanks: [
    {
      id: "tank-sample-topup",
      date: "2026-06-05",
      tankRef: "TOP-001",
      batch: "Batch 1",
      tankId: "Tank A",
      eventType: "Top-up",
      startingVolumeL: 400,
      waterAddedL: 100,
      waterDischargedL: 0,
      endingVolumeL: 500,
      ec: 1.6,
      ph: 6,
      notes: "Sample tank log"
    }
  ],
  labor: [
    {
      id: "labor-sample-owner",
      date: "2026-06-05",
      workerRole: "Owner",
      task: "Harvest and packing",
      hoursWorked: 6,
      overrideRateHour: "",
      production: "Production",
      batch: "Batch 1",
      remarks: "Sample labor"
    }
  ],
  electricity: [
    {
      id: "power-sample-pump",
      month: "2026-06",
      device: "Water pump",
      ratedWatts: 60,
      qty: 2,
      hoursDay: 10,
      daysUsed: 30,
      rateKwh: 14,
      production: "Production",
      batch: "Batch 1",
      remarks: "Sample electricity"
    }
  ],
  assets: [
    {
      id: "asset-sample-frames",
      acquisitionDate: "2026-01-01",
      category: "Production structure",
      description: "Hydroponic frames and pipes",
      qty: 1,
      totalCost: 25000,
      usefulLifeMonths: 60,
      salvageValue: 0,
      depStartMonth: "2026-01",
      depEndMonth: "",
      status: "Active",
      remarks: "Sample fixed asset"
    }
  ],
  expenses: [
    {
      id: "expense-sample-internet",
      date: "2026-06-05",
      category: "Connectivity",
      description: "Internet/load for sales coordination",
      amount: 300,
      production: "Overhead",
      paid: "Yes",
      receiptRef: "",
      batch: "",
      remarks: "Sample overhead"
    }
  ],
  financing: [
    {
      id: "finance-sample-owner",
      date: "2026-06-01",
      type: "Owner contribution",
      amount: 10000,
      counterparty: "Owner",
      receiptRef: "",
      cashEffect: 10000,
      remarks: "Sample capital inflow"
    }
  ],
  cycles: [
    {
      id: "cycle-sample-batch1",
      batch: "Batch 1",
      crop: "Lettuce / mixed vegetables",
      startDate: "2026-06-01",
      harvestMonth: "2026-06",
      expectedPacks: 5000,
      status: "Open",
      remarks: "Sample crop cycle"
    }
  ]
};

export function createDefaultState() {
  return deepClone(DEFAULT_STATE);
}

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function mergeState(defaultState, saved) {
  const base = deepClone(defaultState);
  if (!saved || typeof saved !== "object") return base;
  const merged = {
    ...base,
    ...saved,
    assumptions: { ...base.assumptions, ...(saved.assumptions || {}) }
  };

  for (const key of [
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
  ]) {
    merged[key] = Array.isArray(saved[key]) ? saved[key] : base[key];
  }

  merged.appVersion = APP_VERSION;
  return merged;
}

export function makeId(prefix) {
  const random =
    globalThis.crypto && typeof globalThis.crypto.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}

export function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  const parsed = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function toBool(value) {
  if (typeof value === "boolean") return value;
  return ["yes", "true", "paid", "1"].includes(String(value || "").trim().toLowerCase());
}

export function itemKey(row) {
  return `${String(row.ledger || "").toLowerCase()}|${String(row.item || "").trim().toLowerCase()}`;
}

export function monthKey(value) {
  if (!value) return "";
  const text = String(value).trim();
  if (/^\d{4}-\d{2}$/.test(text)) return text;
  const date = new Date(`${text}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function readableMonth(key) {
  if (!/^\d{4}-\d{2}$/.test(String(key))) return "All months";
  const [year, month] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-PH", { month: "long", year: "numeric" }).format(
    new Date(year, month - 1, 1)
  );
}

export function inPeriod(value, period = "all") {
  if (!period || period === "all") return true;
  return monthKey(value) === period;
}

export function formatMoney(value, currency = "PHP") {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(toNumber(value));
}

export function formatNumber(value, digits = 2) {
  return new Intl.NumberFormat("en-PH", {
    maximumFractionDigits: digits
  }).format(toNumber(value));
}

function sum(rows, getter) {
  return rows.reduce((total, row) => total + toNumber(getter(row)), 0);
}

function rowPeriod(row) {
  return row.date || row.month || row.harvestMonth || row.acquisitionDate || "";
}

export function uniquePeriods(state) {
  const periods = new Set();
  for (const key of [
    "sales",
    "purchases",
    "usages",
    "tanks",
    "labor",
    "electricity",
    "expenses",
    "financing",
    "cycles",
    "assets"
  ]) {
    for (const row of state[key] || []) {
      const period = monthKey(rowPeriod(row));
      if (period) periods.add(period);
    }
  }
  return [...periods].sort().reverse();
}

export function enrichSales(state, period = "all") {
  const defaultHeads = toNumber(state.assumptions.defaultLettucesPerPack, 1);
  return (state.sales || [])
    .filter((row) => inPeriod(row.date, period))
    .map((row) => {
      const packsSold = toNumber(row.packsSold);
      const lettucesPerPack = toNumber(row.lettucesPerPack, defaultHeads);
      const pricePack = toNumber(row.pricePack, toNumber(state.assumptions.defaultPricePack));
      const grossSales = packsSold * pricePack;
      const netSales = Math.max(0, grossSales - toNumber(row.discountReturns));
      return {
        ...row,
        month: monthKey(row.date),
        packsSold,
        lettucesPerPack,
        equivalentHeads: packsSold * lettucesPerPack,
        pricePack,
        grossSales,
        netSales
      };
    });
}

export function enrichPurchases(state, period = "all") {
  return (state.purchases || [])
    .filter((row) => inPeriod(row.date, period))
    .map((row) => {
      const qty = toNumber(row.qty);
      const totalCost = toNumber(row.totalCost);
      return {
        ...row,
        month: monthKey(row.date),
        qty,
        totalCost,
        costPerUnit: qty ? totalCost / qty : 0,
        paid: row.paid || "No"
      };
    });
}

export function weightedCosts(state) {
  const groups = new Map();
  for (const row of enrichPurchases(state)) {
    const key = itemKey(row);
    const current = groups.get(key) || { ledger: row.ledger, item: row.item, qty: 0, totalCost: 0 };
    current.qty += row.qty;
    current.totalCost += row.totalCost;
    groups.set(key, current);
  }

  const result = new Map();
  for (const [key, row] of groups) {
    result.set(key, {
      ...row,
      averageCost: row.qty ? row.totalCost / row.qty : 0
    });
  }
  return result;
}

export function enrichUsages(state, period = "all") {
  const costs = weightedCosts(state);
  return (state.usages || [])
    .filter((row) => inPeriod(row.date, period))
    .map((row) => {
      const qtyUsed = toNumber(row.qtyUsed);
      const average = costs.get(itemKey(row));
      const weightedAvgCostUnit = average ? average.averageCost : 0;
      return {
        ...row,
        month: monthKey(row.date),
        qtyUsed,
        weightedAvgCostUnit,
        usageCost: qtyUsed * weightedAvgCostUnit
      };
    });
}

export function inventorySummary(state) {
  const purchases = enrichPurchases(state);
  const usages = enrichUsages(state);
  const groups = new Map();
  for (const row of purchases) {
    const key = itemKey(row);
    const current =
      groups.get(key) ||
      {
        ledger: row.ledger,
        item: row.item,
        unit: row.unit || row.form || "",
        boughtQty: 0,
        boughtCost: 0,
        usedQty: 0,
        usedCost: 0
      };
    current.boughtQty += row.qty;
    current.boughtCost += row.totalCost;
    groups.set(key, current);
  }

  for (const row of usages) {
    const key = itemKey(row);
    const current =
      groups.get(key) ||
      {
        ledger: row.ledger,
        item: row.item,
        unit: row.unitUsed || "",
        boughtQty: 0,
        boughtCost: 0,
        usedQty: 0,
        usedCost: 0
      };
    current.usedQty += row.qtyUsed;
    current.usedCost += row.usageCost;
    groups.set(key, current);
  }

  return [...groups.values()]
    .map((row) => {
      const averageCost = row.boughtQty ? row.boughtCost / row.boughtQty : 0;
      const endingQty = row.boughtQty - row.usedQty;
      return {
        ...row,
        averageCost,
        endingQty,
        endingValue: endingQty * averageCost
      };
    })
    .sort((a, b) => `${a.ledger}${a.item}`.localeCompare(`${b.ledger}${b.item}`));
}

export function enrichLabor(state, period = "all") {
  const defaultRate = toNumber(state.assumptions.defaultLaborRate);
  return (state.labor || [])
    .filter((row) => inPeriod(row.date, period))
    .map((row) => {
      const hoursWorked = toNumber(row.hoursWorked);
      const effectiveRateHour = row.overrideRateHour === "" ? defaultRate : toNumber(row.overrideRateHour);
      return {
        ...row,
        month: monthKey(row.date),
        hoursWorked,
        effectiveRateHour,
        laborCost: hoursWorked * effectiveRateHour,
        production: row.production || "Production"
      };
    });
}

export function enrichElectricity(state, period = "all") {
  const defaultRate = toNumber(state.assumptions.defaultElectricityRate);
  return (state.electricity || [])
    .filter((row) => inPeriod(row.month, period))
    .map((row) => {
      const ratedWatts = toNumber(row.ratedWatts);
      const qty = toNumber(row.qty, 1);
      const hoursDay = toNumber(row.hoursDay);
      const daysUsed = toNumber(row.daysUsed);
      const rateKwh = toNumber(row.rateKwh, defaultRate);
      const estimatedKwh = (ratedWatts * qty * hoursDay * daysUsed) / 1000;
      return {
        ...row,
        ratedWatts,
        qty,
        hoursDay,
        daysUsed,
        rateKwh,
        estimatedKwh,
        deviceCost: estimatedKwh * rateKwh,
        production: row.production || "Production"
      };
    });
}

export function enrichExpenses(state, period = "all") {
  return (state.expenses || [])
    .filter((row) => inPeriod(row.date, period))
    .map((row) => ({
      ...row,
      month: monthKey(row.date),
      amount: toNumber(row.amount),
      production: row.production || "Overhead",
      paid: row.paid || "No"
    }));
}

function monthIndex(key) {
  if (!/^\d{4}-\d{2}$/.test(String(key))) return null;
  const [year, month] = key.split("-").map(Number);
  return year * 12 + month;
}

function activeMonthsInPeriod(asset, fiscalYear, period) {
  const start = monthIndex(asset.depStartMonth || monthKey(asset.acquisitionDate));
  if (!start) return 0;
  const end = monthIndex(asset.depEndMonth) || monthIndex(`${fiscalYear}-12`);
  if (period && period !== "all") {
    const target = monthIndex(period);
    return target && target >= start && target <= end ? 1 : 0;
  }

  const yearStart = monthIndex(`${fiscalYear}-01`);
  const yearEnd = monthIndex(`${fiscalYear}-12`);
  const first = Math.max(start, yearStart);
  const last = Math.min(end, yearEnd);
  return Math.max(0, last - first + 1);
}

export function enrichAssets(state, period = "all") {
  const fiscalYear = Number(state.assumptions.fiscalYear) || new Date().getFullYear();
  return (state.assets || []).map((row) => {
    const totalCost = toNumber(row.totalCost);
    const salvageValue = toNumber(row.salvageValue);
    const usefulLifeMonths = Math.max(1, toNumber(row.usefulLifeMonths, 1));
    const monthlyDepreciation = Math.max(0, (totalCost - salvageValue) / usefulLifeMonths);
    const activeMonths = activeMonthsInPeriod(row, fiscalYear, period);
    const accumulatedDepreciation = monthlyDepreciation * activeMonths;
    return {
      ...row,
      qty: toNumber(row.qty, 1),
      totalCost,
      usefulLifeMonths,
      salvageValue,
      monthlyDepreciation,
      accumulatedDepreciation,
      netBookValue: Math.max(0, totalCost - accumulatedDepreciation)
    };
  });
}

function financingEffect(row) {
  if (row.cashEffect !== "" && row.cashEffect !== null && row.cashEffect !== undefined) {
    return toNumber(row.cashEffect);
  }
  const amount = toNumber(row.amount);
  const type = String(row.type || "").toLowerCase();
  if (type.includes("payment") || type.includes("draw") || type.includes("withdraw")) return -amount;
  return amount;
}

export function enrichFinancing(state, period = "all") {
  return (state.financing || [])
    .filter((row) => inPeriod(row.date, period))
    .map((row) => ({
      ...row,
      month: monthKey(row.date),
      amount: toNumber(row.amount),
      cashEffect: financingEffect(row)
    }));
}

export function calculateSummary(state, period = "all") {
  const sales = enrichSales(state, period);
  const purchases = enrichPurchases(state, period);
  const usages = enrichUsages(state, period);
  const labor = enrichLabor(state, period);
  const electricity = enrichElectricity(state, period);
  const expenses = enrichExpenses(state, period);
  const assets = enrichAssets(state, period);
  const financing = enrichFinancing(state, period);
  const inventory = inventorySummary(state);

  const netSales = sum(sales, (row) => row.netSales);
  const grossSales = sum(sales, (row) => row.grossSales);
  const packsSold = sum(sales, (row) => row.packsSold);
  const collectedSales = sum(
    sales.filter((row) => row.collectionStatus === "Collected"),
    (row) => row.netSales
  );
  const receivableSales = netSales - collectedSales;

  const nutrientCost = sum(
    usages.filter((row) => row.ledger === "nutrient"),
    (row) => row.usageCost
  );
  const supplyCost = sum(
    usages.filter((row) => row.ledger === "supply"),
    (row) => row.usageCost
  );
  const chemicalCost = sum(
    usages.filter((row) => row.ledger === "chemical"),
    (row) => row.usageCost
  );
  const productionLabor = sum(
    labor.filter((row) => row.production === "Production"),
    (row) => row.laborCost
  );
  const overheadLabor = sum(
    labor.filter((row) => row.production !== "Production"),
    (row) => row.laborCost
  );
  const productionPower = sum(
    electricity.filter((row) => row.production === "Production"),
    (row) => row.deviceCost
  );
  const overheadPower = sum(
    electricity.filter((row) => row.production !== "Production"),
    (row) => row.deviceCost
  );
  const productionExpenses = sum(
    expenses.filter((row) => row.production === "Production"),
    (row) => row.amount
  );
  const overheadExpenses = sum(
    expenses.filter((row) => row.production !== "Production"),
    (row) => row.amount
  );
  const depreciation = sum(assets, (row) => row.accumulatedDepreciation);
  const directProductionCost =
    nutrientCost +
    supplyCost +
    chemicalCost +
    productionLabor +
    productionPower +
    productionExpenses;
  const overheadCost = overheadLabor + overheadPower + overheadExpenses + depreciation;
  const grossProfit = netSales - directProductionCost;
  const grossMargin = netSales ? grossProfit / netSales : 0;
  const netIncomeBeforeTax = grossProfit - overheadCost;
  const tax = Math.max(0, netIncomeBeforeTax) * toNumber(state.assumptions.incomeTaxRate);
  const netIncome = netIncomeBeforeTax - tax;
  const directCostPack = packsSold ? directProductionCost / packsSold : 0;
  const targetGrossMargin = toNumber(state.assumptions.targetGrossMargin, 0.5);
  const suggestedPrice = targetGrossMargin < 1 ? directCostPack / (1 - targetGrossMargin) : 0;

  const purchaseCashOut = sum(
    purchases.filter((row) => toBool(row.paid)),
    (row) => row.totalCost
  );
  const expenseCashOut = sum(
    expenses.filter((row) => toBool(row.paid)),
    (row) => row.amount
  );
  const laborCashOut = sum(labor, (row) => row.laborCost);
  const powerCashOut = sum(electricity, (row) => row.deviceCost);
  const assetCashOut = sum(
    enrichAssets(state).filter((row) => inPeriod(row.acquisitionDate, period)),
    (row) => row.totalCost
  );
  const financingNet = sum(financing, (row) => row.cashEffect);
  const beginningCash = toNumber(state.assumptions.beginningCash);
  const cashBalance =
    beginningCash +
    collectedSales +
    financingNet -
    purchaseCashOut -
    expenseCashOut -
    laborCashOut -
    powerCashOut -
    assetCashOut;

  const checks = [];
  const negativeInventory = inventory.filter((row) => row.endingQty < -0.0001);
  if (negativeInventory.length) {
    checks.push(`${negativeInventory.length} inventory item(s) are negative. Add purchase rows or reduce usage.`);
  }
  if (sales.some((row) => !row.pricePack)) checks.push("Some sales rows have no price per pack.");
  if (usages.some((row) => row.qtyUsed && !row.weightedAvgCostUnit)) {
    checks.push("Some usage rows have no matching purchase cost.");
  }
  if (!checks.length) checks.push("No blocking model checks found.");

  return {
    period,
    sales: { netSales, grossSales, packsSold, collectedSales, receivableSales, averagePrice: packsSold ? netSales / packsSold : 0 },
    costs: {
      nutrientCost,
      supplyCost,
      chemicalCost,
      productionLabor,
      productionPower,
      productionExpenses,
      directProductionCost,
      overheadLabor,
      overheadPower,
      overheadExpenses,
      depreciation,
      overheadCost
    },
    margin: { grossProfit, grossMargin, directCostPack, suggestedPrice },
    income: { netIncomeBeforeTax, tax, netIncome },
    cash: {
      beginningCash,
      collectedSales,
      financingNet,
      purchaseCashOut,
      expenseCashOut,
      laborCashOut,
      powerCashOut,
      assetCashOut,
      cashBalance
    },
    inventory,
    checks
  };
}

export function cycleCosting(state, period = "all") {
  const sales = enrichSales(state, period);
  const usages = enrichUsages(state, period);
  const labor = enrichLabor(state, period).filter((row) => row.production === "Production");
  const electricity = enrichElectricity(state, period).filter((row) => row.production === "Production");
  const expenses = enrichExpenses(state, period).filter((row) => row.production === "Production");
  const summary = calculateSummary(state, period);
  const batches = new Map();

  for (const cycle of state.cycles || []) {
    if (period !== "all" && !inPeriod(cycle.harvestMonth || cycle.startDate, period)) continue;
    batches.set(cycle.batch, {
      id: cycle.id,
      batch: cycle.batch,
      crop: cycle.crop,
      startDate: cycle.startDate,
      harvestMonth: cycle.harvestMonth,
      expectedPacks: toNumber(cycle.expectedPacks),
      status: cycle.status || "",
      netSales: 0,
      actualPacksSold: 0,
      nutrientsUsed: 0,
      chemicalsUsed: 0,
      seedsSuppliesUsed: 0,
      productionLabor: 0,
      productionElectricity: 0,
      otherProductionExpense: 0
    });
  }

  function ensure(batch) {
    const key = batch || "Unassigned";
    if (!batches.has(key)) {
      batches.set(key, {
        id: "",
        batch: key,
        crop: "",
        startDate: "",
        harvestMonth: "",
        expectedPacks: 0,
        status: "",
        netSales: 0,
        actualPacksSold: 0,
        nutrientsUsed: 0,
        chemicalsUsed: 0,
        seedsSuppliesUsed: 0,
        productionLabor: 0,
        productionElectricity: 0,
        otherProductionExpense: 0
      });
    }
    return batches.get(key);
  }

  for (const row of sales) {
    const target = ensure(row.batch);
    target.netSales += row.netSales;
    target.actualPacksSold += row.packsSold;
    if (!target.crop) target.crop = row.crop;
    if (!target.harvestMonth) target.harvestMonth = row.month;
  }
  for (const row of usages) {
    const target = ensure(row.batch);
    if (row.ledger === "nutrient") target.nutrientsUsed += row.usageCost;
    if (row.ledger === "chemical") target.chemicalsUsed += row.usageCost;
    if (row.ledger === "supply") target.seedsSuppliesUsed += row.usageCost;
  }
  for (const row of labor) ensure(row.batch).productionLabor += row.laborCost;
  for (const row of electricity) ensure(row.batch).productionElectricity += row.deviceCost;
  for (const row of expenses) ensure(row.batch).otherProductionExpense += row.amount;

  const directCosts = [...batches.values()].map((row) => ({
    row,
    direct:
      row.nutrientsUsed +
      row.chemicalsUsed +
      row.seedsSuppliesUsed +
      row.productionLabor +
      row.productionElectricity +
      row.otherProductionExpense
  }));
  const totalDirect = directCosts.reduce((total, entry) => total + entry.direct, 0);
  const targetGrossMargin = toNumber(state.assumptions.targetGrossMargin, 0.5);

  return directCosts
    .map(({ row, direct }) => {
      const overheadShare = totalDirect ? summary.costs.overheadCost * (direct / totalDirect) : 0;
      const fullCost = direct + overheadShare;
      const directGrossProfit = row.netSales - direct;
      const packs = row.actualPacksSold || row.expectedPacks;
      return {
        ...row,
        directProductionCost: direct,
        allocatedOverheadDepreciation: overheadShare,
        fullCost,
        directGrossProfit,
        directGrossMargin: row.netSales ? directGrossProfit / row.netSales : 0,
        averagePricePack: row.actualPacksSold ? row.netSales / row.actualPacksSold : 0,
        fullCostPack: packs ? fullCost / packs : 0,
        suggestedPriceTargetGm: packs && targetGrossMargin < 1 ? fullCost / packs / (1 - targetGrossMargin) : 0
      };
    })
    .sort((a, b) => a.batch.localeCompare(b.batch));
}

function setupRows(state) {
  const a = state.assumptions;
  return [
    ["Area", "Assumption", "Value", "Notes"],
    ["General", "Fiscal Year", a.fiscalYear, "Used for depreciation and annual summaries"],
    ["General", "Business Name", a.businessName, ""],
    ["General", "Owner", a.owner, ""],
    ["General", "Location", a.location, ""],
    ["General", "Currency", a.currency, ""],
    ["Sales", "Default selling unit", a.defaultSellingUnit, ""],
    ["Sales", "Default price per pack", a.defaultPricePack, ""],
    ["Sales", "Default lettuces per pack", a.defaultLettucesPerPack, ""],
    ["Pricing", "Target gross margin", a.targetGrossMargin, "Example: 0.50 = 50%"],
    ["Tax", "Income tax rate", a.incomeTaxRate, "Set to 0 when not applicable"],
    ["Cash", "Beginning cash", a.beginningCash, ""],
    ["Labor", "Default labor rate/hour", a.defaultLaborRate, ""],
    ["Electricity", "Default electricity rate/kWh", a.defaultElectricityRate, ""]
  ];
}

function salesRows(state) {
  return [
    [
      "Date",
      "Month",
      "Crop/Product",
      "Batch/Cycle",
      "Packs Sold",
      "Lettuces/Pack",
      "Equivalent Lettuce Heads",
      "Price/Pack",
      "Gross Sales",
      "Discount/Returns",
      "Net Sales",
      "Collection Status",
      "Remarks"
    ],
    ...enrichSales(state).map((row) => [
      row.date,
      row.month,
      row.crop,
      row.batch,
      row.packsSold,
      row.lettucesPerPack,
      row.equivalentHeads,
      row.pricePack,
      row.grossSales,
      row.discountReturns || 0,
      row.netSales,
      row.collectionStatus,
      row.remarks
    ])
  ];
}

function purchaseRows(state, ledger) {
  const title = ledger === "nutrient" ? "Form/Unit" : "Unit";
  return [
    ["Date", "Item", "Category", title, "Qty Bought", "Total Cost", "Cost per Unit", "Supplier", "Paid?", "Remarks"],
    ...enrichPurchases(state)
      .filter((row) => row.ledger === ledger)
      .map((row) => [
        row.date,
        row.item,
        row.category,
        row.form || row.unit,
        row.qty,
        row.totalCost,
        row.costPerUnit,
        row.supplier,
        row.paid,
        row.remarks
      ])
  ];
}

function usageRows(state, ledger) {
  const reasonHeader = ledger === "chemical" ? "Reason/Pest" : "Purpose";
  const base =
    ledger === "nutrient"
      ? ["Date", "Month", "Batch/Cycle", "Tank/Top-up Ref", "Event Type", "Item", "Unit Used", "Qty Actually Mixed", "Weighted Avg Cost/Unit", "Usage Cost", reasonHeader, "Remarks"]
      : ["Date", "Month", "Batch/Cycle", "Item", "Category", "Unit Used", "Qty Actually Used", "Weighted Avg Cost/Unit", "Usage Cost", reasonHeader, "Remarks"];
  return [
    base,
    ...enrichUsages(state)
      .filter((row) => row.ledger === ledger)
      .map((row) =>
        ledger === "nutrient"
          ? [
              row.date,
              row.month,
              row.batch,
              row.tankRef,
              row.eventType,
              row.item,
              row.unitUsed,
              row.qtyUsed,
              row.weightedAvgCostUnit,
              row.usageCost,
              row.purpose,
              row.remarks
            ]
          : [
              row.date,
              row.month,
              row.batch,
              row.item,
              row.category || "",
              row.unitUsed,
              row.qtyUsed,
              row.weightedAvgCostUnit,
              row.usageCost,
              row.purpose,
              row.remarks
            ]
      )
  ];
}

function electricityRows(state) {
  return [
    ["Month", "Device", "Rated Watts", "Qty", "Hours/Day", "Days Used", "Estimated kWh", "Rate per kWh", "Device Cost", "Production/Overhead", "Batch/Cycle", "Remarks"],
    ...enrichElectricity(state).map((row) => [
      row.month,
      row.device,
      row.ratedWatts,
      row.qty,
      row.hoursDay,
      row.daysUsed,
      row.estimatedKwh,
      row.rateKwh,
      row.deviceCost,
      row.production,
      row.batch,
      row.remarks
    ])
  ];
}

function tankRows(state) {
  return [
    ["Date", "Month", "Tank/Top-up Ref", "Batch/Cycle", "Tank ID", "Event Type", "Starting Volume L", "Water Added L", "Water Discharged L", "Ending Volume L", "EC", "pH", "Nutrient Cost by Ref", "Nutrient Cost / L Added", "Notes"],
    ...(state.tanks || []).map((row) => {
      const nutrientCost = sum(
        enrichUsages(state).filter((usage) => usage.tankRef && usage.tankRef === row.tankRef),
        (usage) => usage.usageCost
      );
      const waterAdded = toNumber(row.waterAddedL);
      return [
        row.date,
        monthKey(row.date),
        row.tankRef,
        row.batch,
        row.tankId,
        row.eventType,
        toNumber(row.startingVolumeL),
        waterAdded,
        toNumber(row.waterDischargedL),
        toNumber(row.endingVolumeL),
        toNumber(row.ec),
        toNumber(row.ph),
        nutrientCost,
        waterAdded ? nutrientCost / waterAdded : 0,
        row.notes
      ];
    })
  ];
}

function laborRows(state) {
  return [
    ["Date", "Month", "Worker/Role", "Task", "Hours Worked", "Override Rate/Hour", "Effective Rate/Hour", "Labor Cost", "Production/Overhead", "Batch/Cycle", "Remarks"],
    ...enrichLabor(state).map((row) => [
      row.date,
      row.month,
      row.workerRole,
      row.task,
      row.hoursWorked,
      row.overrideRateHour,
      row.effectiveRateHour,
      row.laborCost,
      row.production,
      row.batch,
      row.remarks
    ])
  ];
}

function assetRows(state) {
  return [
    ["Acquisition Date", "Asset Category", "Asset Description", "Qty", "Total Cost", "Useful Life (Months)", "Salvage Value", "Monthly Depreciation", "Accumulated Depreciation to Date", "Net Book Value to Date", "Dep Start Month", "Dep End Month", "Status", "Remarks"],
    ...enrichAssets(state).map((row) => [
      row.acquisitionDate,
      row.category,
      row.description,
      row.qty,
      row.totalCost,
      row.usefulLifeMonths,
      row.salvageValue,
      row.monthlyDepreciation,
      row.accumulatedDepreciation,
      row.netBookValue,
      row.depStartMonth,
      row.depEndMonth,
      row.status,
      row.remarks
    ])
  ];
}

function expenseRows(state) {
  return [
    ["Date", "Month", "Expense Category", "Description", "Amount", "Production/Overhead", "Paid?", "Receipt/Ref", "Batch/Cycle", "Remarks"],
    ...enrichExpenses(state).map((row) => [
      row.date,
      row.month,
      row.category,
      row.description,
      row.amount,
      row.production,
      row.paid,
      row.receiptRef,
      row.batch,
      row.remarks
    ])
  ];
}

function financingRows(state) {
  return [
    ["Date", "Month", "Type", "Amount", "Counterparty / Source", "Receipt/Ref", "Cash Effect", "Remarks"],
    ...enrichFinancing(state).map((row) => [
      row.date,
      row.month,
      row.type,
      row.amount,
      row.counterparty,
      row.receiptRef,
      row.cashEffect,
      row.remarks
    ])
  ];
}

function cycleRows(state) {
  return [
    ["Batch/Cycle", "Crop/Product", "Start Date", "Harvest/Sale Month", "Expected Packs", "Actual Packs Sold", "Net Sales", "Nutrients Used", "Chemicals Used", "Seeds/Supplies Used", "Production Labor", "Production Electricity", "Other Production Expense", "Direct Production Cost", "Allocated Overhead/Depreciation", "Full Cost", "Direct Gross Profit", "Direct Gross Margin", "Average Price / Pack", "Full Cost / Pack", "Suggested Price at Target GM", "Status"],
    ...cycleCosting(state).map((row) => [
      row.batch,
      row.crop,
      row.startDate,
      row.harvestMonth,
      row.expectedPacks,
      row.actualPacksSold,
      row.netSales,
      row.nutrientsUsed,
      row.chemicalsUsed,
      row.seedsSuppliesUsed,
      row.productionLabor,
      row.productionElectricity,
      row.otherProductionExpense,
      row.directProductionCost,
      row.allocatedOverheadDepreciation,
      row.fullCost,
      row.directGrossProfit,
      row.directGrossMargin,
      row.averagePricePack,
      row.fullCostPack,
      row.suggestedPriceTargetGm,
      row.status
    ])
  ];
}

export function buildWorkbookSheets(state) {
  const summary = calculateSummary(state);
  const inventory = inventorySummary(state);
  const currency = state.assumptions.currency || "PHP";
  return {
    Dashboard: [
      ["Metric", "Value", "Notes"],
      ["Business", state.assumptions.businessName, state.assumptions.location],
      ["Net Sales", summary.sales.netSales, currency],
      ["Packs Sold", summary.sales.packsSold, ""],
      ["Average Selling Price/Pack", summary.sales.averagePrice, currency],
      ["Direct Production Cost", summary.costs.directProductionCost, currency],
      ["Gross Profit", summary.margin.grossProfit, currency],
      ["Gross Margin", summary.margin.grossMargin, ""],
      ["Net Income", summary.income.netIncome, currency],
      ["Estimated Cash Balance", summary.cash.cashBalance, currency],
      ["Suggested Price at Target GM", summary.margin.suggestedPrice, currency],
      ["Last App Update", state.updatedAt || "", ""]
    ],
    "Setup & Assumptions": setupRows(state),
    "Sales Register": salesRows(state),
    Electricity: electricityRows(state),
    "Tank & Top-up Log": tankRows(state),
    "Nutrient Purchases": purchaseRows(state, "nutrient"),
    "Nutrient Mixing Usage": usageRows(state, "nutrient"),
    "Seed & Supply Purchases": purchaseRows(state, "supply"),
    "Seed & Supply Usage": usageRows(state, "supply"),
    "Chemical Purchases": purchaseRows(state, "chemical"),
    "Chemical Usage": usageRows(state, "chemical"),
    Labor: laborRows(state),
    "Fixed Assets": assetRows(state),
    "Other Expenses": expenseRows(state),
    "Financing & Equity": financingRows(state),
    "Income Statement": [
      ["Line Item", "Amount"],
      ["Net Sales", summary.sales.netSales],
      ["Nutrients Used", summary.costs.nutrientCost],
      ["Seeds/Supplies Used", summary.costs.supplyCost],
      ["Chemicals Used", summary.costs.chemicalCost],
      ["Production Labor", summary.costs.productionLabor],
      ["Production Electricity", summary.costs.productionPower],
      ["Other Production Expense", summary.costs.productionExpenses],
      ["Direct Production Cost", summary.costs.directProductionCost],
      ["Gross Profit", summary.margin.grossProfit],
      ["Overhead Cost", summary.costs.overheadCost],
      ["Income Before Tax", summary.income.netIncomeBeforeTax],
      ["Tax", summary.income.tax],
      ["Net Income", summary.income.netIncome]
    ],
    "Inventory Summary": [
      ["Ledger", "Item", "Unit", "Qty Bought", "Cost Bought", "Average Cost", "Qty Used", "Usage Cost", "Ending Qty", "Ending Value"],
      ...inventory.map((row) => [
        row.ledger,
        row.item,
        row.unit,
        row.boughtQty,
        row.boughtCost,
        row.averageCost,
        row.usedQty,
        row.usedCost,
        row.endingQty,
        row.endingValue
      ])
    ],
    "Balance Sheet": [
      ["Line Item", "Amount"],
      ["Estimated Cash", summary.cash.cashBalance],
      ["Inventory Value", sum(inventory, (row) => row.endingValue)],
      ["Fixed Assets NBV", sum(enrichAssets(state), (row) => row.netBookValue)],
      ["Receivables", summary.sales.receivableSales],
      ["Estimated Assets", summary.cash.cashBalance + sum(inventory, (row) => row.endingValue) + sum(enrichAssets(state), (row) => row.netBookValue) + summary.sales.receivableSales],
      ["Owner Equity / Retained Estimate", summary.income.netIncome + sum(enrichFinancing(state), (row) => row.cashEffect)]
    ],
    "Cash Flow": [
      ["Line Item", "Amount"],
      ["Beginning Cash", summary.cash.beginningCash],
      ["Collected Sales", summary.cash.collectedSales],
      ["Financing Net Cash Effect", summary.cash.financingNet],
      ["Paid Purchases", -summary.cash.purchaseCashOut],
      ["Paid Expenses", -summary.cash.expenseCashOut],
      ["Labor Cash Out", -summary.cash.laborCashOut],
      ["Electricity Cash Out", -summary.cash.powerCashOut],
      ["Fixed Asset Purchases", -summary.cash.assetCashOut],
      ["Estimated Ending Cash", summary.cash.cashBalance]
    ],
    "Pricing & Margin": [
      ["KPI", "Value"],
      ["YTD Sales", summary.sales.netSales],
      ["YTD Net Income", summary.income.netIncome],
      ["YTD Gross Margin", summary.margin.grossMargin],
      ["Total Packs Sold", summary.sales.packsSold],
      ["Average Selling Price/Pack", summary.sales.averagePrice],
      ["Actual Production Cost/Pack", summary.margin.directCostPack],
      ["Suggested Price at Target GM", summary.margin.suggestedPrice]
    ],
    "Crop Cycle Costing": cycleRows(state),
    "Model Checks": [["Check"], ...summary.checks.map((check) => [check])],
    "Sources & Guide": [
      ["Topic", "Notes"],
      ["Source workbook", "hydroponics_financial_statement_owner_model_v3_pack_sales.xlsx"],
      ["Phone workflow", "Enter updates in HydroFinance PH, then export JSON backup or Excel-compatible workbook."],
      ["Excel workflow", "Open the exported .xls file in Excel or copy ledger sheets into the owner model workbook."],
      ["Storage", "Data is saved locally on this device using IndexedDB with localStorage fallback."]
    ]
  };
}

export function toCsv(rows) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const text = cell === null || cell === undefined ? "" : String(cell);
          return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
        })
        .join(",")
    )
    .join("\r\n");
}

function xmlEscape(value) {
  return String(value === null || value === undefined ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function cellXml(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `<Cell><Data ss:Type="Number">${value}</Data></Cell>`;
  }
  return `<Cell><Data ss:Type="String">${xmlEscape(value)}</Data></Cell>`;
}

export function toSpreadsheetXml(sheets) {
  const worksheets = Object.entries(sheets)
    .map(([name, rows]) => {
      const safeName = xmlEscape(name.slice(0, 31));
      const body = rows.map((row) => `<Row>${row.map(cellXml).join("")}</Row>`).join("");
      return `<Worksheet ss:Name="${safeName}"><Table>${body}</Table></Worksheet>`;
    })
    .join("");
  return `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">${worksheets}</Workbook>`;
}

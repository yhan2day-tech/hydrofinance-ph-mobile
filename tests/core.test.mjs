import assert from "node:assert/strict";
import test from "node:test";
import {
  buildWorkbookSheets,
  calculateSummary,
  createDefaultState,
  cycleCosting,
  enrichUsages,
  inventorySummary,
  mergeState,
  toCsv,
  toSpreadsheetXml
} from "../src/core.js";

test("sample state calculates sales, costs, and cash", () => {
  const state = createDefaultState();
  const summary = calculateSummary(state);

  assert.ok(summary.sales.netSales > 180000);
  assert.ok(summary.sales.packsSold > 4900);
  assert.equal(Math.round(summary.costs.nutrientCost), 540);
  assert.ok(summary.margin.grossMargin > 0.98);
  assert.ok(summary.cash.cashBalance < summary.sales.netSales);
});

test("usage rows use weighted average purchase cost", () => {
  const state = createDefaultState();
  state.purchases.push({
    id: "purchase-extra-masterblend",
    ledger: "nutrient",
    date: "2026-06-03",
    item: "Masterblend",
    category: "Nutrient",
    form: "kg",
    unit: "kg",
    qty: 5,
    totalCost: 1500,
    supplier: "",
    paid: "Yes",
    remarks: ""
  });

  const row = enrichUsages(state).find((usage) => usage.id === "usage-sample-masterblend");
  assert.equal(row.weightedAvgCostUnit, 275);
  assert.equal(row.usageCost, 330);
});

test("inventory summary flags remaining quantities and value", () => {
  const state = createDefaultState();
  const inventory = inventorySummary(state);
  const seeds = inventory.find((row) => row.item === "Lettuce Seeds");

  assert.equal(seeds.endingQty, 1.2);
  assert.equal(seeds.endingValue, 420);
});

test("cycle costing joins sales and direct production cost by batch", () => {
  const state = createDefaultState();
  const batch = cycleCosting(state).find((row) => row.batch === "Batch 1");

  assert.ok(batch.netSales > 180000);
  assert.ok(batch.directProductionCost > 1800);
  assert.ok(batch.suggestedPriceTargetGm > 0);
});

test("workbook export contains expected sheets and escaped CSV", () => {
  const state = createDefaultState();
  state.sales[0].remarks = "A, B \"quoted\"";
  const sheets = buildWorkbookSheets(state);
  const csv = toCsv(sheets["Sales Register"]);
  const xml = toSpreadsheetXml(sheets);

  assert.ok(sheets["Setup & Assumptions"]);
  assert.ok(sheets["Crop Cycle Costing"]);
  assert.match(csv, /"A, B ""quoted"""/);
  assert.match(xml, /Worksheet ss:Name="Sales Register"/);
  assert.match(xml, /Seed &amp; Supply Purchases/);
});

test("mergeState keeps new default collections when importing old backups", () => {
  const merged = mergeState(createDefaultState(), {
    assumptions: { owner: "Updated owner" },
    sales: []
  });

  assert.equal(merged.assumptions.owner, "Updated owner");
  assert.deepEqual(merged.sales, []);
  assert.ok(Array.isArray(merged.cycles));
});

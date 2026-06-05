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
import { WORKBOOK_COPY, WORKBOOK_SOURCE } from "../src/workbook-copy.js";

test("default state is copied from the source workbook", () => {
  const state = createDefaultState();

  assert.equal(WORKBOOK_SOURCE.fileName, "hydroponics_financial_statement_owner_model_v3_pack_sales.xlsx");
  assert.equal(WORKBOOK_SOURCE.folder, "B:\\PERSONAL\\HYDROPONICS\\outputs\\hydroponics_financial_statement_template");
  assert.equal(WORKBOOK_COPY.length, 23);
  assert.equal(state.sales.length, 6);
  assert.equal(state.purchases.length, 15);
  assert.equal(state.usages.length, 15);
  assert.equal(state.cycles.length, 3);
});

test("copied workbook state calculates sales, costs, and cash", () => {
  const state = createDefaultState();
  const summary = calculateSummary(state);

  assert.equal(summary.sales.netSales, 182879);
  assert.equal(Math.round(summary.sales.packsSold), 4970);
  assert.equal(Math.round(summary.costs.directProductionCost), 61190);
  assert.ok(summary.margin.grossMargin > 0.66);
  assert.ok(summary.cash.cashBalance < 0);
});

test("usage rows use weighted average purchase cost from copied workbook values", () => {
  const state = createDefaultState();
  const row = enrichUsages(state).find((usage) => usage.id === "nutrient-usage-excel-r5");

  assert.equal(row.item, "Masterblend 5-11-26");
  assert.equal(row.weightedAvgCostUnit, 0.5167901234567901);
  assert.equal(row.usageCost, 13953.333333333332);
});

test("inventory summary flags remaining quantities and value", () => {
  const state = createDefaultState();
  const inventory = inventorySummary(state);
  const seeds = inventory.find((row) => row.item === "Lettuce Seeds");

  assert.equal(seeds.endingQty, 1);
  assert.equal(seeds.endingValue, 1101.5);
});

test("cycle costing joins sales and direct production cost by batch", () => {
  const state = createDefaultState();
  const batch = cycleCosting(state).find((row) => row.batch === "Batch 1");

  assert.ok(batch.netSales > 180000);
  assert.ok(batch.directProductionCost > 61000);
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
  assert.match(toSpreadsheetXml(Object.fromEntries(WORKBOOK_COPY.map((sheet) => [sheet.name, sheet.rows]))), /Hydroponics Owner Dashboard/);
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

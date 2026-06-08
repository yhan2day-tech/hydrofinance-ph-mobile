import assert from "node:assert/strict";
import test from "node:test";
import {
  buildWorkbookSheets,
  calculateSummary,
  createDefaultState,
  mergeState,
  monthlyCostSummary,
  salesByProduct,
  toCsv,
  toSpreadsheetXml
} from "../src/core.js";
import { WORKBOOK_COPY, WORKBOOK_SOURCE } from "../src/workbook-copy.js";

test("default state is copied from the source workbook", () => {
  const state = createDefaultState();

  assert.equal(WORKBOOK_SOURCE.fileName, "hydroponics_financial_statement_owner_model_v3_pack_sales.xlsx");
  assert.equal(WORKBOOK_SOURCE.folder, "B:\\PERSONAL\\HYDROPONICS\\outputs\\hydroponics_financial_statement_template");
  assert.equal(WORKBOOK_COPY.length, 18);
  assert.equal(state.sales.length, 6);
  assert.equal(state.purchases.length, 15);
  assert.equal("usages" in state, false);
  assert.equal("tanks" in state, false);
  assert.equal("cycles" in state, false);
});

test("copied workbook state calculates sales, costs, and cash", () => {
  const state = createDefaultState();
  const summary = calculateSummary(state);

  assert.equal(summary.sales.netSales, 182879);
  assert.equal(Math.round(summary.sales.packsSold), 4970);
  assert.equal(summary.costs.nutrientCost, 25688);
  assert.equal(summary.costs.supplyCost, 15489);
  assert.equal(summary.costs.chemicalCost, 4085);
  assert.equal(summary.costs.directProductionCost, 59483.022);
  assert.ok(Math.abs(summary.costs.depreciation - 16511.111111111113) < 0.000001);
  assert.ok(Math.abs(summary.income.netIncome - 106734.8668888889) < 0.000001);
  assert.ok(summary.margin.grossMargin > 0.67);
  assert.equal(summary.cash.cashBalance, 115455.978);
});

test("sales by product keeps every vegetable in Excel order", () => {
  const products = salesByProduct(createDefaultState());

  assert.deepEqual(
    products.map((row) => row.crop),
    ["Lettuce", "Cucumber", "Eggplant", "Okra", "Sili", "Upo"]
  );
  assert.equal(products.find((row) => row.crop === "Okra").netSales, 404);
  assert.equal(products.find((row) => row.crop === "Sili").netSales, 90);
  assert.equal(products.find((row) => row.crop === "Upo").netSales, 36);
});

test("monthly costing treats purchases as usage on their purchase dates", () => {
  const state = createDefaultState();
  const monthly = monthlyCostSummary(state);
  const january = monthly.find((row) => row.period === "2026-01");
  const june = monthly.find((row) => row.period === "2026-06");

  assert.equal(january.nutrientPurchases, 25688);
  assert.equal(january.directProductionCost, 59483.022);
  assert.equal(january.status, "Review");
  assert.equal(june.netSales, 182879);
  assert.equal(june.status, "OK");
});

test("workbook export contains expected sheets and escaped CSV", () => {
  const state = createDefaultState();
  state.sales[0].remarks = "A, B \"quoted\"";
  const sheets = buildWorkbookSheets(state);
  const csv = toCsv(sheets["Sales Register"]);
  const xml = toSpreadsheetXml(sheets);

  assert.ok(sheets["Setup & Assumptions"]);
  assert.ok(sheets["Monthly Cost Summary"]);
  assert.equal("Tank & Top-up Log" in sheets, false);
  assert.equal("Nutrient Mixing Usage" in sheets, false);
  assert.equal("Seed & Supply Usage" in sheets, false);
  assert.equal("Chemical Usage" in sheets, false);
  assert.equal("Inventory Summary" in sheets, false);
  assert.match(csv, /"A, B ""quoted"""/);
  assert.match(xml, /Worksheet ss:Name="Sales Register"/);
  assert.match(xml, /Seed &amp; Supply Purchases/);
  assert.match(toSpreadsheetXml(Object.fromEntries(WORKBOOK_COPY.map((sheet) => [sheet.name, sheet.rows]))), /Hydroponics Owner Dashboard/);
});

test("mergeState keeps active records and removes obsolete batch-era data", () => {
  const merged = mergeState(createDefaultState(), {
    assumptions: { owner: "Updated owner" },
    sales: [{ id: "sale-old", date: "2026-06-01", crop: "Okra", batch: "Batch 1" }],
    labor: [{ id: "labor-old", date: "2026-06-01", workerRole: "Owner", batch: "Batch 1" }],
    usages: [{ id: "usage-old" }],
    tanks: [{ id: "tank-old" }],
    cycles: [{ id: "cycle-old" }]
  });

  assert.equal(merged.assumptions.owner, "Updated owner");
  assert.equal(merged.sales[0].crop, "Okra");
  assert.equal("batch" in merged.sales[0], false);
  assert.equal("batch" in merged.labor[0], false);
  assert.equal("usages" in merged, false);
  assert.equal("tanks" in merged, false);
  assert.equal("cycles" in merged, false);
});

import path from "node:path";
import { FileBlob, SpreadsheetFile } from "@oai/artifact-tool";

const inputPath =
  process.argv[2] ||
  "B:\\PERSONAL\\HYDROPONICS\\outputs\\hydroponics_financial_statement_template\\hydroponics_financial_statement_owner_model_v3_pack_sales.xlsx";
const outputPath =
  process.argv[3] ||
  path.join(path.dirname(inputPath), "hydroponics_financial_statement_owner_model_v3_pack_sales_date_based.xlsx");

const workbook = await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
const monthColumns = [..."BCDEFGHIJKLM"];
const deletedSheets = [
  "Tank & Top-up Log",
  "Nutrient Mixing Usage",
  "Seed & Supply Usage",
  "Chemical Usage",
  "Inventory Summary"
];

const colors = {
  dark: "#17365D",
  teal: "#0F766E",
  green: "#008000",
  paleGreen: "#E2F0D9",
  paleRed: "#FCE4D6",
  formula: "#EAF4F4"
};

const PHP = '"PHP" #,##0;[Red]("PHP" #,##0);-';
const PHP_DEC = '"PHP" #,##0.00;[Red]("PHP" #,##0.00);-';
const NUM = "#,##0.0;[Red](#,##0.0);-";
const PCT = "0.0%;[Red](0.0%);-";
const MONTH = "mmm-yy";

function sheet(name) {
  return workbook.worksheets.getItem(name);
}

function write(name, address, values) {
  sheet(name).getRange(address).values = values;
}

function formulas(name, address, values) {
  sheet(name).getRange(address).formulas = values;
}

function horizontalFormula(name, row, maker) {
  formulas(name, `B${row}:M${row}`, [monthColumns.map((column) => maker(column))]);
}

function hideLegacyBatchColumn(name, column) {
  const target = sheet(name);
  target.getRange(`${column}5:${column}504`).clear();
  target.getRange(`${column}4`).values = [["Legacy field (unused)"]];
  target.getRange(`${column}:${column}`).format.columnHidden = true;
}

function styleFormulaRange(name, address) {
  sheet(name).getRange(address).format = {
    fill: colors.formula,
    font: { color: colors.green }
  };
}

hideLegacyBatchColumn("Sales Register", "D");
hideLegacyBatchColumn("Electricity", "P");
hideLegacyBatchColumn("Labor", "J");
hideLegacyBatchColumn("Other Expenses", "I");

write("Sales Register", "A2", [["Record every sale by its actual date and product. No batch code is required."]]);
write("Nutrient Purchases", "A1", [["Nutrient Purchases and Usage"]]);
write("Nutrient Purchases", "A2", [["Every purchase is treated as used and expensed on its purchase date."]]);
write("Seed & Supply Purchases", "A2", [["Every seed, cocopeat, packaging, and supply purchase is treated as used on its purchase date."]]);
write("Chemical Purchases", "A2", [["Every chemical purchase is treated as used and expensed on its purchase date."]]);

write("Setup & Assumptions", "A1", [["Hydroponics Financial Statement Model - Date-Based Setup"]]);
write("Setup & Assumptions", "A19:D21", [
  ["Accounting", "Nutrient purchase policy", "Expense on purchase date", "Every nutrient purchase is considered used immediately."],
  ["Accounting", "Chemical purchase policy", "Expense on purchase date", "Every chemical purchase is considered used immediately."],
  ["Accounting", "Seed and supply purchase policy", "Expense on purchase date", "Every seed, cocopeat, packaging, and supply purchase is considered used immediately."]
]);
write("Setup & Assumptions", "D14", [["Optional opening-equity adjustment in addition to opening cash and pre-year fixed assets, less beginning loans."]]);
write("Setup & Assumptions", "A29:D31", [
  ["Accounting", "Nutrient recording policy", "Purchase is usage", "No separate nutrient mixing or tank log is required."],
  ["Accounting", "Sales measurement policy", "Use number of packs sold", "Sales are grouped by actual sale date and product."],
  ["Accounting", "One-time seed/cocopeat purchase policy", "Expense on purchase date", "No separate inventory or usage tracking is maintained."]
]);
write("Setup & Assumptions", "A37:D38", [
  ["Reporting", "Purchase timing method", "Date-based", "Costs flow to the financial statements based on each purchase date."],
  ["Cost Summary", "Cost analysis method", "Monthly by date", "Monthly Cost Summary replaces batch-based crop-cycle costing."]
]);

write("Income Statement", "A2", [["Date-based view: sales less purchases, labor, electricity, expenses, depreciation, and financing interest."]]);
write("Income Statement", "A6:A8", [
  ["COGS - Nutrient purchases used"],
  ["COGS - Chemical purchases used"],
  ["COGS - Seed, cocopeat, plugs, and packaging purchases used"]
]);

horizontalFormula(
  "Income Statement",
  6,
  (column) =>
    `=SUMIFS('Nutrient Purchases'!$E$5:$E$504,'Nutrient Purchases'!$A$5:$A$504,">="&EOMONTH(${column}$3,-1)+1,'Nutrient Purchases'!$A$5:$A$504,"<="&${column}$3)`
);
horizontalFormula(
  "Income Statement",
  7,
  (column) =>
    `=SUMIFS('Chemical Purchases'!$F$5:$F$504,'Chemical Purchases'!$A$5:$A$504,">="&EOMONTH(${column}$3,-1)+1,'Chemical Purchases'!$A$5:$A$504,"<="&${column}$3)`
);
horizontalFormula(
  "Income Statement",
  8,
  (column) =>
    `=SUMIFS('Seed & Supply Purchases'!$F$5:$F$504,'Seed & Supply Purchases'!$A$5:$A$504,">="&EOMONTH(${column}$3,-1)+1,'Seed & Supply Purchases'!$A$5:$A$504,"<="&${column}$3)`
);

horizontalFormula("Income Statement", 12, (column) => `=${column}5-SUM(${column}6:${column}11)`);
horizontalFormula("Income Statement", 13, (column) => `=IFERROR(${column}12/${column}5,0)`);
horizontalFormula("Income Statement", 19, (column) => `=${column}12-SUM(${column}14:${column}18)`);
horizontalFormula("Income Statement", 20, (column) => `=MAX(0,${column}19*'Setup & Assumptions'!$C$12)`);
horizontalFormula("Income Statement", 21, (column) => `=${column}19-${column}20`);
horizontalFormula("Income Statement", 22, (column) => `=IFERROR(${column}21/${column}5,0)`);
horizontalFormula(
  "Income Statement",
  23,
  (column) => `=SUMIFS('Sales Register'!$E$5:$E$504,'Sales Register'!$B$5:$B$504,${column}$3)`
);
horizontalFormula("Income Statement", 24, (column) => `=IFERROR(${column}5/${column}23,0)`);
horizontalFormula("Income Statement", 25, (column) => `=IFERROR(SUM(${column}6:${column}11)/${column}23,0)`);
horizontalFormula("Income Statement", 26, (column) => `=${column}24-${column}25`);
horizontalFormula("Income Statement", 27, (column) => `=SUM(${column}14:${column}18)+SUM(${column}6:${column}11)`);
horizontalFormula("Income Statement", 28, (column) => `=IFERROR(${column}27/${column}24,0)`);

const incomeTotals = {
  5: "=SUM(B5:M5)",
  6: "=SUM(B6:M6)",
  7: "=SUM(B7:M7)",
  8: "=SUM(B8:M8)",
  9: "=SUM(B9:M9)",
  10: "=SUM(B10:M10)",
  11: "=SUM(B11:M11)",
  12: "=N5-SUM(N6:N11)",
  13: "=IFERROR(N12/N5,0)",
  14: "=SUM(B14:M14)",
  15: "=SUM(B15:M15)",
  16: "=SUM(B16:M16)",
  17: "=SUM(B17:M17)",
  18: "=SUM(B18:M18)",
  19: "=N12-SUM(N14:N18)",
  20: "=SUM(B20:M20)",
  21: "=N19-N20",
  22: "=IFERROR(N21/N5,0)",
  23: "=SUM(B23:M23)",
  24: "=IFERROR(N5/N23,0)",
  25: "=IFERROR(SUM(N6:N11)/N23,0)",
  26: "=N24-N25",
  27: "=SUM(N14:N18)+SUM(N6:N11)",
  28: "=IFERROR(N27/N24,0)"
};
for (const [row, formula] of Object.entries(incomeTotals)) {
  formulas("Income Statement", `N${row}`, [[formula]]);
}
styleFormulaRange("Income Statement", "B6:N28");
sheet("Income Statement").getRange("B5:N12").format.numberFormat = PHP;
sheet("Income Statement").getRange("B13:N13").format.numberFormat = PCT;
sheet("Income Statement").getRange("B14:N21").format.numberFormat = PHP;
sheet("Income Statement").getRange("B22:N22").format.numberFormat = PCT;
sheet("Income Statement").getRange("B23:N23").format.numberFormat = NUM;
sheet("Income Statement").getRange("B24:N28").format.numberFormat = PHP_DEC;

write("Balance Sheet", "A2", [["Cash, receivables, fixed assets, liabilities, owner capital, and retained earnings."]]);
write("Balance Sheet", "A8:A10", [
  ["Accounts Receivable"],
  [""],
  [""]
]);
horizontalFormula(
  "Balance Sheet",
  8,
  (column) =>
    `=SUMIFS('Sales Register'!$K$5:$K$504,'Sales Register'!$A$5:$A$504,"<="&${column}$3,'Sales Register'!$L$5:$L$504,"Uncollected")+SUMIFS('Sales Register'!$K$5:$K$504,'Sales Register'!$A$5:$A$504,"<="&${column}$3,'Sales Register'!$L$5:$L$504,"Receivable")+SUMIFS('Sales Register'!$K$5:$K$504,'Sales Register'!$A$5:$A$504,"<="&${column}$3,'Sales Register'!$L$5:$L$504,"Partial")`
);
sheet("Balance Sheet").getRange("B9:M10").clear();
horizontalFormula("Balance Sheet", 11, (column) => `=SUM(${column}7:${column}8)`);

horizontalFormula(
  "Balance Sheet",
  18,
  (column) =>
    `='Setup & Assumptions'!$C$36+SUMIFS('Financing & Equity'!$D$5:$D$304,'Financing & Equity'!$B$5:$B$304,"<="&${column}$3,'Financing & Equity'!$C$5:$C$304,"Loan/Payable Proceeds")-SUMIFS('Financing & Equity'!$D$5:$D$304,'Financing & Equity'!$B$5:$B$304,"<="&${column}$3,'Financing & Equity'!$C$5:$C$304,"Principal Payment")+SUMIFS('Nutrient Purchases'!$E$5:$E$504,'Nutrient Purchases'!$A$5:$A$504,"<="&${column}$3,'Nutrient Purchases'!$I$5:$I$504,"<>Yes")+SUMIFS('Chemical Purchases'!$F$5:$F$504,'Chemical Purchases'!$A$5:$A$504,"<="&${column}$3,'Chemical Purchases'!$I$5:$I$504,"<>Yes")+SUMIFS('Seed & Supply Purchases'!$F$5:$F$504,'Seed & Supply Purchases'!$A$5:$A$504,"<="&${column}$3,'Seed & Supply Purchases'!$I$5:$I$504,"<>Yes")+SUMIFS('Other Expenses'!$E$5:$E$504,'Other Expenses'!$A$5:$A$504,"<="&${column}$3,'Other Expenses'!$G$5:$G$504,"<>Yes")`
);
write("Balance Sheet", "A19", [["Owner Capital / Opening Net Assets"]]);
horizontalFormula(
  "Balance Sheet",
  19,
  (column) =>
    `='Setup & Assumptions'!$C$14+'Setup & Assumptions'!$C$13-'Setup & Assumptions'!$C$36+SUMIFS('Fixed Assets'!$E$5:$E$304,'Fixed Assets'!$A$5:$A$304,"<"&DATE('Setup & Assumptions'!$C$5,1,1))+SUMIFS('Financing & Equity'!$D$5:$D$304,'Financing & Equity'!$B$5:$B$304,"<="&${column}$3,'Financing & Equity'!$C$5:$C$304,"Owner Capital Added")-SUMIFS('Financing & Equity'!$D$5:$D$304,'Financing & Equity'!$B$5:$B$304,"<="&${column}$3,'Financing & Equity'!$C$5:$C$304,"Owner Drawings")`
);
horizontalFormula("Balance Sheet", 14, (column) => `=${column}12-${column}13`);
horizontalFormula("Balance Sheet", 15, (column) => `=SUM(${column}11,${column}14)`);
formulas("Balance Sheet", "B20:M20", [[
  "='Income Statement'!B21",
  "=B20+'Income Statement'!C21",
  "=C20+'Income Statement'!D21",
  "=D20+'Income Statement'!E21",
  "=E20+'Income Statement'!F21",
  "=F20+'Income Statement'!G21",
  "=G20+'Income Statement'!H21",
  "=H20+'Income Statement'!I21",
  "=I20+'Income Statement'!J21",
  "=J20+'Income Statement'!K21",
  "=K20+'Income Statement'!L21",
  "=L20+'Income Statement'!M21"
]]);
horizontalFormula("Balance Sheet", 21, (column) => `=SUM(${column}18:${column}20)`);
horizontalFormula("Balance Sheet", 22, (column) => `=${column}15-${column}21`);
formulas("Balance Sheet", "N8:N11", [["=M8"], [""], [""], ["=M11"]]);
formulas("Balance Sheet", "N18", [["=M18"]]);
formulas("Balance Sheet", "N19", [["=M19"]]);
formulas("Balance Sheet", "N20:N22", [["=M20"], ["=M21"], ["=M22"]]);
styleFormulaRange("Balance Sheet", "B7:N22");
sheet("Balance Sheet").getRange("B7:N22").format.numberFormat = PHP;

write("Cash Flow", "A2", [["Cash-in/cash-out view: paid purchases are cash outflows and all purchases are expensed by purchase date."]]);
sheet("Cash Flow").getRange("B5:N24").format.numberFormat = PHP;

write("Pricing & Margin", "A2", [["Shows whether current price leaves enough margin after date-based purchase and operating costs."]]);
write("Pricing & Margin", "A15:C18", [
  ["Nutrient Purchases Used", null, "All nutrient purchases are expensed on their purchase dates."],
  ["Chemical Purchases Used", null, "All chemical purchases are expensed on their purchase dates."],
  ["Seed/Supply Purchases Used", null, "All seed and supply purchases are expensed on their purchase dates."],
  ["Net Fixed Assets", null, "Asset cost less accumulated depreciation."]
]);
formulas("Pricing & Margin", "B15:B18", [
  ["='Income Statement'!N6"],
  ["='Income Statement'!N7"],
  ["='Income Statement'!N8"],
  ["='Balance Sheet'!N14"]
]);
styleFormulaRange("Pricing & Margin", "B15:B18");
sheet("Pricing & Margin").getRange("B5:B6").format.numberFormat = PHP;
sheet("Pricing & Margin").getRange("B7").format.numberFormat = PCT;
sheet("Pricing & Margin").getRange("B8").format.numberFormat = NUM;
sheet("Pricing & Margin").getRange("B9:B18").format.numberFormat = PHP_DEC;

const monthlySheet = sheet("Crop Cycle Costing");
try {
  monthlySheet.tables.getItem("CropCycleCosting").delete();
} catch {
  // Older workbook copies may not contain table metadata.
}
try {
  monthlySheet.getRange("A1:V1").unmerge();
  monthlySheet.getRange("A2:V2").unmerge();
} catch {
  // Continue when an imported workbook has already normalized merged cells.
}
monthlySheet.deleteAllDrawings();
monthlySheet.getRange("A1:V104").clear();
monthlySheet.name = "Monthly Cost Summary";
monthlySheet.showGridLines = false;

monthlySheet.getRange("A1:N1").merge();
monthlySheet.getRange("A1").values = [["Monthly Cost Summary"]];
monthlySheet.getRange("A1:N1").format = {
  fill: colors.dark,
  font: { bold: true, color: "#FFFFFF", size: 15 },
  horizontalAlignment: "center",
  verticalAlignment: "center"
};
monthlySheet.getRange("A1:N1").format.rowHeightPx = 30;
monthlySheet.getRange("A2:N2").merge();
monthlySheet.getRange("A2").values = [["Date-based profitability: purchases are costs in the month they were purchased; no batch allocation is used."]];
monthlySheet.getRange("A2:N2").format = {
  font: { italic: true, color: "#44546A" },
  wrapText: true
};
monthlySheet.getRange("A2:N2").format.rowHeightPx = 28;
monthlySheet.getRange("A4:N4").values = [[
  "Line Item",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Total / Status"
]];
monthlySheet.getRange("A4:N4").format = {
  fill: colors.teal,
  font: { bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true
};
monthlySheet.getRange("A5:A19").values = [
  ["Net Sales"],
  ["Nutrient Purchases Used"],
  ["Chemical Purchases Used"],
  ["Seed & Supply Purchases Used"],
  ["Production Labor"],
  ["Production Electricity"],
  ["Other Production Expenses"],
  ["Total Production Cost"],
  ["Gross Profit"],
  ["Gross Margin"],
  ["Packs Sold"],
  ["Production Cost / Pack"],
  ["Average Sale Price / Pack"],
  ["Margin / Pack"],
  ["Monthly Status"]
];

const monthlyLinks = {
  5: (column) => `='Income Statement'!${column}5`,
  6: (column) => `='Income Statement'!${column}6`,
  7: (column) => `='Income Statement'!${column}7`,
  8: (column) => `='Income Statement'!${column}8`,
  9: (column) => `='Income Statement'!${column}9`,
  10: (column) => `='Income Statement'!${column}10`,
  11: (column) => `='Income Statement'!${column}11`,
  12: (column) => `=SUM(${column}6:${column}11)`,
  13: (column) => `='Income Statement'!${column}12`,
  14: (column) => `='Income Statement'!${column}13`,
  15: (column) => `='Income Statement'!${column}23`,
  16: (column) => `='Income Statement'!${column}25`,
  17: (column) => `='Income Statement'!${column}24`,
  18: (column) => `='Income Statement'!${column}26`,
  19: (column) =>
    `=IF(${column}5=0,IF(${column}12=0,"No activity","Review"),IF(${column}14>='Setup & Assumptions'!$C$11,"OK","Review"))`
};
for (const [row, maker] of Object.entries(monthlyLinks)) {
  monthlySheet.getRange(`B${row}:M${row}`).formulas = [monthColumns.map((column) => maker(column))];
}
for (const row of [5, 6, 7, 8, 9, 10, 11, 12, 13]) {
  monthlySheet.getRange(`N${row}`).formulas = [[`=SUM(B${row}:M${row})`]];
}
monthlySheet.getRange("N14").formulas = [["=IFERROR(N13/N5,0)"]];
monthlySheet.getRange("N15").formulas = [["=SUM(B15:M15)"]];
monthlySheet.getRange("N16").formulas = [["=IFERROR(N12/N15,0)"]];
monthlySheet.getRange("N17").formulas = [["=IFERROR(N5/N15,0)"]];
monthlySheet.getRange("N18").formulas = [["=N17-N16"]];
monthlySheet.getRange("N19").formulas = [['=IF(COUNTIF(B19:M19,"Review")>0,"Review","OK")']];
monthlySheet.getRange("B5:N13").format.numberFormat = PHP;
monthlySheet.getRange("B14:N14").format.numberFormat = PCT;
monthlySheet.getRange("B15:N15").format.numberFormat = NUM;
monthlySheet.getRange("B16:N18").format.numberFormat = PHP_DEC;
monthlySheet.getRange("B5:N19").format = {
  fill: colors.formula,
  font: { color: colors.green }
};
monthlySheet.getRange("A5:A19").format.font = { color: "#000000" };
monthlySheet.getRange("B19:N19").conditionalFormats.add("containsText", {
  text: "OK",
  format: { fill: colors.paleGreen, font: { color: "#215E33", bold: true } }
});
monthlySheet.getRange("B19:N19").conditionalFormats.add("containsText", {
  text: "Review",
  format: { fill: colors.paleRed, font: { color: "#9C0006", bold: true } }
});
monthlySheet.getRange("A:A").format.columnWidthPx = 230;
for (const column of monthColumns) monthlySheet.getRange(`${column}:${column}`).format.columnWidthPx = 92;
monthlySheet.getRange("N:N").format.columnWidthPx = 125;
for (const column of [..."OPQRSTUV"]) monthlySheet.getRange(`${column}:${column}`).format.columnHidden = true;
monthlySheet.freezePanes.freezeRows(4);
try {
  const table = monthlySheet.tables.add("A4:N19", true, "MonthlyCostSummary");
  table.style = "TableStyleMedium2";
  table.showFilterButton = true;
} catch {
  // The summary remains usable without Excel table metadata.
}

write("Dashboard", "A2", [["Owner-focused summary: date-based sales, purchase costs, cash, assets, pricing, and readiness checks."]]);
write("Dashboard", "A18:A22", [
  ["Direct Purchase Costs"],
  ["Net Fixed Assets"],
  ["Pricing Status"],
  ["Months Needing Review"],
  ["Purchase Records"]
]);
write("Dashboard", "C18:C22", [
  ["Nutrient, chemical, seed, and supply purchases expensed by date."],
  ["Reusable setup asset value after depreciation."],
  ["Compares actual gross margin to target."],
  ["Months with purchase costs but insufficient sales or margin."],
  ["Number of dated nutrient, chemical, seed, and supply purchase rows."]
]);
formulas("Dashboard", "B18:B22", [
  ["=SUM('Income Statement'!N6:N8)"],
  ["='Pricing & Margin'!B18"],
  ["='Pricing & Margin'!B19"],
  ['=COUNTIF(\'Monthly Cost Summary\'!$B$19:$M$19,"Review")'],
  ["=COUNTA('Nutrient Purchases'!$B$5:$B$504)+COUNTA('Chemical Purchases'!$B$5:$B$504)+COUNTA('Seed & Supply Purchases'!$B$5:$B$504)"]
]);
write("Dashboard", "A23:A29", [
  ["How Date-Based Costing Works"],
  ["1. Record every sale using its actual date and product."],
  ["2. Record each nutrient, chemical, seed, and supply purchase once."],
  ["3. Every purchase is considered used and becomes cost on its purchase date."],
  ["4. No batch, tank, top-up, separate usage, or inventory entry is required."],
  ["5. Electricity, labor, and other expenses follow their actual dates."],
  ["6. Reusable setup items remain fixed assets and are depreciated."]
]);
styleFormulaRange("Dashboard", "B18:B22");
sheet("Dashboard").getRange("B18:B19").format.numberFormat = PHP;
sheet("Dashboard").getRange("B21:B22").format.numberFormat = "0";

write("Model Checks", "A10:G10", [[
  "Purchase costs tie to dated purchase ledgers",
  null,
  0,
  null,
  1,
  null,
  "Income Statement purchase costs should equal purchase-ledger totals for the fiscal year."
]]);
const purchaseTieFormula =
  `=ABS('Income Statement'!N6-SUMIFS('Nutrient Purchases'!$E$5:$E$504,'Nutrient Purchases'!$A$5:$A$504,">="&DATE('Setup & Assumptions'!$C$5,1,1),'Nutrient Purchases'!$A$5:$A$504,"<="&DATE('Setup & Assumptions'!$C$5,12,31)))` +
  `+ABS('Income Statement'!N7-SUMIFS('Chemical Purchases'!$F$5:$F$504,'Chemical Purchases'!$A$5:$A$504,">="&DATE('Setup & Assumptions'!$C$5,1,1),'Chemical Purchases'!$A$5:$A$504,"<="&DATE('Setup & Assumptions'!$C$5,12,31)))` +
  `+ABS('Income Statement'!N8-SUMIFS('Seed & Supply Purchases'!$F$5:$F$504,'Seed & Supply Purchases'!$A$5:$A$504,">="&DATE('Setup & Assumptions'!$C$5,1,1),'Seed & Supply Purchases'!$A$5:$A$504,"<="&DATE('Setup & Assumptions'!$C$5,12,31)))`;
formulas("Model Checks", "B10:F10", [[purchaseTieFormula, "", "=ABS(B10-C10)", "", '=IF(D10<=E10,"OK","Review")']]);

write("Model Checks", "A14:G14", [[
  "Monthly cost summary ties to Income Statement",
  null,
  0,
  null,
  1,
  null,
  "Monthly production costs should match the Income Statement."
]]);
const monthlyTieTerms = monthColumns.map(
  (column) => `ABS('Monthly Cost Summary'!${column}12-SUM('Income Statement'!${column}6:${column}11))`
);
formulas("Model Checks", "B14:F14", [[`=SUM(${monthlyTieTerms.join(",")})`, "", "=ABS(B14-C14)", "", '=IF(D14<=E14,"OK","Review")']]);

const sampleCells = [
  "'Sales Register'!M5",
  "'Sales Register'!M6",
  "'Sales Register'!M7",
  "'Sales Register'!M8",
  "'Sales Register'!M9",
  "'Sales Register'!M10",
  "Electricity!Q5",
  "Electricity!Q6",
  "Electricity!Q7",
  "'Nutrient Purchases'!J5",
  "'Nutrient Purchases'!J6",
  "'Nutrient Purchases'!J7",
  "'Nutrient Purchases'!J8",
  "'Nutrient Purchases'!J9",
  "'Nutrient Purchases'!J10",
  "'Nutrient Purchases'!J11",
  "'Seed & Supply Purchases'!J5",
  "'Seed & Supply Purchases'!J6",
  "'Seed & Supply Purchases'!J7",
  "'Seed & Supply Purchases'!J8",
  "'Chemical Purchases'!J5",
  "'Chemical Purchases'!J6",
  "'Chemical Purchases'!J7",
  "'Chemical Purchases'!J8",
  "Labor!K5",
  "Labor!K6",
  "'Fixed Assets'!N5",
  "'Fixed Assets'!N6",
  "'Fixed Assets'!N7",
  "'Fixed Assets'!N8",
  "'Fixed Assets'!N9",
  "'Fixed Assets'!N10",
  "'Financing & Equity'!H5",
  "'Financing & Equity'!H6",
  "'Financing & Equity'!H7",
  "'Financing & Equity'!H8",
  "'Other Expenses'!J5",
  "'Other Expenses'!J6"
];
const sampleFormula = `=SUM(${sampleCells
  .map(
    (cell) =>
      `IF(OR(IFERROR(SEARCH("sample",${cell}),0)>0,IFERROR(SEARCH("replace",${cell}),0)>0,IFERROR(SEARCH("enter actual",${cell}),0)>0),1,0)`
  )
  .join(",")})`;
formulas("Model Checks", "B15:F15", [[sampleFormula, "", "=B15", "", '=IF(B15=0,"OK","Replace sample rows")']]);
styleFormulaRange("Model Checks", "B10:F15");

sheet("Sources & Guide").getRange("A5:F29").clear();
write("Sources & Guide", "A5:F13", [
  ["Purchase-as-usage policy", "Every nutrient, chemical, seed, and supply purchase is expensed on its purchase date.", "Matches the owner's simplified operating method and removes duplicate usage entry.", "Owner operating method", "Date-based revision 2026-06-07.", "Purchase ledgers; Income Statement"],
  ["Greenhouse costing", "Revenue, purchase costs, labor, energy, overhead, depreciation, and profit remain separated.", "Provides pricing and profitability signals instead of only cash sales.", "https://journals.ashs.org/downloadpdf/view/journals/horttech/2/3/article-p420.pdf", "Greenhouse cost accounting article.", "Income Statement; Pricing & Margin"],
  ["Enterprise budget structure", "Revenue is shown first, followed by production costs, overhead, and profit.", "Supports a clear monthly operating view.", "https://faculty.tamuc.edu/jlopez/documents/2013-10-05-NTICD-Lopez-and-Fortenberry-Budgeting-A-Greenhouse.pdf", "Greenhouse budgeting reference.", "Income Statement"],
  ["Overhead and depreciation", "Reusable assets are capitalized and depreciated; electricity and repairs remain separate.", "Reusable structures and equipment are not fully expensed in one month.", "https://www.growertalks.com/Article/?articleID=16706&srch=1", "Greenhouse overhead discussion.", "Fixed Assets; Balance Sheet"],
  ["Electricity", "Monthly device kWh equals watts x quantity x hours/day x days used / 1,000, multiplied by rate.", "Allows changing pump capacity and electricity rates by date.", "https://www.energy.gov/energysaver/estimating-appliance-and-home-electronic-energy-use", "Formula reference for kWh estimation.", "Electricity"],
  ["Wage rate", "The editable Bohol/Region VII wage assumption is converted to an hourly rate.", "Labor is costed from actual dated hours worked.", "https://nwpc.dole.gov.ph/region-vii/", "ROVII-26 reference; confirm current classification.", "Setup & Assumptions; Labor"],
  ["Accounting limitation", "This is a management accounting model, not an audited, tax, or IFRS statement.", "Formal agricultural reporting may require different treatment.", "https://www.ifrs.org/issued-standards/list-of-standards/ias-41-agriculture/", "Use an accountant for tax or audited reporting.", "Sources & Guide"],
  ["Sales by pack", "Record packs sold using the actual sale date and product.", "Produces price, cost, and margin per pack without a batch code.", "Owner operating method", "Sales are date-focused.", "Sales Register; Pricing & Margin"],
  ["Version", "Revised by Codex", "Date-based purchase-as-usage model.", "Local build", "2026-06-07 date-based revision", "All sheets"]
]);
write("Sources & Guide", "A15:F15", [["Step", "What to update", "Why", "How often", "Sheet", "Important Notes"]]);
write("Sources & Guide", "A16:F24", [
  [1, "Replace sample rows", "Sample rows drive initial formulas and examples.", "Before use", "Input ledgers", "Dashboard flags sample rows until replaced."],
  [2, "Enter actual packs sold", "Sales and margin are based on dated product sales.", "Every sale", "Sales Register", "No batch code is needed."],
  [3, "Enter nutrient purchases", "The full purchase becomes cost on its date.", "When purchased", "Nutrient Purchases", "Do not enter a second usage record."],
  [4, "Enter seed and supply purchases", "The full purchase becomes cost on its date.", "When purchased", "Seed & Supply Purchases", "Includes seeds, cocopeat, plugs, and packaging."],
  [5, "Enter chemical purchases", "The full purchase becomes cost on its date.", "When purchased", "Chemical Purchases", "Includes insecticide, fungicide, and grassicide."],
  [6, "Enter electricity rate and device use", "Energy cost follows the dated month.", "Monthly", "Electricity", "kWh = watts x qty x hours x days / 1,000."],
  [7, "Enter labor hours", "Labor is part of true production cost.", "Per work session", "Labor", "No batch code is needed."],
  [8, "Enter fixed assets and financing", "Assets, depreciation, cash, and liabilities remain linked.", "When transactions occur", "Fixed Assets; Financing & Equity", "Use actual transaction dates."],
  [9, "Review monthly profitability", "Shows cost and margin by month.", "Monthly", "Monthly Cost Summary", "All calculations follow transaction dates."]
]);

for (const name of deletedSheets) {
  sheet(name).delete();
}

const staleReferences = [];
const sheetScan = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 10000 });
const remainingNames = sheetScan.ndjson
  .split("\n")
  .filter(Boolean)
  .map((line) => JSON.parse(line).name);
for (const name of remainingNames) {
  const used = sheet(name).getUsedRange();
  if (!used) continue;
  const allFormulas = used.formulas.flat().filter(Boolean);
  for (const formula of allFormulas) {
    for (const deleted of deletedSheets) {
      if (formula.includes(deleted)) staleReferences.push(`${name}: ${formula}`);
    }
    if (formula.includes("Crop Cycle Costing")) staleReferences.push(`${name}: ${formula}`);
  }
}
if (staleReferences.length) {
  throw new Error(`Stale deleted-sheet references remain:\n${staleReferences.slice(0, 20).join("\n")}`);
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(
  JSON.stringify({
    inputPath,
    outputPath,
    sheetCount: remainingNames.length,
    sheets: remainingNames,
    deletedSheets
  })
);

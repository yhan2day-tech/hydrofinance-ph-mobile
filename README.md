# Hydroponics Financial Statements

Hydroponics Financial Statements is a free, offline-first phone app that follows the contents and flow of the hydroponics owner financial model v3 workbook while keeping the source Excel file unchanged.

The app mirrors the workbook ledgers from:

`B:\PERSONAL\HYDROPONICS\outputs\hydroponics_financial_statement_template\hydroponics_financial_statement_owner_model_v3_pack_sales.xlsx`

This is a separate app. It is not merged with HydroCheck PH Free V3 and does not share that app's storage.

## What It Tracks

The app follows the Excel workbook flow:

1. Dashboard
2. Setup & Assumptions
3. Sales Register
4. Electricity
5. Tank & Top-up Log
6. Nutrient Purchases
7. Nutrient Mixing Usage
8. Seed & Supply Purchases
9. Seed & Supply Usage
10. Chemical Purchases
11. Chemical Usage
12. Labor
13. Fixed Assets
14. Financing & Equity
15. Other Expenses
16. Inventory Summary
17. Income Statement
18. Balance Sheet
19. Cash Flow
20. Pricing & Margin
21. Crop Cycle Costing
22. Model Checks
23. Sources & Guide
24. Sync & Export

Input sheets use mobile forms and cards. Statement, check, and source sheets use app-styled report panels with the copied Excel content.

## Important Phone Limitation

An Android browser cannot directly edit a Windows file at `B:\...`. This app saves its own phone copy locally, then exports:

- JSON backup for full restore/import
- CSV per sheet
- Excel-compatible `.xls` workbook that opens in Microsoft Excel

Use the export file to copy or review phone updates back on the PC workbook.

The source Excel workbook remains unchanged unless you later choose to manually update it on the PC.

## Local Run

```powershell
node server.mjs
```

Then open:

```text
http://localhost:5176/
```

## Test

```powershell
node --test tests/*.test.mjs
```

## Android Install

Open the GitHub Pages link in Chrome on Android, then choose **Add to Home screen** or tap the install prompt if Chrome shows it.

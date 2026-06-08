# HydroFS

HydroFS is a free, offline-first phone app that follows the contents and flow of the hydroponics owner financial model v3 workbook.

The app mirrors the workbook ledgers from:

`B:\PERSONAL\HYDROPONICS\outputs\hydroponics_financial_statement_template\hydroponics_financial_statement_owner_model_v3_pack_sales.xlsx`

This is a separate app. It is not merged with HydroCheck PH Free V3 and does not share that app's storage.

## What It Tracks

The app follows the Excel workbook flow:

1. Dashboard
2. Setup & Assumptions
3. Sales Register
4. Electricity
5. Nutrient Purchases
6. Seed & Supply Purchases
7. Chemical Purchases
8. Labor
9. Fixed Assets
10. Financing & Equity
11. Other Expenses
12. Income Statement
13. Balance Sheet
14. Cash Flow
15. Pricing & Margin
16. Monthly Cost Summary
17. Model Checks
18. Sources & Guide
19. Sync & Export

Input sheets use mobile forms and cards. Statement, check, and source sheets use app-styled report panels with the copied Excel content.

## Date-Based Cost Policy

- Batch/cycle tracking is no longer used.
- Nutrient, seed/supply, and chemical purchases are treated as usage and expense on the purchase date.
- Reports group activity by date and month.
- Tank/top-up, usage, inventory, and crop-cycle screens have been removed.

## Important Phone Limitation

An Android browser cannot directly edit a Windows file at `B:\...`. This app saves its own phone copy locally, then exports:

- JSON backup for full restore/import
- CSV per sheet
- Excel-compatible `.xls` workbook that opens in Microsoft Excel

Use the export file to copy or review phone updates back on the PC workbook.

The app export remains a separate phone file. It does not directly overwrite the Windows workbook.

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

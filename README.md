# HydroFinance PH

HydroFinance PH is a free, offline-first phone app for updating the hydroponics owner financial model v3 while away from the PC.

The app mirrors the workbook ledgers from:

`B:\PERSONAL\HYDROPONICS\outputs\hydroponics_financial_statement_template\hydroponics_financial_statement_owner_model_v3_pack_sales.xlsx`

## What It Tracks

- Setup and assumptions
- Sales register
- Nutrient, seed/supply, and chemical purchases
- Nutrient, seed/supply, and chemical usage with weighted-average cost
- Tank and top-up logs
- Labor
- Electricity
- Fixed assets and depreciation
- Other expenses
- Financing and equity
- Crop-cycle costing
- Dashboard, cash estimate, model checks, CSV, JSON, and Excel-compatible export

## Important Phone Limitation

An Android browser cannot directly edit a Windows file at `B:\...`. This app saves its own phone copy locally, then exports:

- JSON backup for full restore/import
- CSV per sheet
- Excel-compatible `.xls` workbook that opens in Microsoft Excel

Use the export file to copy or review phone updates back on the PC workbook.

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

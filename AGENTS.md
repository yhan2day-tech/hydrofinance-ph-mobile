# Agent Notes

- Keep this as a static, no-cost PWA: no paid API, no backend, no account requirement.
- Keep this app completely separate from `hydrocheck-ph-free-v3`; do not merge their code, repos, or storage.
- The app is named `HydroFS`; preserve that visible app name and install name.
- The app should look and behave like a mobile app, but the screen order and content flow must follow the source Excel workbook sheet order.
- Preserve local-first storage through IndexedDB with localStorage fallback.
- The app must remain usable on Android Chrome through GitHub Pages.
- Use the workbook naming and ledger structure from the hydroponics owner model v3 pack sales workbook.
- Treat `B:\PERSONAL\HYDROPONICS\outputs\hydroponics_financial_statement_template\hydroponics_financial_statement_owner_model_v3_pack_sales.xlsx` as read-only unless the user explicitly asks to update the workbook itself.
- When forms include a hidden `name="id"` input, always read the form element identity with `form.getAttribute("id")`.

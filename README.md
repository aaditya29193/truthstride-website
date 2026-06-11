# TruthStride Landing Page

This project is a Next.js landing page with a waitlist form. The form submits to a Next.js API route at `/api/waitlist`, and that route can forward each signup into a Google Sheet through a Google Apps Script webhook.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment setup

Create a local env file:

```bash
cp .env.example .env.local
```

Then set:

```bash
GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/your-web-app-id/exec
```

If `GOOGLE_SCRIPT_URL` is missing, the form still renders and the API route still validates submissions, but entries will not be forwarded to Google Sheets yet.

## Connect to Google Sheets

1. Create a Google Sheet with headers in row 1:
   `submittedAt`, `name`, `email`, `company`
2. In the sheet, open `Extensions -> Apps Script`.
3. Replace the default script with this:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.name || "",
    data.email || "",
    data.company || "",
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
```

4. Click `Deploy -> New deployment`.
5. Choose `Web app`.
6. Set access to `Anyone` or `Anyone with the link`.
7. Copy the web app URL into `GOOGLE_SCRIPT_URL`.

## Project structure

- `src/app/page.tsx`: landing page content and layout
- `src/components/waitlist-form.tsx`: client-side form UX
- `src/app/api/waitlist/route.ts`: validation and forwarding logic

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

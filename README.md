# מטריקס גשם — Matrix Rain

אפליקציית דסקטופ פשוטה (Electron) עם אפקט הגשם הירוק של מטריקס.
עובדת על **מק / ווינדוס / לינוקס**.

## הרצה מהירה

```bash
cd matrix-app
npm install
npm start
```

ייפתח חלון הגדרות בעברית. בחר צבע / מהירות / צפיפות וכו׳ ולחץ **התחל**.
`Esc` או כל מקש / לחיצה — חוזר להגדרות.
ההגדרות נשמרות אוטומטית בין הפעלות.

## אריזה (אופציונלי)

לאחר `npm install`:

```bash
npm run dist:mac     # dmg + zip
npm run dist:win     # portable + nsis
npm run dist:linux   # AppImage
```

הקבצים יופיעו תחת `dist/`. מומלץ לארוז על אותו מערכת הפעלה של היעד.

## קבצים

- `main.js` — תהליך ראשי, IPC ושמירת הגדרות
- `preload.js` — גשר מאובטח לרנדרר
- `settings.html` / `settings.js` — ממשק ההגדרות
- `matrix.html` / `matrix.js` — אפקט ה-canvas

נהנה 🟢

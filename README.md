# Matrix Rain

A simple Electron desktop app with the classic Matrix digital rain effect.
Works on **macOS / Windows / Linux**.

## Quick start

```bash
cd matrix-rain
npm install
npm start
```

A settings window opens. Pick color, speed, density and more, then hit **Start**.
`Esc`, any key, or a click returns to settings.
Your settings are saved automatically between launches.

## Packaging (optional)

After `npm install`:

```bash
npm run dist:mac     # dmg + zip
npm run dist:win     # portable + nsis
npm run dist:linux   # AppImage
```

Artifacts land under `dist/`. Package on the same OS as your target platform.

## Files

- `main.js` — main process, IPC and config persistence
- `preload.js` — secure bridge into the renderer
- `settings.html` / `settings.js` — settings UI
- `matrix.html` / `matrix.js` — canvas rain effect

Enjoy 🟢

// תהליך ראשי: חלונות, שמירת הגדרות ו-IPC
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const fs = require('fs');

const DEFAULTS = {
  color: '#00ff00',
  speed: 50,
  density: 100,
  fontSize: 18,
  charset: 'katakana',
  customText: 'TRUSTNO1',
  fade: 50,
  fullscreen: true
};

const cfgPath = () => path.join(app.getPath('userData'), 'config.json');

function loadConfig() {
  try {
    return { ...DEFAULTS, ...JSON.parse(fs.readFileSync(cfgPath(), 'utf8')) };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveConfig(cfg) {
  fs.mkdirSync(path.dirname(cfgPath()), { recursive: true });
  fs.writeFileSync(cfgPath(), JSON.stringify(cfg, null, 2));
}

let settingsWin = null;
let matrixWin = null;

const webPrefs = {
  preload: path.join(__dirname, 'preload.js'),
  contextIsolation: true,
  nodeIntegration: false
};

function createSettings() {
  settingsWin = new BrowserWindow({
    width: 460,
    height: 740,
    resizable: false,
    backgroundColor: '#0b0f0c',
    title: 'Matrix Rain',
    autoHideMenuBar: true,
    webPreferences: webPrefs
  });
  settingsWin.loadFile('settings.html');
  settingsWin.on('closed', () => {
    settingsWin = null;
    if (!matrixWin) app.quit();
  });
}

function startMatrix(cfg) {
  saveConfig(cfg);
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  if (matrixWin) {
    matrixWin.close();
    matrixWin = null;
  }
  matrixWin = new BrowserWindow({
    width: Math.round(width * 0.85),
    height: Math.round(height * 0.85),
    fullscreen: !!cfg.fullscreen,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    title: 'Matrix',
    webPreferences: webPrefs
  });
  matrixWin.loadFile('matrix.html');
  matrixWin.webContents.on('did-finish-load', () => {
    matrixWin.webContents.send('matrix-config', cfg);
  });
  matrixWin.on('closed', () => {
    matrixWin = null;
    if (settingsWin) {
      settingsWin.show();
      settingsWin.focus();
    } else {
      createSettings();
    }
  });
  if (settingsWin) settingsWin.hide();
}

ipcMain.handle('get-config', () => loadConfig());
ipcMain.handle('save-config', (_e, cfg) => {
  saveConfig({ ...DEFAULTS, ...cfg });
  return true;
});
ipcMain.handle('start-matrix', (_e, cfg) => {
  startMatrix({ ...DEFAULTS, ...cfg });
  return true;
});
ipcMain.handle('close-matrix', () => {
  if (matrixWin) matrixWin.close();
  return true;
});

app.whenReady().then(createSettings);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createSettings();
});

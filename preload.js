// Secure bridge between the renderer and the main process
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('matrixAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (cfg) => ipcRenderer.invoke('save-config', cfg),
  startMatrix: (cfg) => ipcRenderer.invoke('start-matrix', cfg),
  closeMatrix: () => ipcRenderer.invoke('close-matrix'),
  onMatrixConfig: (cb) => {
    ipcRenderer.on('matrix-config', (_e, cfg) => cb(cfg));
  }
});

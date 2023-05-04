const { contextBridge, ipcRenderer } = require('electron')

const api = {
  ping: () => ipcRenderer.invoke('ping'),
  pingData: (data) => ipcRenderer.invoke('pingData', data),
  rssParseUrl: (url) => ipcRenderer.invoke('rssParseUrl', url)
}

// an api that exposes only specific
// functionality to node modules (for security)
contextBridge.exposeInMainWorld('electronAPI', api)

const { app, BrowserWindow, ipcMain, Menu, MenuItem } = require('electron')
const electronReload = require('electron-reload')
const path = require('path')
const { parseUrl } = require('./rss')

// Reload the app whenever the build changes
electronReload('./build')

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    title: 'CS404 RSS Aggregator',
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: true,
      contextIsolation: true
    },
    show: false
  })

  const menu = new Menu()
  const devTools = new MenuItem({
    label: 'Toggle Developer Tools',
    role: 'toggleDevTools'
  })
  menu.insert(0, devTools)
  Menu.setApplicationMenu(menu)

  // load the index.html from a url
  win.loadFile('./build/index.html')

  win.maximize()
  win.show()

  // Open the DevTools.
  // win.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle('ping', (event) => {
    console.log('ping')
    return 'pong'
  })
  ipcMain.handle('pingData', (event, data) => {
    return 'pong: ' + data
  })
  ipcMain.handle('rssParseUrl', async (event, url) => {
    // pass error as well
    return await parseUrl(url).catch((err) => { console.log(err); return { error: true, message: JSON.stringify(err) } })
  })
  createWindow()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

const electron = require('electron')
const { app, BrowserWindow, Menu, shell } = require('electron')
// const shell = require('electron').shell
const ipc = electron.ipcMain
// For refreshing the app automatically upon certain file changes
require('electron-reload')(__dirname)

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: __dirname + '/assets/img/icon-main.png'
    // webPreferences: {
    //     preload: path.join(app.getAppPath(), 'preload.js')
    // }
  })

  // and load the index.html of the app.
  win.loadFile('src/index.html')

  // Open the DevTools.
  // win.webContents.openDevTools()

  // Create Menu on window
  var menu = Menu.buildFromTemplate([
      {
          label: 'Menu',
          submenu: [
              {
                label: 'Adjust Notification Value'
              },
              {
                  role: 'reload'
              },
              {
                label: 'BDT Market Rate',
                click() {
                    shell.openExternal('https://min-api.cryptocompare.com/')
                }
              },
              { type: 'separator' },
              {
                label: 'Exit',
                click() {
                    app.quit();
                }
              }
          ]
      },
      {
          label: 'Help',
          submenu: [
              {
                  label: 'Documentation'
              },
              {
                  label: 'Support'
              }
          ]
      }
  ])

  Menu.setApplicationMenu(menu);

// IPC value catch from ipc.renderer on add.js
ipc.on('update-notify-value', function(event, arguments) {
    win.webContents.send('targetPriceValue', arguments);
})

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


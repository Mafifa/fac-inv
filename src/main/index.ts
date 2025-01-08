import { app, shell, BrowserWindow, dialog, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'
import { setupControllers } from './controllers'
import { setupConfigHandlers } from './settings/configStore'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function setupAutoUpdater(): void {
  autoUpdater.autoDownload = true
  autoUpdater.autoInstallOnAppQuit = true

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...')
  })

  autoUpdater.on('update-available', (info) => {
    console.log('Update available.', info)
    // La actualización se descargará automáticamente
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available.', info)
  })

  autoUpdater.on('error', (err) => {
    console.error('Error in auto-updater. ', err)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    const progressData = {
      percent: progressObj.percent.toFixed(2),
      speed: (progressObj.bytesPerSecond / 1024).toFixed(2),
      transferred: (progressObj.transferred / (1024 * 1024)).toFixed(2),
      total: (progressObj.total / (1024 * 1024)).toFixed(2)
    }
    console.log('Download progress', progressData)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded', info)
    if (mainWindow) {
      dialog
        .showMessageBox(mainWindow, {
          type: 'info',
          title: 'Actualización lista',
          message: `La actualización ${info.version} se ha descargado e instalado. Es necesario reiniciar la aplicación para aplicar los cambios. ¿Quieres reiniciar ahora?`,
          buttons: ['Reiniciar', 'Más tarde']
        })
        .then((result) => {
          if (result.response === 0) {
            autoUpdater.quitAndInstall()
          }
        })
    }
  })
}

function checkForUpdates(): void {
  autoUpdater.checkForUpdates().catch((err) => {
    console.error('Error al buscar actualizaciones:', err)
  })
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  setupConfigHandlers()
  setupAutoUpdater()
  setupControllers()

  checkForUpdates()
  setInterval(checkForUpdates, 2 * 60 * 60 * 1000) // Comprobar actualizaciones cada 2 horas

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.on('check-for-updates', () => {
    checkForUpdates()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('quit', () => {
  mainWindow = null
})

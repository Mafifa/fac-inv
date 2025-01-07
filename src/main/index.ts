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
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...')
  })

  autoUpdater.on('update-available', (info) => {
    console.log('Update available.', info)

    // Enviar información de la actualización al frontend
    if (mainWindow) {
      mainWindow.webContents.send('update-available', {
        version: info.version,
        releaseDate: info.releaseDate,
        files: info.files
      })

      // Mostrar también una ventana de diálogo opcional (puedes mantener esto si lo deseas)
      dialog
        .showMessageBox(mainWindow, {
          type: 'info',
          title: 'Actualización disponible',
          message: `Hay una nueva versión disponible: ${info.version}. ¿Quieres descargarla ahora?`,
          buttons: ['Sí', 'No']
        })
        .then((result) => {
          if (result.response === 0) {
            autoUpdater.downloadUpdate().catch((err) => {
              console.error('Error al descargar la actualización:', err)
              dialog.showErrorBox(
                'Error de actualización',
                'Hubo un error al descargar la actualización.'
              )
            })
          }
        })
    }
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available.', info)
  })

  autoUpdater.on('error', (err) => {
    console.error('Error in auto-updater. ', err)
    if (mainWindow) {
      dialog.showErrorBox(
        'Error de actualización',
        'Ocurrió un error durante el proceso de actualización.'
      )
    }
  })

  autoUpdater.on('download-progress', (progressObj) => {
    const progressData = {
      percent: progressObj.percent.toFixed(2),
      speed: (progressObj.bytesPerSecond / 1024).toFixed(2), // Velocidad en KB/s
      transferred: (progressObj.transferred / (1024 * 1024)).toFixed(2), // En MB
      total: (progressObj.total / (1024 * 1024)).toFixed(2) // En MB
    }

    if (mainWindow) {
      mainWindow.webContents.send('download-progress', progressData) // Enviar datos al renderizador
    }
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded', info)
    if (mainWindow) {
      dialog
        .showMessageBox(mainWindow, {
          type: 'info',
          title: 'Actualización lista',
          message: `La actualización ${info.version} se ha descargado. ¿Quieres reiniciar para instalarla ahora?`,
          buttons: ['Reiniciar', 'Después']
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
    if (mainWindow) {
      dialog.showErrorBox(
        'Error de actualización',
        'No se pudo buscar actualizaciones. Por favor, inténtalo más tarde.'
      )
    }
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
  setInterval(checkForUpdates, 2 * 60 * 60 * 1000)

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

import { app, shell, BrowserWindow, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'
import { setupControllers } from './controllers'
import { setupConfigHandlers } from './settings/configStore'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
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
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Function to initialize the auto-updater
function setupAutoUpdater(): void {
  autoUpdater.autoDownload = false // Control when to download updates
  autoUpdater.autoInstallOnAppQuit = false // Prevent automatic installation without user consent

  // Check for updates when the app starts
  autoUpdater.checkForUpdates()

  // Event: Update available
  autoUpdater.on('update-available', () => {
    const userResponse = dialog.showMessageBoxSync({
      type: 'info',
      title: 'Actualización disponible',
      message: 'Hay una nueva versión disponible. ¿Quieres descargarla ahora?',
      buttons: ['Sí']
    })

    if (userResponse === 0) {
      // User selected "Sí"
      autoUpdater.downloadUpdate()
    }
  })

  // Event: Download progress
  autoUpdater.on('download-progress', (progress) => {
    console.log(`Descargando: ${progress.percent.toFixed(2)}%`)
  })

  // Event: Update downloaded
  autoUpdater.on('update-downloaded', () => {
    const userResponse = dialog.showMessageBoxSync({
      type: 'info',
      title: 'Actualización lista',
      message: 'La actualización se ha descargado. ¿Quieres reiniciar para instalarla ahora?',
      buttons: ['Reiniciar', 'Después']
    })

    if (userResponse === 0) {
      // User selected "Reiniciar"
      autoUpdater.quitAndInstall()
    }
  })

  // Event: No updates available
  autoUpdater.on('update-not-available', () => {
    console.log('No hay actualizaciones disponibles.')
  })

  // Event: Error during update process
  autoUpdater.on('error', (err) => {
    console.error('Error durante la actualización:', err)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  setupConfigHandlers()
  setupAutoUpdater() // Initialize the auto-updater

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Setup controllers
  setupControllers()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

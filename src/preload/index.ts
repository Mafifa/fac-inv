import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (_, progressData) => {
      callback(progressData)
    })
  },
  onUpdateAvailable: (callback: (info: { version: string; releaseNotes: string }) => void) => {
    ipcRenderer.on('update-available', (_, info) => {
      callback(info)
    })
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

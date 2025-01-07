import { ElectronAPI } from '@electron-toolkit/preload'

interface API {
  onUpdateAvailable: (callback: (info: any) => void) => void
  onDownloadProgress: (callback: any) => void
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}

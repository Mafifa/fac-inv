import Store from 'electron-store'
import { ipcMain } from 'electron'

interface ConfigStore {
  tasaCambioInventario: string
  tasaPersonalizadaInventario: number | null
  tasaCambioFacturacion: string
  tasaPersonalizadaFacturacion: number | null
  modalidadBolivarParalelo: boolean
  idioma: 'es' | 'en'
  modoOscuro: boolean
}

const store = new Store<ConfigStore>({
  defaults: {
    tasaCambioInventario: 'promedio',
    tasaPersonalizadaInventario: null,
    tasaCambioFacturacion: 'promedio',
    tasaPersonalizadaFacturacion: null,
    modalidadBolivarParalelo: false,
    idioma: 'es',
    modoOscuro: false
  }
})

export const setupConfigHandlers = () => {
  ipcMain.handle('get-config', (_, key: keyof ConfigStore) => {
    return store.get(key)
  })

  ipcMain.handle('set-config', (_, key: keyof ConfigStore, value: any) => {
    store.set(key, value)
    return true
  })

  ipcMain.handle('get-all-config', () => {
    return store.store
  })
}

import { IpcMain } from 'electron'
import { getTasasDolar, updateTasaDolar } from '../models/tasasDolar'
import { fetchTasas } from '../services/dolarApi'

export async function setupTasasDolarController(ipcMain: IpcMain) {
  ipcMain.handle('get-tasas-historicas', async () => {
    return await getTasasDolar()
  })

  ipcMain.handle('update-tasas', async () => {
    const tasas = await fetchTasas()
    await updateTasaDolar(tasas)
    console.log('Actualizacion realizada')
  })

  // Para registrar las tasas al momento de actualizar la aplicacion
  try {
    const tasas = await fetchTasas()
    await updateTasaDolar(tasas).then(() => {})
  } catch (error) {
    console.error('Error al actualizar tasas de dolar:', error)
  }
}

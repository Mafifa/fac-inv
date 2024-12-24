import { IpcMain } from 'electron'
import { getProductos, realizarVenta } from '../models/sales'

export function setupSalesController(ipcMain: IpcMain): void {
  ipcMain.handle('get-productos-venta', async () => {
    return await getProductos()
  })

  ipcMain.handle('realizar-venta', async (_, carrito, tasaDolar) => {
    return await realizarVenta(carrito, tasaDolar)
  })
}


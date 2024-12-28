import { IpcMain } from 'electron'
import { getProductos, realizarVenta, registrarPago } from '../models/sales'

export function setupSalesController(ipcMain: IpcMain): void {
  ipcMain.handle('get-productos-venta', async (_, pagina: number, busqueda: string) => {
    return await getProductos(pagina, busqueda)
  })

  ipcMain.handle('realizar-venta', async (_, carrito, tasaDolar) => {
    return await realizarVenta(carrito, tasaDolar)
  })

  ipcMain.handle('registrar-pago', async (_, idVenta, metodoPago, montoPagado, monedaCambio) => {
    await registrarPago(idVenta, metodoPago, montoPagado, monedaCambio)
  })
}

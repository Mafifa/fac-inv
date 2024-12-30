import { IpcMain } from 'electron'
import { getVentas, registrarPago } from '../models/payments'

export function setupPaymentsController(ipcMain: IpcMain): void {
  ipcMain.handle('get-ventas', async () => {
    return await getVentas()
  })

  ipcMain.handle('registrar-pago', async (_, id_venta, metodo_pago, monto, moneda_cambio) => {
    return await registrarPago(id_venta, metodo_pago, monto, moneda_cambio)
  })
}


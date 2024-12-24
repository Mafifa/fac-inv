import { IpcMain } from 'electron'
import { getProductos, addProducto, updateProducto, disableProducto } from '../models/inventory'

export function setupInventoryController(ipcMain: IpcMain): void {
  ipcMain.handle('get-productos', async () => {
    return await getProductos()
  })

  ipcMain.handle('add-producto', async (_, producto) => {
    return await addProducto(producto)
  })

  ipcMain.handle('update-producto', async (_, producto) => {
    return await updateProducto(producto)
  })

  ipcMain.handle('disable-producto', async (_, id) => {
    return await disableProducto(id)
  })
}


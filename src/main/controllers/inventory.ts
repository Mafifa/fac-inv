import { IpcMain } from 'electron'
import {
  getProductosRecientes,
  addProducto,
  updateProducto,
  disableProducto,
  deleteProducto
} from '../models/inventory'

export function setupInventoryController(ipcMain: IpcMain): void {
  ipcMain.handle('get-productos-recientes', async (_, page: number, searchQuery: string | null) => {
    try {
      return await getProductosRecientes(page, searchQuery)
    } catch (error) {
      console.error('Error al obtener productos recientes:', error)
      throw new Error('Error al obtener productos recientes')
    }
  })

  ipcMain.handle('add-producto', async (_, producto) => {
    try {
      return await addProducto(producto)
    } catch (error) {
      console.error('Error al agregar producto:', error)
      throw new Error('Error al agregar producto')
    }
  })

  ipcMain.handle('update-producto', async (_, producto) => {
    try {
      return await updateProducto(producto)
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      throw new Error('Error al actualizar producto')
    }
  })

  ipcMain.handle('disable-producto', async (_, id) => {
    try {
      return await disableProducto(id)
    } catch (error) {
      console.error('Error al deshabilitar producto:', error)
      throw new Error('Error al deshabilitar producto')
    }
  })

  ipcMain.handle('delete-producto', async (_, id) => {
    try {
      return await deleteProducto(id)
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      throw new Error('Error al eliminar producto')
    }
  })
}

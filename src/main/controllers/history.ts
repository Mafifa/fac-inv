import { IpcMain } from 'electron'
import { getSalesHistory, getSaleDetails, getTotalSalesCount } from '../models/history'

export function setupSalesHistoryController(ipcMain: IpcMain) {
  ipcMain.handle('get-sales-history', async (_, page: number, itemsPerPage: number) => {
    try {
      const offset = (page - 1) * itemsPerPage
      const salesHistory = await getSalesHistory(offset, itemsPerPage)
      const totalCount = await getTotalSalesCount()
      return { sales: salesHistory, totalCount }
    } catch (error) {
      console.error('Error fetching sales history:', error)
      throw error
    }
  })

  ipcMain.handle('get-sale-details', async (_, id: number) => {
    try {
      const saleDetails = await getSaleDetails(id)
      return saleDetails
    } catch (error) {
      console.error('Error fetching sale details:', error)
      throw error
    }
  })
}

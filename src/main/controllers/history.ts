import { IpcMain } from 'electron'
import { getSalesHistory, getSaleDetails, getTotalSalesCount } from '../models/history'

export function setupSalesHistoryController(ipcMain: IpcMain) {
  ipcMain.handle(
    'get-sales-history',
    async (_, page: number, itemsPerPage: number, searchId: string | null) => {
      try {
        const offset = (page - 1) * itemsPerPage
        const salesHistory = await getSalesHistory(offset, itemsPerPage, searchId)
        const totalCount = await getTotalSalesCount(searchId)
        return { sales: salesHistory, totalCount }
      } catch (error) {
        console.error('Error fetching sales history:', error)
        throw error
      }
    }
  )

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

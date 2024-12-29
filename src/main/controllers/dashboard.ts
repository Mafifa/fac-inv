import { IpcMain } from 'electron'
import { getDashboardData, getDailyStats } from '../models/dashboard'

export function setupDashboardController(ipcMain: IpcMain): void {
  ipcMain.handle('get-dashboard-data', async () => {
    try {
      return await getDashboardData()
    } catch (error) {
      console.error('Error in getDashboardData:', error)
      throw error
    }
  })

  ipcMain.handle('get-daily-stats', async () => {
    try {
      return await getDailyStats()
    } catch (error) {
      console.error('Error in getDailyStats:', error)
      throw error
    }
  })
}

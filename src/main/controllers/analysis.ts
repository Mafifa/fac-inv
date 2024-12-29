import { IpcMain } from 'electron'
import { getAnalysisData, getDashboardData } from '../models/analysis'

export function setupAnalysisController(ipcMain: IpcMain): void {
  ipcMain.handle('get-analysis-data', async () => {
    try {
      const data = await getAnalysisData()
      return data
    } catch (error) {
      console.error('Error in getAnalysisData:', error)
      throw error
    }
  })

  ipcMain.handle('get-dashboard-data-2', async () => {
    try {
      const data = await getDashboardData()
      return data
    } catch (error) {
      console.error('Error in getDashboardData:', error)
      throw error
    }
  })
}

import { IpcMain } from 'electron'
import { getAnalysisData } from '../models/analysis'

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
}


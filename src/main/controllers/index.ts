import { IpcMain } from 'electron'
import { setupInventoryController } from './inventory'
import { setupSalesController } from './sales'
import { setupAnalysisController } from './analysis'
import { setupDolarApiHandler } from '../services/dolarApi'
import { setupDashboardController } from './dashboard'

let isSetup = false

export function setupControllers(ipcMain: IpcMain): void {
  if (isSetup) {
    console.warn('Controllers have already been set up. Skipping...')
    return
  }

  setupInventoryController(ipcMain)
  setupSalesController(ipcMain)
  setupAnalysisController(ipcMain)
  setupDolarApiHandler(ipcMain)
  setupDashboardController(ipcMain)

  isSetup = true
  console.log('All controllers have been set up successfully')
}

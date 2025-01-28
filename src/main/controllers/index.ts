import { ipcMain } from 'electron'
import { setupInventoryController } from './inventory'
import { setupSalesController } from './sales'
import { setupAnalysisController } from './analysis'
import { setupDolarApiHandler } from '../services/dolarApi'
import { setupDashboardController } from './dashboard'
import { setupSalesHistoryController } from './history'
import { setupTasasDolarController } from './tasasDolar'

let controllersSetup = false

export function setupControllers(): void {
  if (controllersSetup) {
    console.log('Controllers already set up. Skipping...')
    return
  }

  setupInventoryController(ipcMain)
  setupSalesController(ipcMain)
  setupAnalysisController(ipcMain)
  setupDolarApiHandler(ipcMain)
  setupDashboardController(ipcMain)
  setupSalesHistoryController(ipcMain)
  setupTasasDolarController(ipcMain)

  controllersSetup = true
  console.log('Controllers set up successfully')
}

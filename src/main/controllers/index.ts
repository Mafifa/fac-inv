import { ipcMain } from 'electron'
import { setupInventoryController } from './inventory'
import { setupSalesController } from './sales'
import { setupPaymentsController } from './payments'
import { setupAnalysisController } from './analysis'

export function setupControllers(): void {
  setupInventoryController(ipcMain)
  setupSalesController(ipcMain)
  setupPaymentsController(ipcMain)
  setupAnalysisController(ipcMain)
}


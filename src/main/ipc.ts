import { app, ipcMain, nativeTheme } from 'electron'
import { AppSettings } from '../shared/settings'
import { getSettings, updateSettings } from './store'

export function registerIpc(): void {
  ipcMain.handle('settings:get', () => getSettings())

  ipcMain.handle('settings:update', (_event, patch: Partial<AppSettings>) => {
    return updateSettings(patch)
  })

  ipcMain.handle('app:is-dark-mode', () => nativeTheme.shouldUseDarkColors)

  ipcMain.handle('app:quit', () => {
    app.quit()
    process.exit(0)
  })
}

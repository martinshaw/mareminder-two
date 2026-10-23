import { contextBridge, ipcRenderer } from 'electron'
import type { AppSettings } from '../shared/settings'

const api = {
  getSettings: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
  updateSettings: (patch: Partial<AppSettings>): Promise<AppSettings> =>
    ipcRenderer.invoke('settings:update', patch),
  isDarkMode: (): Promise<boolean> => ipcRenderer.invoke('app:is-dark-mode'),
  quit: (): Promise<void> => ipcRenderer.invoke('app:quit'),
}

contextBridge.exposeInMainWorld('mareminder', api)

export type MareminderApi = typeof api

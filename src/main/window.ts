import { BrowserWindow, shell, app } from 'electron'
import { join } from 'path'
import { getSettings } from './store'

let window: BrowserWindow | null = null

export function getWindow(): BrowserWindow | null {
  return window
}

export function destroyWindow(): void {
  if (!window) return
  const current = window
  window = null
  if (!current.isDestroyed()) {
    current.hide()
    current.destroy()
  }
}

export async function showReminderWindow(): Promise<BrowserWindow> {
  if (window && !window.isDestroyed()) {
    window.show()
    window.focus()
    return window
  }

  window = new BrowserWindow({
    width: 720,
    height: 560,
    show: false,
    center: true,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 16, y: 16 },
    fullscreenable: false,
    maximizable: false,
    closable: false,
    minimizable: true,
    resizable: true,
    autoHideMenuBar: true,
    hiddenInMissionControl: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
    },
  })

  window.on('ready-to-show', () => {
    window?.show()
    window?.focus()
  })

  const dismiss = (): void => {
    destroyWindow()
  }

  window.on('blur', dismiss)
  window.on('minimize', dismiss)
  window.on('closed', () => {
    window = null
  })

  window.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (!app.isPackaged && process.env.ELECTRON_RENDERER_URL) {
    await window.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    await window.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return window
}

export function runGreetingSnippet(win: BrowserWindow): void {
  const { jsSnippet } = getSettings()
  if (!jsSnippet?.trim()) return
  win.webContents
    .executeJavaScript(jsSnippet, true)
    .catch((error) => console.error('js snippet error:', error))
}

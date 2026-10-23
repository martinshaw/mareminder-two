import { app, Menu } from 'electron'
import { registerIpc } from './ipc'
import { startIdleWatcher, stopIdleWatcher } from './idle'
import { showReminderWindow } from './window'

app.whenReady().then(async () => {
  registerIpc()
  Menu.setApplicationMenu(null)

  if (app.dock) {
    app.dock.hide()
  }

  // Show once on launch so the user can edit the reminder immediately.
  await showReminderWindow()
  startIdleWatcher()

  app.on('activate', async () => {
    await showReminderWindow()
  })
})

app.on('window-all-closed', () => {
  // Stay resident so idle watching continues with no visible window.
})

app.on('before-quit', () => {
  stopIdleWatcher()
})

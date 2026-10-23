import { exec } from 'child_process'
import { screen, Point } from 'electron'
import { MOUSE_MOVE_BUFFER_PX, TICK_MS } from '../shared/settings'
import { getSettings } from './store'
import { destroyWindow, getWindow, runGreetingSnippet, showReminderWindow } from './window'

let lastCursor: Point | null = null
let idleMs = 0
let timer: NodeJS.Timeout | null = null

function mouseMoved(prev: Point, next: Point): boolean {
  return (
    Math.abs(prev.x - next.x) > MOUSE_MOVE_BUFFER_PX ||
    Math.abs(prev.y - next.y) > MOUSE_MOVE_BUFFER_PX
  )
}

async function onIdle(): Promise<void> {
  const settings = getSettings()
  const win = await showReminderWindow()

  if (settings.shellCode?.trim()) {
    exec(settings.shellCode, (error, stdout, stderr) => {
      if (error) console.error('shell error:', error)
      if (stdout) console.log(stdout)
      if (stderr) console.error(stderr)
    })
  }

  runGreetingSnippet(win)
}

async function tick(): Promise<void> {
  const settings = getSettings()
  const cursor = screen.getCursorScreenPoint()
  const win = getWindow()

  if (win && !win.isDestroyed() && win.isVisible() && win.isFocused()) {
    idleMs = 0
    lastCursor = cursor
    return
  }

  if (!lastCursor) {
    lastCursor = cursor
    return
  }

  if (mouseMoved(lastCursor, cursor)) {
    idleMs = 0
  } else {
    idleMs += TICK_MS
  }

  lastCursor = cursor

  if (idleMs >= settings.disturbanceTimeoutMs) {
    idleMs = 0
    await onIdle()
  }
}

export function startIdleWatcher(): void {
  if (timer) return
  timer = setInterval(() => {
    void tick()
  }, TICK_MS)
}

export function stopIdleWatcher(): void {
  if (!timer) return
  clearInterval(timer)
  timer = null
  destroyWindow()
}

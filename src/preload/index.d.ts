import type { MareminderApi } from './index'

declare global {
  interface Window {
    mareminder: MareminderApi
  }
}

export {}

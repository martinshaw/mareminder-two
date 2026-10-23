import Store from 'electron-store'
import { AppSettings, DEFAULT_SETTINGS } from '../shared/settings'

const store = new Store<AppSettings>({
  name: 'settings',
  defaults: DEFAULT_SETTINGS,
})

export function getSettings(): AppSettings {
  return {
    disturbanceTimeoutMs: store.get('disturbanceTimeoutMs'),
    messageHtml: store.get('messageHtml'),
    shellCode: store.get('shellCode'),
    jsSnippet: store.get('jsSnippet'),
  }
}

export function updateSettings(patch: Partial<AppSettings>): AppSettings {
  const next = { ...getSettings(), ...patch }
  store.set(next)
  return next
}

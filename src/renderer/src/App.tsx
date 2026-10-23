import { useCallback, useEffect, useState } from 'react'
import type { AppSettings } from '../../shared/settings'
import { DEFAULT_SETTINGS } from '../../shared/settings'
import Editor from './components/Editor'
import SettingsPanel from './components/SettingsPanel'

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [ready, setReady] = useState(false)
  const [dark, setDark] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    void (async () => {
      const [loaded, isDark] = await Promise.all([
        window.mareminder.getSettings(),
        window.mareminder.isDarkMode(),
      ])
      setSettings(loaded)
      setDark(isDark)
      setReady(true)
    })()
  }, [])

  const persist = useCallback(async (patch: Partial<AppSettings>) => {
    const next = await window.mareminder.updateSettings(patch)
    setSettings(next)
    return next
  }, [])

  if (!ready) {
    return <div className={`app ${dark ? 'dark' : ''}`} />
  }

  return (
    <div className={`app ${dark ? 'dark' : ''}`}>
      <header className="titlebar">
        <div className="titlebar-drag" />
        <button
          type="button"
          className="icon-button"
          aria-label="Settings"
          aria-expanded={settingsOpen}
          onClick={() => setSettingsOpen((open) => !open)}
        >
          ⚙
        </button>
      </header>

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onChange={persist}
          onQuit={() => void window.mareminder.quit()}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      <main className="page">
        <Editor
          html={settings.messageHtml}
          onChange={(messageHtml) => void persist({ messageHtml })}
        />
      </main>
    </div>
  )
}

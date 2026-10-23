import { useState } from 'react'
import type { AppSettings } from '../../../shared/settings'

type Props = {
  settings: AppSettings
  onChange: (patch: Partial<AppSettings>) => Promise<AppSettings>
  onQuit: () => void
  onClose: () => void
}

function formatMinutes(ms: number): string | null {
  if (ms === 30_000) return '( ½ min )'
  if (ms < 60_000) return null
  const minutes = Math.floor(ms / 60_000)
  const approx = ms % 60_000 === 0 ? '' : '~'
  if ((approx + String(minutes)).length > 3) return null
  return `( ${approx}${minutes} min${minutes === 1 ? '' : 's'} )`
}

export default function SettingsPanel({ settings, onChange, onQuit, onClose }: Props) {
  const [shellDraft, setShellDraft] = useState(settings.shellCode)
  const [jsDraft, setJsDraft] = useState(settings.jsSnippet)
  const minutesLabel = formatMinutes(settings.disturbanceTimeoutMs)

  return (
    <aside className="settings" role="dialog" aria-label="Settings">
      <div className="settings-header">
        <strong>Settings</strong>
        <button type="button" className="text-button" onClick={onClose}>
          Close
        </button>
      </div>

      <label className="settings-item">
        <span>
          After your mouse stops moving, how long should we wait before showing this reminder?
        </span>
        <div className="settings-row">
          <input
            type="number"
            min={5}
            step={5}
            value={Math.round(settings.disturbanceTimeoutMs / 1000)}
            onChange={(event) => {
              const seconds = Number(event.target.value)
              if (!Number.isFinite(seconds) || seconds < 5) return
              void onChange({ disturbanceTimeoutMs: seconds * 1000 })
            }}
          />
          <span>seconds {minutesLabel}</span>
        </div>
      </label>

      <div className="settings-item">
        {shellDraft == null ? (
          <button type="button" className="primary-button" onClick={() => setShellDraft('')}>
            Run a Shell Command When This Reminder Appears
          </button>
        ) : (
          <>
            <span>This shell command will run before each reminder appears.</span>
            <textarea
              className="mono"
              rows={3}
              value={shellDraft}
              onChange={(event) => setShellDraft(event.target.value)}
            />
            <button
              type="button"
              className="primary-button"
              onClick={() => void onChange({ shellCode: shellDraft })}
            >
              Update Shell Command
            </button>
          </>
        )}
      </div>

      <div className="settings-item">
        {jsDraft == null ? (
          <button type="button" className="primary-button" onClick={() => setJsDraft('')}>
            Run a JavaScript Snippet When This Reminder Appears
          </button>
        ) : (
          <>
            <span>This JavaScript snippet will run before each reminder appears.</span>
            <textarea
              className="mono"
              rows={3}
              value={jsDraft}
              onChange={(event) => setJsDraft(event.target.value)}
            />
            <button
              type="button"
              className="primary-button"
              onClick={() => void onChange({ jsSnippet: jsDraft })}
            >
              Update JavaScript Snippet
            </button>
          </>
        )}
      </div>

      <button type="button" className="danger-button" onClick={onQuit}>
        Quit Mareminder
      </button>
    </aside>
  )
}

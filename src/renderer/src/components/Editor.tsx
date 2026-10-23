import { useEffect, useRef, useState } from 'react'

type Props = {
  html: string
  onChange: (html: string) => void
}

function exec(command: string, value?: string): void {
  document.execCommand(command, false, value)
}

export default function Editor({ html, onChange }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState(false)
  const seeded = useRef(false)

  useEffect(() => {
    if (!ref.current || seeded.current) return
    ref.current.innerHTML = html
    seeded.current = true
  }, [html])

  return (
    <div className={`editor ${focused ? 'editor--focused' : ''}`}>
      <div
        ref={ref}
        className="editor-surface"
        contentEditable
        suppressContentEditableWarning
        spellCheck
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          if (ref.current) onChange(ref.current.innerHTML)
        }}
        onInput={() => {
          if (ref.current) onChange(ref.current.innerHTML)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            ;(event.target as HTMLElement).blur()
          }
        }}
      />

      <div className="editor-toolbar" role="toolbar" aria-label="Formatting">
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')}>
          B
        </button>
        <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')}>
          I
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('insertUnorderedList')}
        >
          • List
        </button>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => exec('formatBlock', 'h1')}
        >
          H1
        </button>
      </div>
    </div>
  )
}

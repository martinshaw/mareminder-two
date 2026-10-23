export type AppSettings = {
  disturbanceTimeoutMs: number
  messageHtml: string
  shellCode: string | null
  jsSnippet: string | null
}

export const DEFAULT_MESSAGE_HTML = `<div>Bad habits I want to stop:</div>
<ul>
  <li>X</li>
  <li>Y</li>
  <li>Z</li>
</ul>
<div><br>Good habits I'm keeping up:</div>
<ul>
  <li>A</li>
  <li>B</li>
  <li>C</li>
</ul>
<div><br>Remember to drink water when I take a break!</div>`

export const DEFAULT_SETTINGS: AppSettings = {
  disturbanceTimeoutMs: 180_000,
  messageHtml: DEFAULT_MESSAGE_HTML,
  shellCode: null,
  jsSnippet: null,
}

export const TICK_MS = 5_000
export const MOUSE_MOVE_BUFFER_PX = 4

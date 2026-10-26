export function clockTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function timeAgo(iso: string, now = Date.now()) {
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000)
  if (s < 45) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

/** 3240 → "3.2s" */
export function formatSeconds(ms: number) {
  return `${(Math.max(0, ms) / 1000).toFixed(1)}s`
}

/** Milliseconds from now until an ISO time (negative if it has passed). */
export function msUntil(iso: string) {
  return Date.parse(iso) - Date.now()
}

/**
 * Milliseconds until `iso` on the server's clock. `ref` carries the server
 * time of a response and when the browser received it, which gives the
 * difference between the two clocks.
 */
export function msUntilServerTime(iso: string, ref: { server_time: string; received_at: number }) {
  const offset = Date.parse(ref.server_time) - ref.received_at
  return Date.parse(iso) - (Date.now() + offset)
}

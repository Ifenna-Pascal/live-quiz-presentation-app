import { WifiOff } from 'lucide-react'
import type { StreamStatus } from '../../realtime/stream'

/** Appears in the room header only while live updates are reconnecting. */
export function ConnectionBadge({ status }: { status: StreamStatus }) {
  if (status === 'live' || status === 'connecting') return null
  return (
    <span
      title="Reconnecting… the screen still updates every few seconds meanwhile"
      className="inline-flex animate-fade-in items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300"
    >
      <WifiOff className="size-3.5 animate-pulse" />
      <span className="hidden sm:inline">Reconnecting</span>
    </span>
  )
}

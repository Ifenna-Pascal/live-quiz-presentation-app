import type { LeaderboardEntry } from '../../api/types'
import { PodiumStep } from './PodiumStep'

type Props = { entries: LeaderboardEntry[]; meId?: string; large?: boolean; currency?: string }

/** 2nd · 1st · 3rd, by position in the (already ranked) list. */
export function Podium({ entries, meId, large, currency }: Props) {
  const [first, second, third] = entries
  return (
    <div className="pt-4">
      <div className="grid grid-cols-3 items-end gap-2">
        <PodiumStep entry={second} place={2} isMe={second?.player_id === meId} large={large} currency={currency} />
        <PodiumStep entry={first} place={1} isMe={first?.player_id === meId} large={large} currency={currency} />
        <PodiumStep entry={third} place={3} isMe={third?.player_id === meId} large={large} currency={currency} />
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />
    </div>
  )
}

import type { LeaderboardEntry } from '../../api/types'
import { cn } from '../../utils/cn'
import { PayoutChip } from '../prize/PayoutChip'
import { Avatar } from '../ui/Avatar'
import { RankMovement } from './RankMovement'

type Props = {
  entry: LeaderboardEntry
  maxScore: number
  isMe: boolean
  move?: number
  index: number
  /** Set when the game has prize money: shows the player's current payout. */
  currency?: string
}

export function LeaderboardRow({ entry, maxScore, isMe, move, index, currency }: Props) {
  const share = maxScore ? entry.score / maxScore : 0
  return (
    <li
      className={cn(
        'relative flex animate-fade-up items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5',
        isMe ? 'border-brand-500/40 bg-brand-500/[0.08]' : 'border-white/5 bg-ink-800/60',
      )}
      style={{ animationDelay: `${Math.min(index, 10) * 35}ms` }}
    >
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500/[0.14] to-transparent transition-[width] duration-700"
        style={{ width: `${share * 100}%` }}
      />
      <span className="relative w-6 text-center font-display text-sm font-bold text-ink-300 tabular-nums">{entry.rank}</span>
      <RankMovement move={move} />
      <Avatar name={entry.player_name} size={30} className="relative" />
      <span className="relative min-w-0 flex-1 truncate text-sm font-medium">
        {entry.player_name}
        {isMe && <span className="ml-1.5 text-xs text-brand-300">(you)</span>}
      </span>
      {currency && <PayoutChip amount={entry.payout} currency={currency} className="relative" />}
      <span className="relative text-right">
        <span className="block font-display text-base font-bold tabular-nums">{entry.score}</span>
        <span className="block text-[11px] text-ink-400">{entry.answered} answered</span>
      </span>
    </li>
  )
}

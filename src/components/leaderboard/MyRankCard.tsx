import { Banknote, Target } from 'lucide-react'
import type { LeaderboardEntry, Prize } from '../../api/types'
import { ordinal } from '../../utils/format'
import { MoneyAmount } from '../prize/MoneyAmount'
import { AnimatedNumber } from '../ui/AnimatedNumber'

type Props = { entry: LeaderboardEntry; scoredPolls: number; playerCount: number; prize?: Prize | null }

/** The player's own standing, pinned under the leaderboard. */
export function MyRankCard({ entry, scoredPolls, playerCount, prize }: Props) {
  const accuracy = scoredPolls ? Math.round((entry.score / scoredPolls) * 100) : 0
  return (
    <div className="surface-brand rounded-2xl p-4">
      <div className="flex items-center gap-4">
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-500 font-display text-lg font-bold text-ink-950">
        {ordinal(entry.rank)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-brand-200/80">Your position</p>
        <p className="font-display text-lg font-bold">
          <AnimatedNumber value={entry.score} /> {entry.score === 1 ? 'pt' : 'pts'} <span className="text-sm font-medium text-ink-300">of {scoredPolls}</span>
        </p>
      </div>
      <div className="text-right text-xs text-ink-300">
        <p className="flex items-center justify-end gap-1">
          <Target className="size-3.5 text-brand-400" /> {accuracy}%
        </p>
        <p className="mt-0.5">out of {playerCount}</p>
      </div>
      </div>
      {prize && (
        <div className="mt-3 flex items-center gap-2 border-t border-white/5 pt-3 text-sm">
          <Banknote className="size-4 shrink-0 text-amber-300" />
          {entry.payout > 0 ? (
            <p className="text-ink-200">
              You're winning{' '}
              <MoneyAmount value={entry.payout} currency={prize.currency} className="font-display font-bold text-amber-300 tabular-nums" />
            </p>
          ) : (
            <p className="text-ink-300">Reach the top 3 to win a share of the prize.</p>
          )}
        </div>
      )}
    </div>
  )
}

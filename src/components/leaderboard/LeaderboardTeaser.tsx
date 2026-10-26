import { Trophy } from 'lucide-react'
import type { Prize } from '../../api/types'
import { PrizePoolBanner } from '../prize/PrizePoolBanner'

/** Shown until the first player scores: the race hasn't started yet. */
export function LeaderboardTeaser({ scoredPolls, prize }: { scoredPolls: number; prize?: Prize | null }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
      <div className="relative mb-6 grid grid-cols-3 items-end gap-2 opacity-60">
        {['h-14', 'h-20', 'h-10'].map((h, i) => (
          <div key={i} className="flex w-14 flex-col items-center gap-2">
            <div className="size-9 rounded-full border border-dashed border-ink-500" />
            <div className={`shimmer w-full animate-shimmer rounded-t-xl border border-b-0 border-white/10 bg-ink-800 ${h}`} />
          </div>
        ))}
        <Trophy className="absolute -top-8 left-1/2 size-7 -translate-x-1/2 animate-float text-brand-400" />
      </div>
      <p className="font-display text-lg font-semibold">The race hasn't started</p>
      <p className="mt-1.5 max-w-xs text-sm text-ink-300">
        {scoredPolls
          ? 'Nobody has answered first yet. The board lights up with the first win.'
          : 'Be the first to pick the right answer to win a point. Get ready to climb!'}
      </p>
      {prize && <PrizePoolBanner prize={prize} className="mt-6 w-full max-w-sm" />}
    </div>
  )
}

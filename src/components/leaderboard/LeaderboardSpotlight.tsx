import { Trophy } from 'lucide-react'
import type { Leaderboard } from '../../api/types'
import { formatMoney } from '../../utils/format'
import { isLeaderboardActive } from '../../utils/scoring'
import { Card } from '../ui/Card'
import { LeaderboardRow } from './LeaderboardRow'

type Props = { leaderboard: Leaderboard | undefined; meId?: string; moves: Map<string, number> }

/** Top 5 shown on the stage after an answer is revealed. */
export function LeaderboardSpotlight({ leaderboard, meId, moves }: Props) {
  if (!leaderboard || !isLeaderboardActive(leaderboard)) return null
  const top = leaderboard.entries.slice(0, 5)
  const maxScore = Math.max(1, leaderboard.scored_polls, ...top.map((e) => e.score))

  return (
    <Card className="mt-6 animate-fade-up p-4 sm:p-5">
      <div className="mb-3 flex items-center gap-2">
        <Trophy className="size-4.5 text-brand-400" />
        <h3 className="font-display font-semibold">Leaderboard</h3>
        <span className="text-xs text-ink-400">top {top.length}</span>
        {leaderboard.prize && (
          <span className="ml-auto text-xs font-semibold text-amber-300">
            {formatMoney(leaderboard.prize.pool, leaderboard.prize.currency)} pool
          </span>
        )}
      </div>
      <ol className="space-y-1.5">
        {top.map((e, i) => (
          <LeaderboardRow key={e.player_id} entry={e} index={i} maxScore={maxScore} isMe={e.player_id === meId} move={moves.get(e.player_id)} currency={leaderboard.prize?.currency} />
        ))}
      </ol>
    </Card>
  )
}

import type { Leaderboard } from '../../api/types'
import { isLeaderboardActive } from '../../utils/scoring'
import { PrizePoolBanner } from '../prize/PrizePoolBanner'
import { Badge } from '../ui/Badge'
import { Spinner } from '../ui/Spinner'
import { LeaderboardRow } from './LeaderboardRow'
import { LeaderboardTeaser } from './LeaderboardTeaser'
import { MyRankCard } from './MyRankCard'
import { Podium } from './Podium'

type Props = { leaderboard: Leaderboard | undefined; meId?: string; moves: Map<string, number> }

export function LeaderboardPanel({ leaderboard, meId, moves }: Props) {
  if (!leaderboard) {
    return (
      <div className="grid place-items-center py-16">
        <Spinner />
      </div>
    )
  }
  if (!isLeaderboardActive(leaderboard)) return <LeaderboardTeaser scoredPolls={leaderboard.scored_polls} prize={leaderboard.prize} />

  const { entries, scored_polls, prize } = leaderboard
  const currency = prize?.currency
  const me = entries.find((e) => e.player_id === meId)
  const maxScore = Math.max(1, scored_polls, ...entries.map((e) => e.score))

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-4 pb-4">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm text-ink-300">
            <span className="font-semibold text-ink-100">{scored_polls}</span> scored {scored_polls === 1 ? 'question' : 'questions'}
          </p>
          <Badge tone="brand" dot>
            Live
          </Badge>
        </div>
        {prize && <PrizePoolBanner prize={prize} className="mt-3" />}
        <Podium entries={entries} meId={meId} currency={currency} />
        <ol className="mt-5 space-y-1.5">
          {entries.map((e, i) => (
            <LeaderboardRow
              key={e.player_id}
              entry={e}
              index={i}
              maxScore={maxScore}
              isMe={e.player_id === meId}
              move={moves.get(e.player_id)}
              currency={currency}
            />
          ))}
        </ol>
      </div>
      {me && (
        <div className="border-t border-white/5 p-3">
          <MyRankCard entry={me} scoredPolls={scored_polls} playerCount={entries.length} prize={prize} />
        </div>
      )}
    </div>
  )
}

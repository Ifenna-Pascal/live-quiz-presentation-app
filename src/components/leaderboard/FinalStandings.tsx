import type { Leaderboard } from '../../api/types'
import { Confetti } from '../feedback/Confetti'
import { PrizePoolBanner } from '../prize/PrizePoolBanner'
import { LeaderboardRow } from './LeaderboardRow'
import { Podium } from './Podium'

type Props = { leaderboard: Leaderboard | undefined; meId?: string }

/** The end screen: a big podium, confetti, and everyone else below. */
export function FinalStandings({ leaderboard, meId }: Props) {
  const entries = leaderboard?.entries ?? []
  const scored = entries.some((e) => e.score > 0)
  const maxScore = Math.max(1, leaderboard?.scored_polls ?? 0)
  const prize = leaderboard?.prize

  return (
    <div>
      {scored && <Confetti burstKey="final" pieces={110} />}
      {prize && scored && <PrizePoolBanner prize={prize} final className="mx-auto mb-8 max-w-lg" />}
      {scored ? (
        <Podium entries={entries} meId={meId} large currency={prize?.currency} />
      ) : (
        <p className="text-center text-sm text-ink-300">No correct answers were scored this time.</p>
      )}
      {entries.length > 3 && (
        <ol className="mx-auto mt-8 max-w-lg space-y-1.5">
          {entries.slice(3).map((e, i) => (
            <LeaderboardRow
              key={e.player_id}
              entry={e}
              index={i}
              maxScore={maxScore}
              isMe={e.player_id === meId}
              currency={prize?.currency}
            />
          ))}
        </ol>
      )}
    </div>
  )
}

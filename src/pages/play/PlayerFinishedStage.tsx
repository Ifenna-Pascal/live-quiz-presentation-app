import type { Leaderboard } from '../../api/types'
import { FinalStandings } from '../../components/leaderboard/FinalStandings'
import { formatMoney, ordinal } from '../../utils/format'

type Props = { leaderboard: Leaderboard | undefined; meId: string; name: string }

export function PlayerFinishedStage({ leaderboard, meId, name }: Props) {
  const me = leaderboard?.entries.find((e) => e.player_id === meId)
  const scored = !!me && me.score > 0
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:py-16">
      <p className="text-xs font-semibold tracking-wider text-brand-400 uppercase">Game over</p>
      <h2 className="mt-2 font-display text-5xl font-bold tracking-tight">
        {me ? (scored ? `You finished ${ordinal(me.rank)}!` : `Thanks for playing, ${name}!`) : 'Final standings'}
      </h2>
      {me && (
        <p className="mt-2 text-ink-300">
          {me.score} of {leaderboard?.scored_polls ?? 0} correct · {me.answered} answered
        </p>
      )}
      {me && leaderboard?.prize && me.payout > 0 && (
        <p className="mx-auto mt-5 inline-flex animate-pop items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-5 py-2 font-display text-xl font-bold text-amber-300">
          You won {formatMoney(me.payout, leaderboard.prize.currency)}
        </p>
      )}
      <div className="mt-10">
        <FinalStandings leaderboard={leaderboard} meId={meId} />
      </div>
    </div>
  )
}

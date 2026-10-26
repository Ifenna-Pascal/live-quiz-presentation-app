import { Link } from 'react-router-dom'
import { Flag } from 'lucide-react'
import type { Leaderboard } from '../../api/types'
import { FinalStandings } from '../../components/leaderboard/FinalStandings'
import { Button } from '../../components/ui/Button'
import { pluralize } from '../../utils/format'

type Props = { leaderboard: Leaderboard | undefined; playerCount: number; totalPolls: number }

export function HostFinishedStage({ leaderboard, playerCount, totalPolls }: Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 text-center sm:py-16">
      <div className="mx-auto grid size-16 animate-pop place-items-center rounded-2xl bg-brand-500/15 text-brand-400 ring-1 ring-brand-500/30">
        <Flag className="size-8" />
      </div>
      <h2 className="mt-6 font-display text-5xl font-bold tracking-tight">That's a wrap!</h2>
      <p className="mt-2 text-ink-300">
        {pluralize(playerCount, 'player')} played {pluralize(totalPolls, 'question')}. Here are your champions.
      </p>
      <div className="mt-10">
        <FinalStandings leaderboard={leaderboard} />
      </div>
      <Link to="/dashboard" className="mt-10 inline-block">
        <Button variant="secondary">Back to dashboard</Button>
      </Link>
    </div>
  )
}

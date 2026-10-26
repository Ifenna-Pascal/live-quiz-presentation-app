import { AnimatedNumber } from '../ui/AnimatedNumber'
import { ProgressBar } from '../ui/ProgressBar'

export function VoteMeter({ votes, players }: { votes: number; players: number }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline gap-2">
        <AnimatedNumber value={votes} className="font-display text-3xl font-bold tabular-nums" />
        <span className="text-sm text-ink-300">of {players} players answered</span>
      </div>
      <ProgressBar value={players ? votes / players : 0} className="mt-2" />
    </div>
  )
}

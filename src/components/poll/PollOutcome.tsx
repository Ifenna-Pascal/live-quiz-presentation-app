import { Eye, Hourglass, Trophy } from 'lucide-react'
import type { CurrentPoll } from '../../api/types'
import { cn } from '../../utils/cn'
import { formatSeconds } from '../../utils/time'
import { Avatar } from '../ui/Avatar'

type Props = { poll: CurrentPoll; meId?: string }

/** How a closed poll ended: who answered first, or that time ran out. */
export function PollOutcome({ poll, meId }: Props) {
  if (!poll.revealed) return null
  const answer = poll.options.filter((o) => o.correct).map((o) => `${o.key}. ${o.value}`).join(' / ')

  if (poll.winner) {
    const mine = poll.winner.player_id === meId
    return (
      <div className={cn('flex animate-pop items-center gap-4 rounded-2xl p-4', mine ? 'border border-emerald-500/40 bg-emerald-500/10' : 'surface-brand')}>
        <div className="relative">
          <Avatar name={poll.winner.player_name} size={52} />
          <Trophy className="absolute -right-1.5 -bottom-1.5 size-6 rounded-full bg-ink-900 p-1 text-brand-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-bold">
            {mine ? 'You answered first!' : `${poll.winner.player_name} answered first`}
          </p>
          <p className="text-sm text-ink-300">
            in <span className="font-semibold text-brand-300">{formatSeconds(poll.winner.elapsed_ms)}</span>
            {answer && <> · the answer was <span className="font-semibold text-emerald-300">{answer}</span></>}
          </p>
        </div>
      </div>
    )
  }

  const timeUp = poll.closed_reason === 'time_up'
  return (
    <div className="flex animate-pop items-center gap-4 rounded-2xl border border-ink-600 bg-ink-800 p-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink-700 text-ink-200">
        {timeUp ? <Hourglass className="size-6" /> : <Eye className="size-6" />}
      </span>
      <div>
        <p className="font-display text-lg font-bold">{timeUp ? "Time's up!" : 'Answer revealed'}</p>
        <p className="text-sm text-ink-300">
          {answer ? (
            <>
              {timeUp ? 'Nobody got it. ' : ''}The answer was <span className="font-semibold text-emerald-300">{answer}</span>
            </>
          ) : (
            'This one was just for fun: no right answer.'
          )}
        </p>
      </div>
    </div>
  )
}

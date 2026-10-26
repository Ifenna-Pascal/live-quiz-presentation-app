import { Users } from 'lucide-react'
import type { CurrentPoll, Leaderboard, Player, Presentation, Vote } from '../../api/types'
import { LeaderboardSpotlight } from '../../components/leaderboard/LeaderboardSpotlight'
import { CountdownRing } from '../../components/poll/CountdownRing'
import { OptionsBoard } from '../../components/poll/OptionsBoard'
import { PollOutcome } from '../../components/poll/PollOutcome'
import { PollResults } from '../../components/poll/PollResults'
import { QuestionHeader } from '../../components/poll/QuestionHeader'
import { VoteMeter } from '../../components/poll/VoteMeter'
import { Card } from '../../components/ui/Card'
import type { HostAction } from '../../hooks/host'
import { countPlayers } from '../../utils/scoring'
import { pluralize } from '../../utils/format'
import { HostControls } from './HostControls'

type Props = {
  presentation: Presentation
  poll: CurrentPoll
  votes: Vote[]
  players: Player[]
  leaderboard: Leaderboard | undefined
  moves: Map<string, number>
  busy: HostAction | null
  onPrevious: () => void
  onReveal: () => void
  onNext: () => void
  onFinish: () => void
}

/**
 * The host's screen is what the room sees, so while the clock runs a quiz
 * question shows only the answers (no counts, no correct answer). Once it
 * closes, the outcome and the full results appear.
 */
export function HostLiveStage({ presentation, poll, votes, players, leaderboard, moves, ...controls }: Props) {
  const total = presentation.polls.length
  const answered = countPlayers(votes)

  return (
    <div key={poll.id} className="relative mx-auto max-w-3xl animate-fade-up px-4 py-8 sm:px-6 sm:py-10">
      <QuestionHeader index={poll.index} total={total} revealed={poll.revealed} />
      <div className="mt-5 flex items-start gap-6">
        <h2 className="flex-1 font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">{poll.question}</h2>
        {!poll.revealed && <CountdownRing poll={poll} size={104} />}
      </div>

      <div className="mt-8 space-y-5">
        {poll.revealed ? (
          <>
            <PollOutcome poll={poll} />
            <PollResults
              options={poll.options}
              votes={votes}
              correctKeys={poll.options.filter((o) => o.correct).map((o) => o.key)}
              revealed
              large
            />
          </>
        ) : poll.scored ? (
          <>
            <OptionsBoard options={poll.options} />
            <p className="flex items-center justify-center gap-2 text-sm text-ink-300">
              <Users className="size-4 text-brand-400" />
              {answered ? `${answered} trying · ${pluralize(votes.length, 'wrong guess', 'wrong guesses')} so far` : 'Waiting for the first answer…'}
            </p>
          </>
        ) : (
          <PollResults options={poll.options} votes={votes} revealed={false} large />
        )}
      </div>

      <Card className="mt-8 flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <VoteMeter votes={answered} players={players.length} />
        <HostControls index={poll.index} total={total} revealed={poll.revealed} {...controls} />
      </Card>
      {poll.revealed && <LeaderboardSpotlight leaderboard={leaderboard} moves={moves} />}
    </div>
  )
}

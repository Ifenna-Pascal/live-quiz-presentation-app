import { useState } from 'react'
import { Lock, Zap } from 'lucide-react'
import { ApiError } from '../../api/client'
import { castVote } from '../../api/polls'
import type { CurrentPoll, Leaderboard, Vote } from '../../api/types'
import { Confetti } from '../../components/feedback/Confetti'
import { LeaderboardSpotlight } from '../../components/leaderboard/LeaderboardSpotlight'
import { MyRankCard } from '../../components/leaderboard/MyRankCard'
import { CountdownRing } from '../../components/poll/CountdownRing'
import { OptionButton, type OptionState } from '../../components/poll/OptionButton'
import { PollOutcome } from '../../components/poll/PollOutcome'
import { PollResults } from '../../components/poll/PollResults'
import { QuestionHeader } from '../../components/poll/QuestionHeader'
import { useToast } from '../../components/toast/toast'
import { ProgressBar } from '../../components/ui/ProgressBar'
import type { PlayerIdentity } from '../../storage/player'
import { countPlayers, isLeaderboardActive } from '../../utils/scoring'

type Props = {
  presentationId: string
  me: PlayerIdentity
  poll: CurrentPoll
  total: number
  votes: Vote[]
  playerCount: number
  leaderboard: Leaderboard | undefined
  moves: Map<string, number>
  onVoted: () => void
}

export function PlayerPollStage({ presentationId, me, poll, total, votes, playerCount, leaderboard, moves, onVoted }: Props) {
  const toast = useToast()
  const [sendingKey, setSendingKey] = useState<string | null>(null)
  const [localTries, setLocalTries] = useState<string[]>([])
  const [nudge, setNudge] = useState(0)

  const myKeys = [...new Set([...votes.filter((v) => v.player_id === me.player_id).map((v) => v.key), ...localTries])]
  const lastKey = myKeys[myKeys.length - 1] ?? null
  const iWon = poll.winner?.player_id === me.player_id
  const myEntry = leaderboard?.entries.find((e) => e.player_id === me.player_id)
  const opinionLocked = !poll.scored && myKeys.length > 0

  async function pick(key: string) {
    if (sendingKey) return
    setSendingKey(key)
    try {
      const result = await castVote(presentationId, poll.id, key, me)
      setLocalTries((t) => [...t, key])
      if (result.scored && !result.correct) setNudge((n) => n + 1)
    } catch (e) {
      // Too late (someone won, time ran out) or already tried: just refresh.
      if (!(e instanceof ApiError && e.status === 409)) toast((e as Error).message, 'error')
      else toast(e.message, 'info')
    } finally {
      setSendingKey(null)
      onVoted()
    }
  }

  const stateOf = (key: string): OptionState => {
    if (sendingKey === key) return 'sending'
    if (myKeys.includes(key)) return 'wrong'
    return sendingKey ? 'disabled' : 'idle'
  }

  return (
    <div className="relative mx-auto max-w-2xl animate-fade-up px-4 py-6 sm:px-6 sm:py-10">
      {iWon && <Confetti burstKey={poll.id} pieces={110} />}
      <QuestionHeader
        index={poll.index}
        total={total}
        revealed={poll.revealed}
        right={<span className="text-xs text-ink-400 tabular-nums">{countPlayers(votes)}/{playerCount} answered</span>}
      />
      <ProgressBar value={poll.index / total} className="mt-3 h-1" />

      <div className="mt-6 flex items-start gap-4">
        <h2 className="flex-1 font-display text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">{poll.question}</h2>
        {!poll.revealed && <CountdownRing poll={poll} size={64} />}
      </div>

      {poll.revealed ? (
        <div className="mt-6 space-y-5">
          <PollOutcome poll={poll} meId={me.player_id} />
          <PollResults
            options={poll.options}
            votes={votes}
            myKey={lastKey}
            correctKeys={poll.options.filter((o) => o.correct).map((o) => o.key)}
            revealed
          />
          {myEntry && isLeaderboardActive(leaderboard) && (
            <MyRankCard
              entry={myEntry}
              scoredPolls={leaderboard!.scored_polls}
              playerCount={leaderboard!.entries.length}
              prize={leaderboard!.prize}
            />
          )}
          <LeaderboardSpotlight leaderboard={leaderboard} meId={me.player_id} moves={moves} />
        </div>
      ) : opinionLocked ? (
        <div className="mt-6">
          <div className="surface-brand mb-5 flex animate-pop items-center gap-3 rounded-2xl p-4">
            <Lock className="size-5 shrink-0 text-brand-400" />
            <p className="text-sm">
              <span className="font-semibold text-ink-100">You picked {lastKey}.</span>{' '}
              <span className="text-ink-300">No right answer here: just see what everyone thinks.</span>
            </p>
          </div>
          <PollResults options={poll.options} votes={votes} myKey={lastKey} revealed={false} />
        </div>
      ) : (
        <>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-ink-300">
            <Zap className="size-4 text-brand-400" />
            {poll.scored ? 'Tap fast: the first correct answer wins!' : 'Tap your answer.'}
          </p>
          {nudge > 0 && (
            <p key={nudge} className="mt-2 animate-pop text-sm font-semibold text-red-300">
              Not that one. Try another, quick!
            </p>
          )}
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {poll.options.map((o, i) => (
              <OptionButton key={o.key} option={o} index={i} state={stateOf(o.key)} onPick={pick} />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

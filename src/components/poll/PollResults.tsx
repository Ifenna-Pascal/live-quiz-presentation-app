import type { Option, Vote } from '../../api/types'
import { cn } from '../../utils/cn'
import { ResultBar } from './ResultBar'

type Props = {
  options: Option[]
  votes: Vote[]
  myKey?: string | null
  /** Correct options. Players only get these after the reveal. */
  correctKeys?: string[]
  revealed: boolean
  large?: boolean
}

/** Live bar chart of the votes on one poll. */
export function PollResults({ options, votes, myKey, correctKeys = [], revealed, large }: Props) {
  const counts = new Map<string, number>()
  votes.forEach((v) => counts.set(v.key, (counts.get(v.key) ?? 0) + 1))
  const leader = Math.max(0, ...counts.values())

  return (
    <ul className={cn('space-y-3', large && 'space-y-3.5')}>
      {options.map((o) => {
        const count = counts.get(o.key) ?? 0
        return (
          <ResultBar
            key={o.key}
            option={o}
            count={count}
            total={votes.length}
            isLeader={count > 0 && count === leader}
            isMine={myKey === o.key}
            isCorrect={correctKeys.includes(o.key)}
            revealed={revealed}
            large={large}
          />
        )
      })}
    </ul>
  )
}

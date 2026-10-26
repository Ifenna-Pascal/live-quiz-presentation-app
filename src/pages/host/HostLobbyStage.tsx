import { Play, Users } from 'lucide-react'
import type { Player, Prize } from '../../api/types'
import { PrizePoolBanner } from '../../components/prize/PrizePoolBanner'
import { ShareCard } from '../../components/share/ShareCard'
import { AnimatedNumber } from '../../components/ui/AnimatedNumber'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { pluralize } from '../../utils/format'

type Props = {
  presentationId: string
  players: Player[]
  totalPolls: number
  prize?: Prize | null
  starting: boolean
  onStart: () => void
}

export function HostLobbyStage({ presentationId, players, totalPolls, prize, starting, onStart }: Props) {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="animate-fade-up text-center">
        <Badge tone="brand" dot>
          Registration open
        </Badge>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Waiting for players</h2>
        <p className="mt-2 text-ink-300">Share the link. When everyone is in, start the show.</p>
      </div>
      {prize && <PrizePoolBanner prize={prize} className="mt-8" />}
      <Card className={prize ? 'mt-4 p-5 sm:p-6' : 'mt-8 p-5 sm:p-6'}>
        <ShareCard presentationId={presentationId} />
      </Card>
      <Card className="mt-4 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-ink-300">
            <Users className="size-4 text-brand-400" />
            <AnimatedNumber value={players.length} className="font-display text-3xl font-bold text-ink-100 tabular-nums" /> joined
          </p>
          <span className="text-xs text-ink-400">{pluralize(totalPolls, 'question')} ready</span>
        </div>
        <div className="mt-4 flex min-h-14 flex-wrap gap-2">
          {players.length ? (
            players.map((p) => (
              <span
                key={p.player_id}
                className="inline-flex animate-pop items-center gap-2 rounded-full border border-white/10 bg-ink-800 py-1 pr-3 pl-1 text-sm"
              >
                <Avatar name={p.player_name} size={26} />
                {p.player_name}
              </span>
            ))
          ) : (
            <p className="text-sm text-ink-400">Players will pop in here as they join…</p>
          )}
        </div>
      </Card>
      <div className="mt-8 flex flex-col items-center gap-2">
        <Button size="xl" onClick={onStart} loading={starting} className="w-full animate-pulse-ring sm:w-auto sm:px-12">
          <Play className="size-5" /> Start presentation
        </Button>
        <p className="text-xs text-ink-400">Once started, new players can't join.</p>
      </div>
    </div>
  )
}

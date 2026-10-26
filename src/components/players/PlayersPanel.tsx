import { useMemo, useRef, useState } from 'react'
import { Search, Users } from 'lucide-react'
import type { Player } from '../../api/types'
import { Badge } from '../ui/Badge'
import { EmptyState } from '../ui/EmptyState'
import { PlayerRow } from './PlayerRow'

type Props = {
  players: Player[]
  meId?: string
  /** When set, shows who already voted on the poll on screen. */
  votedIds?: Set<string>
  /** Host only: remove a player. */
  onRemove?: (player: Player) => void
}

export function PlayersPanel({ players, meId, votedIds, onRemove }: Props) {
  const [query, setQuery] = useState('')
  // Players present on first render don't animate; later arrivals pop in.
  const initial = useRef<Set<string> | null>(null)
  if (initial.current === null && players.length) initial.current = new Set(players.map((p) => p.player_id))

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? players.filter((p) => p.player_name.toLowerCase().includes(q)) : players
  }, [players, query])

  if (!players.length) {
    return (
      <EmptyState icon={<Users className="size-6" />} title="No players yet">
        Share the join link. Players appear here the moment they sign up.
      </EmptyState>
    )
  }

  const votedCount = votedIds ? players.filter((p) => votedIds.has(p.player_id)).length : 0

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3 px-4 pt-4">
        <p className="text-sm text-ink-300">
          <span className="font-display text-2xl font-semibold text-ink-100">{players.length}</span>{' '}
          {players.length === 1 ? 'player' : 'players'}
        </p>
        {votedIds && (
          <Badge tone="brand">
            {votedCount}/{players.length} voted
          </Badge>
        )}
      </div>
      {players.length > 6 && (
        <div className="relative mx-4 mt-3">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players"
            aria-label="Search players"
            className="h-10 w-full rounded-xl border border-ink-600 bg-ink-800 pr-3 pl-9 text-sm outline-none placeholder:text-ink-400 focus:border-brand-500"
          />
        </div>
      )}
      <ul className="mt-3 flex-1 space-y-1 overflow-y-auto px-2 pb-4">
        {filtered.map((p, i) => (
          <PlayerRow
            key={p.player_id}
            player={p}
            index={i}
            isMe={p.player_id === meId}
            isNew={!!initial.current && !initial.current.has(p.player_id)}
            voted={votedIds ? votedIds.has(p.player_id) : undefined}
            onRemove={onRemove}
          />
        ))}
        {!filtered.length && <li className="px-3 py-6 text-center text-sm text-ink-300">No one matches “{query}”.</li>}
      </ul>
    </div>
  )
}

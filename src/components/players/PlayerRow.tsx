import { CheckCircle2, UserMinus } from 'lucide-react'
import type { Player } from '../../api/types'
import { cn } from '../../utils/cn'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { IconButton } from '../ui/IconButton'

type Props = {
  player: Player
  isMe: boolean
  isNew: boolean
  index: number
  /** undefined: don't show vote status. */
  voted?: boolean
  onRemove?: (player: Player) => void
}

export function PlayerRow({ player, isMe, isNew, index, voted, onRemove }: Props) {
  return (
    <li
      className={cn(
        'group flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors hover:bg-white/[0.03]',
        isMe && 'bg-brand-500/[0.07] ring-1 ring-brand-500/25',
        isNew ? 'animate-pop' : 'animate-fade-up',
      )}
      style={isNew ? undefined : { animationDelay: `${Math.min(index, 12) * 25}ms` }}
    >
      <Avatar name={player.player_name} />
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{player.player_name}</span>
      {isMe && <Badge tone="brand">You</Badge>}
      {voted !== undefined &&
        (voted ? (
          <CheckCircle2 className="size-4.5 text-emerald-400" aria-label="Voted" />
        ) : (
          <span className="size-2 rounded-full bg-ink-500" aria-label="Not voted yet" />
        ))}
      {onRemove && (
        <IconButton
          label={`Remove ${player.player_name}`}
          onClick={() => onRemove(player)}
          className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:text-red-300"
        >
          <UserMinus className="size-4" />
        </IconButton>
      )}
    </li>
  )
}

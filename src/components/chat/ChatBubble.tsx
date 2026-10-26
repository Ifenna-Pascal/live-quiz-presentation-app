import { Crown } from 'lucide-react'
import type { ChatMessage } from '../../api/types'
import { clockTime } from '../../utils/time'
import { cn } from '../../utils/cn'
import { Avatar } from '../ui/Avatar'

type Props = { message: ChatMessage; mine: boolean; grouped: boolean }

export function ChatBubble({ message: m, mine, grouped }: Props) {
  const isHost = m.author_role === 'host'
  return (
    <div className={cn('flex animate-fade-up gap-2.5', mine && 'flex-row-reverse', grouped && '-mt-2')}>
      <div className="w-8 shrink-0">{!grouped && !mine && <Avatar name={m.author_name} size={32} />}</div>
      <div className={cn('flex max-w-[78%] flex-col', mine && 'items-end')}>
        {!grouped && (
          <div className={cn('mb-1 flex items-center gap-1.5 text-xs text-ink-300', mine && 'flex-row-reverse')}>
            <span className="font-medium text-ink-200">{mine ? 'You' : m.author_name}</span>
            {isHost && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-1.5 py-px text-[10px] font-semibold tracking-wide text-brand-300 uppercase">
                <Crown className="size-2.5" /> Host
              </span>
            )}
            <span className="text-ink-400">{clockTime(m.created_at)}</span>
          </div>
        )}
        <p
          className={cn(
            'rounded-2xl px-3.5 py-2 text-[15px] leading-snug break-words whitespace-pre-wrap',
            mine
              ? 'rounded-tr-md bg-gradient-to-b from-brand-400 to-brand-500 text-ink-950'
              : isHost
                ? 'surface-brand rounded-tl-md'
                : 'rounded-tl-md bg-ink-700',
          )}
        >
          {m.body}
        </p>
      </div>
    </div>
  )
}

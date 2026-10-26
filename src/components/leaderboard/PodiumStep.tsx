import { Crown } from 'lucide-react'
import type { LeaderboardEntry } from '../../api/types'
import { cn } from '../../utils/cn'
import { pluralize } from '../../utils/format'
import { MoneyAmount } from '../prize/MoneyAmount'
import { Avatar } from '../ui/Avatar'

const STYLES = {
  1: { height: 'h-32', avatar: 60, ring: 'ring-brand-400', glow: 'from-brand-500/40', label: 'text-brand-300', delay: '200ms' },
  2: { height: 'h-24', avatar: 48, ring: 'ring-ink-200', glow: 'from-ink-200/20', label: 'text-ink-100', delay: '80ms' },
  3: { height: 'h-16', avatar: 44, ring: 'ring-amber-700', glow: 'from-amber-700/25', label: 'text-amber-500', delay: '0ms' },
} as const

type Props = {
  entry: LeaderboardEntry | undefined
  /** The step's position on the podium; only used when the step is empty. */
  place: 1 | 2 | 3
  isMe: boolean
  large?: boolean
  currency?: string
}

export function PodiumStep({ entry, place, isMe, large, currency }: Props) {
  // Style by rank, not position, so tied players look identical: two players
  // tied for 1st both get the tallest step and the crown.
  const tier = entry ? (Math.min(entry.rank, 3) as 1 | 2 | 3) : place
  const s = STYLES[tier]
  return (
    <div className="flex min-w-0 flex-col items-center">
      {entry ? (
        <div className="flex w-full animate-fade-up flex-col items-center" style={{ animationDelay: s.delay }}>
          {tier === 1 && <Crown className="mb-1 size-6 animate-float text-brand-400 drop-shadow-[0_0_10px_#ff7a1a]" />}
          <div className="relative">
            {tier === 1 && <div className="absolute -inset-3 animate-glow rounded-full bg-brand-500/30 blur-xl" />}
            <Avatar name={entry.player_name} size={large ? s.avatar * 1.4 : s.avatar} className={cn('relative ring-2', s.ring)} />
          </div>
          <p className={cn('mt-2 w-full truncate text-center font-semibold', large ? 'text-base' : 'text-xs')}>
            {entry.player_name}
            {isMe && <span className="text-brand-300"> (you)</span>}
          </p>
          <p className={cn('font-display font-bold tabular-nums', s.label, large ? 'text-lg' : 'text-sm')}>{pluralize(entry.score, 'pt')}</p>
          {currency && entry.payout > 0 && (
            <MoneyAmount
              value={entry.payout}
              currency={currency}
              className={cn(
                'mt-0.5 rounded-full bg-amber-400/10 px-2 font-display font-bold text-amber-300 tabular-nums ring-1 ring-amber-400/30',
                large ? 'py-0.5 text-sm' : 'text-[11px]',
              )}
            />
          )}
        </div>
      ) : (
        <div className="mb-9 size-11 rounded-full border border-dashed border-ink-600" />
      )}
      <div
        className={cn(
          'mt-2 grid w-full origin-bottom animate-rise place-items-center rounded-t-2xl border border-b-0 border-white/10 bg-gradient-to-b to-ink-800 font-display font-bold',
          large ? `${s.height} scale-y-110 text-4xl` : `${s.height} text-3xl`,
          s.glow,
          tier === 1 ? 'text-brand-300' : 'text-ink-300',
        )}
        style={{ animationDelay: s.delay }}
      >
        {/* Tied players share a rank, so e.g. the 2nd step can show a 1. */}
        {entry?.rank ?? place}
      </div>
    </div>
  )
}

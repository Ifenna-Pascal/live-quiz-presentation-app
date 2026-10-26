import { Banknote } from 'lucide-react'
import type { Prize } from '../../api/types'
import { cn } from '../../utils/cn'
import { formatMoney } from '../../utils/format'

type Props = { prize: Prize; final?: boolean; className?: string }

/** The prize pool and how it is shared, shown above standings. */
export function PrizePoolBanner({ prize, final, className }: Props) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border border-amber-400/25 bg-gradient-to-r from-amber-400/[0.12] via-amber-400/[0.05] to-transparent px-4 py-3 text-left',
        className,
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30">
        <Banknote className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold tracking-wider text-amber-300/80 uppercase">{final ? 'Prize paid out' : 'Prize pool'}</p>
        <p className="font-display text-xl leading-tight font-bold text-amber-200 tabular-nums">{formatMoney(prize.pool, prize.currency)}</p>
      </div>
      <p className="max-w-[11rem] text-right text-[11px] leading-snug text-ink-300">
        {final ? 'Shared by the top 3 by score' : 'Top 3 share it by score. Updates live.'}
      </p>
    </div>
  )
}

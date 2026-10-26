import { cn } from '../../utils/cn'
import { MoneyAmount } from './MoneyAmount'

type Props = { amount: number; currency: string; className?: string; size?: 'sm' | 'md' }

/** The money a player is currently winning. Hidden while it is zero. */
export function PayoutChip({ amount, currency, className, size = 'sm' }: Props) {
  if (amount <= 0) return null
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-display font-bold tabular-nums whitespace-nowrap transition-colors duration-500',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-sm',
        'animate-pop border-amber-400/40 bg-amber-400/10 text-amber-300',
        className,
      )}
    >
      <MoneyAmount value={amount} currency={currency} />
    </span>
  )
}

import { Banknote } from 'lucide-react'
import type { Prize } from '../../api/types'
import { formatMoney } from '../../utils/format'
import { Badge } from '../ui/Badge'

/** A small "₦50,000 prize" label. */
export function PrizeBadge({ prize, className }: { prize: Prize; className?: string }) {
  return (
    <Badge tone="amber" className={className}>
      <Banknote className="size-3.5" /> {formatMoney(prize.pool, prize.currency)} prize
    </Badge>
  )
}

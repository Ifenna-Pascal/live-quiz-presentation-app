import { useAnimatedNumber } from '../../hooks/ui'
import { formatMoney } from '../../utils/format'

/** A money amount that counts up or down when it changes. */
export function MoneyAmount({ value, currency, className }: { value: number; currency: string; className?: string }) {
  const shown = useAnimatedNumber(value)
  return <span className={className}>{formatMoney(shown, currency)}</span>
}

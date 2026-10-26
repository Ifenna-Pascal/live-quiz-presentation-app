import { useAnimatedNumber } from '../../hooks/ui'

export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const shown = useAnimatedNumber(value)
  return <span className={className}>{shown}</span>
}

import { cn } from '../../utils/cn'

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-2 overflow-hidden rounded-full bg-ink-700', className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 shadow-[0_0_12px_rgb(255_122_26/0.6)] transition-[width] duration-700 ease-out"
        style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%` }}
      />
    </div>
  )
}

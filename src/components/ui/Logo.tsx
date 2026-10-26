import { cn } from '../../utils/cn'

export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 font-display text-lg font-bold tracking-tight', className)}>
      <span className="surface grid size-9 place-items-center rounded-xl bg-ink-800">
        <svg viewBox="0 0 32 32" className="size-5" aria-hidden>
          <rect x="6" y="15" width="5" height="11" rx="2.5" fill="#ff7a1a" />
          <rect x="13.5" y="6" width="5" height="20" rx="2.5" fill="#ffbb85" />
          <rect x="21" y="11" width="5" height="15" rx="2.5" fill="#ff7a1a" opacity=".6" />
        </svg>
      </span>
      {!compact && (
        <span>
          Tri<span className="text-gradient">via</span>
        </span>
      )}
    </span>
  )
}

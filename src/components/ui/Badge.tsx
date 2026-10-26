import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

type Props = {
  tone?: 'neutral' | 'brand' | 'green' | 'red' | 'amber'
  children: ReactNode
  dot?: boolean
  className?: string
}

export function Badge({ tone = 'neutral', children, dot, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        tone === 'neutral' && 'border-ink-600 bg-ink-800 text-ink-200',
        tone === 'brand' && 'border-brand-500/30 bg-brand-500/10 text-brand-300',
        tone === 'green' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
        tone === 'red' && 'border-red-500/30 bg-red-500/10 text-red-300',
        tone === 'amber' && 'border-amber-500/30 bg-amber-500/10 text-amber-300',
        className,
      )}
    >
      {dot && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  )
}

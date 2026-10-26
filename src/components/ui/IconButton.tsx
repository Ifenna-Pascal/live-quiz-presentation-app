import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }

export function IconButton({ label, children, className, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'grid size-9 shrink-0 place-items-center rounded-lg text-ink-300 transition-colors hover:bg-ink-700 hover:text-ink-100 disabled:pointer-events-none disabled:opacity-30',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

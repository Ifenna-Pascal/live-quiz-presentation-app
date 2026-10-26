import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../utils/cn'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = 'primary', size = 'md', loading, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl font-semibold whitespace-nowrap transition-all duration-200',
        'disabled:cursor-not-allowed disabled:opacity-45 active:scale-[0.97]',
        size === 'sm' && 'h-9 px-3 text-sm',
        size === 'md' && 'h-11 px-4 text-sm',
        size === 'lg' && 'h-12 px-5 text-[15px]',
        size === 'xl' && 'h-14 rounded-2xl px-7 text-base',
        variant === 'primary' &&
          'bg-gradient-to-b from-brand-400 to-brand-600 text-ink-950 shadow-[0_10px_30px_-10px_rgb(255_122_26/0.7),inset_0_1px_0_rgb(255_255_255/0.35)] hover:brightness-110',
        variant === 'secondary' &&
          'border border-ink-600 bg-ink-800/80 text-ink-100 hover:border-ink-500 hover:bg-ink-700 backdrop-blur',
        variant === 'ghost' && 'text-ink-200 hover:bg-ink-800 hover:text-ink-100',
        variant === 'danger' && 'border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20',
        variant === 'success' &&
          'bg-gradient-to-b from-emerald-400 to-emerald-600 text-ink-950 shadow-[0_10px_30px_-12px_rgb(16_185_129/0.7)] hover:brightness-110',
        className,
      )}
      {...rest}
    >
      {variant === 'primary' && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
      )}
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  )
})

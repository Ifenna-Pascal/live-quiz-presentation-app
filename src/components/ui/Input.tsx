import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

type Props = InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }

export const Input = forwardRef<HTMLInputElement, Props>(function Input({ label, hint, error, className, id, ...rest }, ref) {
  const inputId = id ?? rest.name
  return (
    <label className="block" htmlFor={inputId}>
      {label && <span className="mb-1.5 block text-sm font-medium text-ink-200">{label}</span>}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        className={cn(
          'h-12 w-full rounded-xl border bg-ink-850/80 px-4 text-[15px] text-ink-100 placeholder:text-ink-400',
          'transition-[border-color,box-shadow] outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15',
          error ? 'border-red-500/60' : 'border-ink-600 hover:border-ink-500',
          className,
        )}
        {...rest}
      />
      {(error || hint) && (
        <span className={cn('mt-1.5 block text-xs', error ? 'text-red-300' : 'text-ink-300')}>{error ?? hint}</span>
      )}
    </label>
  )
})

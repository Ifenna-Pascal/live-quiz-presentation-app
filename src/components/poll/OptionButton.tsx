import { Loader2, X } from 'lucide-react'
import type { Option } from '../../api/types'
import { cn } from '../../utils/cn'

export type OptionState = 'idle' | 'sending' | 'wrong' | 'disabled'

type Props = { option: Option; state: OptionState; index: number; onPick: (key: string) => void }

/** One tap answers. A wrong pick shakes, gets crossed out and can't be picked again. */
export function OptionButton({ option, state, index, onPick }: Props) {
  const wrong = state === 'wrong'
  return (
    <li className="animate-fade-up" style={{ animationDelay: `${index * 55}ms` }}>
      <button
        type="button"
        onClick={() => onPick(option.key)}
        disabled={state !== 'idle'}
        className={cn(
          'group flex min-h-16 w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all duration-200 active:scale-[0.97]',
          wrong && 'animate-wiggle border-red-500/50 bg-red-500/10 opacity-70',
          state === 'sending' && 'border-brand-500 bg-brand-500/10',
          state === 'idle' && 'border-white/5 bg-ink-800/80 hover:-translate-y-0.5 hover:border-brand-500/60 hover:bg-ink-750',
          state === 'disabled' && 'border-white/5 bg-ink-800/50 opacity-60',
        )}
      >
        <span
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-xl font-display text-lg font-bold transition-all',
            wrong ? 'bg-red-500/20 text-red-300' : state === 'sending' ? 'bg-brand-500 text-ink-950' : 'bg-ink-700 text-ink-200 group-hover:bg-brand-500 group-hover:text-ink-950',
          )}
        >
          {option.key}
        </span>
        <span className={cn('flex-1 text-base font-medium sm:text-lg', wrong && 'line-through decoration-red-400/70')}>{option.value}</span>
        {wrong && <X className="size-5 text-red-400" aria-label="Wrong" />}
        {state === 'sending' && <Loader2 className="size-5 animate-spin text-brand-400" />}
      </button>
    </li>
  )
}

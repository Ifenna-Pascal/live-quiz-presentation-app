import { Timer } from 'lucide-react'
import { cn } from '../../utils/cn'
import { MAX_TIME_LIMIT, MIN_TIME_LIMIT, TIME_PRESETS } from './draft'

type Props = { value: number; onChange: (seconds: number) => void; onApplyToAll?: () => void }

/** Presets plus a custom number of seconds for one question. */
export function TimeLimitPicker({ value, onChange, onApplyToAll }: Props) {
  const invalid = value < MIN_TIME_LIMIT || value > MAX_TIME_LIMIT
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-white/5 bg-ink-800/60 p-2">
      <span className="flex items-center gap-1.5 px-1.5 text-sm font-medium text-ink-200">
        <Timer className="size-4 text-brand-400" /> Time
      </span>
      {TIME_PRESETS.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          aria-pressed={value === s}
          className={cn(
            'h-8 rounded-lg px-3 text-sm font-semibold tabular-nums transition-colors',
            value === s ? 'bg-brand-500 text-ink-950' : 'bg-ink-700 text-ink-200 hover:bg-ink-600',
          )}
        >
          {s}s
        </button>
      ))}
      <label className="flex items-center gap-1.5">
        <input
          type="number"
          min={MIN_TIME_LIMIT}
          max={MAX_TIME_LIMIT}
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label="Seconds to answer"
          className={cn(
            'h-8 w-20 rounded-lg border bg-ink-850 px-2 text-center text-sm tabular-nums outline-none focus:border-brand-500',
            invalid ? 'border-red-500/60' : 'border-ink-600',
          )}
        />
        <span className="text-xs text-ink-400">sec</span>
      </label>
      {onApplyToAll && (
        <button type="button" onClick={onApplyToAll} className="ml-auto rounded-lg px-2 py-1 text-xs font-medium text-brand-400 hover:bg-brand-500/10">
          Use for all questions
        </button>
      )}
      {invalid && <p className="w-full px-1.5 text-xs text-red-300">Pick between {MIN_TIME_LIMIT} and {MAX_TIME_LIMIT} seconds.</p>}
    </div>
  )
}

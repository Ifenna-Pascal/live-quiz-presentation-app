import { Check, X } from 'lucide-react'
import { IconButton } from '../../components/ui/IconButton'
import { cn } from '../../utils/cn'
import type { DraftOption } from './draft'

type Props = {
  option: DraftOption
  letter: string
  canRemove: boolean
  onChange: (option: DraftOption) => void
  onRemove: () => void
}

export function OptionEditorRow({ option, letter, canRemove, onChange, onRemove }: Props) {
  return (
    <li className="flex animate-fade-up items-center gap-2">
      <span
        className={cn(
          'grid size-11 shrink-0 place-items-center rounded-xl font-display text-sm font-bold transition-colors',
          option.correct ? 'bg-emerald-500 text-ink-950' : 'bg-ink-700',
        )}
      >
        {letter}
      </span>
      <input
        value={option.value}
        onChange={(e) => onChange({ ...option, value: e.target.value })}
        placeholder={`Answer ${letter}`}
        aria-label={`Answer ${letter}`}
        maxLength={200}
        className={cn(
          'h-11 min-w-0 flex-1 rounded-xl border bg-ink-800 px-3.5 text-[15px] outline-none placeholder:text-ink-500 focus:border-brand-500',
          option.correct ? 'border-emerald-500/50' : 'border-ink-600',
        )}
      />
      <button
        type="button"
        onClick={() => onChange({ ...option, correct: !option.correct })}
        aria-pressed={option.correct}
        className={cn(
          'flex h-11 shrink-0 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-colors',
          option.correct
            ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
            : 'border-ink-600 text-ink-300 hover:border-ink-500 hover:text-ink-100',
        )}
      >
        <Check className="size-4" />
        <span className="hidden sm:inline">Correct</span>
      </button>
      <IconButton label="Remove answer" disabled={!canRemove} onClick={onRemove}>
        <X className="size-4" />
      </IconButton>
    </li>
  )
}

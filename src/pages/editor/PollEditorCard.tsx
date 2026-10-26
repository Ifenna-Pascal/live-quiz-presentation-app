import { ArrowDown, ArrowUp, Copy, Plus, Trash2 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { IconButton } from '../../components/ui/IconButton'
import { cn } from '../../utils/cn'
import { OPTION_KEYS } from '../../utils/optionKeys'
import { blankOption, type DraftPoll, type DraftProblem } from './draft'
import { OptionEditorRow } from './OptionEditorRow'
import { TimeLimitPicker } from './TimeLimitPicker'

type Props = {
  poll: DraftPoll
  index: number
  count: number
  problem: DraftProblem | null
  onChange: (poll: DraftPoll) => void
  onMove: (by: -1 | 1) => void
  onDuplicate: () => void
  onDelete: () => void
  onApplyTimeToAll: () => void
}

export function PollEditorCard({ poll, index, count, problem, onChange, onMove, onDuplicate, onDelete, onApplyTimeToAll }: Props) {
  const scored = poll.options.some((o) => o.correct)
  return (
    <Card className="animate-fade-up p-5">
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-brand-500/15 font-display text-sm font-bold text-brand-300">
          {index + 1}
        </span>
        <span className="text-sm font-medium text-ink-300">Question {index + 1}</span>
        <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-medium', scored ? 'bg-emerald-500/10 text-emerald-300' : 'bg-ink-700 text-ink-300')}>
          {scored ? 'Scored' : 'Opinion'}
        </span>
        <div className="ml-auto flex items-center gap-0.5">
          <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            <ArrowUp className="size-4" />
          </IconButton>
          <IconButton label="Move down" disabled={index === count - 1} onClick={() => onMove(1)}>
            <ArrowDown className="size-4" />
          </IconButton>
          <IconButton label="Duplicate" onClick={onDuplicate}>
            <Copy className="size-4" />
          </IconButton>
          <IconButton label="Delete question" disabled={count === 1} onClick={onDelete} className="hover:text-red-300">
            <Trash2 className="size-4" />
          </IconButton>
        </div>
      </div>

      <textarea
        value={poll.question}
        onChange={(e) => onChange({ ...poll, question: e.target.value })}
        placeholder="Type your question…"
        aria-label={`Question ${index + 1}`}
        rows={2}
        maxLength={300}
        className={cn(
          'mt-3 w-full resize-none rounded-xl border bg-ink-800 px-4 py-3 text-lg font-medium outline-none placeholder:text-ink-500 focus:border-brand-500',
          problem?.question ? 'border-red-500/60' : 'border-ink-600',
        )}
      />

      <TimeLimitPicker
        value={poll.timeLimit}
        onChange={(timeLimit) => onChange({ ...poll, timeLimit })}
        onApplyToAll={count > 1 ? onApplyTimeToAll : undefined}
      />

      <ul className="mt-3 space-y-2">
        {poll.options.map((opt, oi) => (
          <OptionEditorRow
            key={opt.id}
            option={opt}
            letter={OPTION_KEYS[oi]}
            canRemove={poll.options.length > 2}
            onChange={(next) => onChange({ ...poll, options: poll.options.map((o) => (o.id === opt.id ? next : o)) })}
            onRemove={() => onChange({ ...poll, options: poll.options.filter((o) => o.id !== opt.id) })}
          />
        ))}
      </ul>
      {problem?.options && <p className="mt-2 text-xs text-red-300">Add at least two answers.</p>}
      {poll.options.length < OPTION_KEYS.length && (
        <button
          type="button"
          onClick={() => onChange({ ...poll, options: [...poll.options, blankOption()] })}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-brand-400 hover:bg-brand-500/10"
        >
          <Plus className="size-4" /> Add answer
        </button>
      )}
    </Card>
  )
}

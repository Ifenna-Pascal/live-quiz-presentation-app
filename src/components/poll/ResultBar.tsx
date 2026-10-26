import { CheckCircle2, XCircle } from 'lucide-react'
import type { Option } from '../../api/types'
import { cn } from '../../utils/cn'

type Props = {
  option: Option
  count: number
  total: number
  isLeader: boolean
  isMine: boolean
  /** Only known once revealed (or for the host). */
  isCorrect: boolean
  revealed: boolean
  large?: boolean
}

export function ResultBar({ option, count, total, isLeader, isMine, isCorrect, revealed, large }: Props) {
  const pct = total ? Math.round((count / total) * 100) : 0
  const wrongPick = revealed && isMine && !isCorrect
  return (
    <li>
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border bg-ink-800/70 transition-colors',
          large ? 'px-5 py-4' : 'px-4 py-3',
          isCorrect ? 'border-emerald-500/60' : wrongPick ? 'border-red-500/50' : isMine ? 'border-brand-500/60' : 'border-white/5',
          revealed && !isCorrect && !isMine && 'opacity-60',
        )}
      >
        <div
          className={cn(
            'absolute inset-y-0 left-0 transition-[width] duration-700 ease-out',
            isCorrect ? 'bg-emerald-500/20' : isLeader && !revealed ? 'bg-gradient-to-r from-brand-500/30 to-brand-500/10' : 'bg-ink-600/50',
          )}
          style={{ width: `${pct}%` }}
        />
        <div className="relative flex items-center gap-3">
          <span
            className={cn(
              'grid shrink-0 place-items-center rounded-lg font-display font-bold',
              large ? 'size-10 text-lg' : 'size-8 text-sm',
              isCorrect ? 'bg-emerald-500 text-ink-950' : isLeader && !revealed ? 'bg-brand-500 text-ink-950' : 'bg-ink-700 text-ink-200',
            )}
          >
            {option.key}
          </span>
          <span className={cn('min-w-0 flex-1 font-medium', large ? 'text-lg' : 'text-[15px]')}>
            {option.value}
            {isMine && <span className="ml-2 text-xs font-semibold text-brand-300">Your pick</span>}
          </span>
          {isCorrect && <CheckCircle2 className="size-5 shrink-0 text-emerald-400" aria-label="Correct answer" />}
          {wrongPick && <XCircle className="size-5 shrink-0 text-red-400" aria-label="Wrong answer" />}
          <span className="shrink-0 text-right tabular-nums">
            <span className={cn('font-display font-bold', large ? 'text-2xl' : 'text-lg')}>{pct}%</span>
            <span className="ml-1.5 text-xs text-ink-300">{count}</span>
          </span>
        </div>
      </div>
    </li>
  )
}

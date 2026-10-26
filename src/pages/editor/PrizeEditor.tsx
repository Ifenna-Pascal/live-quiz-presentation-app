import { Banknote } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { cn } from '../../utils/cn'
import { currencySymbol, formatMoney, PRIZE_CURRENCIES } from '../../utils/format'
import { splitPrize } from '../../utils/scoring'
import { type DraftPrize, MAX_PRIZE } from './draft'

const PRESETS = [10_000, 50_000, 100_000]
/** Example final scores for the preview. */
const EXAMPLE_SCORES = [5, 3, 2]

type Props = { prize: DraftPrize; onChange: (next: DraftPrize) => void; invalid: boolean }

/** Optional prize money the top 3 players share. */
export function PrizeEditor({ prize, onChange, invalid }: Props) {
  const amount = Number(prize.amount) || 0
  const example = splitPrize(amount, EXAMPLE_SCORES)

  return (
    <Card className={cn('mt-4 p-5 transition-colors', prize.enabled && 'border-amber-400/25')}>
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-xl ring-1 transition-colors',
            prize.enabled ? 'bg-amber-400/15 text-amber-300 ring-amber-400/30' : 'bg-ink-800 text-ink-400 ring-white/5',
          )}
        >
          <Banknote className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-ink-100">
            Prize money <span className="text-xs font-normal text-ink-400">(optional)</span>
          </p>
          <p className="mt-0.5 text-sm text-ink-300">The top 3 players share it by score, updated live as they play.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={prize.enabled}
          aria-label="Add prize money"
          onClick={() => onChange({ ...prize, enabled: !prize.enabled })}
          className={cn(
            'relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors',
            prize.enabled ? 'bg-amber-400' : 'bg-ink-600',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform',
              prize.enabled && 'translate-x-5',
            )}
          />
        </button>
      </div>

      {prize.enabled && (
        <div className="mt-5 animate-fade-up space-y-4">
          <div className="flex flex-wrap gap-2">
            <select
              value={prize.currency}
              onChange={(e) => onChange({ ...prize, currency: e.target.value })}
              aria-label="Currency"
              className="h-11 rounded-xl border border-ink-600 bg-ink-850 px-3 text-sm font-medium outline-none focus:border-amber-400"
            >
              {PRIZE_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {currencySymbol(c)} {c}
                </option>
              ))}
            </select>
            <label
              className={cn(
                'flex h-11 min-w-0 flex-1 items-center gap-2 rounded-xl border bg-ink-850 px-3 focus-within:border-amber-400',
                invalid ? 'border-red-500/60' : 'border-ink-600',
              )}
            >
              <span className="text-ink-400">{currencySymbol(prize.currency)}</span>
              <input
                inputMode="numeric"
                value={prize.amount ? Number(prize.amount).toLocaleString() : ''}
                onChange={(e) => onChange({ ...prize, amount: e.target.value.replace(/\D/g, '').slice(0, 13) })}
                placeholder="50,000"
                aria-label="Prize amount"
                className="min-w-0 flex-1 border-0 bg-transparent font-display text-lg font-semibold tabular-nums outline-none placeholder:text-ink-500"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onChange({ ...prize, amount: String(p) })}
                aria-pressed={amount === p}
                className={cn(
                  'h-8 rounded-lg px-3 text-sm font-semibold tabular-nums transition-colors',
                  amount === p ? 'bg-amber-400 text-ink-950' : 'bg-ink-700 text-ink-200 hover:bg-ink-600',
                )}
              >
                {formatMoney(p, prize.currency)}
              </button>
            ))}
          </div>
          {invalid && <p className="text-xs text-red-300">Enter an amount between 1 and {MAX_PRIZE.toLocaleString()}, or turn prize money off.</p>}

          {amount > 0 && (
            <div className="rounded-xl border border-white/5 bg-ink-800/60 p-3">
              <p className="text-xs text-ink-400">
                Example: if the top 3 finish with {EXAMPLE_SCORES.join(', ')} points
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                {example.map((v, i) => (
                  <div key={i} className="rounded-lg bg-ink-850 px-2 py-2">
                    <p className="text-[11px] text-ink-400">{['1st', '2nd', '3rd'][i]}</p>
                    <p className="font-display text-sm font-bold text-amber-300 tabular-nums">{formatMoney(v, prize.currency)}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-400">
                While only one player has scored, they hold the whole prize. Players tied on a score share the same place and get the same amount.
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

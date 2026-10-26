import type { CurrentPoll } from '../../api/types'
import { useCountdown } from '../../hooks/room'
import { cn } from '../../utils/cn'

type Props = { poll: CurrentPoll; size?: number }

/** A ring that drains as time runs out; it turns red in the last 5 seconds. */
export function CountdownRing({ poll, size = 72 }: Props) {
  const { msLeft, fraction, running } = useCountdown(poll)
  const seconds = Math.ceil(msLeft / 1000)
  const urgent = running && seconds <= 5
  const stroke = Math.max(4, size / 14)
  const r = (size - stroke) / 2
  const circumference = 2 * Math.PI * r

  return (
    <div
      className={cn('relative grid shrink-0 place-items-center', urgent && 'animate-pulse')}
      style={{ width: size, height: size }}
      role="timer"
      aria-label={running ? `${seconds} seconds left` : 'Time is up'}
    >
      {running && (
        <div className={cn('absolute inset-0 rounded-full blur-xl', urgent ? 'bg-red-500/30' : 'bg-brand-500/20')} />
      )}
      <svg width={size} height={size} className="relative -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-ink-700" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
          className={cn('transition-[stroke-dashoffset] duration-100 ease-linear', urgent ? 'stroke-red-500' : 'stroke-brand-500')}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-center">
        <span>
          <span className={cn('block font-display leading-none font-bold tabular-nums', urgent ? 'text-red-400' : 'text-ink-100')} style={{ fontSize: size * 0.34 }}>
            {running ? seconds : 0}
          </span>
          <span className="block text-[10px] font-medium tracking-wider text-ink-400 uppercase">{running ? 'sec' : 'done'}</span>
        </span>
      </span>
    </div>
  )
}

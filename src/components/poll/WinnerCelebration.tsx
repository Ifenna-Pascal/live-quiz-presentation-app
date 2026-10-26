import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Sparkles, Zap } from 'lucide-react'
import type { Option, WinnerEvent } from '../../api/types'
import { formatSeconds } from '../../utils/time'
import { Confetti } from '../feedback/Confetti'
import { Avatar } from '../ui/Avatar'

type Props = { win: WinnerEvent; options: Option[]; onDone: () => void }

const SHOW_MS = 5000

/** The host's "Hooray!" moment: who answered first, with confetti. Click or wait to close. */
export function WinnerCelebration({ win, options, onDone }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDone, SHOW_MS)
    return () => clearTimeout(timer)
  }, [win, onDone])

  const answer = options.find((o) => o.key === win.key)

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid animate-fade-in cursor-pointer place-items-center bg-ink-950/80 p-6 backdrop-blur-md"
      onClick={onDone}
      role="alert"
      aria-live="assertive"
    >
      <Confetti burstKey={`${win.poll_id}-${win.player_id}`} pieces={140} />
      <div className="relative flex animate-pop flex-col items-center text-center">
        <div className="absolute top-10 size-72 animate-glow rounded-full bg-brand-500/40 blur-3xl" />
        <p className="relative flex items-center gap-2 font-display text-2xl font-bold tracking-widest text-brand-300 uppercase">
          <Sparkles className="size-6" /> Hooray! <Sparkles className="size-6" />
        </p>
        <div className="relative mt-6">
          <div className="absolute -inset-4 animate-pulse-ring rounded-full" />
          <Avatar name={win.player_name} size={150} className="relative ring-4 ring-brand-400 shadow-[0_0_80px_rgb(255_122_26/0.6)]" />
          <span className="absolute -right-2 -bottom-2 grid size-14 animate-wiggle place-items-center rounded-full border-4 border-ink-900 bg-brand-500 text-2xl">
            🏆
          </span>
        </div>
        <h2 className="relative mt-8 font-display text-5xl font-bold tracking-tight sm:text-7xl">
          <span className="text-gradient">{win.player_name}</span> got it!
        </h2>
        <p className="relative mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-lg text-ink-200">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-500/15 px-3 py-1 font-semibold text-brand-300">
            <Zap className="size-4" /> {formatSeconds(win.elapsed_ms)}
          </span>
          {answer && (
            <span>
              Answer <span className="font-bold text-emerald-300">{answer.key}. {answer.value}</span>
            </span>
          )}
        </p>
        <p className="relative mt-3 text-sm font-semibold text-emerald-300">+1 point · climbing the leaderboard</p>
      </div>
    </div>,
    document.body,
  )
}

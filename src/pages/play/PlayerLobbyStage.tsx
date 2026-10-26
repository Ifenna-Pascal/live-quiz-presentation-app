import { CheckCircle2, Hourglass } from 'lucide-react'
import type { Prize } from '../../api/types'
import { PrizePoolBanner } from '../../components/prize/PrizePoolBanner'
import { Avatar } from '../../components/ui/Avatar'

type Props = { name: string; title: string; names: string[]; prize?: Prize | null }

export function PlayerLobbyStage({ name, title, names, prize }: Props) {
  return (
    <div className="relative mx-auto flex max-w-xl flex-col items-center px-4 py-14 text-center sm:py-20">
      <div className="relative">
        <div className="absolute -inset-6 animate-glow rounded-full bg-brand-500/20 blur-2xl" />
        <Avatar name={name} size={104} className="relative animate-pulse-ring" />
        <span className="absolute -right-1 -bottom-1 grid size-9 place-items-center rounded-full border-4 border-ink-900 bg-emerald-500">
          <CheckCircle2 className="size-4 text-ink-950" />
        </span>
      </div>
      <p className="mt-7 text-xs font-semibold tracking-wider text-brand-400 uppercase">{title}</p>
      <h2 className="mt-1 font-display text-4xl font-bold tracking-tight">You're in, {name}!</h2>
      <p className="mt-2 text-ink-300">Hang tight. The host will start the game soon.</p>
      {prize && <PrizePoolBanner prize={prize} className="mt-6 w-full max-w-md animate-fade-up" />}
      <div className="mt-8 flex items-center gap-2 text-sm text-ink-300">
        <Hourglass className="size-4 animate-spin text-brand-400 [animation-duration:3s]" />
        <span>
          <span className="font-semibold text-ink-100">{names.length}</span> {names.length === 1 ? 'player' : 'players'} in the lobby
        </span>
      </div>
      <div className="mt-6 flex max-w-md flex-wrap justify-center gap-2">
        {names.slice(-24).map((n, i) => (
          <span key={n + i} className="animate-float" style={{ animationDelay: `${(i % 6) * 0.4}s` }}>
            <Avatar name={n} size={40} className="ring-2 ring-ink-900" />
          </span>
        ))}
      </div>
    </div>
  )
}

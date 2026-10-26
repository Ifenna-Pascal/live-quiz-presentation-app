import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '../ui/Logo'

type Props = { backTo?: string; title: string; status?: ReactNode; actions?: ReactNode }

export function RoomHeader({ backTo, title, status, actions }: Props) {
  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center gap-3 border-b border-white/5 bg-ink-900/80 px-3 backdrop-blur-xl sm:px-5">
      {backTo ? (
        <Link
          to={backTo}
          className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-300 hover:bg-ink-800 hover:text-ink-100"
          aria-label="Back"
        >
          <ArrowLeft className="size-5" />
        </Link>
      ) : (
        <Link to="/" className="shrink-0" aria-label="Home">
          <Logo compact />
        </Link>
      )}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <h1 className="truncate font-display text-base font-semibold sm:text-lg">{title}</h1>
        {status}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}

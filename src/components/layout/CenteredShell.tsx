import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'
import { Logo } from '../ui/Logo'
import { BackgroundDecor } from './BackgroundDecor'

/** A single centred card on the decorated background (auth, join). */
export function CenteredShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10">
      <BackgroundDecor />
      <div className="relative w-full max-w-md animate-fade-up">
        <Link to="/" className="mb-8 flex justify-center" aria-label="Home">
          <Logo />
        </Link>
        <Card className="p-6 sm:p-8">{children}</Card>
      </div>
    </div>
  )
}

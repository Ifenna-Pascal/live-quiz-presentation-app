import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BackgroundDecor } from '../../components/layout/BackgroundDecor'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/EmptyState'

type Props = { icon: ReactNode; title: string; children?: ReactNode; actionTo?: string; actionLabel?: string }

/** A full-page message: not found, deleted, removed… */
export function StatusScreen({ icon, title, children, actionTo = '/', actionLabel = 'Go home' }: Props) {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden">
      <BackgroundDecor />
      <div className="relative">
        <EmptyState icon={icon} title={title}>
          {children}
          <Link to={actionTo} className="mt-6 inline-block">
            <Button variant="secondary">{actionLabel}</Button>
          </Link>
        </EmptyState>
      </div>
    </div>
  )
}

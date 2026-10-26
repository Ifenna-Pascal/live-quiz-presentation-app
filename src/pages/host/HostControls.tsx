import { ChevronLeft, ChevronRight, Eye, Flag } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import type { HostAction } from '../../hooks/host'

type Props = {
  index: number
  total: number
  revealed: boolean
  busy: HostAction | null
  onPrevious: () => void
  onReveal: () => void
  onNext: () => void
  onFinish: () => void
}

/** Previous · Reveal answer · Next / Finish. Reveal comes first, then moving on. */
export function HostControls({ index, total, revealed, busy, onPrevious, onReveal, onNext, onFinish }: Props) {
  const isLast = index >= total
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="secondary" size="lg" onClick={onPrevious} disabled={index <= 1 || !!busy} loading={busy === 'previous'} aria-label="Previous question">
        <ChevronLeft className="size-5" />
      </Button>
      {!revealed && (
        <Button size="lg" onClick={onReveal} loading={busy === 'reveal'} disabled={!!busy && busy !== 'reveal'}>
          <Eye className="size-5" /> End & reveal
        </Button>
      )}
      {isLast ? (
        <Button variant={revealed ? 'success' : 'secondary'} size="lg" onClick={onFinish} loading={busy === 'finish'} disabled={!!busy && busy !== 'finish'}>
          <Flag className="size-5" /> Finish
        </Button>
      ) : (
        <Button variant={revealed ? 'primary' : 'secondary'} size="lg" onClick={onNext} loading={busy === 'next'} disabled={!!busy && busy !== 'next'}>
          Next <ChevronRight className="size-5" />
        </Button>
      )}
    </div>
  )
}

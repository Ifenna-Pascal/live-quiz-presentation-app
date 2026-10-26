import { type ReactNode, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { useFocusTrap } from '../../hooks/ui'
import { Card } from './Card'

type Props = { open: boolean; title: string; onClose: () => void; children: ReactNode }

/** An accessible dialog: Escape closes it and focus stays inside. */
export function Modal({ open, title, onClose, children }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 grid animate-fade-in place-items-center bg-black/70 p-4 backdrop-blur-sm" onMouseDown={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="w-full max-w-md animate-pop outline-none"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Card className="bg-ink-850 p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="rounded-lg p-1 text-ink-300 hover:bg-ink-700 hover:text-ink-100" aria-label="Close">
              <X className="size-5" />
            </button>
          </div>
          {children}
        </Card>
      </div>
    </div>,
    document.body,
  )
}

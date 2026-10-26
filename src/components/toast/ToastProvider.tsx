import { type ReactNode, useCallback, useState } from 'react'
import { type Toast, ToastContext, type ToastTone } from './toast'
import { ToastItem } from './ToastItem'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = Date.now() + Math.random()
    // The same message again replaces the old one instead of stacking.
    setToasts((t) => [...t.filter((x) => x.message !== message).slice(-2), { id, tone, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-4 top-3 z-[60] flex flex-col items-center gap-2"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

import { CheckCircle2, Info, UserPlus, XCircle } from 'lucide-react'
import type { Toast } from './toast'

const ICONS = {
  success: <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />,
  error: <XCircle className="size-5 shrink-0 text-red-400" />,
  info: <Info className="size-5 shrink-0 text-brand-400" />,
  join: <UserPlus className="size-5 shrink-0 text-brand-400" />,
}

export function ToastItem({ toast }: { toast: Toast }) {
  return (
    <div className="surface pointer-events-auto flex w-full max-w-sm animate-slide-in items-center gap-3 rounded-2xl bg-ink-800/95 px-4 py-3 text-sm text-ink-100 shadow-2xl backdrop-blur-xl">
      {ICONS[toast.tone]}
      <span>{toast.message}</span>
    </div>
  )
}

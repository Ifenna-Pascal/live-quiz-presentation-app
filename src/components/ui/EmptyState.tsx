import type { ReactNode } from 'react'

type Props = { icon: ReactNode; title: string; children?: ReactNode }

export function EmptyState({ icon, title, children }: Props) {
  return (
    <div className="flex animate-fade-up flex-col items-center justify-center px-6 py-12 text-center">
      <div className="surface mb-4 grid size-14 place-items-center rounded-2xl bg-ink-800 text-brand-400">{icon}</div>
      <p className="font-display text-lg font-semibold text-ink-100">{title}</p>
      {children && <div className="mt-1.5 max-w-sm text-sm text-ink-300">{children}</div>}
    </div>
  )
}

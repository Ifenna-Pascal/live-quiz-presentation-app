import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

export function NewPresentationTile() {
  return (
    <Link to="/presentations/new" className="group">
      <div className="flex h-full min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-ink-600 text-ink-300 transition-all duration-300 group-hover:border-brand-500/60 group-hover:bg-brand-500/[0.04] group-hover:text-brand-300">
        <span className="grid size-12 place-items-center rounded-2xl bg-ink-800 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90">
          <Plus className="size-6" />
        </span>
        <span className="text-sm font-medium">New presentation</span>
      </div>
    </Link>
  )
}

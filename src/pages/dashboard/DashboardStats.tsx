import { Radio, Users, LayoutGrid } from 'lucide-react'
import type { MyPresentation } from '../../api/types'
import { AnimatedNumber } from '../../components/ui/AnimatedNumber'
import { Card } from '../../components/ui/Card'

export function DashboardStats({ items }: { items: MyPresentation[] }) {
  const stats = [
    { icon: LayoutGrid, label: 'Presentations', value: items.length },
    { icon: Radio, label: 'Live now', value: items.filter((p) => p.has_started && !p.has_finished).length },
    { icon: Users, label: 'Players reached', value: items.reduce((n, p) => n + p.player_count, 0) },
  ]
  return (
    <div className="mt-8 grid grid-cols-3 gap-3">
      {stats.map(({ icon: Icon, label, value }) => (
        <Card key={label} className="p-4">
          <Icon className="size-4 text-brand-400" />
          <AnimatedNumber value={value} className="mt-2 block font-display text-2xl font-bold tabular-nums sm:text-3xl" />
          <p className="text-xs text-ink-400">{label}</p>
        </Card>
      ))}
    </div>
  )
}

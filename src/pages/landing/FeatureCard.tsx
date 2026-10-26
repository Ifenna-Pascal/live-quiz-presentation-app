import type { LucideIcon } from 'lucide-react'
import { Card } from '../../components/ui/Card'

type Props = { icon: LucideIcon; title: string; text: string; index: number }

export function FeatureCard({ icon: Icon, title, text, index }: Props) {
  return (
    <div className="animate-fade-up" style={{ animationDelay: `${index * 70}ms` }}>
      <Card className="group h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-ink-800/80">
        <div className="mb-5 grid size-11 place-items-center rounded-xl bg-gradient-to-b from-brand-400/20 to-brand-600/10 text-brand-400 ring-1 ring-brand-500/20 transition-transform group-hover:scale-110">
          <Icon className="size-5" />
        </div>
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-300">{text}</p>
      </Card>
    </div>
  )
}

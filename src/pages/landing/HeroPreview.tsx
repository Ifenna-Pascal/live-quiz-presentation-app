import { useEffect, useState } from 'react'
import { Crown, Users } from 'lucide-react'
import { Avatar } from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Badge'
import { Card } from '../../components/ui/Card'

const OPTIONS = ['Go', 'TypeScript', 'Rust', 'Python']
const NAMES = ['Ada Obi', 'Tunde K', 'Grace H', 'Linus T', 'Ngozi A']
const WEIGHTS = [0.5, 0.35, 0.25, 0.15]

/** A self-animating mock of the playground, so the hero shows the product. */
export function HeroPreview() {
  const [votes, setVotes] = useState([12, 7, 4, 2])
  useEffect(() => {
    const id = setInterval(() => setVotes((v) => v.map((n, i) => n + (Math.random() < WEIGHTS[i] ? 1 : 0))), 900)
    return () => clearInterval(id)
  }, [])
  const total = votes.reduce((a, b) => a + b, 0)

  return (
    <div className="relative animate-fade-up [animation-delay:140ms]">
      <div className="absolute -inset-8 rounded-[2.5rem] bg-brand-500/15 blur-3xl" />
      <Card className="relative bg-ink-850/90 p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between">
          <Badge tone="brand" dot>
            Question 2 of 5
          </Badge>
          <div className="flex -space-x-2">
            {NAMES.map((n) => (
              <Avatar key={n} name={n} size={28} className="ring-2 ring-ink-850" />
            ))}
          </div>
        </div>
        <p className="mt-5 font-display text-xl font-semibold sm:text-2xl">What's your favourite language?</p>
        <ul className="mt-5 space-y-2.5">
          {OPTIONS.map((o, i) => {
            const pct = Math.round((votes[i] / total) * 100)
            return (
              <li key={o} className="relative overflow-hidden rounded-xl border border-white/5 bg-ink-800 px-3.5 py-2.5">
                <div
                  className={`absolute inset-y-0 left-0 transition-[width] duration-700 ${i === 0 ? 'bg-gradient-to-r from-brand-500/35 to-brand-500/10' : 'bg-ink-600/50'}`}
                  style={{ width: `${pct}%` }}
                />
                <div className="relative flex items-center gap-3 text-sm">
                  <span className={`grid size-7 place-items-center rounded-md font-bold ${i === 0 ? 'bg-brand-500 text-ink-950' : 'bg-ink-700'}`}>
                    {'ABCD'[i]}
                  </span>
                  <span className="flex-1 font-medium">{o}</span>
                  <span className="font-display font-bold tabular-nums">{pct}%</span>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-ink-800/70 px-3 py-2">
            <Users className="size-4 text-brand-400" />
            <span className="text-ink-300">
              <span className="font-semibold text-ink-100 tabular-nums">{total}</span> votes
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/[0.07] px-3 py-2">
            <Crown className="size-4 text-brand-400" />
            <span className="truncate text-ink-200">Ada leads · 4 pts</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

import { ChevronDown, ChevronUp } from 'lucide-react'

/** ▲2 / ▼1 next to a player who moved at the last reveal. */
export function RankMovement({ move }: { move: number | undefined }) {
  if (!move) return <span className="w-7" />
  const up = move > 0
  return (
    <span
      className={`inline-flex w-7 animate-pop items-center justify-center text-[11px] font-bold ${up ? 'text-emerald-400' : 'text-red-400'}`}
      aria-label={up ? `Up ${move}` : `Down ${-move}`}
    >
      {up ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
      {Math.abs(move)}
    </span>
  )
}

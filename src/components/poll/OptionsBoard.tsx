import type { Option } from '../../api/types'

/** The answers, big and without counts: what the room sees while the clock runs. */
export function OptionsBoard({ options }: { options: Option[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {options.map((o, i) => (
        <li
          key={o.key}
          className="surface flex animate-fade-up items-center gap-4 rounded-2xl bg-ink-800/70 p-4"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink-700 font-display text-xl font-bold">{o.key}</span>
          <span className="text-lg font-medium sm:text-xl">{o.value}</span>
        </li>
      ))}
    </ul>
  )
}

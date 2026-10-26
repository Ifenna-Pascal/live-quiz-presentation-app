import { cn } from '../../utils/cn'
import { initials, nameHue } from '../../utils/format'

export function Avatar({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  const hue = nameHue(name)
  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white', className)}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `linear-gradient(140deg, hsl(${hue} 72% 58%), hsl(${(hue + 35) % 360} 70% 36%))`,
        boxShadow: 'inset 0 1px 0 rgb(255 255 255 / 0.25)',
      }}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}

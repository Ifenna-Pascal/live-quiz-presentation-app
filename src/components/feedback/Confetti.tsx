import { useMemo } from 'react'

const COLORS = ['#ff7a1a', '#ff9a4d', '#ffbb85', '#ffffff', '#ef6400', '#fde68a']

/** A one-off burst of confetti from the top centre. Change `burstKey` to fire again. */
export function Confetti({ burstKey, pieces = 70 }: { burstKey: string | number; pieces?: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, i) => ({
        id: `${burstKey}-${i}`,
        left: 50 + (Math.random() - 0.5) * 30,
        dx: `${(Math.random() - 0.5) * 900}px`,
        dy: `${380 + Math.random() * 520}px`,
        rot: `${(Math.random() - 0.5) * 1080}deg`,
        delay: `${Math.random() * 180}ms`,
        color: COLORS[i % COLORS.length],
        w: 6 + Math.random() * 6,
        h: 8 + Math.random() * 10,
        round: Math.random() > 0.7,
      })),
    [burstKey, pieces],
  )

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute top-[18%] animate-confetti"
          style={
            {
              left: `${b.left}%`,
              width: b.w,
              height: b.round ? b.w : b.h,
              background: b.color,
              borderRadius: b.round ? '9999px' : '2px',
              animationDelay: b.delay,
              '--dx': b.dx,
              '--dy': b.dy,
              '--rot': b.rot,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

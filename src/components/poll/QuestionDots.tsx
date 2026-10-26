import { cn } from '../../utils/cn'

/** One dash per question: done, current, upcoming. */
export function QuestionDots({ index, total }: { index: number; total: number }) {
  return (
    <div className="flex flex-wrap gap-1" aria-label={`Question ${index} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all duration-500',
            i + 1 < index && 'w-5 bg-brand-500/50',
            i + 1 === index && 'w-9 bg-brand-500 shadow-[0_0_10px_#ff7a1a]',
            i + 1 > index && 'w-5 bg-ink-600',
          )}
        />
      ))}
    </div>
  )
}

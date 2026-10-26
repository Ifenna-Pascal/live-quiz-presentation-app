const QUICK = ['🔥', '👏', '😂', '🤯', '👍', '🎉']

export function QuickReactions({ onPick, disabled }: { onPick: (emoji: string) => void; disabled?: boolean }) {
  return (
    <div className="mb-2 flex gap-1.5">
      {QUICK.map((emoji) => (
        <button
          key={emoji}
          type="button"
          disabled={disabled}
          onClick={() => onPick(emoji)}
          className="grid size-8 place-items-center rounded-lg bg-ink-800 text-base transition hover:-translate-y-0.5 hover:scale-110 hover:bg-ink-700 disabled:opacity-40"
          aria-label={`Send ${emoji}`}
        >
          {emoji}
        </button>
      ))}
    </div>
  )
}

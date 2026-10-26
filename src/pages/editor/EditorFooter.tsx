import { Button } from '../../components/ui/Button'

type Props = { pollCount: number; scoredCount: number; saving: boolean; label: string; onSave: () => void }

export function EditorFooter({ pollCount, scoredCount, saving, label, onSave }: Props) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/5 bg-ink-900/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <p className="text-sm text-ink-300">
          <span className="font-semibold text-ink-100">{pollCount}</span> {pollCount === 1 ? 'question' : 'questions'} ·{' '}
          <span className="font-semibold text-ink-100">{scoredCount}</span> scored
        </p>
        <Button size="lg" loading={saving} onClick={onSave}>
          {label}
        </Button>
      </div>
    </div>
  )
}

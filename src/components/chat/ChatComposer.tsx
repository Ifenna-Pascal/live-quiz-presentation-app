import { useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import { QuickReactions } from './QuickReactions'

const MAX_LENGTH = 500

export function ChatComposer({ onSend }: { onSend: (body: string) => Promise<void> }) {
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function send(text: string) {
    if (!text.trim() || sending) return
    setSending(true)
    setError(null)
    try {
      await onSend(text.trim())
      setDraft('')
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="border-t border-white/5 p-3">
      <QuickReactions onPick={send} disabled={sending} />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void send(draft)
        }}
        className="flex items-center gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={MAX_LENGTH}
          placeholder="Message everyone…"
          aria-label="Message"
          className="h-11 min-w-0 flex-1 rounded-xl border border-ink-600 bg-ink-800 px-3.5 text-[15px] outline-none placeholder:text-ink-400 focus:border-brand-500"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending}
          className="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-b from-brand-400 to-brand-600 text-ink-950 transition hover:brightness-110 active:scale-95 disabled:opacity-40"
          aria-label="Send"
        >
          <SendHorizontal className="size-5" />
        </button>
      </form>
      {draft.length > MAX_LENGTH - 50 && (
        <p className="mt-1.5 text-right text-[11px] text-ink-400">{MAX_LENGTH - draft.length} left</p>
      )}
      {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  )
}

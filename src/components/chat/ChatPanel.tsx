import { useEffect, useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import type { ChatMessage } from '../../api/types'
import { EmptyState } from '../ui/EmptyState'
import { ChatBubble } from './ChatBubble'
import { ChatComposer } from './ChatComposer'

type Props = { messages: ChatMessage[]; meId: string; onSend: (body: string) => Promise<void> }

export function ChatPanel({ messages, meId, onSend }: Props) {
  const listRef = useRef<HTMLDivElement>(null)
  const stickToBottom = useRef(true)

  useEffect(() => {
    const el = listRef.current
    if (el && stickToBottom.current) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        ref={listRef}
        onScroll={(e) => {
          const el = e.currentTarget
          stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
        }}
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
        aria-live="polite"
      >
        {!messages.length && (
          <EmptyState icon={<MessageCircle className="size-6" />} title="Say hi 👋">
            Everyone in this presentation sees the chat, including the host.
          </EmptyState>
        )}
        {messages.map((m, i) => (
          <ChatBubble key={m.id} message={m} mine={m.author_id === meId} grouped={messages[i - 1]?.author_id === m.author_id} />
        ))}
      </div>
      <ChatComposer
        onSend={async (body) => {
          stickToBottom.current = true
          await onSend(body)
        }}
      />
    </div>
  )
}

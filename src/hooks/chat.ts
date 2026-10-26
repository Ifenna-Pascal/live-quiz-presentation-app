import { useCallback, useEffect, useState } from 'react'
import { listMessages, sendMessage } from '../api/chat'
import type { ChatMessage } from '../api/types'
import { useStreamEvent } from '../realtime/stream'
import { useResource } from './useResource'

/** Who is chatting: the host (access token) or a player (id + token). */
export type ChatIdentity =
  | { role: 'host'; id: string; name: string }
  | { role: 'player'; id: string; name: string; token: string }

/** The room chat: history on load, then new messages from the event stream. */
export function useChat(presentationId: string, me: ChatIdentity | null) {
  const messages = useResource(() => listMessages(presentationId), [presentationId])
  const { setData } = messages

  const append = useCallback(
    (msg: ChatMessage) =>
      setData((prev = []) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg].slice(-300))),
    [setData],
  )

  useStreamEvent(presentationId, 'chat', (data) => {
    if (data && typeof data === 'object' && 'id' in data) append(data as ChatMessage)
  })
  useStreamEvent(presentationId, 'resync', () => void messages.refetch())

  const send = useCallback(
    async (body: string) => {
      if (!me) return
      append(await sendMessage(presentationId, me, body))
    },
    [presentationId, me, append],
  )

  return { messages: messages.data ?? [], loaded: messages.data !== undefined, send }
}

/** Messages from others that arrived while the chat was not on screen. History counts as read. */
export function useUnreadCount(messages: ChatMessage[], loaded: boolean, visible: boolean, myId: string | undefined) {
  const [seen, setSeen] = useState<number | null>(null)

  useEffect(() => {
    if (loaded && seen === null) setSeen(messages.length)
  }, [loaded, seen, messages.length])

  useEffect(() => {
    if (visible) setSeen(messages.length)
  }, [visible, messages.length])

  if (visible || seen === null) return 0
  return messages.slice(seen).filter((m) => m.author_id !== myId).length
}

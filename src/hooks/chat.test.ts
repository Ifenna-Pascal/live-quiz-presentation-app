import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ChatMessage } from '../api/types'
import { useUnreadCount } from './chat'

const msg = (id: string, author: string): ChatMessage => ({
  id,
  author_id: author,
  author_name: author,
  author_role: 'player',
  body: 'hi',
  created_at: new Date().toISOString(),
})

describe('useUnreadCount', () => {
  it('treats history as read and counts only new messages from others', () => {
    const history = [msg('1', 'bo'), msg('2', 'bo')]
    const { result, rerender } = renderHook(({ messages, visible }) => useUnreadCount(messages, true, visible, 'me'), {
      initialProps: { messages: history, visible: false },
    })
    expect(result.current).toBe(0)

    rerender({ messages: [...history, msg('3', 'bo'), msg('4', 'me')], visible: false })
    expect(result.current).toBe(1)

    rerender({ messages: [...history, msg('3', 'bo'), msg('4', 'me')], visible: true })
    expect(result.current).toBe(0)
  })
})

import { authorizedRequest, request } from './client'
import type { ChatMessage } from './types'
import type { ChatIdentity } from '../hooks/chat'

export async function listMessages(id: string) {
  return (await request<ChatMessage[] | null>(`/presentations/${id}/messages?limit=200`)) ?? []
}

/** The host is identified by the access token, a player by id + token. */
export function sendMessage(id: string, me: ChatIdentity, body: string) {
  const path = `/presentations/${id}/messages`
  if (me.role === 'host') return authorizedRequest<ChatMessage>(path, { method: 'POST', body: { body } })
  return request<ChatMessage>(path, {
    method: 'POST',
    body: { body, player_id: me.id, player_token: me.token },
  })
}

import { ApiError, authorizedRequest, request } from './client'
import type { CurrentPoll, Vote, VoteResult } from './types'
import type { PlayerIdentity } from '../storage/player'

/** The poll on screen, or null before the presentation starts. */
export async function getCurrentPoll(id: string) {
  try {
    const poll = await request<Omit<CurrentPoll, 'received_at'>>(`/presentations/${id}/polls/current`)
    return { ...poll, received_at: Date.now() }
  } catch (e) {
    if (e instanceof ApiError && e.status === 400) return null
    throw e
  }
}

export function nextPoll(id: string) {
  return authorizedRequest<CurrentPoll>(`/presentations/${id}/polls/current`, { method: 'PUT' })
}

export function previousPoll(id: string) {
  return authorizedRequest<CurrentPoll>(`/presentations/${id}/polls/previous`, { method: 'PUT' })
}

/** Shows the correct answer to everyone and closes voting on the poll. */
export function revealPoll(id: string) {
  return authorizedRequest<CurrentPoll>(`/presentations/${id}/polls/current/reveal`, { method: 'POST' })
}

export function castVote(id: string, pollId: string, key: string, player: PlayerIdentity) {
  return request<VoteResult>(`/presentations/${id}/polls/current/votes`, {
    method: 'POST',
    body: { poll_id: pollId, key, player_id: player.player_id, player_token: player.player_token },
  })
}

export async function getPollVotes(id: string, pollId: string) {
  return (await request<Vote[] | null>(`/presentations/${id}/polls/${pollId}/votes`)) ?? []
}

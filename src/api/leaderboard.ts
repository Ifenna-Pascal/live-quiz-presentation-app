import { request } from './client'
import type { Leaderboard } from './types'

export function getLeaderboard(id: string) {
  return request<Leaderboard>(`/presentations/${id}/leaderboard`)
}

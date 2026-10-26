import { authorizedRequest, request } from './client'
import type { Player, RegisteredPlayer } from './types'

export function registerPlayer(id: string, playerName: string) {
  return request<RegisteredPlayer>(`/presentations/${id}/players`, { method: 'POST', body: { player_name: playerName } })
}

export async function listPlayers(id: string) {
  return (await request<Player[] | null>(`/presentations/${id}/players`)) ?? []
}

export function removePlayer(id: string, playerId: string) {
  return authorizedRequest<void>(`/presentations/${id}/players/${playerId}`, { method: 'DELETE' })
}

import { readJSON, removeKey, writeJSON } from './localStorage'

/** What a player's browser keeps after joining. The token proves who they are. */
export type PlayerIdentity = { player_id: string; player_name: string; player_token: string }

export function playerKey(presentationId: string) {
  return `pollroom:player:${presentationId}`
}

/** The player saved for this presentation. Identities without a token are ignored. */
export function getPlayer(presentationId: string): PlayerIdentity | null {
  const saved = readJSON<Partial<PlayerIdentity> | null>(playerKey(presentationId), null)
  return saved?.player_id && saved.player_token && saved.player_name ? (saved as PlayerIdentity) : null
}

export function savePlayer(presentationId: string, player: PlayerIdentity) {
  writeJSON(playerKey(presentationId), player)
}

export function forgetPlayer(presentationId: string) {
  removeKey(playerKey(presentationId))
}

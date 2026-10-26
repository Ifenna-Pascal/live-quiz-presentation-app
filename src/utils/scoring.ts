import type { Leaderboard } from '../api/types'

/** The leaderboard only shows once someone has scored. */
export function isLeaderboardActive(board: Leaderboard | undefined) {
  return !!board?.entries.some((e) => e.score > 0)
}

/**
 * Mirrors the API's prize split, for the editor preview only. Live payouts
 * always come from the leaderboard.
 *
 * The top 3 ranks (ties share a rank) split the pool by score. Leftover from
 * rounding goes to a sole leader.
 */
export function splitPrize(pool: number, scores: number[]): number[] {
  const sorted = [...scores].sort((a, b) => b - a)
  const ranks = sorted.map((s) => sorted.indexOf(s) + 1)
  const paid = sorted.map((s, i) => s > 0 && ranks[i] <= 3)
  const total = sorted.reduce((sum, s, i) => (paid[i] ? sum + s : sum), 0)
  if (pool <= 0 || total === 0) return sorted.map(() => 0)

  const out = sorted.map((s, i) => (paid[i] ? Math.floor((pool * s) / total) : 0))
  const leaders = ranks.filter((r, i) => r === 1 && paid[i]).length
  if (leaders === 1) out[0] += pool - out.reduce((a, b) => a + b, 0)
  return out
}

/** How many different players are in a list of votes (a player may try several options). */
export function countPlayers(votes: { player_id: string }[]) {
  return new Set(votes.map((v) => v.player_id)).size
}

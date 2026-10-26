import { useCallback, useEffect, useRef, useState } from 'react'
import type { CurrentPoll, LeaderboardEntry, Player, WinnerEvent } from '../api/types'
import { getLeaderboard } from '../api/leaderboard'
import { listPlayers } from '../api/players'
import { getCurrentPoll, getPollVotes } from '../api/polls'
import { getPresentation } from '../api/presentations'
import { useStreamEvent, useStreamStatus } from '../realtime/stream'
import { useResource } from './useResource'
import { msUntilServerTime } from '../utils/time'

const FALLBACK_POLL_MS = 5000

/**
 * Everything a playground screen shows, kept live by the presentation's
 * event stream. If the stream is down, it polls every few seconds instead.
 */
export function useLiveRoom(presentationId: string, asOwner: boolean) {
  const presentation = useResource(() => getPresentation(presentationId, asOwner), [presentationId, asOwner])
  const players = useResource(() => listPlayers(presentationId), [presentationId])
  const started = presentation.data?.has_started ?? false
  const poll = useResource(() => getCurrentPoll(presentationId), [presentationId, started], started)
  const pollId = poll.data?.id
  const votes = useResource(
    () => (pollId ? getPollVotes(presentationId, pollId) : Promise.resolve([])),
    [presentationId, pollId],
    !!pollId,
  )
  const leaderboard = useResource(() => getLeaderboard(presentationId), [presentationId])
  const [deleted, setDeleted] = useState(false)
  /** The latest "someone answered first" moment, for the celebration pop-up. */
  const [celebration, setCelebration] = useState<WinnerEvent | null>(null)
  const status = useStreamStatus(presentationId)

  const dismissCelebration = useCallback(() => setCelebration(null), [])

  const pollIdRef = useRef(pollId)
  pollIdRef.current = pollId

  const refetchAll = useCallback(() => {
    void presentation.refetch()
    void players.refetch()
    void poll.refetch()
    void votes.refetch()
    void leaderboard.refetch()
    // The refetch functions are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useStreamEvent(presentationId, 'presentation', () => {
    void presentation.refetch()
    void poll.refetch()
    void leaderboard.refetch()
  })
  useStreamEvent(presentationId, 'players', () => {
    void players.refetch()
    void leaderboard.refetch()
  })
  useStreamEvent(presentationId, 'vote', (data) => {
    const votedPoll = (data as { poll_id?: string } | null)?.poll_id
    if (!votedPoll || votedPoll === pollIdRef.current) void votes.refetch()
    void leaderboard.refetch()
  })
  useStreamEvent(presentationId, 'winner', (data) => {
    if (data && typeof data === 'object' && 'player_id' in data) setCelebration(data as WinnerEvent)
    void poll.refetch()
    void votes.refetch()
    void leaderboard.refetch()
  })
  useStreamEvent(presentationId, 'resync', refetchAll)

  // When the countdown runs out, fetch the poll again to show "time's up".
  usePollExpiry(started ? (poll.data ?? null) : null, () => {
    void poll.refetch()
    void leaderboard.refetch()
  })
  useStreamEvent(presentationId, 'deleted', () => setDeleted(true))

  useEffect(() => {
    if (status === 'live') return
    const timer = setInterval(refetchAll, FALLBACK_POLL_MS)
    return () => clearInterval(timer)
  }, [status, refetchAll])

  return {
    presentation: presentation.data,
    players: players.data,
    poll: started ? (poll.data ?? null) : null,
    votes: votes.data ?? [],
    leaderboard: leaderboard.data,
    loading: presentation.loading && !presentation.data,
    error: presentation.error,
    deleted,
    status,
    celebration,
    dismissCelebration,
    refetchAll,
  }
}

/** Calls onArrive with players that appeared since the last update (not on first load). */
export function useNewArrivals(players: Player[] | undefined, onArrive: (fresh: Player[]) => void) {
  const known = useRef<Set<string> | null>(null)
  const callback = useRef(onArrive)
  callback.current = onArrive

  useEffect(() => {
    if (!players) return
    if (known.current) {
      const fresh = players.filter((p) => !known.current!.has(p.player_id))
      if (fresh.length) callback.current(fresh)
    }
    known.current = new Set(players.map((p) => p.player_id))
  }, [players])
}

/**
 * How many places each player moved at the last rank change
 * (positive = moved up). Kept until the ranks change again.
 */
export function useRankChanges(entries: LeaderboardEntry[] | undefined) {
  const previous = useRef<Map<string, number> | null>(null)
  const [moves, setMoves] = useState<Map<string, number>>(() => new Map())
  const signature = entries?.map((e) => `${e.player_id}:${e.rank}`).join('|')

  useEffect(() => {
    if (!entries) return
    const current = new Map(entries.map((e) => [e.player_id, e.rank]))
    if (previous.current) {
      const changed = new Map<string, number>()
      current.forEach((rank, id) => {
        const before = previous.current!.get(id)
        if (before !== undefined && before !== rank) changed.set(id, before - rank)
      })
      if (changed.size) setMoves(changed)
    }
    previous.current = current
    // Only rerun when the ranks themselves change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  return moves
}

/**
 * Time left on a poll, measured against the server's clock (so a phone with
 * a wrong clock still shows the right countdown). Ticks 10 times a second.
 */
export function useCountdown(poll: CurrentPoll | null) {
  const closesAt = poll?.closes_at ?? null
  const totalMs = (poll?.time_limit_seconds ?? 0) * 1000
  const [msLeft, setMsLeft] = useState(() => (poll && closesAt ? msUntilServerTime(closesAt, poll) : 0))

  useEffect(() => {
    if (!poll || !closesAt || poll.revealed) {
      setMsLeft(0)
      return
    }
    const tick = () => setMsLeft(msUntilServerTime(closesAt, poll))
    tick()
    const timer = setInterval(tick, 100)
    return () => clearInterval(timer)
  }, [poll, closesAt])

  const running = !!poll && !poll.revealed && !!closesAt && msLeft > 0
  return { msLeft: running ? msLeft : 0, totalMs, running, fraction: totalMs ? Math.max(0, msLeft) / totalMs : 0 }
}

/** Calls onExpire just after the poll's countdown ends, so the screen shows "time's up". */
export function usePollExpiry(poll: CurrentPoll | null, onExpire: () => void) {
  const callback = useRef(onExpire)
  callback.current = onExpire

  useEffect(() => {
    if (!poll || poll.revealed || !poll.closes_at) return
    const wait = Math.max(0, msUntilServerTime(poll.closes_at, poll)) + 250
    const timer = setTimeout(() => callback.current(), wait)
    return () => clearTimeout(timer)
  }, [poll])
}

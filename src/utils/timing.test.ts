import { afterEach, describe, expect, it, vi } from 'vitest'
import { countPlayers } from './scoring'
import { formatSeconds, msUntilServerTime } from './time'

describe('timing helpers', () => {
  afterEach(() => vi.useRealTimers())

  it('measures time left on the server clock, not the device clock', () => {
    vi.useFakeTimers()
    vi.setSystemTime(Date.parse('2026-10-24T12:00:00.000Z'))
    // The device clock is 30s ahead of the server.
    const ref = { server_time: '2026-10-24T11:59:30.000Z', received_at: Date.now() }
    expect(msUntilServerTime('2026-10-24T11:59:40.000Z', ref)).toBe(10_000)
    vi.advanceTimersByTime(4_000)
    expect(msUntilServerTime('2026-10-24T11:59:40.000Z', ref)).toBe(6_000)
  })

  it('formats elapsed time', () => {
    expect(formatSeconds(3240)).toBe('3.2s')
    expect(formatSeconds(-5)).toBe('0.0s')
  })

  it('counts each player once even with several attempts', () => {
    expect(countPlayers([{ player_id: 'a' }, { player_id: 'a' }, { player_id: 'b' }])).toBe(2)
  })
})

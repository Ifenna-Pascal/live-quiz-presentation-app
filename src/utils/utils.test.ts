import { describe, expect, it } from 'vitest'
import { extractPresentationId } from './url'
import { initials, nameHue, ordinal, pluralize } from './format'
import { isLeaderboardActive } from './scoring'
import { timeAgo } from './time'

describe('utils', () => {
  it('extracts a presentation id from a link or a bare id', () => {
    const id = '3fa85f64-5717-4562-b3fc-2c963f66afa6'
    expect(extractPresentationId(`https://x.com/join/${id}`)).toBe(id)
    expect(extractPresentationId(id.toUpperCase())).toBe(id)
    expect(extractPresentationId('nope')).toBeNull()
  })

  it('builds initials', () => {
    expect(initials('Ada Lovelace')).toBe('AL')
    expect(initials('  bo ')).toBe('B')
    expect(initials('')).toBe('?')
  })

  it('gives the same hue for the same name', () => {
    expect(nameHue('Ada')).toBe(nameHue('Ada'))
    expect(nameHue('Ada')).toBeLessThan(360)
  })

  it('formats ordinals', () => {
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 101].map(ordinal)).toEqual([
      '1st', '2nd', '3rd', '4th', '11th', '12th', '13th', '21st', '22nd', '101st',
    ])
  })

  it('pluralizes', () => {
    expect(pluralize(1, 'player')).toBe('1 player')
    expect(pluralize(2, 'player')).toBe('2 players')
  })

  it('formats relative times', () => {
    const now = Date.parse('2026-10-24T12:00:00Z')
    expect(timeAgo('2026-10-24T11:59:50Z', now)).toBe('just now')
    expect(timeAgo('2026-10-24T11:30:00Z', now)).toBe('30m ago')
    expect(timeAgo('2026-10-24T09:00:00Z', now)).toBe('3h ago')
  })

  it('only activates the leaderboard once someone scored', () => {
    const entry = { rank: 1, player_id: 'a', player_name: 'A', score: 0, answered: 1, payout: 0 }
    expect(isLeaderboardActive(undefined)).toBe(false)
    expect(isLeaderboardActive({ scored_polls: 1, prize: null, entries: [entry] })).toBe(false)
    expect(isLeaderboardActive({ scored_polls: 1, prize: null, entries: [{ ...entry, score: 1 }] })).toBe(true)
  })
})

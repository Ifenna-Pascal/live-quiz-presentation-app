import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { LeaderboardEntry } from '../api/types'
import { useRankChanges } from './room'

const e = (id: string, rank: number): LeaderboardEntry => ({ player_id: id, player_name: id, rank, score: 0, answered: 0, payout: 0 })

describe('useRankChanges', () => {
  it('reports how far each player moved', () => {
    const { result, rerender } = renderHook(({ entries }) => useRankChanges(entries), {
      initialProps: { entries: [e('ada', 1), e('bo', 2), e('cy', 3)] },
    })
    expect(result.current.size).toBe(0)
    rerender({ entries: [e('cy', 1), e('ada', 2), e('bo', 3)] })
    expect(result.current.get('cy')).toBe(2)
    expect(result.current.get('ada')).toBe(-1)
    expect(result.current.get('bo')).toBe(-1)
  })
})

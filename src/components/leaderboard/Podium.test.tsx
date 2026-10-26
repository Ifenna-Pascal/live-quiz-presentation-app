import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { LeaderboardEntry } from '../../api/types'
import { Podium } from './Podium'

const entry = (name: string, rank: number, score: number): LeaderboardEntry => ({
  player_id: name,
  player_name: name,
  rank,
  score,
  answered: score,
  payout: 0,
})

describe('Podium', () => {
  it('shows tied players identically', () => {
    const { container } = render(<Podium entries={[entry('Ada', 1, 3), entry('Bo', 1, 3), entry('Cy', 3, 1)]} />)

    // Both leaders get the crown and the tallest step.
    expect(container.querySelectorAll('.lucide-crown')).toHaveLength(2)
    expect(container.querySelectorAll('.h-32')).toHaveLength(2)
    expect(container.querySelectorAll('.h-16')).toHaveLength(1)
  })

  it('keeps the usual 1st, 2nd and 3rd steps without ties', () => {
    const { container } = render(<Podium entries={[entry('Ada', 1, 3), entry('Bo', 2, 2), entry('Cy', 3, 1)]} />)

    expect(container.querySelectorAll('.lucide-crown')).toHaveLength(1)
    expect(container.querySelectorAll('.h-32')).toHaveLength(1)
    expect(container.querySelectorAll('.h-24')).toHaveLength(1)
    expect(container.querySelectorAll('.h-16')).toHaveLength(1)
  })
})

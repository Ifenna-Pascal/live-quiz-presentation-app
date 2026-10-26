import { describe, expect, it } from 'vitest'
import { draftToInput, isPrizeInvalid, prizeToDraft } from '../pages/editor/draft'
import { formatMoney } from './format'
import { splitPrize } from './scoring'

describe('prize money', () => {
  it('splits like the API: top 3 ranks by score, ties share a place', () => {
    expect(splitPrize(50000, [3])).toEqual([50000])
    expect(splitPrize(50000, [3, 1])).toEqual([37500, 12500])
    expect(splitPrize(50000, [3, 2, 1, 1])).toEqual([21431, 14285, 7142, 7142])
    expect(splitPrize(50000, [3, 2, 2, 1])).toEqual([21430, 14285, 14285, 0])
    expect(splitPrize(50000, [3, 3, 3, 1])).toEqual([16666, 16666, 16666, 0])
    expect(splitPrize(50000, [0, 0])).toEqual([0, 0])
  })

  it('leaves the prize out of the request when it is switched off', () => {
    expect(draftToInput('Q', [], { enabled: false, amount: '5000', currency: 'NGN' })).not.toHaveProperty('prize_pool')
    expect(draftToInput('Q', [], { enabled: true, amount: '5000', currency: 'USD' })).toMatchObject({ prize_pool: 5000, prize_currency: 'USD' })
  })

  it('validates the amount only when prize money is on', () => {
    expect(isPrizeInvalid({ enabled: false, amount: '', currency: 'NGN' })).toBe(false)
    expect(isPrizeInvalid({ enabled: true, amount: '', currency: 'NGN' })).toBe(true)
    expect(isPrizeInvalid({ enabled: true, amount: '100', currency: 'NGN' })).toBe(false)
    expect(prizeToDraft(null).enabled).toBe(false)
    expect(prizeToDraft({ pool: 50000, currency: 'NGN' })).toEqual({ enabled: true, amount: '50000', currency: 'NGN' })
  })

  it('formats whole amounts with the currency symbol', () => {
    expect(formatMoney(50000, 'NGN')).toMatch(/₦\s?50,000/)
    expect(formatMoney(12500, 'USD')).toMatch(/\$12,500/)
  })
})

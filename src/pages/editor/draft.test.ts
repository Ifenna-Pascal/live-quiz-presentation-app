import { describe, expect, it } from 'vitest'
import { type DraftPoll, draftToInput, findDraftProblems, moveItem } from './draft'

const poll = (question: string, values: string[], correct = -1): DraftPoll => ({
  id: question,
  question,
  timeLimit: 15,
  options: values.map((value, i) => ({ id: `${question}${i}`, value, correct: i === correct })),
})

describe('editor draft', () => {
  it('drops empty answers, assigns keys and keeps correct flags', () => {
    const input = draftToInput('  Quiz ', [poll(' Red planet? ', ['Venus', '', ' Mars '], 2)])
    expect(input).toEqual({
      title: 'Quiz',
      polls: [{ question: 'Red planet?', time_limit_seconds: 15, options: [{ key: 'A', value: 'Venus' }, { key: 'B', value: 'Mars', correct: true }] }],
    })
  })

  it('reports missing questions and answers', () => {
    expect(findDraftProblems([poll('', ['a', 'b']), poll('q', ['a', ''])])).toEqual([
      { question: true, options: false, time: false },
      { question: false, options: true, time: false },
    ])
  })

  it('moves items and ignores moves past the ends', () => {
    expect(moveItem([1, 2, 3], 0, 1)).toEqual([2, 1, 3])
    expect(moveItem([1, 2, 3], 0, -1)).toEqual([1, 2, 3])
  })
})

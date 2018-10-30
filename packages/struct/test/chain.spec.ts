import { ChainIterator, chain, iterator } from '../src/index'
import { testIterator } from './iterator.spec'

describe('@luban/struct', () => {

  describe('chain()', () => {
    testIterator(() => {
      const it = chain([1, 2, 3], [4], [5, 6])
      const expected = [1, 2, 3, 4, 5, 6]
      return [it, expected]
    })
  })

  describe('ChainIterator', () => {
    testIterator(() => {
      const a = iterator([1, 2, 3])
      const b = iterator(['four', 'five'])
      const c = iterator([true, false])
      type T = number | string | boolean
      const it = new ChainIterator<T>(iterator([a, b, c]))
      const expected = [1, 2, 3, 'four', 'five', true, false]
      return [it, expected]
    })
  })
})

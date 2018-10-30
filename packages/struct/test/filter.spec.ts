import { iterator, filter, FilterIterator } from '../src/index'
import { testIterator } from './iterator.spec'

describe('@luban/struct', () => {

  describe('filter()', () => {
    testIterator(() => {
      const expected = [0, 2, 4]
      const data = [0, 1, 2, 3, 4, 5]
      const it = filter(data, n => n % 2 === 0)
      return [it, expected]
    })
  })

  describe('FilterIterator', () => {
    testIterator(() => {
      const expected = [1, 3, 5]
      const data = [0, 1, 2, 3, 4, 5]
      const it = new FilterIterator(iterator(data), n => n % 2 !== 0)
      return [it, expected]
    })
  })
})

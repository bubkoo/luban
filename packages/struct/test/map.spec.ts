import { MapIterator, iterator, map } from '../src/index'
import { testIterator } from './iterator.spec'

describe('@luban/struct', () => {
  describe('map()', () => {
    testIterator(() => {
      const result = [0, 1, 4, 9, 16, 25]
      const it = map([0, 1, 2, 3, 4, 5], x => x ** 2)
      return [it, result]
    })
  })

  describe('MapIterator', () => {
    testIterator(() => {
      const result = [0, 1, 8, 27]
      const it = new MapIterator(iterator([0, 1, 2, 3]), x => x ** 3)
      return [it, result]
    })
  })
})

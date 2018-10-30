import { iterator, toArray, reverse, ReversibleArrayIterator } from '../src/index'
import { testIterator } from './iterator.spec'

describe('@luban/struct', () => {

  describe('reverse()', () => {

    it('should create an iterator for an array-like object', () => {
      expect(toArray(reverse([0, 1, 2, 3]))).toEqual([3, 2, 1, 0])
      const obj: ArrayLike<Number> = {
        length: 4,
        0: 0,
        1: 1,
        2: 2,
        3: 3,
      }

      expect(toArray(reverse(obj))).toEqual([3, 2, 1, 0])
    })

    it('should call `reverse` on a reversible', () => {
      const it = iterator([1, 2, 3, 4])
      const retroable = { reverse: () => it }
      expect(reverse(retroable)).toEqual(it)
    })
  })

  describe('ReversibleArrayIterator', () => {
    testIterator(() => {
      return [new ReversibleArrayIterator([1, 2, 3]), [3, 2, 1]]
    })
  })
})

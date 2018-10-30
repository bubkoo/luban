
import {
  ArrayIterator,
  IIterator,
  iterator,
  toArray,
  each,
  every,
  some,
} from '../src/index'

/**
 * A factory which returns an iterator and expected results.
 */
export type IteratorFactory<T> = () => [IIterator<T>, T[]]

/**
 * A helper function to test the methods of an iterator.
 *
 * @param factory - A function which produces an iterator and the
 *   expected results of that iterator.
 */
export function testIterator<T>(factory: IteratorFactory<T>): void {
  describe('iterator()', () => {
    it('should return `this` iterator', () => {
      const [it] = factory()
      expect(it.iterator()).toEqual(it)
    })
  })

  describe('clone()', () => {
    it('should return a new independent iterator', () => {
      const [it, results] = factory()
      const it2 = it.clone()
      expect(it).not.toBe(it2)
      expect(toArray(it)).toEqual(results)
      expect(toArray(it2)).toEqual(results)
    })

  })

  describe('next()', () => {
    it('should return the next value in the iterator', () => {
      const [it, results] = factory()
      for (let i = 0; it.hasNext(); i += 1) {
        expect(it.next()).toEqual(results[i])
      }
    })

    it('should throw an error when dose not have next value.', () => {
      const [it] = factory()
      while (it.hasNext()) {
        it.next()
      }
      expect(() => { it.next() }).toThrow()
    })
  })
}

describe('@luban/struct', () => {
  describe('iterator()', () => {
    it('should create an iterator for an array-like object', () => {
      const data = [0, 1, 2, 3]
      expect(toArray(iterator(data))).toEqual(data)
    })

    it('should call `iterator` on an iterable', () => {
      const it = iterator([1, 2, 3, 4])
      expect(iterator(it)).toBe(it)
    })
  })

  describe('each()', () => {
    it('should visit every item in an iterable', () => {
      let result = 0
      const data = [1, 2, 3, 4, 5]
      each(data, (v) => { result += v })
      expect(result).toBe(15)
    })

    it('should break early if the callback returns `false`', () => {
      let result = 0
      const data = [1, 2, 3, 4, 5]
      each(data, (v) => {
        if (v > 3) {
          return false
        }
        result += v
        return true
      })
      expect(result).toBe(6)
    })
  })

  describe('every()', () => {
    it('should verify all items in an iterable satisfy a condition', () => {
      const data = [1, 2, 3, 4, 5]
      const valid = every(data, x => x > 0)
      const invalid = every(data, x => x > 4)
      expect(valid).toBe(true)
      expect(invalid).toBe(false)
    })
  })

  describe('some()', () => {
    it('should verify some items in an iterable satisfy a condition', () => {
      const data = [1, 2, 3, 4, 5]
      const valid = some(data, x => x > 4)
      const invalid = some(data, x => x < 0)
      expect(valid).toBe(true)
      expect(invalid).toBe(false)
    })
  })

  describe('toArray()', () => {
    it('should create an array from an iterable', () => {
      const data = [0, 1, 2, 3, 4, 5]
      const result = toArray(data)
      expect(result).toEqual(data)
      expect(result).not.toBe(data)
    })
  })

  describe('ArrayIterator', () => {
    testIterator(() => {
      const results = [1, 2, 3, 4, 5]
      const it = new ArrayIterator(results)
      return [it, results]
    })
  })
})

import { IIterator } from './IIterator'
import { EmptyIterator } from './EmptyIterator'

/**
 * An iterator which yields values which pass a test.
 */
export class FilterIterator<T> extends EmptyIterator<T> {

  private index = 0
  private source: IIterator<T>
  private fn: (value: T, index: number) => boolean

  /**
   * Construct a new filter iterator.
   *
   * @param source - The iterator of values of interest.
   *
   * @param fn - The predicate function to invoke for each value.
   */
  constructor(source: IIterator<T>, fn: (value: T, index: number) => boolean) {
    super()
    this.source = source
    this.fn = fn
  }

  /**
   * Create an independent clone of the iterator.
   *
   * @returns A new independent clone of the iterator.
   */
  clone(): IIterator<T> {
    const result = new FilterIterator<T>(this.source.clone(), this.fn)
    result.index = this.index
    return result
  }

  /**
   * Get the next value from the iterator.
   *
   * @returns The next value from the iterator, or `undefined`.
   */
  next(): T {
    if (this.hasNext()) {
      const value = Private.getCache(this)
      Private.delCache(this)
      return value
    }

    return super.next()
  }

  hasNext(): boolean {
    if (Private.hasCache(this)) {
      return true
    }

    while (this.source.hasNext()) {
      const value = this.source.next()
      this.index += 1
      if (this.fn(value, this.index)) {
        Private.setCache(this, value)
        return true
      }
    }

    Private.delCache(this)

    return false
  }
}

namespace Private {
  export const cache = new WeakMap()

  export function setCache(iterator: any, nextValue: any) {
    cache.set(iterator, nextValue)
  }

  export function getCache(iterator: any) {
    return cache.get(iterator)
  }

  export function delCache(iterator: any) {
    return cache.delete(iterator)
  }

  export function hasCache(iterator: any) {
    return cache.has(iterator)
  }
}

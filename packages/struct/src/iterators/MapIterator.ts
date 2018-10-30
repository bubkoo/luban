import { IIterator } from './IIterator'
import { rangeExceptionMessage } from './EmptyIterator'

/**
 * An iterator which transforms values using a mapping function.
 */
export class MapIterator<T, U> implements IIterator<U> {

  private index = 0
  private source: IIterator<T>
  private fn: (value: T, index: number) => U

  /**
   * Construct a new map iterator.
   *
   * @param source - The iterator of values of interest.
   *
   * @param fn - The mapping function to invoke for each value.
   */
  constructor(source: IIterator<T>, fn: (value: T, index: number) => U) {
    this.source = source
    this.fn = fn
  }

  /**
   * Get an iterator over the object's values.
   *
   * @returns An iterator which yields the object's values.
   */
  iterator(): IIterator<U> {
    return this
  }

  /**
   * Create an independent clone of the iterator.
   *
   * @returns A new independent clone of the iterator.
   */
  clone(): IIterator<U> {
    const result = new MapIterator<T, U>(this.source.clone(), this.fn)
    result.index = this.index
    return result
  }

  /**
   * Get the next value from the iterator.
   *
   * @returns The next value from the iterator, or `undefined`.
   */
  next(): U {
    if (this.hasNext()) {
      const value = this.source.next()
      const result = this.fn(value, this.index)
      this.index += 1
      return result
    }
    throw new RangeError(rangeExceptionMessage)
  }

  hasNext() {
    return this.source.hasNext()
  }
}

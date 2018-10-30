import { IIterator } from './IIterator'

export const rangeExceptionMessage = ''
  + 'Index out of range. '
  + 'Call `hasNext()` to ensure `next()` returning the next value.'

/**
 * An iterator which is always empty.
 */
export class EmptyIterator<T> implements IIterator<T> {
  /**
   * Construct a new empty iterator.
   */
  constructor() { }

  /**
   * Get an iterator over the object's values.
   *
   * @returns An iterator which yields the object's values.
   */
  iterator(): IIterator<T> {
    return this
  }

  /**
   * Create an independent clone of the iterator.
   *
   * @returns A new independent clone of the iterator.
   */
  clone(): IIterator<T> {
    return new EmptyIterator<T>()
  }

  /**
   * Get the next value from the iterator.
   *
   * @returns The next value from the iterator.
   */
  next(): T {
    throw new RangeError(rangeExceptionMessage)
  }

  /**
   * Check the iterator if has next value.
   *
   * @returns `true` if has next value, otherwise return `false`
   */
  hasNext(): boolean {
    return false
  }
}

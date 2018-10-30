import { IIterator } from './IIterator'
import { EmptyIterator } from './EmptyIterator'

/**
 * An iterator for an array-like object.
 *
 * #### Notes
 * This iterator can be used for any builtin JS array-like object.
 */
export class ArrayIterator<T> extends EmptyIterator<T> {

  private index = 0
  private source: ArrayLike<T>

  /**
   * Construct a new array iterator.
   *
   * @param source - The array-like object of interest.
   */
  constructor(source: ArrayLike<T>) {
    super()
    this.source = source
  }

  /**
   * Create an independent clone of the iterator.
   *
   * @returns A new independent clone of the iterator.
   */
  clone(): IIterator<T> {
    const result = new ArrayIterator<T>(this.source)
    result.index = this.index
    return result
  }

  /**
   * Get the next value from the iterator.
   *
   * @returns The next value from the iterator.
   */
  next(): T {
    if (this.hasNext()) {
      const value: T = this.source[this.index]
      this.index += 1
      return value
    }

    return super.next()
  }

  hasNext(): boolean {
    return this.index < this.source.length
  }
}

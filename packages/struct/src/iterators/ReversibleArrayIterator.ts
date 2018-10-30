import { IIterator } from './IIterator'
import { EmptyIterator } from './EmptyIterator'

/**
 * An iterator which traverses an array-like object in reverse.
 *
 * #### Notes
 * This iterator can be used for any builtin JS array-like object.
 */
export class ReversibleArrayIterator<T> extends EmptyIterator<T> {
  private index: number
  private source: ArrayLike<T>

  /**
   * Construct a new retro iterator.
   *
   * @param source - The array-like object of interest.
   */
  constructor(source: ArrayLike<T>) {
    super()
    this.source = source
    this.index = source.length - 1
  }

  /**
   * Create an independent clone of the iterator.
   *
   * @returns A new independent clone of the iterator.
   */
  clone(): IIterator<T> {
    const result = new ReversibleArrayIterator<T>(this.source)
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
      const value = this.source[this.index]
      this.index -= 1
      return value
    }

    return super.next()
  }

  hasNext(): boolean {
    return this.index >= 0 && this.index < this.source.length
  }
}

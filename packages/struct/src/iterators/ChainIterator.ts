import { IIterator } from './IIterator'
import { EmptyIterator } from './EmptyIterator'

/**
 * An iterator which chains together several iterators.
 */
export class ChainIterator<T> extends EmptyIterator<T> {

  private source: IIterator<IIterator<T>>
  private active: IIterator<T> | undefined
  private cloned = false

  /**
   * Construct a new chain iterator.
   *
   * @param source - The iterator of iterators of interest.
   */
  constructor(source: IIterator<IIterator<T>>) {
    super()
    this.source = source
    this.active = undefined
  }

  /**
   * Create an independent clone of the iterator.
   *
   * @returns A new independent clone of the iterator.
   */
  clone(): IIterator<T> {
    const result = new ChainIterator<T>(this.source.clone())
    result.active = this.active && this.active.clone()
    result.cloned = true
    this.cloned = true
    return result
  }

  /**
   * Get the next value from the iterator.
   *
   * @returns The next value from the iterator.
   */
  next(): T {
    if (this.hasNext()) {
      return this.active!.next()
    }

    return super.next()
  }

  hasNext(): boolean {
    if (this.active && this.active.hasNext()) {
      return true
    }

    if (this.source.hasNext()) {
      const active = this.source.next()
      this.active = this.cloned ? active.clone() : active
      return this.hasNext()
    }

    this.active = undefined

    return false
  }
}

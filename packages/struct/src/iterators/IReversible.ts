import { IIterator } from './IIterator'

/**
 * An object which can produce a reverse iterator over its values.
 */
export interface IReversible<T> {
  /**
   * Get a reverse iterator over the object's values.
   *
   * @returns An iterator which yields the object's values in reverse.
   */
  reverse(): IIterator<T>
}

/**
 * A type alias for a retroable or builtin array-like object.
 */
export type ReversibleOrArrayLike<T> = IReversible<T> | ArrayLike<T>

/**
 * An object which can produce an iterator over its values.
 */
export interface IIterable<T> {
  /**
   * Get an iterator over the object's values.
   *
   * @returns An iterator which yields the object's values.
   *
   * #### Notes
   * Depending on the iterable, the returned iterator may or may not be
   * a new object. A collection or other container-like object should
   * typically return a new iterator, while an iterator itself should
   * normally return `this`.
   */
  iterator(): IIterator<T>
}

/**
 * An object which traverses a collection of values.
 *
 * #### Notes
 * An `IIterator` is itself an `IIterable`. Most implementations of
 * `IIterator` should simply return `this` from the `iterator()` method.
 */
export interface IIterator<T> extends IIterable<T> {
  /**
   * Create an independent clone of the iterator.
   *
   * @returns A new independent clone of the iterator.
   *
   * #### Notes
   * The cloned iterator can be consumed independently of the current
   * iterator. In essence, it is a copy of the iterator value stream
   * which starts at the current location.
   *
   * This can be useful for lookahead and stream duplication.
   */
  clone(): IIterator<T>

  /**
   * Get the next value from the iterator.
   *
   * @returns The next value from the iterator.
   *
   * @throws RangeError | Error
   */
  next(): T

  hasNext(): boolean
}

/**
 * A type alias for an iterable or builtin array-like object.
 */
export type IterableOrArrayLike<T> = IIterable<T> | ArrayLike<T>

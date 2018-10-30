import { IIterator, EmptyIterator } from './iterators'

/**
 * Create an empty iterator.
 *
 * @returns A new iterator which yields nothing.
 *
 * #### Example
 * ```typescript
 * import { empty, toArray } from '@luban/struct';
 *
 * let stream = empty<number>();
 *
 * toArray(stream);  // []
 * ```
 */
export function empty<T>(): IIterator<T> {
  return new EmptyIterator<T>()
}

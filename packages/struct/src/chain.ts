import { iterator } from './iterator'
import { IIterator, IterableOrArrayLike, ChainIterator } from './iterators'

/**
 * Chain together several iterables.
 *
 * @param objects - The iterable or array-like objects of interest.
 *
 * @returns An iterator which yields the values of the iterables
 *   in the order in which they are supplied.
 *
 * #### Example
 * ```typescript
 * import { chain, toArray } from '@luban/struct';
 *
 * let data1 = [1, 2, 3];
 * let data2 = [4, 5, 6];
 *
 * let stream = chain(data1, data2);
 *
 * toArray(stream);  // [1, 2, 3, 4, 5, 6]
 * ```
 */
export function chain<T>(...objects: IterableOrArrayLike<T>[]): IIterator<T> {
  return new ChainIterator<T>(iterator(objects.map(iterator)))
}

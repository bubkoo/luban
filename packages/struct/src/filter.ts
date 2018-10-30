import { iterator } from './iterator'
import { IIterator, IterableOrArrayLike, FilterIterator } from './iterators'

/**
 * Filter an iterable for values which pass a test.
 *
 * @param obj - The iterable or array-like object of interest.
 *
 * @param fn - The predicate function to invoke for each value.
 *
 * @returns An iterator which yields the values which pass the test.
 *
 * #### Example
 * ```typescript
 * import { filter, toArray } from '@phosphor/algorithm';
 *
 * let data = [1, 2, 3, 4, 5, 6];
 *
 * let stream = filter(data, value => value % 2 === 0);
 *
 * toArray(stream);  // [2, 4, 6]
 * ```
 */
export function filter<T>(
  obj: IterableOrArrayLike<T>,
  fn: (value: T, index: number) => boolean,
): IIterator<T> {
  return new FilterIterator<T>(iterator(obj), fn)
}

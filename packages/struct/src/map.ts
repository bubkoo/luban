import { iterator } from './iterator'
import { IIterator, IterableOrArrayLike, MapIterator } from './iterators'

/**
 * Transform the values of an iterable with a mapping function.
 *
 * @param obj - The iterable or array-like object of interest.
 *
 * @param fn - The mapping function to invoke for each value.
 *
 * @returns An iterator which yields the transformed values.
 *
 * #### Example
 * ```typescript
 * import { map, toArray } from '@phosphor/algorithm';
 *
 * let data = [1, 2, 3];
 *
 * let stream = map(data, value => value * 2);
 *
 * toArray(stream);  // [2, 4, 6]
 * ```
 */
export function map<T, U>(
  obj: IterableOrArrayLike<T>,
  fn: (value: T, index: number) => U,
): IIterator<U> {
  return new MapIterator<T, U>(iterator(obj), fn)
}

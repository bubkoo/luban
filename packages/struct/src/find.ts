import { iterator } from './iterator'
import { IterableOrArrayLike } from './iterators'

/**
 * Find the first value in an iterable which matches a predicate.
 *
 * @param obj - The iterable or array-like object to search.
 *
 * @param fn - The predicate function to apply to the values.
 *
 * @returns The first matching value, or `undefined` if no matching
 *   value is found.
 *
 * #### Complexity
 * Linear.
 *
 * #### Example
 * ```typescript
 * import { find } from '@luban/struct';
 *
 * interface IAnimal { species: string, name: string };
 *
 * function isCat(value: IAnimal): boolean {
 *   return value.species === 'cat';
 * }
 *
 * let data: IAnimal[] = [
 *   { species: 'dog', name: 'spot' },
 *   { species: 'cat', name: 'fluffy' },
 *   { species: 'alligator', name: 'pocho' }
 * ];
 *
 * find(data, isCat).name;  // 'fluffy'
 * ```
 */
export function find<T>(
  obj: IterableOrArrayLike<T>,
  fn: (value: T, index: number) => boolean,
): T | undefined {
  let index = 0
  const it = iterator(obj)
  while (it.hasNext()) {
    const value = it.next()
    if (fn(value, index)) {
      return value
    }
    index += 1
  }
}

/**
 * Find the minimum value in an iterable.
 *
 * @param obj - The iterable or array-like object to search.
 *
 * @param compare - The 3-way comparison function to apply to the values.
 *   It should return `< 0` if the first value is less than the second.
 *   `0` if the values are equivalent, or `> 0` if the first value is
 *   greater than the second.
 *
 * @returns The minimum value in the iterable. If multiple values are
 *   equivalent to the minimum, the left-most value is returned. If
 *   the iterable is empty, this returns `undefined`.
 *
 * #### Complexity
 * Linear.
 *
 * #### Example
 * ```typescript
 * import { min } from '@luban/struct';
 *
 * function numberCmp(a: number, b: number): number {
 *   return a - b;
 * }
 *
 * min([7, 4, 0, 3, 9, 4], numberCmp);  // 0
 * ```
 */
export function min<T>(
  obj: IterableOrArrayLike<T>,
  compare: (first: T, second: T) => number,
): T | undefined {
  const it = iterator(obj)
  if (it.hasNext()) {
    let result = it.next()
    while (it.hasNext()) {
      const value = it.next()
      if (compare(value, result) < 0) {
        result = value
      }
    }
    return result
  }
}

/**
 * Find the maximum value in an iterable.
 *
 * @param obj - The iterable or array-like object to search.
 *
 * @param compare - The 3-way comparison function to apply to the values.
 *   It should return `< 0` if the first value is less than the second.
 *   `0` if the values are equivalent, or `> 0` if the first value is
 *   greater than the second.
 *
 * @returns The maximum value in the iterable. If multiple values are
 *   equivalent to the maximum, the left-most value is returned. If
 *   the iterable is empty, this returns `undefined`.
 *
 * #### Complexity
 * Linear.
 *
 * #### Example
 * ```typescript
 * import { max } from '@luban/struct';
 *
 * function numberCmp(a: number, b: number): number {
 *   return a - b;
 * }
 *
 * max([7, 4, 0, 3, 9, 4], numberCmp);  // 9
 * ```
 */
export function max<T>(
  obj: IterableOrArrayLike<T>,
  compare: (first: T, second: T) => number,
): T | undefined {
  const it = iterator(obj)
  if (it.hasNext()) {
    let result = it.next()
    while (it.hasNext()) {
      const value = it.next()
      if (compare(value, result) > 0) {
        result = value
      }
    }
    return result
  }
}

/**
 * Find the minimum and maximum values in an iterable.
 *
 * @param obj - The iterable or array-like object to search.
 *
 * @param compare - The 3-way comparison function to apply to the values.
 *   It should return `< 0` if the first value is less than the second.
 *   `0` if the values are equivalent, or `> 0` if the first value is
 *   greater than the second.
 *
 * @returns A 2-tuple of the `[min, max]` values in the iterable. If
 *   multiple values are equivalent, the left-most values are returned.
 *   If the iterable is empty, this returns `undefined`.
 *
 * #### Complexity
 * Linear.
 *
 * #### Example
 * ```typescript
 * import { minmax } from '@luban/struct';
 *
 * function numberCmp(a: number, b: number): number {
 *   return a - b;
 * }
 *
 * minmax([7, 4, 0, 3, 9, 4], numberCmp);  // [0, 9]
 * ```
 */
export function minmax<T>(
  obj: IterableOrArrayLike<T>,
  compare: (first: T, second: T) => number,
): [T, T] | undefined {
  const it = iterator(obj)
  if (it.hasNext()) {
    let value = it.next()
    let vmin = value
    let vmax = value

    while (it.hasNext()) {
      value = it.next()
      if (compare(value, vmin) < 0) {
        vmin = value
      } else if (compare(value, vmax) > 0) {
        vmax = value
      }
    }
    return [vmin, vmax]
  }
}

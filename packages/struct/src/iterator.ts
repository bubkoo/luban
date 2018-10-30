import {
  IIterable,
  IIterator,
  IterableOrArrayLike,
  ArrayIterator,
} from './iterators'

/**
 * Create an iterator for an iterable object.
 *
 * @param object - The iterable or array-like object of interest.
 *
 * @returns A new iterator for the given object.
 *
 * #### Notes
 * This function allows iteration structs to operate on user-defined
 * iterable types and builtin array-like objects in a uniform fashion.
 */
export function iterator<T>(object: IterableOrArrayLike<T>): IIterator<T> {
  if (typeof (object as any).iterator === 'function') {
    return (object as IIterable<T>).iterator()
  }

  return new ArrayIterator<T>(object as ArrayLike<T>)
}

/**
 * Create an array from an iterable of values.
 *
 * @param object - The iterable or array-like object of interest.
 *
 * @returns A new array of values from the given object.
 *
 * #### Example
 * ```typescript
 * import { iter, toArray } from '@luban/struct';
 *
 * let data = [1, 2, 3, 4, 5, 6];
 *
 * let stream = iter(data);
 *
 * toArray(stream);  // [1, 2, 3, 4, 5, 6];
 * ```
 */
export function toArray<T>(object: IterableOrArrayLike<T>): T[] {
  const result: T[] = []
  const it = iterator(object)
  let index = 0

  while (it.hasNext()) {
    result[index] = it.next()
    index += 1
  }

  return result
}

/**
 * Invoke a function for each value in an iterable.
 *
 * @param obj - The iterable or array-like object of interest.
 *
 * @param fn - The callback function to invoke for each value.
 *
 * #### Notes
 * Iteration can be terminated early by returning `false` from the
 * callback function.
 *
 * #### Complexity
 * Linear.
 *
 * #### Example
 * ```typescript
 * import { each } from '@luban/struct';
 *
 * let data = [5, 7, 0, -2, 9];
 *
 * each(data, value => { console.log(value); });
 * ```
 */
export function each<T>(
  obj: IterableOrArrayLike<T>,
  fn: (value: T, index: number) => boolean | void,
): void {
  const it = iterator(obj)
  let index = 0

  while (it.hasNext()) {
    if (fn(it.next(), index) === false) {
      return
    }
    index += 1
  }
}

/**
 * Test whether all values in an iterable satisfy a predicate.
 *
 * @param obj - The iterable or array-like object of interest.
 *
 * @param fn - The predicate function to invoke for each value.
 *
 * @returns `true` if all values pass the test, `false` otherwise.
 *
 * #### Notes
 * Iteration terminates on the first `false` predicate result.
 *
 * #### Complexity
 * Linear.
 *
 * #### Example
 * ```typescript
 * import { every } from '@luban/struct';
 *
 * let data = [5, 7, 1];
 *
 * every(data, value => value % 2 === 0);  // false
 * every(data, value => value % 2 === 1);  // true
 * ```
 */
export function every<T>(
  obj: IterableOrArrayLike<T>,
  fn: (value: T, index: number) => boolean,
): boolean {
  const it = iterator(obj)
  let index = 0

  while (it.hasNext()) {
    if (!fn(it.next(), index)) {
      return false
    }
    index += 1
  }

  return true
}

/**
 * Test whether any value in an iterable satisfies a predicate.
 *
 * @param obj - The iterable or array-like object of interest.
 *
 * @param fn - The predicate function to invoke for each value.
 *
 * @returns `true` if any value passes the test, `false` otherwise.
 *
 * #### Notes
 * Iteration terminates on the first `true` predicate result.
 *
 * #### Complexity
 * Linear.
 *
 * #### Example
 * ```typescript
 * import { some } from '@luban/struct';
 *
 * let data = [5, 7, 1];
 *
 * some(data, value => value === 7);  // true
 * some(data, value => value === 3);  // false
 * ```
 */
export function some<T>(
  obj: IterableOrArrayLike<T>,
  fn: (value: T, index: number) => boolean,
): boolean {
  const it = iterator(obj)
  let index = 0
  while (it.hasNext()) {
    if (fn(it.next(), index)) {
      return true
    }
    index += 1
  }
  return false
}

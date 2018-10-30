import { iterator } from './iterator'
import {
  IIterator,
  IReversible,
  ReversibleOrArrayLike,
  ReversibleArrayIterator,
} from './iterators'

/**
 * Create an iterator for a retroable object.
 *
 * @param obj - The retroable or array-like object of interest.
 *
 * @returns An iterator which traverses the object's values in reverse.
 *
 * #### Example
 * ```typescript
 * import { reverse, toArray } from '@luban/struct';
 *
 * let data = [1, 2, 3, 4, 5, 6];
 *
 * let stream = reverse(data);
 *
 * toArray(stream);  // [6, 5, 4, 3, 2, 1]
 * ```
 */
export function reverse<T>(obj: ReversibleOrArrayLike<T>): IIterator<T> {
  if (typeof (obj as any).reverse === 'function') {
    return iterator((obj as IReversible<T>).reverse())
  }

  return new ReversibleArrayIterator<T>(obj as ArrayLike<T>)
}

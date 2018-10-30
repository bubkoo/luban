/**
 * A class which attaches a value to an external object.
 *
 * #### Notes
 * Attached properties are used to extend the state of an object with
 * semantic data from an unrelated class. They also encapsulate value
 * creation, coercion, and notification.
 *
 * Because attached property values are stored in a hash table, which
 * in turn is stored in a WeakMap keyed on the owner object, there is
 * non-trivial storage overhead involved in their use. The pattern is
 * therefore best used for the storage of rare data.
 */
export class AttachedProperty<T, U> {
  /**
   * The human readable name for the property.
   */
  readonly name: string
  private pid = Private.nextPID()
  private createFn: ((owner: T) => U)
  private enforceFn: ((owner: T, value: U) => U) | null
  private compareFn: ((oldValue: U, newValue: U) => boolean) | null
  private changedFn: ((owner: T, oldValue: U, newValue: U) => void) | null

  /**
   * Construct a new attached property.
   *
   * @param options - The options for initializing the property.
   */
  constructor(options: AttachedProperty.IOptions<T, U>) {
    this.name = options.name
    this.createFn = options.create
    this.enforceFn = options.enforce || null
    this.compareFn = options.compare || null
    this.changedFn = options.changed || null
  }

  /**
   * Get the current value of the property for a given owner.
   *
   * @param owner - The property owner of interest.
   *
   * @returns The current value of the property.
   *
   * #### Notes
   * If the value has not yet been set, the default value will be
   * computed and assigned as the current value of the property.
   */
  get(owner: T): U {
    let value: U
    const map = Private.ensureMap(owner)
    if (this.pid in map) {
      value = map[this.pid]
    } else {
      value = map[this.pid] = this.createValue(owner)
    }
    return value
  }

  /**
   * Set the current value of the property for a given owner.
   *
   * @param owner - The property owner of interest.
   *
   * @param value - The value for the property.
   *
   * #### Notes
   * If the value has not yet been set, the default value will be
   * computed and used as the previous value for the comparison.
   */
  set(owner: T, value: U): void {
    let oldValue: U
    const map = Private.ensureMap(owner)
    if (this.pid in map) {
      oldValue = map[this.pid]
    } else {
      oldValue = map[this.pid] = this.createValue(owner)
    }
    const newValue = this.enforceValue(owner, value)
    map[this.pid] = newValue
    this.maybeNotify(owner, oldValue, newValue)
  }

  /**
   * Explicitly coerce the current property value for a given owner.
   *
   * @param owner - The property owner of interest.
   *
   * #### Notes
   * If the value has not yet been set, the default value will be
   * computed and used as the previous value for the comparison.
   */
  enforce(owner: T): void {
    let oldValue: U
    const map = Private.ensureMap(owner)
    if (this.pid in map) {
      oldValue = map[this.pid]
    } else {
      oldValue = map[this.pid] = this.createValue(owner)
    }
    const newValue = this.enforceValue(owner, oldValue)
    map[this.pid] = newValue
    this.maybeNotify(owner, oldValue, newValue)
  }

  private createValue(owner: T): U {
    return this.createFn(owner)
  }

  private enforceValue(owner: T, value: U): U {
    const coerceFn = this.enforceFn
    return coerceFn ? coerceFn(owner, value) : value
  }

  private compareValue(oldValue: U, newValue: U): boolean {
    const compareFn = this.compareFn
    return compareFn ? compareFn(oldValue, newValue) : oldValue === newValue
  }

  private maybeNotify(owner: T, oldValue: U, newValue: U): void {
    const changedFn = this.changedFn
    if (changedFn && !this.compareValue(oldValue, newValue)) {
      changedFn(owner, oldValue, newValue)
    }
  }
}

export namespace AttachedProperty {
  /**
   * The options object used to initialize an attached property.
   */
  export interface IOptions<T, U> {
    /**
     * The human readable name for the property.
     *
     * #### Notes
     * By convention, this should be the same as the name used to define
     * the public accessor for the property value.
     *
     * This **does not** have an effect on the property lookup behavior.
     * Multiple properties may share the same name without conflict.
     */
    name: string

    /**
     * A factory function used to create the default property value.
     *
     * #### Notes
     * This will be called whenever the property value is required,
     * but has not yet been set for a given owner.
     */
    create: (owner: T) => U

    /**
     * A function used to coerce a supplied value into the final value.
     *
     * #### Notes
     * This will be called whenever the property value is changed, or
     * when the property is explicitly coerced. The return value will
     * be used as the final value of the property.
     *
     * This will **not** be called for the initial default value.
     */
    enforce?: (owner: T, value: U) => U

    /**
     * A function used to compare two values for equality.
     *
     * #### Notes
     * This is called to determine if the property value has changed.
     * It should return `true` if the given values are equivalent, or
     * `false` if they are different.
     *
     * If this is not provided, it defaults to the `===` operator.
     */
    compare?: (oldValue: U, newValue: U) => boolean

    /**
     * A function called when the property value has changed.
     *
     * #### Notes
     * This will be invoked when the property value is changed and the
     * comparator indicates that the old value is not equal to the new
     * value.
     *
     * This will **not** be called for the initial default value.
     */
    changed?: (owner: T, oldValue: U, newValue: U) => void
  }

  /**
   * Clear the stored property data for the given owner.
   *
   * @param owner - The property owner of interest.
   *
   * #### Notes
   * This will clear all property values for the owner, but it will
   * **not** run the change notification for any of the properties.
   */
  export function clearData(owner: any): void {
    Private.cache.delete(owner)
  }
}

/**
 * The namespace for the module implementation details.
 */
namespace Private {
  export type PropertyMap = { [key: string]: any }
  export const cache = new WeakMap<any, PropertyMap>()
  export const nextPID = (() => {
    let id = 0
    return () => {
      const rand = Math.random()
      const stem = `${rand}`.slice(2)
      const pid = `pid-${stem}-${id}`

      id += 1

      return pid
    }
  })()

  /**
   * Lookup the data map for the property owner.
   *
   * This will create the map if one does not already exist.
   */
  export function ensureMap(owner: any): PropertyMap {
    let map = cache.get(owner)
    if (map) {
      return map
    }
    map = Object.create(null) as PropertyMap
    cache.set(owner, map)
    return map
  }
}

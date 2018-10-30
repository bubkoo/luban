/**
 * A class which wraps a promise into a delegate object.
 *
 * #### Notes
 * This class is useful when the logic to resolve or reject a promise
 * cannot be defined at the point where the promise is created.
 */
export class PromiseDelegate<T> {
  /**
   * The promise wrapped by the delegate.
   */
  readonly promise: Promise<T>

  private innerResolve: (value: T | PromiseLike<T>) => void
  private innerReject: (reason: any) => void

  /**
   * Construct a new promise delegate.
   */
  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.innerResolve = resolve
      this.innerReject = reject
    })
  }

  /**
   * Resolve the wrapped promise with the given value.
   *
   * @param value - The value to use for resolving the promise.
   */
  resolve(value: T | PromiseLike<T>): void {
    this.innerResolve(value)
  }

  /**
   * Reject the wrapped promise with the given value.
   *
   * @param reason - The reason for rejecting the promise.
   */
  reject(reason: any): void {
    this.innerReject(reason)
  }
}

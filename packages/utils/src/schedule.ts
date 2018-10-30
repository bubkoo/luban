import remove = require('lodash.remove')

/**
 * A function to schedule an event loop callback.
 */
export const schedule = (
  requestAnimationFrame ||
  setImmediate ||
  setTimeout
)

/**
* A function to unschedule an event loop callback.
*/
export const unschedule = (
  cancelAnimationFrame ||
  clearImmediate ||
  clearTimeout
)

export class ScheduledCleaner<T> {
  readonly dirtySet: Set<(T | null)[]>
  private scheduleId: number
  private flushGuard: boolean
  private shouldRemove: (item: T) => boolean

  constructor(shouldRemove: (item: T) => boolean) {
    this.dirtySet = new Set<T[]>()
    this.scheduleId = 0
    this.flushGuard = false
    this.shouldRemove = shouldRemove
  }

  clean(items: T[]) {
    if (this.dirtySet.size === 0) {
      this.scheduleId = schedule(() => {
        this.dump()
      })
    }
    this.dirtySet.add(items)
  }

  flush(): void {
    if (this.flushGuard || this.scheduleId === 0) {
      return
    }

    this.cancel()

    this.flushGuard = true
    this.dump()
    this.flushGuard = false
  }

  cancel() {
    if (this.scheduleId) {
      unschedule(this.scheduleId)
      this.scheduleId = 0
    }
  }

  private dump(): void {
    this.dirtySet.forEach((items: T[]) => {
      remove(items, this.shouldRemove)
    })
    this.dirtySet.clear()
  }
}

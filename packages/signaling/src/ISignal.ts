/**
 * A type alias for a slot function.
 *
 * @param sender - The object emitting the signal.
 *
 * @param args - The args object emitted with the signal.
 *
 * #### Notes
 * A slot is invoked when a signal connected to it is emitted.
 */
export type Slot<T, U> = (sender: T, args: U) => void

/**
 * An object used for type-safe inter-object communication.
 *
 * #### Notes
 * Signals provide a type-safe implementation of the publish-subscribe
 * pattern. An object (publisher) declares which signals it will emit,
 * and consumers connect callbacks (subscribers) to those signals. The
 * subscribers are invoked whenever the publisher emits the signal.
 */
export interface ISignal<T, U> {
  /**
   * Connect a slot to the signal.
   *
   * @param slot - The slot to invoke when the signal is emitted.
   *
   * @param thisArg - The `this` context for the callback. If provided,
   *   this must be a non-primitive object.
   *
   * @returns `true` if the connection succeeds, `false` otherwise.
   *
   * #### Notes
   * Slots are invoked in the order in which they are connected.
   *
   * Signal connections are unique. If a connection already exists for
   * the given `slot` and `thisArg`, this method returns `false`.
   *
   * A newly connected slot will not be invoked until the next time the
   * signal is emitted, even if the slot is connected while the signal
   * is dispatching.
   */
  connect(slot: Slot<T, U>, thisArg?: any): boolean

  /**
   * Disconnect a slot from the signal.
   *
   * @param slot - The slot to disconnect from the signal.
   *
   * @param thisArg - The `this` context for the callback. If provided,
   *   this must be a non-primitive object.
   *
   * @returns `true` if the connection is removed, `false` otherwise.
   *
   * #### Notes
   * If no connection exists for the given `slot` and `thisArg`, this
   * method returns `false`.
   *
   * A disconnected slot will no longer be invoked, even if the slot
   * is disconnected while the signal is dispatching.
   */
  disconnect(slot: Slot<T, U>, thisArg?: any): boolean
}

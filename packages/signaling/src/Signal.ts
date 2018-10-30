import { ScheduledCleaner } from '@luban/utils'
import { ISignal, Slot } from './ISignal'

/**
 * A concrete implementation of `ISignal`.
 */
export class Signal<T, U> implements ISignal<T, U> {

  /**
   * The sender which owns the signal.
   */
  readonly sender: T

  /**
   * Construct a new signal.
   *
   * @param sender - The sender which owns the signal.
   */
  constructor(sender: T) {
    this.sender = sender
  }

  /**
   * Connect a slot to the signal.
   *
   * @param slot - The slot to invoke when the signal is emitted.
   *
   * @param thisArg - The `this` context for the slot. If provided,
   *   this must be a non-primitive object.
   *
   * @returns `true` if the connection succeeds, `false` otherwise.
   */
  connect(slot: Slot<T, U>, thisArg?: any): boolean {
    return Private.connect(this, slot, thisArg)
  }

  /**
   * Disconnect a slot from the signal.
   *
   * @param slot - The slot to disconnect from the signal.
   *
   * @param thisArg - The `this` context for the slot. If provided,
   *   this must be a non-primitive object.
   *
   * @returns `true` if the connection is removed, `false` otherwise.
   */
  disconnect(slot: Slot<T, U>, thisArg?: any): boolean {
    return Private.disconnect(this, slot, thisArg)
  }

  /**
   * Emit the signal and invoke the connected slots.
   *
   * @param args - The args to pass to the connected slots.
   *
   * #### Notes
   * Slots are invoked synchronously in connection order.
   *
   * Exceptions thrown by connected slots will be caught and logged.
   */
  emit(args: U): void {
    Private.emit(this, args)
  }
}

/**
 * The namespace for the `Signal` class statics.
 */
export namespace Signal {
  /**
   * Remove all connections between a sender and receiver.
   *
   * @param sender - The sender object of interest.
   *
   * @param receiver - The receiver object of interest.
   *
   * #### Notes
   * If a `context` is provided when connecting a signal, that object
   * is considered the receiver. Otherwise, the `slot` is considered
   * the receiver.
   */
  export function disconnectBetween(sender: any, receiver: any): void {
    Private.disconnectBetween(sender, receiver)
  }

  /**
   * Remove all connections where the given object is the sender.
   *
   * @param sender - The sender object of interest.
   */
  export function disconnectSender(sender: any): void {
    Private.disconnectSender(sender)
  }

  /**
   * Remove all connections where the given object is the receiver.
   *
   * @param receiver - The receiver object of interest.
   *
   * #### Notes
   * If a `context` is provided when connecting a signal, that object
   * is considered the receiver. Otherwise, the `slot` is considered
   * the receiver.
   */
  export function disconnectReceiver(receiver: any): void {
    Private.disconnectReceiver(receiver)
  }

  /**
   * Remove all connections where an object is the sender or receiver.
   *
   * @param object - The object of interest.
   *
   * #### Notes
   * If a `context` is provided when connecting a signal, that object
   * is considered the receiver. Otherwise, the `slot` is considered
   * the receiver.
   */
  export function disconnectAll(object: any): void {
    Private.disconnectAll(object)
  }

  /**
   * Clear all signal data associated with the given object.
   *
   * @param object - The object for which the data should be cleared.
   *
   * #### Notes
   * This removes all signal connections and any other signal data
   * associated with the object.
   */
  export function clearData(object: any): void {
    Private.disconnectAll(object)
  }

  /**
   * A type alias for the exception handler function.
   */
  export type ExceptionHandler = (err: Error) => void

  /**
   * Get the signal exception handler.
   *
   * @returns The current exception handler.
   *
   * #### Notes
   * The default exception handler is `console.error`.
   */
  export function getExceptionHandler(): ExceptionHandler {
    return Private.exceptionHandler
  }

  /**
   * Set the signal exception handler.
   *
   * @param handler - The function to use as the exception handler.
   *
   * @returns The old exception handler.
   *
   * #### Notes
   * The exception handler is invoked when a slot throws an exception.
   */
  export function setExceptionHandler(handler: ExceptionHandler): ExceptionHandler {
    const old = Private.exceptionHandler
    Private.exceptionHandler = handler
    return old
  }
}

namespace Private {
  /**
   * The signal exception handler function.
   */
  export let exceptionHandler: Signal.ExceptionHandler = (err: Error) => {
    console.error(err)
  }

  /**
   * Connect a slot to a signal.
   *
   * @param signal - The signal of interest.
   *
   * @param slot - The slot to invoke when the signal is emitted.
   *
   * @param context - The `this` context for the slot. If provided,
   *   this must be a non-primitive object.
   *
   * @returns `true` if the connection succeeds, `false` otherwise.
   */
  export function connect<T, U>(signal: Signal<T, U>, slot: Slot<T, U>, context?: any): boolean {
    const thisArg = context || undefined

    // Ensure the sender's array of receivers is created.
    let receivers = receiversForSender.get(signal.sender)
    if (!receivers) {
      receivers = []
      receiversForSender.set(signal.sender, receivers)
    }

    // Bail if a matching connection already exists.
    if (findConnection(receivers, signal, slot, thisArg)) {
      return false
    }

    // Choose the best object for the receiver.
    const receiver = thisArg || slot

    // Ensure the receiver's array of senders is created.
    let senders = sendersForReceiver.get(receiver)
    if (!senders) {
      senders = []
      sendersForReceiver.set(receiver, senders)
    }

    // Create a new connection and add it to the end of each array.
    const connection = { signal, slot, context: thisArg }
    receivers.push(connection)
    senders.push(connection)

    // Indicate a successful connection.
    return true
  }

  /**
   * Disconnect a slot from a signal.
   *
   * @param signal - The signal of interest.
   *
   * @param slot - The slot to disconnect from the signal.
   *
   * @param context - The `this` context for the slot. If provided,
   *   this must be a non-primitive object.
   *
   * @returns `true` if the connection is removed, `false` otherwise.
   */
  export function disconnect<T, U>(signal: Signal<T, U>, slot: Slot<T, U>, context?: any): boolean {
    const thisArg = context || undefined

    // Lookup the list of receivers, and bail if none exist.
    const receivers = receiversForSender.get(signal.sender)
    if (!receivers || receivers.length === 0) {
      return false
    }

    // Bail if no matching connection exits.
    const connection = findConnection(receivers, signal, slot, thisArg)
    if (!connection) {
      return false
    }

    // Choose the best object for the receiver.
    const receiver = thisArg || slot
    const senders = sendersForReceiver.get(receiver)!

    // Clear the connection and schedule cleanup of the arrays.
    connection.signal = null
    scheduleCleanup(receivers)
    scheduleCleanup(senders)

    // Indicate a successful disconnection.
    return true
  }

  /**
   * Remove all connections between a sender and receiver.
   *
   * @param sender - The sender object of interest.
   *
   * @param receiver - The receiver object of interest.
   */
  export function disconnectBetween(sender: any, receiver: any): void {
    // If there are no receivers, there is nothing to do.
    const receivers = receiversForSender.get(sender)
    if (!receivers || receivers.length === 0) {
      return
    }

    // If there are no senders, there is nothing to do.
    const senders = sendersForReceiver.get(receiver)
    if (!senders || senders.length === 0) {
      return
    }

    // Clear each connection between the sender and receiver.
    senders.forEach((connection: IConnection) => {
      // Skip connections which have already been cleared.
      if (!connection.signal) {
        return
      }

      // Clear the connection if it matches the sender.
      if (connection.signal.sender === sender) {
        connection.signal = null
      }
    })

    // Schedule a cleanup of the senders and receivers.
    scheduleCleanup(receivers)
    scheduleCleanup(senders)
  }

  /**
   * Remove all connections where the given object is the sender.
   *
   * @param sender - The sender object of interest.
   */
  export function disconnectSender(sender: any): void {
    // If there are no receivers, there is nothing to do.
    const receivers = receiversForSender.get(sender)
    if (!receivers || receivers.length === 0) {
      return
    }

    receivers.forEach((connection: IConnection) => {
      if (!connection.signal) {
        return
      }

      // Choose the best object for the receiver.
      const receiver = connection.context || connection.slot

      // Clear the connection.
      connection.signal = null

      // Cleanup the array of senders, which is now known to exist.
      scheduleCleanup(sendersForReceiver.get(receiver)!)
    })

    // Schedule a cleanup of the receivers.
    scheduleCleanup(receivers)
  }

  /**
   * Remove all connections where the given object is the receiver.
   *
   * @param receiver - The receiver object of interest.
   */
  export function disconnectReceiver(receiver: any): void {
    const senders = sendersForReceiver.get(receiver)
    if (!senders || senders.length === 0) {
      return
    }

    senders.forEach((connection: IConnection) => {
      // Skip connections which have already been cleared.
      if (!connection.signal) {
        return
      }

      // Lookup the sender for the connection.
      const sender = connection.signal.sender

      // Clear the connection.
      connection.signal = null

      // Cleanup the array of receivers, which is now known to exist.
      scheduleCleanup(receiversForSender.get(sender)!)
    })

    // Schedule a cleanup of the list of senders.
    scheduleCleanup(senders)
  }

  /**
   * Remove all connections where an object is the sender or receiver.
   *
   * @param object - The object of interest.
   */
  export function disconnectAll(object: any): void {
    // Clear and cleanup any receiver connections.
    const receivers = receiversForSender.get(object)
    if (receivers && receivers.length > 0) {
      receivers.forEach((connection: IConnection) => { connection.signal = null })
      scheduleCleanup(receivers)
    }

    // Clear and cleanup any sender connections.
    const senders = sendersForReceiver.get(object)
    if (senders && senders.length > 0) {
      senders.forEach((connection: IConnection) => { connection.signal = null })
      scheduleCleanup(senders)
    }
  }

  /**
   * Emit a signal and invoke its connected slots.
   *
   * @param signal - The signal of interest.
   *
   * @param args - The args to pass to the connected slots.
   *
   * #### Notes
   * Slots are invoked synchronously in connection order.
   *
   * Exceptions thrown by connected slots will be caught and logged.
   */
  export function emit<T, U>(signal: Signal<T, U>, args: U): void {
    const receivers = receiversForSender.get(signal.sender)
    if (!receivers || receivers.length === 0) {
      return
    }

    // Invoke the slots for connections with a matching signal.
    // Any connections added during emission are not invoked.
    receivers.forEach((connection: IConnection) => {
      if (connection.signal === signal) {
        invokeSlot(connection, args)
      }
    })
  }

  /**
   * An object which holds connection data.
   */
  interface IConnection {
    /**
     * The signal for the connection.
     *
     * A `null` signal indicates a cleared connection.
     */
    signal: Signal<any, any> | null

    /**
     * The slot connected to the signal.
     */
    readonly slot: Slot<any, any>

    /**
     * The `this` context for the slot.
     */
    readonly context: any
  }

  const receiversForSender = new WeakMap<any, IConnection[]>()
  const sendersForReceiver = new WeakMap<any, IConnection[]>()
  const connectionCleaner = new ScheduledCleaner<IConnection>(isDeadConnection)

  function findConnection(
    connections: IConnection[],
    signal: Signal<any, any>,
    slot: Slot<any, any>,
    context: any,
  ): IConnection | undefined {
    let result: IConnection | undefined = undefined
    connections.some((connection: IConnection) => {
      if (
        connection.signal === signal &&
        connection.slot === slot &&
        connection.context === context
      ) {
        result = connection
        return true
      }
      return false
    })

    return result
  }

  function invokeSlot(connection: IConnection, args: any): void {
    const { signal, slot, context } = connection
    try {
      slot.call(context, signal!.sender, args)
    } catch (err) {
      exceptionHandler(err)
    }
  }

  function scheduleCleanup(connections: IConnection[]): void {
    connectionCleaner.clean(connections)
  }

  function isDeadConnection(connection: IConnection): boolean {
    return connection.signal === null
  }
}

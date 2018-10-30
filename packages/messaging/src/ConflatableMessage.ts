import { Message } from './Message'

/**
 * A convenience message class which conflates automatically.
 *
 * #### Notes
 * Message conflation is an advanced topic. Most user code will not
 * make use of this class.
 *
 * This message class is useful for creating message instances which
 * should be conflated, but which have no state other than `type`.
 *
 * If conflation of stateful messages is required, a custom `Message`
 * subclass should be created.
 */
export class ConflatableMessage extends Message {
  /**
   * Test whether the message is conflatable.
   *
   * #### Notes
   * This property is always `true`.
   */
  get isConflatable(): boolean {
    return true
  }

  /**
   * Conflate this message with another message of the same `type`.
   *
   * #### Notes
   * This method always returns `true`.
   */
  conflate(other: ConflatableMessage): boolean {
    return true
  }
}

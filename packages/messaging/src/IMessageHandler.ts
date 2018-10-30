import { Message } from './Message'

/**
 * An object which handles messages.
 *
 * #### Notes
 * A message handler is a simple way of defining a type which can act
 * upon on a large variety of external input without requiring a large
 * abstract API surface. This is particularly useful in the context of
 * widget frameworks where the number of distinct message types can be
 * unbounded.
 */
export interface IMessageHandler {
  /**
   * Process a message sent to the handler.
   *
   * @param msg - The message to be processed.
   */
  processMessage(msg: Message): void
}

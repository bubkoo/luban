import { Message } from './Message'
import { IMessageHandler } from './IMessageHandler'

/**
 * An object which intercepts messages sent to a message handler.
 *
 * #### Notes
 * A message hook is useful for intercepting or spying on messages
 * sent to message handlers which were either not created by the
 * consumer, or when subclassing the handler is not feasible.
 *
 * If `messageHook` returns `false`, no other message hooks will be
 * invoked and the message will not be delivered to the handler.
 *
 * If all installed message hooks return `true`, the message will
 * be delivered to the handler for processing.
 *
 * **See also:** [[installMessageHook]] and [[removeMessageHook]]
 */
export interface IMessageHook {
  /**
   * Intercept a message sent to a message handler.
   *
   * @param handler - The target handler of the message.
   *
   * @param msg - The message to be sent to the handler.
   *
   * @returns `true` if the message should continue to be processed
   *   as normal, or `false` if processing should cease immediately.
   */
  messageHook(handler: IMessageHandler, msg: Message): boolean
}

/**
 * A type alias for message hook object or function.
 *
 * #### Notes
 * The signature and semantics of a message hook function are the same
 * as the `messageHook` method of [[IMessageHook]].
 */
export type MessageHook = IMessageHook | ((handler: IMessageHandler, msg: Message) => boolean)

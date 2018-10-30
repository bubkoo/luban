import fill = require('lodash.fill')
import { schedule, unschedule, ScheduledCleaner } from '@luban/utils'
import { Message } from './Message'
import { MessageHook } from './IMessageHook'
import { IMessageHandler } from './IMessageHandler'

export namespace MessageLoop {
  /**
   * Send a message to a message handler to process immediately.
   *
   * @param handler - The handler which should process the message.
   *
   * @param msg - The message to deliver to the handler.
   *
   * #### Notes
   * The message will first be sent through any installed message hooks
   * for the handler. If the message passes all hooks, it will then be
   * delivered to the `processMessage` method of the handler.
   *
   * The message will not be conflated with pending posted messages.
   *
   * Exceptions in hooks and handlers will be caught and logged.
   */
  export function sendMessage(handler: IMessageHandler, msg: Message): void {
    const hooks = messageHooks.get(handler)

    // Handle the common case of no installed hooks.
    if (!hooks || hooks.length === 0) {
      invokeHandler(handler, msg)
      return
    }

    // Invoke the message hooks starting with the newest first.
    const passed = [...hooks].reverse().every((hook) => {
      return hook ? invokeHook(hook, handler, msg) : true
    })

    // Invoke the handler if the message passes all hooks.
    if (passed) {
      invokeHandler(handler, msg)
    }
  }

  /**
   * Post a message to a message handler to process in the future.
   *
   * @param handler - The handler which should process the message.
   *
   * @param msg - The message to post to the handler.
   *
   * #### Notes
   * The message will be conflated with the pending posted messages for
   * the handler, if possible. If the message is not conflated, it will
   * be queued for normal delivery on the next cycle of the event loop.
   *
   * Exceptions in hooks and handlers will be caught and logged.
   */
  export function postMessage(handler: IMessageHandler, msg: Message): void {
    // Handle the common case of a non-conflatable message.
    if (!msg.isConflatable) {
      enqueueMessage(handler, msg)
      return
    }

    // Conflate the message with an existing message if possible.
    const conflated = messageQueue.some((posted) => {
      if (posted.handler !== handler) {
        return false
      }
      if (!posted.msg) {
        return false
      }
      if (posted.msg.type !== msg.type) {
        return false
      }
      if (!posted.msg.isConflatable) {
        return false
      }

      return posted.msg.conflate(msg)
    })

    // Enqueue the message if it was not conflated.
    if (!conflated) {
      enqueueMessage(handler, msg)
    }
  }

  /**
   * Install a message hook for a message handler.
   *
   * @param handler - The message handler of interest.
   *
   * @param hook - The message hook to install.
   *
   * #### Notes
   * A message hook is invoked before a message is delivered to the
   * handler. If the hook returns `false`, no other hooks will be
   * invoked and the message will not be delivered to the handler.
   *
   * The most recently installed message hook is executed first.
   *
   * If the hook is already installed, this is a no-op.
   */
  export function installMessageHook(handler: IMessageHandler, hook: MessageHook): void {
    // Lookup the hooks for the handler.
    const hooks = messageHooks.get(handler)

    // Bail early if the hook is already installed.
    if (hooks && hooks.indexOf(hook) !== -1) {
      return
    }

    // Add the hook to the end, so it will be the first to execute.
    if (!hooks) {
      messageHooks.set(handler, [hook])
    } else {
      hooks.push(hook)
    }
  }

  /**
   * Remove an installed message hook for a message handler.
   *
   * @param handler - The message handler of interest.
   *
   * @param hook - The message hook to remove.
   *
   * #### Notes
   * It is safe to call this function while the hook is executing.
   *
   * If the hook is not installed, this is a no-op.
   */
  export function removeMessageHook(handler: IMessageHandler, hook: MessageHook): void {
    // Lookup the hooks for the handler.
    const hooks = messageHooks.get(handler)

    // Bail early if the hooks do not exist.
    if (!hooks) {
      return
    }

    // Lookup the index of the hook and bail if not found.
    const i = hooks.indexOf(hook)
    if (i === -1) {
      return
    }

    // Clear the hook and schedule a cleanup of the array.
    hooks[i] = null
    hookCleaner.clean(hooks)
  }

  /**
   * Clear all message data associated with a message handler.
   *
   * @param handler - The message handler of interest.
   *
   * #### Notes
   * This will clear all posted messages and hooks for the handler.
   */
  export function clearData(handler: IMessageHandler): void {
    const hooks = messageHooks.get(handler)

    // Clear all messsage hooks for the handler.
    if (hooks && hooks.length > 0) {
      fill(hooks, null)
      hookCleaner.clean(hooks)
    }

    // Clear all posted messages for the handler.
    messageQueue.forEach((posted) => {
      if (posted.handler === handler) {
        posted.handler = null
        posted.msg = null
      }
    })
  }

  /**
   * Process the pending posted messages in the queue immediately.
   *
   * #### Notes
   * This function is useful when posted messages must be processed
   * immediately, instead of on the next animation frame.
   *
   * This function should normally not be needed, but it may be
   * required to work around certain browser idiosyncrasies.
   *
   * Recursing into this function is a no-op.
   */
  export function flush(): void {
    // Bail if recursion is detected or if there is no pending task.
    if (flushGuard || loopTaskID === 0) {
      return
    }

    // Unschedule the pending loop task.
    unschedule(loopTaskID)

    // Run the message loop within the recursion guard.
    flushGuard = true
    runMessageLoop()
    flushGuard = false
  }

  /**
   * A type alias for the exception handler function.
   */
  export type ExceptionHandler = (err: Error) => void

  /**
   * Get the message loop exception handler.
   *
   * @returns The current exception handler.
   *
   * #### Notes
   * The default exception handler is `console.error`.
   */
  export function getExceptionHandler(): ExceptionHandler {
    return exceptionHandler
  }

  /**
   * Set the message loop exception handler.
   *
   * @param handler - The function to use as the exception handler.
   *
   * @returns The old exception handler.
   *
   * #### Notes
   * The exception handler is invoked when a message handler or a
   * message hook throws an exception.
   */
  export function setExceptionHandler(handler: ExceptionHandler): ExceptionHandler {
    const old = exceptionHandler
    exceptionHandler = handler
    return old
  }

  type PostedMessage = { handler: IMessageHandler | null, msg: Message | null }
  type MessageHooks = (MessageHook | null)[]
  type MessageHookOrNull = MessageHook | null

  let loopTaskID = 0
  let flushGuard = false
  const hookCleaner = new ScheduledCleaner<MessageHookOrNull>(isNullHook)
  const messageQueue: PostedMessage[] = []
  const messageHooks = new WeakMap<IMessageHandler, MessageHooks>()

  let exceptionHandler: ExceptionHandler = (err: Error) => {
    console.error(err)
  }

  /**
   * Invoke a message hook with the specified handler and message.
   *
   * Returns the result of the hook, or `true` if the hook throws.
   *
   * Exceptions in the hook will be caught and logged.
   */
  function invokeHook(hook: MessageHook, handler: IMessageHandler, msg: Message): boolean {
    let result = true
    try {
      if (typeof hook === 'function') {
        result = hook(handler, msg)
      } else {
        result = hook.messageHook(handler, msg)
      }
    } catch (err) {
      exceptionHandler(err)
    }
    return result
  }

  /**
   * Invoke a message handler with the specified message.
   *
   * Exceptions in the handler will be caught and logged.
   */
  function invokeHandler(handler: IMessageHandler, msg: Message): void {
    try {
      handler.processMessage(msg)
    } catch (err) {
      exceptionHandler(err)
    }
  }

  /**
   * Add a message to the end of the message queue.
   *
   * This will automatically schedule a run of the message loop.
   */
  function enqueueMessage(handler: IMessageHandler, msg: Message): void {
    // Add the posted message to the queue.
    messageQueue.push({ handler, msg })

    // Bail if a loop task is already pending.
    if (loopTaskID !== 0) {
      return
    }

    // Schedule a run of the message loop.
    loopTaskID = schedule(runMessageLoop)
  }

  /**
   * Run an iteration of the message loop.
   *
   * This will process all pending messages in the queue. If a message
   * is added to the queue while the message loop is running, it will
   * be processed on the next cycle of the loop.
   */
  function runMessageLoop(): void {
    // Clear the task ID so the next loop can be scheduled.
    loopTaskID = 0

    // If the message queue is empty, there is nothing else to do.
    if (messageQueue.length === 0) {
      return
    }

    // // Add a sentinel value to the end of the queue. The queue will
    // // only be processed up to the sentinel. Messages posted during
    // // this cycle will execute on the next cycle.
    const sentinel: PostedMessage = { handler: null, msg: null }
    messageQueue.push(sentinel)

    while (true) {
      // Remove the first posted message in the queue.
      const posted = messageQueue.shift()!

      // If the value is the sentinel, exit the loop.
      if (posted === sentinel) {
        return
      }

      // Dispatch the message if it has not been cleared.
      if (posted.handler && posted.msg) {
        sendMessage(posted.handler, posted.msg)
      }
    }
  }

  function isNullHook(hook: MessageHook): boolean {
    return hook === null
  }
}

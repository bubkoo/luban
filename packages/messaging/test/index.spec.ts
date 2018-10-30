import {
  ConflatableMessage,
  IMessageHandler,
  IMessageHook,
  Message,
  MessageHook,
  MessageLoop,
} from '../src/index'

class Handler implements IMessageHandler {
  messages: string[] = []
  processMessage(msg: Message): void {
    this.messages.push(msg.type)
  }
}

class BadHandler implements IMessageHandler {
  processMessage(msg: Message): void {
    throw new Error('process error')
  }
}

class GlobalHandler extends Handler {
  static messages: string[] = []
  processMessage(msg: Message): void {
    super.processMessage(msg)
    GlobalHandler.messages.push(msg.type)
  }
}

class LogHook implements IMessageHook {
  preventTypes: string[] = []
  messages: string[] = []
  handlers: IMessageHandler[] = []

  messageHook(handler: IMessageHandler, msg: Message): boolean {
    this.messages.push(msg.type)
    this.handlers.push(handler)
    return this.preventTypes.indexOf(msg.type) === -1
  }
}

const defer = (() => {
  const ok = typeof requestAnimationFrame === 'function'
  return ok ? requestAnimationFrame : setImmediate
})()

describe('@luban/message', () => {

  describe('Message', () => {

    describe('#constructor()', () => {
      it('should require a single message type argument', () => {
        const msg = new Message('test')
        expect(msg).toBeInstanceOf(Message)
      })
    })

    describe('#type', () => {
      it('should return the message type', () => {
        const msg = new Message('test')
        expect(msg.type).toBe('test')
      })
    })

    describe('#isConflatable', () => {
      it('should be `false` by default', () => {
        const msg = new Message('test')
        expect(msg.isConflatable).toBe(false)
      })
    })

    describe('#conflate()', () => {
      it('should return `false` by default', () => {
        const msg = new Message('test')
        const other = new Message('test')
        expect(msg.conflate(other)).toBe(false)
      })
    })
  })

  describe('ConflatableMessage', () => {

    describe('#constructor()', () => {

      it('should require a single message type argument', () => {
        const msg = new ConflatableMessage('test')
        expect(msg).toBeInstanceOf(ConflatableMessage)
      })

      it('should extend the base `Message` class', () => {
        const msg = new ConflatableMessage('test')
        expect(msg).toBeInstanceOf(Message)
      })

    })

    describe('#isConflatable', () => {

      it('should be `true` by default', () => {
        const msg = new ConflatableMessage('test')
        expect(msg.isConflatable).toBe(true)
      })

    })

    describe('#conflate()', () => {

      it('should return `true` by default', () => {
        const msg = new ConflatableMessage('test')
        const other = new ConflatableMessage('test')
        expect(msg.conflate(other)).toBe(true)
      })

    })

  })

  describe('IMessageHandler', () => {

    describe('#processMessage()', () => {

      it('should process the messages sent to the handler', () => {
        const handler = new Handler()
        MessageLoop.sendMessage(handler, new Message('one'))
        MessageLoop.sendMessage(handler, new Message('two'))
        MessageLoop.sendMessage(handler, new Message('three'))
        expect(handler.messages).toEqual(['one', 'two', 'three'])
      })

    })

  })

  describe('IMessageHook', () => {

    describe('#messageHook()', () => {

      it('should be called for every message sent to a handler', () => {
        const handler = new Handler()
        const logHook = new LogHook()
        MessageLoop.installMessageHook(handler, logHook)
        MessageLoop.sendMessage(handler, new Message('one'))
        MessageLoop.sendMessage(handler, new Message('two'))
        MessageLoop.sendMessage(handler, new Message('three'))
        expect(handler.messages).toEqual(['one', 'two', 'three'])
        expect(logHook.messages).toEqual(['one', 'two', 'three'])
        expect(logHook.handlers.length).toBe(3)
        for (const i of [0, 1, 2]) {
          expect(logHook.handlers[i]).toBe(handler)
        }
      })

      it('should block messages which do not pass the hook', () => {
        const handler1 = new Handler()
        const handler2 = new Handler()
        const logHook = new LogHook()
        logHook.preventTypes = ['one', 'two']
        MessageLoop.installMessageHook(handler1, logHook)
        MessageLoop.installMessageHook(handler2, logHook)
        MessageLoop.sendMessage(handler1, new Message('one'))
        MessageLoop.sendMessage(handler2, new Message('one'))
        MessageLoop.sendMessage(handler1, new Message('two'))
        MessageLoop.sendMessage(handler2, new Message('two'))
        MessageLoop.sendMessage(handler1, new Message('three'))
        MessageLoop.sendMessage(handler2, new Message('three'))
        expect(handler1.messages).toEqual(['three'])
        expect(handler2.messages).toEqual(['three'])
        expect(logHook.messages).toEqual(['one', 'one', 'two', 'two', 'three', 'three'])
        expect(logHook.handlers.length).toBe(6)
        for (const i of [0, 2, 4]) {
          expect(logHook.handlers[i]).toBe(handler1)
          expect(logHook.handlers[i + 1]).toBe(handler2)
        }
      })

    })

  })

  describe('MessageLoop', () => {

    describe('sendMessage()', () => {

      it('should send a message to the handler to process immediately', () => {
        const handler = new Handler()
        expect(handler.messages).toEqual([])
        MessageLoop.sendMessage(handler, new Message('one'))
        expect(handler.messages).toEqual(['one'])
        MessageLoop.sendMessage(handler, new Message('two'))
        expect(handler.messages).toEqual(['one', 'two'])
      })

      it('should not conflate the message', () => {
        const handler = new Handler()
        const msg = new ConflatableMessage('one')
        MessageLoop.sendMessage(handler, msg)
        MessageLoop.sendMessage(handler, msg)
        MessageLoop.sendMessage(handler, msg)
        expect(handler.messages).toEqual(['one', 'one', 'one'])
      })

      it('should first run the message through the message hooks', () => {
        const handler = new Handler()
        const logHook1 = new LogHook()
        const logHook2 = new LogHook()
        logHook1.preventTypes = ['one']
        logHook2.preventTypes = ['two']
        MessageLoop.installMessageHook(handler, logHook1)
        MessageLoop.installMessageHook(handler, logHook2)
        MessageLoop.sendMessage(handler, new Message('one'))
        MessageLoop.sendMessage(handler, new Message('two'))
        MessageLoop.sendMessage(handler, new Message('three'))
        expect(handler.messages).toEqual(['three'])
        expect(logHook1.messages).toEqual(['one', 'three'])
        expect(logHook2.messages).toEqual(['one', 'two', 'three'])
      })

      it('should stop dispatching on the first `false` hook result', () => {
        const handler = new Handler()
        const logHook1 = new LogHook()
        const logHook2 = new LogHook()
        const logHook3 = new LogHook()
        logHook1.preventTypes = ['one']
        logHook2.preventTypes = ['one']
        logHook3.preventTypes = ['one']
        MessageLoop.installMessageHook(handler, logHook1)
        MessageLoop.installMessageHook(handler, logHook2)
        MessageLoop.installMessageHook(handler, logHook3)
        MessageLoop.sendMessage(handler, new Message('one'))
        MessageLoop.sendMessage(handler, new Message('two'))
        MessageLoop.sendMessage(handler, new Message('three'))
        expect(handler.messages).toEqual(['two', 'three'])
        expect(logHook1.messages).toEqual(['two', 'three'])
        expect(logHook2.messages).toEqual(['two', 'three'])
        expect(logHook3.messages).toEqual(['one', 'two', 'three'])
      })

      it('should ignore exceptions in handlers', () => {
        const handler = new BadHandler()
        const msg = new Message('one')
        expect(() => { MessageLoop.sendMessage(handler, msg) }).not.toThrow(Error)
      })

      it('should ignore exceptions in hooks', () => {
        const handler = new Handler()
        const msg = new Message('one')
        MessageLoop.installMessageHook(handler, (): boolean => { throw '' })
        expect(() => { MessageLoop.sendMessage(handler, msg) }).not.toThrow(Error)
      })

    })

    describe('postMessage()', () => {

      it('should post a message to the handler in the future', (done) => {
        const handler = new Handler()
        expect(handler.messages).toEqual([])
        MessageLoop.postMessage(handler, new Message('one'))
        MessageLoop.postMessage(handler, new Message('two'))
        MessageLoop.postMessage(handler, new Message('three'))
        expect(handler.messages).toEqual([])
        defer(() => {
          expect(handler.messages).toEqual(['one', 'two', 'three'])
          done()
        })
      })

      it('should conflate a conflatable message', (done) => {
        const handler = new Handler()
        const one = new Message('one')
        const two = new Message('two')
        const three = new ConflatableMessage('three')
        expect(handler.messages).toEqual([])
        MessageLoop.postMessage(handler, one)
        MessageLoop.postMessage(handler, two)
        MessageLoop.postMessage(handler, three)
        MessageLoop.postMessage(handler, three)
        MessageLoop.postMessage(handler, three)
        MessageLoop.postMessage(handler, three)
        expect(handler.messages).toEqual([])
        defer(() => {
          expect(handler.messages).toEqual(['one', 'two', 'three'])
          done()
        })
      })

      it('should not conflate a non-conflatable message', (done) => {
        const handler = new Handler()
        const cf1 = new Message('one')
        const cf2 = new ConflatableMessage('one')
        expect(handler.messages).toEqual([])
        MessageLoop.postMessage(handler, cf1)
        MessageLoop.postMessage(handler, cf2)
        expect(handler.messages).toEqual([])
        defer(() => {
          expect(handler.messages).toEqual(['one', 'one'])
          done()
        })
      })

      it('should not conflate messages for different handlers', (done) => {
        const h1 = new Handler()
        const h2 = new Handler()
        const msg = new ConflatableMessage('one')
        MessageLoop.postMessage(h1, msg)
        MessageLoop.postMessage(h2, msg)
        defer(() => {
          expect(h1.messages).toEqual(['one'])
          expect(h2.messages).toEqual(['one'])
          done()
        })
      })

      it('should obey global order of posted messages', (done) => {
        const handler1 = new GlobalHandler()
        const handler2 = new GlobalHandler()
        const handler3 = new GlobalHandler()
        MessageLoop.postMessage(handler3, new Message('one'))
        MessageLoop.postMessage(handler1, new Message('two'))
        MessageLoop.postMessage(handler2, new Message('three'))
        MessageLoop.postMessage(handler1, new Message('A'))
        MessageLoop.postMessage(handler2, new Message('B'))
        MessageLoop.postMessage(handler3, new Message('C'))
        expect(handler1.messages).toEqual([])
        expect(handler2.messages).toEqual([])
        expect(handler3.messages).toEqual([])
        expect(GlobalHandler.messages).toEqual([])
        defer(() => {
          expect(GlobalHandler.messages).toEqual(['one', 'two', 'three', 'A', 'B', 'C'])
          expect(handler1.messages).toEqual(['two', 'A'])
          expect(handler2.messages).toEqual(['three', 'B'])
          expect(handler3.messages).toEqual(['one', 'C'])
          done()
        })
      })
    })

    describe('installMessageHook()', () => {

      it('should install a hook for a handler', () => {
        const handler = new Handler()
        const logHook = new LogHook()
        logHook.preventTypes = ['one']
        MessageLoop.installMessageHook(handler, logHook)
        expect(handler.messages).toEqual([])
        MessageLoop.sendMessage(handler, new Message('one'))
        expect(handler.messages).toEqual([])
      })

      it('should install a new hook in front of any others', () => {
        const handler = new Handler()
        const logHook1 = new LogHook()
        const logHook2 = new LogHook()
        logHook1.preventTypes = ['one']
        logHook2.preventTypes = ['two']
        MessageLoop.installMessageHook(handler, logHook1)
        MessageLoop.sendMessage(handler, new Message('two'))
        MessageLoop.installMessageHook(handler, logHook2)
        MessageLoop.sendMessage(handler, new Message('two'))
        MessageLoop.sendMessage(handler, new Message('two'))
        MessageLoop.sendMessage(handler, new Message('three'))
        MessageLoop.sendMessage(handler, new Message('one'))
        expect(handler.messages).toEqual(['two', 'three'])
        expect(logHook1.messages).toEqual(['two', 'three', 'one'])
        expect(logHook2.messages).toEqual(['two', 'two', 'three', 'one'])
      })

      it('should not allow a hook to be installed multiple times', () => {
        const handler = new Handler()
        const logHook1 = new LogHook()
        const logHook2 = new LogHook()
        MessageLoop.installMessageHook(handler, logHook1)
        MessageLoop.installMessageHook(handler, logHook2)
        MessageLoop.installMessageHook(handler, logHook1)
        MessageLoop.sendMessage(handler, new Message('one'))
        MessageLoop.sendMessage(handler, new Message('two'))
        expect(handler.messages).toEqual(['one', 'two'])
        expect(logHook1.messages).toEqual(['one', 'two'])
        expect(logHook2.messages).toEqual(['one', 'two'])
      })

    })

    describe('removeMessageHook()', () => {

      it('should remove a previously installed hook', () => {
        const handler = new Handler()
        const logHook1 = new LogHook()
        const logHook2 = new LogHook()
        logHook1.preventTypes = ['one']
        logHook2.preventTypes = ['two']
        MessageLoop.sendMessage(handler, new Message('one'))
        MessageLoop.sendMessage(handler, new Message('two'))
        MessageLoop.installMessageHook(handler, logHook1)
        MessageLoop.installMessageHook(handler, logHook2)
        MessageLoop.sendMessage(handler, new Message('one'))
        MessageLoop.sendMessage(handler, new Message('two'))
        MessageLoop.removeMessageHook(handler, logHook2)
        MessageLoop.removeMessageHook(handler, logHook1)
        MessageLoop.sendMessage(handler, new Message('one'))
        MessageLoop.sendMessage(handler, new Message('two'))
        expect(handler.messages).toEqual(['one', 'two', 'one', 'two'])
        expect(logHook1.messages).toEqual(['one'])
        expect(logHook2.messages).toEqual(['one', 'two'])
      })

      it('should be no-op if the hook was not installed', () => {
        const handler = new Handler()
        const logHook = new LogHook()
        logHook.preventTypes = ['one']
        MessageLoop.sendMessage(handler, new Message('one'))
        MessageLoop.removeMessageHook(handler, logHook)
        MessageLoop.sendMessage(handler, new Message('one'))
        expect(handler.messages).toEqual(['one', 'one'])
      })

      it('should be no-op if the hook was not installed', () => {
        const handler = new Handler()
        const logHook1 = new LogHook()
        const logHook2 = new LogHook()
        logHook1.preventTypes = ['one']
        MessageLoop.installMessageHook(handler, logHook2)
        MessageLoop.sendMessage(handler, new Message('one'))
        MessageLoop.removeMessageHook(handler, logHook1)
        MessageLoop.sendMessage(handler, new Message('one'))
        expect(handler.messages).toEqual(['one', 'one'])
      })

      it('should be safe to remove a hook while dispatching', () => {
        const handler = new Handler()
        const logHook1 = new LogHook()
        const logHook2 = new LogHook()
        const logHook3 = new LogHook()
        const remHook: MessageHook = (handler: IMessageHandler, msg: Message) => {
          const result = logHook3.messageHook(handler, msg)
          MessageLoop.removeMessageHook(handler, remHook)
          return result
        }
        MessageLoop.installMessageHook(handler, logHook1)
        MessageLoop.installMessageHook(handler, remHook)
        MessageLoop.installMessageHook(handler, logHook2)
        MessageLoop.sendMessage(handler, new Message('one'))
        MessageLoop.sendMessage(handler, new Message('two'))
        MessageLoop.sendMessage(handler, new Message('three'))
        expect(handler.messages).toEqual(['one', 'two', 'three'])
        expect(logHook1.messages).toEqual(['one', 'two', 'three'])
        expect(logHook3.messages).toEqual(['one'])
        expect(logHook2.messages).toEqual(['one', 'two', 'three'])
      })

    })

    describe('clearData()', () => {

      it('should remove all messages associated with a handler', (done) => {
        const handler = new Handler()
        MessageLoop.postMessage(handler, new Message('one'))
        MessageLoop.postMessage(handler, new Message('one'))
        MessageLoop.clearData(handler)
        defer(() => {
          expect(handler.messages).toEqual([])
          done()
        })
      })

      it('should remove all messages and hooks data associated with a handler', (done) => {
        const h1 = new Handler()
        const h2 = new Handler()
        const logHook = new LogHook()
        MessageLoop.installMessageHook(h1, logHook)
        MessageLoop.postMessage(h1, new Message('one'))
        MessageLoop.postMessage(h2, new Message('one'))
        MessageLoop.postMessage(h1, new Message('two'))
        MessageLoop.postMessage(h2, new Message('two'))
        MessageLoop.postMessage(h1, new Message('three'))
        MessageLoop.postMessage(h2, new Message('three'))
        MessageLoop.clearData(h1)
        defer(() => {
          expect(h1.messages).toEqual([])
          expect(h2.messages).toEqual(['one', 'two', 'three'])
          expect(logHook.messages).toEqual([])
          done()
        })
      })

    })

    describe('flush()', () => {

      it('should immediately process all posted messages', () => {
        const h1 = new Handler()
        const h2 = new Handler()
        MessageLoop.postMessage(h1, new Message('one'))
        MessageLoop.postMessage(h2, new Message('one'))
        MessageLoop.postMessage(h1, new Message('two'))
        MessageLoop.postMessage(h2, new Message('two'))
        MessageLoop.postMessage(h1, new Message('three'))
        MessageLoop.postMessage(h2, new Message('three'))
        MessageLoop.flush()
        expect(h1.messages).toEqual(['one', 'two', 'three'])
        expect(h2.messages).toEqual(['one', 'two', 'three'])
      })

      it('should ignore recursive calls', () => {
        const h1 = new Handler()
        const h2 = new Handler()

        MessageLoop.installMessageHook(h1, (h, m) => {
          if (m.type === 'two') {
            MessageLoop.postMessage(h, new Message('four'))
            MessageLoop.postMessage(h, new Message('five'))
            MessageLoop.postMessage(h, new Message('six'))
            MessageLoop.flush()
          }
          return true
        })

        MessageLoop.postMessage(h1, new Message('one'))
        MessageLoop.postMessage(h2, new Message('one'))
        MessageLoop.postMessage(h1, new Message('two'))
        MessageLoop.postMessage(h2, new Message('two'))
        MessageLoop.postMessage(h1, new Message('three'))
        MessageLoop.postMessage(h2, new Message('three'))

        MessageLoop.flush()

        expect(h1.messages).toEqual(['one', 'two', 'three'])
        expect(h2.messages).toEqual(['one', 'two', 'three'])

        MessageLoop.flush()

        expect(h1.messages).toEqual(['one', 'two', 'three', 'four', 'five', 'six'])
        expect(h2.messages).toEqual(['one', 'two', 'three'])
      })

    })

    describe('getExceptionHandler()', () => {

      it('should default to an exception handler', () => {
        expect(MessageLoop.getExceptionHandler()).toBeInstanceOf(Function)
      })

    })

    describe('setExceptionHandler()', () => {

      afterEach(() => {
        MessageLoop.setExceptionHandler(console.error)
      })

      it('should set the exception handler', () => {
        const handler = (err: Error) => { console.error(err) }
        MessageLoop.setExceptionHandler(handler)
        expect(MessageLoop.getExceptionHandler()).toBe(handler)
      })

      it('should return the old exception handler', () => {
        const handler = (err: Error) => { console.error(err) }
        const old1 = MessageLoop.setExceptionHandler(handler)
        const old2 = MessageLoop.setExceptionHandler(old1)
        expect(old1).toBe(console.error)
        expect(old2).toBe(handler)
      })

      it('should invoke the exception handler on a message handler exception', () => {
        let called = false
        const handler = new BadHandler()
        MessageLoop.setExceptionHandler(() => { called = true })
        expect(called).toBe(false)
        MessageLoop.sendMessage(handler, new Message('foo'))
        expect(called).toBe(true)
      })

      it('should invoke the exception handler on a message hook exception', () => {
        let called = false
        const handler = new Handler()
        MessageLoop.setExceptionHandler(() => { called = true })
        expect(called).toBe(false)
        MessageLoop.sendMessage(handler, new Message('foo'))
        expect(called).toBe(false)
        MessageLoop.installMessageHook(handler, () => { throw 'error' })
        expect(called).toBe(false)
        MessageLoop.sendMessage(handler, new Message('foo'))
        expect(called).toBe(true)
      })

    })

  })

})

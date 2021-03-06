import { schedule } from '@luban/utils'
import { Signal } from '../src/index'

class TestObject {
  readonly one = new Signal<this, void>(this)
  readonly two = new Signal<this, number>(this)
  readonly three = new Signal<this, string[]>(this)
}

class ExtendedObject extends TestObject {
  notifyCount = 0
  onNotify(): void {
    this.notifyCount += 1
  }
}

class TestHandler {
  name = ''
  oneCount = 0
  twoValue = 0
  twoSender: TestObject | null = null

  onOne(): void {
    this.oneCount += 1
  }

  onTwo(sender: TestObject, args: number): void {
    this.twoSender = sender
    this.twoValue = args
  }

  onThree(sender: TestObject, args: string[]): void {
    args.push(this.name)
  }

  onThrow(): void {
    throw new Error()
  }
}

describe('@luban/signal', () => {
  describe('Signal', () => {
    describe('#sender', () => {
      it('should be the sender of the signal', () => {
        const obj = new TestObject()
        expect(obj.one.sender).toBe(obj)
        expect(obj.two.sender).toBe(obj)
        expect(obj.three.sender).toBe(obj)
      })

    })

    describe('#connect()', () => {

      it('should return true on success', () => {
        const obj = new TestObject()
        const handler = new TestHandler()
        const c1 = obj.one.connect(handler.onOne, handler)
        expect(c1).toBe(true)
      })

      it('should return false on failure', () => {
        const obj = new TestObject()
        const handler = new TestHandler()
        const c1 = obj.one.connect(handler.onOne, handler)
        const c2 = obj.one.connect(handler.onOne, handler)
        expect(c1).toBe(true)
        expect(c2).toBe(false)
      })

      it('should connect plain functions', () => {
        const obj = new TestObject()
        const handler = new TestHandler()
        const c1 = obj.one.connect(handler.onThrow)
        expect(c1).toBe(true)
      })

      it('should ignore duplicate connections', () => {
        const obj = new TestObject()
        const handler = new TestHandler()
        const c1 = obj.one.connect(handler.onOne, handler)
        const c2 = obj.one.connect(handler.onOne, handler)
        const c3 = obj.two.connect(handler.onTwo, handler)
        const c4 = obj.two.connect(handler.onTwo, handler)
        obj.one.emit(undefined)
        obj.two.emit(42)
        expect(c1).toBe(true)
        expect(c2).toBe(false)
        expect(c3).toBe(true)
        expect(c4).toBe(false)
        expect(handler.oneCount).toBe(1)
        expect(handler.twoValue).toBe(42)
      })

      it('should handle connect after disconnect and emit', () => {
        const obj = new TestObject()
        const handler = new TestHandler()
        const c1 = obj.one.connect(handler.onOne, handler)
        expect(c1).toBe(true)
        obj.one.disconnect(handler.onOne, handler)
        obj.one.emit(undefined)
        const c2 = obj.one.connect(handler.onOne, handler)
        expect(c2).toBe(true)
      })
    })

    describe('#disconnect()', () => {

      it('should return true on success', () => {
        const obj = new TestObject()
        const handler = new TestHandler()
        obj.one.connect(handler.onOne, handler)
        const d1 = obj.one.disconnect(handler.onOne, handler)
        expect(d1).toBe(true)
      })

      it('should return false on failure', () => {
        const obj = new TestObject()
        const handler = new TestHandler()
        const d1 = obj.one.disconnect(handler.onOne, handler)
        expect(d1).toBe(false)
      })

      it('should disconnect plain functions', () => {
        const obj = new TestObject()
        const handler = new TestHandler()
        obj.one.connect(handler.onThrow)
        expect(obj.one.disconnect(handler.onThrow)).toBe(true)
        expect(() => obj.one.emit(undefined)).not.toThrow(Error)
      })

      it('should disconnect a specific signal', () => {
        const obj1 = new TestObject()
        const obj2 = new TestObject()
        const obj3 = new TestObject()
        const handler1 = new TestHandler()
        const handler2 = new TestHandler()
        const handler3 = new TestHandler()

        obj1.one.connect(handler1.onOne, handler1)
        obj1.one.connect(handler3.onOne, handler3)

        obj2.one.connect(handler2.onOne, handler2)
        obj2.one.connect(handler3.onOne, handler3)

        obj3.one.connect(handler3.onOne, handler3)

        const d1 = obj1.one.disconnect(handler1.onOne, handler1)
        const d2 = obj1.one.disconnect(handler1.onOne, handler1)
        const d3 = obj2.one.disconnect(handler3.onOne, handler3)
        obj1.one.emit(undefined)
        obj2.one.emit(undefined)
        obj3.one.emit(undefined)
        expect(d1).toBe(true)
        expect(d2).toBe(false)
        expect(d3).toBe(true)
        expect(handler1.oneCount).toBe(0)
        expect(handler2.oneCount).toBe(1)
        expect(handler3.oneCount).toBe(2)
      })

      it('should handle disconnecting sender after receiver', () => {
        const obj = new TestObject()
        const handler = new TestHandler()
        obj.one.connect(handler.onOne, handler)
        Signal.disconnectReceiver(handler)
        Signal.disconnectSender(obj)
        obj.one.emit(undefined)
        expect(handler.oneCount).toBe(0)
      })

      it('should handle disconnecting receiver after sender', () => {
        const obj = new TestObject()
        const handler = new TestHandler()
        obj.one.connect(handler.onOne, handler)
        Signal.disconnectSender(obj)
        Signal.disconnectReceiver(handler)
        obj.one.emit(undefined)
        expect(handler.oneCount).toBe(0)
      })

    })

    describe('#emit()', () => {

      it('should be a no-op if there are no connection', () => {
        const obj = new TestObject()
        expect(() => { obj.one.emit(undefined) }).not.toThrow(Error)
      })

      it('should pass the sender and args to the handlers', () => {
        const obj = new TestObject()
        const handler1 = new TestHandler()
        const handler2 = new TestHandler()
        obj.two.connect(handler1.onTwo, handler1)
        obj.two.connect(handler2.onTwo, handler2)
        obj.two.emit(15)
        expect(handler1.twoSender).toBe(obj)
        expect(handler2.twoSender).toBe(obj)
        expect(handler1.twoValue).toBe(15)
        expect(handler2.twoValue).toBe(15)
      })

      it('should invoke handlers in connection order', () => {
        const obj = new TestObject()
        const handler1 = new TestHandler()
        const handler2 = new TestHandler()
        const handler3 = new TestHandler()
        handler1.name = 'foo'
        handler2.name = 'bar'
        handler3.name = 'baz'
        obj.three.connect(handler1.onThree, handler1)
        obj.one.connect(handler1.onOne, handler1)
        obj.three.connect(handler2.onThree, handler2)
        obj.three.connect(handler3.onThree, handler3)
        const names: string[] = []
        obj.three.emit(names)
        obj.one.emit(undefined)
        expect(names).toEqual(['foo', 'bar', 'baz'])
        expect(handler1.oneCount).toBe(1)
        expect(handler2.oneCount).toBe(0)
      })

      it('should catch any exceptions in handlers', () => {
        const obj = new TestObject()
        const handler1 = new TestHandler()
        const handler2 = new TestHandler()
        const handler3 = new TestHandler()
        handler1.name = 'foo'
        handler2.name = 'bar'
        handler3.name = 'baz'
        obj.three.connect(handler1.onThree, handler1)
        obj.three.connect(handler2.onThrow, handler2)
        obj.three.connect(handler3.onThree, handler3)

        let threw = false
        const names1: string[] = []
        try {
          obj.three.emit(names1)
        } catch (e) {
          threw = true
        }
        expect(threw).toBe(false)
        expect(names1).toEqual(['foo', 'baz'])
      })

      it('should not invoke signals added during emission', () => {
        const obj = new TestObject()
        const handler1 = new TestHandler()
        const handler2 = new TestHandler()
        const handler3 = new TestHandler()
        handler1.name = 'foo'
        handler2.name = 'bar'
        handler3.name = 'baz'
        const adder = {
          add: () => {
            obj.three.connect(handler3.onThree, handler3)
          },
        }
        obj.three.connect(handler1.onThree, handler1)
        obj.three.connect(handler2.onThree, handler2)
        obj.three.connect(adder.add, adder)
        const names1: string[] = []
        obj.three.emit(names1)
        obj.three.disconnect(adder.add, adder)
        const names2: string[] = []
        obj.three.emit(names2)
        expect(names1).toEqual(['foo', 'bar'])
        expect(names2).toEqual(['foo', 'bar', 'baz'])
      })

      it('should not invoke signals removed during emission', () => {
        const obj = new TestObject()
        const handler1 = new TestHandler()
        const handler2 = new TestHandler()
        const handler3 = new TestHandler()
        handler1.name = 'foo'
        handler2.name = 'bar'
        handler3.name = 'baz'
        const remover = {
          remove: () => {
            obj.three.disconnect(handler3.onThree, handler3)
          },
        }
        obj.three.connect(handler1.onThree, handler1)
        obj.three.connect(handler2.onThree, handler2)
        obj.three.connect(remover.remove, remover)
        obj.three.connect(handler3.onThree, handler3)
        const names: string[] = []
        obj.three.emit(names)
        expect(names).toEqual(['foo', 'bar'])
      })

    })

    describe('.disconnectBetween()', () => {

      it('should clear all connections between a sender and receiver', () => {
        const obj = new TestObject()
        const handler1 = new TestHandler()
        const handler2 = new TestHandler()

        obj.one.connect(handler1.onOne, handler1)
        obj.one.connect(handler2.onOne, handler2)

        obj.two.connect(handler1.onTwo, handler1)
        obj.two.connect(handler2.onTwo, handler2)

        obj.one.emit(undefined)

        expect(handler1.oneCount).toBe(1)
        expect(handler2.oneCount).toBe(1)

        obj.two.emit(42)
        expect(handler1.twoValue).toBe(42)
        expect(handler2.twoValue).toBe(42)

        Signal.disconnectBetween(obj, handler1)
        obj.one.emit(undefined)
        expect(handler1.oneCount).toBe(1)
        expect(handler2.oneCount).toBe(2)
        obj.two.emit(7)
        expect(handler1.twoValue).toBe(42)
        expect(handler2.twoValue).toBe(7)
      })

      it('should be a no-op if the sender or receiver is not connected', () => {
        const obj = new TestObject()
        const handler = new TestHandler()

        expect(() => Signal.disconnectBetween({}, {})).not.toThrow(Error)
        expect(() => Signal.disconnectBetween(obj, {})).not.toThrow(Error)
        expect(() => Signal.disconnectBetween({}, handler)).not.toThrow(Error)
        expect(() => Signal.disconnectBetween(obj, handler)).not.toThrow(Error)
      })

    })

    describe('.disconnectSender()', () => {

      it('should disconnect all signals from a specific sender', (done) => {
        const obj1 = new TestObject()
        const obj2 = new TestObject()
        const handler1 = new TestHandler()
        const handler2 = new TestHandler()
        obj1.one.connect(handler1.onOne, handler1)
        obj1.one.connect(handler2.onOne, handler2)
        obj2.one.connect(handler1.onOne, handler1)
        obj2.one.connect(handler2.onOne, handler2)
        Signal.disconnectSender(obj1)
        obj1.one.emit(undefined)
        obj2.one.emit(undefined)
        expect(handler1.oneCount).toBe(1)
        expect(handler2.oneCount).toBe(1)

        schedule(() => {
          done()
        })
      })

      it('should be a no-op if the sender is not connected', () => {
        expect(() => Signal.disconnectSender({})).not.toThrow(Error)
      })

    })

    describe('.disconnectReceiver()', () => {

      it('should disconnect all signals from a specific receiver', () => {
        const obj1 = new TestObject()
        const obj2 = new TestObject()
        const handler1 = new TestHandler()
        const handler2 = new TestHandler()
        obj1.one.connect(handler1.onOne, handler1)
        obj1.one.connect(handler2.onOne, handler2)
        obj2.one.connect(handler1.onOne, handler1)
        obj2.one.connect(handler2.onOne, handler2)
        obj2.two.connect(handler1.onTwo, handler1)
        obj2.two.connect(handler2.onTwo, handler2)
        Signal.disconnectReceiver(handler1)
        obj1.one.emit(undefined)
        obj2.one.emit(undefined)
        obj2.two.emit(42)
        expect(handler1.oneCount).toBe(0)
        expect(handler2.oneCount).toBe(2)
        expect(handler1.twoValue).toBe(0)
        expect(handler2.twoValue).toBe(42)
      })

      it('should be a no-op if the receiver is not connected', () => {
        expect(() => Signal.disconnectReceiver({})).not.toThrow(Error)
      })

    })

    describe('.disconnectAll()', () => {

      it('should clear all connections for an object', () => {
        let counter = 0
        const onCount = () => { counter += 1 }
        const ext1 = new ExtendedObject()
        const ext2 = new ExtendedObject()
        ext1.one.connect(ext1.onNotify, ext1)
        ext1.one.connect(ext2.onNotify, ext2)
        ext1.one.connect(onCount)
        ext2.one.connect(ext1.onNotify, ext1)
        ext2.one.connect(ext2.onNotify, ext2)
        ext2.one.connect(onCount)
        Signal.disconnectAll(ext1)
        ext1.one.emit(undefined)
        ext2.one.emit(undefined)
        expect(ext1.notifyCount).toBe(0)
        expect(ext2.notifyCount).toBe(1)
        expect(counter).toBe(1)
      })

    })

    describe('.clearData()', () => {

      it('should clear all signal data associated with an object', () => {
        let counter = 0
        const onCount = () => { counter += 1 }
        const ext1 = new ExtendedObject()
        const ext2 = new ExtendedObject()
        ext1.one.connect(ext1.onNotify, ext1)
        ext1.one.connect(ext2.onNotify, ext2)
        ext1.one.connect(onCount)
        ext2.one.connect(ext1.onNotify, ext1)
        ext2.one.connect(ext2.onNotify, ext2)
        ext2.one.connect(onCount)
        Signal.clearData(ext1)
        ext1.one.emit(undefined)
        ext2.one.emit(undefined)
        expect(ext1.notifyCount).toBe(0)
        expect(ext2.notifyCount).toBe(1)
        expect(counter).toBe(1)
      })

    })

    describe('.getExceptionHandler()', () => {

      it('should default to an exception handler', () => {
        expect(Signal.getExceptionHandler()).toBeInstanceOf(Function)
      })

    })

    describe('.setExceptionHandler()', () => {

      afterEach(() => {
        Signal.setExceptionHandler(console.error)
      })

      it('should set the exception handler', () => {
        const handler = (err: Error) => { console.error(err) }
        Signal.setExceptionHandler(handler)
        expect(Signal.getExceptionHandler()).toBe(handler)
      })

      it('should return the old exception handler', () => {
        const handler = (err: Error) => { console.error(err) }
        const old1 = Signal.setExceptionHandler(handler)
        const old2 = Signal.setExceptionHandler(old1)
        expect(old1).toBe(console.error)
        expect(old2).toBe(handler)
      })

      it('should invoke the exception handler on a slot exception', () => {
        let called = false
        const obj = new TestObject()
        const handler = new TestHandler()
        obj.one.connect(handler.onThrow, handler)
        Signal.setExceptionHandler(() => { called = true })
        expect(called).toBe(false)
        obj.one.emit(undefined)
        expect(called).toBe(true)
      })

    })

  })

})

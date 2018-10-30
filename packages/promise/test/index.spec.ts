import { PromiseDelegate } from '../src/index'

describe('@luban/promise', () => {
  describe('PromiseDelegate', () => {
    describe('#constructor()', () => {
      it('should create a new promise delegate', () => {
        const delegate = new PromiseDelegate<number>()
        expect(delegate).toBeInstanceOf(PromiseDelegate)
      })
    })

    describe('#promise', () => {
      it('should get the underlying promise', () => {
        const delegate = new PromiseDelegate<number>()
        expect(delegate.promise).toBeInstanceOf(Promise)
      })

    })

    describe('#resolve()', () => {
      it('should resolve the underlying promise', (done: () => void) => {
        const delegate = new PromiseDelegate<number>()
        delegate.promise.then((value: any) => {
          expect(value).toBe(1)
          done()
        })
        delegate.resolve(1)
      })

      it('should accept a promise to the value', (done: () => void) => {
        const delegate = new PromiseDelegate<number>()
        delegate.promise.then((value: any) => {
          expect(value).toBe(4)
          done()
        })
        delegate.resolve(Promise.resolve(4))
      })
    })

    describe('#reject()', () => {
      it('should reject the underlying promise', (done: () => void) => {
        const delegate = new PromiseDelegate<number>()
        delegate.promise.catch((reason: any) => {
          expect(reason).toBe('foo')
          done()
        })
        delegate.reject('foo')
      })
    })
  })
})

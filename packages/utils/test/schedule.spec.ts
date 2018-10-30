import { ScheduledCleaner, schedule, unschedule } from '../src/schedule'

describe('@luban/utils', () => {

  describe('ScheduledCleaner', () => {

    describe('#constructor()', () => {
      const cleaner = new ScheduledCleaner<number>(() => false)
      expect(cleaner).toBeInstanceOf(ScheduledCleaner)
    })

    describe('#clean()', () => {

      it('should clean special items', (done) => {
        const items = [0, 1, 2, 3, 4, 5]
        const fn = v => v % 2 === 0
        const cleaner = new ScheduledCleaner<number>(fn)

        cleaner.clean(items)
        schedule(() => {
          expect(items).toEqual([1, 3, 5])
          done()
        })
      })

      it('should cleanup many different items at once', (done) => {
        const items1 = [0, 1, 2, 3, 4, 5]
        const items2 = [7, 8, 9, 10, 11, 12]
        const fn = v => v % 2 === 0
        const cleaner = new ScheduledCleaner<number>(fn)

        cleaner.clean(items1)
        cleaner.clean(items2)

        schedule(() => {
          expect(items1).toEqual([1, 3, 5])
          expect(items2).toEqual([7, 9, 11])
          done()
        })
      })
    })

    describe('#cancel()', () => {

      it('should not cleanup when canceled', (done) => {
        const items = [0, 1, 2, 3, 4, 5]
        const fn = v => v % 2 === 0
        const cleaner = new ScheduledCleaner<number>(fn)

        cleaner.clean(items)
        cleaner.cancel()
        schedule(() => {
          expect(items).toEqual([0, 1, 2, 3, 4, 5])
          done()
        })
      })

      it('should no-op if there are no scheduler', () => {
        const fn = v => v % 2 === 0
        const cleaner = new ScheduledCleaner<number>(fn)

        expect(() => { cleaner.cancel() }).not.toThrow()
      })

    })

    describe('#flush()', () => {

      it('should do cleanup immediately when flush', () => {
        const items = [0, 1, 2, 3, 4, 5]
        const fn = v => v % 2 === 0
        const cleaner = new ScheduledCleaner<number>(fn)

        cleaner.clean(items)
        cleaner.flush()
        expect(items).toEqual([1, 3, 5])
      })

      it('should no-op when flush twice', () => {
        const items = [0, 1, 2, 3, 4, 5]
        const fn = v => v % 2 === 0
        const cleaner = new ScheduledCleaner<number>(fn)

        cleaner.clean(items)
        cleaner.flush()
        cleaner.flush()
        expect(items).toEqual([1, 3, 5])
      })
    })

  })

  describe('schedule', () => {

    describe('schedule()', () => {

      it('should schedule a callback', (done) => {
        let called = false
        schedule(() => {
          called = true
        })
        expect(called).toBe(false)
        schedule(() => {
          expect(called).toBe(true)
          done()
        })
      })

    })

    describe('schedule()', () => {

      it('should unschedule a callback', (done) => {
        let called = false
        const id = schedule(() => {
          called = true
        })
        expect(called).toBe(false)
        unschedule(id)
        schedule(() => {
          expect(called).toBe(false)
          done()
        })
      })

    })
  })

})

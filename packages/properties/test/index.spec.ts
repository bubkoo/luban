/* tslint:disable:object-shorthand-properties-first */

import { AttachedProperty } from '../src/index'

class Model {
  dummyValue = 42
}

describe('@luban/properties', () => {

  describe('AttachedProperty', () => {

    describe('#constructor()', () => {

      it('should accept a single options argument', () => {
        const p = new AttachedProperty<Model, number>({
          name: 'p',
          create: () => 42,
        })
        expect(p).toBeInstanceOf(AttachedProperty)
      })

    })

    describe('#name', () => {

      it('should be the name provided to the constructor', () => {
        const p = new AttachedProperty<Model, number>({
          name: 'p',
          create: () => 42,
        })
        expect(p.name).toBe('p')
      })

    })

    describe('#get()', () => {

      it('should return the current value of the property', () => {
        let tick = 42
        const create = () => {
          const ret = tick
          tick += 1
          return ret
        }
        const p1 = new AttachedProperty<Model, number>({ name: 'p1', create })
        const p2 = new AttachedProperty<Model, number>({ name: 'p2', create })
        const p3 = new AttachedProperty<Model, number>({ name: 'p3', create })
        const m1 = new Model()
        const m2 = new Model()
        const m3 = new Model()
        expect(p1.get(m1)).toBe(42)
        expect(p2.get(m1)).toBe(43)
        expect(p3.get(m1)).toBe(44)
        expect(p1.get(m2)).toBe(45)
        expect(p2.get(m2)).toBe(46)
        expect(p3.get(m2)).toBe(47)
        expect(p1.get(m3)).toBe(48)
        expect(p2.get(m3)).toBe(49)
        expect(p3.get(m3)).toBe(50)
      })

      it('should not invoke the enforce function', () => {
        let called = false
        const create = () => 0
        const enforce = (m: Model, v: number) => (called = true, v)
        const p1 = new AttachedProperty<Model, number>({ name: 'p1', create, enforce })
        const p2 = new AttachedProperty<Model, number>({ name: 'p2', create, enforce })
        const p3 = new AttachedProperty<Model, number>({ name: 'p3', create, enforce })
        const m1 = new Model()
        const m2 = new Model()
        const m3 = new Model()
        p1.get(m1)
        p2.get(m1)
        p3.get(m1)
        p1.get(m2)
        p2.get(m2)
        p3.get(m2)
        p1.get(m3)
        p2.get(m3)
        p3.get(m3)
        expect(called).toBe(false)
      })

      it('should not invoke the compare function', () => {
        let called = false
        const create = () => 0
        const compare = (v1: number, v2: number) => (called = true, v1 === v2)
        const p1 = new AttachedProperty<Model, number>({ name: 'p1', create, compare })
        const p2 = new AttachedProperty<Model, number>({ name: 'p2', create, compare })
        const p3 = new AttachedProperty<Model, number>({ name: 'p3', create, compare })
        const m1 = new Model()
        const m2 = new Model()
        const m3 = new Model()
        p1.get(m1)
        p2.get(m1)
        p3.get(m1)
        p1.get(m2)
        p2.get(m2)
        p3.get(m2)
        p1.get(m3)
        p2.get(m3)
        p3.get(m3)
        expect(called).toBe(false)
      })

      it('should not invoke the changed function', () => {
        let called = false
        const create = () => 0
        const changed = () => { called = true }
        const p1 = new AttachedProperty<Model, number>({ name: 'p1', create, changed })
        const p2 = new AttachedProperty<Model, number>({ name: 'p2', create, changed })
        const p3 = new AttachedProperty<Model, number>({ name: 'p3', create, changed })
        const m1 = new Model()
        const m2 = new Model()
        const m3 = new Model()
        p1.get(m1)
        p2.get(m1)
        p3.get(m1)
        p1.get(m2)
        p2.get(m2)
        p3.get(m2)
        p1.get(m3)
        p2.get(m3)
        p3.get(m3)
        expect(called).toBe(false)
      })

    })

    describe('#set()', () => {

      it('should set the current value of the property', () => {
        const create = () => 0
        const p1 = new AttachedProperty<Model, number>({ name: 'p1', create })
        const p2 = new AttachedProperty<Model, number>({ name: 'p2', create })
        const p3 = new AttachedProperty<Model, number>({ name: 'p3', create })
        const m1 = new Model()
        const m2 = new Model()
        const m3 = new Model()
        p1.set(m1, 1)
        p1.set(m2, 2)
        p1.set(m3, 3)
        p2.set(m1, 4)
        p2.set(m2, 5)
        p2.set(m3, 6)
        p3.set(m1, 7)
        p3.set(m2, 8)
        p3.set(m3, 9)
        expect(p1.get(m1)).toBe(1)
        expect(p1.get(m2)).toBe(2)
        expect(p1.get(m3)).toBe(3)
        expect(p2.get(m1)).toBe(4)
        expect(p2.get(m2)).toBe(5)
        expect(p2.get(m3)).toBe(6)
        expect(p3.get(m1)).toBe(7)
        expect(p3.get(m2)).toBe(8)
        expect(p3.get(m3)).toBe(9)
      })

      it('should invoke the changed function if the value changes', () => {
        const oldvals: number[] = []
        const newvals: number[] = []
        const changed = (m: Model, o: number, n: number) => {
          oldvals.push(o)
          newvals.push(n)
        }
        const create = () => 0
        const p1 = new AttachedProperty<Model, number>({ name: 'p1', create, changed })
        const p2 = new AttachedProperty<Model, number>({ name: 'p2', create, changed })
        const p3 = new AttachedProperty<Model, number>({ name: 'p3', create, changed })
        const m1 = new Model()
        const m2 = new Model()
        const m3 = new Model()
        p1.set(m1, 1)
        p1.set(m2, 2)
        p1.set(m3, 3)
        p2.set(m1, 4)
        p2.set(m2, 5)
        p2.set(m3, 6)
        p3.set(m1, 7)
        p3.set(m2, 8)
        p3.set(m3, 9)
        expect(oldvals).toEqual([0, 0, 0, 0, 0, 0, 0, 0, 0])
        expect(newvals).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9])
      })

      it('should invoke the enforce function on the new value', () => {
        const create = () => 0
        const enforce = (o: Model, v: number) => Math.max(0, v)
        const p = new AttachedProperty<Model, number>({ name: 'p', create, enforce })
        const m = new Model()
        p.set(m, -10)
        expect(p.get(m)).toBe(0)
        p.set(m, 10)
        expect(p.get(m)).toBe(10)
        p.set(m, -42)
        expect(p.get(m)).toBe(0)
        p.set(m, 42)
        expect(p.get(m)).toBe(42)
        p.set(m, 0)
        expect(p.get(m)).toBe(0)
      })

      it('should not invoke the compare function if there is no changed function', () => {
        let called = false
        const create = () => 0
        const compare = (v1: number, v2: number) => (called = true, v1 === v2)
        const p = new AttachedProperty<Model, number>({ name: 'p', create, compare })
        const m = new Model()
        p.set(m, 42)
        expect(called).toBe(false)
      })

      it('should invoke the compare function if there is a changed function', () => {
        let called = false
        const create = () => 0
        const changed = () => { }
        const compare = (v1: number, v2: number) => (called = true, v1 === v2)
        const p = new AttachedProperty<Model, number>({ name: 'p', create, compare, changed })
        const m = new Model()
        p.set(m, 42)
        expect(called).toBe(true)
      })

      it('should not invoke the changed function if the value does not change', () => {
        let called = false
        const create = () => 1
        const changed = () => { called = true }
        const compare = (v1: number, v2: number) => true
        const p1 = new AttachedProperty<Model, number>({ name: 'p1', create, changed })
        const p2 = new AttachedProperty<Model, number>({ name: 'p2', create, compare, changed })
        const m = new Model()
        p1.set(m, 1)
        p1.set(m, 1)
        p2.set(m, 1)
        p2.set(m, 2)
        p2.set(m, 3)
        p2.set(m, 4)
        expect(called).toBe(false)
      })

    })

    describe('#enforce()', () => {

      it('should enforce the current value of the property', () => {
        let min = 20
        let max = 50
        const create = () => 0
        const enforce = (m: Model, v: number) => Math.max(min, Math.min(v, max))
        const p = new AttachedProperty<Model, number>({ name: 'p', create, enforce })
        const m = new Model()
        p.set(m, 10)
        expect(p.get(m)).toBe(20)
        min = 30
        p.enforce(m)
        expect(p.get(m)).toBe(30)
        min = 10
        max = 20
        p.enforce(m)
        expect(p.get(m)).toBe(20)
      })

      it('should invoke the changed function if the value changes', () => {
        let called = false
        const create = () => 0
        const enforce = (m: Model, v: number) => Math.max(20, v)
        const changed = () => { called = true }
        const p = new AttachedProperty<Model, number>({ name: 'p', create, enforce, changed })
        const m = new Model()
        p.enforce(m)
        expect(called).toBe(true)
      })

      it('should use the default value as old value if value is not yet set', () => {
        let oldval = -1
        let newval = -1
        const create = () => 0
        const enforce = (m: Model, v: number) => Math.max(20, v)
        const changed = (m: Model, o: number, n: number) => { oldval = o; newval = n }
        const p = new AttachedProperty<Model, number>({ name: 'p', create, enforce, changed })
        const m = new Model()
        p.enforce(m)
        expect(oldval).toBe(0)
        expect(newval).toBe(20)
      })

      it('should not invoke the compare function if there is no changed function', () => {
        let called = false
        const create = () => 0
        const compare = (v1: number, v2: number) => (called = true, v1 === v2)
        const p = new AttachedProperty<Model, number>({ name: 'p', create, compare })
        const m = new Model()
        p.enforce(m)
        expect(called).toBe(false)
      })

      it('should invoke the compare function if there is a changed function', () => {
        let called = false
        const create = () => 0
        const changed = () => { }
        const compare = (v1: number, v2: number) => (called = true, v1 === v2)
        const p = new AttachedProperty<Model, number>({ name: 'p', create, compare, changed })
        const m = new Model()
        p.enforce(m)
        expect(called).toBe(true)
      })

      it('should not invoke the changed function if the value does not change', () => {
        let called = false
        const create = () => 0
        const changed = () => { called = true }
        const p = new AttachedProperty<Model, number>({ name: 'p', create, changed })
        const m = new Model()
        p.enforce(m)
        expect(called).toBe(false)
      })

    })

    describe('.clearData()', () => {

      it('should clear all property data for a property owner', () => {
        const create = () => 42

        const p1 = new AttachedProperty<Model, number>({ name: 'p1', create })
        const p2 = new AttachedProperty<Model, number>({ name: 'p2', create })
        const p3 = new AttachedProperty<Model, number>({ name: 'p3', create })
        const m1 = new Model()
        const m2 = new Model()
        const m3 = new Model()

        p1.set(m1, 1)
        p1.set(m2, 2)
        p1.set(m3, 3)
        p2.set(m1, 4)
        p2.set(m2, 5)
        p2.set(m3, 6)
        p3.set(m1, 7)
        p3.set(m2, 8)
        p3.set(m3, 9)

        expect(p1.get(m1)).toBe(1)
        expect(p1.get(m2)).toBe(2)
        expect(p1.get(m3)).toBe(3)
        expect(p2.get(m1)).toBe(4)
        expect(p2.get(m2)).toBe(5)
        expect(p2.get(m3)).toBe(6)
        expect(p3.get(m1)).toBe(7)
        expect(p3.get(m2)).toBe(8)
        expect(p3.get(m3)).toBe(9)

        AttachedProperty.clearData(m1)

        expect(p1.get(m1)).toBe(42)
        expect(p1.get(m2)).toBe(2)
        expect(p1.get(m3)).toBe(3)
        expect(p2.get(m1)).toBe(42)
        expect(p2.get(m2)).toBe(5)
        expect(p2.get(m3)).toBe(6)
        expect(p3.get(m1)).toBe(42)
        expect(p3.get(m2)).toBe(8)
        expect(p3.get(m3)).toBe(9)

        AttachedProperty.clearData(m2)

        expect(p1.get(m1)).toBe(42)
        expect(p1.get(m2)).toBe(42)
        expect(p1.get(m3)).toBe(3)
        expect(p2.get(m1)).toBe(42)
        expect(p2.get(m2)).toBe(42)
        expect(p2.get(m3)).toBe(6)
        expect(p3.get(m1)).toBe(42)
        expect(p3.get(m2)).toBe(42)
        expect(p3.get(m3)).toBe(9)

        AttachedProperty.clearData(m3)

        expect(p1.get(m1)).toBe(42)
        expect(p1.get(m2)).toBe(42)
        expect(p1.get(m3)).toBe(42)
        expect(p2.get(m1)).toBe(42)
        expect(p2.get(m2)).toBe(42)
        expect(p2.get(m3)).toBe(42)
        expect(p3.get(m1)).toBe(42)
        expect(p3.get(m2)).toBe(42)
        expect(p3.get(m3)).toBe(42)
      })

    })

  })

})

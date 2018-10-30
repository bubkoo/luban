import { find, max, min, minmax } from '../src/find'

describe('@luban/struct', () => {

  describe('find()', () => {

    it('should find the first matching value', () => {
      interface IAnimal { species: string, name: string }
      const isCat = (value: IAnimal) => value.species === 'cat'
      const data: IAnimal[] = [
        { species: 'dog', name: 'spot' },
        { species: 'cat', name: 'fluffy' },
        { species: 'alligator', name: 'pocho' },
      ]
      expect(find(data, isCat)).toBe(data[1])
    })

    it('should return `undefined` if there is no matching value', () => {
      interface IAnimal { species: string, name: string }
      const isRacoon = (value: IAnimal) => value.species === 'racoon'
      const data: IAnimal[] = [
        { species: 'dog', name: 'spot' },
        { species: 'cat', name: 'fluffy' },
        { species: 'alligator', name: 'pocho' },
      ]
      expect(find(data, isRacoon)).toBe(undefined)
    })

  })

  describe('min()', () => {

    it('should return the minimum value in an iterable', () => {
      interface IScore { value: number }
      const data: IScore[] = [
        { value: 19 },
        { value: -2 },
        { value: 0 },
        { value: 42 },
      ]
      const score = min(data, (a, b) => a.value - b.value)
      expect(score).toBe(data[1])
    })

    it('should not invoke the comparator for only one value', () => {
      interface IScore { value: number }
      const data: IScore[] = [
        { value: 19 },
      ]
      let called = false
      const score = min(data, (a, b) => {
        called = true
        return a.value - b.value
      })
      expect(score).toBe(data[0])
      expect(called).toBe(false)
    })

    it('should return `undefined` if the iterable is empty', () => {
      interface IScore { value: number }
      const data: IScore[] = []
      const score = min(data, (a, b) => a.value - b.value)
      expect(score).toBe(undefined)
    })

  })

  describe('max()', () => {

    it('should return the maximum value in an iterable', () => {
      interface IScore { value: number }
      const data: IScore[] = [
        { value: 19 },
        { value: -2 },
        { value: 0 },
        { value: 42 },
      ]
      const score = max(data, (a, b) => a.value - b.value)
      expect(score).toBe(data[3])
    })

    it('should not invoke the comparator for only one value', () => {
      interface IScore { value: number }
      const data: IScore[] = [
        { value: 19 },
      ]
      let called = false
      const score = max(data, (a, b) => {
        called = true
        return a.value - b.value
      })
      expect(score).toBe(data[0])
      expect(called).toBe(false)
    })

    it('should return `undefined` if the iterable is empty', () => {
      interface IScore { value: number }
      const data: IScore[] = []
      const score = max(data, (a, b) => a.value - b.value)
      expect(score).toBe(undefined)
    })

  })

  describe('minmax()', () => {

    it('should return the minimum and maximum value in an iterable', () => {
      interface IScore { value: number }
      const data: IScore[] = [
        { value: 19 },
        { value: -2 },
        { value: 0 },
        { value: 42 },
      ]
      const [min, max] = minmax(data, (a, b) => a.value - b.value)!
      expect(min).toBe(data[1])
      expect(max).toBe(data[3])
    })

    it('should not invoke the comparator for only one value', () => {
      interface IScore { value: number }
      const data: IScore[] = [
        { value: 19 },
      ]
      let called = false
      const [min, max] = minmax(data, (a, b) => {
        called = true
        return a.value - b.value
      })!
      expect(min).toBe(data[0])
      expect(max).toBe(data[0])
      expect(called).toBe(false)
    })

    it('should return `undefined` if the iterable is empty', () => {
      interface IScore { value: number }
      const data: IScore[] = []
      const score = minmax(data, (a, b) => a.value - b.value)
      expect(score).toBe(undefined)
    })
  })
})

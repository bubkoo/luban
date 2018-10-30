import { ArrayExt } from '../src/array'

describe('@phosphor/algorithm', () => {

  describe('ArrayExt', () => {

    describe('firstIndexOf()', () => {

      it('should find the index of the first matching value', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.firstIndexOf(data, 'one')
        expect(i).toBe(0)
      })

      it('should return `-1` if there is no matching value', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.firstIndexOf(data, 'red')
        expect(i).toBe(-1)
      })

      it('should return `-1` if the array is empty', () => {
        const data: string[] = []
        const i = ArrayExt.firstIndexOf(data, 'one')
        expect(i).toBe(-1)
      })

      it('should support searching from a start index', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.firstIndexOf(data, 'one', 1)
        expect(i).toBe(4)

        const j = ArrayExt.firstIndexOf(data, 'two', 1)
        expect(j).toBe(1)
      })

      it('should support a negative start index', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.firstIndexOf(data, 'one', -1)
        expect(i).toBe(4)
      })

      it('should support searching within a range', () => {
        const data = ['one', 'two', 'one', 'four', 'one']
        const i = ArrayExt.firstIndexOf(data, 'one', 1, 3)
        expect(i).toBe(2)
      })

      it('should support a negative stop index', () => {
        const data = ['one', 'two', 'one', 'four', 'one']
        const i = ArrayExt.firstIndexOf(data, 'one', 1, -4)
        expect(i).toBe(-1)
      })

      it('should wrap around if stop < start', () => {
        const data = ['one', 'two', 'one', 'four', 'one']
        const i = ArrayExt.firstIndexOf(data, 'two', 3, 2)
        expect(i).toBe(1)
      })

    })

    describe('lastIndexOf()', () => {

      it('should find the index of the last matching value', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.lastIndexOf(data, 'one')
        expect(i).toBe(4)
      })

      it('should return `-1` if there is no matching value', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.lastIndexOf(data, 'red')
        expect(i).toBe(-1)
      })

      it('should return `-1` if the array is empty', () => {
        const data: string[] = []
        const i = ArrayExt.lastIndexOf(data, 'one')
        expect(i).toBe(-1)
      })

      it('should support searching from a start index', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.lastIndexOf(data, 'one', 2)
        expect(i).toBe(0)
      })

      it('should support a negative start index', () => {
        const data = ['one', 'two', 'one', 'four', 'one']
        const i = ArrayExt.lastIndexOf(data, 'one', -2)
        expect(i).toBe(2)
      })

      it('should support searching within a range', () => {
        const data = ['one', 'two', 'one', 'four', 'one']
        const i = ArrayExt.lastIndexOf(data, 'one', 3, 1)
        expect(i).toBe(2)
      })

      it('should support a negative stop index', () => {
        const data = ['one', 'two', 'one', 'four', 'one']
        const i = ArrayExt.lastIndexOf(data, 'one', 1, -4)
        expect(i).toBe(-1)
      })

      it('should wrap around if start < stop', () => {
        const data = ['one', 'two', 'one', 'four', 'one']
        const i = ArrayExt.lastIndexOf(data, 'four', 2, 3)
        expect(i).toBe(3)
      })

    })

    describe('findFirstIndex()', () => {

      it('should find the index of the first matching value', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findFirstIndex(data, v => v % 2 === 0)
        expect(i).toBe(1)
      })

      it('should return `-1` if there is no matching value', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findFirstIndex(data, v => v % 7 === 0)
        expect(i).toBe(-1)
      })

      it('should return `-1` if the array is empty', () => {
        const data: number[] = []
        const i = ArrayExt.findFirstIndex(data, v => v % 2 === 0)
        expect(i).toBe(-1)
      })

      it('should support searching from a start index', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findFirstIndex(data, v => v % 2 === 0, 2)
        expect(i).toBe(3)
      })

      it('should support a negative start index', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findFirstIndex(data, v => v % 2 === 0, -3)
        expect(i).toBe(3)
      })

      it('should support searching within a range', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findFirstIndex(data, v => v % 2 === 0, 2, 4)
        expect(i).toBe(3)
      })

      it('should support a negative stop index', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findFirstIndex(data, v => v % 2 === 0, 2, -2)
        expect(i).toBe(3)
      })

      it('should wrap around if stop < start', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findFirstIndex(data, v => v % 2 === 0, 4, 2)
        expect(i).toBe(1)
      })

    })

    describe('findLastIndex()', () => {

      it('should find the index of the last matching value', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findLastIndex(data, v => v % 2 === 0)
        expect(i).toBe(3)
      })

      it('should return `-1` if there is no matching value', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findLastIndex(data, v => v % 7 === 0)
        expect(i).toBe(-1)
      })

      it('should return `-1` if the array is empty', () => {
        const data: number[] = []
        const i = ArrayExt.findLastIndex(data, v => v % 2 === 0)
        expect(i).toBe(-1)
      })

      it('should support searching from a start index', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findLastIndex(data, v => v % 2 === 0, 2)
        expect(i).toBe(1)
      })

      it('should support a negative start index', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findLastIndex(data, v => v % 2 === 0, -3)
        expect(i).toBe(1)
      })

      it('should support searching within a range', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findLastIndex(data, v => v % 2 === 0, 4, 2)
        expect(i).toBe(3)
      })

      it('should support a negative stop index', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findLastIndex(data, v => v % 2 === 0, -3, 0)
        expect(i).toBe(1)
      })

      it('should wrap around if start < stop', () => {
        const data = [1, 2, 3, 4, 5]
        const i = ArrayExt.findLastIndex(data, v => v % 2 === 0, 0, 2)
        expect(i).toBe(3)
      })

    })

    describe('findFirstValue()', () => {

      it('should find the index of the first matching value', () => {
        const data = ['apple', 'bottle', 'cat', 'dog', 'egg', 'blue']
        const i = ArrayExt.findFirstValue(data, v => v[0] === 'b')
        expect(i).toBe('bottle')
      })

      it('should return `undefined` if there is no matching value', () => {
        const data = ['apple', 'bottle', 'cat', 'dog', 'egg', 'fish']
        const i = ArrayExt.findFirstValue(data, v => v[0] === 'z')
        expect(i).toBe(undefined)
      })

      it('should return `undefined` if the array is empty', () => {
        const data: string[] = []
        const i = ArrayExt.findFirstValue(data, v => v[0] === 'b')
        expect(i).toBe(undefined)
      })

      it('should support searching from a start index', () => {
        const data = ['apple', 'eagle', 'cat', 'dog', 'egg', 'fish']
        const i = ArrayExt.findFirstValue(data, v => v[0] === 'e', 2)
        expect(i).toBe('egg')
      })

      it('should support a negative start index', () => {
        const data = ['apple', 'eagle', 'cat', 'dog', 'egg', 'fish']
        const i = ArrayExt.findFirstValue(data, v => v[0] === 'e', -3)
        expect(i).toBe('egg')
      })

      it('should support searching within a range', () => {
        const data = ['dark', 'bottle', 'cat', 'dog', 'egg', 'dodge']
        const i = ArrayExt.findFirstValue(data, v => v[0] === 'd', 2, 4)
        expect(i).toBe('dog')
      })

      it('should support a negative stop index', () => {
        const data = ['dark', 'bottle', 'cat', 'dog', 'egg', 'dodge']
        const i = ArrayExt.findFirstValue(data, v => v[0] === 'd', 2, -2)
        expect(i).toBe('dog')
      })

      it('should wrap around if stop < start', () => {
        const data = ['dark', 'bottle', 'cat', 'dog', 'egg', 'dodge']
        const i = ArrayExt.findFirstValue(data, v => v[0] === 'b', 4, 2)
        expect(i).toBe('bottle')
      })

    })

    describe('findLastValue()', () => {

      it('should find the index of the last matching value', () => {
        const data = ['apple', 'bottle', 'cat', 'dog', 'egg', 'blue']
        const i = ArrayExt.findLastValue(data, v => v[0] === 'b')
        expect(i).toBe('blue')
      })

      it('should return `undefined` if there is no matching value', () => {
        const data = ['apple', 'bottle', 'cat', 'dog', 'egg', 'fish']
        const i = ArrayExt.findLastValue(data, v => v[0] === 'z')
        expect(i).toBe(undefined)
      })

      it('should return `undefined` if the array is empty', () => {
        const data: string[] = []
        const i = ArrayExt.findLastValue(data, v => v[0] === 'b')
        expect(i).toBe(undefined)
      })

      it('should support searching from a start index', () => {
        const data = ['apple', 'eagle', 'cat', 'dog', 'egg', 'fish']
        const i = ArrayExt.findLastValue(data, v => v[0] === 'e', 2)
        expect(i).toBe('eagle')
      })

      it('should support a negative start index', () => {
        const data = ['apple', 'eagle', 'cat', 'dog', 'egg', 'fish']
        const i = ArrayExt.findLastValue(data, v => v[0] === 'e', -3)
        expect(i).toBe('eagle')
      })

      it('should support searching within a range', () => {
        const data = ['dark', 'bottle', 'cat', 'dog', 'egg', 'dodge']
        const i = ArrayExt.findLastValue(data, v => v[0] === 'd', 4, 2)
        expect(i).toBe('dog')
      })

      it('should support a negative stop index', () => {
        const data = ['dark', 'bottle', 'cat', 'dog', 'egg', 'dodge']
        const i = ArrayExt.findLastValue(data, v => v[0] === 'd', 4, -4)
        expect(i).toBe('dog')
      })

      it('should wrap around if start < stop', () => {
        const data = ['dark', 'bottle', 'cat', 'dog', 'egg', 'dodge']
        const i = ArrayExt.findLastValue(data, v => v[0] === 'e', 2, 4)
        expect(i).toBe('egg')
      })

    })

    describe('lowerBound()', () => {

      it('should return the index of the first element `>=` a value', () => {
        const data = [1, 2, 2, 3, 3, 4, 5, 5]
        const cmp = (a: number, b: number) => a - b
        const r1 = ArrayExt.lowerBound(data, -5, cmp)
        const r2 = ArrayExt.lowerBound(data, 0, cmp)
        const r3 = ArrayExt.lowerBound(data, 3, cmp)
        const r4 = ArrayExt.lowerBound(data, 5, cmp)
        expect(r1).toBe(0)
        expect(r2).toBe(0)
        expect(r3).toBe(3)
        expect(r4).toBe(6)
      })

      it('should return `length` if there is no matching value', () => {
        const data = [1, 2, 2, 3, 3, 4, 5, 5]
        const cmp = (a: number, b: number) => a - b
        const r1 = ArrayExt.lowerBound(data, 9, cmp)
        const r2 = ArrayExt.lowerBound(data, 19, cmp)
        const r3 = ArrayExt.lowerBound(data, 29, cmp)
        expect(r1).toBe(8)
        expect(r2).toBe(8)
        expect(r3).toBe(8)
      })

      it('should return `0` if the array is empty', () => {
        const data: number[] = []
        const cmp = (a: number, b: number) => a - b
        const i = ArrayExt.lowerBound(data, 0, cmp)
        expect(i).toBe(0)
      })

      it('should support searching a range', () => {
        const data = [4, 5, 6, 4, 5, 6]
        const cmp = (a: number, b: number) => a - b
        const r = ArrayExt.lowerBound(data, 5, cmp, 3, 5)
        expect(r).toBe(4)
      })

    })

    describe('upperBound()', () => {

      it('should return the index of the first element `>` a value', () => {
        const data = [1, 2, 2, 3, 3, 4, 5, 5]
        const cmp = (a: number, b: number) => a - b
        const r1 = ArrayExt.upperBound(data, -5, cmp)
        const r2 = ArrayExt.upperBound(data, 0, cmp)
        const r3 = ArrayExt.upperBound(data, 2, cmp)
        const r4 = ArrayExt.upperBound(data, 3, cmp)
        expect(r1).toBe(0)
        expect(r2).toBe(0)
        expect(r3).toBe(3)
        expect(r4).toBe(5)
      })

      it('should return `length` if there is no matching value', () => {
        const data = [1, 2, 2, 3, 3, 4, 5, 5]
        const cmp = (a: number, b: number) => a - b
        const r1 = ArrayExt.upperBound(data, 9, cmp)
        const r2 = ArrayExt.upperBound(data, 19, cmp)
        const r3 = ArrayExt.upperBound(data, 29, cmp)
        expect(r1).toBe(8)
        expect(r2).toBe(8)
        expect(r3).toBe(8)
      })

      it('should return `0` if the array is empty', () => {
        const data: number[] = []
        const cmp = (a: number, b: number) => a - b
        const i = ArrayExt.upperBound(data, 0, cmp)
        expect(i).toBe(0)
      })

      it('should support searching a range', () => {
        const data = [4, 5, 6, 4, 5, 6]
        const cmp = (a: number, b: number) => a - b
        const r = ArrayExt.upperBound(data, 5, cmp, 3, 5)
        expect(r).toBe(5)
      })

    })

    describe('move()', () => {

      it('should move an element from one index to another', () => {
        const data = [1, 2, 3, 4, 5]
        ArrayExt.move(data, 1, 3)
        ArrayExt.move(data, 4, 0)
        expect(data).toEqual([5, 1, 3, 4, 2])
      })

      it('should be a no-op for equal indices', () => {
        const data = [1, 2, 3, 4, 5]
        ArrayExt.move(data, 2, 2)
        expect(data).toEqual([1, 2, 3, 4, 5])
      })

      it('should be a no-op for an array length `<= 1`', () => {
        const data1 = [1]
        const data2: any[] = []
        ArrayExt.move(data1, 0, 0)
        ArrayExt.move(data2, 0, 0)
        expect(data1).toEqual([1])
        expect(data2).toEqual([])
      })

    })

    describe('reverse()', () => {

      it('should reverse an array in-place', () => {
        const data = [1, 2, 3, 4, 5]
        ArrayExt.reverse(data)
        expect(data).toEqual([5, 4, 3, 2, 1])
      })

      it('should support reversing a section of an array', () => {
        const data = [1, 2, 3, 4, 5]
        ArrayExt.reverse(data, 2)
        expect(data).toEqual([1, 2, 5, 4, 3])
        ArrayExt.reverse(data, 0, 3)
        expect(data).toEqual([4, 5, 2, 1, 3])
      })

      it('should be a no-op if `start >= stop`', () => {
        const data = [1, 2, 3, 4, 5]
        ArrayExt.reverse(data, 2, 2)
        expect(data).toEqual([1, 2, 3, 4, 5])
        ArrayExt.reverse(data, 4, 2)
        expect(data).toEqual([1, 2, 3, 4, 5])
      })

      it('should be a no-op for an array length `<= 1`', () => {
        const data1 = [1]
        const data2: any[] = []
        ArrayExt.reverse(data1)
        ArrayExt.reverse(data2)
        expect(data1).toEqual([1])
        expect(data2).toEqual([])
      })

    })

    describe('rotate()', () => {

      it('should rotate the elements left by a positive delta', () => {
        const data = [1, 2, 3, 4, 5]
        ArrayExt.rotate(data, 2)
        expect(data).toEqual([3, 4, 5, 1, 2])
        ArrayExt.rotate(data, 12)
        expect(data).toEqual([5, 1, 2, 3, 4])
      })

      it('should rotate the elements right by a negative delta', () => {
        const data = [1, 2, 3, 4, 5]
        ArrayExt.rotate(data, -2)
        expect(data).toEqual([4, 5, 1, 2, 3])
        ArrayExt.rotate(data, -12)
        expect(data).toEqual([2, 3, 4, 5, 1])
      })

      it('should be a no-op for a zero delta', () => {
        const data = [1, 2, 3, 4, 5]
        ArrayExt.rotate(data, 0)
        expect(data).toEqual([1, 2, 3, 4, 5])
      })

      it('should be a no-op for a array length `<= 1`', () => {
        const data1 = [1]
        const data2: any[] = []
        ArrayExt.rotate(data1, 1)
        ArrayExt.rotate(data2, 1)
        expect(data1).toEqual([1])
        expect(data2).toEqual([])
      })

      it('should rotate a section of the array', () => {
        const data = [1, 2, 3, 4, 5]
        ArrayExt.rotate(data, 2, 1, 3)
        expect(data).toEqual([1, 4, 2, 3, 5])
        ArrayExt.rotate(data, -2, 0, 3)
        expect(data).toEqual([2, 3, 1, 4, 5])
      })

      it('should be a no-op if `start >= stop`', () => {
        const data = [1, 2, 3, 4, 5]
        ArrayExt.rotate(data, 2, 5, 4)
        expect(data).toEqual([1, 2, 3, 4, 5])
      })

    })

    describe('fill()', () => {

      it('should fill an array with a static value', () => {
        const data = [0, 0, 0, 0, 0]
        ArrayExt.fill(data, 1)
        expect(data).toEqual([1, 1, 1, 1, 1])
      })

      it('should fill a section of the array', () => {
        const data = [0, 0, 0, 0, 0]
        ArrayExt.fill(data, 1, 1, 3)
        expect(data).toEqual([0, 1, 1, 1, 0])
      })

      it('should wrap around if `stop < start`', () => {
        const data = [0, 0, 0, 0, 0]
        ArrayExt.fill(data, 1, 3, 1)
        expect(data).toEqual([1, 1, 0, 1, 1])
      })

    })

    describe('insert()', () => {

      it('should insert a value at the specified index', () => {
        const data: number[] = []
        ArrayExt.insert(data, 0, 9)
        expect(data).toEqual([9])
        ArrayExt.insert(data, 0, 8)
        expect(data).toEqual([8, 9])
        ArrayExt.insert(data, 0, 7)
        expect(data).toEqual([7, 8, 9])
        ArrayExt.insert(data, -2, 6)
        expect(data).toEqual([7, 6, 8, 9])
        ArrayExt.insert(data, 2, 5)
        expect(data).toEqual([7, 6, 5, 8, 9])
        ArrayExt.insert(data, -5, 4)
        expect(data).toEqual([4, 7, 6, 5, 8, 9])
      })

      it('should clamp the index to the bounds of the vector', () => {
        const data: number[] = []
        ArrayExt.insert(data, -10, 9)
        expect(data).toEqual([9])
        ArrayExt.insert(data, -5, 8)
        expect(data).toEqual([8, 9])
        ArrayExt.insert(data, -1, 7)
        expect(data).toEqual([8, 7, 9])
        ArrayExt.insert(data, 13, 6)
        expect(data).toEqual([8, 7, 9, 6])
        ArrayExt.insert(data, 8, 4)
        expect(data).toEqual([8, 7, 9, 6, 4])
      })

    })

    describe('removeAt()', () => {

      it('should remove the value at a specified index', () => {
        const data = [7, 4, 8, 5, 9, 6]
        expect(ArrayExt.removeAt(data, 1)).toBe(4)
        expect(data).toEqual([7, 8, 5, 9, 6])
        expect(ArrayExt.removeAt(data, 2)).toBe(5)
        expect(data).toEqual([7, 8, 9, 6])
        expect(ArrayExt.removeAt(data, -2)).toBe(9)
        expect(data).toEqual([7, 8, 6])
        expect(ArrayExt.removeAt(data, 0)).toBe(7)
        expect(data).toEqual([8, 6])
        expect(ArrayExt.removeAt(data, -1)).toBe(6)
        expect(data).toEqual([8])
        expect(ArrayExt.removeAt(data, 0)).toBe(8)
        expect(data).toEqual([])
      })

      it('should return `undefined` if the index is out of range', () => {
        const data = [7, 4, 8, 5, 9, 6]
        expect(ArrayExt.removeAt(data, 10)).toBe(undefined)
        expect(data).toEqual([7, 4, 8, 5, 9, 6])
      })

    })

    describe('removeFirstOf()', () => {

      it('should remove the first occurrence of a value', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeFirstOf(data, 'one')
        expect(i).toBe(0)
        expect(data).toEqual(['two', 'three', 'four', 'one'])
      })

      it('should return `-1` if there is no matching value', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeFirstOf(data, 'five')
        expect(i).toBe(-1)
        expect(data).toEqual(['one', 'two', 'three', 'four', 'one'])
      })

      it('should return `-1` if the array is empty', () => {
        const data: string[] = []
        const i = ArrayExt.removeFirstOf(data, 'five')
        expect(i).toBe(-1)
        expect(data).toEqual([])
      })

      it('should support searching from a start index', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeFirstOf(data, 'one', 2)
        expect(i).toBe(4)
        expect(data).toEqual(['one', 'two', 'three', 'four'])
      })

      it('should support a negative start index', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeFirstOf(data, 'one', -2)
        expect(i).toBe(4)
        expect(data).toEqual(['one', 'two', 'three', 'four'])
      })

      it('should support searching within a range', () => {
        const data = ['three', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeFirstOf(data, 'three', 1, 3)
        expect(i).toBe(2)
        expect(data).toEqual(['three', 'two', 'four', 'one'])
      })

      it('should support a negative stop index', () => {
        const data = ['three', 'two', 'three', 'four', 'three']
        const i = ArrayExt.removeFirstOf(data, 'three', 1, -2)
        expect(i).toBe(2)
        expect(data).toEqual(['three', 'two', 'four', 'three'])
      })

      it('should wrap around if stop < start', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeFirstOf(data, 'two', 3, 1)
        expect(i).toBe(1)
        expect(data).toEqual(['one', 'three', 'four', 'one'])
      })

    })

    describe('removeLastOf()', () => {

      it('should remove the last occurrence of a value', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeLastOf(data, 'one')
        expect(i).toBe(4)
        expect(data).toEqual(['one', 'two', 'three', 'four'])
      })

      it('should return `-1` if there is no matching value', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeLastOf(data, 'five')
        expect(i).toBe(-1)
        expect(data).toEqual(['one', 'two', 'three', 'four', 'one'])
      })

      it('should return `-1` if the array is empty', () => {
        const data: string[] = []
        const i = ArrayExt.removeLastOf(data, 'five')
        expect(i).toBe(-1)
        expect(data).toEqual([])
      })

      it('should support searching from a start index', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeLastOf(data, 'one', 2)
        expect(i).toBe(0)
        expect(data).toEqual(['two', 'three', 'four', 'one'])
      })

      it('should support a negative start index', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeLastOf(data, 'one', -2)
        expect(i).toBe(0)
        expect(data).toEqual(['two', 'three', 'four', 'one'])
      })

      it('should support searching within a range', () => {
        const data = ['three', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeLastOf(data, 'three', 3, 1)
        expect(i).toBe(2)
        expect(data).toEqual(['three', 'two', 'four', 'one'])
      })

      it('should support a negative stop index', () => {
        const data = ['three', 'two', 'three', 'four', 'three']
        const i = ArrayExt.removeLastOf(data, 'three', 3, -4)
        expect(i).toBe(2)
        expect(data).toEqual(['three', 'two', 'four', 'three'])
      })

      it('should wrap around if start < stop', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeLastOf(data, 'two', 3, 1)
        expect(i).toBe(1)
        expect(data).toEqual(['one', 'three', 'four', 'one'])
      })

    })

    describe('removeAllOf()', () => {

      it('should remove all occurrences of a value', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeAllOf(data, 'one')
        expect(i).toBe(2)
        expect(data).toEqual(['two', 'three', 'four'])
      })

      it('should return `0` if there is no matching value', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeAllOf(data, 'five')
        expect(i).toBe(0)
        expect(data).toEqual(['one', 'two', 'three', 'four', 'one'])
      })

      it('should return `0` if the array is empty', () => {
        const data: string[] = []
        const i = ArrayExt.removeAllOf(data, 'five')
        expect(i).toBe(0)
        expect(data).toEqual([])
      })

      it('should support searching from a start index', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeAllOf(data, 'one', 2)
        expect(i).toBe(1)
        expect(data).toEqual(['one', 'two', 'three', 'four'])
      })

      it('should support a negative start index', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeAllOf(data, 'one', -2)
        expect(i).toBe(1)
        expect(data).toEqual(['one', 'two', 'three', 'four'])
      })

      it('should support searching within a range', () => {
        const data = ['three', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeAllOf(data, 'three', 1, 3)
        expect(i).toBe(1)
        expect(data).toEqual(['three', 'two', 'four', 'one'])
      })

      it('should support a negative stop index', () => {
        const data = ['three', 'two', 'three', 'four', 'three']
        const i = ArrayExt.removeAllOf(data, 'three', 1, -2)
        expect(i).toBe(1)
        expect(data).toEqual(['three', 'two', 'four', 'three'])
      })

      it('should wrap around if start < stop', () => {
        const data = ['one', 'two', 'three', 'four', 'one']
        const i = ArrayExt.removeAllOf(data, 'one', 3, 1)
        expect(i).toBe(2)
        expect(data).toEqual(['two', 'three', 'four'])
      })

    })

    describe('removeFirstWhere()', () => {

      it('should remove the first occurrence of a value', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeFirstWhere(data, v => v % 2 === 0)
        expect(result.index).toBe(1)
        expect(result.value).toBe(2)
        expect(data).toEqual([1, 3, 4, 5])
      })

      it('should return `-1` if there is no matching value', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeFirstWhere(data, v => v % 7 === 0)
        expect(result.index).toBe(-1)
        expect(result.value).toBe(undefined)
        expect(data).toEqual([1, 2, 3, 4, 5])
      })

      it('should return `-1` if the array is empty', () => {
        const data: number[] = []
        const result = ArrayExt.removeFirstWhere(data, v => v % 7 === 0)
        expect(result.index).toBe(-1)
        expect(result.value).toBe(undefined)
        expect(data).toEqual([])
      })

      it('should support searching from a start index', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeFirstWhere(data, v => v % 2 === 0, 2)
        expect(result.index).toBe(3)
        expect(result.value).toBe(4)
        expect(data).toEqual([1, 2, 3, 5])
      })

      it('should support a negative start index', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeFirstWhere(data, v => v % 2 === 0, -3)
        expect(result.index).toBe(3)
        expect(result.value).toBe(4)
        expect(data).toEqual([1, 2, 3, 5])
      })

      it('should support searching within a range', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeFirstWhere(data, v => v % 2 === 0, 2, 4)
        expect(result.index).toBe(3)
        expect(result.value).toBe(4)
        expect(data).toEqual([1, 2, 3, 5])
      })

      it('should support a negative stop index', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeFirstWhere(data, v => v % 2 === 0, 2, -2)
        expect(result.index).toBe(3)
        expect(result.value).toBe(4)
        expect(data).toEqual([1, 2, 3, 5])
      })

      it('should wrap around if stop < start', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeFirstWhere(data, v => v % 2 === 0, 4, 2)
        expect(result.index).toBe(1)
        expect(result.value).toBe(2)
        expect(data).toEqual([1, 3, 4, 5])
      })

    })

    describe('removeLastWhere()', () => {

      it('should remove the last occurrence of a value', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeLastWhere(data, v => v % 2 === 0)
        expect(result.index).toBe(3)
        expect(result.value).toBe(4)
        expect(data).toEqual([1, 2, 3, 5])
      })

      it('should return `-1` if there is no matching value', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeLastWhere(data, v => v % 7 === 0)
        expect(result.index).toBe(-1)
        expect(result.value).toBe(undefined)
        expect(data).toEqual([1, 2, 3, 4, 5])
      })

      it('should return `-1` if the array is empty', () => {
        const data: number[] = []
        const result = ArrayExt.removeLastWhere(data, v => v % 7 === 0)
        expect(result.index).toBe(-1)
        expect(result.value).toBe(undefined)
        expect(data).toEqual([])
      })

      it('should support searching from a start index', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeLastWhere(data, v => v % 2 === 0, 2)
        expect(result.index).toBe(1)
        expect(result.value).toBe(2)
        expect(data).toEqual([1, 3, 4, 5])
      })

      it('should support a negative start index', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeLastWhere(data, v => v % 2 === 0, -3)
        expect(result.index).toBe(1)
        expect(result.value).toBe(2)
        expect(data).toEqual([1, 3, 4, 5])
      })

      it('should support searching within a range', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeLastWhere(data, v => v % 2 === 0, 4, 2)
        expect(result.index).toBe(3)
        expect(result.value).toBe(4)
        expect(data).toEqual([1, 2, 3, 5])
      })

      it('should support a negative stop index', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeLastWhere(data, v => v % 2 === 0, 4, -4)
        expect(result.index).toBe(3)
        expect(result.value).toBe(4)
        expect(data).toEqual([1, 2, 3, 5])
      })

      it('should wrap around if start < stop', () => {
        const data = [1, 2, 3, 4, 5]
        const result = ArrayExt.removeLastWhere(data, v => v % 2 === 0, 0, 2)
        expect(result.index).toBe(3)
        expect(result.value).toBe(4)
        expect(data).toEqual([1, 2, 3, 5])
      })

    })

    describe('removeAllWhere()', () => {

      it('should remove all occurrences of a value', () => {
        const data = [1, 2, 3, 4, 3, 5, 1]
        const count = ArrayExt.removeAllWhere(data, v => v % 3 === 0)
        expect(count).toBe(2)
        expect(data).toEqual([1, 2, 4, 5, 1])
      })

      it('should return `0` if there is no matching value', () => {
        const data = [1, 2, 3, 4, 3, 5, 1]
        const count = ArrayExt.removeAllWhere(data, v => v % 7 === 0)
        expect(count).toBe(0)
        expect(data).toEqual([1, 2, 3, 4, 3, 5, 1])
      })

      it('should return `0` if the array is empty', () => {
        const data: number[] = []
        const count = ArrayExt.removeAllWhere(data, v => v % 7 === 0)
        expect(count).toBe(0)
        expect(data).toEqual([])
      })

      it('should support searching from a start index', () => {
        const data = [1, 2, 3, 4, 3, 5, 1]
        const count = ArrayExt.removeAllWhere(data, v => v % 3 === 0, 3)
        expect(count).toBe(1)
        expect(data).toEqual([1, 2, 3, 4, 5, 1])
      })

      it('should support a negative start index', () => {
        const data = [1, 2, 3, 4, 3, 5, 1]
        const count = ArrayExt.removeAllWhere(data, v => v % 3 === 0, -4)
        expect(count).toBe(1)
        expect(data).toEqual([1, 2, 3, 4, 5, 1])
      })

      it('should support searching within a range', () => {
        const data = [1, 2, 3, 4, 3, 5, 1]
        const count = ArrayExt.removeAllWhere(data, v => v % 3 === 0, 3, 5)
        expect(count).toBe(1)
        expect(data).toEqual([1, 2, 3, 4, 5, 1])
      })

      it('should support a negative stop index', () => {
        const data = [1, 2, 3, 4, 3, 5, 1]
        const count = ArrayExt.removeAllWhere(data, v => v % 3 === 0, 3, -2)
        expect(count).toBe(1)
        expect(data).toEqual([1, 2, 3, 4, 5, 1])
      })

      it('should wrap around if start < stop', () => {
        const data = [1, 2, 3, 4, 3, 5, 1]
        const count = ArrayExt.removeAllWhere(data, v => v % 3 === 0, 5, 3)
        expect(count).toBe(1)
        expect(data).toEqual([1, 2, 4, 3, 5, 1])
      })

    })

  })

})

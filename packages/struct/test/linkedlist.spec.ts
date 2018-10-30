import { find, map, toArray, LinkedList } from '../src/index'

describe('@luban/struct', () => {

  describe('LinkedList', () => {

    describe('#constructor()', () => {
      const list = new LinkedList<number>()
      expect(list).toBeInstanceOf(LinkedList)
    })

    describe('#isEmpty', () => {
      it('should be `true` for an empty list', () => {
        const list = new LinkedList<number>()
        expect(list.isEmpty).toBe(true)
      })

      it('should be `false` for a non-empty list', () => {
        const data = [0, 1, 2, 3, 4, 5]
        const list = LinkedList.from(data)
        expect(list.isEmpty).toBe(false)
      })
    })

    describe('#length', () => {
      it('should be `0` for an empty list', () => {
        const list = new LinkedList<number>()
        expect(list.length).toBe(0)
      })

      it('should equal the number of items in a list', () => {
        const data = [0, 1, 2, 3, 4, 5]
        const list = LinkedList.from(data)
        expect(list.length).toBe(data.length)
      })
    })

    describe('#first', () => {
      it('should be the first value in the list', () => {
        const data = [0, 1, 2, 3, 4, 5]
        const list = LinkedList.from(data)
        expect(list.first).toBe(data[0])
      })

      it('should be `undefined` if the list is empty', () => {
        const list = new LinkedList<number>()
        expect(list.first).toBe(undefined)
      })
    })

    describe('#last', () => {
      it('should be the last value in the list', () => {
        const data = [0, 1, 2, 3, 4, 5]
        const list = LinkedList.from(data)
        expect(list.last).toBe(data[data.length - 1])
      })

      it('should be `undefined` if the list is empty', () => {
        const list = new LinkedList<number>()
        expect(list.last).toBe(undefined)
      })
    })

    describe('#firstNode', () => {
      it('should be the first node in the list', () => {
        const data = [0, 1, 2, 3, 4, 5]
        const list = LinkedList.from(data)
        expect(list.firstNode!.value).toBe(data[0])
      })

      it('should be `null` if the list is empty', () => {
        const list = new LinkedList<number>()
        expect(list.firstNode).toBe(null)
      })
    })

    describe('#lastNode', () => {
      it('should be the last node in the list', () => {
        const data = [0, 1, 2, 3, 4, 5]
        const list = LinkedList.from(data)
        expect(list.lastNode!.value).toBe(data[data.length - 1])
      })

      it('should be `null` if the list is empty', () => {
        const list = new LinkedList<number>()
        expect(list.lastNode).toBe(null)
      })
    })

    describe('#iterator()', () => {
      it('should return an iterator over the list values', () => {
        const data = [0, 1, 2, 3, 4, 5]
        const list = LinkedList.from(data)
        const it1 = list.iterator()
        const it2 = it1.clone()
        expect(it1.iterator()).toBe(it1)
        expect(it2.iterator()).toBe(it2)
        expect(toArray(it1)).toEqual(data)
        expect(toArray(it2)).toEqual(data)
      })
    })

    describe('#reverse()', () => {
      it('should return a reverse iterator over the list values', () => {
        const data = [0, 1, 2, 3, 4, 5]
        const reversed = data.slice().reverse()
        const list = LinkedList.from(data)
        const it1 = list.reverse()
        const it2 = it1.clone()
        expect(it1.iterator()).toBe(it1)
        expect(it2.iterator()).toBe(it2)
        expect(toArray(it1)).toEqual(reversed)
        expect(toArray(it2)).toEqual(reversed)
      })
    })

    describe('#nodes()', () => {
      it('should return an iterator over the list nodes', () => {
        const data = [0, 1, 2, 3, 4, 5]
        const list = LinkedList.from(data)
        const it1 = list.nodes()
        const it2 = it1.clone()
        const v1 = map(it1, n => n.value)
        const v2 = map(it2, n => n.value)
        expect(it1.iterator()).toBe(it1)
        expect(it2.iterator()).toBe(it2)
        expect(toArray(v1)).toEqual(data)
        expect(toArray(v2)).toEqual(data)
      })
    })

    describe('#reverseNodes()', () => {
      it('should return a reverse iterator over the list nodes', () => {
        const data = [0, 1, 2, 3, 4, 5]
        const reversed = data.slice().reverse()
        const list = LinkedList.from(data)
        const it1 = list.reverseNodes()
        const it2 = it1.clone()
        const v1 = map(it1, n => n.value)
        const v2 = map(it2, n => n.value)
        expect(it1.iterator()).toBe(it1)
        expect(it2.iterator()).toBe(it2)
        expect(toArray(v1)).toEqual(reversed)
        expect(toArray(v2)).toEqual(reversed)
      })
    })

    describe('#addFirst()', () => {

      it('should add a value to the beginning of the list', () => {
        const list = new LinkedList<number>()

        expect(list.isEmpty).toBe(true)
        expect(list.length).toBe(0)
        expect(list.first).toBe(undefined)
        expect(list.last).toBe(undefined)

        const n1 = list.addFirst(99)

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(1)
        expect(list.first).toBe(99)
        expect(list.last).toBe(99)

        const n2 = list.addFirst(42)

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(2)
        expect(list.first).toBe(42)
        expect(list.last).toBe(99)

        const n3 = list.addFirst(7)

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(3)
        expect(list.first).toBe(7)
        expect(list.last).toBe(99)

        expect(toArray(list)).toEqual([7, 42, 99])

        expect(n1.list).toBe(list)
        expect(n1.next).toBe(null)
        expect(n1.prev).toBe(n2)
        expect(n1.value).toBe(99)

        expect(n2.list).toBe(list)
        expect(n2.next).toBe(n1)
        expect(n2.prev).toBe(n3)
        expect(n2.value).toBe(42)

        expect(n3.list).toBe(list)
        expect(n3.next).toBe(n2)
        expect(n3.prev).toBe(null)
        expect(n3.value).toBe(7)
      })

    })

    describe('#addLast()', () => {

      it('should add a value to the end of the list', () => {
        const list = new LinkedList<number>()

        expect(list.isEmpty).toBe(true)
        expect(list.length).toBe(0)
        expect(list.first).toBe(undefined)
        expect(list.last).toBe(undefined)

        const n1 = list.addLast(99)

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(1)
        expect(list.first).toBe(99)
        expect(list.last).toBe(99)

        const n2 = list.addLast(42)

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(2)
        expect(list.first).toBe(99)
        expect(list.last).toBe(42)

        const n3 = list.addLast(7)

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(3)
        expect(list.first).toBe(99)
        expect(list.last).toBe(7)

        expect(toArray(list)).toEqual([99, 42, 7])

        expect(n1.list).toBe(list)
        expect(n1.next).toBe(n2)
        expect(n1.prev).toBe(null)
        expect(n1.value).toBe(99)

        expect(n2.list).toBe(list)
        expect(n2.next).toBe(n3)
        expect(n2.prev).toBe(n1)
        expect(n2.value).toBe(42)

        expect(n3.list).toBe(list)
        expect(n3.next).toBe(null)
        expect(n3.prev).toBe(n2)
        expect(n3.value).toBe(7)
      })

    })

    describe('#insertBefore()', () => {

      it('should insert a value before the given reference node', () => {
        const list = LinkedList.from([0, 1, 2, 3])
        const n1 = find(list.nodes(), n => n.value === 2)!

        const n2 = list.insertBefore(7, n1)
        const n3 = list.insertBefore(8, n2)
        const n4 = list.insertBefore(9, null)

        const n5 = find(list.nodes(), n => n.value === 1)
        const n6 = find(list.nodes(), n => n.value === 0)

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(7)
        expect(list.first).toBe(9)
        expect(list.last).toBe(3)
        expect(toArray(list)).toEqual([9, 0, 1, 8, 7, 2, 3])

        expect(n1.list).toBe(list)
        expect(n1.next).toBe(list.lastNode)
        expect(n1.prev).toBe(n2)
        expect(n1.value).toBe(2)

        expect(n2.list).toBe(list)
        expect(n2.next).toBe(n1)
        expect(n2.prev).toBe(n3)
        expect(n2.value).toBe(7)

        expect(n3.list).toBe(list)
        expect(n3.next).toBe(n2)
        expect(n3.prev).toBe(n5)
        expect(n3.value).toBe(8)

        expect(n4.list).toBe(list)
        expect(n4.next).toBe(n6)
        expect(n4.prev).toBe(null)
        expect(n4.value).toBe(9)
      })

      it('should throw an error if the reference node is invalid', () => {
        const list1 = LinkedList.from([0, 1, 2, 3])
        const list2 = LinkedList.from([0, 1, 2, 3])
        const insert = () => { list2.insertBefore(4, list1.firstNode) }
        expect(insert).toThrow(Error)
      })
    })

    describe('#insertAfter()', () => {

      it('should insert a value after the given reference node', () => {
        const list = LinkedList.from([0, 1, 2, 3])
        const n1 = find(list.nodes(), n => n.value === 2)!

        const n2 = list.insertAfter(7, n1)
        const n3 = list.insertAfter(8, n2)
        const n4 = list.insertAfter(9, null)

        const n5 = find(list.nodes(), n => n.value === 1)
        const n6 = find(list.nodes(), n => n.value === 3)

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(7)
        expect(list.first).toBe(0)
        expect(list.last).toBe(9)
        expect(toArray(list)).toEqual([0, 1, 2, 7, 8, 3, 9])

        expect(n1.list).toBe(list)
        expect(n1.next).toBe(n2)
        expect(n1.prev).toBe(n5)
        expect(n1.value).toBe(2)

        expect(n2.list).toBe(list)
        expect(n2.next).toBe(n3)
        expect(n2.prev).toBe(n1)
        expect(n2.value).toBe(7)

        expect(n3.list).toBe(list)
        expect(n3.next).toBe(n6)
        expect(n3.prev).toBe(n2)
        expect(n3.value).toBe(8)

        expect(n4.list).toBe(list)
        expect(n4.next).toBe(null)
        expect(n4.prev).toBe(n6)
        expect(n4.value).toBe(9)
      })

      it('should throw an error if the reference node is invalid', () => {
        const list1 = LinkedList.from([0, 1, 2, 3])
        const list2 = LinkedList.from([0, 1, 2, 3])
        const insert = () => { list2.insertAfter(4, list1.firstNode) }
        expect(insert).toThrow(Error)
      })

    })

    describe('#removeFirst()', () => {

      it('should remove the first value from the list', () => {
        const list = LinkedList.from([0, 1, 2, 3])

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(4)
        expect(list.first).toBe(0)
        expect(list.last).toBe(3)
        expect(toArray(list)).toEqual([0, 1, 2, 3])

        const v1 = list.removeFirst()

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(3)
        expect(list.first).toBe(1)
        expect(list.last).toBe(3)
        expect(toArray(list)).toEqual([1, 2, 3])

        const v2 = list.removeFirst()

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(2)
        expect(list.first).toBe(2)
        expect(list.last).toBe(3)
        expect(toArray(list)).toEqual([2, 3])

        const v3 = list.removeFirst()

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(1)
        expect(list.first).toBe(3)
        expect(list.last).toBe(3)
        expect(toArray(list)).toEqual([3])

        const v4 = list.removeFirst()

        expect(list.isEmpty).toBe(true)
        expect(list.length).toBe(0)
        expect(list.first).toBe(undefined)
        expect(list.last).toBe(undefined)
        expect(toArray(list)).toEqual([])

        const v5 = list.removeFirst()

        expect(list.isEmpty).toBe(true)
        expect(list.length).toBe(0)
        expect(list.first).toBe(undefined)
        expect(list.last).toBe(undefined)
        expect(toArray(list)).toEqual([])

        expect(v1).toBe(0)
        expect(v2).toBe(1)
        expect(v3).toBe(2)
        expect(v4).toBe(3)
        expect(v5).toBe(undefined)
      })

    })

    describe('#removeLast()', () => {

      it('should remove the last value from the list', () => {
        const list = LinkedList.from([0, 1, 2, 3])

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(4)
        expect(list.first).toBe(0)
        expect(list.last).toBe(3)
        expect(toArray(list)).toEqual([0, 1, 2, 3])

        const v1 = list.removeLast()

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(3)
        expect(list.first).toBe(0)
        expect(list.last).toBe(2)
        expect(toArray(list)).toEqual([0, 1, 2])

        const v2 = list.removeLast()

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(2)
        expect(list.first).toBe(0)
        expect(list.last).toBe(1)
        expect(toArray(list)).toEqual([0, 1])

        const v3 = list.removeLast()

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(1)
        expect(list.first).toBe(0)
        expect(list.last).toBe(0)
        expect(toArray(list)).toEqual([0])

        const v4 = list.removeLast()

        expect(list.isEmpty).toBe(true)
        expect(list.length).toBe(0)
        expect(list.first).toBe(undefined)
        expect(list.last).toBe(undefined)
        expect(toArray(list)).toEqual([])

        const v5 = list.removeLast()

        expect(list.isEmpty).toBe(true)
        expect(list.length).toBe(0)
        expect(list.first).toBe(undefined)
        expect(list.last).toBe(undefined)
        expect(toArray(list)).toEqual([])

        expect(v1).toBe(3)
        expect(v2).toBe(2)
        expect(v3).toBe(1)
        expect(v4).toBe(0)
        expect(v5).toBe(undefined)
      })

    })

    describe('#removeNode()', () => {

      it('should remove the specified node from the list', () => {
        const list = LinkedList.from([0, 1, 2, 3])

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(4)
        expect(list.first).toBe(0)
        expect(list.last).toBe(3)
        expect(toArray(list)).toEqual([0, 1, 2, 3])

        const n1 = find(list.nodes(), n => n.value === 2)!
        list.removeNode(n1)
        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(3)
        expect(list.first).toBe(0)
        expect(list.last).toBe(3)
        expect(toArray(list)).toEqual([0, 1, 3])
        expect(n1.list).toBe(null)
        expect(n1.next).toBe(null)
        expect(n1.prev).toBe(null)
        expect(n1.value).toBe(2)

        const n2 = find(list.nodes(), n => n.value === 3)!
        list.removeNode(n2)
        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(2)
        expect(list.first).toBe(0)
        expect(list.last).toBe(1)
        expect(toArray(list)).toEqual([0, 1])
        expect(n2.list).toBe(null)
        expect(n2.next).toBe(null)
        expect(n2.prev).toBe(null)
        expect(n2.value).toBe(3)

        const n3 = find(list.nodes(), n => n.value === 0)!
        list.removeNode(n3)
        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(1)
        expect(list.first).toBe(1)
        expect(list.last).toBe(1)
        expect(toArray(list)).toEqual([1])
        expect(n3.list).toBe(null)
        expect(n3.next).toBe(null)
        expect(n3.prev).toBe(null)
        expect(n3.value).toBe(0)

        const n4 = find(list.nodes(), n => n.value === 1)!
        list.removeNode(n4)
        expect(list.isEmpty).toBe(true)
        expect(list.length).toBe(0)
        expect(list.first).toBe(undefined)
        expect(list.last).toBe(undefined)
        expect(toArray(list)).toEqual([])
        expect(n4.list).toBe(null)
        expect(n4.next).toBe(null)
        expect(n4.prev).toBe(null)
        expect(n4.value).toBe(1)
      })

      it('should throw an error if the removing node is invalid', () => {
        const list1 = LinkedList.from([0, 1, 2, 3])
        const list2 = LinkedList.from([0, 1, 2, 3])
        const remove = () => { list2.removeNode(list1.firstNode) }
        expect(remove).toThrow(Error)
      })
    })

    describe('#clear()', () => {

      it('should remove all values from the list', () => {
        const list = LinkedList.from([0, 1, 2, 3])

        expect(list.isEmpty).toBe(false)
        expect(list.length).toBe(4)
        expect(list.first).toBe(0)
        expect(list.last).toBe(3)
        expect(toArray(list)).toEqual([0, 1, 2, 3])

        list.clear()

        expect(list.isEmpty).toBe(true)
        expect(list.length).toBe(0)
        expect(list.first).toBe(undefined)
        expect(list.last).toBe(undefined)
        expect(toArray(list)).toEqual([])
      })

    })

    describe('.from()', () => {

      it('should initialize a list from an iterable', () => {
        const list1 = LinkedList.from([0, 1, 2, 3])
        const list2 = LinkedList.from(list1)
        expect(list2.isEmpty).toBe(false)
        expect(list2.length).toBe(4)
        expect(list2.first).toBe(0)
        expect(list2.last).toBe(3)
        expect(toArray(list2)).toEqual([0, 1, 2, 3])
      })

    })

    describe('.ForwardValueIterator', () => {

      it('should create a forward iterator over the values', () => {
        const list = LinkedList.from([0, 1, 2, 3, 4])
        const n = find(list.nodes(), n => n.value === 2)!
        const it1 = new LinkedList.ForwardValueIterator(n)
        const it2 = it1.clone()
        expect(it1.iterator()).toBe(it1)
        expect(it2.iterator()).toBe(it2)
        expect(toArray(it1)).toEqual([2, 3, 4])
        expect(toArray(it2)).toEqual([2, 3, 4])
      })

      it('should throw an error if the iterator do not have next value', () => {
        const list = LinkedList.from([0, 1, 2, 3, 4])
        const n = find(list.nodes(), n => n.value === 3)!
        const it1 = new LinkedList.ForwardValueIterator(n)
        const it2 = it1.clone()

        it1.next()
        it1.next()

        it2.next()
        it2.next()

        expect(() => { it1.next() }).toThrow(Error)
        expect(() => { it2.next() }).toThrow(Error)
      })
    })

    describe('.ReverseValueIterator', () => {

      it('should create a reverse iterator over the values', () => {
        const list = LinkedList.from([0, 1, 2, 3, 4])
        const n = find(list.nodes(), n => n.value === 2)!
        const it1 = new LinkedList.ReverseValueIterator(n)
        const it2 = it1.clone()
        expect(it1.iterator()).toBe(it1)
        expect(it2.iterator()).toBe(it2)
        expect(toArray(it1)).toEqual([2, 1, 0])
        expect(toArray(it2)).toEqual([2, 1, 0])
      })

      it('should throw an error if the iterator do not have next value', () => {
        const list = LinkedList.from([0, 1, 2, 3, 4])
        const n = find(list.nodes(), n => n.value === 1)!
        const it1 = new LinkedList.ReverseValueIterator(n)
        const it2 = it1.clone()

        it1.next()
        it1.next()

        it2.next()
        it2.next()

        expect(() => { it1.next() }).toThrow(Error)
        expect(() => { it2.next() }).toThrow(Error)
      })
    })

    describe('.ForwardNodeIterator', () => {

      it('should create a forward iterator over the nodes', () => {
        const list = LinkedList.from([0, 1, 2, 3, 4])
        const n = find(list.nodes(), n => n.value === 2)!
        const it1 = new LinkedList.ForwardNodeIterator(n)
        const it2 = it1.clone()
        const v1 = map(it1, n => n.value)
        const v2 = map(it2, n => n.value)
        expect(it1.iterator()).toBe(it1)
        expect(it2.iterator()).toBe(it2)
        expect(toArray(v1)).toEqual([2, 3, 4])
        expect(toArray(v2)).toEqual([2, 3, 4])
      })

      it('should throw an error if the iterator do not have next value', () => {
        const list = LinkedList.from([0, 1, 2, 3, 4])
        const n = find(list.nodes(), n => n.value === 3)!
        const it1 = new LinkedList.ForwardNodeIterator(n)
        const it2 = it1.clone()

        it1.next()
        it1.next()

        it2.next()
        it2.next()

        expect(() => { it1.next() }).toThrow(Error)
        expect(() => { it2.next() }).toThrow(Error)
      })
    })

    describe('.ReverseNodeIterator', () => {

      it('should create a reverse iterator over the nodes', () => {
        const list = LinkedList.from([0, 1, 2, 3, 4])
        const n = find(list.nodes(), n => n.value === 2)!
        const it1 = new LinkedList.ReverseNodeIterator(n)
        const it2 = it1.clone()
        const v1 = map(it1, n => n.value)
        const v2 = map(it2, n => n.value)
        expect(it1.iterator()).toBe(it1)
        expect(it2.iterator()).toBe(it2)
        expect(toArray(v1)).toEqual([2, 1, 0])
        expect(toArray(v2)).toEqual([2, 1, 0])
      })

      it('should throw an error if the iterator do not have next value', () => {
        const list = LinkedList.from([0, 1, 2, 3, 4])
        const n = find(list.nodes(), n => n.value === 1)!
        const it1 = new LinkedList.ReverseNodeIterator(n)
        const it2 = it1.clone()

        it1.next()
        it1.next()

        it2.next()
        it2.next()

        expect(() => { it1.next() }).toThrow(Error)
        expect(() => { it2.next() }).toThrow(Error)
      })
    })
  })
})

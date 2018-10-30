import { EmptyIterator, empty } from '../src/index'
import { testIterator } from './iterator.spec'

describe('@luban/struct', () => {
  describe('empty()', () => {
    testIterator(() => {
      return [empty(), []]
    })
  })

  describe('EmptyIterator', () => {
    testIterator(() => {
      return [new EmptyIterator(), []]
    })
  })
})

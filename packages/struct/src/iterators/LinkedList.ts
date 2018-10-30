import { IIterable, IIterator, IterableOrArrayLike } from './IIterator'
import { IReversible } from './IReversible'
import { EmptyIterator } from './EmptyIterator'
import { each } from '../iterator'

/**
 * A generic doubly-linked list.
 */
export class LinkedList<T> implements IIterable<T>, IReversible<T> {

  private nodeCount = 0
  private innerFirstNode: Private.LinkedListNode<T> | null = null
  private innerLastNode: Private.LinkedListNode<T> | null = null

  /**
   * Construct a new linked list.
   */
  constructor() { }

  /**
   * Whether the list is empty.
   */
  get isEmpty(): boolean {
    return this.nodeCount === 0
  }

  /**
   * The length of the list.
   */
  get length(): number {
    return this.nodeCount
  }

  /**
   * The first value in the list.
   *
   * This is `undefined` if the list is empty.
   */
  get first(): T | undefined {
    return this.innerFirstNode ? this.innerFirstNode.value : undefined
  }

  /**
   * The last value in the list.
   *
   * This is `undefined` if the list is empty.
   */
  get last(): T | undefined {
    return this.innerLastNode ? this.innerLastNode.value : undefined
  }

  /**
   * The first node in the list.
   *
   * This is `null` if the list is empty.
   */
  get firstNode(): LinkedList.INode<T> | null {
    return this.innerFirstNode
  }

  /**
   * The last node in the list.
   *
   * This is `null` if the list is empty.
   */
  get lastNode(): LinkedList.INode<T> | null {
    return this.innerLastNode
  }

  /**
   * Create an iterator over the values in the list.
   *
   * @returns A new iterator starting with the first value.
   */
  iterator(): IIterator<T> {
    return new LinkedList.ForwardValueIterator<T>(this.innerFirstNode)
  }

  /**
   * Create a reverse iterator over the values in the list.
   *
   * @returns A new iterator starting with the last value.
   */
  reverse(): IIterator<T> {
    return new LinkedList.ReverseValueIterator<T>(this.innerLastNode)
  }

  /**
   * Create an iterator over the nodes in the list.
   *
   * @returns A new iterator starting with the first node.
   */
  nodes(): IIterator<LinkedList.INode<T>> {
    return new LinkedList.ForwardNodeIterator<T>(this.innerFirstNode)
  }

  /**
   * Create a reverse iterator over the nodes in the list.
   *
   * @returns A new iterator starting with the last node.
   */
  reverseNodes(): IIterator<LinkedList.INode<T>> {
    return new LinkedList.ReverseNodeIterator<T>(this.innerLastNode)
  }

  /**
   * Add a value to the beginning of the list.
   *
   * @param value - The value to add to the beginning of the list.
   *
   * @returns The list node which holds the value.
   */
  addFirst(value: T): LinkedList.INode<T> {
    const node = new Private.LinkedListNode<T>(this, value)
    if (!this.innerFirstNode) {
      this.innerFirstNode = node
      this.innerLastNode = node
    } else {
      node.next = this.innerFirstNode
      this.innerFirstNode.prev = node
      this.innerFirstNode = node
    }
    this.nodeCount += 1
    return node
  }

  /**
   * Add a value to the end of the list.
   *
   * @param value - The value to add to the end of the list.
   *
   * @returns The list node which holds the value.
   */
  addLast(value: T): LinkedList.INode<T> {
    const node = new Private.LinkedListNode<T>(this, value)
    if (!this.innerLastNode) {
      this.innerFirstNode = node
      this.innerLastNode = node
    } else {
      node.prev = this.innerLastNode
      this.innerLastNode.next = node
      this.innerLastNode = node
    }
    this.nodeCount += 1
    return node
  }

  /**
   * Insert a value before a specific node in the list.
   *
   * @param value - The value to insert before the reference node.
   *
   * @param ref - The reference node of interest. If this is `null`,
   *   the value will be added to the beginning of the list.
   *
   * @returns The list node which holds the value.
   *
   * #### Notes
   * The reference node must be owned by the list.
   */
  insertBefore(value: T, ref: LinkedList.INode<T> | null): LinkedList.INode<T> {
    if (!ref || ref === this.innerFirstNode) {
      return this.addFirst(value)
    }

    if (!(ref instanceof Private.LinkedListNode) || ref.list !== this) {
      throw new ReferenceError('Reference node is not owned by the list.')
    }

    const node = new Private.LinkedListNode<T>(this, value)
    const reff = ref as Private.LinkedListNode<T>
    const prev = reff.prev!
    node.next = reff
    node.prev = prev
    reff.prev = node
    prev.next = node

    this.nodeCount += 1

    return node
  }

  /**
   * Insert a value after a specific node in the list.
   *
   * @param value - The value to insert after the reference node.
   *
   * @param ref - The reference node of interest. If this is `null`,
   *   the value will be added to the end of the list.
   *
   * @returns The list node which holds the value.
   *
   * #### Notes
   * The reference node must be owned by the list.
   */
  insertAfter(value: T, ref: LinkedList.INode<T> | null): LinkedList.INode<T> {
    if (!ref || ref === this.innerLastNode) {
      return this.addLast(value)
    }

    if (!(ref instanceof Private.LinkedListNode) || ref.list !== this) {
      throw new ReferenceError('Reference node is not owned by the list.')
    }

    const node = new Private.LinkedListNode<T>(this, value)
    const reff = ref as Private.LinkedListNode<T>
    const next = reff.next!
    node.next = next
    node.prev = reff
    reff.next = node
    next.prev = node

    this.nodeCount += 1

    return node
  }

  /**
   * Remove and return the value at the beginning of the list.
   *
   * @returns The removed value, or `undefined` if the list is empty.
   */
  removeFirst(): T | undefined {
    const node = this.innerFirstNode
    if (!node) {
      return undefined
    }
    if (node === this.innerLastNode) {
      this.innerFirstNode = null
      this.innerLastNode = null
    } else {
      this.innerFirstNode = node.next
      this.innerFirstNode!.prev = null
    }
    node.list = null
    node.next = null
    node.prev = null

    this.nodeCount -= 1

    return node.value
  }

  /**
   * Remove and return the value at the end of the list.
   *
   * @returns The removed value, or `undefined` if the list is empty.
   */
  removeLast(): T | undefined {
    const node = this.innerLastNode
    if (!node) {
      return undefined
    }

    if (node === this.innerFirstNode) {
      this.innerFirstNode = null
      this.innerLastNode = null
    } else {
      this.innerLastNode = node.prev
      this.innerLastNode!.next = null
    }

    node.list = null
    node.next = null
    node.prev = null

    this.nodeCount -= 1

    return node.value
  }

  /**
   * Remove a specific node from the list.
   *
   * @param node - The node to remove from the list.
   *
   * #### Notes
   * The node must be owned by the list.
   */
  removeNode(node: LinkedList.INode<T>): T | undefined {
    if (!(node instanceof Private.LinkedListNode) || node.list !== this) {
      throw new ReferenceError('Reference node is not owned by the list.')
    }

    const removedNode = node as Private.LinkedListNode<T>
    if (removedNode === this.innerFirstNode && removedNode === this.innerLastNode) {
      this.innerFirstNode = null
      this.innerLastNode = null
    } else if (removedNode === this.innerFirstNode) {
      this.innerFirstNode = removedNode.next
      this.innerFirstNode!.prev = null
    } else if (removedNode === this.innerLastNode) {
      this.innerLastNode = removedNode.prev
      this.innerLastNode!.next = null
    } else {
      removedNode.next!.prev = removedNode.prev
      removedNode.prev!.next = removedNode.next
    }
    removedNode.list = null
    removedNode.next = null
    removedNode.prev = null

    this.nodeCount -= 1

    return removedNode.value
  }

  /**
   * Remove all values from the list.
   */
  clear(): void {
    let node = this.innerFirstNode
    while (node) {
      const next = node.next
      node.list = null
      node.prev = null
      node.next = null
      node = next
    }
    this.innerFirstNode = null
    this.innerLastNode = null
    this.nodeCount = 0
  }
}

/**
 * The namespace for the `LinkedList` class statics.
 */
export namespace LinkedList {
  /**
   * An object which represents a node in a linked list.
   *
   * #### Notes
   * User code will not create linked list nodes directly. Nodes
   * are created automatically when values are added to a list.
   */
  export interface INode<T> {
    /**
     * The linked list which created and owns the node.
     *
     * This will be `null` when the node is removed from the list.
     */
    readonly list: LinkedList<T> | null

    /**
     * The next node in the list.
     *
     * This will be `null` when the node is the last node in the list
     * or when the node is removed from the list.
     */
    readonly next: INode<T> | null

    /**
     * The previous node in the list.
     *
     * This will be `null` when the node is the first node in the list
     * or when the node is removed from the list.
     */
    readonly prev: INode<T> | null

    /**
     * The user value stored in the node.
     */
    readonly value: T
  }

  /**
   * Create a linked list from an iterable of values.
   *
   * @param values - The iterable or array-like object of interest.
   *
   * @returns A new linked list initialized with the given values.
   */
  export function from<T>(values: IterableOrArrayLike<T>): LinkedList<T> {
    const list = new LinkedList<T>()
    each(values, (value) => { list.addLast(value) })
    return list
  }

  /**
   * A forward iterator for values in a linked list.
   */
  export class ForwardValueIterator<T> extends EmptyIterator<T> {
    private node: INode<T> | null

    /**
     * Construct a forward value iterator.
     *
     * @param node - The first node in the list.
     */
    constructor(node: INode<T> | null) {
      super()
      this.node = node
    }

    /**
     * Create an independent clone of the iterator.
     *
     * @returns A new independent clone of the iterator.
     */
    clone(): IIterator<T> {
      return new ForwardValueIterator<T>(this.node)
    }

    /**
     * Get the next value from the iterator.
     *
     * @returns The next value from the iterator, or `undefined`.
     */
    next(): T {
      const node = this.node
      if (node) {
        this.node = node.next
        return node.value
      }

      return super.next()
    }

    hasNext(): boolean {
      return this.node ? true : false
    }
  }

  /**
   * A reverse iterator for values in a linked list.
   */
  export class ReverseValueIterator<T> extends EmptyIterator<T> {
    private node: INode<T> | null

    /**
     * Construct a retro value iterator.
     *
     * @param node - The last node in the list.
     */
    constructor(node: INode<T> | null) {
      super()
      this.node = node
    }

    /**
     * Create an independent clone of the iterator.
     *
     * @returns A new independent clone of the iterator.
     */
    clone(): IIterator<T> {
      return new ReverseValueIterator<T>(this.node)
    }

    /**
     * Get the next value from the iterator.
     *
     * @returns The next value from the iterator, or `undefined`.
     */
    next(): T {
      const node = this.node
      if (node) {
        this.node = node.prev
        return node.value
      }

      return super.next()
    }

    hasNext(): boolean {
      return this.node ? true : false
    }
  }

  /**
   * A forward iterator for nodes in a linked list.
   */
  export class ForwardNodeIterator<T> extends EmptyIterator<INode<T>> {

    private node: INode<T> | null

    /**
     * Construct a forward node iterator.
     *
     * @param node - The first node in the list.
     */
    constructor(node: INode<T> | null) {
      super()
      this.node = node
    }

    /**
     * Create an independent clone of the iterator.
     *
     * @returns A new independent clone of the iterator.
     */
    clone(): IIterator<INode<T>> {
      return new ForwardNodeIterator<T>(this.node)
    }

    /**
     * Get the next value from the iterator.
     *
     * @returns The next value from the iterator, or `undefined`.
     */
    next(): INode<T> {
      const node = this.node
      if (node) {
        this.node = node.next
        return node
      }

      return super.next()
    }

    hasNext(): boolean {
      return this.node ? true : false
    }
  }

  /**
   * A reverse iterator for nodes in a linked list.
   */
  export class ReverseNodeIterator<T> extends EmptyIterator<INode<T>> {

    private node: INode<T> | null

    /**
     * Construct a retro node iterator.
     *
     * @param node - The last node in the list.
     */
    constructor(node: INode<T> | null) {
      super()
      this.node = node
    }

    /**
     * Create an independent clone of the iterator.
     *
     * @returns A new independent clone of the iterator.
     */
    clone(): IIterator<INode<T>> {
      return new ReverseNodeIterator<T>(this.node)
    }

    /**
     * Get the next value from the iterator.
     *
     * @returns The next value from the iterator, or `undefined`.
     */
    next(): INode<T> {
      const node = this.node
      if (node) {
        this.node = node.prev
        return node
      }

      return super.next()
    }

    hasNext(): boolean {
      return this.node ? true : false
    }
  }
}

/**
 * The namespace for the module implementation details.
 */
namespace Private {
  /**
   * The internal linked list node implementation.
   */
  export class LinkedListNode<T> {
    /**
     * The linked list which created and owns the node.
     */
    list: LinkedList<T> | null = null

    /**
     * The next node in the list.
     */
    next: LinkedListNode<T> | null = null

    /**
     * The previous node in the list.
     */
    prev: LinkedListNode<T> | null = null

    /**
     * The user value stored in the node.
     */
    readonly value: T

    /**
     * Construct a new linked list node.
     *
     * @param list - The list which owns the node.
     *
     * @param value - The value for the link.
     */
    constructor(list: LinkedList<T>, value: T) {
      this.list = list
      this.value = value
    }
  }
}

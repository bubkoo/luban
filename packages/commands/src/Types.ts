import { ReadonlyJSONObject } from '@luban/json'

/**
 * A type alias for a user-defined command function.
 */
export type CommandFunc<T> = (args: ReadonlyJSONObject) => T

/**
 * A type alias for a simple immutable string dataset.
 */
export type Dataset = { readonly [key: string]: string }

import { IKeyboardLayout } from './IKeyboardLayout'

/**
 * A concrete implementation of [[IKeyboardLayout]] based on keycodes.
 *
 * The `keyCode` property of a `'keydown'` event is a browser and OS
 * specific representation of the physical key (not character) which
 * was pressed on a keyboard. While not the most convenient API, it
 * is currently the only one which works reliably on all browsers.
 *
 * This class accepts a user-defined mapping of keycode to key, which
 * allows for reliable shortcuts tailored to the user's system.
 */
export class KeyboardLayout implements IKeyboardLayout {
  /**
   * The human readable name of the layout.
   */
  readonly name: string
  private keyMap: KeyboardLayout.KeySet
  private codeMap: KeyboardLayout.CodeMap

  /**
   * Construct a new keycode layout.
   *
   * @param name - The human readable name for the layout.
   *
   * @param codes - A mapping of keycode to key value.
   */
  constructor(name: string, codes: KeyboardLayout.CodeMap) {
    this.name = name
    this.codeMap = codes
    this.keyMap = KeyboardLayout.extractKeys(codes)
  }

  /**
   * Get an array of the key values supported by the layout.
   *
   * @returns A new array of the supported key values.
   */
  keys(): string[] {
    return Object.keys(this.keyMap)
  }

  /**
   * Test whether the given key is a valid value for the layout.
   *
   * @param key - The user provided key to test for validity.
   *
   * @returns `true` if the key is valid, `false` otherwise.
   */
  isValidKey(key: string): boolean {
    return key in this.keyMap
  }

  /**
   * Get the key for a `'keydown'` event.
   *
   * @param event - The event object for a `'keydown'` event.
   *
   * @returns The associated key value, or an empty string if
   *   the event does not represent a valid primary key.
   */
  keyForKeydownEvent(event: KeyboardEvent): string {
    return this.codeMap[event.keyCode] || ''
  }
}

/**
 * The namespace for the `KeycodeLayout` class statics.
 */
export namespace KeyboardLayout {
  /**
   * A type alias for a keycode map.
   */
  export type CodeMap = { readonly [code: number]: string }

  /**
   * A type alias for a key set.
   */
  export type KeySet = { readonly [key: string]: boolean }

  /**
   * Extract the set of keys from a code map.
   *
   * @param code - The code map of interest.
   *
   * @returns A set of the keys in the code map.
   */
  export function extractKeys(codes: CodeMap): KeySet {
    const keys: any = Object.create(null)
    for (const c in codes) {
      keys[codes[c]] = true
    }
    return keys as KeySet
  }
}

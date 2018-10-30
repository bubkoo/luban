/**
 * An object which represents an abstract keyboard layout.
 */
export interface IKeyboardLayout {
  /**
   * The human readable name of the layout.
   *
   * This value is used primarily for display and debugging purposes.
   */
  readonly name: string

  /**
   * Get an array of all key values supported by the layout.
   *
   * @returns A new array of the supported key values.
   *
   * #### Notes
   * This can be useful for authoring tools and debugging, when it's
   * necessary to know which keys are available for shortcut use.
   */
  keys(): string[]

  /**
   * Test whether the given key is a valid value for the layout.
   *
   * @param key - The user provided key to test for validity.
   *
   * @returns `true` if the key is valid, `false` otherwise.
   */
  isValidKey(key: string): boolean

  /**
   * Get the key for a `'keydown'` event.
   *
   * @param event - The event object for a `'keydown'` event.
   *
   * @returns The associated key value, or an empty string if the event
   *   does not represent a valid primary key.
   */
  keyForKeydownEvent(event: KeyboardEvent): string
}

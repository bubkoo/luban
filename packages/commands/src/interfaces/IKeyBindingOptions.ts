import { ReadonlyJSONObject } from '@luban/json'

/**
 * An options object for creating a key binding.
 */
export interface IKeyBindingOptions {
  /**
   * The default key sequence for the key binding.
   *
   * A key sequence is composed of one or more keystrokes, where each
   * keystroke is a combination of modifiers and a primary key.
   *
   * Most key sequences will contain a single keystroke. Key sequences
   * with multiple keystrokes are called "chords", and are useful for
   * implementing modal input (ala Vim).
   *
   * Each keystroke in the sequence should be of the form:
   *   `[<modifier 1> [<modifier 2> [<modifier N> ]]]<primary key>`
   *
   * The supported modifiers are: `Accel`, `Alt`, `Cmd`, `Ctrl`, and
   * `Shift`. The `Accel` modifier is translated to `Cmd` on Mac and
   * `Ctrl` on all other platforms. The `Cmd` modifier is ignored on
   * non-Mac platforms.
   *
   * Keystrokes are case sensitive.
   *
   * **Examples:** `['Accel C']`, `['Shift F11']`, `['D', 'D']`
   */
  keys: string[]

  /**
   * The CSS selector for the key binding.
   *
   * The key binding will only be invoked when the selector matches a
   * node on the propagation path of the keydown event. This allows
   * the key binding to be restricted to user-defined contexts.
   *
   * The selector must not contain commas.
   */
  selector: string

  /**
   * The id of the command to execute when the binding is matched.
   */
  command: string

  /**
   * The arguments for the command, if necessary.
   *
   * The default value is an empty object.
   */
  args?: ReadonlyJSONObject

  /**
   * The key sequence to use when running on Windows.
   *
   * If provided, this will override `keys` on Windows platforms.
   */
  winKeys?: string[]

  /**
   * The key sequence to use when running on Mac.
   *
   * If provided, this will override `keys` on Mac platforms.
   */
  macKeys?: string[]

  /**
   * The key sequence to use when running on Linux.
   *
   * If provided, this will override `keys` on Linux platforms.
   */
  linuxKeys?: string[]
}

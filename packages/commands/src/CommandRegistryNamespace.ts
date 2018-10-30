import { ReadonlyJSONObject, JSONExt } from '@luban/json'
import { ISignal, Signal } from '@luban/signaling'
import { IDisposable, DisposableDelegate } from '@luban/disposable'
import { ICommandOptions } from './interfaces/ICommandOptions'
import { IKeyBinding } from './interfaces/IKeyBinding'
import { IKeyBindingOptions } from './interfaces/IKeyBindingOptions'
import { ICommandChangedArgs } from './interfaces/ICommandChangedArgs'
import { ICommandExecutedArgs } from './interfaces/ICommandExecutedArgs'
import { IKeyBindingChangedArgs } from './interfaces/IKeyBindingChangedArgs'

export namespace CommandRegistry {
  /**
   * A type alias for a user-defined command function.
   */
  export type CommandFunc<T> = (args: ReadonlyJSONObject) => T

  /**
   * A type alias for a simple immutable string dataset.
   */
  export type Dataset = { readonly [key: string]: string }

  /**
     * An options object for creating a command.
     *
     * #### Notes
     * A command is an abstract representation of code to be executed along
     * with metadata for describing how the command should be displayed in
     * a visual representation.
     *
     * A command is a collection of functions, *not* methods. The command
     * registry will always invoke the command functions with a `thisArg`
     * which is `undefined`.
     */
  export interface ICommandOptions {
    /**
     * The function to invoke when the command is executed.
     *
     * #### Notes
     * This should return the result of the command (if applicable) or
     * a promise which yields the result. The result is resolved as a
     * promise and that promise is returned to the code which executed
     * the command.
     *
     * This may be invoked even when `isEnabled` returns `false`.
     */
    execute: CommandFunc<any | Promise<any>>

    /**
     * The label for the command.
     *
     * #### Notes
     * This can be a string literal, or a function which returns the
     * label based on the provided command arguments.
     *
     * The label is often used as the primary text for the command.
     *
     * The default value is an empty string.
     */
    label?: string | CommandFunc<string>

    /**
     * The index of the mnemonic character in the command's label.
     *
     * #### Notes
     * This can be an index literal, or a function which returns the
     * mnemonic index based on the provided command arguments.
     *
     * The mnemonic character is often used by menus to provide easy
     * single-key keyboard access for triggering a menu item. It is
     * typically rendered as an underlined character in the label.
     *
     * The default value is `-1`.
     */
    mnemonic?: number | CommandFunc<number>

    /**
     * @deprecated Use `iconClass` instead.
     */
    icon?: string | CommandFunc<string>

    /**
     * The icon class for the command.
     *
     * #### Notes
     * This class name will be added to the icon node for the visual
     * representation of the command.
     *
     * Multiple class names can be separated with white space.
     *
     * This can be a string literal, or a function which returns the
     * icon based on the provided command arguments.
     *
     * The default value is an empty string.
     */
    iconClass?: string | CommandFunc<string>

    /**
     * The icon label for the command.
     *
     * #### Notes
     * This label will be added as text to the icon node for the visual
     * representation of the command.
     *
     * This can be a string literal, or a function which returns the
     * label based on the provided command arguments.
     *
     * The default value is an empty string.
     */
    iconLabel?: string | CommandFunc<string>

    /**
     * The caption for the command.
     *
     * #### Notes
     * This should be a simple one line description of the command. It
     * is used by some visual representations to show quick info about
     * the command.
     *
     * This can be a string literal, or a function which returns the
     * caption based on the provided command arguments.
     *
     * The default value is an empty string.
     */
    caption?: string | CommandFunc<string>

    /**
     * The usage text for the command.
     *
     * #### Notes
     * This should be a full description of the command, which includes
     * information about the structure of the arguments and the type of
     * the return value. It is used by some visual representations when
     * displaying complete help info about the command.
     *
     * This can be a string literal, or a function which returns the
     * usage text based on the provided command arguments.
     *
     * The default value is an empty string.
     */
    usage?: string | CommandFunc<string>

    /**
     * The general class name for the command.
     *
     * #### Notes
     * This class name will be added to the primary node for the visual
     * representation of the command.
     *
     * Multiple class names can be separated with white space.
     *
     * This can be a string literal, or a function which returns the
     * class name based on the provided command arguments.
     *
     * The default value is an empty string.
     */
    className?: string | CommandFunc<string>

    /**
     * The dataset for the command.
     *
     * #### Notes
     * The dataset values will be added to the primary node for the
     * visual representation of the command.
     *
     * This can be a dataset object, or a function which returns the
     * dataset object based on the provided command arguments.
     *
     * The default value is an empty dataset.
     */
    dataset?: Dataset | CommandFunc<Dataset>

    /**
     * A function which indicates whether the command is enabled.
     *
     * #### Notes
     * Visual representations may use this value to display a disabled
     * command as grayed-out or in some other non-interactive fashion.
     *
     * The default value is `() => true`.
     */
    isEnabled?: CommandFunc<boolean>

    /**
     * A function which indicates whether the command is toggled.
     *
     * #### Notes
     * Visual representations may use this value to display a toggled
     * command in a different form, such as a check mark icon for a
     * menu item or a depressed state for a toggle button.
     *
     * The default value is `() => false`.
     */
    isToggled?: CommandFunc<boolean>

    /**
     * A function which indicates whether the command is visible.
     *
     * #### Notes
     * Visual representations may use this value to hide or otherwise
     * not display a non-visible command.
     *
     * The default value is `() => true`.
     */
    isVisible?: CommandFunc<boolean>
  }

  /**
   * An arguments object for the `commandChanged` signal.
   */
  export interface ICommandChangedArgs {
    /**
     * The id of the associated command.
     *
     * This will be `undefined` when the type is `'many-changed'`.
     */
    readonly id: string | undefined

    /**
     * Whether the command was added, removed, or changed.
     */
    readonly type: 'added' | 'removed' | 'changed' | 'many-changed'
  }

  /**
   * An arguments object for the `commandExecuted` signal.
   */
  export interface ICommandExecutedArgs {
    /**
     * The id of the associated command.
     */
    readonly id: string

    /**
     * The arguments object passed to the command.
     */
    readonly args: ReadonlyJSONObject

    /**
     * The promise which resolves with the result of the command.
     */
    readonly result: Promise<any>
  }

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

  /**
   * An object which represents a key binding.
   *
   * #### Notes
   * A key binding is an immutable object created by a registry.
   */
  export interface IKeyBinding {
    /**
     * The key sequence for the binding.
     */
    readonly keys: ReadonlyArray<string>

    /**
     * The CSS selector for the binding.
     */
    readonly selector: string

    /**
     * The command executed when the binding is matched.
     */
    readonly command: string

    /**
     * The arguments for the command.
     */
    readonly args: ReadonlyJSONObject
  }

  /**
   * An arguments object for the `keyBindingChanged` signal.
   */
  export interface IKeyBindingChangedArgs {
    /**
     * The key binding which was changed.
     */
    readonly binding: IKeyBinding

    /**
     * Whether the key binding was added or removed.
     */
    readonly type: 'added' | 'removed'
  }

  /**
   * An object which holds the results of parsing a keystroke.
   */
  export interface IKeystrokeParts {
    /**
     * Whether `'Cmd'` appears in the keystroke.
     */
    cmd: boolean

    /**
     * Whether `'Ctrl'` appears in the keystroke.
     */
    ctrl: boolean

    /**
     * Whether `'Alt'` appears in the keystroke.
     */
    alt: boolean

    /**
     * Whether `'Shift'` appears in the keystroke.
     */
    shift: boolean

    /**
     * The primary key for the keystroke.
     */
    key: string
  }

  /**
   * Parse a keystroke into its constituent components.
   *
   * @param keystroke - The keystroke of interest.
   *
   * @returns The parsed components of the keystroke.
   *
   * #### Notes
   * The keystroke should be of the form:
   *   `[<modifier 1> [<modifier 2> [<modifier N> ]]]<primary key>`
   *
   * The supported modifiers are: `Accel`, `Alt`, `Cmd`, `Ctrl`, and
   * `Shift`. The `Accel` modifier is translated to `Cmd` on Mac and
   * `Ctrl` on all other platforms.
   *
   * The parsing is tolerant and will not throw exceptions. Notably:
   *   - Duplicate modifiers are ignored.
   *   - Extra primary keys are ignored.
   *   - The order of modifiers and primary key is irrelevant.
   *   - The keystroke parts should be separated by whitespace.
   *   - The keystroke is case sensitive.
   */
  export function parseKeystroke(keystroke: string): IKeystrokeParts {
    let key = ''
    let alt = false
    let cmd = false
    let ctrl = false
    let shift = false
    for (const token of keystroke.split(/\s+/)) {
      if (token === 'Accel') {
        if (Platform.IS_MAC) {
          cmd = true
        } else {
          ctrl = true
        }
      } else if (token === 'Alt') {
        alt = true
      } else if (token === 'Cmd') {
        cmd = true
      } else if (token === 'Ctrl') {
        ctrl = true
      } else if (token === 'Shift') {
        shift = true
      } else if (token.length > 0) {
        key = token
      }
    }
    return { cmd, ctrl, alt, shift, key }
  }

  /**
   * Normalize a keystroke into a canonical representation.
   *
   * @param keystroke - The keystroke of interest.
   *
   * @returns The normalized representation of the keystroke.
   *
   * #### Notes
   * This normalizes the keystroke by removing duplicate modifiers and
   * extra primary keys, and assembling the parts in a canonical order.
   *
   * The `Cmd` modifier is ignored on non-Mac platforms.
   */
  export function normalizeKeystroke(keystroke: string): string {
    let mods = ''
    const parts = parseKeystroke(keystroke)
    if (parts.ctrl) {
      mods += 'Ctrl '
    }
    if (parts.alt) {
      mods += 'Alt '
    }
    if (parts.shift) {
      mods += 'Shift '
    }
    if (parts.cmd && Platform.IS_MAC) {
      mods += 'Cmd '
    }
    return mods + parts.key
  }

  /**
   * Create a normalized keystroke for a `'keydown'` event.
   *
   * @param event - The event object for a `'keydown'` event.
   *
   * @returns A normalized keystroke, or an empty string if the event
   *   does not represent a valid keystroke for the given layout.
   */
  export function keystrokeForKeydownEvent(event: KeyboardEvent): string {
    const key = getKeyboardLayout().keyForKeydownEvent(event)
    if (!key) {
      return ''
    }
    let mods = ''
    if (event.ctrlKey) {
      mods += 'Ctrl '
    }
    if (event.altKey) {
      mods += 'Alt '
    }
    if (event.shiftKey) {
      mods += 'Shift '
    }
    if (event.metaKey && Platform.IS_MAC) {
      mods += 'Cmd '
    }
    return mods + key
  }
}

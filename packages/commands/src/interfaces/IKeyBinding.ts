import { ReadonlyJSONObject } from '@luban/json'

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

import { CommandFunc, Dataset } from './Types'

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

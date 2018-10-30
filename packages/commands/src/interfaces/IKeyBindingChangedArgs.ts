import { IKeyBinding } from './IKeyBinding'

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

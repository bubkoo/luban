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

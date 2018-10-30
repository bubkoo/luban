import { ReadonlyJSONObject } from '@luban/json'

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

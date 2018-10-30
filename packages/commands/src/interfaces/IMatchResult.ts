import { IKeyBinding } from './IKeyBinding'

/**
 * An object which holds the results of a key binding match.
 */
export interface IMatchResult {
  /**
   * The best key binding which exactly matches the key sequence.
   */
  exact: IKeyBinding | null

  /**
   * Whether there are bindings which partially match the sequence.
   */
  partial: boolean
}

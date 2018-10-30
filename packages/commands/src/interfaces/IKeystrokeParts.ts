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

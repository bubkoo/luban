import { ReadonlyJSONObject, JSONExt } from '@luban/json'
import { ISignal, Signal } from '@luban/signaling'
import { IDisposable, DisposableDelegate } from '@luban/disposable'
import { ICommandOptions } from './interfaces/ICommandOptions'
import { IKeyBinding } from './interfaces/IKeyBinding'
import { IKeyBindingOptions } from './interfaces/IKeyBindingOptions'
import { ICommandChangedArgs } from './interfaces/ICommandChangedArgs'
import { ICommandExecutedArgs } from './interfaces/ICommandExecutedArgs'
import { IKeyBindingChangedArgs } from './interfaces/IKeyBindingChangedArgs'

/**
 * An object which manages a collection of commands.
 *
 * #### Notes
 * A command registry can be used to populate a variety of action-based
 * widgets, such as command palettes, menus, and toolbars.
 */
export class CommandRegistry {

  private _timerID = 0
  private _replaying = false
  private _keystrokes: string[] = []
  private _keyBindings: IKeyBinding[] = []
  private _keydownEvents: KeyboardEvent[] = []
  private _exactKeyMatch: IKeyBinding | null = null
  private _commands: { [id: string]: Private.ICommand } = Object.create(null)
  private _commandChanged = new Signal<this, ICommandChangedArgs>(this)
  private _commandExecuted = new Signal<this, ICommandExecutedArgs>(this)
  private _keyBindingChanged = new Signal<this, IKeyBindingChangedArgs>(this)

  /**
   * Construct a new command registry.
   */
  constructor() { }

  /**
   * A signal emitted when a command has changed.
   *
   * #### Notes
   * This signal is useful for visual representations of commands which
   * need to refresh when the state of a relevant command has changed.
   */
  get commandChanged(): ISignal<this, ICommandChangedArgs> {
    return this._commandChanged
  }

  /**
   * A signal emitted when a command has executed.
   *
   * #### Notes
   * Care should be taken when consuming this signal. It is intended to
   * be used largely for debugging and logging purposes. It should not
   * be (ab)used for general purpose spying on command execution.
   */
  get commandExecuted(): ISignal<this, ICommandExecutedArgs> {
    return this._commandExecuted
  }

  /**
   * A signal emitted when a key binding is changed.
   */
  get keyBindingChanged(): ISignal<this, IKeyBindingChangedArgs> {
    return this._keyBindingChanged
  }

  /**
   * A read-only array of the key bindings in the registry.
   */
  get keyBindings(): ReadonlyArray<IKeyBinding> {
    return this._keyBindings
  }

  /**
   * List the ids of the registered commands.
   *
   * @returns A new array of the registered command ids.
   */
  listCommands(): string[] {
    return Object.keys(this._commands)
  }

  /**
   * Test whether a specific command is registered.
   *
   * @param id - The id of the command of interest.
   *
   * @returns `true` if the command is registered, `false` otherwise.
   */
  hasCommand(id: string): boolean {
    return id in this._commands
  }

  /**
   * Add a command to the registry.
   *
   * @param id - The unique id of the command.
   *
   * @param options - The options for the command.
   *
   * @returns A disposable which will remove the command.
   *
   * @throws An error if the given `id` is already registered.
   */
  addCommand(id: string, options: ICommandOptions): IDisposable {
    if (id in this._commands) {
      throw new Error(`Command '${id}' already registered.`)
    }

    this._commands[id] = Private.createCommand(options)
    this._commandChanged.emit({ id, type: 'added' })

    // Return a disposable which will remove the command.
    return new DisposableDelegate(() => {
      delete this._commands[id]
      this._commandChanged.emit({ id, type: 'removed' })
    })
  }

  /**
   * Notify listeners that the state of a command has changed.
   *
   * @param id - The id of the command which has changed. If more than
   *   one command has changed, this argument should be omitted.
   *
   * @throws An error if the given `id` is not registered.
   *
   * #### Notes
   * This method should be called by the command author whenever the
   * application state changes such that the results of the command
   * metadata functions may have changed.
   *
   * This will cause the `commandChanged` signal to be emitted.
   */
  notifyCommandChanged(id?: string): void {
    if (id !== undefined && !(id in this._commands)) {
      throw new Error(`Command '${id}' is not registered.`)
    }
    this._commandChanged.emit({ id, type: id ? 'changed' : 'many-changed' })
  }

  /**
   * Get the display label for a specific command.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns The display label for the command, or an empty string
   *   if the command is not registered.
   */
  label(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): string {
    const cmd = this._commands[id]
    return cmd ? cmd.label(args) : ''
  }

  /**
   * Get the mnemonic index for a specific command.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns The mnemonic index for the command, or `-1` if the
   *   command is not registered.
   */
  mnemonic(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): number {
    const cmd = this._commands[id]
    return cmd ? cmd.mnemonic(args) : -1
  }

  /**
   * Get the icon class for a specific command.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns The icon class for the command, or an empty string if
   *   the command is not registered.
   */
  iconClass(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): string {
    const cmd = this._commands[id]
    return cmd ? cmd.iconClass(args) : ''
  }

  /**
   * Get the icon label for a specific command.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns The icon label for the command, or an empty string if
   *   the command is not registered.
   */
  iconLabel(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): string {
    const cmd = this._commands[id]
    return cmd ? cmd.iconLabel(args) : ''
  }

  /**
   * Get the short form caption for a specific command.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns The caption for the command, or an empty string if the
   *   command is not registered.
   */
  caption(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): string {
    const cmd = this._commands[id]
    return cmd ? cmd.caption(args) : ''
  }

  /**
   * Get the usage help text for a specific command.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns The usage text for the command, or an empty string if
   *   the command is not registered.
   */
  usage(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): string {
    const cmd = this._commands[id]
    return cmd ? cmd.usage(args) : ''
  }

  /**
   * Get the extra class name for a specific command.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns The class name for the command, or an empty string if
   *   the command is not registered.
   */
  className(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): string {
    const cmd = this._commands[id]
    return cmd ? cmd.className(args) : ''
  }

  /**
   * Get the dataset for a specific command.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns The dataset for the command, or an empty dataset if
   *   the command is not registered.
   */
  dataset(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): CommandRegistry.Dataset {
    const cmd = this._commands[id]
    return cmd ? cmd.dataset(args) : {}
  }

  /**
   * Test whether a specific command is enabled.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns A boolean indicating whether the command is enabled,
   *   or `false` if the command is not registered.
   */
  isEnabled(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): boolean {
    const cmd = this._commands[id]
    return cmd ? cmd.isEnabled(args) : false
  }

  /**
   * Test whether a specific command is toggled.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns A boolean indicating whether the command is toggled,
   *   or `false` if the command is not registered.
   */
  isToggled(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): boolean {
    const cmd = this._commands[id]
    return cmd ? cmd.isToggled(args) : false
  }

  /**
   * Test whether a specific command is visible.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns A boolean indicating whether the command is visible,
   *   or `false` if the command is not registered.
   */
  isVisible(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): boolean {
    const cmd = this._commands[id]
    return cmd ? cmd.isVisible(args) : false
  }

  /**
   * Execute a specific command.
   *
   * @param id - The id of the command of interest.
   *
   * @param args - The arguments for the command.
   *
   * @returns A promise which resolves with the result of the command.
   *
   * #### Notes
   * The promise will reject if the command throws an exception,
   * or if the command is not registered.
   */
  execute(id: string, args: ReadonlyJSONObject = JSONExt.emptyObject): Promise<any> {
    const cmd = this._commands[id]
    if (!cmd) {
      return Promise.reject(new Error(`Command '${id}' not registered.`))
    }

    let value: any
    try {
      value = cmd.execute(args)
    } catch (err) {
      value = Promise.reject(err)
    }

    const result = Promise.resolve(value)
    this._commandExecuted.emit({ id, args, result })
    return result
  }

  /**
   * Add a key binding to the registry.
   *
   * @param options - The options for creating the key binding.
   *
   * @returns A disposable which removes the added key binding.
   *
   * #### Notes
   * If multiple key bindings are registered for the same sequence, the
   * binding with the highest selector specificity is executed first. A
   * tie is broken by using the most recently added key binding.
   *
   * Ambiguous key bindings are resolved with a timeout. As an example,
   * suppose two key bindings are registered: one with the key sequence
   * `['Ctrl D']`, and another with `['Ctrl D', 'Ctrl W']`. If the user
   * presses `Ctrl D`, the first binding cannot be immediately executed
   * since the user may intend to complete the chord with `Ctrl W`. For
   * such cases, a timer is used to allow the chord to be completed. If
   * the chord is not completed before the timeout, the first binding
   * is executed.
   */
  addKeyBinding(options: IKeyBindingOptions): IDisposable {
    const binding = Private.createKeyBinding(options)
    this._keyBindings.push(binding)
    this._keyBindingChanged.emit({ binding, type: 'added' })

    // Return a disposable which will remove the binding.
    return new DisposableDelegate(() => {
      ArrayExt.removeFirstOf(this._keyBindings, binding)
      this._keyBindingChanged.emit({ binding, type: 'removed' })
    })
  }

  /**
   * Process a `'keydown'` event and invoke a matching key binding.
   *
   * @param e - The event object for a `'keydown'` event.
   *
   * #### Notes
   * This should be called in response to a `'keydown'` event in order
   * to invoke the command for the best matching key binding.
   *
   * The registry **does not** install its own listener for `'keydown'`
   * events. This allows the application full control over the nodes
   * and phase for which the registry processes `'keydown'` events.
   */
  processKeydownEvent(e: KeyboardEvent): void {
    // Bail immediately if playing back keystrokes.
    if (this._replaying) {
      return
    }

    // Get the normalized keystroke for the event.
    const keystroke = CommandRegistry.keystrokeForKeydownEvent(e)

    // If the keystroke is not valid for the keyboard layout, replay
    // any suppressed events and clear the pending state.
    if (!keystroke) {
      this.replayKeydownEvents()
      this.clearPendingState()
      return
    }

    // Add the keystroke to the current key sequence.
    this._keystrokes.push(keystroke)

    // Find the exact and partial matches for the key sequence.
    const { exact, partial } = Private.matchKeyBinding(
      this._keyBindings, this._keystrokes, e,
    )

    // If there is no exact match and no partial match, replay
    // any suppressed events and clear the pending state.
    if (!exact && !partial) {
      this.replayKeydownEvents()
      this.clearPendingState()
      return
    }

    // Stop propagation of the event. If there is only a partial match,
    // the event will be replayed if a final exact match never occurs.
    e.preventDefault()
    e.stopPropagation()

    // If there is an exact match but no partial match, the exact match
    // can be dispatched immediately. The pending state is cleared so
    // the next key press starts from the default state.
    if (exact && !partial) {
      this.executeKeyBinding(exact)
      this.clearPendingState()
      return
    }

    // If there is both an exact match and a partial match, the exact
    // match is stored for future dispatch in case the timer expires
    // before a more specific match is triggered.
    if (exact) {
      this._exactKeyMatch = exact
    }

    // Store the event for possible playback in the future.
    this._keydownEvents.push(e)

    // (Re)start the timer to dispatch the most recent exact match
    // in case the partial match fails to result in an exact match.
    this.startTimer()
  }

  /**
   * Start or restart the pending timeout.
   */
  private startTimer(): void {
    this.clearTimer()
    this._timerID = setTimeout(
      () => {
        this.onPendingTimeout()
      },
      Private.CHORD_TIMEOUT,
    )
  }

  /**
   * Clear the pending timeout.
   */
  private clearTimer(): void {
    if (this._timerID !== 0) {
      clearTimeout(this._timerID)
      this._timerID = 0
    }
  }

  /**
   * Replay the keydown events which were suppressed.
   */
  private replayKeydownEvents(): void {
    if (this._keydownEvents.length === 0) {
      return
    }

    this._replaying = true
    this._keydownEvents.forEach(Private.replayKeyEvent)
    this._replaying = false
  }

  /**
   * Execute the command for the given key binding.
   *
   * If the command is missing or disabled, a warning will be logged.
   */
  private executeKeyBinding(binding: IKeyBinding): void {
    const { command, args } = binding
    if (!this.hasCommand(command) || !this.isEnabled(command, args)) {
      const word = this.hasCommand(command) ? 'enabled' : 'registered'
      const keys = binding.keys.join(', ')
      const msg1 = `Cannot execute key binding '${keys}':`
      const msg2 = `command '${command}' is not ${word}.`
      console.warn(`${msg1} ${msg2}`)
      return
    }
    this.execute(command, args)
  }

  /**
   * Clear the internal pending state.
   */
  private clearPendingState(): void {
    this.clearTimer()
    this._exactKeyMatch = null
    this._keystrokes.length = 0
    this._keydownEvents.length = 0
  }

  /**
   * Handle the partial match timeout.
   */
  private onPendingTimeout(): void {
    this._timerID = 0
    if (this._exactKeyMatch) {
      this.executeKeyBinding(this._exactKeyMatch)
    } else {
      this.replayKeydownEvents()
    }
    this.clearPendingState()
  }
}

export namespace CommandRegistry {

}

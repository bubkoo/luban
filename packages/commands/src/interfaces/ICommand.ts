export interface ICommand {
  readonly execute: CommandFunc<any>
  readonly label: CommandFunc<string>
  readonly mnemonic: CommandFunc<number>
  readonly iconClass: CommandFunc<string>
  readonly iconLabel: CommandFunc<string>
  readonly caption: CommandFunc<string>
  readonly usage: CommandFunc<string>
  readonly className: CommandFunc<string>
  readonly dataset: CommandFunc<Dataset>
  readonly isEnabled: CommandFunc<boolean>
  readonly isToggled: CommandFunc<boolean>
  readonly isVisible: CommandFunc<boolean>
}

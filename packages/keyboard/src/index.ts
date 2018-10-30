import { IKeyboardLayout } from './IKeyboardLayout'
import { EN_US } from './en_us'

export * from './en_us'
export * from './IKeyboardLayout'
export * from './KeyboardLayout'

/**
 * Get the global application keyboard layout instance.
 *
 * @returns The keyboard layout for use by the application.
 *
 * #### Notes
 * The default keyboard layout is US-English.
 */
export function getKeyboardLayout(): IKeyboardLayout {
  return Private.keyboardLayout
}

/**
 * Set the global application keyboard layout instance.
 *
 * @param - The keyboard layout for use by the application.
 *
 * #### Notes
 * The keyboard layout should typically be set on application startup
 * to a layout which is appropriate for the user's system.
 */
export function setKeyboardLayout(layout: IKeyboardLayout): void {
  Private.keyboardLayout = layout
}

namespace Private {
  export let keyboardLayout = EN_US
}

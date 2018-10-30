export namespace Platform {
  /**
   * A flag indicating whether the platform is Mac.
   */
  export const IS_MAC = !!navigator.platform.match(/Mac/i)

  /**
   * A flag indicating whether the platform is Windows.
   */
  export const IS_WIN = !!navigator.platform.match(/Win/i)

  /**
   * A flag indicating whether the browser is IE.
   */
  export const IS_IE = /Trident/.test(navigator.userAgent)

  /**
   * A flag indicating whether the browser is Edge.
   */
  export const IS_EDGE = /Edge/.test(navigator.userAgent)
}

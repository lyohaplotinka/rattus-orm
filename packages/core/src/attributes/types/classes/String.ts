import { isString } from '../../../support/utils'
import { Type } from './Type'

export class String extends Type<string | null> {
  /**
   * Make the value for the attribute.
   */
  protected makeCasted(value: any): string | null {
    if (value === undefined) {
      return this.value
    }

    if (isString(value)) {
      return value
    }

    if (value === null && this.isNullable) {
      return value
    }

    // biome-ignore lint/style/useTemplate: should be allowed here
    return value + ''
  }
}

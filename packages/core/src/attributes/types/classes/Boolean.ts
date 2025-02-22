import type { Model } from '../../../model/Model'
import { isNumber, isString } from '../../../support/utils'
import { Type } from './Type'

export class Boolean extends Type<boolean | null> {
  /**
   * Create a new Boolean attribute instance.
   */
  constructor(model: Model, value: boolean | null) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  protected makeCasted(value: any): boolean | null {
    if (value === undefined) {
      return this.value
    }

    if (typeof value === 'boolean') {
      return value
    }

    if (isString(value)) {
      if (!value.length) {
        return false
      }
      const int = Number.parseInt(value, 0)
      return isNaN(int) ? true : !!int
    }

    if (isNumber(value)) {
      return !!value
    }

    if (value === null && this.isNullable) {
      return value
    }

    return false
  }
}

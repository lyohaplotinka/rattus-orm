import type { Model } from '../../Model'
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

    if (typeof value === 'string') {
      if (!value.length) {
        return false
      }
      const int = parseInt(value, 0)
      return isNaN(int) ? true : !!int
    }

    if (typeof value === 'number') {
      return !!value
    }

    if (value === null && this.isNullable) {
      return value
    }

    return false
  }
}

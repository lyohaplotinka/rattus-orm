import type { Model } from '../../../model/Model'
import { isNumber } from '../../../support/utils'
import { Type } from './Type'

export class Number extends Type<number | null> {
  /**
   * Create a new Number attribute instance.
   */
  constructor(model: Model, value: number | null) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  protected makeCasted(value: any): number | null {
    if (value === undefined) {
      return this.value
    }

    if (isNumber(value)) {
      return value
    }

    if (['string', 'boolean'].includes(typeof value)) {
      return +value
    }

    if (value === null && this.isNullable) {
      return value
    }

    return 0
  }
}

import type { Model } from '../../Model'
import { Type } from './Type'

export class Number extends Type {
  /**
   * Create a new Number attribute instance.
   */
  constructor(model: Model, value: number | null) {
    super(model, value)
  }

  /**
   * Make the value for the attribute.
   */
  public make(value: any): number | null {
    if (value === undefined) {
      return this.value
    }

    if (typeof value === 'number') {
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

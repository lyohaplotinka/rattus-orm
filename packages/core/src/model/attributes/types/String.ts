import { isString } from '@/support/utils'

import type { Model } from '../../Model'
import { Type } from './Type'

export class String extends Type<string | null> {
  /**
   * Create a new String attribute instance.
   */
  constructor(model: Model, value: string | null) {
    super(model, value)
  }

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

    return value + ''
  }
}

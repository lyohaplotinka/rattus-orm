import type { Model } from '../../../model/Model'
import { isNumber, isString } from '../../../support/utils'
import { Type } from './Type'

export class DateField extends Type<Date | null> {
  constructor(model: Model, value: Date | null) {
    super(model, value)
  }

  public makeCasted(value?: any): Date | null {
    if (value instanceof Date) {
      return value
    }
    if (isNumber(value) || isString(value)) {
      const date = new Date(value)
      if (!isNaN(date as any)) {
        return date
      }
    }

    if (value === null && this.isNullable) {
      return value
    }

    console.warn('[Rattus ORM] invalid date detected, nullish date returned')
    return new Date(0)
  }
}

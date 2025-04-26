import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { DateAttr } from './classes/DateAttr'

export const createDateField = (model: ModelConstructor<any>, value: Date | null) => {
  return new DateAttr(model.newRawInstance(), value)
}

export function createDateFieldAF(
  value: Date | null,
  nullable = false,
): AttributeFactory<Date | null> {
  return (model: ModelConstructor<any>) => {
    const attr = new DateAttr(model.newRawInstance(), value)
    if (nullable) {
      attr.nullable()
    }
    return attr
  }
}

import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { Number } from './classes/Number'

export const createNumberField = (model: ModelConstructor<any>, value: number | null) => {
  return new Number(model.newRawInstance(), value)
}

export function createNumberFieldAF(
  value: number | null,
  nullable = false,
): AttributeFactory<number | null> {
  return (model: ModelConstructor<any>) => {
    const attr = new Number(model.newRawInstance(), value)
    if (nullable) {
      attr.nullable()
    }
    return attr
  }
}

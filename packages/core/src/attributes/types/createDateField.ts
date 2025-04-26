import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { nullableTypeFactory } from '@/attributes/types/utils'
import { DateAttr } from './classes/DateAttr'

export const createDateField = (model: ModelConstructor<any>, value: Date | null) => {
  return new DateAttr(model.newRawInstance(), value)
}

export function createDateFieldAF(
  value: Date | null,
  nullable = false,
): AttributeFactory<Date | null> {
  return (model: ModelConstructor<any>) => nullableTypeFactory(DateAttr, model, nullable, value)
}

import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { nullableTypeFactory } from '@/attributes/types/utils'
import { DateAttr } from './classes/DateAttr'

export function createDateField(
  value: Date | null,
  nullable = false,
): AttributeFactory<Date | null> {
  return (model: ModelConstructor<any>) => nullableTypeFactory(DateAttr, model, nullable, value)
}

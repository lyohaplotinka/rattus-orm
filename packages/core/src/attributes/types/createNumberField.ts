import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { nullableTypeFactory } from '@/attributes/types/utils'
import { Number } from './classes/Number'

export function createNumberField(
  value: number | null,
  nullable = false,
): AttributeFactory<number | null> {
  return (model: ModelConstructor<any>) => nullableTypeFactory(Number, model, nullable, value)
}

import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { nullableTypeFactory } from '@/attributes/types/utils'
import { String } from './classes/String'

export function createStringField(
  value: string | null,
  nullable = false,
): AttributeFactory<string | null> {
  return (model: ModelConstructor<any>) => nullableTypeFactory(String, model, nullable, value)
}

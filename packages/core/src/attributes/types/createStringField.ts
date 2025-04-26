import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { nullableTypeFactory } from '@/attributes/types/utils'
import { String } from './classes/String'

export const createStringField = (model: ModelConstructor<any>, value: string | null) => {
  return new String(model.newRawInstance(), value)
}

export function createStringFieldAF(
  value: string | null,
  nullable = false,
): AttributeFactory<string | null> {
  return (model: ModelConstructor<any>) => nullableTypeFactory(String, model, nullable, value)
}

import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { nullableTypeFactory } from '@/attributes/types/utils'
import { Boolean as BooleanAttr } from './classes/Boolean'

export const createBooleanField = (model: ModelConstructor<any>, value: boolean | null) => {
  return new BooleanAttr(model.newRawInstance(), value)
}

export function createBooleanFieldAF(
  value: boolean | null,
  nullable = false,
): AttributeFactory<boolean | null> {
  return (model: ModelConstructor<any>) => nullableTypeFactory(BooleanAttr, model, nullable, value)
}

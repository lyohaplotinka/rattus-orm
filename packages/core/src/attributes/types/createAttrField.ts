import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { Attr } from './classes/Attr'

export const createAttrField = (model: ModelConstructor<any>, value?: any) => {
  return new Attr(model.newRawInstance(), value)
}

export function createAttrFieldAF(value?: any): AttributeFactory<Attr> {
  return (model: ModelConstructor<any>) => new Attr(model.newRawInstance(), value)
}

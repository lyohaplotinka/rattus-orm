import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { Attr } from './classes/Attr'

export function createAttrField(value?: any): AttributeFactory<Attr> {
  return (model: ModelConstructor<any>) => new Attr(model.newRawInstance(), value)
}

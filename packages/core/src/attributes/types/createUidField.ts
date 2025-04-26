import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { Uid } from './classes/Uid'

export function createUidField(value?: any): AttributeFactory<any> {
  return (model: ModelConstructor<any>) => new Uid(model.newRawInstance(), value)
}

import type { ModelConstructor } from '@/model/types'

import { AttributeFactory } from '@/attributes/common/contracts'
import { Uid } from './classes/Uid'

export const createUidField = (model: ModelConstructor<any>, value?: any) => {
  return new Uid(model.newRawInstance(), value)
}

export function createUidFieldAF(value?: any): AttributeFactory<any> {
  return (model: ModelConstructor<any>) => new Uid(model.newRawInstance(), value)
}

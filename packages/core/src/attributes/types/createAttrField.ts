import type { ModelConstructor } from '@/model/types'

import { Attr } from './classes/Attr'

export const createAttrField = (model: ModelConstructor<any>, value?: any) => {
  return new Attr(model.newRawInstance(), value)
}

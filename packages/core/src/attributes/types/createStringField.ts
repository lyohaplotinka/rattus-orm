import type { ModelConstructor } from '@/model/types'

import { String } from './classes/String'

export const createStringField = (model: ModelConstructor<any>, value: string | null) => {
  return new String(model.newRawInstance(), value)
}

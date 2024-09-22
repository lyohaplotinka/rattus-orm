import type { ModelConstructor } from '../model/types'
import { Boolean } from './classes/types/Boolean'

export const createBooleanField = (model: ModelConstructor<any>, value: boolean | null) => {
  return new Boolean(model.newRawInstance(), value)
}

import type { ModelConstructor } from '../../model/types'
import { Uid } from './classes/Uid'

export const createUidField = (model: ModelConstructor<any>, value?: any) => {
  return new Uid(model.newRawInstance(), value)
}

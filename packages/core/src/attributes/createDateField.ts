import type { ModelConstructor } from '../model/types'
import { DateAttr } from './classes/types/DateAttr'

export const createDateField = (model: ModelConstructor<any>, value: Date | null) => {
  return new DateAttr(model.newRawInstance(), value)
}

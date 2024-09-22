import type { ModelConstructor } from '../model/types'
import { Number } from './classes/types/Number'

export const createNumberField = (model: ModelConstructor<any>, value: number | null) => {
  return new Number(model.newRawInstance(), value)
}

import type { ModelConstructor } from '../model/types'
import { DateField } from './classes/types/DateField'

export const createDateField = (model: ModelConstructor<any>, value: Date | null) => {
  return new DateField(model.newRawInstance(), value)
}

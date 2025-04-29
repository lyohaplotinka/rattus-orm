import type { ModelConstructor } from '@/model/types'

import { BelongsTo } from './classes/belongs-to'

export const createBelongsToRelation = (
  relatedConstructor: ModelConstructor<any>,
  foreignKey: string,
  ownerKey?: string,
) => {
  return (modelConstructor: ModelConstructor<any>) => {
    const model = modelConstructor.newRawInstance()
    const related = relatedConstructor.newRawInstance()
    return new BelongsTo(model, related, foreignKey, ownerKey ?? related.$getLocalKey())
  }
}

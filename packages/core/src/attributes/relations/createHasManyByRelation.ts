import type { ModelConstructor } from '@/model/types'

import { HasManyBy } from './classes/has-many-by'

export const createHasManyByRelation = (
  relatedConstructor: ModelConstructor<any>,
  foreignKey: string,
  ownerKey?: string,
) => {
  return (modelConstructor: ModelConstructor<any>) => {
    const model = modelConstructor.newRawInstance()
    const related = relatedConstructor.newRawInstance()
    return new HasManyBy(model, related, foreignKey, ownerKey ?? related.$getLocalKey())
  }
}

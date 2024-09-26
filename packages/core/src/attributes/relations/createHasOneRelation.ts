import type { ModelConstructor } from '@/model/types'

import { HasOne } from './classes/has-one'

export const createHasOneRelation = (
  modelConstructor: ModelConstructor<any>,
  related: ModelConstructor<any>,
  foreignKey: string,
  localKey?: string,
) => {
  const model = modelConstructor.newRawInstance()
  return new HasOne(model, related.newRawInstance(), foreignKey, localKey ?? model.$getLocalKey())
}

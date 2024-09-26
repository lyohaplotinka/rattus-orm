import type { ModelConstructor } from '@/model/types'

import { MorphOne } from './classes/morph-one'

export const createMorphOneRelation = (
  modelConstructor: ModelConstructor<any>,
  related: ModelConstructor<any>,
  id: string,
  type: string,
  localKey?: string,
) => {
  const model = modelConstructor.newRawInstance()
  return new MorphOne(model, related.newRawInstance(), id, type, localKey ?? model.$getLocalKey())
}

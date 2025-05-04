import type { ModelConstructor } from '@/model/types'

import { MorphOne } from './classes/morph-one'

export const createMorphOneRelation = (
  related: () => ModelConstructor<any>,
  id: string,
  type: string,
  localKey?: string,
) => {
  return (modelConstructor: ModelConstructor<any>) => {
    const model = modelConstructor.newRawInstance()
    return new MorphOne(
      model,
      related().newRawInstance(),
      id,
      type,
      localKey ?? model.$getLocalKey(),
    )
  }
}

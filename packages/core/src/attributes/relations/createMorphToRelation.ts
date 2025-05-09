import type { ModelConstructor } from '@/model/types'

import { MorphTo } from './classes/morph-to'

export const createMorphToRelation = (
  related: () => ModelConstructor<any>[],
  id: string,
  type: string,
  ownerKey = '',
) => {
  return (modelConstructor: ModelConstructor<any>) => {
    const model = modelConstructor.newRawInstance()
    return new MorphTo(
      model,
      related().map((model) => model.newRawInstance()),
      id,
      type,
      ownerKey,
    )
  }
}

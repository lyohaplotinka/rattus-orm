import type { ModelConstructor } from '@/model/types'

import { HasMany } from './classes/has-many'

export const createHasManyRelation = (
  modelConstructor: ModelConstructor<any>,
  related: ModelConstructor<any>,
  foreignKey: string,
  localKey?: string,
) => {
  const model = modelConstructor.newRawInstance()

  return new HasMany(model, related.newRawInstance(), foreignKey, localKey ?? model.$getLocalKey())
}

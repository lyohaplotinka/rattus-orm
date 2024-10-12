import type { PropertyDecorator } from '@/attributes/common/contracts'
import { createMorphOneRelation } from '@/attributes/relations/createMorphOneRelation'
import type { ModelConstructor } from '@/model/types'

/**
 * Create a morph-one attribute property decorator.
 */
export function MorphOne(
  related: () => ModelConstructor<any>,
  id: string,
  type: string,
  localKey?: string,
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => createMorphOneRelation(self, related(), id, type, localKey))
  }
}

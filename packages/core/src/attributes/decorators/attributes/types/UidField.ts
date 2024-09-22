import { createUidField } from '@/attributes/createUidField'

import type { PropertyDecorator } from '../../Contracts'

/**
 * Create a Uid attribute property decorator.
 */
export function UidField(): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => createUidField(self))
  }
}

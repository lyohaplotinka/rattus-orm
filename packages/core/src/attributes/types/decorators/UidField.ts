import type { PropertyDecorator } from '../../common/contracts'
import { createUidField } from '../createUidField'

/**
 * Create a Uid attribute property decorator.
 */
export function UidField(): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => createUidField(self))
  }
}

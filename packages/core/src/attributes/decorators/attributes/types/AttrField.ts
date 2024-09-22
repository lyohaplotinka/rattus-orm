import { createAttrField } from '@/attributes/createAttrField'

import type { PropertyDecorator } from '../../Contracts'

/**
 * Create an Attr attribute property decorator.
 */
export function AttrField(value?: any): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => createAttrField(self, value))
  }
}

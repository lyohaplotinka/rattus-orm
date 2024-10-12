import type { PropertyDecorator } from '../../common/contracts'
import { createAttrField } from '../createAttrField'

/**
 * Create an Attr attribute property decorator.
 */
export function AttrField(value?: any): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => createAttrField(self, value))
  }
}

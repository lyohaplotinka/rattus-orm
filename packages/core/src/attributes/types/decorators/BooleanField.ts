import type { PropertyDecorator, TypeOptions } from '../../common/contracts'
import { createBooleanField } from '../createBooleanField'

/**
 * Create a Boolean attribute property decorator.
 */
export function BooleanField(value: boolean | null, options: TypeOptions = {}): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      const attr = createBooleanField(self, value)
      if (options.nullable) {
        attr.nullable()
      }

      return attr
    })
  }
}

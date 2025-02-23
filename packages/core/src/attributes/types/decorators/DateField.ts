import type { PropertyDecorator, TypeOptions } from '../../common/contracts'
import { createDateField } from '../createDateField'

/**
 * Create a Number attribute property decorator.
 */
export function DateField(
  value: Date | string | number | null,
  options: TypeOptions = {},
): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      const attr = createDateField(self, value ? new Date(value) : null)

      if (options.nullable) {
        attr.nullable()
      }

      return attr
    })
  }
}

import type { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a Number attribute property decorator.
 */
export function DateField(value: Date | string | number | null, options: TypeOptions = {}): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      const attr = self.dateField(value)

      if (options.nullable) {
        attr.nullable()
      }

      return attr
    })
  }
}

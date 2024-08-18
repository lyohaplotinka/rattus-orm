import type { PropertyDecorator, TypeOptions } from '../../Contracts'

/**
 * Create a String attribute property decorator.
 */
export function StringField(value: string | null, options: TypeOptions = {}): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => {
      const attr = self.stringField(value)

      if (options.nullable) {
        attr.nullable()
      }

      return attr
    })
  }
}

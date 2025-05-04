import type { PropertyDecorator, TypeOptions } from '../../common/contracts'
import { createStringField } from '../createStringField'

/**
 * Create a String attribute property decorator.
 */
export function StringField(value: string | null, options: TypeOptions = {}): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, createStringField(value, options.nullable))
  }
}

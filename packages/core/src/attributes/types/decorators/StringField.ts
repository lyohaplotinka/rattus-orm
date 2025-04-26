import type { PropertyDecorator, TypeOptions } from '../../common/contracts'
import { createStringFieldAF } from '../createStringField'

/**
 * Create a String attribute property decorator.
 */
export function StringField(value: string | null, options: TypeOptions = {}): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, createStringFieldAF(value, options.nullable))
  }
}

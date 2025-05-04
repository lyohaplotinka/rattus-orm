import type { PropertyDecorator, TypeOptions } from '../../common/contracts'
import { createNumberField } from '../createNumberField'

/**
 * Create a Number attribute property decorator.
 */
export function NumberField(value: number | null, options: TypeOptions = {}): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, createNumberField(value, options.nullable))
  }
}

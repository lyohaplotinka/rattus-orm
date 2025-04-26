import type { PropertyDecorator, TypeOptions } from '../../common/contracts'
import { createBooleanField } from '../createBooleanField'

/**
 * Create a Boolean attribute property decorator.
 */
export function BooleanField(value: boolean | null, options: TypeOptions = {}): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, createBooleanField(value, options.nullable))
  }
}

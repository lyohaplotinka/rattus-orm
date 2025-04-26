import type { PropertyDecorator, TypeOptions } from '../../common/contracts'
import { createBooleanFieldAF } from '../createBooleanField'

/**
 * Create a Boolean attribute property decorator.
 */
export function BooleanField(value: boolean | null, options: TypeOptions = {}): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, createBooleanFieldAF(value, options.nullable))
  }
}

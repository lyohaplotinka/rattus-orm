import type { Model } from '../../../model/Model'
import type { PropertyDecorator } from '../../common/contracts'

/**
 * Create a has-one attribute property decorator.
 */
export function HasOne(related: () => typeof Model, foreignKey: string, localKey?: string): PropertyDecorator {
  return (target, propertyKey) => {
    const self = target.$self()

    self.setRegistry(propertyKey, () => self.hasOne(related(), foreignKey, localKey))
  }
}

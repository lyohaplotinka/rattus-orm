import type { Model } from '../../model/Model'

export type PropertyDecorator = (target: Model, propertyKey: string) => void

export interface TypeOptions {
  nullable?: boolean
}

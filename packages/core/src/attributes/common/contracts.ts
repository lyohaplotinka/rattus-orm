import { Attribute } from '@/attributes/common/attribute'
import type { Model } from '@/model/Model'
import { ModelConstructor } from '@/model/types'

export type PropertyDecorator = (target: Model, propertyKey: string) => void

export interface TypeOptions {
  nullable?: boolean
}

export type AttributeFactory<T> = (model: ModelConstructor<any>) => Attribute<T>
export type ModelAttributeFactory<T> = (...args: any[]) => AttributeFactory<T>

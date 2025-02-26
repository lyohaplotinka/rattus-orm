import { ModelConstructor } from '@rattus-orm/core'
import type { Attribute } from '@rattus-orm/core/field-types'

type Simplify<T> = { [K in keyof T]: T[K] } & {}

export type ClasslessAttributesConfig = Record<
  string,
  (model: ModelConstructor<any>) => Attribute<any>
>

export type InferTypesFromClasslessAttributesConfig<T extends ClasslessAttributesConfig> =
  Simplify<{
    [Key in keyof T]: T[Key] extends (model: ModelConstructor<any>) => Attribute<infer V>
      ? V
      : never
  }>

export type ClasslessFieldConfigEntry<Args extends any[], ReturnType extends Attribute<any>> = (
  ...args: Args
) => (model: ModelConstructor<any>) => ReturnType

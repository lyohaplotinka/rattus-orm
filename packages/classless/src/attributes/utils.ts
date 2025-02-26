import { ModelConstructor } from '@rattus-orm/core'
import type { Attribute } from '@rattus-orm/core/field-types'
import { ClasslessFieldConfigEntry } from '../entity/types'

export function createClasslessFieldConfigFunction<T extends (...args: any[]) => any>(
  func: T,
): T extends (model: ModelConstructor<any>, ...restArgs: infer RestArgs) => infer ReturnType
  ? ReturnType extends Attribute<any>
    ? ClasslessFieldConfigEntry<RestArgs, ReturnType>
    : never
  : never {
  return ((...args: any[]) =>
    (model: ModelConstructor<any>) =>
      func(model, ...args)) as any
}

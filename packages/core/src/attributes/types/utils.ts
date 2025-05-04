import { ModelConstructor } from '@/model/types'
import { Constructor } from '@/types'
import { Type } from './classes/Type'

export function nullableTypeFactory<T extends Type<any>>(
  AttrC: Constructor<T>,
  model: ModelConstructor<any>,
  nullable: boolean | undefined,
  value: any,
) {
  const attr = new AttrC(model.newRawInstance(), value)
  if (nullable) {
    attr.nullable()
  }
  return attr
}

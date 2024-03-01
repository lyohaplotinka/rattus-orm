import type { Model, Relation, Type } from '@rattus-orm/core'

import { getConstructorParameters, initializeModelSchemasForEntity } from '../utils/model'
import { isValidClassFieldContext } from '../utils/types'

export type TypeMaker<T> = (context: Model) => Type<T> | Relation

export function createTypeBaseDecorator<T>(value: T, typeMaker: TypeMaker<T>): any {
  return function (_v: unknown, ctx: ClassFieldDecoratorContext<Model, T>) {
    if (!isValidClassFieldContext(ctx)) {
      throw new Error('[Rattus ORM] ES2023 decorators can be used only with public non-static properties')
    }

    const { name } = ctx
    return function (this: Model, v: T): T {
      const schemas = initializeModelSchemasForEntity(this.$entity())
      const attr = typeMaker(this)

      schemas[name] = attr

      const { options: modelOptions, attributes } = getConstructorParameters(this)
      if (modelOptions?.fill === false) {
        return v
      }

      const fillValue = name in (attributes ?? {}) ? attributes?.[name] : value
      this.$fillField(name, attr, fillValue)

      return this[name]
    }
  }
}

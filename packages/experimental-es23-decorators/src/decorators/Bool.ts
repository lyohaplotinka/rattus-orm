import type { Model, TypeOptions } from '@rattus-orm/core'

import { getConstructorParameters, initializeModelSchemasForEntity } from '../utils/model'
import { isValidClassFieldContext } from '../utils/types'

export function Bool(value: boolean | null, options: TypeOptions = {}): any {
  return function (_v: unknown, ctx: ClassFieldDecoratorContext<Model, boolean | null>) {
    if (!isValidClassFieldContext(ctx)) {
      throw new Error('[Rattus ORM] ES2023 decorators can be used only with public non-static properties')
    }

    const { name } = ctx
    return function (this: Model, v: boolean | null): boolean | null {
      const self = this.$self()

      const schemas = initializeModelSchemasForEntity(self.entity)
      const attr = self.boolean(value)

      if (options.nullable) {
        attr.nullable()
      }

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

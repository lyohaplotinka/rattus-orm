import type { Model, Relation, Type, TypeOptions } from '@rattus-orm/core'

import { getConstructorParameters, initializeModelSchemasForEntity } from '../utils/model'
import { isValidClassFieldContext } from '../utils/types'

export type TypeMaker<T> = (context: Model) => Type<T> | Relation

function createTypeBaseDecorator<T>(value: T, typeMaker: TypeMaker<T>): any {
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

export function Attr(value?: any): any {
  return createTypeBaseDecorator(value, (context) => {
    return context.$self().attr(value)
  })
}

export function Bool(value: boolean | null, options: TypeOptions = {}): any {
  return createTypeBaseDecorator(value, (context) => {
    const attr = context.$self().boolean(value)

    if (options.nullable) {
      attr.nullable()
    }

    return attr
  })
}

export function Num(value: number | null, options: TypeOptions = {}): any {
  return createTypeBaseDecorator(value, (context) => {
    const attr = context.$self().number(value)

    if (options.nullable) {
      attr.nullable()
    }

    return attr
  })
}

export function Str(value: string | null, options: TypeOptions = {}): any {
  return createTypeBaseDecorator(value, (context) => {
    const attr = context.$self().string(value)

    if (options.nullable) {
      attr.nullable()
    }

    return attr
  })
}

export function Uid(): any {
  return createTypeBaseDecorator(undefined, (context) => {
    return context.$self().uid()
  })
}

import type { Model } from '@rattus-orm/core'
import { isUnknownRecord } from '@rattus-orm/core/utils/isUnknownRecord'

export type ClassFieldDecoratorContextWithStringKey<T> = Omit<ClassFieldDecoratorContext<T>, 'name'> & { name: string }

export function isValidClassFieldContext(ctx: unknown): ctx is ClassFieldDecoratorContextWithStringKey<Model> {
  return (
    isUnknownRecord(ctx) &&
    ctx.kind === 'field' &&
    ctx.private === false &&
    ctx.static === false &&
    typeof ctx.name === 'string'
  )
}

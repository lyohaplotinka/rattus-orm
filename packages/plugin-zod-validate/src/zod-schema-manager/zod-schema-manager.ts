import type { Database } from '@rattus-orm/core'
import { AttrAttr, BooleanAttr, NumberAttr, StringAttr } from '@rattus-orm/core'
import { Type } from '@rattus-orm/core'
import type { ModulePath } from '@rattus-orm/utils/sharedTypes'
import { z, type ZodSchema, type ZodTypeAny } from 'zod'

import { isModelWithZodSchemas } from '../types/guards'

export class ZodSchemaManager {
  protected readonly schemas = new Map<string, ZodSchema>()

  public getSchemaForEntity(modulePath: ModulePath, database: Database) {
    const key = this.getSchemaKey(modulePath)
    if (this.schemas.has(key)) {
      return this.schemas.get(key)!
    }
    return this.createAndSaveSchemaForEntity(modulePath, database)
  }

  protected createAndSaveSchemaForEntity([connection, module]: ModulePath, database: Database) {
    const model = database.getModel(module)

    const fields = model.$fields()
    let schema = z.object({})

    const modelConstructor = model.$self()

    for (const key in fields) {
      const field = fields[key]
      let fieldSchema: ZodTypeAny = z.any()
      const isNullable = field instanceof Type && field.isTypeNullable()

      if (isModelWithZodSchemas(modelConstructor) && !!modelConstructor.$zodSchemas[key]) {
        fieldSchema = modelConstructor.$zodSchemas[key]
      } else {
        switch (true) {
          case field instanceof NumberAttr:
            fieldSchema = z.number()
            break
          case field instanceof StringAttr:
            fieldSchema = z.string()
            break
          case field instanceof BooleanAttr:
            fieldSchema = z.boolean()
            break
          case field instanceof AttrAttr:
            fieldSchema = z.unknown()
            break
        }

        if (isNullable) {
          fieldSchema = fieldSchema.nullable()
        }
      }

      schema = schema.merge(
        z.object({
          [key]: fieldSchema,
        }),
      )
    }

    this.schemas.set(this.getSchemaKey([connection, module]), schema)
    return schema
  }

  protected getSchemaKey(modulePath: ModulePath): string {
    return modulePath.join('/')
  }
}

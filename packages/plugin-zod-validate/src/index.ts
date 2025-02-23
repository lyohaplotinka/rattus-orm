import type { Model } from '@rattus-orm/core'
import type { DatabasePlugin, Elements, ModulePath } from '@rattus-orm/core'
import { RattusEvents } from '@rattus-orm/core'
import type { ZodError, ZodType as ZodLibType } from 'zod'

import { RattusZodValidationError } from './exceptions/exceptions'
import { isModelWithZodSchemas } from './types/guards'
import type {
  ModelWithZodSchemas,
  RattusZodValidationPluginParams,
  ZodIssueWithData,
} from './types/types'
import { ZodSchemaManager } from './zod-schema-manager/zod-schema-manager'

const defaultParams: RattusZodValidationPluginParams = {
  strict: false,
}

export function RattusZodValidationPlugin(
  params: RattusZodValidationPluginParams = defaultParams,
): DatabasePlugin {
  const schemaManager = new ZodSchemaManager()

  return (db) => {
    const validate = (data: Elements, modulePath: ModulePath) => {
      const schema = schemaManager.getSchemaForEntity(modulePath, db)
      const zodIssues: ZodIssueWithData[] = []
      const originalErrors: ZodError[] = []

      const strict = Array.isArray(params.strict)
        ? params.strict.includes(modulePath[1])
        : params.strict === true

      for (const entityData of Object.values(data)) {
        const result = schema.safeParse(entityData)
        if (!result.success) {
          originalErrors.push(result.error)
          result.error.errors.forEach((error) => {
            zodIssues.push({
              ...error,
              data: entityData,
            })
          })
        }
      }

      if (zodIssues.length) {
        const error = new RattusZodValidationError(
          zodIssues,
          modulePath[0],
          modulePath[1],
          originalErrors,
        )
        if (strict) {
          throw error
        }
        error.toWarning()
      }

      return data
    }

    db.on(RattusEvents.SAVE, validate)
    db.on(RattusEvents.INSERT, validate)
    db.on(RattusEvents.UPDATE, validate)
    db.on(RattusEvents.REPLACE, validate)
  }
}

export function ZodFieldType(type: ZodLibType) {
  return (target: Model, propertyKey: string) => {
    const self = target.$self() as ModelWithZodSchemas

    if (!isModelWithZodSchemas(self)) {
      Object.defineProperty(self, '$zodSchemas', {
        value: {},
        configurable: true,
        writable: false,
        enumerable: true,
      })
    }

    self.$zodSchemas[propertyKey] = type
  }
}

export { isRattusZodValidationError } from './types/guards'
export type { RattusZodValidationPluginParams }

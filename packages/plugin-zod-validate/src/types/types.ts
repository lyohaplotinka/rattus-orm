import type { Model, ModelConstructor } from '@rattus-orm/core'
import type { ZodIssue } from 'zod'
import { type ZodSchema } from 'zod'

export interface ModelWithZodSchemas extends ModelConstructor<Model> {
  $zodSchemas: Record<string, ZodSchema>
}

export type RattusZodValidationPluginParams = {
  strict: boolean | string[]
}

export type ZodIssueWithData = ZodIssue & {
  data: Record<string, any>
}

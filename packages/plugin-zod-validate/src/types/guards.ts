import { RattusZodValidationError } from '../exceptions/exceptions'
import type { ModelWithZodSchemas } from './types'

export const isModelWithZodSchemas = (value: unknown): value is ModelWithZodSchemas => {
  return (
    // biome-ignore lint/style/noUnusedTemplateLiteral: should be allowed here
    `$zodSchemas` in (value as Record<string, unknown>) &&
    typeof (value as Record<string, unknown>).newRawInstance === 'function'
  )
}

export const isRattusZodValidationError = (value: unknown): value is RattusZodValidationError => {
  return value instanceof RattusZodValidationError
}

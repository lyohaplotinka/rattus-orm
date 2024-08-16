import { isUnknownRecord } from '@rattus-orm/core/utils/isUnknownRecord'
import type { ZodError } from 'zod'

import type { ZodIssueWithData } from '../types/types'

export class RattusZodValidationError extends Error {
  public name = 'RattusZodValidationError'

  constructor(
    protected readonly zodErrors: ZodIssueWithData[],
    protected readonly connection: string,
    protected readonly entity: string,
    public readonly originalZodErrors: ZodError[],
  ) {
    super()
    this.message = this.getMessageTextFromErrors()
  }

  public toWarning() {
    console.warn(this.message)
  }

  protected getMessageTextFromErrors() {
    const texts: string[] = [`Data validation failed (${this.connection}.${this.entity})`]

    this.zodErrors.forEach((error, index) => {
      const failedValue = error.path.reduce<any>((result, current) => {
        if (Array.isArray(result) || isUnknownRecord(result)) {
          result = (result as any)[current]
        }
        return result
      }, error.data)
      texts.push(
        `${index + 1}. ${error.message}: ${JSON.stringify(failedValue)} (${[this.entity]}.${error.path.join('.')})`,
      )
    })

    return texts.join('\n')
  }
}

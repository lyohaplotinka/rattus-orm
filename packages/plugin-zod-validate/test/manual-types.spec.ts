import { describe, expect } from 'vitest'
import { Model, Num, Str, Attr } from '@rattus-orm/core'
import { isRattusZodValidationError, ZodType } from '../src'
import { z } from 'zod'
import { createDb } from './test-utils'
import { RattusZodValidationError } from '../src/exceptions/exceptions'

type JobType = {
  title: string
  seniority: number
}

class UserProp extends Model {
  public static entity = 'userProp'
  public static $zodSchemas = {
    age: z.number().gt(18),
  }

  @Str('')
  public id: string

  @Num(0)
  public age: number
}

class UserDecorators extends Model {
  public static entity = 'userDecorators'

  @Str('')
  public id: string

  @ZodType(z.object({ title: z.string(), seniority: z.number() }))
  @Attr()
  public job: JobType
}

describe('manual-types', () => {
  it('types from static properties are working', () => {
    const repo = createDb().getRepository(UserProp)

    try {
      repo.save({ id: '1', age: 10 })
      throw new Error('Error not happened!')
    } catch (e) {
      expect(e).toBeInstanceOf(RattusZodValidationError)
      if (isRattusZodValidationError(e)) {
        expect(e.message).toContain('userProp.age')
      } else {
        throw e
      }
    }
  })

  it('types from decorators are working', () => {
    const repo = createDb().getRepository(UserDecorators)

    try {
      repo.save({ id: '1', job: { title: 'test' } })
      throw new Error('Error not happened!')
    } catch (e) {
      expect(e).toBeInstanceOf(RattusZodValidationError)
      if (isRattusZodValidationError(e)) {
        expect(e.message).toContain('userDecorators.job')
      } else {
        throw e
      }
    }
  })
})

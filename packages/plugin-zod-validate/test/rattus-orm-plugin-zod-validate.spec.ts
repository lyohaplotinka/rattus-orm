import { describe, expect, vi } from 'vitest'
import { createDatabase, Model } from '@rattus-orm/core'
import { RattusZodValidationError } from '../src/exceptions/exceptions'
import { isRattusZodValidationError, RattusZodValidationPlugin, ZodFieldType } from '../src'
import { ObjectDataProvider } from '@rattus-orm/core/object-data-provider'
import { z } from 'zod'
import { AttrField, NumberField, StringField } from '@rattus-orm/core/field-types'

export const createDb = (strict: boolean | string[] = true) => {
  return createDatabase({
    connection: 'entities',
    dataProvider: new ObjectDataProvider(),
    plugins: [RattusZodValidationPlugin({ strict })],
  }).start()
}

type JobType = {
  title: string
  seniority: number
}

class User extends Model {
  public static entity = 'user'

  @NumberField(0)
  public id: string

  @StringField('')
  public name: string
}

class UserProp extends Model {
  public static entity = 'userProp'
  public static $zodSchemas = {
    age: z.number().gt(18),
  }

  @StringField('')
  public id: string

  @NumberField(0)
  public age: number
}

class UserDecorators extends Model {
  public static entity = 'userDecorators'

  @StringField('')
  public id: string

  @ZodFieldType(z.object({ title: z.string(), seniority: z.number() }))
  @AttrField()
  public job: JobType
}

describe('rattus-orm-plugin-zod-validate', () => {
  it('performs basic validation', () => {
    const repo = createDb().getRepository(User)

    try {
      repo.save({ id: 'asd', name: 'test' })
      throw new Error('Error not happened!')
    } catch (e) {
      console.log(e)
      expect(e).toBeInstanceOf(RattusZodValidationError)
      if (isRattusZodValidationError(e)) {
        expect(e.originalZodErrors[0].errors[0].path).toStrictEqual(['id'])
      }
    }
  })

  it('logs text warning in console if not in strict mode', () => {
    const repo = createDb(false).getRepository(User)

    const consoleSpy = vi.spyOn(console, 'warn')
    let loggedMsg = ''
    consoleSpy.mockImplementation((...args: any[]) => {
      loggedMsg = args[0]
    })

    expect(() => repo.save({ id: 'asd', name: 'test' })).not.toThrowError()
    expect(loggedMsg).toContain('user.id')
  })

  it('respects array strict [1]', () => {
    const repo = createDb([User.entity]).getRepository(User)
    expect(() => repo.save({ id: 'asd', name: 'test' })).toThrow(RattusZodValidationError)
  })

  it('respects array strict [2]', () => {
    const repo = createDb(['other']).getRepository(User)
    expect(() => repo.save({ id: 'asd', name: 'test' })).not.toThrow(RattusZodValidationError)
  })

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
})

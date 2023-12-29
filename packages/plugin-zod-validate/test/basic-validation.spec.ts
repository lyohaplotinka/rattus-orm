import { describe, expect, vi } from 'vitest'
import { Model, Num, Str } from '@rattus-orm/core'
import { createDb } from './test-utils'
import { RattusZodValidationError } from '../src/exceptions/exceptions'
import { isRattusZodValidationError } from '../src'

class User extends Model {
  public static entity = 'user'

  @Num(0)
  public id: string

  @Str('')
  public name: string
}

describe('rattus-orm-plugin-zod-validate', () => {
  it('performs basic validation', () => {
    const repo = createDb().getRepository(User)

    try {
      repo.save({ id: 'asd', name: 'test' })
      throw new Error('Error not happened!')
    } catch (e) {
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
})

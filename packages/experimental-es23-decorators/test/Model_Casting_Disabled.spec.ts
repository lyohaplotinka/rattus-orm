import { describe, expect, it } from 'vitest'
import { Num, Str, Bool } from '../src'
import { Model } from '@rattus-orm/core'

describe('Disabling casting for model', () => {
  class User extends Model {
    static dataTypeCasting = false
    static entity = 'users'

    @Num(0)
    num: number

    @Str('')
    public str: string

    @Bool(false)
    public bool: boolean
  }

  it('data not type-casted when casting is disabled via property', () => {
    expect(new User({ num: '1' }).num).toEqual('1')
    expect(new User({ str: 1 }).str).toEqual(1)
    expect(new User({ bool: 0 }).bool).toEqual(0)
  })
})

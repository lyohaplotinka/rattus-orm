import { describe, expect, it } from 'vitest'
import { Model } from '../../src'
import { NumberField, StringField, BooleanField, DateField } from '../../src/attributes/field-types'

describe('Disabling casting for model', () => {
  class User extends Model {
    static dataTypeCasting = false
    static entity = 'users'

    @NumberField(0)
    num: number

    @StringField('')
    public str: string

    @BooleanField(false)
    public bool: boolean

    @DateField(new Date())
    public date: Date
  }

  it('data not type-casted when casting is disabled via property', () => {
    expect(new User({ num: '1' }).num).toEqual('1')
    expect(new User({ str: 1 }).str).toEqual(1)
    expect(new User({ bool: 0 }).bool).toEqual(0)
    expect(new User({ date: '2024-08-16T19:30:38.794Z' }).date).toEqual('2024-08-16T19:30:38.794Z')
  })
})

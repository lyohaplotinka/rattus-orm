import { Model } from '@/model/Model'
import { expect } from 'vitest'
import { createAttrFieldAF } from '../../src/attributes/types/createAttrField'
import { createBooleanFieldAF } from '../../src/attributes/types/createBooleanField'
import { createDateFieldAF } from '../../src/attributes/types/createDateField'
import { createNumberFieldAF } from '../../src/attributes/types/createNumberField'
import { createStringFieldAF } from '../../src/attributes/types/createStringField'

describe('unit/model/Model_Fields', () => {
  it('can define model fields as a static function', () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: createAttrFieldAF(null),
          str: createStringFieldAF(''),
          num: createNumberFieldAF(0),
          bool: createBooleanFieldAF(false),
          date: createDateFieldAF(new Date()),
        }
      }

      id!: any
      str!: string
      num!: number
      bool!: boolean
      date!: Date
    }

    const user = new User({
      str: 'string',
      num: 1,
      bool: true,
      date: 1723836212249,
    })

    expect(user.id).toBe(null)
    expect(user.str).toBe('string')
    expect(user.num).toBe(1)
    expect(user.bool).toBe(true)
    expect(user.date).toBeInstanceOf(Date)
    expect(user.date.getTime()).toBe(1723836212249)
  })
})

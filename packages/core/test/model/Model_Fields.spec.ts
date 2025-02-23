import { Model } from '@/model/Model'
import { expect } from 'vitest'
import { createAttrField } from '../../src/attributes/types/createAttrField'
import { createBooleanField } from '../../src/attributes/types/createBooleanField'
import { createDateField } from '../../src/attributes/types/createDateField'
import { createNumberField } from '../../src/attributes/types/createNumberField'
import { createStringField } from '../../src/attributes/types/createStringField'

describe('unit/model/Model_Fields', () => {
  it('can define model fields as a static function', () => {
    class User extends Model {
      static entity = 'users'

      static fields() {
        return {
          id: createAttrField(this, null),
          str: createStringField(this, ''),
          num: createNumberField(this, 0),
          bool: createBooleanField(this, false),
          date: createDateField(this, new Date()),
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

import { expect } from 'vitest'
import { ModelTestEdition } from '../../shared-utils/testUtils'

describe('unit/model/Model_Fields', () => {
  it('can define model fields as a static function', () => {
    class User extends ModelTestEdition {
      static entity = 'users'

      static fields() {
        return {
          id: this.attrField(null),
          str: this.stringField(''),
          num: this.numberField(0),
          bool: this.booleanField(false),
          date: this.dateField(new Date()),
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

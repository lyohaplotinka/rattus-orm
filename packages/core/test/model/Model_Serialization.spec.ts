import { DateField, AttrField } from '../../src/decorators'
import { ModelTestEdition } from '../../shared-utils/testUtils'

describe('unit/model/Model_Serialization', () => {
  class User extends ModelTestEdition {
    static entity = 'users'

    @AttrField() id!: number
    @AttrField() arr!: []
    @AttrField() obj!: {}
    @DateField(null) public date: Date
  }

  it('can serialize the model', () => {
    const user = new User({
      id: 1,
      arr: [1, 2, 3],
      obj: { key: 'value' },
      date: 1723836638794,
    })

    const expected = {
      id: 1,
      arr: [1, 2, 3],
      obj: { key: 'value' },
      date: '2024-08-16T19:30:38.794Z',
    }

    expect(user.$toJson()).toEqual(expected)
  })
})

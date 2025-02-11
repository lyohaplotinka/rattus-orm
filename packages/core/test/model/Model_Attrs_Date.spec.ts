import { Model } from '@/model/Model'
import { DateField } from '../../src/attributes/field-types'

describe('unit/model/Model_Attrs_Date', () => {
  it('casts the value to `Date` when instantiating the model', () => {
    class User extends Model {
      static entity = 'users'

      @DateField(null)
      date!: Date
    }

    // invalid date cases
    expect(new User({}).date.getTime()).toBe(0)
    expect(new User({ date: '' }).date.getTime()).toBe(0)
    expect(new User({ date: 'string' }).date.getTime()).toBe(0)
    expect(new User({ date: '1723836638794' }).date.getTime()).toBe(0)
    expect(new User({ date: null }).date.getTime()).toBe(0)

    // valid date cases
    expect(new User({ date: '0' }).date.getTime()).toBe(new Date('0').getTime())
    expect(new User({ date: 0 }).date.getTime()).toBe(0) // nullish date is expected here
    const dateStr = '2024-08-16T19:30:38.794Z'
    expect(new User({ date: dateStr }).date.getTime()).toBe(new Date(dateStr).getTime())
    expect(new User({ date: 1723836638794 }).date.getTime()).toBe(1723836638794)
  })

  it('accepts `null` when the `nullable` option is set', () => {
    class User extends Model {
      static entity = 'users'

      @DateField(null, { nullable: true })
      date!: Date | null
    }

    expect(new User({ date: null }).date).toBe(null)
  })
})

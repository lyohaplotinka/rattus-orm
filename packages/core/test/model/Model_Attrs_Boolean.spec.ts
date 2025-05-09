import { Model } from '@/model/Model'
import { BooleanField } from '../../src/attributes/types/decorators/BooleanField'

describe('unit/model/Model_Attrs_Boolean', () => {
  it('casts the value to `Boolean` when instantiating the model', () => {
    class User extends Model {
      static entity = 'users'

      @BooleanField(true)
      bool!: number
    }

    expect(new User({}).bool).toBe(true)
    expect(new User({ bool: '' }).bool).toBe(false)
    expect(new User({ bool: 'string' }).bool).toBe(true)
    expect(new User({ bool: '0' }).bool).toBe(false)
    expect(new User({ bool: 0 }).bool).toBe(false)
    expect(new User({ bool: 1 }).bool).toBe(true)
    expect(new User({ bool: true }).bool).toBe(true)
    expect(new User({ bool: null }).bool).toBe(false)
  })

  it('accepts `null` when the `nullable` option is set', () => {
    class User extends Model {
      static entity = 'users'

      @BooleanField(null, { nullable: true })
      bool!: boolean | null
    }

    expect(new User({}).bool).toBe(null)
    expect(new User({ bool: '' }).bool).toBe(false)
    expect(new User({ bool: 'string' }).bool).toBe(true)
    expect(new User({ bool: '0' }).bool).toBe(false)
    expect(new User({ bool: 0 }).bool).toBe(false)
    expect(new User({ bool: 1 }).bool).toBe(true)
    expect(new User({ bool: true }).bool).toBe(true)
    expect(new User({ bool: null }).bool).toBe(null)
  })
})

import { Model } from '@/model/Model'
import { StringField } from '../../src/attributes/types/decorators/StringField'

describe('unit/model/Model_Attrs_String', () => {
  it('casts the value to `String` when instantiating the model', () => {
    class User extends Model {
      static entity = 'users'

      @StringField('default')
      str!: string
    }

    expect(new User({}).str).toBe('default')
    expect(new User({ str: 'value' }).str).toBe('value')
    expect(new User({ str: 1 }).str).toBe('1')
    expect(new User({ str: true }).str).toBe('true')
    expect(new User({ str: null }).str).toBe('null')
  })

  it('accepts `null` when the `nullable` option is set', () => {
    class User extends Model {
      static entity = 'users'

      @StringField(null, { nullable: true })
      str!: string | null
    }

    expect(new User({}).str).toBe(null)
    expect(new User({ str: 'value' }).str).toBe('value')
    expect(new User({ str: 1 }).str).toBe('1')
    expect(new User({ str: true }).str).toBe('true')
    expect(new User({ str: null }).str).toBe(null)
  })
})

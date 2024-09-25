import { Model } from '@/index'
import { HasOne } from '@/decorators'
import { AttrField } from '@/attributes/field-types'

import Phone from './circular_relations_phone'

export default class User extends Model {
  static entity = 'users'

  @AttrField() id!: number

  @HasOne(() => Phone, 'userId')
  phone!: Phone | null
}

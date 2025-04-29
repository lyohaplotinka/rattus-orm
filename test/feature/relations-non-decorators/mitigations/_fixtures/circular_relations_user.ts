import { createHasOneRelation } from '@/attributes/field-relations'
import { createAttrField } from '@/attributes/field-types'
import { Model } from '@/index'

import Phone from './circular_relations_phone'

export default class User extends Model {
  static entity = 'users'

  public static fields() {
    return {
      id: createAttrField(this),
      phone: createHasOneRelation(this, Phone, 'userId'),
    }
  }

  declare id: number
  declare phone: Phone | null
}

import { createHasOneRelation } from '@/attributes/field-relations'
import { createAttrField } from '@/attributes/field-types'
import { Model } from '@/index'

import Phone from './circular_relations_phone'

export default class User extends Model {
  static entity = 'users'

  public static fields() {
    return {
      id: createAttrField(),
      phone: createHasOneRelation(() => Phone, 'userId'),
    }
  }

  declare id: number
  declare phone: Phone | null
}

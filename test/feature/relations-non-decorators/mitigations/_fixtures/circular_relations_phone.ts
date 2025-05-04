import { createBelongsToRelation } from '@/attributes/field-relations'
import { createAttrField } from '@/attributes/field-types'
import { Model } from '@/index'

import User from './circular_relations_user'

export default class Phone extends Model {
  static entity = 'phones'

  static fields() {
    return {
      id: createAttrField(),
      userId: createAttrField(),
      author: createBelongsToRelation(() => User, 'userId'),
    }
  }

  declare id: number
  declare userId: number | null
  declare author: User | null
}

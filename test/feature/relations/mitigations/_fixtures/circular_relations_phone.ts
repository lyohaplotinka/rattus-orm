import { Model } from '@/index'
import { AttrField, BelongsTo } from '@/decorators'

import User from './circular_relations_user'

export default class Phone extends Model {
  static entity = 'phones'

  @AttrField() id!: number
  @AttrField() userId!: number | null

  @BelongsTo(() => User, 'userId')
  author!: User | null
}

import type { Order, WherePrimaryClosure } from '@rattus-orm/core'

import type { QueryActions } from './const'

export type AsyncWhere = {
  field: WherePrimaryClosure | string
  value: any
  boolean: 'and' | 'or'
}
export type QueryAction = (typeof QueryActions)[keyof typeof QueryActions]
export type QueryConstraints = {
  wheres: AsyncWhere[]
  orders: Order[]
  offset: number
  limit: number
}
export type QueryConstraintsWithActionAndPayload = Partial<QueryConstraints> & {
  action: QueryAction
  payload?: any
}

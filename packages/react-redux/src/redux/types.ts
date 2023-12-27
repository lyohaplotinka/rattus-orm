import type { ModulePath } from '@rattus-orm/utils/sharedTypes'
import { type Action } from 'redux'

export const rattusReduxActions = {
  SAVE: 'save',
  FRESH: 'fresh',
  DESTROY: 'destroy',
  FLUSH: 'flush',
} as const

type JoinModulePath<T extends ModulePath> = T extends [infer Connection extends string, infer Module extends string]
  ? `${Connection}/${Module}`
  : never

export type RattusReduxActionName = (typeof rattusReduxActions)[keyof typeof rattusReduxActions]
export type RattusReducerPrefix<MP extends ModulePath> = `$$rattus/${JoinModulePath<MP>}`
export type RattusReducerActionName<MP extends ModulePath> = `${RattusReducerPrefix<MP>}/${RattusReduxActionName}`

export type RattusReducerAction<MP extends ModulePath> = Action<RattusReducerActionName<MP>> & {
  payload: any
}

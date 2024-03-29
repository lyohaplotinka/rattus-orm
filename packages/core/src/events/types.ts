import type { ModulePath, State } from '@/data/types'
import type { Callback } from '@/types'

export const RattusEvents = {
  CONNECTION_REGISTER: 'connection-register',
  MODULE_REGISTER: 'module-register',
  SAVE: 'save',
  INSERT: 'insert',
  REPLACE: 'replace',
  UPDATE: 'update',
  DELETE: 'delete',
  FLUSH: 'flush',
  DATA_CHANGED: 'data-changed',
} as const

export type CancelSubscriptionCallback = Callback<[], void>
export type ModuleRegisterEventPayload = { path: ModulePath; initialState?: State }
export type DataChangedEventPayload = { path: ModulePath; state: State }
export type RattusEvent = (typeof RattusEvents)[keyof typeof RattusEvents]
export type DataEventCallback<T, R = void> = (data: T, modulePath: ModulePath) => R
export type InternalListener = (param: unknown, modulePath: ModulePath) => unknown

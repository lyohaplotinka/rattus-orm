import type { Callback, ModulePath, State } from '@rattus-orm/utils/sharedTypes'

export const RattusEvents = {
  CONNECTION_REGISTER: 'connection-register',
  MODULE_REGISTER: 'module-register',
  SAVE: 'save',
  INSERT: 'insert',
  REPLACE: 'replace',
  UPDATE: 'update',
  DELETE: 'delete',
  FLUSH: 'flush',
} as const

export type CancelSubscriptionCallback = Callback<[], void>
export type ModuleRegisterEventPayload = { path: ModulePath; initialState?: State }
export type RattusEvent = (typeof RattusEvents)[keyof typeof RattusEvents]
export type DataEventCallback<T, R = void> = (data: T) => R
export type InternalListener = (param: unknown) => unknown

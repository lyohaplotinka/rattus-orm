import type { Constructor } from '../types'
import type { Model } from './Model'

export type ModelConstructor<M extends Model> = M & (M extends Model ? typeof Model : never)

export interface ModelConstructorOld<M extends Model> extends Constructor<M> {
  newRawInstance(): M
}

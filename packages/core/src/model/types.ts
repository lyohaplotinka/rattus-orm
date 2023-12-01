import type { Model } from './Model'

export type ModelConstructor<M extends Model> = M & (M extends Model ? typeof Model : never)

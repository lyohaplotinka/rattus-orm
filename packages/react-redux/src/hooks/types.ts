import type { Repository } from '@rattus-orm/core'
import type { Collection, Item, Model } from '@rattus-orm/core'

export const pullRepositoryKeys = [
  'save',
  'insert',
  'fresh',
  'destroy',
  'flush',
  'find',
  'all',
  'query',
] satisfies Array<keyof Repository>
export type RepositoryPullKeys = (typeof pullRepositoryKeys)[number]

export type RepositoryCustomKeys<R extends Repository<InstanceType<any>> = Repository<InstanceType<any>>> = Exclude<
  keyof R,
  RepositoryPullKeys
>

// CK = "Custom Keys"
export type PickedRepository<
  T extends typeof Model = typeof Model,
  R extends Repository<InstanceType<T>> = Repository<InstanceType<T>>,
  CK extends RepositoryCustomKeys<R> | undefined = undefined,
> = Pick<R, Exclude<RepositoryPullKeys, 'find'>> &
  (CK extends keyof R ? Pick<R, CK> : never) & {
    find: {
      (id: string | number): Item<InstanceType<T>>
      (ids: (string | number)[]): Collection<InstanceType<T>>
    }
  }

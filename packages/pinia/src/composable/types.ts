import type { Repository } from '@rattus-orm/core'
import type { Model } from '@rattus-orm/core'
import type { Collection, Item } from '@rattus-orm/core'
import type { ComputedRef } from 'vue'

export const pullRepositoryGettersKeys = ['find', 'all'] satisfies Array<keyof Repository>
export const pullRepositoryKeys = [
  'save',
  'insert',
  'fresh',
  'destroy',
  'flush',
  ...pullRepositoryGettersKeys,
] satisfies Array<keyof Repository>

export type RepositoryGettersKeys = (typeof pullRepositoryGettersKeys)[number]
export type RepositoryPullKeys = (typeof pullRepositoryKeys)[number]

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

export type ComputedPickedRepository<
  T extends typeof Model = typeof Model,
  R extends Repository<InstanceType<T>> = Repository<InstanceType<T>>,
  CK extends RepositoryCustomKeys<R> | undefined = undefined,
> = {
  [key in keyof Omit<PickedRepository<T, R, CK>, 'find'>]: key extends RepositoryGettersKeys
    ? (...args: Parameters<PickedRepository<T, R, CK>[key]>) => ComputedRef<ReturnType<PickedRepository<T, R, CK>[key]>>
    : PickedRepository<T, R, CK>[key]
} & {
  find: {
    (id: string | number): ComputedRef<Item<InstanceType<T>>>
    (ids: (string | number)[]): ComputedRef<Collection<InstanceType<T>>>
  }
}

export type RepositoryCustomKeys<R extends Repository<InstanceType<any>> = Repository<InstanceType<any>>> = Exclude<
  keyof R,
  RepositoryPullKeys
>

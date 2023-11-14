import '../types/vuex'

import type { Model, Repository } from '@rattus-orm/core'
import type { InjectionKey } from 'vue/dist/vue'
import type { Store } from 'vuex'
import { useStore } from 'vuex'

export type RepositoryCallback = <T extends Model>(repo: Repository<T>) => any

export const getRepository = <T extends typeof Model>(
  model: T,
  injectKey?: InjectionKey<Store<any>>,
): Repository<InstanceType<T>> => {
  const store = useStore(injectKey)
  return store.$repo(model) as Repository<InstanceType<T>>
}

export const useRepository = <T extends typeof Model, C extends RepositoryCallback>(
  model: T,
  callback: C,
  injectKey?: InjectionKey<Store<any>>,
): ReturnType<C> => {
  const repo = getRepository<T>(model, injectKey)
  return callback(repo)
}

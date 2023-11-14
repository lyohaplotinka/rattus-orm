import '../types/vuex'

import type { Model, ModelConstructor, Repository } from '@rattus-orm/core'
import type { InjectionKey } from 'vue/dist/vue'
import type { Store } from 'vuex'
import { useStore } from 'vuex'

export type RepositoryCallback = <T extends Model>(repo: Repository<T>) => any

export const getRepository = <T extends Model>(
  model: ModelConstructor<T>,
  injectKey?: InjectionKey<Store<any>>,
): Repository<T> => {
  const store = useStore(injectKey)
  return store.$repo(model) as Repository<T>
}

export const useRepository = <T extends Model, C extends RepositoryCallback>(
  model: ModelConstructor<T>,
  callback: C,
  injectKey?: InjectionKey<Store<any>>,
): ReturnType<C> => {
  const repo = getRepository<T>(model, injectKey)
  return callback(repo)
}

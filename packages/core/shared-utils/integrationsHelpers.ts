import type { Constructor, Database, DatabasePlugin, DataProvider, Model, Repository } from '../src'
import { getDatabaseManager } from '../src'
import { isDataProvider } from '../src/data/guards'
import { isFunction, isString } from '../src/support/utils'
import { RattusOrmError } from './feedback'

const useRepositorySkippedKeys = ['database', 'use', 'model', 'constructor'] as const
type UseRepositorySkippedKeys = (typeof useRepositorySkippedKeys)[number]
const isSkippedKey = (value: unknown): value is UseRepositorySkippedKeys => {
  return isString(value) && useRepositorySkippedKeys.includes(value as UseRepositorySkippedKeys)
}

export type UseRepository<R extends Repository<InstanceType<M>>, M extends typeof Model = typeof Model> = Omit<
  R,
  UseRepositorySkippedKeys
>

function getAllKeys<T extends Record<any, any>>(obj: T): Array<keyof T> {
  const keys = new Set<keyof T>()

  do {
    Object.getOwnPropertyNames(obj).forEach((key) => keys.add(key))
    Object.getOwnPropertySymbols(obj).forEach((sym) => keys.add(sym))
    obj = Object.getPrototypeOf(obj)
  } while (obj && obj !== Object.prototype)

  return Array.from(keys)
}

export function useRepositoryForDynamicContext<
  R extends Repository<InstanceType<M>>,
  M extends typeof Model = typeof Model,
>(model: M, connection: string = 'entities'): UseRepository<R> {
  const repo = getDatabaseManager().getRepository<R, M>(model, connection)
  const allRepoKeys = getAllKeys(repo)
  const result = {} as UseRepository<R>

  for (const key of allRepoKeys) {
    if (isSkippedKey(key)) {
      continue
    }
    const repoValue = repo[key]

    if (isFunction(repoValue)) {
      ;(result as any)[key as string] = repoValue.bind(repo)
      continue
    }

    Object.defineProperty(repoValue, key, {
      get(): R[typeof key] {
        return repo[key]
      },
      set(v: any) {
        repo[key] = v
      },
    })
  }

  return result
}

export const pullRepositoryGettersKeys = ['find', 'all'] satisfies Array<keyof Repository>
export const pullRepositoryKeys = [
  'save',
  'insert',
  'fresh',
  'destroy',
  'flush',
  'update',
  ...pullRepositoryGettersKeys,
] satisfies Array<keyof Repository>
export type RepositoryGettersKeys = (typeof pullRepositoryGettersKeys)[number]

export type RattusOrmInstallerOptions = {
  connection?: string
  database?: Database
  plugins?: DatabasePlugin[]
  customRepositories?: Constructor<Repository>[]
}

export function contextBootstrap(params: RattusOrmInstallerOptions, dataProvider?: DataProvider) {
  if (params.database) {
    registerCustomRepos(params.database, params.customRepositories)
    getDatabaseManager().addDatabase(params.database)
    return params.database
  }

  if (!isDataProvider(dataProvider)) {
    throw new RattusOrmError(
      'No dataProvider and mainDatabase passed. You should pass at least one of them.',
      'ContextBootstrap',
    )
  }

  const db = getDatabaseManager().createDatabase(params.connection, dataProvider)
  registerCustomRepos(db, params.customRepositories)

  if (params.plugins?.length) {
    params.plugins.forEach((plugin) => db.use(plugin))
  }

  return db
}

function registerCustomRepos(db: Database, repos: RattusOrmInstallerOptions['customRepositories'] = []) {
  for (const repo of repos) {
    db.registerCustomRepository(repo)
  }
}

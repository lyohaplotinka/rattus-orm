import { existsSync } from 'node:fs'
import * as path from 'node:path'
import { isObject, isString } from 'lodash-es'
import { TestProjectConfiguration, defineWorkspace } from 'vitest/config'
import { loadPackagesMeta } from './scripts/built/utils.mjs'
import { TestProviderConfig } from './scripts/src/types/types'

function getTestingBlocks(): TestProjectConfiguration[] {
  const configs: TestProjectConfiguration[] = []
  const metas = loadPackagesMeta()

  for (const meta of Object.values(metas)) {
    const vitestConfigPath = path.resolve(meta.path, 'vitest.config.mts')
    if (existsSync(vitestConfigPath)) {
      configs.push(vitestConfigPath)
    }

    if (isObject(meta.testProvider) && isString(meta.testProvider.path)) {
      configs.push({
        extends: './vitest.config.mts',
        test: {
          name: `${meta.code}:shared`,
        },
        resolve: {
          alias: {
            'virtual:providerFactory': (meta.testProvider as TestProviderConfig).path,
          },
        },
      })
    }
  }

  return configs
}

export default defineWorkspace(getTestingBlocks())

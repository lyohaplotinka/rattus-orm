import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import createTsupConfig from '../../tsup.config.base'

export const dirname = fileURLToPath(new URL('.', import.meta.url))

const utilsList: Record<string, string> = {
  createBasicProviderTest: './src/createBasicProviderTest.ts',
  isUnknownRecord: './src/isUnknownRecord.ts',
  pickFromClass: './src/pickFromClass.ts',
  vueComputedUtils: './src/vueComputedUtils.ts',
}

const createExportsBlock = (name: string) => ({
  [`./${name}`]: {
    import: `./dist/${name}.mjs`,
    require: `./dist/${name}.js`,
    types: `./dist/${name}.d.ts`,
  },
})

export default createTsupConfig(
  { ...utilsList, all: './src/index.ts' },
  {
    async onSuccess() {
      const packageJsonPath = resolve(dirname, 'package.json')
      const pkg = JSON.parse(await readFile(packageJsonPath, 'utf-8'))
      pkg.main = './dist/all.js'
      pkg.browser = './dist/all.mjs'
      pkg.module = './dist/all.mjs'
      pkg.types = './dist/all.d.ts'

      pkg.exports = {
        '.': {
          import: pkg.module,
          require: pkg.main,
          types: pkg.types,
        },
      }

      for (const util in utilsList) {
        Object.assign(pkg.exports, createExportsBlock(util))
      }

      await writeFile(packageJsonPath, JSON.stringify(pkg, null, 2), 'utf-8')
    },
    external: ['vue'],
  },
)

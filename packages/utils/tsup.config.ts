import { writeFile } from 'node:fs/promises'

import createTsupConfig from '../../tsup.config.base'
import packageJson from './package.json'

const pkg = packageJson as Record<string, any>

const utilsList: Record<string, string> = {
  createBasicProviderTest: './src/createBasicProviderTest.ts',
  isUnknownRecord: './src/isUnknownRecord.ts',
  pickFromClass: './src/pickFromClass.ts',
  vueComputedUtils: './src/vueComputedUtils.ts',
  sharedTypes: './src/types.ts',

  all: './src/index.ts',
}

const createExportsBlock = (name: string) => ({
  [`./${name}`]: {
    import: `./dist/${name}.mjs`,
    require: `./dist/${name}.js`,
    types: `./dist/${name}.d.ts`,
  },
})

export default createTsupConfig(
  { ...utilsList },
  {
    async onSuccess() {
      pkg.main = './dist/all.js'
      pkg.browser = './dist/all.mjs'
      pkg.module = './dist/all.mjs'
      pkg.types = './dist/all.d.ts'

      pkg.exports = {}

      for (const util in utilsList) {
        Object.assign(pkg.exports, createExportsBlock(util))
      }

      await writeFile('./package.json', JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
    },
    splitting: true,
  },
)
